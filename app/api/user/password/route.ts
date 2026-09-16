import { NextResponse } from "next/server"
import { UpdatePassword } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword } = await req.json()
    const result = await UpdatePassword(currentPassword, newPassword);

    if (result.success) {
      return NextResponse.json({ message: result.message });
    } else {
      return NextResponse.json({ message: result.message }, { status: 400 })
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
