import { NextResponse } from "next/server";
import { AuthWithdraw } from '@/lib/auth';

export async function POST() {
  const result = await AuthWithdraw();

  if (result) {
    return NextResponse.json({ message: "탈퇴가 완료되었습니다." });
  } else {
    return NextResponse.json({ message: "탈퇴 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
