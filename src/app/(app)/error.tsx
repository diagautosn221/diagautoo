"use client";

import { useEffect } from "react";
import Link from "next/link";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Catches every uncaught render error inside (app)/*. Without this, a
 * single broken render would blank the entire authenticated surface.
 *
 * Logs the digest in dev so we can correlate with the server stack.
 */
export default function AppError({ error, reset }: AppErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[(app) boundary]", error);
    }
  }, [error]);

  return (
    <main className="grid min-h-[100dvh] place-items-center px-5 py-16">
      <section className="panel max-w-xl rounded-[22px] p-7 md:p-9">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-danger)]">
          incident technique
        </p>
        <h1 className="mt-5 text-balance font-display text-3xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-4xl">
          On a perdu le signal une seconde.
        </h1>
        <p className="mt-5 max-w-[58ch] text-pretty leading-7 text-[var(--color-fg-muted)]">
          Quelque chose s'est mal passé pendant le rendu de cette page. Le reste
          de la plateforme tourne — vous pouvez relancer la vue ou revenir à
          l'accueil. Si l'incident se reproduit, transmettez le code ci-dessous
          au support.
        </p>

        {error.digest && (
          <p className="mt-5 inline-block rounded-md border border-[var(--color-border)] bg-white/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
            digest · {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-11 items-center justify-center rounded-[10px] bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px"
          >
            Relancer la vue
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-[10px] border border-[var(--color-border-strong)] bg-white px-5 text-sm font-semibold text-[var(--color-fg)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] active:translate-y-px"
          >
            Retour à l'accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
