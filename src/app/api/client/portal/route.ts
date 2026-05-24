import { NextResponse } from "next/server";
import {
  getClientPortalFromDb,
  runClientPortalActionInDb,
  type ClientPortalActionPayload,
} from "@/lib/db/diagauto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientId(request: Request) {
  const { searchParams } = new URL(request.url);
  return searchParams.get("clientId") || "c-001";
}

export function GET(request: Request) {
  try {
    return NextResponse.json({ portal: getClientPortalFromDb(getClientId(request)), source: "sqlite" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "client portal unavailable" },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const clientId = getClientId(request);
    const payload = (await request.json().catch(() => ({}))) as ClientPortalActionPayload;
    return NextResponse.json(runClientPortalActionInDb(clientId, payload));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "client action failed" },
      { status: 400 }
    );
  }
}
