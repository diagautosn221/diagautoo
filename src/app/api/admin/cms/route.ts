import { NextResponse } from "next/server";
import { getAdminCmsFromDb, runAdminCmsActionInDb, type AdminCmsActionPayload } from "@/lib/db/diagauto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  try {
    return NextResponse.json({ cms: getAdminCmsFromDb(), source: "sqlite" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "admin cms unavailable" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as AdminCmsActionPayload;
    return NextResponse.json(runAdminCmsActionInDb(payload));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "cms action failed" },
      { status: 400 }
    );
  }
}
