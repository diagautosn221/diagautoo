"use client";

import { type FormEvent, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CockpitHero } from "@/components/carnet/CockpitHero";
import { QuickActionsDock, type QuickAction } from "@/components/carnet/QuickActionsDock";
import { MaintenanceTimeline, type TimelineEntry } from "@/components/carnet/MaintenanceTimeline";
import { useCarnetDashboard } from "@/hooks/useCarnetDashboard";

type PortalVehicle = {
  id?: string;
  brand?: string;
  model?: string;
  plate?: string;
  healthScore?: number;
  mileage?: number;
  insuranceDue?: string;
  inspectionDue?: string;
  oilDueKm?: number;
};

type PortalClient = {
  full_name?: string;
  phone?: string;
  city?: string;
};

type PortalAlert = {
  id?: string;
  type?: string;
  label?: string;
  due?: string;
  severity?: string;
  source?: string;
};

type PortalSignal = {
  id?: string;
  metric?: string;
  value?: string;
  updatedAt?: string;
  status?: string;
};

type PortalDocument = {
  id?: string;
  label?: string;
  status?: string;
  expiresAt?: string | null;
};

type PortalEstimate = {
  id?: string;
  status?: string;
  total?: number;
  operation?: string;
};

type PortalInvoice = {
  id?: string;
  status?: string;
  total?: number;
  paid?: number;
  dueAt?: string;
};

export type ClientPortalData = {
  client?: PortalClient;
  vehicles: PortalVehicle[];
  alerts: PortalAlert[];
  signals: PortalSignal[];
  documents: PortalDocument[];
  estimates: PortalEstimate[];
  invoices: PortalInvoice[];
};

type ClientActionResponse = {
  message: string;
  recordId: string;
  portal: ClientPortalData;
};

type DriverIntelligence = {
  tone: "ok" | "watch" | "urgent" | "blocked";
  verdict: string;
  headline: string;
  cause: string;
  action: string;
  evidence: string[];
};

function severityClass(severity?: string) {
  if (severity === "blocked") return "border-[var(--color-danger)]/45 bg-[var(--color-danger)]/12 text-[var(--color-danger)]";
  if (severity === "urgent") return "border-[var(--color-accent)]/45 bg-[var(--color-accent)]/12 text-[var(--color-accent)]";
  if (severity === "watch") return "border-[var(--color-warn)]/45 bg-[var(--color-warn)]/12 text-[var(--color-warn)]";
  return "border-[var(--color-success)]/35 bg-[var(--color-success)]/10 text-[var(--color-success)]";
}

function formatMoney(value?: number) {
  return `${(value ?? 0).toLocaleString("fr-FR")} F`;
}

function PortalSectionHeader({ eyebrow, title, count }: { eyebrow: string; title: string; count?: number | string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.045em]">{title}</h2>
      </div>
      {count !== undefined ? (
        <span className="rounded-[10px] border border-[var(--color-border)] bg-white/[0.035] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-accent)]">
          {count}
        </span>
      ) : null}
    </div>
  );
}

function buildQuickActions(
  runClientAction: (actionId: string, payload: Record<string, unknown>) => Promise<void>,
  busy: boolean,
  vehicleId?: string
): QuickAction[] {
  void busy;
  return [
    {
      id: "request_scan",
      label: "Demander un scan",
      status: "OBD-II",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 12h4l3-9 4 18 3-9h4" />
        </svg>
      ),
      onTrigger: () =>
        runClientAction("request_scan", {
          action: "request_scan",
          vehicleId: vehicleId ?? "",
          reason: "Demande client depuis le carnet",
        }),
    },
    {
      id: "request_rdv",
      label: "Prendre rendez-vous",
      status: "atelier Dakar",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      ),
      onTrigger: () =>
        runClientAction("request_rdv", {
          action: "request_callback",
          vehicleId: vehicleId ?? "",
          reason: "Demande de rendez-vous depuis le carnet",
        }),
    },
    {
      id: "call_atelier",
      label: "Appeler l'atelier",
      status: "support 24/7",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      onTrigger: () => {
        window.location.href = "tel:+221770000000";
        return Promise.resolve();
      },
    },
    {
      id: "share_documents",
      label: "Mes documents",
      status: "à jour",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M9 14h6M9 18h6" />
        </svg>
      ),
      onTrigger: () => Promise.resolve(),
    },
    {
      id: "locate",
      label: "Localiser",
      status: "GPS atelier",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      onTrigger: () => Promise.resolve(),
    },
    {
      id: "history",
      label: "Historique",
      status: "interventions",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 3v5h5M3 8a9 9 0 1 0 3-6.7" />
          <path d="M12 7v5l3 2" />
        </svg>
      ),
      onTrigger: () => Promise.resolve(),
    },
  ];
}

function buildTimelineEntries(portal: ClientPortalData): TimelineEntry[] {
  const entries: TimelineEntry[] = [];

  (portal.alerts ?? []).forEach((alert, index) => {
    const sev =
      alert.severity === "blocked"
        ? "blocked"
        : alert.severity === "urgent"
        ? "urgent"
        : alert.severity === "watch"
        ? "watch"
        : "ok";
    entries.push({
      id: `alert-${alert.id ?? alert.type ?? alert.label ?? index}`,
      date: alert.due ?? "à venir",
      label: alert.label ?? "Alerte enregistrée",
      detail: alert.source ? `Source · ${alert.source}` : undefined,
      state: "upcoming",
      severity: sev,
    });
  });

  (portal.estimates ?? []).forEach((est, index) => {
    entries.push({
      id: `est-${est.id ?? est.operation ?? index}`,
      date: est.status ?? "—",
      label: est.operation ?? "Devis atelier",
      detail: undefined,
      costFcfa: est.total,
      state: "past",
      severity: "ok",
    });
  });

  (portal.invoices ?? []).forEach((inv, index) => {
    entries.push({
      id: `inv-${inv.id ?? index}`,
      date: inv.dueAt ?? "—",
      label: `Facture · ${inv.status ?? "—"}`,
      detail: `Reglé ${(inv.paid ?? 0).toLocaleString("fr-FR")} / ${(inv.total ?? 0).toLocaleString("fr-FR")} F CFA`,
      costFcfa: inv.total,
      state: inv.status === "regle" ? "past" : "upcoming",
      severity: inv.status === "regle" ? "ok" : "watch",
    });
  });

  if (entries.length === 0) {
    entries.push({
      id: "warmup",
      date: "live",
      label: "Carnet ouvert — premières données en cours d'ingestion",
      state: "today",
      severity: "ok",
    });
  }

  return entries.slice(0, 10);
}

function buildDriverIntelligence({
  healthScore,
  alerts,
  signals,
  deviceLastSeen,
}: {
  healthScore: number;
  alerts: PortalAlert[];
  signals: PortalSignal[];
  deviceLastSeen?: string | null;
}): DriverIntelligence {
  const rank: Record<DriverIntelligence["tone"], number> = { ok: 0, watch: 1, urgent: 2, blocked: 3 };
  const normalise = (value?: string): DriverIntelligence["tone"] => {
    if (value === "blocked") return "blocked";
    if (value === "urgent") return "urgent";
    if (value === "watch") return "watch";
    return "ok";
  };

  const alert = [...alerts].sort((a, b) => rank[normalise(b.severity)] - rank[normalise(a.severity)])[0];
  const signal = [...signals].sort((a, b) => rank[normalise(b.status)] - rank[normalise(a.status)])[0];
  const alertTone = normalise(alert?.severity);
  const signalTone = normalise(signal?.status);
  let tone: DriverIntelligence["tone"] =
    rank[alertTone] >= rank[signalTone] ? alertTone : signalTone;

  if (healthScore < 58) tone = "blocked";
  else if (healthScore < 70 && rank[tone] < rank.urgent) tone = "urgent";
  else if (healthScore < 82 && rank[tone] < rank.watch) tone = "watch";

  const top = rank[alertTone] >= rank[signalTone] ? alert : undefined;
  const cause =
    top?.source ||
    top?.label ||
    (signal ? `${signal.metric ?? "Signal IoT"} · ${signal.value ?? "valeur instable"}` : "Aucune anomalie critique");

  if (tone === "blocked") {
    return {
      tone,
      verdict: "Stopper et appeler",
      headline: "Le système recommande de ne pas continuer sans contrôle atelier.",
      cause,
      action: "Contactez DiagAutoSN. Un technicien doit valider le véhicule avant reprise.",
      evidence: [
        `${alerts.length} alerte(s) active(s)`,
        `Score santé ${healthScore}/100`,
        deviceLastSeen ? `Kit vu à ${new Date(deviceLastSeen).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}` : "Kit IoT en attente",
      ],
    };
  }

  if (tone === "urgent") {
    return {
      tone,
      verdict: "Atelier recommandé",
      headline: "Vous pouvez vous déplacer prudemment, mais le véhicule doit être contrôlé.",
      cause,
      action: "Demandez un scan atelier ou prenez rendez-vous dans la journée.",
      evidence: [
        `${alerts.length} alerte(s) à traiter`,
        `Score santé ${healthScore}/100`,
        `${signals.length} flux IoT analysé(s)`,
      ],
    };
  }

  if (tone === "watch") {
    return {
      tone,
      verdict: "À surveiller",
      headline: "Le véhicule roule, mais un point mérite votre attention.",
      cause,
      action: "Gardez le suivi actif et planifiez un contrôle si le signal revient.",
      evidence: [
        `${alerts.length} rappel(s) ou alerte(s)`,
        `Score santé ${healthScore}/100`,
        "Surveillance continue active",
      ],
    };
  }

  return {
    tone,
    verdict: "Vous pouvez rouler",
    headline: "Aucun signal critique détecté sur le dernier cycle IoT.",
    cause: "Systèmes principaux nominalement stables",
    action: "Continuez le suivi. Le carnet vous prévient dès qu'un seuil change.",
    evidence: [
      "Alerte critique: 0",
      `Score santé ${healthScore}/100`,
      `${signals.length} flux IoT synchronisé(s)`,
    ],
  };
}

function MiniSignal({ status }: { status?: string }) {
  const level = status === "blocked" ? 5 : status === "urgent" ? 4 : status === "watch" ? 3 : 2;
  return (
    <div className="flex h-7 items-end gap-1">
      {[1, 2, 3, 4, 5].map((item) => (
        <span
          key={item}
          className={`w-1 rounded-full ${item <= level ? "bg-[var(--color-accent)]" : "bg-white/10"}`}
          style={{ height: `${8 + item * 3}px` }}
        />
      ))}
    </div>
  );
}

export function ClientPortal({ initialPortal }: { initialPortal: ClientPortalData }) {
  const [portal, setPortal] = useState<ClientPortalData>(initialPortal);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const vehicle = portal.vehicles[0];
  const clientName = portal.client?.full_name || "Votre vehicule";
  const vehicleLabel = `${vehicle?.brand || "Toyota"} ${vehicle?.model || "Prado"}`;

  async function runClientAction(actionId: string, payload: Record<string, unknown>) {
    setBusyAction(actionId);
    setError(null);
    try {
      const response = await fetch("/api/client/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as ClientActionResponse | { error?: string };
      if (!response.ok || !("portal" in result)) throw new Error("error" in result ? result.error : "Action refusee");
      setPortal(result.portal);
      setMessage(result.message);
    } catch {
      setError("Action impossible depuis le compte client.");
    } finally {
      setBusyAction(null);
    }
  }

  async function submitVehicleProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!vehicle?.id) return;
    const form = new FormData(event.currentTarget);
    await runClientAction("vehicle_profile", {
      action: "update_vehicle_profile",
      vehicleId: vehicle.id,
      brand: String(form.get("brand") || ""),
      model: String(form.get("model") || ""),
      plate: String(form.get("plate") || ""),
      mileage: Number(form.get("mileage") || 0),
      insuranceDue: String(form.get("insuranceDue") || ""),
      inspectionDue: String(form.get("inspectionDue") || ""),
      oilDueKm: Number(form.get("oilDueKm") || 0),
    });
  }

  const alertCount = portal.alerts?.length ?? 0;

  // Live sync — polls /api/carnet/dashboard every 10s. The first vehicle
  // we own is the one displayed in the cockpit (matches the legacy logic
  // that reads portal.vehicles[0]).
  const { dashboards, lastSyncedAt, isFetching } = useCarnetDashboard({
    vehicleId: vehicle?.id,
  });
  const liveDashboard = dashboards[0];
  const liveSignals = liveDashboard?.signals ?? portal.signals;
  const liveAlerts = liveDashboard?.alerts ?? portal.alerts;
  const lastServiceKm = liveDashboard?.vehicle.lastServiceKm;
  const deviceSerial = liveDashboard?.device.serial ?? null;
  const deviceLastSeen = liveDashboard?.device.lastSeen ?? null;
  const intelligence = useMemo(
    () =>
      buildDriverIntelligence({
        healthScore: vehicle?.healthScore ?? 78,
        alerts: liveAlerts,
        signals: liveSignals,
        deviceLastSeen,
      }),
    [vehicle?.healthScore, liveAlerts, liveSignals, deviceLastSeen]
  );

  const syncLabel = lastSyncedAt
    ? `synchro · ${Math.max(0, Math.round((Date.now() - lastSyncedAt.getTime()) / 1000))}s`
    : isFetching
    ? "synchro · …"
    : "synchro · attente";

  return (
    <main className="min-h-[100dvh] overflow-hidden py-8">
      <div className="container-tight">
        <section className="mb-6">
          <header className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                Dashboard temps réel · DiagAutoSN Carnet
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-4xl">
                Bonjour {clientName.split(" ")[0]}.
                <span className="ml-2 text-[var(--color-fg-muted)]">Voici l'état de votre {vehicleLabel}.</span>
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-muted)]">
              <span
                className={`size-1.5 rounded-full ${
                  isFetching ? "bg-[var(--color-accent)] live-dot" : "bg-[var(--color-success)]"
                }`}
              />
              {syncLabel}
            </span>
          </header>
          <DiagnosticDecisionCard intelligence={intelligence} />
          <CockpitHero
            brand={vehicle?.brand ?? "Toyota"}
            model={vehicle?.model ?? "Prado"}
            vehicleLabel={vehicleLabel}
            plate={vehicle?.plate}
            mileage={vehicle?.mileage ?? 0}
            healthScore={vehicle?.healthScore ?? 78}
            oilDueKm={vehicle?.oilDueKm}
            lastServiceKm={lastServiceKm}
            insuranceDue={vehicle?.insuranceDue}
            inspectionDue={vehicle?.inspectionDue}
            signals={liveSignals}
            alerts={liveAlerts}
            deviceSerial={deviceSerial}
            lastSeen={deviceLastSeen}
          />
        </section>

        <section className="mb-6">
          <QuickActionsDock
            title="Actions rapides · carnet"
            actions={buildQuickActions(runClientAction, busyAction !== null, vehicle?.id)}
          />
        </section>

        <section className="mb-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <MaintenanceTimeline
            entries={buildTimelineEntries(portal)}
            title="Carnet de bord · interventions & alertes"
          />
          <div className="panel rounded-[20px] p-5 md:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
              Documents · accès rapide
            </p>
            <h3 className="mt-1.5 font-display text-lg font-semibold tracking-[-0.02em]">
              Vos pièces véhicule
            </h3>
            <ul className="mt-4 space-y-2">
              {(portal.documents ?? []).slice(0, 5).map((doc) => {
                const expSoon =
                  !!doc.expiresAt && new Date(doc.expiresAt).getTime() - Date.now() < 60 * 86400000;
                return (
                  <li
                    key={doc.id}
                    className="hairline-card flex items-start justify-between gap-3 rounded-[12px] p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-fg)]">{doc.label}</p>
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                        {doc.status?.replace(/_/g, " ")}
                        {doc.expiresAt ? ` · exp ${doc.expiresAt}` : ""}
                      </p>
                    </div>
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.14em]"
                      style={{
                        color: expSoon ? "var(--color-warn)" : "var(--color-success)",
                      }}
                    >
                      {expSoon ? "bientôt" : "ok"}
                    </span>
                  </li>
                );
              })}
              {(portal.documents ?? []).length === 0 && (
                <li className="text-sm text-[var(--color-fg-muted)]">Aucun document partagé pour le moment.</li>
              )}
            </ul>
          </div>
        </section>
        <section className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="panel rounded-[24px] p-5 md:p-6">
            <PortalSectionHeader eyebrow="compte personnel" title="Dossier connecté" count="privé" />

            <AnimatePresence>
              {message ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-6 rounded-[16px] border border-[var(--color-success)]/35 bg-[var(--color-success)]/10 p-4 text-sm font-semibold text-[var(--color-success)]"
                >
                  {message}
                </motion.div>
              ) : null}
            </AnimatePresence>
            {error ? (
              <div className="mt-6 rounded-[16px] border border-[var(--color-danger)]/35 bg-[var(--color-danger)]/10 p-4 text-sm font-semibold text-[var(--color-danger)]">
                {error}
              </div>
            ) : null}

            <div className="mt-5 grid gap-3">
              <div className="rounded-[16px] border border-[var(--color-border)] bg-white p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                  Propriétaire
                </p>
                <p className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[var(--color-fg)]">{clientName}</p>
                <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                  {portal.client?.phone ?? "Téléphone à compléter"}
                  {portal.client?.city ? ` · ${portal.client.city}` : ""}
                </p>
              </div>

              {[
                ["Assurance", vehicle?.insuranceDue || "à confirmer"],
                ["Visite technique", vehicle?.inspectionDue || "à confirmer"],
                ["Prochaine vidange", `${(vehicle?.oilDueKm ?? 0).toLocaleString("fr-FR")} km`],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3">
                  <span className="text-sm font-semibold text-[var(--color-fg)]">{label}</span>
                  <span className="tabular text-right font-mono text-xs uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">
                    {value}
                  </span>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  runClientAction("callback", {
                    action: "request_callback",
                    vehicleId: vehicle?.id,
                    reason: "Client demande un rappel depuis le carnet connecté",
                  })
                }
                disabled={busyAction === "callback" || !vehicle?.id}
                className="min-h-12 w-full rounded-[14px] bg-[var(--color-accent)] px-4 font-black text-[var(--color-accent-ink)] shadow-[0_18px_48px_rgba(223,68,56,0.18)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busyAction === "callback" ? "Envoi..." : "Demander un rappel atelier"}
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            <section className="panel rounded-[26px] p-5">
              <PortalSectionHeader eyebrow="personnalisation" title="Details de votre voiture" count="modifiable" />
              <form onSubmit={submitVehicleProfile} className="mt-5 grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Marque", "brand", vehicle?.brand || ""],
                    ["Modele", "model", vehicle?.model || ""],
                    ["Plaque", "plate", vehicle?.plate || ""],
                    ["Kilometrage", "mileage", String(vehicle?.mileage ?? 0)],
                    ["Assurance", "insuranceDue", vehicle?.insuranceDue || ""],
                    ["Visite technique", "inspectionDue", vehicle?.inspectionDue || ""],
                    ["Prochaine vidange", "oilDueKm", String(vehicle?.oilDueKm ?? 0)],
                  ].map(([label, name, value]) => (
                    <label key={name} className="grid gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                        {label}
                      </span>
                      <input
                        name={name}
                        type={name === "mileage" || name === "oilDueKm" ? "number" : "text"}
                        defaultValue={value}
                        className="command-input min-h-11 rounded-[12px] px-3 text-sm text-[var(--color-fg)] outline-none"
                      />
                    </label>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={busyAction === "vehicle_profile" || !vehicle?.id}
                  className="min-h-12 rounded-[14px] bg-[var(--color-accent)] px-4 font-black text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busyAction === "vehicle_profile" ? "Mise a jour..." : "Enregistrer mes details"}
                </button>
              </form>
            </section>

            <section className="panel rounded-[26px] p-5">
              <PortalSectionHeader eyebrow="priorites conducteur" title="Alertes vehicule" count={portal.alerts.length} />
              <div className="mt-5 grid gap-3">
                {portal.alerts.length > 0 ? (
                  portal.alerts.map((alert) => (
                    <article key={alert.id} className="field-surface overflow-hidden rounded-[18px] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-black tracking-[-0.03em]">{alert.label}</h3>
                          <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{alert.due}</p>
                        </div>
                        <span className={`rounded-lg border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${severityClass(alert.severity)}`}>
                          {alert.type}
                        </span>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-[var(--color-fg-subtle)]">{alert.source}</p>
                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: "18%" }}
                          animate={{ width: alert.severity === "blocked" ? "92%" : alert.severity === "urgent" ? "78%" : "54%" }}
                          className="h-full rounded-full bg-[var(--color-accent)]"
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[16px] border border-[var(--color-border)] bg-white/[0.025] p-4 text-sm text-[var(--color-fg-muted)]">
                    Aucune alerte ouverte pour ce vehicule.
                  </div>
                )}
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div className="panel rounded-[26px] p-5">
                <PortalSectionHeader eyebrow="devis a valider" title="Decision client" count={portal.estimates.length} />
                <div className="mt-5 grid gap-3">
                  {portal.estimates.map((estimate) => (
                    <article key={estimate.id} className="field-surface rounded-[18px] p-4">
                      <h3 className="font-black tracking-[-0.03em]">{estimate.operation}</h3>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">{estimate.status}</span>
                        <span className="tabular font-mono text-sm font-black text-[var(--color-accent)]">
                          {formatMoney(estimate.total)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => runClientAction(`approve_${estimate.id}`, { action: "approve_estimate", estimateId: estimate.id })}
                        disabled={busyAction === `approve_${estimate.id}` || estimate.status === "approuve"}
                        className="mt-4 min-h-10 w-full rounded-[12px] border border-[var(--color-border)] bg-white/[0.04] px-3 text-sm font-semibold transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {estimate.status === "approuve" ? "Devis approuve" : "Approuver le devis"}
                      </button>
                    </article>
                  ))}
                </div>
              </div>

              <div className="panel rounded-[26px] p-5">
                <PortalSectionHeader eyebrow="paiement" title="Factures" count={portal.invoices.length} />
                <div className="mt-5 grid gap-3">
                  {portal.invoices.map((invoice) => {
                    const remaining = Math.max((invoice.total ?? 0) - (invoice.paid ?? 0), 0);
                    return (
                      <article key={invoice.id} className="field-surface rounded-[18px] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-black tracking-[-0.03em]">Facture {invoice.id}</h3>
                          <span className="font-mono text-xs text-[var(--color-fg-subtle)]">{invoice.status}</span>
                        </div>
                        <div className="mt-3 tabular font-mono text-sm">
                          {formatMoney(invoice.paid)} / {formatMoney(invoice.total)}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            runClientAction(`pay_${invoice.id}`, {
                              action: "record_payment",
                              invoiceId: invoice.id,
                              amount: remaining,
                              method: "wave",
                            })
                          }
                          disabled={busyAction === `pay_${invoice.id}` || remaining <= 0}
                          className="mt-4 min-h-10 w-full rounded-[12px] bg-[var(--color-accent)] px-3 text-sm font-semibold text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          {remaining <= 0 ? "Facture payee" : `Payer ${formatMoney(remaining)}`}
                        </button>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div className="panel rounded-[26px] p-5">
                <PortalSectionHeader eyebrow="boitier IoT" title="Signaux live" count={`${portal.signals.length} flux`} />
                <div className="mt-5 grid gap-3">
                  {portal.signals.map((signal) => (
                    <article key={signal.id} className="field-surface rounded-[18px] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
                          {signal.metric}
                        </span>
                        <span className={`rounded-md border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${severityClass(signal.status)}`}>
                          {signal.status || "ok"}
                        </span>
                      </div>
                      <div className="mt-3 flex items-end justify-between gap-4">
                        <div className="tabular font-mono text-xl font-black">{signal.value}</div>
                        <MiniSignal status={signal.status} />
                      </div>
                      <p className="mt-2 text-xs text-[var(--color-fg-muted)]">{signal.updatedAt}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="panel rounded-[26px] p-5">
                <PortalSectionHeader eyebrow="coffre vehicule" title="Documents" count={portal.documents.length} />
                <div className="mt-5 grid gap-3">
                  {portal.documents.map((document) => (
                    <article key={document.id} className="field-surface rounded-[18px] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-black tracking-[-0.03em]">{document.label}</h3>
                          <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{document.expiresAt || "Document permanent"}</p>
                        </div>
                        <span className="rounded-lg border border-[var(--color-border)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-accent)]">
                          {document.status}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function DiagnosticDecisionCard({ intelligence }: { intelligence: DriverIntelligence }) {
  const colorByTone: Record<DriverIntelligence["tone"], string> = {
    ok: "var(--color-success)",
    watch: "var(--color-warn)",
    urgent: "var(--color-accent)",
    blocked: "var(--color-danger)",
  };
  const color = colorByTone[intelligence.tone];

  return (
    <section
      className="mb-4 overflow-hidden rounded-[20px] border bg-white p-4 shadow-[0_18px_60px_color-mix(in_srgb,var(--color-fg)_8%,transparent)] md:p-5"
      style={{ borderColor: `color-mix(in srgb, ${color} 34%, var(--color-border))` }}
      aria-label="Diagnostic intelligent conducteur"
    >
      <div className="grid gap-4 md:grid-cols-[0.84fr_1.16fr] md:items-center">
        <div className="flex items-center gap-3">
          <span
            className="grid size-12 shrink-0 place-items-center rounded-[14px] border"
            style={{
              borderColor: `color-mix(in srgb, ${color} 35%, transparent)`,
              background: `color-mix(in srgb, ${color} 10%, transparent)`,
              color,
            }}
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M12 3l8 4v5c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V7l8-4z" />
              <path d="M9 12l2 2 4-5" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
              Diagnostic intelligent · décision conducteur
            </p>
            <h3 className="mt-1 font-display text-2xl font-semibold tracking-[-0.035em]" style={{ color }}>
              {intelligence.verdict}
            </h3>
          </div>
        </div>

        <div className="grid gap-3">
          <p className="text-sm font-semibold leading-6 text-[var(--color-fg)]">{intelligence.headline}</p>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                Cause probable
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-fg-muted)]">{intelligence.cause}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:justify-end">
              {intelligence.evidence.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.11em] text-[var(--color-fg-muted)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <p className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm font-semibold text-[var(--color-fg)]">
            {intelligence.action}
          </p>
        </div>
      </div>
    </section>
  );
}
