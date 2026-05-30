import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/getSession";
import { getAtelierClientsListFromDb } from "@/lib/db/diagauto";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { AtelierPageBand } from "@/components/atelier/AtelierPageBand";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AtelierClientsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/atelier/clients");
  if (session.role === "client") redirect("/carnet");

  const clients = getAtelierClientsListFromDb();

  return (
    <main className="min-h-[100dvh] py-8">
      <div className="container-tight mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/atelier"
            className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
          >
            ← Console
          </Link>
          <span className="text-[var(--color-fg-subtle)]">/</span>
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-fg)]">
            Clients
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-[10px] border border-[var(--color-border)] bg-white/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-muted)] md:inline-flex">
            {session.fullName}
          </span>
          <LogoutButton />
        </div>
      </div>

      <AtelierPageBand
        scene="team"
        eyebrow="Annuaire client · vue atelier"
        title={`${clients.length} ${clients.length > 1 ? "clients équipés" : "client équipé"} suivis depuis Dakar.`}
        caption="Drill-in sur n'importe quel client pour voir le même cockpit que lui — alertes, signaux IoT, historique."
        chips={[
          { label: "clients", value: String(clients.length) },
          {
            label: "alertes ouvertes",
            value: String(clients.reduce((sum, c) => sum + (c.openAlerts ?? 0), 0)),
          },
          {
            label: "santé moy.",
            value: clients.length
              ? `${Math.round(
                  clients.reduce((sum, c) => sum + (c.avgHealth ?? 0), 0) / clients.length
                )}/100`
              : "—",
          },
        ]}
      />

      <div className="container-tight">
        <div className="panel overflow-hidden rounded-[20px]">
          <div className="hidden grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr_0.6fr_0.5fr] border-b border-[var(--color-border)] px-6 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)] md:grid">
            <span>Client</span>
            <span>Ville</span>
            <span>Téléphone</span>
            <span>Véhicules</span>
            <span>Alertes</span>
            <span className="text-right">Santé moy.</span>
          </div>
          <ul className="divide-y divide-[var(--color-border)]">
            {clients.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/atelier/clients/${c.id}`}
                  className="grid grid-cols-2 items-center gap-4 px-5 py-4 transition hover:bg-white/[0.03] md:grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr_0.6fr_0.5fr] md:px-6"
                >
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-sm font-semibold text-[var(--color-fg)]">{c.fullName}</p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                      {c.id}
                    </p>
                  </div>
                  <span className="text-sm text-[var(--color-fg-muted)]">{c.city ?? "—"}</span>
                  <span className="font-mono text-sm text-[var(--color-fg-muted)]">{c.phone ?? "—"}</span>
                  <span className="tabular font-mono text-sm text-[var(--color-fg)]">
                    {c.vehicles}
                  </span>
                  <span
                    className="tabular font-mono text-sm"
                    style={{
                      color:
                        c.openAlerts === 0
                          ? "var(--color-success)"
                          : c.openAlerts > 2
                          ? "var(--color-danger)"
                          : "var(--color-warn)",
                    }}
                  >
                    {c.openAlerts}
                  </span>
                  <span
                    className="tabular text-right font-mono text-sm font-semibold"
                    style={{
                      color:
                        c.avgHealth >= 85
                          ? "var(--color-success)"
                          : c.avgHealth >= 70
                          ? "var(--color-warn)"
                          : "var(--color-accent)",
                    }}
                  >
                    {c.avgHealth}/100
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
