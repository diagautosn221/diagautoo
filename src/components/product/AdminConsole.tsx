"use client";

import { type FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export type AdminCmsData = {
  pages: Array<{
    slug?: string;
    title?: string;
    description?: string;
    status?: string;
    updatedAt?: string;
  }>;
  services: Array<{
    id?: string;
    title?: string;
    description?: string;
    priceLabel?: string;
    status?: string;
    updatedAt?: string;
  }>;
  users: Array<{
    id?: string;
    fullName?: string;
    email?: string;
    role?: string;
    scope?: string;
    status?: string;
  }>;
  auditEvents: Array<{
    id?: string;
    actor?: string;
    action?: string;
    entity?: string;
    entityId?: string;
    summary?: string;
    createdAt?: string;
  }>;
  health: {
    integrity: string;
    storage: string;
    counts: {
      clients: number;
      vehicles: number;
      connectedDevices: number;
      unresolvedAlerts: number;
      openWorkOrders: number;
      pendingNotifications: number;
    };
  };
};

export type AdminOverviewData = {
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
  workOrders: Array<{
    id: string;
    time: string;
    client: string;
    vehicle: string;
    operation: string;
    status: string;
    amount: number;
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
};

type CmsResponse = {
  message: string;
  cms: AdminCmsData;
};

type AdminTab = "digest" | "cms" | "acces";
type DigestPriority = {
  id: string;
  tone: string;
  meta: string;
  title: string;
  detail: string;
};

const tabs: Array<{ key: AdminTab; label: string; caption: string }> = [
  { key: "digest", label: "Digest", caption: "quoi décider" },
  { key: "cms", label: "CMS", caption: "ce qui est public" },
  { key: "acces", label: "Accès", caption: "qui a touché" },
];

const moneyFormat = new Intl.NumberFormat("fr-SN", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-[10px] uppercase text-[var(--color-fg-subtle)]">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="command-input min-h-11 rounded-[12px] px-3 text-sm text-[var(--color-fg)] outline-none"
      />
    </label>
  );
}

function toneForSeverity(severity?: string) {
  if (severity === "blocked") return "border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 text-[var(--color-danger)]";
  if (severity === "urgent") return "border-[var(--color-accent)]/45 bg-[var(--color-accent)]/10 text-[var(--color-accent)]";
  if (severity === "watch") return "border-[var(--color-warn)]/45 bg-[var(--color-warn)]/10 text-[var(--color-warn)]";
  return "border-[var(--color-success)]/35 bg-[var(--color-success)]/10 text-[var(--color-success)]";
}

function niceStatus(value?: string) {
  if (!value) return "à vérifier";
  return value.replaceAll("_", " ");
}

function readable(value?: string | null) {
  return (value ?? "")
    .replace(/OBD-II/gi, "boîtier")
    .replace(/\bDTC\b/gi, "défaut")
    .replace(/DASN-IOT-\d+/gi, "capteur connecté")
    .replace(/temps reel/gi, "temps réel")
    .replace(/vehicule/gi, "véhicule")
    .replace(/controle/gi, "contrôle")
    .replace(/immediat/gi, "immédiat")
    .replace(/recommande/gi, "recommandé");
}

function StatTile({ label, value, caption }: { label: string; value: string | number; caption: string }) {
  return (
    <div className="metric-slab min-w-0 rounded-[16px] p-3 md:p-4">
      <div className="tabular break-words font-mono text-xl font-black text-[var(--color-fg)] md:text-2xl">{value}</div>
      <div className="mt-1 font-mono text-[9px] uppercase text-[var(--color-fg-subtle)] md:mt-2 md:text-[10px]">{label}</div>
      <p className="mt-2 hidden text-xs leading-5 text-[var(--color-fg-muted)] sm:block">{caption}</p>
    </div>
  );
}

function DigestLine({
  tone,
  title,
  meta,
  detail,
}: {
  tone: string;
  title: string;
  meta: string;
  detail: string;
}) {
  return (
    <article className="field-surface grid gap-3 rounded-[18px] p-4 sm:grid-cols-[auto_1fr] sm:items-start">
      <span className={`inline-flex w-fit rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase ${tone}`}>
        {meta}
      </span>
      <div>
        <h3 className="text-sm font-black leading-5 text-[var(--color-fg)]">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-[var(--color-fg-muted)]">{detail}</p>
      </div>
    </article>
  );
}

export function AdminConsole({
  initialCms,
  initialOverview,
}: {
  initialCms: AdminCmsData;
  initialOverview: AdminOverviewData;
}) {
  const [cms, setCms] = useState(initialCms);
  const [activeTab, setActiveTab] = useState<AdminTab>("digest");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const digest = useMemo(() => {
    const urgentAlerts = initialOverview.alerts.filter(
      (alert) => alert.severity === "urgent" || alert.severity === "blocked"
    );
    const dueDocuments = initialOverview.documents.filter((document) =>
      ["urgent", "expire_bientot", "a_renouveler"].includes(document.status)
    );
    const pendingNotifications = initialOverview.notifications.filter(
      (notification) => notification.status !== "envoye"
    );
    const openOrders = initialOverview.workOrders.filter((order) => order.status !== "livraison");
    const draftServices = cms.services.filter((service) => service.status !== "publie");
    const backlogCount =
      urgentAlerts.length + dueDocuments.length + pendingNotifications.length + draftServices.length;
    const priorityItems: DigestPriority[] = [
      ...urgentAlerts.slice(0, 2).map((alert) => ({
        id: alert.id,
        tone: toneForSeverity(alert.severity),
        meta: niceStatus(alert.severity),
        title: `${readable(alert.label)} - ${readable(alert.vehicle)}`,
        detail: `${readable(alert.client)} · ${readable(alert.due)} · ${readable(alert.source)}`,
      })),
      ...dueDocuments.slice(0, 1).map((document) => ({
        id: document.id,
        tone: toneForSeverity(document.status === "urgent" ? "urgent" : "watch"),
        meta: niceStatus(document.status),
        title: `${readable(document.label)} - ${readable(document.vehicle)}`,
        detail: `${readable(document.client)} · plaque ${document.plate} · échéance ${document.expiresAt ?? "à confirmer"}`,
      })),
      ...pendingNotifications.slice(0, 1).map((notification) => ({
        id: notification.id,
        tone: toneForSeverity("watch"),
        meta: notification.channel,
        title: `${readable(notification.template)} - ${readable(notification.client)}`,
        detail: `${readable(notification.vehicle ?? "compte client")} · prévu ${notification.scheduledFor}`,
      })),
    ];

    return {
      urgentAlerts,
      dueDocuments,
      pendingNotifications,
      openOrders,
      draftServices,
      backlogCount,
      priorityItems,
    };
  }, [cms.services, initialOverview.alerts, initialOverview.documents, initialOverview.notifications, initialOverview.workOrders]);

  async function submitService(event: FormEvent<HTMLFormElement>, serviceId?: string) {
    event.preventDefault();
    if (!serviceId) return;
    setBusy(serviceId);
    const form = new FormData(event.currentTarget);
    const payload = {
      action: "update_service",
      serviceId,
      title: String(form.get("title") || ""),
      description: String(form.get("description") || ""),
      priceLabel: String(form.get("priceLabel") || ""),
      status: String(form.get("status") || "brouillon"),
    };

    try {
      const response = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as CmsResponse | { error?: string };
      if (!response.ok || !("cms" in result)) {
        throw new Error("error" in result ? result.error : "cms failed");
      }
      setCms(result.cms);
      setMessage(result.message);
    } catch {
      setMessage("Sauvegarde impossible pour le moment.");
    } finally {
      setBusy(null);
    }
  }

  const verdict =
    digest.urgentAlerts.some((alert) => alert.severity === "blocked")
      ? "Décision admin requise"
      : digest.backlogCount > 0
        ? "À suivre aujourd'hui"
        : "Garage stable";

  return (
    <main className="min-h-[100dvh] py-6 md:py-8">
      <div className="container-tight">
        <section className="grid gap-4 lg:grid-cols-[0.74fr_1.26fr]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="premium-shell rounded-[30px] p-5 md:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase text-[var(--color-accent)]">
                Vue admin
              </p>
              <span className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase ${digest.backlogCount > 0 ? toneForSeverity("urgent") : toneForSeverity("ok")}`}>
                {verdict}
              </span>
            </div>
            <h1 className="mt-5 max-w-[12ch] text-balance font-display text-5xl font-black leading-[0.88] md:text-6xl">
              Le garage en une minute.
            </h1>
              <p className="mt-4 hidden text-sm leading-7 text-[var(--color-fg-muted)] sm:block">
                Cette vue est pour l'admin : peu de bruit, les décisions en haut,
                le CMS et les accès derrière un onglet.
              </p>
            <div className="mt-5 grid gap-2">
              <Link
                href="/atelier"
                className="inline-flex min-h-11 items-center justify-center rounded-[14px] bg-[var(--color-accent)] px-4 text-sm font-black text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px"
              >
                Ouvrir opérations garage
              </Link>
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center rounded-[14px] border border-[var(--color-border)] bg-white px-4 text-sm font-black text-[var(--color-fg)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] active:translate-y-px"
              >
                Voir la vitrine publique
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-2">
              <StatTile label="clients" value={initialOverview.summary.clients} caption="comptes suivis" />
              <StatTile label="véhicules" value={initialOverview.summary.vehicles} caption="carnets actifs" />
              <StatTile label="boîtiers" value={initialOverview.summary.connectedDevices} caption="connectés" />
              <StatTile label="priorités" value={digest.priorityItems.length} caption={`${digest.backlogCount} points total`} />
            </div>
          </motion.div>

          <section className="grid gap-4">
            <div className="panel rounded-[26px] p-3">
              <div className="grid grid-cols-3 gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    aria-pressed={activeTab === tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-[18px] border p-3 text-left transition active:translate-y-px ${
                      activeTab === tab.key
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                        : "border-[var(--color-border)] bg-white text-[var(--color-fg)] hover:border-[var(--color-accent)]"
                    }`}
                  >
                    <span className="block text-sm font-black">{tab.label}</span>
                    <span className="mt-1 block font-mono text-[9px] uppercase opacity-65">{tab.caption}</span>
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "digest" ? (
              <section className="grid gap-4">
                <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
                  <StatTile
                    label="atelier"
                    value={initialOverview.summary.openWorkOrders}
                    caption="ordres ouverts"
                  />
                  <StatTile
                    label="alertes"
                    value={initialOverview.summary.urgentAlerts}
                    caption="urgentes ou bloquantes"
                  />
                  <StatTile
                    label="relances"
                    value={digest.pendingNotifications.length}
                    caption="messages à envoyer"
                  />
                  <StatTile
                    label="prévision"
                    value={moneyFormat.format(initialOverview.summary.projectedRevenue)}
                    caption="travaux ouverts"
                  />
                </div>

                <div className="panel rounded-[26px] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase text-[var(--color-fg-subtle)]">
                        maintenant
                      </p>
                      <h2 className="mt-2 text-2xl font-black">
                        Ce qui mérite ton attention
                      </h2>
                    </div>
                    <span className="rounded-[10px] border border-[var(--color-border)] px-3 py-2 font-mono text-[10px] uppercase text-[var(--color-accent)]">
                      {digest.priorityItems.length} à lire
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {digest.priorityItems.map((item) => (
                      <DigestLine
                        key={item.id}
                        tone={item.tone}
                        meta={item.meta}
                        title={item.title}
                        detail={item.detail}
                      />
                    ))}
                    {digest.backlogCount > digest.priorityItems.length ? (
                      <div className="rounded-[18px] border border-[var(--color-border)] bg-white p-4 text-sm leading-6 text-[var(--color-fg-muted)]">
                        {digest.backlogCount - digest.priorityItems.length} autres points restent dans les modules
                        atelier, documents et relances. Le digest garde seulement les décisions les plus rapides à lire.
                      </div>
                    ) : null}
                    {digest.backlogCount === 0 ? (
                      <div className="rounded-[18px] border border-[var(--color-success)]/35 bg-[var(--color-success)]/10 p-4 text-sm font-semibold text-[var(--color-success)]">
                        Rien d'urgent à traiter. Le garage peut continuer sans décision admin immédiate.
                      </div>
                    ) : null}
                  </div>
                </div>
              </section>
            ) : null}

            {activeTab === "cms" ? (
              <section className="panel rounded-[26px] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase text-[var(--color-fg-subtle)]">
                      catalogue public
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      Services affichés sur le site
                    </h2>
                  </div>
                  <span className="rounded-[10px] border border-[var(--color-border)] px-3 py-2 font-mono text-[10px] uppercase text-[var(--color-accent)]">
                    {cms.services.length} items
                  </span>
                </div>

                {message ? (
                  <div className="mt-4 rounded-[16px] border border-[var(--color-success)]/35 bg-[var(--color-success)]/10 p-4 text-sm font-semibold text-[var(--color-success)]">
                    {message}
                  </div>
                ) : null}

                <div className="mt-5 grid gap-3">
                  {cms.services.map((service) => (
                    <form
                      key={service.id}
                      onSubmit={(event) => submitService(event, service.id)}
                      className="field-surface rounded-[20px] p-4"
                    >
                      <div className="grid gap-3 md:grid-cols-[0.82fr_1.2fr_0.6fr_0.46fr_auto] md:items-end">
                        <Field label="titre" name="title" defaultValue={service.title} />
                        <Field label="description" name="description" defaultValue={service.description} />
                        <Field label="prix" name="priceLabel" defaultValue={service.priceLabel} />
                        <label className="grid gap-2">
                          <span className="font-mono text-[10px] uppercase text-[var(--color-fg-subtle)]">
                            statut
                          </span>
                          <select
                            name="status"
                            defaultValue={service.status}
                            className="command-input min-h-11 rounded-[12px] px-3 text-sm text-[var(--color-fg)] outline-none"
                          >
                            <option value="publie">publie</option>
                            <option value="brouillon">brouillon</option>
                          </select>
                        </label>
                        <button
                          type="submit"
                          disabled={busy === service.id}
                          className="min-h-11 rounded-[12px] bg-[var(--color-accent)] px-4 text-sm font-black text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] disabled:opacity-50 active:translate-y-px"
                        >
                          {busy === service.id ? "..." : "Sauver"}
                        </button>
                      </div>
                    </form>
                  ))}
                </div>
              </section>
            ) : null}

            {activeTab === "acces" ? (
              <section className="grid gap-4 lg:grid-cols-2">
                <div className="panel rounded-[26px] p-5">
                  <h2 className="text-xl font-black">Comptes et rôles</h2>
                  <div className="mt-4 grid gap-2">
                    {cms.users.map((user) => (
                      <article key={user.id} className="field-surface rounded-[16px] p-4">
                        <div className="font-semibold">{user.fullName}</div>
                        <div className="mt-1 text-sm text-[var(--color-fg-muted)]">{user.email}</div>
                        <div className="mt-3 flex flex-wrap gap-2 font-mono text-[10px] uppercase text-[var(--color-accent)]">
                          <span>{user.role}</span>
                          <span>{user.status}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="panel rounded-[26px] p-5">
                  <h2 className="text-xl font-black">Journal récent</h2>
                  <div className="mt-4 grid gap-2">
                    {cms.auditEvents.length > 0 ? (
                      cms.auditEvents.slice(0, 6).map((event) => (
                        <article key={event.id} className="field-surface rounded-[16px] p-4">
                          <div className="font-semibold">{readable(event.summary)}</div>
                          <div className="mt-2 font-mono text-[10px] uppercase text-[var(--color-fg-subtle)]">
                            {event.actor} / {event.entity}
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="rounded-[16px] border border-[var(--color-border)] p-4 text-sm text-[var(--color-fg-muted)]">
                        Aucun événement sensible pour le moment.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            ) : null}
          </section>
        </section>
      </div>
    </main>
  );
}
