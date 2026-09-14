// app/api/admin/sanctions/route.ts
import { NextResponse } from "next/server";
import { AdminUnbanUser } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const { targetId, targetIp } = body;
  const adminIp = request.headers.get("x-forwarded-for") || "127.0.0.1";

  try {
    const result = await AdminUnbanUser({targetId, targetIp, adminIp});

    return NextResponse.json({});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "제재 등록 실패" }, { status: 500 });
  }
}