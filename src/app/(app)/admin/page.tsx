import Link from "next/link";
import { AdminConsole, type AdminCmsData } from "@/components/product/AdminConsole";
import { getAdminCmsFromDb } from "@/lib/db/diagauto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function AdminPage() {
  const cms = JSON.parse(JSON.stringify(getAdminCmsFromDb())) as AdminCmsData;

  return (
    <>
      <div className="container-tight pt-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link href="/" className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-fg-muted)]">
            DiagAutoSN
          </Link>
          <div className="flex gap-2">
            <Link
              href="/atelier"
              className="rounded-[10px] border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-fg)] transition hover:border-[var(--color-accent)]"
            >
              Atelier
            </Link>
            <Link
              href="/carnet"
              className="rounded-[10px] border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-fg)] transition hover:border-[var(--color-accent)]"
            >
              Client
            </Link>
          </div>
        </div>
      </div>
      <AdminConsole initialCms={cms} />
    </>
  );
}
