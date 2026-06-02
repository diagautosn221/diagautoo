import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AdminConsole,
  type AdminCmsData,
  type AdminOverviewData,
} from "@/components/product/AdminConsole";
import { getAdminCmsFromDb, getGarageOverviewFromDb } from "@/lib/db/diagauto";
import { getSession } from "@/lib/auth/getSession";
import { LogoutButton } from "@/components/auth/LogoutButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  if (session.role !== "admin") {
    redirect(session.role === "atelier" ? "/atelier" : "/carnet");
  }

  const cms = JSON.parse(JSON.stringify(getAdminCmsFromDb())) as AdminCmsData;
  const overview = JSON.parse(JSON.stringify(getGarageOverviewFromDb())) as AdminOverviewData;

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
          <div className="flex items-center gap-2">
            <span className="hidden rounded-[10px] border border-[var(--color-border)] bg-white/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-muted)] md:inline-flex">
              {session.fullName} · admin
            </span>
            <Link
              href="/atelier"
              className="inline-flex min-h-9 items-center rounded-[10px] border border-[var(--color-border)] bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Atelier
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>
      <AdminConsole initialCms={cms} initialOverview={overview} />
    </>
  );
}
