import { NextResponse } from "next/server";
import { ingestTelemetryInDb, type TelemetryPayload } from "@/lib/db/diagauto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as TelemetryPayload;
    return NextResponse.json(ingestTelemetryInDb(payload), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "telemetry ingest failed" },
      { status: 400 }
    );
  }
}
