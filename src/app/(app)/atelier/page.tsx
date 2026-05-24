import Link from "next/link";
import { OperationsConsole } from "@/components/product/OperationsConsole";

export default function AtelierPage() {
  return (
    <main className="min-h-[100dvh] py-8">
      <div className="container-tight mb-5 flex items-center justify-between gap-4">
        <Link href="/" className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-fg-muted)]">
          DiagAutoSN
        </Link>
        <Link
          href="/carnet"
          className="rounded-[10px] border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-fg)] transition hover:border-[var(--color-accent)]"
        >
          Vue client
        </Link>
      </div>
      <OperationsConsole />
    </main>
  );
}
