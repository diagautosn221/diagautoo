import { NextResponse } from "next/server";
import { ingestTelemetryInDb, type TelemetryPayload } from "@/lib/db/diagauto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as TelemetryPayload;
  return NextResponse.json(ingestTelemetryInDb(payload), { status: 201 });
}
