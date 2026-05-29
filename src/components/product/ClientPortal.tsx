"use client";

import { type FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

const clientVehiclePhoto = "https://images.pexels.com/photos/4639907/pexels-photo-4639907.jpeg?auto=compress&cs=tinysrgb&w=1200";

const clientQuickControls: Array<[string, string]> = [
  ["Statut", "En ligne"],
  ["Position", "Dakar"],
  ["Rappel", "Atelier"],
  ["OBD", "Actif"],
];

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

export function ClientPortal({ clientId, initialPortal }: { clientId: string; initialPortal: ClientPortalData }) {
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
      const response = await fetch(`/api/client/portal?clientId=${encodeURIComponent(clientId)}`, {
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

  return (
    <main className="min-h-[100dvh] overflow-hidden py-8">
      <div className="container-tight">
        <section className="grid gap-5 lg:grid-cols-[0.74fr_1.26fr]">
          <div className="relative overflow-hidden rounded-[30px] border border-[var(--color-border)] bg-white p-3 shadow-[0_24px_90px_color-mix(in_srgb,var(--color-fg)_10%,transparent)] md:p-4">
            <div className="relative overflow-hidden rounded-[26px] bg-[var(--color-fg)] text-white">
              <img src={clientVehiclePhoto} alt={vehicleLabel} className="h-64 w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--color-fg)] to-transparent p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/62">carnet connecte</p>
                <h1 className="mt-2 max-w-[12ch] text-balance font-display text-4xl font-black leading-[0.9] tracking-[-0.065em] md:text-5xl">
                  {vehicleLabel}
                </h1>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  {clientName} suit l'etat du vehicule, les documents, les devis et les paiements.
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {clientQuickControls.map(([label, value]) => (
                <button
                  key={label}
                  type="button"
                  className="grid min-h-[74px] place-items-center rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 text-center transition hover:border-[var(--color-accent)] active:scale-[0.98]"
                >
                  <span className="grid size-7 place-items-center rounded-full bg-[var(--color-accent)] text-[11px] font-black text-white">
                    {label.slice(0, 1)}
                  </span>
                  <span className="text-[10px] font-black leading-3">{label}</span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-[var(--color-fg-subtle)]">{value}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-4">
              <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-border)]">
                {[
                  ["score", vehicle?.healthScore ?? 0],
                  ["plaque", vehicle?.plate || "DK 4582 AA"],
                  ["km", (vehicle?.mileage ?? 0).toLocaleString("fr-FR")],
                ].map(([label, value]) => (
                  <div key={label} className="bg-[var(--color-fg)] p-3">
                    <div className="tabular font-mono text-sm font-black text-white">{value}</div>
                    <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-white/50">{label}</div>
                  </div>
                ))}
              </div>
            </div>

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

            <div className="relative mt-6 grid gap-3 text-sm text-[var(--color-fg-muted)]">
              <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
                <span>Assurance</span>
                <span className="font-mono text-[var(--color-fg)]">{vehicle?.insuranceDue || "a confirmer"}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
                <span>Visite technique</span>
                <span className="font-mono text-[var(--color-fg)]">{vehicle?.inspectionDue || "a confirmer"}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
                <span>Prochaine vidange</span>
                <span className="font-mono text-[var(--color-fg)]">{(vehicle?.oilDueKm ?? 0).toLocaleString("fr-FR")} km</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                runClientAction("callback", {
                  action: "request_callback",
                  vehicleId: vehicle?.id,
                  reason: "Client demande un rappel depuis le carnet connecte",
                })
              }
              disabled={busyAction === "callback" || !vehicle?.id}
              className="mt-6 min-h-12 w-full rounded-[14px] bg-[var(--color-accent)] px-4 font-black text-[var(--color-accent-ink)] shadow-[0_18px_48px_rgba(223,68,56,0.18)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busyAction === "callback" ? "Envoi..." : "Demander un rappel atelier"}
            </button>
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
