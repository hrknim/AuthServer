// /api/auth/logout-device/route.ts
import { NextResponse } from "next/server";
import { AuthLogout } from '@/lib/auth';

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

// 1. OPTIONS 요청 처리 (Preflight 해결)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  const { sessionId } = await req.json();
  const result = await AuthLogout(sessionId);

  const response = result 
    ? NextResponse.json(
      { message: "로그아웃 성공" }, 
      { headers: corsHeaders }
    )
    : NextResponse.json({ error: "권한 없음" }, { headers: corsHeaders, status: 401 });

  return response;
}
