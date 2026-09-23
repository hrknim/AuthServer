import { NextResponse } from 'next/server';
import { AuthSignup, CheckSystemLock } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, handle, password } = await req.json();

    // 0. 보안
    const system = await CheckSystemLock();
    if (system.isRegistrationClosed) {
      return NextResponse.json({ message: "Emergency Lock Active" }, { status: 503 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0];
    const acceptLanguage = req.headers.get('accept-language');

    // 1. 필수값 존재 확인
    if (!email || !handle || !password || !ip || !acceptLanguage) {
      return NextResponse.json({ message: '모든 필드를 입력해주세요.' }, { status: 400 });
    }

    // 2. 이메일 형식 및 길이 검증 (RFC 표준 근거)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 100) {
      return NextResponse.json({ message: '유효한 이메일 형식이 아니거나 너무 깁니다. (최대 100자)' }, { status: 400 });
    }

    // 3. 핸들(@) 규칙 검증
    // 영문 소문자와 숫자만 허용 (URL 일관성을 위해 소문자 권장), 3~20자
    const handleRegex = /^[a-z0-9_]{3,20}$/;
    const reservedHandles = ['admin', 'system', 'root', 'manager', 'official'];

    if (!handleRegex.test(handle)) {
      return NextResponse.json({
        message: '핸들은 영문 소문자, 숫자, 언더바(_) 조합으로 3~20자여야 합니다.'
      }, { status: 400 });
    }

    if (reservedHandles.includes(handle.toLowerCase())) {
      return NextResponse.json({ message: '사용할 수 없는 핸들 이름입니다.' }, { status: 400 });
    }

    // 4. 비밀번호 규칙 검증 (8~32자)
    if (password.length < 8 || password.length > 32) {
      return NextResponse.json({ message: '비밀번호는 8자 이상 32자 이하로 설정해주세요.' }, { status: 400 });
    }

    // 5. DB 등록 시도
    const result = await AuthSignup(email, handle, password, ip, acceptLanguage);

    if (result.success) {
      return NextResponse.json({ message: '회원가입이 완료되었습니다.' }, { status: 201 });
    } else {
      return NextResponse.json({ message: result.message }, { status: 409 });
    }
  } catch (error) {
    console.error('Signup API Error:', error);
    return NextResponse.json({ message: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
