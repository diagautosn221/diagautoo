import { NextResponse } from "next/server";
import { getGarageOverview } from "@/lib/data/garage";
import { getGarageOverviewFromDb } from "@/lib/db/diagauto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET() {
  try {
    return NextResponse.json({ ...getGarageOverviewFromDb(), source: "sqlite" });
  } catch {
    return NextResponse.json({ ...getGarageOverview(), source: "fallback" });
  }
}
