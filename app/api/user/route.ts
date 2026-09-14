// /api/auth/logout-device/route.ts
import { NextResponse } from "next/server";
import { GetSessionUser } from '@/lib/auth';
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const session = await GetSessionUser();

  const response = session
    ? NextResponse.json({ result: session?.user })
    : NextResponse.json({ error: "권한 없음" }, { status: 401 });

  // CORS 및 Credentials 허용 헤더 추가
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3001');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}
