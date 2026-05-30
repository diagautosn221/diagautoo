import Link from "next/link";
import { redirect } from "next/navigation";
import { OperationsConsole } from "@/components/product/OperationsConsole";
import { getSession } from "@/lib/auth/getSession";
import { LogoutButton } from "@/components/auth/LogoutButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AtelierPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/atelier");
  if (session.role === "client") redirect("/carnet");

  return (
    <main className="min-h-[100dvh] py-8">
      <div className="container-tight mb-5 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-fg-muted)]"
        >
          DiagAutoSN
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden rounded-[10px] border border-[var(--color-border)] bg-white/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-muted)] md:inline-flex">
            {session.fullName} · {session.role === "admin" ? "admin" : "atelier"}
          </span>
          <Link
            href="/atelier/clients"
            className="inline-flex min-h-9 items-center rounded-[10px] border border-[var(--color-border)] bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Clients
          </Link>
          <Link
            href="/atelier/installations"
            className="inline-flex min-h-9 items-center rounded-[10px] border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/8 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent)] transition hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-ink)]"
          >
            + Installer kit
          </Link>
          {session.role === "admin" && (
            <Link
              href="/admin"
              className="inline-flex min-h-9 items-center rounded-[10px] border border-[var(--color-border)] bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Admin CMS
            </Link>
          )}
          <LogoutButton />
        </div>
      </div>
      <OperationsConsole />
    </main>
  );
}
