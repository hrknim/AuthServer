import bcrypt from 'bcrypt';
import { cookies } from "next/headers";
//import geoip from 'geoip-lite';
import { adapter } from '@/lib/prisma'
import { PrismaClient } from '@prisma/client';

const cookieUrl = process.env.COOKIE_URL || "localhost";
const prisma = new PrismaClient({ adapter });

function makePageList(currentPage: number, totalPages: number) {
  const delta = 2;
  let startPage = Math.max(1, currentPage - delta);
  let endPage = Math.min(totalPages, currentPage + delta);

  if (startPage === 1) {
    // 1. 시작 부분이 1이면 끝 부분을 뒤로 밀어줌 (5개 유지)
    endPage = Math.min(5, totalPages);
  } else if (endPage === totalPages) {
    //2. 끝 부분이 마지막 페이지면 시작 부분을 앞으로 당겨줌 (5개 유지)
    startPage = Math.max(1, totalPages - 4);
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  return pages;
}

function getClientLocale(acceptLanguage: string): string {
  // "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7" -> "ko" 추출
  const primaryLocale = acceptLanguage.split(',')[0].split('-')[0];
  return primaryLocale || 'en';
}

function getCountryCode(ip: string): string {
  // 로컬 환경(::1, 127.0.0.1) 대응
  if (true || ip === '::1' || ip.startsWith('127.0.') || ip.startsWith('192.168.')) {
    return 'KR'; // 개발 중 테스트용 기본값
  }
  //const geo = geoip.lookup(ip);
  //return geo ? geo.country : 'Unknown'; // 찾을 수 없으면 'UN' (Unknown)
}

export async function AuthSignup(email: string, handle: string, password: string, ip: string, acceptLanguage: string) {
  try {
    // 1. 중복 확인 (이메일 & 핸들)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { handle: handle }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return { success: false, message: '이미 사용 중인 이메일입니다.' };
      }
      if (existingUser.handle === handle) {
        return { success: false, message: '이미 사용 중인 핸들입니다.' };
      }
    }

    // 2. 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. DB에 유저 생성
    // 스키마에 정의된 필수 필드(locale 등)와 자동 생성 필드(displayName) 처리
    const newUser = await prisma.user.create({
      data: {
        handle,
        displayName: handle, // 가입 시에는 핸들을 표시 이름으로 기본 설정
        email,
        password: hashedPassword,
        role: 'USER',
        regIp: ip,
        lastIp: ip,
        countryCode: getCountryCode(ip),
        status: 'ACTIVE',
        isEmailVerified: false,
        locale: getClientLocale(acceptLanguage), // 기본 언어 설정 (나중에 헤더에서 추출 가능)
      }
    });

    return { success: true, userId: newUser.id };
  } catch (error) {
    return { success: false, message: '데이터베이스 저장 중 오류가 발생했습니다.' };
  }
}

export async function AuthLogin(email: string, password: string, ip: string, userAgent: string) {
  try {
    // 1. 유저 검증
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return false;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return false;

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;
    if (sessionId) { await AuthLogout(''); }

    // 2. 세션 토큰 생성 (랜덤 문자열)
    const sessionToken = crypto.randomUUID(); // 더 복잡하게 변경
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30일

    // 3. DB에 세션 저장
    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires,
        userAgent: userAgent,
        ipAddress: ip,
      },
    });

    // 스탯 업데이트 (이동)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        status: 'ACTIVE',
        lastIp: ip,
      }
    });

    // 4. 쿠키에 세션 ID 심기 (HttpOnly로 보안 강화)
    cookieStore.set("session_id", sessionToken, {
      domain: cookieUrl,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires,
      path: "/",
    });

    cookieStore.set("locale", user.locale, {
      domain: cookieUrl,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires,
      path: "/",
    });

    return true;
  } catch (error) {
    return false;
  }
}

async function UpdateSessionTime(id: string) {
  try {
    // 마지막 활동 시간 업데이트 (Batch 처리가 좋지만 일단 직접)
    await prisma.session.update({
      where: { id },
      data: { lastActive: new Date() }
    });
  } catch (error) {

  }
}

export async function GetSessionUserData() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;
    if (!sessionId) return null;

    const session = await prisma.session.findUnique({
      where: {
        sessionToken: sessionId,
        expires: { gt: new Date() }
      },
      select: {
        user: {
          select: {
            id: true,
            email: true,
            handle: true,
            displayName: true,
            role: true,
            bio: true,
            avatarUrl: true,
            locale: true,
          }
        }
      }
    });
    if (!session) return null;

    return session;
  } catch (error) {
    return null;
  }
}

export async function AuthLogout(id: string) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;
    if (!sessionId) return false;

    const session = await prisma.session.findUnique({
      where: {
        sessionToken: sessionId,
        expires: { gt: new Date() }
      },
      select: {
        sessionToken: true,
        userId: true,
        user: {
          select: { role: true }
        }
      }
    });
    if (!session) return false;

    // 현재 세션 삭제
    if (id) {
      // 본인 확인 (현재 세션 유저의 데이터인지)
      const sessionToDelete = await prisma.session.findUnique({
        where: {
          id,
          userId: session.userId
        },
        include: { user: true }
      });
      if (!sessionToDelete && session.user.role != 'ADMIN') return false;

      // 삭제 실행
      await prisma.session.delete({
        where: { id }
      });

    } else {
      await prisma.session.deleteMany({
        where: {
          sessionToken: session.sessionToken,
          userId: session.userId,
        }
      });
    }

    cookieStore.delete({
      name: "session_id",
      domain: cookieUrl,
      path: "/",
    });

    cookieStore.delete({
      name: "locale",
      domain: cookieUrl,
      path: "/",
    });

    return true;
  } catch (error) {
    return false;
  }
}

export async function AuthWithdraw() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;
    if (!sessionId) return false;

    const session = await prisma.session.findUnique({
      where: {
        sessionToken: sessionId,
        expires: { gt: new Date() }
      },
      select: {
        userId: true
      }
    });
    if (!session) return false;

    const userId = session.userId;

    // 2. 트랜잭션 실행 (모든 과정이 성공해야만 반영됨)
    await prisma.$transaction([
      // A. 해당 유저의 모든 세션 삭제 (즉시 로그아웃)
      prisma.session.deleteMany({ where: { userId } }),

      // B. 소셜 연동 정보 삭제
      prisma.thirdparty.deleteMany({ where: { userId } }),

      // C. 유저 삭제 (또는 상태값 변경)
      //prisma.user.delete({ where: { id: userId } })
      prisma.user.update({
        where: { id: userId },
        data: { status: 'DELETED' }
      })
    ]);

    // 3. 브라우저 쿠키 삭제
    cookieStore.delete("session_id");
    return true;
  } catch (error) {
    return false;
  }
}

export async function GetUserProfile(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id },
    });
  } catch (error) {
    return null;
  }
}

// admin
export async function GetUserProfiles(page: number, itemsPerPage: number = 100) {
  try {
    // 1. 전체 카운트와 데이터를 동시에 조회
    const [totalCount, users] = await prisma.$transaction([
      prisma.user.count(),
      prisma.user.findMany({
        skip: (page - 1) * itemsPerPage,
        take: itemsPerPage,
        select: {
          id: true,
          handle: true,
          displayName: true,
          email: true,
          role: true,
          status: true,
          lastIp: true,
          createdAt: true,
          updatedAt: true,
          isEmailVerified: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      totalCount,
      totalPages: Math.ceil(totalCount / itemsPerPage),
      results: users,
      pages: makePageList(page, Math.ceil(totalCount / itemsPerPage)),
    };
  } catch (error) {
    return { totalCount: 0, totalPages: 0, results: [] };
  }
}

export async function UpdateUserProfile(email: string, handle: string, displayName: string, bio: string, locale: string) {
  try {
    const cookieStore = await cookies();
    const currentToken = cookieStore.get("session_id")?.value || '';
    if (!currentToken) return { success: false, message: '세션 오류.' };

    // 1. 현재 세션을 통해 유저 확인
    const currentSession = await prisma.session.findUnique({
      where: { sessionToken: currentToken },
      select: {
        user: {
          select: {
            handle: true
          }
        },
        userId: true,
      }
    });
    if (!currentSession) return { success: false, message: '세션 오류.' };

    // 1. 핸들 형식 및 중복 검사
    if (handle !== currentSession.user.handle) {
      const existingUser = await prisma.user.findUnique({
        where: { handle }
      })
      if (existingUser) {
        return { success: false, message: '이미 사용 중인 핸들입니다.' };
      }
    }

    // 2. DB 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: currentSession.userId },
      data: {
        email,
        handle,
        displayName,
        bio,
        locale,
      }
    })

    cookieStore.set("locale", locale, {
      domain: cookieUrl,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      path: "/",
    });

    return {
      success: true,
      user: {
        handle: updatedUser.handle,
        displayName: updatedUser.displayName,
        bio: updatedUser.bio,
        locale: updatedUser.locale
      }
    };
  } catch (error) {
    console.error('Database Update Error:', error);
    return { success: false, message: '데이터베이스 저장 중 오류가 발생했습니다.' };
  }
}

export async function AdminUpdateUserProfile(email: string, handle: string, displayName: string, bio: string, role: string, uuid: string, ip: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      const cookieStore = await cookies();
      const currentToken = cookieStore.get("session_id")?.value || '';
      if (!currentToken) return { success: false, message: '세션 오류.' };

      // 1. 어드민 권한 확인
      const session = await tx.session.findUnique({
        where: { sessionToken: currentToken },
        select: {
          user: {
            select: {
              id: true,
              role: true
            }
          },
        }
      });
      if (!session || session.user.role != 'ADMIN') return { success: false, message: '세션 오류.' };

      const userhandle = await tx.user.findUnique({
        where: { id: uuid },
        select: {
          handle: true
        }
      });
      if (!userhandle) return { success: false, message: '세션 오류.' };

      // 1. 핸들 형식 및 중복 검사
      if (handle !== userhandle.handle) {
        const existingUser = await tx.user.findUnique({
          where: { handle }
        })
        if (existingUser) {
          return { success: false, message: '이미 사용 중인 핸들입니다.' };
        }
      }

      const typeMap: Record<string, any> = {
        USER: 'USER',
        MODERATOR: 'MODERATOR',
        ADMIN: 'ADMIN',
      };

      // 2. DB 업데이트
      const updatedUser = await tx.user.update({
        where: { id: uuid },
        data: {
          email,
          handle,
          displayName,
          bio,
          role: typeMap[role],
        }
      })

      return {
        success: true,
        user: {
          handle: updatedUser.handle,
          displayName: updatedUser.displayName,
          bio: updatedUser.bio,
          locale: updatedUser.locale
        }
      };
    });
  } catch (error) {
    console.error('Database Update Error:', error);
    return { success: false, message: '데이터베이스 저장 중 오류가 발생했습니다.' };
  }
}

export async function UpdatePassword(currentPassword: string, newPassword: string) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;
    if (!sessionId) return { success: false, message: '사용자를 찾을 수 없습니다.' };

    const session = await prisma.session.findUnique({
      where: {
        sessionToken: sessionId,
        expires: { gt: new Date() }
      },
      select: {
        user: {
          select: {
            password: true,
          }
        },
        userId: true,
      }
    });
    if (!session || !session.user.password) return { success: false, message: '사용자를 찾을 수 없습니다.' };

    // 2. 현재 비밀번호 검증
    const isMatch = await bcrypt.compare(currentPassword, session.user.password)
    if (!isMatch) {
      return { success: false, message: '현재 비밀번호가 일치하지 않습니다.' };
    }

    // 3. 새 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // 4. DB 업데이트
    await prisma.user.update({
      where: { id: session.userId },
      data: { password: hashedPassword }
    });

    return { success: true, message: '비밀번호가 성공적으로 변경되었습니다.' };
  } catch (error) {
    console.error('Database Update Error:', error);
    return { success: false, message: '데이터베이스 저장 중 오류가 발생했습니다.' };
  }
}

export async function GetUserSessions(uuid: string = '') {
  try {
    let currentToken = '';
    async function fromCookie() {
      const cookieStore = await cookies();
      currentToken = cookieStore.get("session_id")?.value || '';
      if (!currentToken) return null;

      // 1. 현재 세션을 통해 유저 확인
      const currentSession = await prisma.session.findUnique({
        where: { sessionToken: currentToken },
        select: { userId: true }
      });
      if (!currentSession) return null;

      return currentSession.userId;
    }

    const userId = (uuid) ? uuid : await fromCookie();
    if (!userId) return null;

    // 2. 해당 유저의 모든 활성 세션 조회
    const sessions = await prisma.session.findMany({
      where: {
        userId,
        expires: { gt: new Date() } // 만료 안 된 것만
      },
      orderBy: { lastActive: 'desc' }
    });

    // 3. 현재 접속 중인 세션 표시 플래그 추가
    const formattedSessions = sessions.map((s: any) => ({
      id: s.id,
      userAgent: s.userAgent,
      ipAddress: s.ipAddress,
      lastActive: s.lastActive,
      isCurrent: s.sessionToken === currentToken
    }));

    return formattedSessions;
  } catch (error) {
    console.error('Database Update Error:', error);
    return null;
  }
}

export async function CheckSystemLock() {
  try {
    // 시스템 설정 테이블에서 현재 상태 조회 (첫 번째 레코드)
    const settings = await prisma.system_settings.findFirst({
      select: {
        isReadOnlyMode: true,        // 전체 읽기 전용 (편집 차단)
        isRegistrationClosed: true,  // 가입 중단
      }
    });

    return {
      isReadOnlyMode: settings?.isReadOnlyMode ?? false,
      isRegistrationClosed: settings?.isRegistrationClosed ?? false,
    };
  }
  catch (error) {
    return {
      isReadOnlyMode: false,
      isRegistrationClosed: false,
    };
  }
}

export async function UpdateSystemSettings(key: "isReadOnlyMode" | "isRegistrationClosed", value: boolean) {
  try {
    const cookieStore = await cookies();
    const currentToken = cookieStore.get("session_id")?.value || '';
    if (!currentToken) return false;

    // 1. 어드민 권한 확인
    const session = await prisma.session.findUnique({
      where: { sessionToken: currentToken },
      select: {
        user: {
          select: {
            role: true
          }
        },
      }
    });
    if (!session || session.user.role !== 'ADMIN') return false;

    await prisma.system_settings.upsert({
      where: { id: "SYSTEM_CONFIG" },
      update: { [key]: value },
      create: {
        id: "SYSTEM_CONFIG",
        isReadOnlyMode: key === "isReadOnlyMode" ? value : false,
        isRegistrationClosed: key === "isRegistrationClosed" ? value : false,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}

export async function main() {
  try {
    // 초기 설정
    await prisma.system_settings.upsert({
      where: { id: "SYSTEM_CONFIG" },
      update: {},
      create: {
        id: "SYSTEM_CONFIG",
        isReadOnlyMode: false,
        isRegistrationClosed: false,
      },
    })

    // 초기 어드민 계정
    const hashedPassword = await bcrypt.hash('admin', 10);
    await prisma.user.upsert({
      where: { id: "00000000-0000-4000-0000-000000000000" },
      update: {},
      create: {
        id: "00000000-0000-4000-0000-000000000000",
        handle: 'admin',
        displayName: 'admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        role: 'ADMIN',
        regIp: 'localhost',
        lastIp: 'localhost',
        countryCode: getCountryCode('localhost'),
        status: 'ACTIVE',
        isEmailVerified: false,
        locale: getClientLocale('ko'),
      }
    });

  } catch (error) {
  }
}
