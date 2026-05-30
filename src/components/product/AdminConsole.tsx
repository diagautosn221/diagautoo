"use client";

import { type FormEvent, useState } from "react";

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

type CmsResponse = {
  message: string;
  cms: AdminCmsData;
};

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
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="command-input min-h-11 rounded-[12px] px-3 text-sm text-[var(--color-fg)] outline-none"
      />
    </label>
  );
}

export function AdminConsole({ initialCms }: { initialCms: AdminCmsData }) {
  const [cms, setCms] = useState(initialCms);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

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
      if (!response.ok || !("cms" in result)) throw new Error("error" in result ? result.error : "cms failed");
      setCms(result.cms);
      setMessage(result.message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="min-h-[100dvh] py-8">
      <div className="container-tight">
        <section className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="premium-shell rounded-[30px] p-5 md:p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Tour de contrôle DiagAutoSN
            </p>
            <h1 className="mt-5 max-w-[14ch] text-balance font-display text-5xl font-black leading-[0.88] tracking-[-0.065em] md:text-6xl">
              Pilote tout, sans toucher au code.
            </h1>
            <p className="mt-5 text-sm leading-7 text-[var(--color-fg-muted)]">
              D'ici tu changes les textes du site, tes offres, tu vois la santé
              de la plateforme et qui fait quoi. Tout ce qui paraît public part
              de cet écran.
            </p>
            {message ? (
              <div className="mt-6 rounded-[16px] border border-[var(--color-success)]/35 bg-[var(--color-success)]/10 p-4 text-sm font-semibold text-[var(--color-success)]">
                {message}
              </div>
            ) : null}
            <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-[var(--color-border)]">
              {[
                ["clients", cms.health.counts.clients],
                ["vehicules", cms.health.counts.vehicles],
                ["capteurs", cms.health.counts.connectedDevices],
                ["alertes", cms.health.counts.unresolvedAlerts],
              ].map(([label, value]) => (
                <div key={label} className="metric-slab p-4">
                  <div className="tabular font-mono text-2xl font-black">{value}</div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <section className="panel rounded-[26px] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                    catalogue public
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-[-0.045em]">Ce qu'on propose sur le site</h2>
                </div>
                <span className="rounded-[10px] border border-[var(--color-border)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-accent)]">
                  {cms.services.length} items
                </span>
              </div>
              <div className="mt-5 grid gap-3">
                {cms.services.map((service) => (
                  <form key={service.id} onSubmit={(event) => submitService(event, service.id)} className="field-surface rounded-[20px] p-4">
                    <div className="grid gap-3 md:grid-cols-[1fr_1.2fr_0.72fr_0.44fr_auto] md:items-end">
                      <Field label="titre" name="title" defaultValue={service.title} />
                      <Field label="description" name="description" defaultValue={service.description} />
                      <Field label="prix" name="priceLabel" defaultValue={service.priceLabel} />
                      <label className="grid gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">statut</span>
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
                        className="min-h-11 rounded-[12px] bg-[var(--color-accent)] px-4 text-sm font-black text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] disabled:opacity-50"
                      >
                        {busy === service.id ? "..." : "Sauver"}
                      </button>
                    </div>
                  </form>
                ))}
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <div className="panel rounded-[26px] p-5">
                <h2 className="text-xl font-black tracking-[-0.04em]">Qui peut faire quoi</h2>
                <div className="mt-4 grid gap-2">
                  {cms.users.map((user) => (
                    <article key={user.id} className="field-surface rounded-[16px] p-4">
                      <div className="font-semibold">{user.fullName}</div>
                      <div className="mt-1 text-sm text-[var(--color-fg-muted)]">{user.email}</div>
                      <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-accent)]">
                        {user.role}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              <div className="panel rounded-[26px] p-5">
                <h2 className="text-xl font-black tracking-[-0.04em]">Ce qui s'est passé dernièrement</h2>
                <div className="mt-4 grid gap-2">
                  {cms.auditEvents.length > 0 ? (
                    cms.auditEvents.map((event) => (
                      <article key={event.id} className="field-surface rounded-[16px] p-4">
                        <div className="font-semibold">{event.summary}</div>
                        <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
                          {event.actor} / {event.entity}
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[16px] border border-[var(--color-border)] p-4 text-sm text-[var(--color-fg-muted)]">
                      Aucun evenement sensible pour le moment.
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
