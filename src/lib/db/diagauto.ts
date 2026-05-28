import { existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import type { GarageAlertSeverity, GarageAlertType } from "@/lib/data/garage";

type SqlValue = string | number | null;

type Statement<T = Record<string, unknown>> = {
  all: (...values: SqlValue[]) => T[];
  get: (...values: SqlValue[]) => T | undefined;
  run: (...values: SqlValue[]) => void;
};

type Database = {
  exec: (sql: string) => void;
  prepare: <T = Record<string, unknown>>(sql: string) => Statement<T>;
};

type DatabaseConstructor = new (filename: string) => Database;

type OverviewRow = {
  clients: number;
  vehicles: number;
  connectedDevices: number;
  openWorkOrders: number;
  urgentAlerts: number;
  projectedRevenue: number | null;
};

type HealthCounts = {
  clients: number;
  vehicles: number;
  connectedDevices: number;
  unresolvedAlerts: number;
  openWorkOrders: number;
  pendingNotifications: number;
};

export type DiagnosticPayload = {
  client?: string;
  vehicle?: string;
  code?: string;
  severity?: GarageAlertSeverity;
};

export type TelemetryPayload = {
  deviceSerial?: string;
  vehicleId?: string;
  metric?: string;
  value?: string;
  status?: GarageAlertSeverity;
  code?: string;
  mileage?: number;
};

export type GarageActionPayload =
  | {
      action: "create_reception";
      clientName?: string;
      phone?: string;
      city?: string;
      brand?: string;
      model?: string;
      plate?: string;
      mileage?: number;
      operation?: string;
    }
  | { action: "approve_estimate"; estimateId?: string }
  | { action: "record_payment"; invoiceId?: string; amount?: number; method?: string }
  | { action: "resolve_alert"; alertId?: string }
  | { action: "send_notification"; notificationId?: string };

export type ClientPortalActionPayload =
  | { action: "approve_estimate"; estimateId?: string }
  | { action: "record_payment"; invoiceId?: string; amount?: number; method?: string }
  | { action: "request_callback"; vehicleId?: string; reason?: string };

const require = createRequire(import.meta.url);
const { DatabaseSync } = require("node:sqlite") as { DatabaseSync: DatabaseConstructor };

const dbDirectory = path.join(process.cwd(), "data");
const dbPath = path.join(dbDirectory, "diagauto.sqlite");

let cachedDb: Database | null = null;

function getDatabase() {
  if (!existsSync(dbDirectory)) mkdirSync(dbDirectory, { recursive: true });

  if (!cachedDb) {
    cachedDb = new DatabaseSync(dbPath);
    cachedDb.exec("PRAGMA foreign_keys = ON;");
    cachedDb.exec("PRAGMA journal_mode = WAL;");
    migrate(cachedDb);
    seed(cachedDb);
  }

  return cachedDb;
}

export function getBackendHealthFromDb() {
  const db = getDatabase();
  const counts = db
    .prepare<HealthCounts>(`
      SELECT
        (SELECT COUNT(*) FROM clients) AS clients,
        (SELECT COUNT(*) FROM vehicles) AS vehicles,
        (SELECT COUNT(*) FROM iot_devices WHERE status = 'active') AS connectedDevices,
        (SELECT COUNT(*) FROM alerts WHERE resolved_at IS NULL) AS unresolvedAlerts,
        (SELECT COUNT(*) FROM work_orders WHERE status != 'livraison') AS openWorkOrders,
        (SELECT COUNT(*) FROM notifications WHERE status != 'envoye') AS pendingNotifications
    `)
    .get();

  const warnings = [
    !counts || counts.clients === 0 ? "no clients in database" : null,
    !counts || counts.vehicles === 0 ? "no vehicles in database" : null,
    !counts || counts.connectedDevices === 0 ? "no active iot devices" : null,
  ].filter(Boolean);

  return {
    checkedAt: new Date().toISOString(),
    storage: "node:sqlite",
    databaseFile: dbPath,
    integrity: warnings.length === 0 ? "operational" : "degraded",
    counts: counts ?? {
      clients: 0,
      vehicles: 0,
      connectedDevices: 0,
      unresolvedAlerts: 0,
      openWorkOrders: 0,
      pendingNotifications: 0,
    },
    warnings,
  };
}

function migrate(db: Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS garages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      phone TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      garage_id TEXT NOT NULL REFERENCES garages(id),
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      city TEXT NOT NULL,
      account_status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL REFERENCES clients(id),
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      plate TEXT NOT NULL UNIQUE,
      vin TEXT NOT NULL UNIQUE,
      mileage INTEGER NOT NULL,
      health_score INTEGER NOT NULL,
      insurance_due TEXT NOT NULL,
      inspection_due TEXT NOT NULL,
      oil_due_km INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS iot_devices (
      id TEXT PRIMARY KEY,
      vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
      serial TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL,
      installed_at TEXT NOT NULL,
      last_seen TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS telemetry_signals (
      id TEXT PRIMARY KEY,
      vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
      device_id TEXT NOT NULL REFERENCES iot_devices(id),
      metric TEXT NOT NULL,
      value TEXT NOT NULL,
      status TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
      type TEXT NOT NULL,
      label TEXT NOT NULL,
      due TEXT NOT NULL,
      severity TEXT NOT NULL,
      source TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      resolved_at TEXT
    );

    CREATE TABLE IF NOT EXISTS work_orders (
      id TEXT PRIMARY KEY,
      vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
      time TEXT NOT NULL,
      operation TEXT NOT NULL,
      status TEXT NOT NULL,
      amount INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS diagnostics (
      id TEXT PRIMARY KEY,
      vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
      code TEXT NOT NULL,
      severity TEXT NOT NULL,
      status TEXT NOT NULL,
      next_action TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      garage_id TEXT NOT NULL REFERENCES garages(id),
      full_name TEXT NOT NULL,
      role TEXT NOT NULL,
      bay TEXT NOT NULL,
      status TEXT NOT NULL,
      current_order_id TEXT REFERENCES work_orders(id)
    );

    CREATE TABLE IF NOT EXISTS inspections (
      id TEXT PRIMARY KEY,
      work_order_id TEXT NOT NULL REFERENCES work_orders(id),
      inspector_id TEXT REFERENCES team_members(id),
      status TEXT NOT NULL,
      score INTEGER NOT NULL,
      fail_count INTEGER NOT NULL,
      attention_count INTEGER NOT NULL,
      photo_count INTEGER NOT NULL,
      sent_to_client_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS estimates (
      id TEXT PRIMARY KEY,
      work_order_id TEXT NOT NULL REFERENCES work_orders(id),
      client_id TEXT NOT NULL REFERENCES clients(id),
      status TEXT NOT NULL,
      total INTEGER NOT NULL,
      approved_at TEXT,
      declined_reason TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS estimate_items (
      id TEXT PRIMARY KEY,
      estimate_id TEXT NOT NULL REFERENCES estimates(id),
      label TEXT NOT NULL,
      kind TEXT NOT NULL,
      amount INTEGER NOT NULL,
      approval_status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      estimate_id TEXT NOT NULL REFERENCES estimates(id),
      status TEXT NOT NULL,
      total INTEGER NOT NULL,
      due_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      invoice_id TEXT NOT NULL REFERENCES invoices(id),
      method TEXT NOT NULL,
      status TEXT NOT NULL,
      amount INTEGER NOT NULL,
      paid_at TEXT
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL REFERENCES clients(id),
      vehicle_id TEXT REFERENCES vehicles(id),
      channel TEXT NOT NULL,
      template TEXT NOT NULL,
      status TEXT NOT NULL,
      scheduled_for TEXT NOT NULL,
      sent_at TEXT
    );

    CREATE TABLE IF NOT EXISTS vehicle_documents (
      id TEXT PRIMARY KEY,
      vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
      type TEXT NOT NULL,
      label TEXT NOT NULL,
      status TEXT NOT NULL,
      expires_at TEXT,
      file_ref TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

function seed(db: Database) {
  db.prepare("INSERT OR IGNORE INTO garages (id, name, city, phone) VALUES (?, ?, ?, ?)").run(
    "g-001",
    "DiagAutoSN Dakar",
    "Dakar",
    "+221 77 000 00 00"
  );

  const insertClient = db.prepare(
    "INSERT OR IGNORE INTO clients (id, garage_id, full_name, email, phone, city) VALUES (?, ?, ?, ?, ?, ?)"
  );
  [
    ["c-001", "g-001", "Awa Diop", "awa.diop@diagautosn.local", "+221 77 432 18 90", "Dakar"],
    ["c-002", "g-001", "Mamadou Fall", "mamadou.fall@diagautosn.local", "+221 76 218 44 12", "Thies"],
    ["c-003", "g-001", "Ibrahima Sarr", "ibrahima.sarr@diagautosn.local", "+221 78 901 22 45", "Dakar"],
    ["c-004", "g-001", "Fatou Ndiaye", "fatou.ndiaye@diagautosn.local", "+221 70 654 09 18", "Saint-Louis"],
  ].forEach((client) => insertClient.run(...client));

  const insertVehicle = db.prepare(
    `INSERT OR IGNORE INTO vehicles
      (id, client_id, brand, model, plate, vin, mileage, health_score, insurance_due, inspection_due, oil_due_km)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  [
    ["v-001", "c-001", "Toyota", "Prado", "DK 4582 AA", "JTEBU3FJ90K512004", 124800, 87, "2026-05-29", "2026-07-12", 126000],
    ["v-002", "c-002", "Mercedes", "C220d", "DK 9112 AB", "WDDWF4KB1KR512004", 67200, 78, "2026-09-20", "2026-06-07", 70000],
    ["v-003", "c-003", "BMW", "320i", "TH 2284 AB", "WBA8E5C50HK483921", 156400, 64, "2026-08-14", "2026-10-02", 158000],
    ["v-004", "c-004", "Hyundai", "Tucson", "SL 1845 AA", "KMHJ281ABNU112345", 32100, 91, "2026-05-30", "2026-12-18", 36000],
  ].forEach((vehicle) => insertVehicle.run(...vehicle));

  const insertDevice = db.prepare(
    "INSERT OR IGNORE INTO iot_devices (id, vehicle_id, serial, status, installed_at, last_seen) VALUES (?, ?, ?, ?, ?, ?)"
  );
  [
    ["dev-001", "v-001", "DASN-IOT-0421", "active", "2026-04-12", "14:32"],
    ["dev-002", "v-002", "DASN-IOT-0742", "active", "2026-03-18", "14:30"],
    ["dev-003", "v-003", "DASN-IOT-0194", "active", "2026-02-09", "14:31"],
    ["dev-004", "v-004", "DASN-IOT-0882", "active", "2026-04-02", "14:29"],
  ].forEach((device) => insertDevice.run(...device));

  const insertSignal = db.prepare(
    "INSERT OR IGNORE INTO telemetry_signals (id, vehicle_id, device_id, metric, value, status, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  [
    ["sig-bat", "v-001", "dev-001", "Batterie", "12.6 V", "ok", "14:32"],
    ["sig-temp", "v-003", "dev-003", "Temperature moteur", "96 C", "watch", "14:31"],
    ["sig-dtc", "v-003", "dev-003", "DTC actifs", "P0420, U0121", "blocked", "14:31"],
    ["sig-gps", "v-004", "dev-004", "Derniere position", "Dakar Plateau", "ok", "14:29"],
  ].forEach((signal) => insertSignal.run(...signal));

  const insertAlert = db.prepare(
    "INSERT OR IGNORE INTO alerts (id, vehicle_id, type, label, due, severity, source) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  [
    ["al-vid-001", "v-001", "vidange", "Vidange a planifier", "1 180 km restants", "watch", "kilometrage IoT + carnet atelier"],
    ["al-vt-002", "v-002", "visite_technique", "Visite technique proche", "expire dans 17 jours", "urgent", "document vehicule + rappel legal"],
    ["al-ass-003", "v-004", "assurance", "Assurance a renouveler", "expire dans 8 jours", "urgent", "contrat client + relance garage"],
    ["al-dtc-004", "v-003", "diagnostic", "Code P0420 actif", "atelier recommande", "blocked", "lecture OBD-II temps reel"],
  ].forEach((alert) => insertAlert.run(...alert));

  const insertOrder = db.prepare(
    "INSERT OR IGNORE INTO work_orders (id, vehicle_id, time, operation, status, amount) VALUES (?, ?, ?, ?, ?, ?)"
  );
  [
    ["wo-7714", "v-001", "08:20", "Vidange + filtre + controle capteur", "diagnostic", 62000],
    ["wo-7742", "v-002", "09:35", "Visite technique + freinage", "devis", 148000],
    ["wo-7798", "v-003", "11:10", "Diagnostic moteur P0420", "intervention", 285000],
  ].forEach((order) => insertOrder.run(...order));

  const insertTeamMember = db.prepare(
    "INSERT OR IGNORE INTO team_members (id, garage_id, full_name, role, bay, status, current_order_id) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  [
    ["tm-001", "g-001", "Cheikh Mbaye", "Chef atelier", "Baie 1", "en intervention", "wo-7798"],
    ["tm-002", "g-001", "Aminata Kane", "Reception", "Accueil", "relance client", "wo-7742"],
    ["tm-003", "g-001", "Moussa Ba", "Mecanicien", "Baie 2", "inspection", "wo-7714"],
  ].forEach((member) => insertTeamMember.run(...member));

  const insertInspection = db.prepare(
    "INSERT OR IGNORE INTO inspections (id, work_order_id, inspector_id, status, score, fail_count, attention_count, photo_count, sent_to_client_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  [
    ["ins-001", "wo-7714", "tm-003", "envoyee_client", 81, 1, 3, 8, "2026-05-22T08:42:00.000Z"],
    ["ins-002", "wo-7742", "tm-002", "en_attente_devis", 68, 2, 4, 5, null],
    ["ins-003", "wo-7798", "tm-001", "bloquante", 52, 4, 2, 11, "2026-05-22T11:27:00.000Z"],
  ].forEach((inspection) => insertInspection.run(...inspection));

  const insertEstimate = db.prepare(
    "INSERT OR IGNORE INTO estimates (id, work_order_id, client_id, status, total, approved_at, declined_reason) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  [
    ["est-001", "wo-7714", "c-001", "envoye", 62000, null, null],
    ["est-002", "wo-7742", "c-002", "a_valider", 148000, null, null],
    ["est-003", "wo-7798", "c-003", "approuve_partiel", 285000, "2026-05-22T11:38:00.000Z", null],
  ].forEach((estimate) => insertEstimate.run(...estimate));

  const insertEstimateItem = db.prepare(
    "INSERT OR IGNORE INTO estimate_items (id, estimate_id, label, kind, amount, approval_status) VALUES (?, ?, ?, ?, ?, ?)"
  );
  [
    ["ei-001", "est-001", "Vidange huile 5W30 + filtre", "piece_main_oeuvre", 39000, "pending"],
    ["ei-002", "est-001", "Controle capteur IoT", "diagnostic", 23000, "pending"],
    ["ei-003", "est-002", "Controle freinage + preparation visite", "main_oeuvre", 98000, "pending"],
    ["ei-004", "est-002", "Frais visite technique", "admin", 50000, "pending"],
    ["ei-005", "est-003", "Catalyseur + diagnostic emission", "piece", 285000, "approved"],
  ].forEach((item) => insertEstimateItem.run(...item));

  const insertInvoice = db.prepare(
    "INSERT OR IGNORE INTO invoices (id, estimate_id, status, total, due_at) VALUES (?, ?, ?, ?, ?)"
  );
  [
    ["inv-001", "est-001", "a_encaisser", 62000, "2026-05-24"],
    ["inv-002", "est-002", "devis_non_facture", 148000, "2026-05-25"],
    ["inv-003", "est-003", "paiement_partiel", 285000, "2026-05-26"],
  ].forEach((invoice) => insertInvoice.run(...invoice));

  const insertPayment = db.prepare(
    "INSERT OR IGNORE INTO payments (id, invoice_id, method, status, amount, paid_at) VALUES (?, ?, ?, ?, ?, ?)"
  );
  [
    ["pay-001", "inv-003", "wave", "recu", 85000, "2026-05-22T12:05:00.000Z"],
    ["pay-002", "inv-001", "lien_mobile", "en_attente", 62000, null],
  ].forEach((payment) => insertPayment.run(...payment));

  const insertNotification = db.prepare(
    "INSERT OR IGNORE INTO notifications (id, client_id, vehicle_id, channel, template, status, scheduled_for, sent_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  [
    ["not-001", "c-001", "v-001", "whatsapp", "Devis vidange a valider", "programme", "2026-05-22T16:00:00.000Z", null],
    ["not-002", "c-002", "v-002", "sms", "Rappel visite technique", "pret", "2026-05-23T09:00:00.000Z", null],
    ["not-003", "c-004", "v-004", "whatsapp", "Renouvellement assurance", "envoye", "2026-05-22T09:15:00.000Z", "2026-05-22T09:16:00.000Z"],
  ].forEach((notification) => insertNotification.run(...notification));

  const insertDocument = db.prepare(
    "INSERT OR IGNORE INTO vehicle_documents (id, vehicle_id, type, label, status, expires_at, file_ref) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  [
    ["doc-001", "v-001", "assurance", "Assurance Toyota Prado", "expire_bientot", "2026-05-29", "local://documents/assurance-prado.pdf"],
    ["doc-002", "v-001", "carte_grise", "Carte grise Toyota Prado", "valide", null, "local://documents/carte-grise-prado.pdf"],
    ["doc-003", "v-002", "visite_technique", "Visite technique Mercedes C220d", "a_renouveler", "2026-06-07", "local://documents/visite-c220d.pdf"],
    ["doc-004", "v-003", "rapport_diagnostic", "Rapport diagnostic P0420", "partage_client", null, "local://documents/rapport-p0420.pdf"],
    ["doc-005", "v-004", "assurance", "Assurance Hyundai Tucson", "urgent", "2026-05-30", "local://documents/assurance-tucson.pdf"],
  ].forEach((document) => insertDocument.run(...document));
}

function getVehicleIdByLabel(db: Database, vehicleLabel?: string) {
  if (!vehicleLabel) return "v-001";

  const row = db
    .prepare<{ id: string }>(
      "SELECT id FROM vehicles WHERE (? LIKE '%' || brand || '%' AND ? LIKE '%' || model || '%') OR plate = ? LIMIT 1"
    )
    .get(vehicleLabel, vehicleLabel, vehicleLabel);

  return row?.id || "v-001";
}

function slugId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;
}

function safeText(value: string | undefined, fallback: string) {
  const cleaned = value?.trim();
  return cleaned && cleaned.length > 0 ? cleaned : fallback;
}

function getEstimateContext(db: Database, estimateId: string) {
  return db
    .prepare<{ workOrderId: string; total: number }>(
      "SELECT work_order_id AS workOrderId, total FROM estimates WHERE id = ? LIMIT 1"
    )
    .get(estimateId);
}

function getInvoiceContext(db: Database, invoiceId: string) {
  return db
    .prepare<{ total: number; paid: number }>(
      `SELECT i.total, COALESCE(SUM(p.amount), 0) AS paid
       FROM invoices i
       LEFT JOIN payments p ON p.invoice_id = i.id AND p.status = 'recu'
       WHERE i.id = ?
       GROUP BY i.id`
    )
    .get(invoiceId);
}

function estimateBelongsToClient(db: Database, estimateId: string, clientId: string) {
  return Boolean(db.prepare("SELECT id FROM estimates WHERE id = ? AND client_id = ? LIMIT 1").get(estimateId, clientId));
}

function invoiceBelongsToClient(db: Database, invoiceId: string, clientId: string) {
  return Boolean(
    db
      .prepare(
        `SELECT i.id
         FROM invoices i
         JOIN estimates e ON e.id = i.estimate_id
         WHERE i.id = ? AND e.client_id = ?
         LIMIT 1`
      )
      .get(invoiceId, clientId)
  );
}

function getDeviceContext(db: Database, payload: TelemetryPayload) {
  const bySerial = payload.deviceSerial
    ? db
        .prepare<{
          deviceId: string;
          serial: string;
          vehicleId: string;
          vehicle: string;
          client: string;
        }>(
          `SELECT d.id AS deviceId, d.serial, v.id AS vehicleId, v.brand || ' ' || v.model AS vehicle, c.full_name AS client
           FROM iot_devices d
           JOIN vehicles v ON v.id = d.vehicle_id
           JOIN clients c ON c.id = v.client_id
           WHERE d.serial = ?
           LIMIT 1`
        )
        .get(payload.deviceSerial)
    : undefined;

  if (bySerial) return bySerial;

  const byVehicle = db
    .prepare<{
      deviceId: string;
      serial: string;
      vehicleId: string;
      vehicle: string;
      client: string;
    }>(
      `SELECT d.id AS deviceId, d.serial, v.id AS vehicleId, v.brand || ' ' || v.model AS vehicle, c.full_name AS client
       FROM iot_devices d
       JOIN vehicles v ON v.id = d.vehicle_id
       JOIN clients c ON c.id = v.client_id
       WHERE v.id = ?
       LIMIT 1`
    )
    .get(payload.vehicleId || "v-003");

  if (byVehicle) return byVehicle;

  return {
    deviceId: "dev-003",
    serial: "DASN-IOT-0194",
    vehicleId: "v-003",
    vehicle: "BMW 320i",
    client: "Ibrahima Sarr",
  };
}

function signalId(vehicleId: string, metric: string) {
  return `sig-${vehicleId}-${metric.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

function alertTypeForMetric(metric: string, code?: string): GarageAlertType {
  const normalized = metric.toLowerCase();
  if (normalized.includes("vidange") || normalized.includes("huile")) return "vidange";
  if (normalized.includes("assurance")) return "assurance";
  if (normalized.includes("visite")) return "visite_technique";
  if (code || normalized.includes("dtc") || normalized.includes("moteur")) return "diagnostic";
  return "diagnostic";
}

function labelForTelemetry(metric: string, value: string, code?: string) {
  const normalized = metric.toLowerCase();
  if (normalized.includes("huile") || normalized.includes("vidange")) return "Alerte vidange automatique";
  if (normalized.includes("assurance")) return "Alerte assurance automatique";
  if (normalized.includes("visite")) return "Alerte visite technique automatique";
  if (code) return `Code ${code} actif`;
  return `${metric} hors plage`;
}

export function getGarageOverviewFromDb() {
  const db = getDatabase();
  const summary = db.prepare<OverviewRow>(`
    SELECT
      (SELECT COUNT(*) FROM clients) AS clients,
      (SELECT COUNT(*) FROM vehicles) AS vehicles,
      (SELECT COUNT(*) FROM iot_devices WHERE status = 'active') AS connectedDevices,
      (SELECT COUNT(*) FROM work_orders WHERE status != 'livraison') AS openWorkOrders,
      (SELECT COUNT(*) FROM alerts WHERE resolved_at IS NULL AND severity IN ('urgent', 'blocked')) AS urgentAlerts,
      (SELECT COALESCE(SUM(amount), 0) FROM work_orders WHERE status != 'livraison') AS projectedRevenue
  `).get();

  const alerts = db.prepare(`
    SELECT
      a.id,
      a.type,
      a.label,
      v.brand || ' ' || v.model || ' - ' || v.plate AS vehicle,
      c.full_name AS client,
      a.due,
      a.severity,
      a.source
    FROM alerts a
    JOIN vehicles v ON v.id = a.vehicle_id
    JOIN clients c ON c.id = v.client_id
    WHERE a.resolved_at IS NULL
    ORDER BY
      CASE a.severity WHEN 'blocked' THEN 0 WHEN 'urgent' THEN 1 WHEN 'watch' THEN 2 ELSE 3 END,
      a.created_at DESC
  `).all();

  const workOrders = db.prepare(`
    SELECT
      w.id,
      w.time,
      c.full_name AS client,
      v.brand || ' ' || v.model AS vehicle,
      w.operation,
      w.status,
      w.amount
    FROM work_orders w
    JOIN vehicles v ON v.id = w.vehicle_id
    JOIN clients c ON c.id = v.client_id
    ORDER BY w.created_at DESC, w.time DESC
  `).all();

  const signals = db.prepare(`
    SELECT
      s.id,
      v.brand || ' ' || v.model AS vehicle,
      d.serial AS device,
      s.metric,
      s.value,
      s.status,
      s.updated_at AS updatedAt
    FROM telemetry_signals s
    JOIN vehicles v ON v.id = s.vehicle_id
    JOIN iot_devices d ON d.id = s.device_id
    ORDER BY s.updated_at DESC
  `).all();

  const clients = db.prepare(`
    SELECT
      c.id,
      c.full_name AS fullName,
      c.phone,
      c.city,
      COUNT(v.id) AS vehicles,
      MIN(v.health_score) AS healthScore
    FROM clients c
    LEFT JOIN vehicles v ON v.client_id = c.id
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `).all();

  const vehicles = db.prepare(`
    SELECT
      v.id,
      c.full_name AS client,
      v.brand || ' ' || v.model AS label,
      v.plate,
      v.mileage,
      v.health_score AS healthScore,
      d.serial,
      d.last_seen AS lastSeen
    FROM vehicles v
    JOIN clients c ON c.id = v.client_id
    LEFT JOIN iot_devices d ON d.vehicle_id = v.id
    ORDER BY v.health_score ASC
  `).all();

  const team = db.prepare(`
    SELECT
      t.id,
      t.full_name AS fullName,
      t.role,
      t.bay,
      t.status,
      w.operation AS currentOperation
    FROM team_members t
    LEFT JOIN work_orders w ON w.id = t.current_order_id
    ORDER BY t.role ASC
  `).all();

  const inspections = db.prepare(`
    SELECT
      i.id,
      i.status,
      i.score,
      i.fail_count AS failCount,
      i.attention_count AS attentionCount,
      i.photo_count AS photoCount,
      c.full_name AS client,
      v.brand || ' ' || v.model AS vehicle,
      t.full_name AS inspector
    FROM inspections i
    JOIN work_orders w ON w.id = i.work_order_id
    JOIN vehicles v ON v.id = w.vehicle_id
    JOIN clients c ON c.id = v.client_id
    LEFT JOIN team_members t ON t.id = i.inspector_id
    ORDER BY i.created_at DESC
  `).all();

  const estimates = db.prepare(`
    SELECT
      e.id,
      e.status,
      e.total,
      c.full_name AS client,
      v.brand || ' ' || v.model AS vehicle,
      w.operation
    FROM estimates e
    JOIN work_orders w ON w.id = e.work_order_id
    JOIN vehicles v ON v.id = w.vehicle_id
    JOIN clients c ON c.id = e.client_id
    ORDER BY e.created_at DESC
  `).all();

  const invoices = db.prepare(`
    SELECT
      i.id,
      i.status,
      i.total,
      i.due_at AS dueAt,
      c.full_name AS client,
      COALESCE(SUM(p.amount), 0) AS paid
    FROM invoices i
    JOIN estimates e ON e.id = i.estimate_id
    JOIN clients c ON c.id = e.client_id
    LEFT JOIN payments p ON p.invoice_id = i.id AND p.status = 'recu'
    GROUP BY i.id
    ORDER BY i.created_at DESC
  `).all();

  const notifications = db.prepare(`
    SELECT
      n.id,
      n.channel,
      n.template,
      n.status,
      n.scheduled_for AS scheduledFor,
      c.full_name AS client,
      v.brand || ' ' || v.model AS vehicle
    FROM notifications n
    JOIN clients c ON c.id = n.client_id
    LEFT JOIN vehicles v ON v.id = n.vehicle_id
    ORDER BY n.scheduled_for ASC
  `).all();

  const documents = db.prepare(`
    SELECT
      d.id,
      d.type,
      d.label,
      d.status,
      d.expires_at AS expiresAt,
      d.file_ref AS fileRef,
      c.full_name AS client,
      v.brand || ' ' || v.model AS vehicle,
      v.plate
    FROM vehicle_documents d
    JOIN vehicles v ON v.id = d.vehicle_id
    JOIN clients c ON c.id = v.client_id
    ORDER BY
      CASE d.status WHEN 'urgent' THEN 0 WHEN 'expire_bientot' THEN 1 WHEN 'a_renouveler' THEN 2 ELSE 3 END,
      d.created_at DESC
  `).all();

  return {
    updatedAt: new Date().toISOString(),
    summary: {
      clients: summary?.clients ?? 0,
      vehicles: summary?.vehicles ?? 0,
      connectedDevices: summary?.connectedDevices ?? 0,
      openWorkOrders: summary?.openWorkOrders ?? 0,
      urgentAlerts: summary?.urgentAlerts ?? 0,
      projectedRevenue: summary?.projectedRevenue ?? 0,
    },
    alerts,
    workOrders,
    signals,
    clients,
    vehicles,
    team,
    inspections,
    estimates,
    invoices,
    notifications,
    documents,
  };
}

function getGarageOverviewPayload() {
  return { ...getGarageOverviewFromDb(), source: "sqlite" as const };
}

export function createDiagnosticInDb(payload: DiagnosticPayload) {
  const db = getDatabase();
  const now = new Date();
  const id = `diag-${now.getTime()}`;
  const orderId = `wo-${now.getTime()}`;
  const vehicleId = getVehicleIdByLabel(db, payload.vehicle);
  const code = payload.code || "P0000";
  const severity = payload.severity || "watch";
  const nextAction = "Notifier le client et ouvrir une estimation atelier";

  db.prepare(
    "INSERT INTO diagnostics (id, vehicle_id, code, severity, status, next_action, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(id, vehicleId, code, severity, "diagnostic cree", nextAction, now.toISOString());

  db.prepare(
    "INSERT INTO work_orders (id, vehicle_id, time, operation, status, amount, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(
    orderId,
    vehicleId,
    now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    `Diagnostic moteur ${code}`,
    "diagnostic",
    0,
    now.toISOString()
  );

  db.prepare(
    "INSERT OR IGNORE INTO alerts (id, vehicle_id, type, label, due, severity, source, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(
    `al-${id}`,
    vehicleId,
    "diagnostic" satisfies GarageAlertType,
    `Code ${code} actif`,
    "atelier recommande",
    severity,
    "creation diagnostic garage",
    now.toISOString()
  );

  const vehicleRow = db
    .prepare<{ vehicle: string; client: string }>(
      `SELECT v.brand || ' ' || v.model AS vehicle, c.full_name AS client
       FROM vehicles v JOIN clients c ON c.id = v.client_id WHERE v.id = ?`
    )
    .get(vehicleId);

  return {
    id,
    time: now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    client: vehicleRow?.client || payload.client || "Client garage",
    vehicle: vehicleRow?.vehicle || payload.vehicle || "Vehicule connecte",
    code,
    severity,
    status: "diagnostic cree",
    nextAction,
  };
}

export function ingestTelemetryInDb(payload: TelemetryPayload) {
  const db = getDatabase();
  const now = new Date();
  const context = getDeviceContext(db, payload);
  const metric = payload.metric || (payload.code ? "DTC actifs" : "Temperature moteur");
  const value = payload.value || payload.code || "104 C";
  const severity = payload.status || (payload.code ? "blocked" : "watch");
  const id = signalId(context.vehicleId, metric);
  const updatedAt = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  db.prepare(
    `INSERT INTO telemetry_signals (id, vehicle_id, device_id, metric, value, status, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
      value = excluded.value,
      status = excluded.status,
      updated_at = excluded.updated_at`
  ).run(id, context.vehicleId, context.deviceId, metric, value, severity, updatedAt);

  db.prepare("UPDATE iot_devices SET last_seen = ?, status = 'active' WHERE id = ?").run(updatedAt, context.deviceId);

  if (typeof payload.mileage === "number") {
    db.prepare("UPDATE vehicles SET mileage = ? WHERE id = ?").run(payload.mileage, context.vehicleId);
  }

  if (severity !== "ok") {
    const type = alertTypeForMetric(metric, payload.code);
    db.prepare(
      "INSERT INTO alerts (id, vehicle_id, type, label, due, severity, source, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(
      `al-iot-${now.getTime()}`,
      context.vehicleId,
      type,
      labelForTelemetry(metric, value, payload.code),
      severity === "blocked" ? "controle immediat" : "a surveiller aujourd'hui",
      severity,
      `capteur ${context.serial}`,
      now.toISOString()
    );
  }

  return {
    event: {
      id,
      vehicle: context.vehicle,
      client: context.client,
      device: context.serial,
      metric,
      value,
      status: severity,
      updatedAt,
    },
    overview: getGarageOverviewPayload(),
  };
}

export function runGarageActionInDb(payload: GarageActionPayload) {
  const db = getDatabase();
  const now = new Date();
  const nowIso = now.toISOString();

  if (payload.action === "create_reception") {
    const clientId = slugId("c");
    const vehicleId = slugId("v");
    const orderId = slugId("wo");
    const inspectionId = slugId("ins");
    const estimateId = slugId("est");
    const notificationId = slugId("not");
    const clientName = safeText(payload.clientName, "Nouveau client atelier");
    const brand = safeText(payload.brand, "Toyota");
    const model = safeText(payload.model, "Prado");
    const plate = safeText(payload.plate, `DK ${Math.floor(1000 + Math.random() * 8999)} ZZ`);
    const operation = safeText(payload.operation, "Reception + diagnostic rapide");
    const mileage = typeof payload.mileage === "number" ? payload.mileage : 0;
    const amount = operation.toLowerCase().includes("visite") ? 45000 : 25000;

    db.prepare(
      "INSERT INTO clients (id, garage_id, full_name, email, phone, city, account_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(
      clientId,
      "g-001",
      clientName,
      `${clientId}@diagautosn.local`,
      safeText(payload.phone, "+221 77 100 20 30"),
      safeText(payload.city, "Dakar"),
      "active",
      nowIso
    );

    db.prepare(
      `INSERT INTO vehicles
        (id, client_id, brand, model, plate, vin, mileage, health_score, insurance_due, inspection_due, oil_due_km)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      vehicleId,
      clientId,
      brand,
      model,
      plate,
      `VIN${now.getTime()}`,
      mileage,
      73,
      "2026-07-30",
      "2026-08-12",
      mileage + 4500
    );

    db.prepare(
      "INSERT INTO work_orders (id, vehicle_id, time, operation, status, amount, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(
      orderId,
      vehicleId,
      now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      operation,
      "recu",
      amount,
      nowIso
    );

    db.prepare(
      "INSERT INTO inspections (id, work_order_id, inspector_id, status, score, fail_count, attention_count, photo_count, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(inspectionId, orderId, "tm-003", "a_demarrer", 73, 0, 2, 0, nowIso);

    db.prepare(
      "INSERT INTO estimates (id, work_order_id, client_id, status, total, approved_at, declined_reason, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(estimateId, orderId, clientId, "brouillon", amount, null, null, nowIso);

    db.prepare(
      "INSERT INTO estimate_items (id, estimate_id, label, kind, amount, approval_status) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(slugId("ei"), estimateId, operation, "main_oeuvre", amount, "draft");

    db.prepare(
      "INSERT INTO notifications (id, client_id, vehicle_id, channel, template, status, scheduled_for, sent_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(notificationId, clientId, vehicleId, "whatsapp", "Reception vehicule enregistree", "pret", nowIso, null);

    return {
      message: `Reception creee pour ${clientName}`,
      recordId: orderId,
      overview: getGarageOverviewPayload(),
    };
  }

  if (payload.action === "approve_estimate") {
    const estimateId = safeText(payload.estimateId, "");
    const estimate = getEstimateContext(db, estimateId);
    if (!estimate) throw new Error("estimate not found");

    db.prepare("UPDATE estimates SET status = ?, approved_at = ? WHERE id = ?").run("approuve", nowIso, estimateId);
    db.prepare("UPDATE estimate_items SET approval_status = ? WHERE estimate_id = ?").run("approved", estimateId);
    db.prepare("UPDATE work_orders SET status = ?, amount = ? WHERE id = ?").run("intervention", estimate.total, estimate.workOrderId);
    const invoice = db
      .prepare<{ id: string; total: number; paid: number }>(
        `SELECT i.id, i.total, COALESCE(SUM(p.amount), 0) AS paid
         FROM invoices i
         LEFT JOIN payments p ON p.invoice_id = i.id AND p.status = 'recu'
         WHERE i.estimate_id = ?
         GROUP BY i.id`
      )
      .get(estimateId);
    if (invoice) {
      db.prepare("UPDATE invoices SET status = ? WHERE id = ?").run(
        invoice.paid >= invoice.total ? "payee" : "a_encaisser",
        invoice.id
      );
    }

    return {
      message: `Devis ${estimateId} approuve`,
      recordId: estimateId,
      overview: getGarageOverviewPayload(),
    };
  }

  if (payload.action === "record_payment") {
    const invoiceId = safeText(payload.invoiceId, "");
    const invoice = getInvoiceContext(db, invoiceId);
    if (!invoice) throw new Error("invoice not found");
    const remaining = Math.max(invoice.total - invoice.paid, 0);
    const amount = typeof payload.amount === "number" && payload.amount > 0 ? Math.min(payload.amount, remaining) : remaining;

    db.prepare("INSERT INTO payments (id, invoice_id, method, status, amount, paid_at) VALUES (?, ?, ?, ?, ?, ?)").run(
      slugId("pay"),
      invoiceId,
      safeText(payload.method, "wave"),
      "recu",
      amount,
      nowIso
    );

    const after = getInvoiceContext(db, invoiceId);
    if (after && after.paid >= after.total) {
      db.prepare("UPDATE invoices SET status = ? WHERE id = ?").run("payee", invoiceId);
    } else {
      db.prepare("UPDATE invoices SET status = ? WHERE id = ?").run("paiement_partiel", invoiceId);
    }

    return {
      message: `${amount.toLocaleString("fr-FR")} F encaisses`,
      recordId: invoiceId,
      overview: getGarageOverviewPayload(),
    };
  }

  if (payload.action === "resolve_alert") {
    const alertId = safeText(payload.alertId, "");
    db.prepare("UPDATE alerts SET resolved_at = ? WHERE id = ?").run(nowIso, alertId);
    return {
      message: `Alerte ${alertId} resolue`,
      recordId: alertId,
      overview: getGarageOverviewPayload(),
    };
  }

  if (payload.action === "send_notification") {
    const notificationId = safeText(payload.notificationId, "");
    db.prepare("UPDATE notifications SET status = ?, sent_at = ? WHERE id = ?").run("envoye", nowIso, notificationId);
    return {
      message: `Relance ${notificationId} envoyee`,
      recordId: notificationId,
      overview: getGarageOverviewPayload(),
    };
  }

  throw new Error("unsupported action");
}

export function runClientPortalActionInDb(clientId = "c-001", payload: ClientPortalActionPayload) {
  const db = getDatabase();
  const now = new Date();
  const nowIso = now.toISOString();

  if (payload.action === "approve_estimate") {
    const estimateId = safeText(payload.estimateId, "");
    if (!estimateBelongsToClient(db, estimateId, clientId)) throw new Error("estimate forbidden");
    const result = runGarageActionInDb({ action: "approve_estimate", estimateId });
    return {
      message: result.message,
      recordId: result.recordId,
      portal: getClientPortalFromDb(clientId),
    };
  }

  if (payload.action === "record_payment") {
    const invoiceId = safeText(payload.invoiceId, "");
    if (!invoiceBelongsToClient(db, invoiceId, clientId)) throw new Error("invoice forbidden");
    const result = runGarageActionInDb({
      action: "record_payment",
      invoiceId,
      amount: payload.amount,
      method: payload.method || "wave",
    });
    return {
      message: result.message,
      recordId: result.recordId,
      portal: getClientPortalFromDb(clientId),
    };
  }

  if (payload.action === "request_callback") {
    const vehicleId = safeText(payload.vehicleId, "");
    const vehicle = db
      .prepare<{ id: string }>("SELECT id FROM vehicles WHERE id = ? AND client_id = ? LIMIT 1")
      .get(vehicleId, clientId);
    if (!vehicle) throw new Error("vehicle forbidden");

    const notificationId = slugId("not");
    db.prepare(
      "INSERT INTO notifications (id, client_id, vehicle_id, channel, template, status, scheduled_for, sent_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(
      notificationId,
      clientId,
      vehicle.id,
      "whatsapp",
      safeText(payload.reason, "Client demande un rappel atelier"),
      "pret",
      nowIso,
      null
    );

    return {
      message: "Demande de rappel envoyee au garage",
      recordId: notificationId,
      portal: getClientPortalFromDb(clientId),
    };
  }

  throw new Error("unsupported client action");
}

export function getClientPortalFromDb(clientId = "c-001") {
  const db = getDatabase();
  const client = db.prepare("SELECT * FROM clients WHERE id = ?").get(clientId);
  const vehicles = db.prepare(`
    SELECT id, brand, model, plate, mileage, health_score AS healthScore, insurance_due AS insuranceDue,
      inspection_due AS inspectionDue, oil_due_km AS oilDueKm
    FROM vehicles
    WHERE client_id = ?
  `).all(clientId);

  const vehicleId = (vehicles[0] as { id?: string } | undefined)?.id || "v-001";
  const alerts = db.prepare(`
    SELECT id, type, label, due, severity, source
    FROM alerts
    WHERE vehicle_id = ? AND resolved_at IS NULL
    ORDER BY created_at DESC
  `).all(vehicleId);

  const signals = db.prepare(`
    SELECT s.id, s.metric, s.value, s.status, s.updated_at AS updatedAt
    FROM telemetry_signals s
    WHERE s.vehicle_id = ?
    ORDER BY s.updated_at DESC
  `).all(vehicleId);

  const documents = db.prepare(`
    SELECT id, type, label, status, expires_at AS expiresAt, file_ref AS fileRef
    FROM vehicle_documents
    WHERE vehicle_id = ?
    ORDER BY created_at DESC
  `).all(vehicleId);

  const estimates = db.prepare(`
    SELECT e.id, e.status, e.total, w.operation
    FROM estimates e
    JOIN work_orders w ON w.id = e.work_order_id
    WHERE e.client_id = ?
    ORDER BY e.created_at DESC
  `).all(clientId);

  const invoices = db.prepare(`
    SELECT i.id, i.status, i.total, i.due_at AS dueAt, COALESCE(SUM(p.amount), 0) AS paid
    FROM invoices i
    JOIN estimates e ON e.id = i.estimate_id
    LEFT JOIN payments p ON p.invoice_id = i.id AND p.status = 'recu'
    WHERE e.client_id = ?
    GROUP BY i.id
    ORDER BY i.created_at DESC
  `).all(clientId);

  return { client, vehicles, alerts, signals, documents, estimates, invoices };
}
