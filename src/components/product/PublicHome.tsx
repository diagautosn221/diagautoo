"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LockedPreview } from "@/components/marketing/LockedPreview";
import { LiveCockpitDemo } from "@/components/marketing/LiveCockpitDemo";
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

const pillars: Array<{
  number: string;
  title: string;
  pull: ReactNode;
  text: string;
  scene: "service" | "training" | "hands" | "install" | "diagnostic" | "bay" | "hero" | "team";
}> = [
  {
    number: "01",
    title: "Anticipe avant que ça casse",
    pull: "Une petite alerte traitée tôt coûte souvent moins cher qu'une grosse panne.",
    text:
      "Le boîtier veille sur ton moteur, ta batterie et ton huile en continu. Quand un signal devient anormal, tu reçois une alerte claire avant de rester bloqué.",
    scene: "hands",
  },
  {
    number: "02",
    title: "Comprends sans être mécano",
    pull: <>« Voyant moteur » au lieu de « code P0420 ». <span className="wolof">Wax mu dëgg.</span></>,
    text:
      "Aucun jargon sur ton téléphone. Juste ce que tu dois faire, et quand. Comme ton oncle mécano à Mermoz — dans ta poche, toujours dispo.",
    scene: "install",
  },
  {
    number: "03",
    title: "Parle direct à ton mécano",
    pull: "Il voit ce que tu vois. L'appel commence déjà avec les bonnes infos.",
    text:
      "Quand tu demandes de l'aide, ton garagiste a déjà le rapport. Pas de blabla, pas de devis gonflé. Téranga, vraie.",
    scene: "training",
  },
  {
    number: "04",
    title: "Garde tes papiers vivants",
    pull: "Assurance, visite technique, vidange : les oublis coûtent cher.",
    text:
      "Assurance, visite technique, vidange : on garde l'œil sur tes échéances et on te rappelle 30 jours avant.",
    scene: "service",
  },
];

const senegalContext = [
  {
    tag: "Climat",
    title: "L'harmattan tue la clim.",
    text:
      "Poussière, chaleur, filtres fatigués : on garde les rappels visibles avant que la clim ne lâche au mauvais moment.",
  },
  {
    tag: "Routes",
    title: "La VDN casse les triangles.",
    text:
      "Nids de poule, dos d'âne, routes chargées : ton carnet t'aide à suivre pneus, freins et suspension sans attendre le bruit inquiétant.",
  },
  {
    tag: "Carburant",
    title: "Le gasoil de coin de rue est inégal.",
    text:
      "Si le moteur change de comportement après un plein, tu as un historique clair à montrer au garage.",
  },
  {
    tag: "Saison",
    title: "Le Magal multiplie les pannes.",
    text:
      "Avant un long trajet Dakar, Touba, Thiès ou Mbour, tu vérifies les points sensibles sans parler mécanique.",
  },
  {
    tag: "Trafic",
    title: "Patte d'Oie use l'embrayage.",
    text:
      "Embouteillages, chaleur, arrêts répétés : les alertes t'aident à prévoir l'entretien au lieu de subir.",
  },
  {
    tag: "Téranga",
    title: "Ton frère prend la voiture ? On suit.",
    text:
      "Si la voiture sert à toute la famille, le compte client garde l'historique, les rappels et les alertes au même endroit.",
  },
];

export function PublicHome({ site }: PublicHomeProps) {
  const homepage = site.pages.find((page) => page.slug === "accueil");

  return (
    <main className="paper-warm min-h-[100dvh] text-[var(--color-fg)]">
      {/* ════════════════════ HERO ════════════════════ */}
      <section className="relative overflow-hidden pt-28 pb-24 md:pt-32 md:pb-28">
        <div
          className="absolute -top-32 right-[-10%] size-[680px] rounded-full pointer-events-none opacity-50"
          aria-hidden
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-brass) 26%, transparent), transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="container-tight relative grid gap-14 lg:grid-cols-12 lg:items-start lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <span className="kicker kicker-accent">
              <span className="size-1.5 rounded-full bg-[var(--color-accent)] live-dot" />
              Dakar · depuis 2018
            </span>

            <h1 className="font-display bleed-display mt-10 text-balance text-[clamp(3.25rem,9.5vw,8.5rem)]">
              Sa oto la{" "}
              <span className="font-display-italic text-[var(--color-accent)]">
                wax.
              </span>
            </h1>
            <p className="font-display mt-3 text-[clamp(1.75rem,4.5vw,3rem)] font-light leading-[1] tracking-[-0.025em] text-[var(--color-fg-muted)]">
              Nun, lañu la <span className="font-display-italic text-[var(--color-fg)]">jangale</span>.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
              ta voiture parle. nous, on traduit.
            </p>

            <p className="mt-12 max-w-[58ch] text-pretty text-lg leading-8 text-[var(--color-fg-muted)] md:text-xl md:leading-9">
              {homepage?.description ?? (
                <>
                  Un boîtier discret branché sous ton volant. Il écoute ton
                  moteur, ta batterie, ton huile, tes pneus — en continu. Sur
                  ton téléphone, tu vois ta voiture vivre. Quand une panne se
                  prépare, tu le sais avant elle.
                </>
              )}
            </p>

            <p className="mt-6 font-display text-2xl font-light italic leading-snug text-[var(--color-fg)] md:text-3xl">
              Avant la panne. Avant la dépense. Avant l'oubli.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-3">
              <Link
                href="#contact"
                className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-8 text-sm font-semibold text-[var(--color-accent-ink)] shadow-soft transition hover:bg-[var(--color-accent-soft)] hover:shadow-lifted active:translate-y-px"
              >
                Je veux le boîtier
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition group-hover:translate-x-1">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-[var(--color-fg)]/30 bg-transparent px-8 text-sm font-semibold text-[var(--color-fg)] transition hover:border-[var(--color-fg)] hover:bg-[var(--color-fg)] hover:text-white active:translate-y-px"
              >
                Ouvrir mon carnet
              </Link>
            </div>

            <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
              <span>Toutes marques</span>
              <span className="size-1 rounded-full bg-[var(--color-fg-subtle)]" />
              <span>Wave · OM · cash</span>
              <span className="size-1 rounded-full bg-[var(--color-fg-subtle)]" />
              <span>On vient à toi</span>
              <span className="size-1 rounded-full bg-[var(--color-fg-subtle)]" />
              <span>Sutura totale</span>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:col-span-5"
          >
            <figure className="grain-overlay grain-soft shadow-cinema relative isolate overflow-hidden rounded-[28px] bg-[var(--color-fg)]">
              <img
                src={getWorkshopPhoto("diagnostic", "hero")}
                alt="Diagnostic automobile avec matériel branché sur une voiture"
                className="aspect-[4/5] w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
              <div className="hero-image-grading" aria-hidden />
              <figcaption className="absolute inset-x-0 bottom-0 z-10 p-6 text-white md:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-brass-soft)]">
                  Kit installé · compte privé · garage prêt
                </p>
                <p className="mt-4 font-display text-2xl font-light italic leading-[1.1] md:text-[1.75rem]">
                  Le visiteur voit l'idée. Le client voit sa vraie voiture.
                </p>
              </figcaption>
            </figure>

            <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-border)] shadow-soft">
              {[
                { label: "public", value: "aucune plaque" },
                { label: "privé", value: "compte client" },
                { label: "garage", value: "rapport utile" },
              ].map((stat) => (
                <div key={stat.label} className="bg-[var(--color-bg-elevated)] p-4 text-center">
                  <div className="font-display text-xl font-light leading-none text-[var(--color-fg)] md:text-2xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      </section>

      {/* ════════════════════ BRANDS MARQUEE ════════════════════ */}
      <BrandsStrip />

      {/* ════════════════════ LIVE PRODUCT DEMO ════════════════════ */}
      <LiveCockpitDemo />

      {/* ════════════════════ PARCOURS CLIENT ════════════════════ */}
      <section id="histoire" className="container-tight py-24 md:py-32">
        <div className="hairline mb-20" />
        <div className="grid gap-12 md:grid-cols-12 md:items-start md:gap-16">
          <div className="md:col-span-5">
            <p className="kicker kicker-accent inline-flex">
              Comment tu deviens client
            </p>
            <h2 className="font-display mt-8 text-balance text-[clamp(2.2rem,5vw,3.8rem)] font-light leading-[1.02] tracking-[-0.03em]">
              Une fois le kit installé, <span className="font-display-italic text-[var(--color-accent)]">tout devient personnel</span>.
            </h2>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <p className="text-lg leading-9 text-[var(--color-fg)]">
              La page publique sert seulement à comprendre ce qu'on fait. Les
              vraies données commencent après l'installation : ton compte, ta
              voiture, ton kilométrage, tes rappels, tes alertes et ton historique
              restent dans ton espace privé.
            </p>
            <p className="mt-7 text-lg leading-9 text-[var(--color-fg-muted)]">
              Le garage voit ce qu'il doit voir pour t'aider : diagnostic,
              priorité, rendez-vous, devis et documents. Un visiteur sans compte
              ne voit rien de confidentiel. Sutura d'abord, technologie après.
            </p>
            <div className="mt-10 border-l-2 border-[var(--color-accent)] pl-6">
              <p className="font-display text-2xl font-light italic leading-[1.25] text-[var(--color-fg)] md:text-3xl">
                « Tu n'as pas besoin d'être mécano. Tu as besoin de savoir quoi faire, au bon moment. »
              </p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                — DiagAutoSN · carnet client
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ POURQUOI — 4 PILLARS ════════════════════ */}
      <section id="pourquoi" className="container-tight py-24 md:py-32">
        <div className="hairline mb-20" />
        <div className="mb-16 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <span className="editorial-num">02</span>
            <p className="mt-6 kicker kicker-accent inline-flex">
              Ci kaw ci kanam · quatre choses qu'on fait mieux
            </p>
            <h2 className="font-display mt-8 max-w-[18ch] text-balance text-[clamp(2.4rem,6vw,4.4rem)] font-light leading-[1.0] tracking-[-0.03em]">
              On ne te <span className="font-display-italic text-[var(--color-accent)]">vend</span> pas un service.{" "}
              On te tient par la main.
            </h2>
          </div>
        </div>

        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          {pillars.map((pillar, i) => (
            <motion.article
              key={pillar.number}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.65, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-start md:gap-7">
                <figure className="grain-overlay grain-soft shadow-soft relative isolate aspect-square w-full overflow-hidden rounded-[20px] md:w-[200px]">
                  <img
                    src={getWorkshopPhoto(pillar.scene, "card")}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    aria-hidden
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.45) 100%)",
                    }}
                  />
                  <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/90">
                    {pillar.number}
                  </span>
                </figure>

                <div className="min-w-0">
                  <h3 className="font-display text-[clamp(1.6rem,3vw,2.1rem)] font-medium leading-tight tracking-[-0.02em]">
                    {pillar.title}
                  </h3>
                  <p className="font-display mt-5 text-lg font-light italic leading-snug text-[var(--color-accent)] md:text-xl">
                    {pillar.pull}
                  </p>
                  <p className="mt-5 text-base leading-7 text-[var(--color-fg-muted)]">
                    {pillar.text}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ════════════════════ SÉNÉGAL CONTEXT ════════════════════ */}
      <section id="senegal" className="container-tight py-24 md:py-32">
        <div className="hairline mb-20" />
        <div className="mb-16 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <span className="editorial-num">03</span>
            <p className="mt-6 kicker kicker-accent inline-flex">
              Pensé pour rouler au Sénégal
            </p>
            <h2 className="font-display mt-8 max-w-[18ch] text-balance text-[clamp(2.2rem,5vw,3.8rem)] font-light leading-[1.02] tracking-[-0.03em]">
              On connaît tes routes.{" "}
              <span className="font-display-italic text-[var(--color-accent)]">
                Et ce qu'elles font à sa oto.
              </span>
            </h2>
          </div>
          <p className="md:col-span-5 text-base leading-8 text-[var(--color-fg-muted)]">
            Les outils diagnostic occidentaux ignorent l'harmattan, la VDN et
            les ralentisseurs sauvages de Yoff. Nous, on est nés ici.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-border)] shadow-soft md:grid-cols-3">
          {senegalContext.map((card, i) => (
            <motion.article
              key={card.tag}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-[var(--color-bg-elevated)] p-8 transition hover:bg-[var(--color-surface)]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
                {card.tag}
              </p>
              <h3 className="font-display mt-6 text-2xl font-medium leading-tight tracking-[-0.018em]">
                {card.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-[var(--color-fg-muted)]">
                {card.text}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ════════════════════ APERÇU CARNET ════════════════════ */}
      <section id="preview" className="py-24 md:py-32">
        <div className="container-tight mb-16">
          <div className="hairline mb-20" />
          <span className="editorial-num">04</span>
          <p className="mt-6 kicker kicker-accent inline-flex">
            Aperçu carnet · loolu lañu ko def
          </p>
        </div>
        <LockedPreview />
      </section>

      {/* ════════════════════ CONTACT ════════════════════ */}
      <section id="contact" className="container-tight py-24 md:py-32">
        <div className="hairline mb-20" />
        <div className="grid gap-12 md:grid-cols-12 md:items-stretch md:gap-16">
          <div className="md:col-span-7">
            <span className="editorial-num">05</span>
            <p className="mt-6 kicker kicker-accent inline-flex">
              On démarre, wala ?
            </p>
            <h2 className="font-display mt-8 max-w-[14ch] text-balance text-[clamp(2.6rem,7vw,5.4rem)] font-light leading-[0.98] tracking-[-0.035em]">
              On vient chez toi.{" "}
              <span className="font-display-italic text-[var(--color-accent)]">
                Ton compte devient ton garage de poche.
              </span>
            </h2>
            <p className="mt-10 max-w-[58ch] text-pretty text-lg leading-8 text-[var(--color-fg-muted)]">
              Écris-nous sur WhatsApp avec ta voiture (marque, modèle, année).
              On revient sous 24 heures avec un créneau d'installation à Dakar
              ou en région. Après pose du kit, on ouvre ton espace privé et on
              vérifie ensemble les premières alertes.
            </p>

            <ul className="mt-12 grid gap-5 text-base text-[var(--color-fg)]">
              {[
                ["01", "On vient à toi, ou tu passes à Mermoz."],
                ["02", "Wave, Orange Money, espèces, virement — tout passe."],
                ["03", "Tu gardes ton compte, ton historique et tes documents."],
                ["04", "Sutura sur tes données : pas de plaque ni de VIN sur la vitrine publique."],
              ].map(([num, text]) => (
                <li key={num} className="flex items-start gap-5">
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-accent)] mt-1.5">
                    {num}
                  </span>
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="md:col-span-5">
            <div className="grain-overlay grain-soft shadow-cinema relative isolate overflow-hidden rounded-[24px] bg-[var(--color-fg)] p-8 text-white md:p-10">
              <div className="flex items-center justify-between">
                <span className="kicker kicker-ink">
                  Bët ci bët
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
                  Dakar
                </span>
              </div>

              <p className="font-display mt-10 text-[1.75rem] font-light italic leading-[1.15] md:text-[2rem]">
                « Wax nu. Ñu def la ñu war. »
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                Parle-nous. On fait ce qu'il faut.
              </p>

              <div className="mt-10 grid gap-3">
                <a
                  href="https://wa.me/221"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[14px] bg-[var(--color-accent)] px-6 text-sm font-semibold text-[var(--color-accent-ink)] shadow-lifted transition hover:bg-[var(--color-accent-soft)] active:translate-y-px"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9s-.5-.1-.7.1-.7.9-.9 1.1-.4.2-.7.1c-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1s0-.4.1-.6.3-.3.4-.5l.3-.4c.1-.1.1-.3 0-.4s-.7-1.6-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4s-.9.9-.9 2.2.9 2.6 1 2.8c.1.2 1.8 2.7 4.3 3.8.6.3 1.1.4 1.4.5.6.2 1.2.2 1.6.1.5-.1 1.7-.7 1.9-1.3s.2-1.2.2-1.3c-.1-.1-.3-.1-.5-.3z" />
                    <path d="M12 2C6.5 2 2 6.5 2 12c0 1.7.5 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
                  </svg>
                  Écrire sur WhatsApp
                </a>
                <a
                  href="mailto:contact@diagautosn.com"
                  className="inline-flex min-h-14 items-center justify-center rounded-[14px] border border-white/15 px-6 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/[0.04] active:translate-y-px"
                >
                  contact@diagautosn.com
                </a>
              </div>

              <div className="mt-10 border-t border-white/12 pt-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
                  Atelier · Mermoz
                </p>
                <p className="mt-3 font-display text-xl font-light leading-snug">
                  Rue de Mermoz, en face du Total
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                  Lundi → Samedi · 08h → 19h · jamm ak jamm
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
