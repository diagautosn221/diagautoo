"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CockpitHero } from "@/components/carnet/CockpitHero";
import { useCarnetDashboard } from "@/hooks/useCarnetDashboard";
import type { CarnetVehicleDashboard } from "@/lib/db/diagauto";

type ClientInfo = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  createdAt: string | null;
};

type Props = {
  client: ClientInfo;
  initialVehicles: CarnetVehicleDashboard[];
};

export function AtelierClientCockpit({ client, initialVehicles }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeInitial = initialVehicles[activeIndex];

  const { dashboards, lastSyncedAt, isFetching, refresh } = useCarnetDashboard({
    vehicleId: activeInitial?.vehicle.id,
    initial: activeInitial ? [activeInitial] : [],
  });

  const liveSource = dashboards[0] ?? activeInitial;

  // Optimistic hide of alerts the atelier already resolved this session.
  // Cleared once the next poll tick brings a fresh dashboard server-side.
  const [hiddenAlertIds, setHiddenAlertIds] = useState<Set<string>>(() => new Set());
  const [actionBusy, setActionBusy] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const live = useMemo(() => {
    if (!liveSource) return null;
    if (hiddenAlertIds.size === 0) return liveSource;
    return {
      ...liveSource,
      alerts: liveSource.alerts.filter((a) => !hiddenAlertIds.has(a.id)),
    };
  }, [liveSource, hiddenAlertIds]);

  async function resolveAlert(alertId: string) {
    // Optimistic hide — UI updates instantly, no waiting for the 10s tick.
    setHiddenAlertIds((prev) => {
      const next = new Set(prev);
      next.add(alertId);
      return next;
    });
    setActionBusy(alertId);
    setActionMessage(null);
    try {
      const response = await fetch("/api/garage/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resolve_alert", alertId }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = (await response.json()) as { message?: string };
      setActionMessage(body.message ?? "Alerte traitée.");
      await refresh();
    } catch (error) {
      // Rollback the optimistic hide on failure.
      setHiddenAlertIds((prev) => {
        const next = new Set(prev);
        next.delete(alertId);
        return next;
      });
      setActionMessage(
        error instanceof Error ? `Erreur : ${error.message}` : "Action impossible."
      );
    } finally {
      setActionBusy(null);
    }
  }

  if (!live) {
    return (
      <div className="container-tight">
        <p className="panel rounded-[20px] p-6 text-center text-sm text-[var(--color-fg-muted)]">
          Aucun véhicule équipé pour ce client.
        </p>
      </div>
    );
  }

  const syncLabel = lastSyncedAt
    ? `synchro · ${Math.max(0, Math.round((Date.now() - lastSyncedAt.getTime()) / 1000))}s`
    : isFetching
    ? "synchro · …"
    : "synchro · attente";

  return (
    <div className="container-tight">
      {/* Client identity strip */}
      <section className="panel mb-6 rounded-[20px] p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
              Fiche client · vue atelier
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-4xl">
              {client.fullName}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
              {client.phone && <a href={`tel:${client.phone}`} className="hover:text-[var(--color-accent)]">{client.phone}</a>}
              {client.email && <a href={`mailto:${client.email}`} className="hover:text-[var(--color-accent)]">{client.email}</a>}
              {client.city && <span>{client.city}</span>}
              {client.createdAt && (
                <span className="text-[var(--color-fg-subtle)]">client depuis {client.createdAt.slice(0, 10)}</span>
              )}
            </div>
          </div>
          <span className="inline-flex items-center gap-2 self-start rounded-md border border-[var(--color-border)] bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-muted)] md:self-end">
            <span
              className={`size-1.5 rounded-full ${
                isFetching ? "bg-[var(--color-accent)] live-dot" : "bg-[var(--color-success)]"
              }`}
            />
            {syncLabel}
          </span>
        </div>

        {/* vehicle tabs */}
        {initialVehicles.length > 1 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {initialVehicles.map((v, i) => {
              const active = i === activeIndex;
              return (
                <button
                  key={v.vehicle.id}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition ${
                    active
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8 text-[var(--color-accent)]"
                      : "border-[var(--color-border)] bg-white text-[var(--color-fg-muted)] hover:border-[var(--color-fg-muted)]"
                  }`}
                >
                  {v.vehicle.brand} {v.vehicle.model} · {v.vehicle.plate}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <CockpitHero
        brand={live.vehicle.brand}
        model={live.vehicle.model}
        vehicleLabel={`${live.vehicle.brand} ${live.vehicle.model}`}
        plate={live.vehicle.plate}
        vin={live.vehicle.vin}
        mileage={live.vehicle.mileage}
        healthScore={live.vehicle.healthScore}
        oilDueKm={live.vehicle.oilDueKm}
        lastServiceKm={live.vehicle.lastServiceKm}
        insuranceDue={live.vehicle.insuranceDue}
        inspectionDue={live.vehicle.inspectionDue}
        signals={live.signals}
        alerts={live.alerts}
        deviceSerial={live.device.serial}
        lastSeen={live.device.lastSeen}
      />

      {/* Atelier-only — open alerts list with resolve action */}
      <section className="mt-6 panel rounded-[20px] p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
              Alertes ouvertes · action atelier
            </p>
            <h3 className="mt-1.5 font-display text-lg font-semibold tracking-[-0.02em]">
              {live.alerts.length} en attente
            </h3>
          </div>
          {actionMessage && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-md border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-success)]"
            >
              {actionMessage}
            </motion.span>
          )}
        </div>

        {live.alerts.length === 0 ? (
          <p className="text-sm text-[var(--color-fg-muted)]">
            Aucune alerte ouverte. Tout est nominal.
          </p>
        ) : (
          <ul className="grid gap-2">
            {live.alerts.map((alert) => (
              <li
                key={alert.id}
                className="hairline-card flex flex-wrap items-center justify-between gap-3 rounded-[12px] p-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                    <span
                      className="size-1.5 rounded-full"
                      style={{
                        background:
                          alert.severity === "blocked"
                            ? "var(--color-danger)"
                            : alert.severity === "urgent"
                            ? "var(--color-accent)"
                            : alert.severity === "watch"
                            ? "var(--color-warn)"
                            : "var(--color-success)",
                      }}
                    />
                    {alert.type} · {alert.source}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-fg)]">{alert.label}</p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
                    échéance · {alert.due?.slice(0, 10) || "—"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => resolveAlert(alert.id)}
                  disabled={actionBusy === alert.id}
                  className="inline-flex min-h-9 items-center justify-center rounded-[10px] bg-[var(--color-accent)] px-3 font-mono text-[10px] uppercase tracking-[0.14em] font-semibold text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px disabled:opacity-60"
                >
                  {actionBusy === alert.id ? "…" : "Résoudre"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Recent diagnostics + work orders */}
      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        <div className="panel rounded-[20px] p-5 md:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
            Diagnostics récents
          </p>
          <h3 className="mt-1.5 font-display text-lg font-semibold tracking-[-0.02em]">
            {live.diagnostics.length} entrées
          </h3>
          <ul className="mt-4 space-y-2">
            {live.diagnostics.slice(0, 6).map((d) => (
              <li key={d.id} className="hairline-card rounded-[12px] p-3">
                <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                  <span>{d.code}</span>
                  <span>{d.createdAt?.slice(0, 10)}</span>
                </div>
                <p className="mt-1 text-sm text-[var(--color-fg)]">{d.nextAction}</p>
              </li>
            ))}
            {live.diagnostics.length === 0 && (
              <li className="text-sm text-[var(--color-fg-muted)]">Aucun diagnostic enregistré.</li>
            )}
          </ul>
        </div>

        <div className="panel rounded-[20px] p-5 md:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
            Ordres de travail
          </p>
          <h3 className="mt-1.5 font-display text-lg font-semibold tracking-[-0.02em]">
            {live.workOrders.length} entrées
          </h3>
          <ul className="mt-4 space-y-2">
            {live.workOrders.slice(0, 6).map((w) => (
              <li key={w.id} className="hairline-card rounded-[12px] p-3">
                <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                  <span>{w.status}</span>
                  <span className="tabular">{(w.amount ?? 0).toLocaleString("fr-FR")} F</span>
                </div>
                <p className="mt-1 text-sm text-[var(--color-fg)]">{w.operation}</p>
              </li>
            ))}
            {live.workOrders.length === 0 && (
              <li className="text-sm text-[var(--color-fg-muted)]">Aucun ordre actif.</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
