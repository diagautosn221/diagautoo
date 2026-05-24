import { NextResponse } from "next/server";
import { runGarageActionInDb, type GarageActionPayload } from "@/lib/db/diagauto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as GarageActionPayload;
    return NextResponse.json(runGarageActionInDb(payload));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "action failed" },
      { status: 400 }
    );
  }
}
