import { NextResponse } from "next/server";
import { createDiagnosticInDb, type DiagnosticPayload } from "@/lib/db/diagauto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as DiagnosticPayload;
  return NextResponse.json(createDiagnosticInDb(payload), { status: 201 });
}
