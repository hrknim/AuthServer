import { NextResponse } from "next/server";
import { GetSessionUserData } from '@/lib/auth';

const connectionString = process.env.WEB_URL || "http://localhost:80";

export async function GET(req: Request) {
  try {
    const session = await GetSessionUserData();
    const response = session
      ? NextResponse.json({ result: session?.user || '' })
      : NextResponse.json({ error: "권한 없음" }, { status: 401 });

    // CORS 및 Credentials 허용 헤더 추가
    response.headers.set('Access-Control-Allow-Origin', connectionString);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  } catch (e) {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
