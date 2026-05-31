"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getWorkshopPhoto } from "@/lib/photos";

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

const essentials = [
  {
    title: "Panne anticipée",
    text: "La voiture prévient avant de te bloquer.",
  },
  {
    title: "Rappels utiles",
    text: "Vidange, assurance et visite technique au même endroit.",
  },
  {
    title: "Compte privé",
    text: "Chaque client voit seulement ses propres infos.",
  },
  {
    title: "Garage prêt",
    text: "Ton mécanicien reçoit le contexte avant l'appel.",
  },
];

const flow = [
  ["1", "On installe", "Boîtier discret, contrôle de connexion, vraie voiture."],
  ["2", "Tu te connectes", "Compte personnel avec alertes, documents et historique."],
  ["3", "Tu gagnes du temps", "Moins d'oublis, moins de dépenses surprises, moins de stress."],
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
      <section className="container-tight pt-24 pb-6 md:pt-28">
        <div className="relative isolate overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-fg)] shadow-cinema">
          <img
            src={getWorkshopPhoto("diagnostic", "hero")}
            alt="Technicien automobile branchant un matériel de diagnostic sur une voiture"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background:
                "linear-gradient(110deg, rgba(10,10,12,0.88) 0%, rgba(10,10,12,0.70) 45%, rgba(10,10,12,0.20) 100%)",
            }}
          />

          <div className="relative grid min-h-[calc(100svh-7rem)] content-between gap-8 p-5 text-white sm:p-7 lg:min-h-[620px] lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl lg:self-center"
            >
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/80 backdrop-blur">
                Dakar · garage connecté
              </span>
              <h1 className="mt-6 max-w-[11ch] font-display text-[clamp(3rem,12vw,7rem)] font-light leading-[0.9] tracking-[-0.055em]">
                Ta voiture parle.
                <span className="block font-display-italic text-[var(--color-accent)]">
                  On traduit.
                </span>
              </h1>
              <p className="mt-6 max-w-[46ch] text-base leading-7 text-white/76 md:text-lg md:leading-8">
                {publicCopy(homepage?.description) ||
                  "DiagAutoSN aide les conducteurs au Sénégal à anticiper les pannes, éviter les oublis et économiser de l'argent."}
              </p>
              <p className="mt-3 max-w-[44ch] text-sm leading-6 text-white/64">
                Public : juste le service. Client équipé : compte privé avec la
                vraie voiture, ses alertes et ses papiers.
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5">
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

            <div className="grid grid-cols-3 gap-2 self-end lg:col-span-2">
              {[
                ["public", "aucune donnée privée"],
                ["client", "alertes en direct"],
                ["garage", "action rapide"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[14px] border border-white/12 bg-black/42 p-3 backdrop-blur-md">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/48">
                    {label}
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-tight text-white sm:text-sm">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="container-tight py-6">
        <div className="grid gap-3 md:grid-cols-[0.76fr_1.24fr]">
          <div className="rounded-[22px] border border-[var(--color-border)] bg-white p-5 shadow-soft md:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
              En 30 secondes
            </p>
            <h2 className="mt-4 max-w-[12ch] font-display text-[clamp(2rem,5vw,3.6rem)] font-light leading-[0.96] tracking-[-0.04em]">
              Pourquoi ça vaut le coup.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[var(--color-fg-muted)]">
              Tu ne lis pas un manuel. Tu vois quoi faire, quand le faire, et
              combien de temps tu peux attendre.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {essentials.map((item) => (
              <article key={item.title} className="rounded-[18px] border border-[var(--color-border)] bg-white p-4 shadow-soft">
                <h3 className="font-display text-xl font-medium leading-tight tracking-[-0.03em] text-[var(--color-fg)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-[var(--color-fg-muted)] sm:text-sm sm:leading-6">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="preview" className="container-tight py-6">
        <div className="grid gap-3 rounded-[24px] border border-[var(--color-border)] bg-white p-5 shadow-soft md:grid-cols-[1fr_1fr] md:p-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Après installation
            </p>
            <h2 className="mt-4 max-w-[13ch] font-display text-[clamp(2rem,5vw,3.6rem)] font-light leading-[0.96] tracking-[-0.04em]">
              Tout est dans ton compte privé.
            </h2>
          </div>

          <div className="grid gap-2">
            {flow.map(([num, title, text]) => (
              <div key={num} className="grid grid-cols-[auto_1fr] gap-3 rounded-[15px] bg-[var(--color-bg-elevated)] p-3">
                <span className="grid size-7 place-items-center rounded-full bg-[var(--color-accent)] font-mono text-[10px] text-[var(--color-accent-ink)]">
                  {num}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-fg)]">{title}</h3>
                  <p className="mt-0.5 text-xs leading-5 text-[var(--color-fg-muted)]">{text}</p>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {["Vidange", "Assurance", "Visite"].map((item) => (
                <span key={item} className="rounded-full border border-[var(--color-accent)]/24 px-2 py-2 text-center font-mono text-[9px] uppercase tracking-[0.13em] text-[var(--color-accent)]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="container-tight py-6 pb-12">
        <div className="grid gap-3 rounded-[26px] bg-[var(--color-fg)] p-5 text-white shadow-cinema md:grid-cols-[1.1fr_0.9fr] md:p-7">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
              Devenir client
            </p>
            <h2 className="mt-4 max-w-[13ch] font-display text-[clamp(2.1rem,5vw,4rem)] font-light leading-[0.96] tracking-[-0.045em]">
              On équipe ta voiture, ton compte s'ouvre.
            </h2>
          </div>
          <div className="grid content-end gap-3">
            <p className="text-sm leading-6 text-white/70">
              Envoie marque, modèle et quartier. On propose un créneau, on
              installe, puis tu suis ta voiture depuis ton carnet privé.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href="https://wa.me/221"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px"
              >
                WhatsApp
              </a>
              <a
                href="mailto:contact@diagautosn.com"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/18 px-5 text-sm font-semibold text-white transition hover:bg-white hover:text-[var(--color-fg)] active:translate-y-px"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
