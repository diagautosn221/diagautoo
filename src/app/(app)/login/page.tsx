import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/getSession";
import { LoginForm } from "@/components/auth/LoginForm";
import { getWorkshopPhoto } from "@/lib/photos";

type LoginPageProps = {
  searchParams?: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const session = await getSession();
  if (session) {
    const fallback =
      session.role === "client"
        ? "/carnet"
        : session.role === "atelier"
        ? "/atelier"
        : "/admin";
    redirect(params?.next ?? fallback);
  }

  return (
    <main className="grid min-h-[100dvh] grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
      {/* ── Left — full-bleed atelier photo with quote overlay ────────── */}
      <aside className="relative isolate hidden overflow-hidden bg-black lg:block">
        <img
          src={getWorkshopPhoto("hero", "hero")}
          alt="Atelier DiagAutoSN"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.78) 100%)",
          }}
        />

        {/* Top brand chip */}
        <div className="absolute left-8 top-8 flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-[var(--color-accent)] live-dot" />
          <Link
            href="/"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/85 hover:text-white"
          >
            DiagAutoSN · Dakar
          </Link>
        </div>

        {/* Bottom quote */}
        <div className="absolute inset-x-8 bottom-10 text-white">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
            le diagnostic qui va plus loin
          </p>
          <h2 className="mt-3 max-w-[18ch] font-display text-3xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-4xl">
            Votre voiture parle. Votre carnet écoute.
          </h2>
          <p className="mt-4 max-w-[44ch] text-sm leading-7 text-white/75">
            Suivi temps réel de la voiture, alertes, documents et historique
            atelier au même endroit, pour vous et votre garagiste.
          </p>

          <div className="mt-7 grid grid-cols-3 gap-3 max-w-[420px]">
            {[
              ["Score", "santé"],
              ["Panne", "détection"],
              ["Alertes", "live"],
            ].map(([t, s]) => (
              <div
                key={t}
                className="rounded-[12px] border border-white/12 bg-black/40 p-3 backdrop-blur-md"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                  {s}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Right — login form ─────────────────────────────────────────── */}
      <section className="relative flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] lg:hidden"
          >
            ← DiagAutoSN
          </Link>

          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
            connexion · carnet privé
          </p>
          <h1 className="mt-4 text-balance font-display text-4xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-5xl">
            Votre carnet vous attend.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--color-fg-muted)]">
            Accès réservé aux clients dont la voiture est équipée par DiagAutoSN,
            à l'équipe atelier et à l'administration. Identifiants fournis lors
            de la mise en service.
          </p>

          <LoginForm nextPath={params?.next ?? null} />

          <details className="mt-7 rounded-[12px] border border-[var(--color-border)] bg-white/50 p-3 text-xs text-[var(--color-fg-muted)]">
            <summary className="cursor-pointer font-mono uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
              comptes de démonstration
            </summary>
            <div className="mt-3 grid gap-2 font-mono text-[11px]">
              <DemoRow role="Client" email="awa.diop@diagautosn.local" />
              <DemoRow role="Atelier" email="atelier@diagautosn.local" />
              <DemoRow role="Admin" email="admin@diagautosn.local" />
              <div className="mt-2 border-t border-[var(--color-border)] pt-2 text-[var(--color-fg-subtle)]">
                Mot de passe (démo) :{" "}
                <span className="font-semibold text-[var(--color-fg)]">diagauto</span>
              </div>
            </div>
          </details>
        </div>
      </section>
    </main>
  );
}

function DemoRow({ role, email }: { role: string; email: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[var(--color-fg-subtle)]">{role}</span>
      <span className="truncate">{email}</span>
    </div>
  );
}
