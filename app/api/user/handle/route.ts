import { NextResponse } from "next/server";
import { GetUserData, CheckSystemLock } from '@/lib/auth';

const connectionString = process.env.WEB_URL || "http://localhost:80";

export async function POST(req: Request) {
  try {
    const { handle } = await req.json()

    const system = await CheckSystemLock();
    if (system.isReadOnlyMode) {
      return NextResponse.json({ message: "Emergency Lock Active" }, { status: 503 });
    }

    const session = await GetUserData(handle);
    const response = session
      ? NextResponse.json({ result: session })
      : NextResponse.json({ error: "권한 없음" }, { status: 401 });

    return response;
  } catch (e) {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
