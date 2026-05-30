import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/getSession";
import {
  getCarnetDashboardsForClientFromDb,
  getCarnetDashboardForVehicleFromDb,
} from "@/lib/db/diagauto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/carnet/dashboard
 * GET /api/carnet/dashboard?vehicleId=v-001
 *
 * Returns the Tesla-style cockpit data for the authenticated client.
 * Without vehicleId → all vehicles owned by the client.
 * With vehicleId → the single vehicle if it belongs to the client.
 *
 * Atelier/admin roles may pass vehicleId to inspect any vehicle.
 */
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get("vehicleId");

  if (vehicleId) {
    const dashboard = getCarnetDashboardForVehicleFromDb(vehicleId);
    if (!dashboard) {
      return NextResponse.json({ error: "vehicle not found" }, { status: 404 });
    }

    // Ownership check for client role
    if (session.role === "client") {
      const own = getCarnetDashboardsForClientFromDb(session.clientId ?? "");
      const owned = own.some((d) => d.vehicle.id === vehicleId);
      if (!owned) {
        return NextResponse.json({ error: "forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json({ dashboards: [dashboard] });
  }

  if (session.role === "client") {
    if (!session.clientId) {
      return NextResponse.json({ error: "no clientId on session" }, { status: 400 });
    }
    const dashboards = getCarnetDashboardsForClientFromDb(session.clientId);
    return NextResponse.json({ dashboards });
  }

  // atelier / admin without vehicleId: return empty — they should select.
  return NextResponse.json({ dashboards: [] });
}
