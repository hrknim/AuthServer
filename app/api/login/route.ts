import { NextResponse } from "next/server";
import { AuthLogin } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const userAgent = req.headers.get("user-agent") || '';
    const ipAddress = req.headers.get("x-forwarded-for") || 'unknown';

    const result = await AuthLogin(email, password, ipAddress, userAgent);
    if (result.success) {
      return NextResponse.json({ message: "로그인 성공" });
    }
  } catch (error) {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
