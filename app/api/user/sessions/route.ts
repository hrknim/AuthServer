import { NextResponse } from "next/server";
import { GetUserSessions } from "@/lib/auth"

export async function GET() {
  const result = await GetUserSessions();
  return NextResponse.json(result);
}
