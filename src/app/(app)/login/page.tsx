import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="grid min-h-[100dvh] place-items-center px-4 py-10">
      <section className="panel w-full max-w-md rounded-[28px] p-6 md:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">connexion</p>
        <h1 className="mt-4 text-4xl font-black leading-[0.92] tracking-[-0.055em]">
          Choisir un espace.
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--color-fg-muted)]">
          Cette entree simule le routage des comptes garage et client avant branchement auth complet.
        </p>
        <div className="mt-7 grid gap-3">
          <Link
            href="/atelier"
            className="rounded-[16px] bg-[var(--color-accent)] px-5 py-4 text-center font-semibold text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px"
          >
            Entrer comme garage
          </Link>
          <Link
            href="/carnet"
            className="rounded-[16px] border border-[var(--color-border)] px-5 py-4 text-center font-semibold text-[var(--color-fg)] transition hover:border-[var(--color-accent)] active:translate-y-px"
          >
            Entrer comme client
          </Link>
        </div>
      </section>
    </main>
  );
}
