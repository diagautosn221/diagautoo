const baseUrl = process.env.DIAGAUTO_BASE_URL || "http://127.0.0.1:3000";
const mutationEnabled = process.argv.includes("--write") || process.env.DIAGAUTO_MUTATION_SMOKE === "1";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readJson(response, label) {
  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`${label} did not return JSON: ${text.slice(0, 180)}`);
  }

  if (!response.ok) {
    throw new Error(`${label} failed with ${response.status}: ${JSON.stringify(json)}`);
  }

  return json;
}

async function get(path, label) {
  return readJson(await fetch(`${baseUrl}${path}`), label);
}

async function post(path, body, label) {
  return readJson(
    await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
    label
  );
}

const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(8, 14);
const report = {};

const health = await get("/api/health", "backend health");
assert(health.ok === true, "backend health must be ok");
assert(health.source === "sqlite", "backend health must use sqlite");
assert(health.counts?.clients >= 1, "backend health has no clients");
assert(health.counts?.vehicles >= 1, "backend health has no vehicles");
assert(health.counts?.connectedDevices >= 1, "backend health has no active iot devices");
report.health = {
  source: health.source,
  storage: health.storage,
  integrity: health.integrity,
  clients: health.counts.clients,
  vehicles: health.counts.vehicles,
  connectedDevices: health.counts.connectedDevices,
};

const overview = await get("/api/garage/overview", "garage overview");
assert(overview.source === "sqlite", "garage overview must use sqlite, not fallback");
assert(overview.summary?.clients >= 1, "garage overview has no clients");
assert(overview.summary?.vehicles >= 1, "garage overview has no vehicles");
assert(Array.isArray(overview.alerts), "garage overview alerts must be an array");
report.overview = {
  source: overview.source,
  clients: overview.summary.clients,
  vehicles: overview.summary.vehicles,
  alerts: overview.alerts.length,
};

const portal = await get("/api/client/portal?clientId=c-001", "client portal");
assert(portal.source === "sqlite", "client portal must use sqlite");
assert(portal.portal?.vehicles?.length >= 1, "client portal has no vehicle");

report.portal = {
  source: portal.source,
  client: portal.portal.client?.full_name,
  vehicles: portal.portal.vehicles.length,
};

const cms = await get("/api/admin/cms", "admin cms");
assert(cms.source === "sqlite", "admin cms must use sqlite");
assert(cms.cms?.services?.length >= 1, "admin cms has no services");
assert(cms.cms?.users?.length >= 1, "admin cms has no users");

report.cms = {
  services: cms.cms.services.length,
  users: cms.cms.users.length,
  auditEvents: cms.cms.auditEvents.length,
};

const vehicleAi = await post(
  "/api/vehicle-ai",
  {
    notes: "Toyota Prado blanc plaque DK 4582 AA fumee moteur et vidange proche",
    plate: "DK 4582 AA",
    mileage: 124800,
    fileName: "toyota-prado-dakar.jpg",
  },
  "vehicle ai"
);
assert(vehicleAi.result?.likelyVehicle, "vehicle ai did not return likely vehicle");
assert(vehicleAi.result?.confidence >= 50, "vehicle ai confidence is unexpectedly low");
assert(Array.isArray(vehicleAi.result?.checklist), "vehicle ai checklist must be an array");
report.vehicleAi = {
  likelyVehicle: vehicleAi.result.likelyVehicle,
  confidence: vehicleAi.result.confidence,
  riskLevel: vehicleAi.result.riskLevel,
};

if (mutationEnabled) {
  const telemetry = await post(
    "/api/iot/telemetry",
    {
      deviceSerial: "DASN-IOT-0421",
      metric: "Pression huile",
      value: "1.9 bar",
      status: "urgent",
    },
    "iot telemetry"
  );
  assert(telemetry.event?.metric === "Pression huile", "telemetry event metric mismatch");
  assert(telemetry.overview?.summary?.connectedDevices >= 1, "telemetry did not return garage overview");
  report.telemetry = {
    id: telemetry.event.id,
    vehicle: telemetry.event.vehicle,
    status: telemetry.event.status,
  };

  const diagnostic = await post(
    "/api/garage/diagnostics",
    {
      vehicle: "Toyota Prado",
      code: `P${stamp.slice(-3)}`,
      severity: "urgent",
    },
    "garage diagnostic"
  );
  assert(diagnostic.id, "diagnostic did not return an id");
  assert(diagnostic.vehicle, "diagnostic did not return a vehicle");
  report.diagnostic = {
    id: diagnostic.id,
    vehicle: diagnostic.vehicle,
    code: diagnostic.code,
  };

  const reception = await post(
    "/api/garage/actions",
    {
      action: "create_reception",
      clientName: `QA Backend ${stamp}`,
      phone: "+221 77 555 44 33",
      brand: "Kia",
      model: "Sportage",
      plate: `QA ${stamp}`,
      mileage: 45210,
      operation: "Reception QA backend + controle IoT",
    },
    "garage reception"
  );
  assert(reception.recordId, "reception did not return a record id");
  assert(reception.overview?.summary?.clients >= overview.summary.clients, "reception overview did not update");
  report.reception = {
    recordId: reception.recordId,
    clientsAfter: reception.overview.summary.clients,
  };

  const vehicleId = portal.portal.vehicles[0].id;
  const vehicleProfile = await post(
    "/api/client/portal?clientId=c-001",
    {
      action: "update_vehicle_profile",
      vehicleId,
      brand: "Toyota",
      model: "Prado",
      plate: "DK 4582 AA",
      mileage: 124900,
      insuranceDue: "2026-06-15",
      inspectionDue: "2026-07-12",
      oilDueKm: 126500,
    },
    "client vehicle profile"
  );
  assert(vehicleProfile.portal?.vehicles?.[0]?.mileage === 124900, "vehicle profile did not update mileage");
  report.portal.vehicleProfile = vehicleProfile.recordId;

  const callback = await post(
    "/api/client/portal?clientId=c-001",
    {
      action: "request_callback",
      vehicleId,
      reason: "QA demande rappel atelier",
    },
    "client callback"
  );
  assert(callback.recordId, "client callback did not return a record id");
  assert(callback.portal?.vehicles?.length >= 1, "client callback did not return portal data");
  report.portal.callback = callback.recordId;
}

console.log(JSON.stringify(report, null, 2));
