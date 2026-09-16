import { NextResponse } from "next/server"
import { AdminUpdateUserProfile } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { email, handle, displayName, bio, role, uuid } = await req.json()
    const adminIp = req.headers.get("x-forwarded-for") || "";

    const updatedUser = await AdminUpdateUserProfile(email, handle, displayName, bio, role, uuid, adminIp);
    if (updatedUser.success) {
      return NextResponse.json({ message: "성공", user: updatedUser.user })
    } else {
      return NextResponse.json({ message: updatedUser.message }, { status: 400 })
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
