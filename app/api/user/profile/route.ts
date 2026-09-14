import { NextResponse } from "next/server"
import { UpdateUserProfile } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { email, handle, displayName, bio, locale } = await req.json()

    const updatedUser = await UpdateUserProfile(email, handle, displayName, bio, locale);
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
