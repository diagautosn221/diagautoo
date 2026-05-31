"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BrandsStrip } from "@/components/marketing/BrandsStrip";
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

const promiseCards = [
  {
    title: "Anticiper les pannes",
    text: "La voiture remonte les signaux importants avant que la panne ne bloque ta journée.",
    image: "diagnostic" as const,
  },
  {
    title: "Économiser sur l'entretien",
    text: "Vidange, batterie, pneus, assurance et visite technique restent visibles au bon moment.",
    image: "service" as const,
  },
  {
    title: "Comprendre sans être mécano",
    text: "On traduit les alertes en actions simples : rouler, surveiller ou passer à l'atelier.",
    image: "hands" as const,
  },
  {
    title: "Suivre son carnet privé",
    text: "Chaque client a son compte personnel après installation du boîtier par DiagAutoSN.",
    image: "install" as const,
  },
];

const steps = [
  ["01", "On équipe la voiture", "Installation au garage ou sur rendez-vous, puis contrôle de la connexion."],
  ["02", "On ouvre le compte client", "Le propriétaire reçoit ses accès privés. Rien de confidentiel n'apparaît sur la vitrine."],
  ["03", "La voiture devient suivie", "Alertes, documents, devis, rappels et historique restent au même endroit."],
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
    <main className="paper-warm min-h-[100dvh] text-[var(--color-fg)]">
      <section className="relative overflow-hidden pt-24 pb-14 md:pt-28 md:pb-20">
        <div className="container-tight relative grid gap-8 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-[0.98fr_1.02fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <span className="kicker kicker-accent">
              <span className="size-1.5 rounded-full bg-[var(--color-accent)] live-dot" />
              Dakar · garage connecté
            </span>

            <h1 className="mt-8 max-w-[10ch] font-display text-[clamp(3.5rem,10vw,8rem)] font-light leading-[0.88] tracking-[-0.055em]">
              Ta voiture te parle.
              <span className="block font-display-italic text-[var(--color-accent)]">
                On traduit.
              </span>
            </h1>

            <p className="mt-8 max-w-[58ch] text-pretty text-lg leading-8 text-[var(--color-fg-muted)] md:text-xl md:leading-9">
              {publicCopy(homepage?.description) ||
                "DiagAutoSN aide les conducteurs au Sénégal à voir ce qui se passe sur leur voiture, anticiper les pannes et éviter les dépenses surprises."}
            </p>

            <p className="mt-5 max-w-[48ch] text-base leading-7 text-[var(--color-fg)]">
              La page publique explique le service. Les vraies informations de
              chaque véhicule restent derrière un compte privé, ouvert seulement
              après installation par notre garage.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="#contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-accent)] px-7 text-sm font-semibold text-[var(--color-accent-ink)] shadow-soft transition hover:bg-[var(--color-accent-soft)] hover:shadow-lifted active:translate-y-px"
              >
                Installer le service
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--color-fg)]/25 bg-white px-7 text-sm font-semibold text-[var(--color-fg)] transition hover:border-[var(--color-fg)] hover:bg-[var(--color-fg)] hover:text-white active:translate-y-px"
              >
                Accéder à mon compte
              </Link>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <figure className="grain-overlay grain-soft shadow-cinema relative isolate overflow-hidden rounded-[30px] bg-black">
              <img
                src={getWorkshopPhoto("diagnostic", "hero")}
                alt="Technicien automobile branchant un matériel de diagnostic sur une voiture"
                className="aspect-[4/4.7] w-full object-cover md:aspect-[5/4]"
                loading="eager"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_10%,rgba(0,0,0,0.78)_100%)]" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white md:p-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                  vraie voiture · vrai atelier · données privées
                </p>
                <p className="mt-3 max-w-[28ch] font-display text-2xl font-light leading-[1.1] md:text-3xl">
                  Le visiteur voit la promesse. Le client voit son véhicule.
                </p>
              </figcaption>
            </figure>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                ["public", "aucune plaque"],
                ["client", "compte privé"],
                ["garage", "suivi utile"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[14px] border border-[var(--color-border)] bg-white p-3 text-center shadow-soft">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-tight text-[var(--color-fg)]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      </section>

      <section id="services" className="container-tight py-14 md:py-18">
        <div className="grid gap-7 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <p className="kicker kicker-accent inline-flex">Ce qu'on fait</p>
            <h2 className="mt-6 max-w-[12ch] font-display text-[clamp(2.4rem,6vw,4.8rem)] font-light leading-[0.94] tracking-[-0.045em]">
              Moins de stress. Moins de dépenses surprises.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {promiseCards.map((card) => (
              <article key={card.title} className="panel overflow-hidden rounded-[20px]">
                <img
                  src={getWorkshopPhoto(card.image, "card")}
                  alt=""
                  className="h-24 w-full object-cover sm:h-36"
                  loading="lazy"
                />
                <div className="p-4 sm:p-5">
                  <h3 className="font-display text-lg font-medium leading-tight tracking-[-0.03em] sm:text-2xl">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-[var(--color-fg-muted)] sm:mt-3 sm:text-sm sm:leading-6">
                    {card.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BrandsStrip />

      <section id="preview" className="container-tight py-12 md:py-16">
        <div className="grid gap-6 rounded-[26px] border border-[var(--color-border)] bg-white p-5 shadow-soft md:grid-cols-[0.8fr_1.2fr] md:p-8">
          <div>
            <p className="kicker kicker-accent inline-flex">Après installation</p>
            <h2 className="mt-6 max-w-[13ch] font-display text-[clamp(2.1rem,5vw,4rem)] font-light leading-[0.98] tracking-[-0.04em]">
              Le compte client devient le tableau de bord personnel.
            </h2>
            <p className="mt-5 text-sm leading-7 text-[var(--color-fg-muted)]">
              Plaque, VIN, kilométrage, alertes et documents restent privés.
              La vitrine ne montre que le service.
            </p>
          </div>
          <div className="grid gap-3">
            {steps.map(([num, title, text]) => (
              <div key={num} className="grid grid-cols-[auto_1fr] gap-4 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  {num}
                </span>
                <div>
                  <h3 className="font-semibold text-[var(--color-fg)]">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-fg-muted)]">{text}</p>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-2">
              {["Vidange", "Assurance", "Visite technique"].map((item) => (
                <div key={item} className="rounded-[14px] border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/5 p-3 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="container-tight py-14 pb-24 md:py-18 md:pb-28">
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-stretch">
          <div className="panel rounded-[26px] p-6 md:p-8">
            <p className="kicker kicker-accent inline-flex">Devenir client</p>
            <h2 className="mt-6 max-w-[14ch] font-display text-[clamp(2.3rem,6vw,4.8rem)] font-light leading-[0.94] tracking-[-0.045em]">
              On équipe ta voiture, puis ton compte s'ouvre.
            </h2>
            <p className="mt-6 max-w-[58ch] text-base leading-8 text-[var(--color-fg-muted)]">
              Envoie la marque, le modèle et ton quartier. On te propose un
              créneau, on installe le boîtier, puis tu suis ton véhicule depuis
              ton carnet privé.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://wa.me/221"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-accent)] px-6 text-sm font-semibold text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px"
              >
                Écrire sur WhatsApp
              </a>
              <a
                href="mailto:contact@diagautosn.com"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-white px-6 text-sm font-semibold text-[var(--color-fg)] transition hover:bg-[var(--color-fg)] hover:text-white active:translate-y-px"
              >
                contact@diagautosn.com
              </a>
            </div>
          </div>

          <aside className="rounded-[26px] bg-[var(--color-fg)] p-6 text-white shadow-cinema md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
              Dakar · Sénégal
            </p>
            <h3 className="mt-5 font-display text-3xl font-light leading-[1] tracking-[-0.035em]">
              Atelier Mermoz. Déplacement possible selon zone.
            </h3>
            <ul className="mt-8 grid gap-4 text-sm leading-6 text-white/72">
              <li>Installation avec contrôle de connexion.</li>
              <li>Compte client ouvert uniquement par l'équipe DiagAutoSN.</li>
              <li>Alertes vidange, assurance, visite technique et diagnostic.</li>
              <li>Paiement Wave, Orange Money, espèces ou virement.</li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
