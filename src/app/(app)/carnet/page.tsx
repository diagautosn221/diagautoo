import { redirect } from "next/navigation";
import Link from "next/link";
import { ClientPortal, type ClientPortalData } from "@/components/product/ClientPortal";
import { getClientPortalFromDb } from "@/lib/db/diagauto";
import { getSession } from "@/lib/auth/getSession";
import { LogoutButton } from "@/components/auth/LogoutButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function CarnetPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/carnet");
  if (session.role !== "client" || !session.clientId) {
    redirect(session.role === "atelier" ? "/atelier" : "/admin");
  }

  const portal = JSON.parse(
    JSON.stringify(getClientPortalFromDb(session.clientId))
  ) as ClientPortalData;

  return (
    <>
      <div className="container-tight pt-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-fg-muted)]"
          >
            DiagAutoSN
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-[10px] border border-[var(--color-border)] bg-white/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-muted)] md:inline-flex">
              {session.fullName}
            </span>
            <LogoutButton />
          </div>
        </div>
      </div>
      <ClientPortal initialPortal={portal} />
    </>
  );
}
