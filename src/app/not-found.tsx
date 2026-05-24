import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[100dvh] place-items-center px-5 py-16">
      <section className="panel max-w-xl rounded-[22px] p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
          erreur 404
        </p>
        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
          Cette route n'est pas dans le carnet.
        </h1>
        <p className="mt-5 text-pretty leading-7 text-[var(--color-fg-muted)]">
          La page demandée n'existe pas ou a été déplacée. Revenez à l'accueil
          pour reprendre le parcours DiagAutoSN.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-[10px] bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-accent-ink)] transition duration-200 hover:bg-[var(--color-accent-soft)] active:translate-y-px"
        >
          Retour à l'accueil
        </Link>
      </section>
    </main>
  );
}
