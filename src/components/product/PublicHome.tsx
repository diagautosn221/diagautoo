"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LockedPreview } from "@/components/marketing/LockedPreview";
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

const pillars: Array<{
  badge: string;
  title: string;
  text: string;
  scene: "service" | "training" | "hands" | "install" | "diagnostic" | "bay" | "hero" | "team";
}> = [
  {
    badge: "01",
    title: "Ta voiture sous l'œil, 24/7",
    text:
      "Un petit boîtier branché sous le volant te dit tout ce qui se passe. Tu ouvres ton téléphone, tu sais.",
    scene: "install",
  },
  {
    badge: "02",
    title: "Anticipe au lieu de réparer",
    text:
      "On te prévient avant que la panne devienne grosse. Une vidange à temps, c'est 100 000 F économisés sur un moteur.",
    scene: "hands",
  },
  {
    badge: "03",
    title: "Tes papiers en règle",
    text:
      "Assurance, visite technique, vidange : on te rappelle quoi faire et quand. Plus de PV, plus d'oubli.",
    scene: "service",
  },
  {
    badge: "04",
    title: "Ton mécano en direct",
    text:
      "Ton garagiste voit la même chose que toi. Tu n'as pas à expliquer. Un clic, il intervient.",
    scene: "training",
  },
];

const heroCarImage =
  "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1400";

const privateBenefits = [
  "Sache à tout moment comment ta voiture va",
  "Reçois une alerte avant l'assurance, la visite, la vidange",
  "Parle direct à ton garagiste, il voit ce que tu vois",
];

export function PublicHome({ site }: PublicHomeProps) {
  const homepage = site.pages.find((page) => page.slug === "accueil");

  return (
    <main className="min-h-[100dvh] bg-[var(--color-bg)] text-[var(--color-fg)]">
      {/* ============== HERO ============== */}
      <section className="container-tight grid min-h-[88svh] gap-10 overflow-hidden pb-20 pt-24 lg:grid-cols-12 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="min-w-0 lg:col-span-7"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
            DiagAutoSN · fait à Dakar
          </p>
          <h1 className="mt-5 max-w-full text-balance font-display text-5xl font-semibold leading-[0.94] tracking-[-0.035em] sm:max-w-[14ch] sm:text-6xl md:text-7xl lg:text-8xl">
            Ta voiture{" "}
            <span className="italic text-[var(--color-accent)]">te parle.</span>
            {" "}On t'aide à comprendre.
          </h1>
          <p className="mt-8 max-w-2xl text-pretty text-base leading-7 text-[var(--color-fg-muted)] sm:text-lg sm:leading-8 md:text-xl">
            Un petit boîtier dans ta voiture te dit en direct comment elle se
            porte. Tu vois la panne arriver avant qu'elle te coûte cher. Tu sais
            quand changer l'huile, l'assurance, la visite technique. Plus de
            surprise au garage, plus d'argent perdu.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="#contact"
              className="inline-flex min-h-13 items-center justify-center rounded-full bg-[var(--color-accent)] px-6 text-sm font-semibold text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px"
            >
              Je veux le boîtier
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-13 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-white px-6 text-sm font-semibold text-[var(--color-fg)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] active:translate-y-px"
            >
              Ouvrir mon carnet
            </Link>
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="min-w-0 lg:col-span-5"
        >
          <div className="relative overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-white p-3 shadow-[0_28px_90px_color-mix(in_srgb,var(--color-fg)_12%,transparent)]">
            <div className="relative min-h-[470px] overflow-hidden rounded-[22px] bg-[var(--color-fg)] text-white">
              <img
                src={heroCarImage}
                alt="Véhicule premium suivi par DiagAutoSN"
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.74))]" />

              <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                <span className="rounded-full border border-white/18 bg-white/92 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg)]">
                  Mon carnet · privé
                </span>
                <span className="rounded-full bg-[var(--color-accent)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white shadow-[0_10px_30px_rgba(223,68,56,0.35)]">
                  live
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
                  Ce que voient nos clients équipés
                </p>
                <h2 className="mt-2 max-w-[14ch] font-display text-4xl font-semibold leading-[0.96] tracking-[-0.045em]">
                  Ton garage, dans ta poche.
                </h2>

                <div className="mt-5 grid gap-2">
                  {privateBenefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center justify-between gap-3 rounded-[12px] border border-white/10 bg-black/42 px-3 py-2 backdrop-blur-sm"
                    >
                      <span className="text-sm font-semibold text-white/88">{benefit}</span>
                      <span className="size-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_18px_var(--color-accent)]" />
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    ["personnes sereines", site.proof.clients],
                    ["voitures suivies", site.proof.vehicles],
                    ["boîtiers actifs", site.proof.connectedDevices],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="rounded-[12px] border border-white/10 bg-white/[0.08] p-3">
                      <div className="tabular font-mono text-lg font-black">{value}</div>
                      <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-white/54">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      </section>

      {/* ============== WHY IT CHANGES EVERYTHING ============== */}
      <section id="pourquoi" className="container-tight pb-24">
        <div className="mb-10 max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Pourquoi ça change tout
          </p>
          <h2 className="mt-4 text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-5xl">
            Trois choses qui te simplifient la vie au quotidien.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              accent: "Économise",
              title: "Tu paies moins cher tes réparations.",
              text:
                "Une pièce changée à temps coûte 5 à 10 fois moins cher qu'une panne ignorée. On te prévient avant que ça casse — pas après.",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 1v22M5 6h11a3 3 0 0 1 0 6H8a3 3 0 0 0 0 6h11" />
                </svg>
              ),
            },
            {
              accent: "Gagne du temps",
              title: "Plus besoin d'aller au garage pour savoir.",
              text:
                "Tu ouvres ton téléphone, tu vois ce qui se passe sous le capot. Tu décides : réparer maintenant ou attendre le bon moment.",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              ),
            },
            {
              accent: "Garde le contrôle",
              title: "Tous tes papiers et échéances au même endroit.",
              text:
                "Assurance, visite technique, vidange, factures du garage : un seul écran. Tu n'oublies plus jamais une date.",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ),
            },
          ].map((benefit, i) => (
            <motion.article
              key={benefit.accent}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="panel relative overflow-hidden rounded-[20px] p-6 md:p-7"
            >
              <span className="grid size-11 place-items-center rounded-[12px] border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)] [&_svg]:size-[22px]">
                {benefit.icon}
              </span>
              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
                {benefit.accent}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold leading-tight tracking-[-0.02em] md:text-2xl">
                {benefit.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-fg-muted)]">
                {benefit.text}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ============== WHAT WE DO ============== */}
      <section id="what" className="container-tight pb-24">
        <div className="mb-10 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Tout ce qu'on fait pour toi
            </p>
            <h2 className="mt-4 text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-5xl">
              Une voiture sereine, un mécano de confiance, zéro mauvaise surprise.
            </h2>
          </div>
          <p className="md:col-span-5 text-base leading-7 text-[var(--color-fg-muted)]">
            Que tu sois propriétaire d'une seule voiture ou gestionnaire d'une
            flotte, qu'il s'agisse d'une Toyota Prado ou d'une berline d'occasion :
            on a la solution qui te fait gagner du temps et de l'argent.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar, i) => (
            <motion.article
              key={pillar.badge}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group relative isolate overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-black"
            >
              {/* Photo background */}
              <div className="relative aspect-[4/5] w-full">
                <motion.img
                  src={getWorkshopPhoto(pillar.scene, "card")}
                  alt={pillar.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
                />
                {/* Grading for text readability */}
                <div
                  className="absolute inset-0"
                  aria-hidden
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.12) 32%, rgba(0,0,0,0.75) 88%, rgba(0,0,0,0.92) 100%)",
                  }}
                />

                {/* Badge top-left */}
                <span className="absolute left-4 top-4 grid size-9 place-items-center rounded-[8px] border border-white/30 bg-black/50 font-mono text-[11px] font-semibold tracking-wider text-white backdrop-blur-md">
                  {pillar.badge}
                </span>

                {/* Title + text overlay bottom */}
                <div className="absolute inset-x-4 bottom-4 text-white">
                  <h3 className="font-display text-xl font-semibold leading-tight tracking-[-0.02em] md:text-2xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/85">{pillar.text}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ============== LOCKED PREVIEW ============== */}
      <section id="preview" className="pb-24">
        <LockedPreview />
      </section>

      {/* ============== CONTACT / BECOME A CLIENT ============== */}
      <section id="contact" className="container-tight pb-28">
        <div className="panel relative overflow-hidden rounded-[24px] p-7 md:p-12">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
                On démarre ensemble ?
              </p>
              <h2 className="mt-5 max-w-[16ch] text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-5xl">
                On vient chez toi, on installe, ton carnet s'ouvre.
              </h2>
              <p className="mt-6 max-w-[58ch] text-pretty text-base leading-7 text-[var(--color-fg-muted)]">
                Envoie-nous un message WhatsApp avec ta voiture (marque, modèle,
                année) ou parle-nous de ta flotte. On revient sous 24 heures avec
                un rendez-vous d'installation à Dakar et région.
              </p>
              <ul className="mt-7 grid gap-2 text-sm text-[var(--color-fg-muted)]">
                {[
                  "Installation rapide, sur place ou à l'atelier",
                  "Paiement Wave, Orange Money, espèces ou virement",
                  "Aucun engagement, tu peux résilier quand tu veux",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
              <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                Parle-nous directement
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href="https://wa.me/221"
                  className="inline-flex min-h-12 items-center justify-center rounded-[12px] bg-[var(--color-accent)] px-5 font-semibold text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px"
                >
                  Écris-nous sur WhatsApp
                </a>
                <a
                  href="mailto:contact@diagautosn.com"
                  className="inline-flex min-h-12 items-center justify-center rounded-[12px] border border-[var(--color-border-strong)] bg-white px-5 font-semibold text-[var(--color-fg)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] active:translate-y-px"
                >
                  Envoyer un email
                </a>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[var(--color-border)] pt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
                <span>Dakar & régions</span>
                <span>Réponse sous 24h</span>
                <span>Sans engagement</span>
                <span>Wave · OM accepté</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
