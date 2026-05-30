import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth/getSession";
import { getAtelierClientViewFromDb } from "@/lib/db/diagauto";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { AtelierClientCockpit } from "@/components/atelier/AtelierClientCockpit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Params = { clientId: string };

export default async function AtelierClientDrillIn({
  params,
}: {
  params: Promise<Params>;
}) {
  const session = await getSession();
  const { clientId } = await params;
  if (!session) redirect(`/login?next=/atelier/clients/${clientId}`);
  if (session.role === "client") redirect("/carnet");

  const view = getAtelierClientViewFromDb(clientId);
  if (!view) notFound();

  // Server passes raw JSON snapshot — client hydrates and polls fresh data.
  const initial = JSON.parse(JSON.stringify(view.vehicles));

  return (
    <main className="min-h-[100dvh] py-8">
      <div className="container-tight mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em]">
          <Link href="/atelier" className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
            Console
          </Link>
          <span className="text-[var(--color-fg-subtle)]">/</span>
          <Link
            href="/atelier/clients"
            className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
          >
            Clients
          </Link>
          <span className="text-[var(--color-fg-subtle)]">/</span>
          <span className="text-[var(--color-fg)]">{view.client.fullName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-[10px] border border-[var(--color-border)] bg-white/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-muted)] md:inline-flex">
            {session.fullName}
          </span>
          <LogoutButton />
        </div>
      </div>

      <AtelierClientCockpit
        client={view.client}
        initialVehicles={initial}
      />
    </main>
  );
}
