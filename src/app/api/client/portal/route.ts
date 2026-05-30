import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/getSession";
import {
  getClientPortalFromDb,
  runClientPortalActionInDb,
  type ClientPortalActionPayload,
} from "@/lib/db/diagauto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function resolveClientId(request: Request) {
  const session = await getSession();
  if (!session) {
    return { error: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  }

  if (session.role === "client") {
    if (!session.clientId) {
      return { error: NextResponse.json({ error: "missing client profile" }, { status: 400 }) };
    }
    return { clientId: session.clientId };
  }

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");
  if (!clientId) {
    return { error: NextResponse.json({ error: "clientId required for atelier/admin" }, { status: 400 }) };
  }
  return { clientId };
}

export async function GET(request: Request) {
  try {
    const resolved = await resolveClientId(request);
    if ("error" in resolved) return resolved.error;
    return NextResponse.json({ portal: getClientPortalFromDb(resolved.clientId), source: "sqlite" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "client portal unavailable" },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const resolved = await resolveClientId(request);
    if ("error" in resolved) return resolved.error;
    const payload = (await request.json().catch(() => ({}))) as ClientPortalActionPayload;
    return NextResponse.json(runClientPortalActionInDb(resolved.clientId, payload));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "client action failed" },
      { status: 400 }
    );
  }
}
