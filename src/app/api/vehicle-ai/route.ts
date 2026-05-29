import { NextResponse } from "next/server";
import { analyzeVehicleEvidence, type VehicleAiPayload } from "@/lib/vehicle-ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as VehicleAiPayload;
    const result = analyzeVehicleEvidence(payload);
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "vehicle ai analysis failed" },
      { status: 400 }
    );
  }
}
