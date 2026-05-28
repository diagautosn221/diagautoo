import Link from "next/link";

type PublicHomeProps = {
  site: {
    pages: Array<{
      slug?: string;
      title?: string;
      description?: string;
      status?: string;
    }>;
    services: Array<{
      id?: string;
      title?: string;
      description?: string;
      priceLabel?: string;
      status?: string;
    }>;
    proof: {
      clients: number;
      vehicles: number;
      connectedDevices: number;
    };
  };
};

const journeys = [
  ["1", "Vous venez au garage", "Reception, controle initial, photos, documents et ouverture du dossier."],
  ["2", "Le vehicule est connecte", "Le boitier IoT remonte les signaux utiles pour l'atelier et le compte client."],
  ["3", "Vous suivez tout", "Alertes, devis, paiement, documents et historique restent accessibles dans votre compte."],
];

export function PublicHome({ site }: PublicHomeProps) {
  const homepage = site.pages.find((page) => page.slug === "accueil");

  return (
    <main className="min-h-[100dvh] pt-28">
      <section className="container-tight grid gap-8 pb-12 lg:grid-cols-[0.94fr_1.06fr] lg:items-end">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
            DiagAutoSN
          </p>
          <h1 className="mt-5 max-w-[11ch] text-balance font-display text-5xl font-black leading-[0.88] tracking-[-0.065em] md:text-7xl">
            Votre garage devient un centre de controle connecte.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-[var(--color-fg-muted)] md:text-lg">
            {homepage?.description ||
              "Diagnostic, entretien, documents, devis, paiements et alertes IoT dans une experience claire pour le garage et ses clients."}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center justify-center rounded-[14px] bg-[var(--color-accent)] px-5 text-sm font-black text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px"
            >
              Ouvrir mon espace
            </Link>
            <Link
              href="/atelier"
              className="inline-flex min-h-12 items-center justify-center rounded-[14px] border border-[var(--color-border)] px-5 text-sm font-semibold text-[var(--color-fg)] transition hover:border-[var(--color-accent)] active:translate-y-px"
            >
              Voir le cockpit garage
            </Link>
          </div>
        </div>

        <div className="premium-shell relative min-h-[520px] overflow-hidden rounded-[30px] p-5 md:p-6">
          <div className="absolute inset-0 vehicle-scan-grid opacity-40" />
          <div className="relative grid h-full gap-4">
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[22px] border border-[var(--color-border)] bg-[var(--color-border)]">
              {[
                ["clients", site.proof.clients],
                ["vehicules", site.proof.vehicles],
                ["capteurs", site.proof.connectedDevices],
              ].map(([label, value]) => (
                <div key={label} className="metric-slab p-4">
                  <div className="tabular font-mono text-2xl font-black">{value}</div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
                    {label}
                  </div>
                </div>
              ))}
            </div>
            <div className="relative min-h-[310px] overflow-hidden rounded-[26px] border border-[var(--color-border)] bg-[var(--color-bg)]">
              <div className="absolute inset-x-[9%] top-[18%] h-[46%] rounded-[50%_50%_18%_18%] border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10" />
              <div className="absolute bottom-[18%] left-[20%] size-14 rounded-full border-[10px] border-[var(--color-bg)] bg-[var(--color-border-strong)]" />
              <div className="absolute bottom-[18%] right-[20%] size-14 rounded-full border-[10px] border-[var(--color-bg)] bg-[var(--color-border-strong)]" />
              <div className="scan-line absolute left-1/2 top-0 h-14 w-[86%] -translate-x-1/2 rounded-full bg-[var(--color-accent)]/20" />
              {["OBD", "huile", "assurance"].map((label, index) => (
                <span
                  key={label}
                  className="absolute rounded-full border border-[var(--color-accent)]/35 bg-[var(--color-bg)]/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-accent)]"
                  style={{ left: `${22 + index * 22}%`, top: `${36 + (index % 2) * 18}%` }}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {journeys.map(([step, title, text]) => (
                <article key={step} className="field-surface rounded-[18px] p-4">
                  <div className="font-mono text-xs text-[var(--color-accent)]">{step}</div>
                  <h2 className="mt-2 text-sm font-black">{title}</h2>
                  <p className="mt-2 text-xs leading-5 text-[var(--color-fg-muted)]">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="container-tight pb-16">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
              services publics
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] md:text-5xl">
              Ce que le visiteur doit comprendre avant meme de creer un compte.
            </h2>
          </div>
          <Link
            href="/admin"
            className="inline-flex min-h-11 items-center justify-center rounded-[12px] border border-[var(--color-border)] px-4 text-sm font-semibold hover:border-[var(--color-accent)]"
          >
            Gerer le CMS
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {site.services.map((service) => (
            <article key={service.id} className="panel rounded-[24px] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent)]">
                {service.priceLabel}
              </p>
              <h3 className="mt-4 text-xl font-black tracking-[-0.035em]">{service.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--color-fg-muted)]">{service.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
