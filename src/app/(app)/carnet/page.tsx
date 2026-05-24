import Link from "next/link";
import { ClientPortal, type ClientPortalData } from "@/components/product/ClientPortal";
import { getClientPortalFromDb } from "@/lib/db/diagauto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CarnetSearchParams = {
  clientId?: string;
};

export default async function CarnetPage({ searchParams }: { searchParams?: Promise<CarnetSearchParams> }) {
  const params = await searchParams;
  const clientId = params?.clientId || "c-001";
  const portal = JSON.parse(JSON.stringify(getClientPortalFromDb(clientId))) as ClientPortalData;

  return (
    <>
      <div className="container-tight pt-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link href="/" className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-fg-muted)]">
            DiagAutoSN
          </Link>
          <Link
            href="/atelier"
            className="rounded-[10px] border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-fg)] transition hover:border-[var(--color-accent)]"
          >
            Vue atelier
          </Link>
        </div>
      </div>
      <ClientPortal clientId={clientId} initialPortal={portal} />
    </>
  );
}
