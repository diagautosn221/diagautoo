import Link from "next/link";
import { getWorkshopPhoto } from "@/lib/photos";

export default function NotFound() {
  return (
    <main className="relative isolate grid min-h-[100dvh] place-items-center overflow-hidden bg-black px-5 py-16">
      <img
        src={getWorkshopPhoto("bay", "hero")}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        loading="eager"
      />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.78) 100%)",
        }}
      />

      <section className="relative z-10 max-w-xl text-center text-white">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
          erreur 404
        </p>
        <h1 className="mt-6 text-balance font-display text-5xl font-semibold leading-[0.95] tracking-[-0.045em] md:text-6xl">
          Cette route n'est pas dans le carnet.
        </h1>
        <p className="mt-6 text-pretty leading-7 text-white/70">
          La page demandée n'existe pas, a été déplacée, ou nécessite un compte
          que vous n'avez pas ouvert. Reprenez depuis l'accueil.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-accent)] px-6 text-sm font-semibold text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px"
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/8 px-6 text-sm font-semibold text-white transition hover:border-white/60 active:translate-y-px"
          >
            Se connecter
          </Link>
        </div>

        <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
          DiagAutoSN · Dakar
        </p>
      </section>
    </main>
  );
}
