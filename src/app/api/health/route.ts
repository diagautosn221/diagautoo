import { NextResponse } from "next/server";
import { getBackendHealthFromDb } from "@/lib/db/diagauto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  try {
    return NextResponse.json({ ok: true, source: "sqlite", ...getBackendHealthFromDb() });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        source: "sqlite",
        checkedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : "backend health unavailable",
      },
      { status: 503 }
    );
  }
}
