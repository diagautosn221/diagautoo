import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/getSession";
import {
  getAtelierClientsListFromDb,
  getRecentInstallationsFromDb,
} from "@/lib/db/diagauto";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { InstallationConsole } from "@/components/atelier/InstallationConsole";
import { AtelierPageBand } from "@/components/atelier/AtelierPageBand";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function InstallationsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/atelier/installations");
  if (session.role === "client") redirect("/carnet");

  const clients = JSON.parse(JSON.stringify(getAtelierClientsListFromDb()));
  const recent = JSON.parse(JSON.stringify(getRecentInstallationsFromDb(10)));

  return (
    <main className="min-h-[100dvh] py-8">
      <div className="container-tight mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em]">
          <Link href="/atelier" className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
            Console
          </Link>
          <span className="text-[var(--color-fg-subtle)]">/</span>
          <span className="text-[var(--color-fg)]">Mises en service</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-[10px] border border-[var(--color-border)] bg-white/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-muted)] md:inline-flex">
            {session.fullName}
          </span>
          <Link
            href="/atelier/clients"
            className="inline-flex min-h-9 items-center rounded-[10px] border border-[var(--color-border)] bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Clients
          </Link>
          <LogoutButton />
        </div>
      </div>

      <AtelierPageBand
        scene="install"
        eyebrow="Mise en service · compte client"
        title="Connecter une voiture, ouvrir son carnet."
        caption="Depuis l'atelier, créez le compte du client, rattachez son véhicule et remettez-lui ses accès personnels sans exposer les données techniques."
        chips={[
          { label: "installations", value: String(recent.length) },
          { label: "délai install", value: "≈ 8 min" },
          { label: "remise accès", value: "1 fois" },
        ]}
      />

      <div className="container-tight">
        <header className="mb-8 sr-only">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Mise en service · compte client
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-4xl">
            Connecter une voiture, ouvrir son carnet.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-fg-muted)]">
            Depuis l'atelier, créez le compte du client, rattachez son véhicule
            et générez un mot de passe à transmettre au propriétaire. Les
            identifiants sont affichés une seule fois — copiez-les avant de
            quitter la page.
          </p>
        </header>

        <InstallationConsole clients={clients} initialInstallations={recent} />
      </div>
    </main>
  );
}
