// app/api/admin/sanctions/route.ts
import { NextResponse } from "next/server";
import { UpdateSystemSettings } from '@/lib/auth';

export async function POST(request: Request) {
  const { key, value } = await request.json();

  try {
    const result = await UpdateSystemSettings(key, value);

    if (result) {
      return NextResponse.json({});
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "제재 등록 실패" }, { status: 500 });
  }
}
