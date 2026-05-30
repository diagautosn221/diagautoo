"use client";

import { useMemo } from "react";
import { RangeBar } from "./RangeBar";
import {
  PhotoCockpit,
  type PhotoCockpitAlert,
  type PhotoCockpitSeverity,
} from "./PhotoCockpit";
import { VitalGrid, type VitalMetric, type VitalStatus } from "./VitalGrid";
import { TelemetryFeed, type TelemetryEntry, type FeedSeverity } from "./TelemetryFeed";

type Signal = {
  id?: string;
  metric?: string;
  value?: string;
  status?: string;
  updatedAt?: string;
};

type Alert = {
  id?: string;
  type?: string;
  label?: string;
  severity?: string;
  due?: string;
  source?: string;
};

type CockpitHeroProps = {
  brand: string;
  model: string;
  /** Display label for the photo overlay (usually `${brand} ${model}`). */
  vehicleLabel: string;
  plate?: string;
  vin?: string;
  mileage: number;
  healthScore: number;
  oilDueKm?: number;
  lastServiceKm?: number;
  insuranceDue?: string;
  inspectionDue?: string;
  signals?: Signal[];
  alerts?: Alert[];
  deviceSerial?: string | null;
  lastSeen?: string | null;
};

const sevMap: Record<string, FeedSeverity> = {
  ok: "info",
  watch: "watch",
  urgent: "urgent",
  blocked: "blocked",
};

const photoSevMap: Record<string, PhotoCockpitSeverity> = {
  ok: "ok",
  watch: "watch",
  urgent: "urgent",
  blocked: "blocked",
};

const vitalSevMap: Record<string, VitalStatus> = {
  ok: "ok",
  watch: "warn",
  urgent: "alert",
  blocked: "alert",
};

function prettyTime(iso?: string) {
  if (!iso || iso === "live" || iso === "—") return "live";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function dueETA(due?: string) {
  if (!due || due === "—") return undefined;
  const date = new Date(due);
  if (Number.isNaN(date.getTime())) return due;
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function lastServiceFloor(_mileage: number, nextServiceKm: number) {
  return Math.max(0, nextServiceKm - 4000);
}

export function CockpitHero({
  brand,
  model,
  vehicleLabel,
  plate,
  vin,
  mileage,
  healthScore,
  oilDueKm,
  lastServiceKm,
  insuranceDue,
  inspectionDue,
  signals = [],
  alerts = [],
  deviceSerial,
  lastSeen,
}: CockpitHeroProps) {
  const photoAlerts = useMemo<PhotoCockpitAlert[]>(() => {
    return alerts.slice(0, 6).map((alert, index) => ({
      id: alert.id ?? `alert-${index}`,
      label: alert.label ?? "Alerte enregistrée",
      source: alert.source ?? alert.type,
      severity: photoSevMap[(alert.severity ?? "watch").toLowerCase()] ?? "watch",
    }));
  }, [alerts]);

  const metrics = useMemo<VitalMetric[]>(() => {
    if (signals.length > 0) {
      return signals.slice(0, 6).map((s, index) => ({
        key: s.id ?? `${s.metric ?? "signal"}-${index}`,
        label: s.metric ?? "Signal",
        value: (s.value ?? "—").split(" ")[0] ?? "—",
        unit: (s.value ?? "").split(" ").slice(1).join(" ") || undefined,
        status: vitalSevMap[(s.status ?? "ok").toLowerCase()] ?? "ok",
        trend: "stable",
        caption: s.updatedAt ? `MAJ · ${prettyTime(s.updatedAt)}` : undefined,
      }));
    }
    return [
      { key: "battery", label: "Tension batterie", value: healthScore > 80 ? "12.6" : "12.1", unit: "V", status: healthScore > 80 ? "ok" : "warn", trend: "stable", caption: "valeur démo" },
      { key: "oil", label: "Niveau huile", value: healthScore > 70 ? "92" : "68", unit: "%", status: healthScore > 70 ? "ok" : "warn", trend: "down", caption: "depuis vidange" },
      { key: "brake", label: "Plaquettes AV", value: healthScore > 75 ? "78" : "32", unit: "%", status: healthScore > 75 ? "ok" : "alert", trend: "down", caption: "épaisseur" },
      { key: "tire", label: "Pression pneus", value: "2.3", unit: "bar", status: "ok", trend: "stable", caption: "moyenne 4 roues" },
      { key: "coolant", label: "Refroid.", value: healthScore > 70 ? "89" : "55", unit: "%", status: healthScore > 70 ? "ok" : "warn", trend: "stable" },
      { key: "mil", label: "Voyant moteur", value: healthScore < 70 ? "ON" : "OFF", status: healthScore < 70 ? "alert" : "ok", trend: "stable" },
    ];
  }, [signals, healthScore]);

  const feed = useMemo<TelemetryEntry[]>(() => {
    const entries: TelemetryEntry[] = [];
    alerts.forEach((alert, i) => {
      entries.push({
        id: `alert-${alert.id ?? i}`,
        at: prettyTime(alert.due),
        vehicle: `${vehicleLabel} · ${plate ?? "—"}`,
        source: alert.source ?? alert.type ?? "Alerte",
        severity: sevMap[(alert.severity ?? "watch").toLowerCase()] ?? "watch",
        message: alert.label ?? "Alerte enregistrée.",
      });
    });
    signals.slice(0, 8).forEach((signal, i) => {
      entries.push({
        id: `signal-${signal.id ?? i}`,
        at: prettyTime(signal.updatedAt),
        vehicle: `${vehicleLabel} · ${plate ?? "—"}`,
        source: signal.metric ?? "Signal",
        severity: sevMap[(signal.status ?? "ok").toLowerCase()] ?? "info",
        message: `${signal.metric ?? "Signal véhicule"} · ${signal.value ?? "—"}`,
      });
    });
    if (entries.length === 0) {
      entries.push({
        id: "warmup",
        at: "live",
        vehicle: `${vehicleLabel} · ${plate ?? "—"}`,
        source: "Connexion véhicule",
        severity: "info",
        message: "Lecture du boîtier en cours. Les informations arrivent.",
      });
    }
    return entries;
  }, [alerts, signals, vehicleLabel, plate]);

  const oilTarget = oilDueKm && oilDueKm > 0 ? oilDueKm : mileage + 4000;
  const oilLast =
    typeof lastServiceKm === "number" && lastServiceKm >= 0
      ? lastServiceKm
      : lastServiceFloor(mileage, oilTarget);

  return (
    <div className="grid gap-4">
      {/* ── HERO PHOTO ──────────────────────────────────────────────── */}
      <PhotoCockpit
        brand={brand}
        model={model}
        vehicleLabel={vehicleLabel}
        plate={plate}
        vin={vin}
        mileage={mileage}
        healthScore={healthScore}
        alerts={photoAlerts}
        lastSeenAt={lastSeen}
      />

      {/* ── RANGE + COUNTDOWNS (Tesla-style "you have X km / Y days left") ─ */}
      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]">
        <RangeBar
          currentKm={mileage}
          nextServiceKm={oilTarget}
          lastServiceKm={oilLast}
          serviceLabel="Prochaine vidange"
        />
        {insuranceDue && <DueCountdown label="Assurance" dueDate={insuranceDue} icon={<ShieldIcon />} />}
        {inspectionDue && <DueCountdown label="Visite technique" dueDate={inspectionDue} icon={<ClipboardIcon />} />}
      </div>

      {/* ── DEVICE STRIP (silent identity bar) ─────────────────────── */}
      <div className="hairline-card flex flex-wrap items-center justify-between gap-3 rounded-[14px] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[var(--color-accent)] live-dot" />
          {deviceSerial ? `Kit ${deviceSerial}` : "Kit IoT · démo"}
          {lastSeen ? ` · vu ${prettyTime(lastSeen)}` : ""}
        </span>
        <span className="tabular text-[var(--color-fg)]">
          {plate ?? "—"} · {mileage.toLocaleString("fr-FR")} km{vin ? ` · VIN ${vin.slice(-6)}` : ""}
        </span>
      </div>

      {/* ── VITALS + FEED ─────────────────────────────────────────── */}
      <div className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <VitalGrid metrics={metrics} />
        <TelemetryFeed entries={feed} rows={4} title="Lecture boîtier · votre véhicule" />
      </div>
    </div>
  );
}

function DueCountdown({
  label,
  dueDate,
  icon,
}: {
  label: string;
  dueDate: string;
  icon: React.ReactNode;
}) {
  const due = new Date(dueDate);
  const validDue = !Number.isNaN(due.getTime());
  const diffMs = validDue ? due.getTime() - Date.now() : 0;
  const days = validDue ? Math.round(diffMs / 86400000) : 0;
  const overdue = days < 0;
  const urgent = days >= 0 && days < 30;
  const color = overdue
    ? "var(--color-danger)"
    : urgent
    ? "var(--color-warn)"
    : "var(--color-success)";
  return (
    <div className="hairline-card rounded-[16px] p-4">
      <div className="flex items-start justify-between">
        <span
          className="grid size-8 place-items-center rounded-md border [&_svg]:size-4"
          style={{
            borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
            background: `color-mix(in srgb, ${color} 10%, transparent)`,
            color,
          }}
        >
          {icon}
        </span>
        <span
          className="font-mono text-[10px] uppercase tracking-[0.14em]"
          style={{ color }}
        >
          {!validDue ? "à vérifier" : overdue ? "retard" : urgent ? "bientôt" : "ok"}
        </span>
      </div>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
        {label}
      </p>
      <p className="tabular mt-1 font-display text-2xl font-semibold leading-none tracking-[-0.03em]">
        {validDue ? (overdue ? `+${Math.abs(days)}` : days) : "—"}
        <span className="ml-1 font-mono text-[11px] font-normal text-[var(--color-fg-muted)]">
          jours
        </span>
      </p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
        échéance · {dueETA(dueDate) ?? "non renseignée"}
      </p>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2l8 4v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V6l8-4z" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="6" y="4" width="12" height="18" rx="2" />
      <path d="M9 4V2h6v2M9 11h6M9 15h4" />
    </svg>
  );
}
