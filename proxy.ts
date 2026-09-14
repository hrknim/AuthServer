// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CheckSystemLock } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const start = Date.now();
  const { pathname } = request.nextUrl;

  // 수정/가입 관련 경로 리스트
  let response = NextResponse.next();

  const isRead = pathname.startsWith('/api/user');
  const isRegestration = pathname.startsWith('/api/login') || pathname.startsWith('/api/signup');

  try {
    if (isRead) {
      const result = await CheckSystemLock();

      // 만약 Emergency 플래그가 True라면:
      if (result.isReadOnlyMode) {
        response = NextResponse.json({ message: "Emergency Lock Active" }, { status: 503 });
      }
    }

    if (isRegestration) {
      // 여기서 DB를 조회하거나, 성능을 위해 Redis에 저장된 플래그를 확인합니다.
      const result = await CheckSystemLock();

      // 만약 Emergency 플래그가 True라면:
      if (result.isRegistrationClosed) {
        response = NextResponse.json({ message: "Emergency Lock Active" }, { status: 503 });
      }
    }

    const duration = Date.now() - start;

    // 비동기로 로그 저장 (메인 응답 속도에 영향을 주지 않도록 함)
    const logData = {
      // 접속자 기본 정보
      timestamp: start,
      ip: request.headers.get("x-forwarded-for"),
      userAgent: request.headers.get("user-agent") || "unknown",
      countryCode: '',

      // 요청 정보
      statusCode: response.status,
      method: request.method,
      path: request.nextUrl.pathname,
      //payload: (request.method == 'POST') ? await request.clone().json() : null,

      // 텔레메트리 및 통계 분석
      responseTime: duration,
      referer: request.headers.get('referer'),
      language: request.headers.get('accept-language')?.split(',')[0],
      //cookie: request.headers.get('cookie'), // 세션 정보 등
    };

    // 실제 운영 환경에서는 이를 DB가 아닌 로그 수집 서버나 메시지 큐로 보냅니다.
    // saveLogToAnalytics(logData); 
    console.log(`${logData.statusCode == 200 ? '✅' : '❌'} ${logData.statusCode}: ${logData.path} [${logData.ip}]`)
  } catch (e) {
    console.log(e)
  }

  return response;
}

// 중요: 미들웨어가 실행될 경로를 지정합니다.
export const config = {
  matcher: [
    // 모든 경로에서 실행하되, 정적 파일이나 이미지 등은 제외합니다.
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
