import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/getSession";
import {
  createInstallationInDb,
  getRecentInstallationsFromDb,
  type InstallationPayload,
} from "@/lib/db/diagauto";
import { installationPayloadSchema } from "@/lib/validation/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (session.role === "client") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return NextResponse.json({ installations: getRecentInstallationsFromDb(10) });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (session.role === "client") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = installationPayloadSchema.parse(raw);
  if (!parsed.ok) {
    return NextResponse.json(
      { error: "Validation échouée.", fieldErrors: parsed.errors },
      { status: 400 }
    );
  }

  // Cross-field semantics: must have either clientId OR newClient.
  const hasClient = parsed.value.clientId !== "" || parsed.value.newClient !== null;
  const hasVehicle = parsed.value.vehicleId !== "" || parsed.value.newVehicle !== null;
  if (!hasClient) {
    return NextResponse.json(
      { error: "Indiquez un client existant ou créez-en un nouveau.", fieldErrors: { newClient: "Requis" } },
      { status: 400 }
    );
  }
  if (!hasVehicle) {
    return NextResponse.json(
      { error: "Indiquez un véhicule existant ou créez-en un nouveau.", fieldErrors: { newVehicle: "Requis" } },
      { status: 400 }
    );
  }

  const payload: InstallationPayload = {
    clientId: parsed.value.clientId || null,
    newClient: parsed.value.newClient ?? undefined,
    vehicleId: parsed.value.vehicleId || null,
    newVehicle: parsed.value.newVehicle ?? undefined,
    dongleSerial: parsed.value.dongleSerial,
    technicianNote: parsed.value.technicianNote || undefined,
    technicianId: `${session.role}:${session.userId}`,
  };

  try {
    const result = createInstallationInDb(payload);
    return NextResponse.json(
      {
        ok: true,
        message: "Installation enregistrée. Communiquez les identifiants au client.",
        result,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Installation impossible." },
      { status: 400 }
    );
  }
}
