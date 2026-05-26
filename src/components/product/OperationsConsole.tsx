"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { easings } from "@/lib/motion/easings";

type TabKey = "atelier" | "client" | "iot" | "alertes" | "finance";

type Overview = {
  updatedAt: string;
  summary: {
    clients: number;
    vehicles: number;
    connectedDevices: number;
    openWorkOrders: number;
    urgentAlerts: number;
    projectedRevenue: number;
  };
  alerts: Array<{
    id: string;
    type: string;
    label: string;
    vehicle: string;
    client: string;
    due: string;
    severity: "ok" | "watch" | "urgent" | "blocked";
    source: string;
  }>;
  clients: Array<{
    id: string;
    fullName: string;
    phone: string;
    city: string;
    vehicles: number;
    healthScore: number;
  }>;
  vehicles: Array<{
    id: string;
    client: string;
    label: string;
    plate: string;
    mileage: number;
    healthScore: number;
    serial: string;
    lastSeen: string;
  }>;
  team: Array<{
    id: string;
    fullName: string;
    role: string;
    bay: string;
    status: string;
    currentOperation: string | null;
  }>;
  inspections: Array<{
    id: string;
    status: string;
    score: number;
    failCount: number;
    attentionCount: number;
    photoCount: number;
    client: string;
    vehicle: string;
    inspector: string | null;
  }>;
  estimates: Array<{
    id: string;
    status: string;
    total: number;
    client: string;
    vehicle: string;
    operation: string;
  }>;
  invoices: Array<{
    id: string;
    status: string;
    total: number;
    dueAt: string;
    client: string;
    paid: number;
  }>;
  notifications: Array<{
    id: string;
    channel: string;
    template: string;
    status: string;
    scheduledFor: string;
    client: string;
    vehicle: string | null;
  }>;
  documents: Array<{
    id: string;
    type: string;
    label: string;
    status: string;
    expiresAt: string | null;
    fileRef: string;
    client: string;
    vehicle: string;
    plate: string;
  }>;
  workOrders: Array<{
    id: string;
    time: string;
    client: string;
    vehicle: string;
    operation: string;
    status: string;
    amount: number;
  }>;
  signals: Array<{
    id: string;
    vehicle: string;
    device: string;
    metric: string;
    value: string;
    status: "ok" | "watch" | "urgent" | "blocked";
    updatedAt: string;
  }>;
};

type CreatedDiagnostic = {
  id: string;
  time: string;
  client: string;
  vehicle: string;
  code: string;
  status: string;
  nextAction: string;
};

type LiveIotEvent = {
  id: string;
  vehicle: string;
  client: string;
  device: string;
  metric: string;
  value: string;
  status: "ok" | "watch" | "urgent" | "blocked";
  updatedAt: string;
};

type ReceptionForm = {
  clientName: string;
  phone: string;
  brand: string;
  model: string;
  plate: string;
  mileage: string;
  operation: string;
};

type GarageActionResponse = {
  message: string;
  recordId: string;
  overview: Overview;
};

const tabs: Array<{ key: TabKey; label: string; caption: string }> = [
  { key: "atelier", label: "Atelier", caption: "operations" },
  { key: "client", label: "Client", caption: "compte" },
  { key: "iot", label: "IoT", caption: "capteurs" },
  { key: "alertes", label: "Alertes", caption: "risques" },
  { key: "finance", label: "Ops", caption: "devis" },
];

const visualMarkers = [
  { label: "OBD", x: "47%", y: "38%", tone: "bg-[var(--color-danger)]" },
  { label: "huile", x: "34%", y: "58%", tone: "bg-[var(--color-warn)]" },
  { label: "gps", x: "65%", y: "50%", tone: "bg-[var(--color-success)]" },
];

const iotSamples = [
  {
    deviceSerial: "DASN-IOT-0194",
    metric: "DTC actifs",
    value: "P0420, U0121",
    status: "blocked",
    code: "P0420",
  },
  {
    deviceSerial: "DASN-IOT-0421",
    metric: "Pression huile",
    value: "1.7 bar",
    status: "urgent",
  },
  {
    deviceSerial: "DASN-IOT-0882",
    metric: "Alerte assurance",
    value: "8 jours",
    status: "urgent",
  },
  {
    deviceSerial: "DASN-IOT-0742",
    metric: "Visite technique",
    value: "17 jours",
    status: "watch",
  },
] as const;

function severityClass(severity: string) {
  if (severity === "blocked") return "border-[var(--color-danger)]/45 bg-[var(--color-danger)]/12 text-[var(--color-danger)]";
  if (severity === "urgent") return "border-[var(--color-accent)]/45 bg-[var(--color-accent)]/12 text-[var(--color-accent)]";
  if (severity === "watch") return "border-[var(--color-warn)]/45 bg-[var(--color-warn)]/12 text-[var(--color-warn)]";
  return "border-[var(--color-success)]/35 bg-[var(--color-success)]/10 text-[var(--color-success)]";
}

function statusLabel(status: string) {
  const value = status.toLowerCase();
  if (value === "bloquante" || value === "blocked") return "Blocage";
  if (value === "urgent") return "Urgent";
  if (value === "watch") return "Surveillance";
  if (value === "disponible") return "Libre";
  if (value === "en_cours") return "En cours";
  if (value === "approuve") return "Approuve";
  if (value === "envoye") return "Envoye";
  return status.replaceAll("_", " ");
}

function SectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">{eyebrow}</p>
        <h3 className="mt-2 text-xl font-black tracking-[-0.045em]">{title}</h3>
      </div>
      {action ? (
        <span className="rounded-[10px] border border-[var(--color-border)] bg-white/[0.035] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-accent)]">
          {action}
        </span>
      ) : null}
    </div>
  );
}

function SignalBars({ status }: { status: string }) {
  const activeBars = status === "blocked" ? 5 : status === "urgent" ? 4 : status === "watch" ? 3 : 2;
  return (
    <div className="flex h-8 items-end gap-1">
      {[1, 2, 3, 4, 5].map((bar) => (
        <span
          key={bar}
          className={`w-1.5 rounded-full transition ${bar <= activeBars ? "bg-[var(--color-accent)]" : "bg-white/10"}`}
          style={{ height: `${10 + bar * 4}px` }}
        />
      ))}
    </div>
  );
}

function SkeletonConsole() {
  return (
    <section className="panel rounded-[28px] p-5 md:p-7">
      <div className="h-4 w-44 rounded bg-white/10" />
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-24 rounded-[18px] border border-[var(--color-border)] bg-white/[0.025]" />
        ))}
      </div>
      <div className="mt-4 h-72 rounded-[24px] border border-[var(--color-border)] bg-white/[0.025]" />
    </section>
  );
}

function VehicleCommandStage({
  priorityAlerts,
  connectedDevices,
}: {
  priorityAlerts: Overview["alerts"];
  connectedDevices: number;
}) {
  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-[30px] border border-[var(--color-border)] bg-[#080708] p-5 vehicle-scan-grid md:min-h-[430px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(223,68,56,0.18),transparent_32%),linear-gradient(180deg,transparent,rgba(0,0,0,0.48))]" />
      <div className="absolute left-5 top-5 rounded-[12px] border border-[var(--color-border)] bg-black/24 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-muted)] backdrop-blur">
        {connectedDevices} capteurs actifs
      </div>
      <div className="absolute right-5 top-5 rounded-[12px] border border-[var(--color-accent)]/35 bg-[var(--color-accent)]/12 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent)] backdrop-blur">
        scan continu
      </div>

      <div className="absolute left-1/2 top-[52%] h-[38%] w-[82%] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-x-[10%] top-[19%] h-[44%] rounded-[50%_50%_18%_18%] border border-[var(--color-accent)]/55 bg-[linear-gradient(180deg,rgba(223,68,56,0.24),rgba(223,68,56,0.05))] shadow-[inset_0_1px_0_rgba(255,255,255,0.11)]" />
        <div className="absolute left-[22%] top-[31%] h-[31%] w-[20%] -skew-x-12 border border-[var(--color-accent)]/25 bg-[#111]" />
        <div className="absolute right-[22%] top-[31%] h-[31%] w-[20%] skew-x-12 border border-[var(--color-accent)]/25 bg-[#111]" />
        <div className="absolute bottom-[16%] left-[21%] size-12 rounded-full border-[10px] border-[#050505] bg-[var(--color-border-strong)]" />
        <div className="absolute bottom-[16%] right-[21%] size-12 rounded-full border-[10px] border-[#050505] bg-[var(--color-border-strong)]" />
        <div className="scan-line absolute left-1/2 top-0 h-14 w-[86%] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,rgba(223,68,56,0.0),rgba(223,68,56,0.22),rgba(223,68,56,0.0))]" />
      </div>

      {visualMarkers.map((marker) => (
        <div key={marker.label} className="absolute" style={{ left: marker.x, top: marker.y }}>
          <span className={`block size-2 rounded-full ${marker.tone} shadow-[0_0_0_7px_rgba(223,68,56,0.09)] live-dot`} />
          <span className="mt-2 block -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
            {marker.label}
          </span>
        </div>
      ))}

      <div className="absolute inset-x-5 bottom-5 grid gap-2 sm:grid-cols-3">
        {priorityAlerts.slice(0, 3).map((alert) => (
          <div key={alert.id} className="rounded-[14px] border border-[var(--color-border)] bg-black/28 p-3 backdrop-blur-md">
            <div className="font-mono text-[9px] uppercase tracking-[0.13em] text-[var(--color-accent)]">{alert.type}</div>
            <div className="mt-2 truncate text-xs font-semibold text-[var(--color-fg)]">{alert.label}</div>
          </div>
        ))}
        {priorityAlerts.length === 0 ? (
          <div className="rounded-[14px] border border-[var(--color-success)]/35 bg-[var(--color-success)]/10 p-3 text-xs font-semibold text-[var(--color-success)] sm:col-span-3">
            Aucun blocage critique detecte.
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function OperationsConsole() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("atelier");
  const [error, setError] = useState<string | null>(null);
  const [createdDiagnostics, setCreatedDiagnostics] = useState<CreatedDiagnostic[]>([]);
  const [liveIotEvents, setLiveIotEvents] = useState<LiveIotEvent[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isSendingIot, setIsSendingIot] = useState(false);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [receptionForm, setReceptionForm] = useState<ReceptionForm>({
    clientName: "Mame Gueye",
    phone: "+221 77 245 90 18",
    brand: "Peugeot",
    model: "3008",
    plate: "DK 6428 AC",
    mileage: "88420",
    operation: "Reception + inspection bruit train avant",
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchOverview() {
      const response = await fetch("/api/garage/overview", { cache: "no-store" });
      if (!response.ok) throw new Error("overview unavailable");
      return (await response.json()) as Overview;
    }

    async function loadOverview() {
      try {
        const data = await fetchOverview();
        if (!cancelled) {
          setOverview(data);
          setError(null);
        }
      } catch {
        await new Promise((resolve) => window.setTimeout(resolve, 700));
        try {
          const data = await fetchOverview();
          if (!cancelled) {
            setOverview(data);
            setError(null);
          }
        } catch {
          if (!cancelled) setError("Impossible de charger les operations garage.");
        }
      }
    }

    loadOverview();

    return () => {
      cancelled = true;
    };
  }, []);

  const priorityAlerts = useMemo(
    () => overview?.alerts.filter((alert) => alert.severity === "urgent" || alert.severity === "blocked") ?? [],
    [overview]
  );

  async function createDiagnostic() {
    setIsCreating(true);
    try {
      const response = await fetch("/api/garage/diagnostics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: "Awa Diop",
          vehicle: "Toyota Prado",
          code: "P0420",
          severity: "urgent",
        }),
      });
      const diagnostic = (await response.json()) as CreatedDiagnostic;
      const overviewResponse = await fetch("/api/garage/overview", { cache: "no-store" });
      if (overviewResponse.ok) setOverview((await overviewResponse.json()) as Overview);
      setCreatedDiagnostics((items) => [diagnostic, ...items].slice(0, 3));
      setActionMessage(`Diagnostic ${diagnostic.code} créé et stocké`);
      setActiveTab("atelier");
    } catch {
      setError("Le diagnostic n'a pas pu etre cree.");
    } finally {
      setIsCreating(false);
    }
  }

  async function ingestIotSignal() {
    setIsSendingIot(true);
    try {
      const payload = iotSamples[Math.floor(Math.random() * iotSamples.length)];
      const response = await fetch("/api/iot/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("iot unavailable");
      const result = (await response.json()) as { event: LiveIotEvent; overview: Overview };
      setOverview(result.overview);
      setLiveIotEvents((events) => [result.event, ...events].slice(0, 4));
      setActiveTab("iot");
      setError(null);
    } catch {
      setError("Le paquet IoT n'a pas pu etre enregistre.");
    } finally {
      setIsSendingIot(false);
    }
  }

  async function runGarageAction(actionId: string, payload: Record<string, unknown>) {
    setBusyAction(actionId);
    try {
      const response = await fetch("/api/garage/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as GarageActionResponse | { error?: string };
      if (!response.ok || !("overview" in result)) {
        throw new Error("error" in result ? result.error : "action failed");
      }
      setOverview(result.overview);
      setActionMessage(result.message);
      setError(null);
      return result;
    } catch {
      setError("Action non enregistree. Verifie la base ou l'API.");
      return null;
    } finally {
      setBusyAction(null);
    }
  }

  async function createReception(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await runGarageAction("create_reception", {
      action: "create_reception",
      ...receptionForm,
      mileage: Number(receptionForm.mileage) || 0,
    });
    if (result) setActiveTab("atelier");
  }

  if (error && !overview) {
    return (
      <section id="console" className="pt-28 pb-10 md:pt-32 md:pb-14">
        <div className="container-tight">
          <div className="panel rounded-[28px] p-7">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-danger)]">erreur operationnelle</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">Le cockpit ne repond pas.</h2>
            <p className="mt-4 max-w-xl leading-7 text-[var(--color-fg-muted)]">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!overview) {
    return (
      <section id="console" className="pt-28 pb-10 md:pt-32 md:pb-14">
        <div className="container-tight">
          <SkeletonConsole />
        </div>
      </section>
    );
  }

  const criticalAlert = priorityAlerts[0];
  const cashToCollect = overview.invoices.reduce((total, invoice) => total + Math.max(invoice.total - invoice.paid, 0), 0);
  const blockedInspections = overview.inspections.filter((inspection) => inspection.status === "bloquante").length;
  const busyTeam = overview.team.filter((member) => member.status !== "disponible").length;

  return (
    <section id="console" className="relative min-h-[100dvh] overflow-hidden pt-12 pb-32 md:pt-16 md:pb-18">
      <div className="pointer-events-none absolute inset-y-0 left-[7vw] hidden w-px bg-[linear-gradient(to_bottom,transparent,var(--color-border),transparent)] opacity-45 lg:block" />
      <div className="pointer-events-none absolute inset-y-0 right-[18vw] hidden w-px bg-[linear-gradient(to_bottom,transparent,var(--color-border),transparent)] opacity-28 lg:block" />
      <div className="container-tight">
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-accent)]">DiagAutoSN garage OS</p>
            <h2 className="mt-2 font-display text-3xl font-black leading-none tracking-[-0.055em] md:text-5xl">
              Poste de controle atelier
            </h2>
          </div>
          <div className="command-input flex min-h-12 items-center justify-between gap-4 rounded-[16px] px-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">sync garage</span>
            <span className="font-mono text-sm font-black text-[var(--color-fg)]">
              {new Date(overview.updatedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

        <div className="mb-5 grid gap-4 xl:grid-cols-[1.05fr_0.95fr_0.7fr]">
          <article className="ops-surface relative overflow-hidden rounded-[28px] p-5">
            <div className="absolute left-0 top-6 h-28 w-1 status-rail" />
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl pl-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">decision maintenant</p>
                <h3 className="mt-3 text-3xl font-black leading-[0.95] tracking-[-0.055em] md:text-4xl">
                  {criticalAlert ? criticalAlert.label : "Atelier sous controle"}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--color-fg-muted)]">
                  {criticalAlert
                    ? `${criticalAlert.client} - ${criticalAlert.vehicle}. ${criticalAlert.due}.`
                    : "Les receptions, les capteurs et les relances client sont synchronises."}
                </p>
              </div>
              <div className="grid gap-2 md:min-w-48">
                <button
                  type="button"
                  onClick={createDiagnostic}
                  disabled={isCreating}
                  className="min-h-12 rounded-[14px] bg-[var(--color-accent)] px-5 text-sm font-black text-[var(--color-accent-ink)] shadow-[0_18px_48px_rgba(223,68,56,0.18)] transition duration-200 hover:bg-[var(--color-accent-soft)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? "Creation..." : "Ouvrir diagnostic"}
                </button>
                <button
                  type="button"
                  onClick={ingestIotSignal}
                  disabled={isSendingIot}
                  className="min-h-12 rounded-[14px] border border-[var(--color-border)] bg-white/[0.035] px-5 text-sm font-black text-[var(--color-fg)] transition duration-200 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSendingIot ? "Signal..." : "Injecter signal IoT"}
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-4">
              {[
                ["clients", overview.summary.clients],
                ["vehicules", overview.summary.vehicles],
                ["capteurs", overview.summary.connectedDevices],
                ["cash", `${cashToCollect.toLocaleString("fr-FR")} F`],
              ].map(([label, value]) => (
                <div key={label} className="bg-[#0d0b0c] p-4">
                  <div className="tabular font-mono text-xl font-black text-[var(--color-fg)]">{value}</div>
                  <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">{label}</div>
                </div>
              ))}
            </div>
          </article>

          <article className="ops-surface rounded-[28px] p-5">
            <SectionHeader eyebrow="baies atelier" title="Equipe et charge" action={`${busyTeam}/${overview.team.length}`} />
            <div className="mt-5 grid gap-2">
              {overview.team.slice(0, 3).map((member) => (
                <div key={member.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-[var(--color-border)] pt-3 first:border-t-0 first:pt-0">
                  <span className={`size-2 rounded-full ${member.status === "disponible" ? "bg-[var(--color-success)]" : "bg-[var(--color-accent)]"}`} />
                  <div>
                    <div className="text-sm font-black tracking-[-0.02em]">{member.fullName}</div>
                    <div className="mt-1 truncate text-xs text-[var(--color-fg-muted)]">{member.currentOperation || member.role}</div>
                  </div>
                  <span className="rounded-[10px] border border-[var(--color-border)] px-2 py-1 font-mono text-[10px] text-[var(--color-accent)]">{member.bay}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="ops-surface rounded-[28px] p-5">
            <SectionHeader eyebrow="file risque" title="Alertes a traiter" action={`${overview.summary.urgentAlerts}`} />
            <div className="mt-5 grid gap-2">
              {overview.alerts.slice(0, 4).map((alert) => (
                <button
                  key={alert.id}
                  type="button"
                  onClick={() => setActiveTab("alertes")}
                  className="group grid gap-1 rounded-[14px] border border-[var(--color-border)] bg-white/[0.018] p-3 text-left transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/8 active:translate-y-px"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-black tracking-[-0.02em]">{alert.label}</span>
                    <span className={`rounded-[8px] border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] ${severityClass(alert.severity)}`}>
                      {alert.type}
                    </span>
                  </div>
                  <span className="truncate text-xs text-[var(--color-fg-muted)]">{alert.client} - {alert.vehicle}</span>
                </button>
              ))}
            </div>
          </article>
        </div>

        {actionMessage ? (
          <div className="mb-5 rounded-[18px] border border-[var(--color-success)]/35 bg-[var(--color-success)]/10 px-4 py-3 text-sm text-[var(--color-success)]">
            {actionMessage}
          </div>
        ) : null}

        <div className="panel overflow-hidden rounded-[30px] shadow-[0_34px_120px_rgba(0,0,0,0.28)]">
          <div className="grid border-b border-[var(--color-border)] md:grid-cols-[1fr_auto]">
            <div className="grid grid-cols-2 gap-px bg-[var(--color-border)] md:grid-cols-5">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative bg-[var(--color-bg-elevated)] px-4 py-4 text-left transition duration-200 hover:bg-[var(--color-surface)] ${
                    activeTab === tab.key ? "text-[var(--color-fg)]" : "text-[var(--color-fg-muted)]"
                  }`}
                >
                  {activeTab === tab.key ? (
                    <motion.span
                      layoutId="active-console-tab"
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--color-accent)]"
                    />
                  ) : null}
                  <span className="block text-sm font-black tracking-[-0.02em]">{tab.label}</span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
                    {tab.caption}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between gap-4 bg-[#09090b] px-5 py-4 md:min-w-[310px]">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                  dernier sync
                </div>
                <div className="mt-1 font-mono text-sm text-[var(--color-fg)]">
                  {new Date(overview.updatedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              <span className="size-2 rounded-full bg-[var(--color-success)] live-dot" />
            </div>
          </div>

          <div className="grid gap-px bg-[var(--color-border)] md:grid-cols-5">
            {[
              ["Ordres ouverts", overview.summary.openWorkOrders],
              ["Alertes urgentes", overview.summary.urgentAlerts],
              ["Revenu prevu", `${overview.summary.projectedRevenue.toLocaleString("fr-FR")} F`],
              ["Sync API", "Action"],
              ["Persist.", "SQLite"],
            ].map(([label, value]) => (
              <div key={label} className="bg-[#0d0d10] px-5 py-5">
                <div className="tabular font-mono text-xl font-semibold md:text-2xl">{value}</div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div className="grid min-h-[500px] lg:grid-cols-[0.98fr_1.02fr]">
            <div className="border-b border-[var(--color-border)] p-4 md:p-6 lg:border-b-0 lg:border-r">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.26, ease: easings.signature }}
                >
                  {activeTab === "atelier" ? (
                    <div className="grid gap-4">
                      <form
                        onSubmit={createReception}
                        className="relative overflow-hidden rounded-[24px] border border-[var(--color-accent)]/35 bg-[linear-gradient(135deg,rgba(223,68,56,0.16),rgba(255,255,255,0.025)_42%,rgba(8,7,7,0.88))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      >
                        <div className="pointer-events-none absolute -right-14 -top-16 size-40 rounded-full border border-[var(--color-accent)]/20" />
                        <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="max-w-xl">
                            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent)]">
                              reception garage
                            </p>
                            <h3 className="mt-2 text-xl font-black tracking-[-0.04em]">Créer une arrivée atelier</h3>
                            <p className="mt-1 text-sm leading-6 text-[var(--color-fg-muted)]">
                              Ajoute un client, son véhicule, un ordre atelier, une inspection et un devis brouillon en base.
                            </p>
                          </div>
                          <button
                            type="submit"
                            disabled={busyAction === "create_reception"}
                            className="min-h-12 rounded-[14px] bg-[var(--color-accent)] px-5 text-sm font-black text-[var(--color-accent-ink)] shadow-[0_18px_44px_rgba(223,68,56,0.20)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px disabled:opacity-60"
                          >
                            {busyAction === "create_reception" ? "Création..." : "Enregistrer"}
                          </button>
                        </div>
                        <div className="relative mt-5 grid gap-3 md:grid-cols-3">
                          {[
                            ["clientName", "Client"],
                            ["phone", "Téléphone"],
                            ["brand", "Marque"],
                            ["model", "Modèle"],
                            ["plate", "Plaque"],
                            ["mileage", "Kilométrage"],
                          ].map(([name, label]) => (
                            <label key={name} className="grid gap-2">
                              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                                {label}
                              </span>
                              <input
                                value={receptionForm[name as keyof ReceptionForm]}
                                onChange={(event) =>
                                  setReceptionForm((form) => ({ ...form, [name as keyof ReceptionForm]: event.target.value }))
                                }
                                className="field-surface min-h-12 rounded-[12px] px-3 text-sm outline-none transition focus:border-[var(--color-accent)]"
                              />
                            </label>
                          ))}
                          <label className="grid gap-2 md:col-span-3">
                            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                              Motif atelier
                            </span>
                            <input
                              value={receptionForm.operation}
                              onChange={(event) => setReceptionForm((form) => ({ ...form, operation: event.target.value }))}
                              className="field-surface min-h-12 rounded-[12px] px-3 text-sm outline-none transition focus:border-[var(--color-accent)]"
                            />
                          </label>
                        </div>
                      </form>
                      <div className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
                        <div className="hairline-card rounded-[22px] p-4">
                          <SectionHeader eyebrow="dispatch" title="Equipe en baie" action={`${busyTeam}/${overview.team.length}`} />
                          <div className="mt-5 grid gap-2">
                            {overview.team.map((member) => (
                              <article key={member.id} className="field-surface rounded-[16px] p-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <span className="font-semibold tracking-[-0.02em]">{member.fullName}</span>
                                    <p className="mt-1 text-xs text-[var(--color-fg-muted)]">{member.role}</p>
                                  </div>
                                  <span className="rounded-[8px] border border-[var(--color-border)] px-2 py-1 font-mono text-[10px] text-[var(--color-accent)]">
                                    {member.bay}
                                  </span>
                                </div>
                                <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-3">
                                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
                                    {statusLabel(member.status)}
                                  </span>
                                  <span className="max-w-[12rem] truncate text-right text-xs text-[var(--color-fg-muted)]">
                                    {member.currentOperation || "En attente"}
                                  </span>
                                </div>
                              </article>
                            ))}
                          </div>
                        </div>
                        <div className="hairline-card rounded-[22px] p-4">
                          <SectionHeader eyebrow="controle qualite" title="Inspections digitales" action={`${blockedInspections} blocage`} />
                          <div className="mt-5 grid gap-3">
                            {overview.inspections.slice(0, 3).map((inspection) => (
                              <article key={inspection.id} className="field-surface rounded-[18px] p-4">
                                <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                                  <div>
                                    <div className="font-semibold tracking-[-0.02em]">{inspection.vehicle}</div>
                                    <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                                      {inspection.client} - {inspection.inspector || "inspecteur non assigne"}
                                    </p>
                                  </div>
                                  <div className="text-left sm:text-right">
                                    <div className="tabular font-mono text-xl font-black text-[var(--color-accent)]">{inspection.score}</div>
                                    <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">score</div>
                                  </div>
                                </div>
                                <div className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-[var(--color-border)]">
                                  {[
                                    ["bloquants", inspection.failCount],
                                    ["a voir", inspection.attentionCount],
                                    ["photos", inspection.photoCount],
                                  ].map(([label, value]) => (
                                    <div key={label} className="bg-[#0d0d10] p-2">
                                      <div className="tabular font-mono text-sm font-black">{value}</div>
                                      <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.1em] text-[var(--color-fg-subtle)]">
                                        {label}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </article>
                            ))}
                          </div>
                        </div>
                      </div>
                      {createdDiagnostics.map((diagnostic) => (
                        <div
                          key={diagnostic.id}
                          className="rounded-[16px] border border-[var(--color-accent)]/45 bg-[var(--color-accent)]/10 p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent)]">
                              nouveau diagnostic
                            </span>
                            <span className="font-mono text-xs text-[var(--color-fg-subtle)]">{diagnostic.time}</span>
                          </div>
                          <div className="mt-3 text-lg font-black tracking-[-0.035em]">
                            {diagnostic.vehicle} - {diagnostic.code}
                          </div>
                          <p className="mt-2 text-sm leading-6 text-[var(--color-fg-muted)]">{diagnostic.nextAction}</p>
                        </div>
                      ))}
                      <div className="hairline-card rounded-[22px] p-4">
                        <SectionHeader eyebrow="timeline atelier" title="Ordres en cours" action={`${overview.workOrders.length} actifs`} />
                        <div className="mt-5 grid gap-0 overflow-hidden rounded-[18px] border border-[var(--color-border)]">
                          {overview.workOrders.map((order, index) => (
                            <article
                              key={order.id}
                              className="relative grid gap-3 border-t border-[var(--color-border)] bg-[#0b0b0d] p-4 first:border-t-0 md:grid-cols-[4.5rem_1fr_auto]"
                            >
                              <div className="absolute left-0 top-0 h-full w-1 bg-[var(--color-accent)]/70" style={{ opacity: 0.95 - index * 0.12 }} />
                              <div className="font-mono text-xs text-[var(--color-accent)]">{order.time}</div>
                              <div>
                                <h3 className="font-semibold tracking-[-0.025em]">{order.operation}</h3>
                                <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                                  {order.client} - {order.vehicle}
                                </p>
                              </div>
                              <div className="text-left md:text-right">
                                <div className="font-mono text-xs uppercase tracking-[0.13em] text-[var(--color-fg-subtle)]">
                                  {statusLabel(order.status)}
                                </div>
                                <div className="tabular mt-2 font-mono text-sm font-black">
                                  {order.amount.toLocaleString("fr-FR")} F
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {activeTab === "client" ? (
                    <div className="grid gap-4">
                      <div className="rounded-[22px] border border-[var(--color-border)] bg-[#08080a] p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
                              comptes clients actifs
                            </p>
                            <h3 className="mt-2 text-2xl font-black tracking-[-0.045em]">
                              {overview.clients.length} clients suivis
                            </h3>
                            <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
                              Chaque compte lit les alertes, le capteur et les dossiers atelier depuis la base.
                            </p>
                          </div>
                          <span className="rounded-lg bg-[var(--color-success)]/12 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-success)]">
                            portail actif
                          </span>
                        </div>
                        <div className="mt-6 grid gap-px overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-border)]">
                          {overview.clients.map((client) => (
                            <article key={client.id} className="grid gap-3 bg-[#0d0d10] p-4 sm:grid-cols-[1fr_auto]">
                              <div>
                                <div className="font-semibold tracking-[-0.025em]">{client.fullName}</div>
                                <div className="mt-1 text-xs text-[var(--color-fg-muted)]">
                                  {client.city} - {client.phone}
                                </div>
                              </div>
                              <Link
                                href={`/carnet?clientId=${encodeURIComponent(client.id)}`}
                                className="rounded-[12px] border border-[var(--color-border)] px-3 py-2 font-mono text-xs text-[var(--color-fg-subtle)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-fg)] sm:text-right"
                              >
                                {client.vehicles} vehicule(s)
                                <span className="mt-1 block text-[var(--color-accent)]">ouvrir compte - score {client.healthScore}</span>
                              </Link>
                            </article>
                          ))}
                        </div>
                      </div>
                      <div className="grid gap-3">
                        {overview.vehicles.slice(0, 4).map((vehicle) => (
                          <article
                            key={vehicle.id}
                            className="rounded-[18px] border border-[var(--color-border)] bg-white/[0.025] p-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-black tracking-[-0.03em]">{vehicle.label}</h3>
                                <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                                  {vehicle.client} - {vehicle.plate}
                                </p>
                              </div>
                              <span className="rounded-lg border border-[var(--color-border)] px-3 py-1 font-mono text-xs">
                                {vehicle.healthScore}/100
                              </span>
                            </div>
                            <div className="mt-4 grid gap-2 font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--color-fg-subtle)] sm:grid-cols-3">
                              <span>{vehicle.mileage.toLocaleString("fr-FR")} km</span>
                              <span>{vehicle.serial}</span>
                              <span>sync {vehicle.lastSeen}</span>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {activeTab === "iot" ? (
                    <div className="grid gap-4">
                      <div className="hairline-card rounded-[22px] p-4">
                        <SectionHeader eyebrow="telemetrie embarquee" title="Capteurs voiture connectee" action={`${overview.signals.length} flux`} />
                        <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-fg-muted)]">
                          Les boitiers IoT remontent les anomalies moteur, les rappels vidange, assurance et visite technique pour le garage et le compte client.
                        </p>
                      </div>
                      {liveIotEvents.length > 0 ? (
                        <div className="rounded-[18px] border border-[var(--color-accent)]/45 bg-[var(--color-accent)]/10 p-4">
                          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent)]">
                            derniers paquets recus
                          </p>
                          <div className="mt-3 grid gap-2">
                            {liveIotEvents.map((event) => (
                              <div key={`${event.id}-${event.updatedAt}`} className="flex items-center justify-between gap-3 text-sm">
                                <span>
                                  {event.metric} - {event.vehicle}
                                </span>
                                <span className={`rounded-lg border px-2 py-1 font-mono text-[10px] ${severityClass(event.status)}`}>
                                  {event.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {overview.signals.map((signal) => (
                        <article
                          key={signal.id}
                          className="field-surface grid gap-4 rounded-[18px] p-4 md:grid-cols-[1fr_auto]"
                        >
                          <div>
                            <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
                              {signal.device} - {signal.updatedAt}
                            </div>
                            <h3 className="mt-2 text-lg font-black tracking-[-0.035em]">{signal.metric}</h3>
                            <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{signal.vehicle}</p>
                          </div>
                          <div className="flex items-end justify-between gap-4 md:min-w-44 md:justify-end">
                            <SignalBars status={signal.status} />
                            <span className={`h-fit rounded-lg border px-3 py-2 font-mono text-xs font-black ${severityClass(signal.status)}`}>
                              {signal.value}
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : null}

                  {activeTab === "finance" ? (
                    <div className="grid gap-3">
                      <div className="rounded-[18px] border border-[var(--color-border)] bg-white/[0.025] p-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
                          documents sensibles
                        </p>
                        <div className="mt-3 grid gap-2">
                          {overview.documents.slice(0, 4).map((document) => (
                            <div key={document.id} className="grid gap-2 border-t border-[var(--color-border)] pt-3 first:border-t-0 first:pt-0 sm:grid-cols-[1fr_auto]">
                              <div>
                                <div className="text-sm font-semibold tracking-[-0.02em]">{document.label}</div>
                                <div className="mt-1 text-xs text-[var(--color-fg-muted)]">
                                  {document.client} - {document.vehicle} - {document.plate}
                                </div>
                              </div>
                              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-accent)] sm:text-right">
                                {document.status}
                                <span className="block text-[var(--color-fg-subtle)]">{document.expiresAt || "sans echeance"}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-[18px] border border-[var(--color-border)] bg-white/[0.025] p-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
                          devis a convertir
                        </p>
                        <div className="mt-3 grid gap-3">
                          {overview.estimates.map((estimate) => (
                            <article key={estimate.id} className="rounded-[15px] border border-[var(--color-border)] bg-[#08080a] p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="font-black tracking-[-0.03em]">{estimate.operation}</h3>
                                  <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                                    {estimate.client} - {estimate.vehicle}
                                  </p>
                                </div>
                                <span className="tabular font-mono text-sm font-black text-[var(--color-accent)]">
                                  {estimate.total.toLocaleString("fr-FR")} F
                                </span>
                              </div>
                              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--color-fg-subtle)]">
                                {estimate.status}
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  runGarageAction(`approve_${estimate.id}`, {
                                    action: "approve_estimate",
                                    estimateId: estimate.id,
                                  })
                                }
                                disabled={busyAction === `approve_${estimate.id}` || estimate.status === "approuve"}
                                className="mt-4 min-h-10 w-full rounded-[12px] border border-[var(--color-border)] bg-white/[0.04] px-3 text-sm font-semibold transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45"
                              >
                                {busyAction === `approve_${estimate.id}` ? "Validation..." : "Valider côté client"}
                              </button>
                            </article>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-[18px] border border-[var(--color-border)] bg-white/[0.025] p-4">
                          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
                            encaissements
                          </p>
                          <div className="mt-3 grid gap-2">
                            {overview.invoices.map((invoice) => (
                              <div key={invoice.id} className="border-t border-[var(--color-border)] pt-3 first:border-t-0 first:pt-0">
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-sm font-semibold">{invoice.client}</span>
                                  <span className="tabular font-mono text-xs">
                                    {invoice.paid.toLocaleString("fr-FR")} / {invoice.total.toLocaleString("fr-FR")} F
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-[var(--color-fg-muted)]">{invoice.status} - {invoice.dueAt}</p>
                                <button
                                  type="button"
                                  onClick={() =>
                                    runGarageAction(`pay_${invoice.id}`, {
                                      action: "record_payment",
                                      invoiceId: invoice.id,
                                      amount: Math.max(invoice.total - invoice.paid, 0),
                                      method: "wave",
                                    })
                                  }
                                  disabled={busyAction === `pay_${invoice.id}` || invoice.paid >= invoice.total}
                                  className="mt-3 min-h-9 w-full rounded-[10px] bg-[var(--color-accent)] px-3 text-xs font-semibold text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45"
                                >
                                  {invoice.paid >= invoice.total ? "Payée" : "Encaisser Wave"}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-[18px] border border-[var(--color-border)] bg-white/[0.025] p-4">
                          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
                            relances automatiques
                          </p>
                          <div className="mt-3 grid gap-2">
                            {overview.notifications.map((notification) => (
                              <div key={notification.id} className="border-t border-[var(--color-border)] pt-3 first:border-t-0 first:pt-0">
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-sm font-semibold">{notification.client}</span>
                                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-accent)]">
                                    {notification.channel}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-[var(--color-fg-muted)]">{notification.template}</p>
                                <button
                                  type="button"
                                  onClick={() =>
                                    runGarageAction(`notify_${notification.id}`, {
                                      action: "send_notification",
                                      notificationId: notification.id,
                                    })
                                  }
                                  disabled={busyAction === `notify_${notification.id}` || notification.status === "envoye"}
                                  className="mt-3 min-h-9 w-full rounded-[10px] border border-[var(--color-border)] bg-white/[0.04] px-3 text-xs font-semibold transition hover:border-[var(--color-accent)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45"
                                >
                                  {notification.status === "envoye" ? "Relance envoyée" : "Envoyer relance"}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {activeTab === "alertes" ? (
                    <div className="grid gap-4">
                      <div className="hairline-card rounded-[22px] p-4">
                        <SectionHeader eyebrow="rappels critiques" title="Vidange, assurance, visite" action={`${overview.alerts.length} alertes`} />
                        <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-fg-muted)]">
                          Les alertes administratives et mecaniques sont visibles cote garage et cote client pour eviter les oublis de suivi.
                        </p>
                      </div>
                      {overview.alerts.map((alert) => (
                        <article key={alert.id} className="field-surface overflow-hidden rounded-[18px] p-4">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <span className={`inline-flex rounded-lg border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${severityClass(alert.severity)}`}>
                                {alert.type}
                              </span>
                              <h3 className="mt-3 text-lg font-black tracking-[-0.035em]">{alert.label}</h3>
                              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                                {alert.client} - {alert.vehicle}
                              </p>
                            </div>
                            <div className="font-mono text-sm font-black text-[var(--color-accent)]">{alert.due}</div>
                          </div>
                          <p className="mt-3 text-xs leading-5 text-[var(--color-fg-subtle)]">Source: {alert.source}</p>
                          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              initial={{ width: "18%" }}
                              animate={{ width: alert.severity === "blocked" ? "92%" : alert.severity === "urgent" ? "78%" : "54%" }}
                              transition={{ duration: 0.9, ease: easings.signature }}
                              className="h-full rounded-full bg-[var(--color-accent)]"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              runGarageAction(`resolve_${alert.id}`, {
                                action: "resolve_alert",
                                alertId: alert.id,
                              })
                            }
                            disabled={busyAction === `resolve_${alert.id}`}
                            className="mt-4 min-h-10 w-full rounded-[12px] border border-[var(--color-border)] bg-white/[0.04] px-3 text-sm font-semibold transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 active:translate-y-px disabled:opacity-60"
                          >
                            {busyAction === `resolve_${alert.id}` ? "Résolution..." : "Marquer comme traité"}
                          </button>
                        </article>
                      ))}
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>

            <aside className="relative overflow-hidden bg-[#09090b] p-4 md:p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(226,61,61,0.18),transparent_34%)]" />
              <div className="relative mb-5 flex items-center justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                    visual map
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.045em]">Etat vehicule prioritaire</h3>
                </div>
                <span className="tabular font-mono text-3xl font-semibold text-[var(--color-accent)]">
                  {priorityAlerts.length}
                </span>
              </div>

              <div className="relative mb-5 min-h-[220px] overflow-hidden rounded-[26px] border border-[var(--color-border)] bg-[#070708]">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] opacity-60" />
                <div className="absolute left-1/2 top-1/2 h-[38%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-[48%_48%_20%_20%] border border-[var(--color-accent)]/45 bg-[linear-gradient(180deg,rgba(226,61,61,0.2),rgba(226,61,61,0.05))]" />
                <div className="absolute left-[29%] top-[42%] h-[26%] w-[18%] skew-x-[-18deg] border border-[var(--color-accent)]/25 bg-[#111113]" />
                <div className="absolute right-[29%] top-[42%] h-[26%] w-[18%] skew-x-[18deg] border border-[var(--color-accent)]/25 bg-[#111113]" />
                <div className="absolute bottom-[24%] left-[29%] size-10 rounded-full border-[9px] border-[#060607] bg-[var(--color-border-strong)]" />
                <div className="absolute bottom-[24%] right-[29%] size-10 rounded-full border-[9px] border-[#060607] bg-[var(--color-border-strong)]" />
                {visualMarkers.map((marker) => (
                  <div
                    key={marker.label}
                    className="absolute"
                    style={{ left: marker.x, top: marker.y }}
                  >
                    <span className={`block size-2 rounded-full ${marker.tone} shadow-[0_0_0_6px_rgba(226,61,61,0.08)] live-dot`} />
                    <span className="mt-2 block -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                      {marker.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid gap-3">
                {priorityAlerts.map((alert) => (
                  <div key={alert.id} className="rounded-[18px] border border-[var(--color-border)] bg-white/[0.025] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-black tracking-[-0.03em]">{alert.label}</h4>
                        <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{alert.client}</p>
                      </div>
                      <span className={`rounded-lg border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${severityClass(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: "18%" }}
                        animate={{ width: alert.severity === "blocked" ? "92%" : "72%" }}
                        transition={{ duration: 1.1, ease: easings.signature }}
                        className="h-full rounded-full bg-[var(--color-accent)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
      <div className="fixed bottom-3 left-[4.25rem] right-3 z-20 grid grid-cols-3 gap-2 rounded-[20px] border border-[var(--color-border)] bg-[#09090b]/92 p-2 shadow-[0_18px_70px_rgba(0,0,0,0.42)] backdrop-blur md:hidden">
        <button
          type="button"
          onClick={createDiagnostic}
          disabled={isCreating}
          className="min-h-11 rounded-[14px] bg-[var(--color-accent)] px-3 text-xs font-semibold text-[var(--color-accent-ink)] active:translate-y-px disabled:opacity-60"
        >
          Diagnostic
        </button>
        <button
          type="button"
          onClick={ingestIotSignal}
          disabled={isSendingIot}
          className="min-h-11 rounded-[14px] border border-[var(--color-border)] bg-white/[0.04] px-3 text-xs font-semibold active:translate-y-px disabled:opacity-60"
        >
          IoT
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("finance")}
          className="min-h-11 rounded-[14px] border border-[var(--color-border)] bg-white/[0.04] px-3 text-xs font-semibold active:translate-y-px"
        >
          Devis
        </button>
      </div>
    </section>
  );
}
