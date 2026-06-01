"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PEXELS, getWorkshopPhoto } from "@/lib/photos";

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

const alerts = ["Panne", "Vidange", "Assurance", "Visite technique"];

const essentials = [
  {
    title: "Installé",
    text: "Un boîtier discret est posé et vérifié au garage.",
  },
  {
    title: "Alerté",
    text: "Panne, vidange, assurance et visite technique arrivent au bon moment.",
  },
  {
    title: "Préparé",
    text: "Ton mécanicien voit le contexte utile avant de t'appeler.",
  },
  {
    title: "Économies",
    text: "Moins d'oublis, moins d'immobilisation, moins de mauvaises surprises.",
  },
];

function publicCopy(value?: string) {
  return (value ?? "")
    .replace(/OBD-II/gi, "boîtier")
    .replace(/\bIoT\b/gi, "connecté")
    .replace(/\bDTC\b/gi, "défaut moteur");
}

export function PublicHome({ site }: PublicHomeProps) {
  const homepage = site.pages.find((page) => page.slug === "accueil");

  return (
    <main className="min-h-[100dvh] bg-[var(--color-bg)] text-[var(--color-fg)]">
      <section className="container-tight pt-24 pb-4 md:pt-28">
        <div className="relative isolate overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-fg)] shadow-cinema">
          <img
            src={PEXELS.redSuv}
            alt="Voiture rouge moderne utilisée pour présenter le service DiagAutoSN"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background:
                "linear-gradient(105deg, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.74) 42%, rgba(8,8,10,0.12) 100%)",
            }}
          />

          <div className="relative grid min-h-[520px] content-between gap-5 p-5 text-white sm:min-h-[620px] sm:p-7 lg:grid-cols-[0.86fr_1.14fr] lg:p-10">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl lg:self-center"
            >
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 font-mono text-[10px] uppercase text-white/80 backdrop-blur">
                Dakar - garage connecté
              </span>
              <h1 className="mt-5 max-w-[10ch] font-display text-[3.35rem] font-light leading-[0.88] sm:text-[4.8rem] lg:text-[6.6rem]">
                Évite la panne.
                <span className="block font-display-italic text-[var(--color-accent)]">
                  Garde ton argent.
                </span>
              </h1>
              <p className="mt-5 max-w-[44ch] text-[15px] leading-7 text-white/78 sm:text-base">
                {publicCopy(homepage?.description) ||
                  "DiagAutoSN aide les conducteurs au Sénégal à anticiper les pannes, éviter les oublis et économiser de l'argent."}
              </p>
              <p className="mt-2 max-w-[42ch] text-sm leading-6 text-white/62">
                Public : on montre le service. Client équipé : compte privé,
                vraie voiture, vraies alertes, carnet à jour.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link
                  href="#contact"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-accent)] px-6 text-sm font-semibold text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px"
                >
                  Je veux installer
                </Link>
                <Link
                  href="/login"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/22 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-[var(--color-fg)] active:translate-y-px"
                >
                  Mon compte
                </Link>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-2 self-end sm:grid-cols-4 lg:col-span-2">
              {alerts.map((label) => (
                <div
                  key={label}
                  className="rounded-[14px] border border-white/12 bg-black/46 p-3 backdrop-blur-md"
                >
                  <p className="font-mono text-[9px] uppercase text-white/48">alerte</p>
                  <p className="mt-1 text-xs font-semibold leading-tight text-white sm:text-sm">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="container-tight py-3 md:py-4">
        <div className="grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative isolate min-h-[240px] overflow-hidden rounded-[24px] bg-[var(--color-fg)] p-4 text-white shadow-cinema md:min-h-full md:p-6">
            <img
              src={getWorkshopPhoto("diagnostic", "card")}
              alt="Matériel de diagnostic automobile utilisé dans un garage"
              className="absolute inset-0 h-full w-full object-cover opacity-55"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/25" aria-hidden />
            <div className="relative flex h-full min-h-[210px] flex-col justify-between">
              <p className="font-mono text-[10px] uppercase text-white/55">
                Simple pour le client
              </p>
              <div>
                <h2 className="max-w-[10ch] font-display text-[2.35rem] font-light leading-[0.92] sm:text-[3.4rem]">
                  Tu sais quoi faire.
                </h2>
                <p className="mt-3 max-w-[34ch] text-sm leading-6 text-white/68">
                  Pas besoin de connaître les termes auto. DiagAutoSN transforme
                  les signaux de la voiture en actions simples.
                </p>
              </div>
            </div>
          </div>

          <div
            id="preview"
            className="grid gap-2 rounded-[24px] border border-[var(--color-border)] bg-white p-3 shadow-soft md:p-5"
          >
            <div className="grid grid-cols-2 gap-2">
              {essentials.map((item) => (
                <article key={item.title} className="rounded-[16px] bg-[var(--color-bg-elevated)] p-3 md:p-4">
                  <h3 className="font-display text-[1.1rem] font-medium leading-none text-[var(--color-fg)] md:text-[1.45rem]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[11px] leading-4 text-[var(--color-fg-muted)] md:text-sm md:leading-6">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>

            <div className="rounded-[20px] bg-[var(--color-fg)] p-4 text-white">
              <p className="font-mono text-[10px] uppercase text-white/45">Compte privé</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <h2 className="max-w-[15ch] font-display text-[2.25rem] font-light leading-[0.94] sm:text-[3rem]">
                  Ta voiture, tes papiers, tes alertes.
                </h2>
                <Link
                  href="/login"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/18 px-5 text-sm font-semibold text-white transition hover:bg-white hover:text-[var(--color-fg)] active:translate-y-px"
                >
                  Accéder
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="container-tight py-3 pb-9 md:py-4 md:pb-10">
        <div className="grid gap-4 rounded-[26px] bg-[var(--color-accent)] p-4 text-[var(--color-accent-ink)] shadow-cinema md:grid-cols-[1fr_auto] md:items-center md:p-6">
          <div>
            <p className="font-mono text-[10px] uppercase text-[var(--color-accent-ink)]/55">
              Devenir client
            </p>
            <h2 className="mt-3 max-w-[15ch] font-display text-[2.45rem] font-light leading-[0.94] sm:text-[3.4rem]">
              On installe. Ton compte s'ouvre.
            </h2>
            <p className="mt-3 max-w-[46ch] text-sm leading-6 text-[var(--color-accent-ink)]/70">
              Envoie marque, modèle et quartier. On propose un créneau, on pose
              le kit, puis tu suis ta voiture depuis ton espace privé.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 md:justify-end">
            <a
              href="https://wa.me/221"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-accent-ink)] px-5 text-sm font-semibold text-white transition hover:bg-black active:translate-y-px"
            >
              WhatsApp
            </a>
            <a
              href="mailto:contact@diagautosn.com"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--color-accent-ink)]/18 px-5 text-sm font-semibold text-[var(--color-accent-ink)] transition hover:bg-white active:translate-y-px"
            >
              Email
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
