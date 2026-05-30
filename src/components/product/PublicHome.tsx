"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LockedPreview } from "@/components/marketing/LockedPreview";
import { getWorkshopPhoto, PEXELS } from "@/lib/photos";

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
  pull: string;
  text: string;
  scene: "service" | "training" | "hands" | "install" | "diagnostic" | "bay" | "hero" | "team";
}> = [
  {
    number: "I",
    title: "Anticipe avant que ça casse",
    pull: "Une fuite d'huile : 8 000 F. Un moteur fondu : 480 000 F. À toi de voir.",
    text:
      "Notre boîtier veille sur ton moteur, ta batterie et ton huile en continu. Tu reçois l'alerte deux semaines avant le drame, ndank ndank, le temps de t'organiser.",
    scene: "hands",
  },
  {
    number: "II",
    title: "Comprends sans être mécano",
    pull: "« Voyant moteur » au lieu de « code P0420 ». Wax mu dëgg.",
    text:
      "Aucun jargon sur ton téléphone. Juste ce que tu dois faire, et quand. Comme ton oncle mécano à Mermoz — mais dans ta poche, et toujours dispo.",
    scene: "install",
  },
  {
    number: "III",
    title: "Parle direct à ton mécano",
    pull: "Il voit ce que tu vois. Vous gagnez 30 minutes à chaque appel.",
    text:
      "Quand tu lui demandes de l'aide, ton garagiste a déjà le rapport. Pas de blabla, pas de devis gonflé, pas de pièges. Téranga atelier, vraie.",
    scene: "training",
  },
  {
    number: "IV",
    title: "Garde tes papiers vivants",
    pull: "Plus jamais un PV sur la Corniche pour visite expirée.",
    text:
      "Assurance, visite technique, vidange : on garde l'œil sur tes échéances et on te rappelle 30 jours avant. Sutura sur tes papiers, jamm dans ton portefeuille.",
    scene: "service",
  },
];

export function PublicHome({ site }: PublicHomeProps) {
  const homepage = site.pages.find((page) => page.slug === "accueil");

  return (
    <main className="paper-warm min-h-[100dvh] text-[var(--color-fg)]">
      {/* ════════════════════ HERO — EDITORIAL FULL-BLEED ════════════════════ */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-28 md:pb-28">
        <div
          className="absolute -top-32 right-0 size-[640px] rounded-full pointer-events-none opacity-50"
          aria-hidden
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-brass) 30%, transparent), transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="container-tight relative grid gap-10 lg:grid-cols-12 lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="editorial-stamp">
                <span className="size-1.5 rounded-full bg-[var(--color-accent)] live-dot" />
                Dakar · Mermoz · depuis 2018
              </span>
              <span className="tape font-mono text-[var(--color-fg)]">
                №42 · sa oto, sa carnet
              </span>
            </div>

            <h1 className="font-display bleed-display mt-8 max-w-full text-balance text-[clamp(3rem,9vw,8rem)]">
              Sa oto la{" "}
              <span className="font-display-italic text-[var(--color-accent)]">
                wax.
              </span>
            </h1>
            <p className="font-display mt-4 max-w-[20ch] text-[clamp(2rem,5vw,3.6rem)] font-light leading-[0.96] tracking-[-0.025em] text-[var(--color-fg-muted)]">
              Nun, lañu la <span className="hand-circle">jangale</span>.
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
              ta voiture parle — nous, on traduit
            </p>

            <p className="mt-10 max-w-2xl text-pretty text-lg leading-8 text-[var(--color-fg-muted)] md:text-xl">
              {homepage?.description ?? (
                <>
                  Un boîtier gros comme une boîte d'allumettes branché sous ton volant.
                  Il écoute ton moteur, ta batterie, ton huile, tes pneus —{" "}
                  <span className="hand-underline">en continu</span>. Sur ton téléphone, tu
                  vois ta voiture vivre. Quand une panne se prépare, tu le sais
                  avant elle. <strong className="text-[var(--color-fg)]">Avant la panne. Avant la dépense. Avant l'oubli.</strong>
                </>
              )}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="#contact"
                className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-7 text-sm font-semibold text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px"
              >
                Dafa neex · je veux le boîtier
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition group-hover:translate-x-1">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-13 items-center justify-center rounded-full border-2 border-[var(--color-fg)] bg-transparent px-7 text-sm font-semibold text-[var(--color-fg)] transition hover:bg-[var(--color-fg)] hover:text-white active:translate-y-px"
              >
                Ouvrir mon carnet
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[var(--color-border)] pt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
              <span>Toutes marques · même les vieilles</span>
              <span className="size-1 rounded-full bg-[var(--color-fg-subtle)]" />
              <span>Wave · Orange Money · cash</span>
              <span className="size-1 rounded-full bg-[var(--color-fg-subtle)]" />
              <span>On vient chez toi</span>
              <span className="size-1 rounded-full bg-[var(--color-fg-subtle)]" />
              <span>Sutura totale sur tes données</span>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 20, rotate: 1 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <figure className="grain-overlay grain-soft relative isolate overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-fg)] shadow-[0_40px_120px_color-mix(in_srgb,var(--color-fg)_22%,transparent)]">
              <img
                src={PEXELS.garageHero}
                alt="Atelier DiagAutoSN à Dakar"
                className="aspect-[4/5] w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
              <div
                className="absolute inset-0 z-0"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.10) 30%, rgba(0,0,0,0.78) 100%)",
                }}
              />

              <div className="absolute right-4 top-4 z-10 flex flex-col items-end gap-2">
                <span
                  className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  ATELIER 01 · MERMOZ
                </span>
              </div>

              <figcaption className="absolute inset-x-0 bottom-0 z-10 p-5 text-white md:p-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-brass-soft)]">
                  Ce matin, à l'atelier
                </p>
                <p className="font-display mt-3 text-balance text-2xl font-light italic leading-[1.05] md:text-3xl">
                  « Un propriétaire sur deux ignore qu'une vidange en retard
                  multiplie par trois le prix d'une réparation moteur. »
                </p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/65">
                  — Cheikh, chef d'atelier · n°47
                </p>
              </figcaption>

              <div className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rotate-[-4deg] rounded-[10px] bg-[var(--color-brass)] px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
                <div className="font-display tabular text-3xl font-medium leading-none text-[var(--color-fg)]">
                  {site.proof.connectedDevices}+
                </div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-fg)]">
                  voitures sous notre œil
                </div>
              </div>
            </figure>

            <p className="mt-4 max-w-xs font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
              Photo · atelier DiagAutoSN, Mermoz · prise ce matin
            </p>
          </motion.aside>
        </div>
      </section>

      <div className="container-tight">
        <div className="brush-divider" />
      </div>

      {/* ════════════════════ PROMESSE DE MARQUE — À LA SONATEL ════════════════════ */}
      <section className="container-tight py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-12 md:items-center">
          <div className="md:col-span-2">
            <span className="editorial-num">★</span>
          </div>
          <div className="md:col-span-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Notre promesse
            </p>
            <h2 className="font-display mt-3 text-balance text-[clamp(2rem,5.5vw,4rem)] font-light leading-[1.0] tracking-[-0.025em]">
              Donner à chaque voiture du Sénégal{" "}
              <span className="font-display-italic text-[var(--color-accent)]">
                l'occasion de durer.
              </span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-fg-muted)]">
              Pas de produit miracle. Pas de promesse en l'air. Juste un boîtier
              fiable, un carnet clair et une équipe joignable du matin au soir —
              comme à l'ancienne, mais sur ton téléphone.
            </p>
          </div>
        </div>
      </section>

      <div className="container-tight">
        <div className="brush-divider" />
      </div>

      {/* ════════════════════ HISTOIRE ════════════════════ */}
      <section id="histoire" className="container-tight py-24 md:py-32">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-4">
            <span className="editorial-num">01.</span>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Notre histoire
            </p>
            <h2 className="font-display mt-4 text-balance text-[clamp(2.2rem,5vw,3.6rem)] font-light leading-[1.02] tracking-[-0.025em]">
              On a commencé par <span className="font-display-italic text-[var(--color-accent)]">en avoir marre</span>.
            </h2>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <p className="text-lg leading-9 text-[var(--color-fg)]">
              Trop de propriétaires nous arrivaient avec une voiture déjà fichue.
              Pas par négligence — par <strong className="text-[var(--color-accent)]">manque d'info</strong>.
              Personne ne leur avait dit que ce petit bruit, c'était la pompe à
              eau. Personne ne leur avait expliqué pourquoi cette vidange ne
              pouvait plus attendre.
            </p>
            <p className="mt-6 text-lg leading-9 text-[var(--color-fg-muted)]">
              En 2018, à Mermoz, on a branché notre premier boîtier sur une
              Toyota Prado. L'idée tenait en une phrase : <em>que le propriétaire sache ce
              que le moteur sait</em>. Six ans plus tard, on équipe les voitures du
              Sénégal — Dakar, Thiès, Saint-Louis, Mbour — et on forme les
              ateliers qui les accompagnent.
            </p>
            <p className="mt-6 font-display text-2xl font-light italic leading-[1.25] text-[var(--color-fg)]">
              « Sa oto mérite mieux qu'un coup de hasard. Et toi aussi. »
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
              — L'équipe DiagAutoSN · 6 mécanos, 2 développeurs, 1 atelier
            </p>
          </div>
        </div>
      </section>

      <div className="container-tight">
        <div className="brush-divider" />
      </div>

      {/* ════════════════════ POURQUOI — 4 EDITORIAL PILLARS ════════════════════ */}
      <section id="pourquoi" className="container-tight py-24 md:py-32">
        <div className="mb-14 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <span className="editorial-num">02.</span>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Ci kaw ci kanam · quatre choses qu'on fait mieux que personne
            </p>
            <h2 className="font-display mt-4 max-w-[16ch] text-balance text-[clamp(2.4rem,6vw,4.4rem)] font-light leading-[1.0] tracking-[-0.03em]">
              On ne te <span className="font-display-italic text-[var(--color-accent)]">vend pas</span> un service.{" "}
              <br className="hidden md:inline" />
              On te <span className="hand-underline">tient</span> par la main.
            </h2>
          </div>
        </div>

        <div className="grid gap-y-16 md:grid-cols-12 md:gap-x-8">
          {pillars.map((pillar, i) => (
            <motion.article
              key={pillar.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`md:col-span-6 ${i % 2 === 1 ? "md:translate-y-12" : ""}`}
            >
              <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-start">
                <figure className="grain-overlay grain-soft relative isolate aspect-square w-full overflow-hidden rounded-[18px] md:w-[180px]">
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
                        "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.55) 100%)",
                    }}
                  />
                  <span className="absolute left-3 top-3 font-display italic text-3xl font-light text-white/90">
                    {pillar.number}
                  </span>
                </figure>

                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-medium leading-tight tracking-[-0.015em] md:text-3xl">
                    {pillar.title}
                  </h3>
                  <p className="font-display mt-4 text-lg font-light italic leading-snug text-[var(--color-accent)] md:text-xl">
                    {pillar.pull}
                  </p>
                  <p className="mt-4 text-base leading-7 text-[var(--color-fg-muted)]">
                    {pillar.text}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <div className="container-tight">
        <div className="brush-divider" />
      </div>

      {/* ════════════════════ CAS RÉEL DAKAR ════════════════════ */}
      <section id="cas-reel" className="relative overflow-hidden bg-[var(--color-fg)] py-24 text-white md:py-32">
        <div className="container-tight">
          <div className="mb-12 grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <span className="editorial-num text-white/40">03.</span>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-brass-soft)]">
                Cas réel · Mamadou, Mermoz · mars 2026
              </p>
              <h2 className="font-display mt-4 text-balance text-[clamp(2.4rem,6vw,4.4rem)] font-light leading-[1.0] tracking-[-0.03em]">
                Sa Prado lui parlait depuis lundi.{" "}
                <span className="font-display-italic text-[var(--color-brass-soft)]">
                  Il a économisé 240 000 F.
                </span>
              </h2>
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-12 md:items-stretch">
            <figure className="grain-overlay grain-strong relative isolate aspect-[4/5] overflow-hidden rounded-[20px] md:col-span-5">
              <img
                src={PEXELS.toolboard}
                alt="Intervention atelier DiagAutoSN"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.65) 100%)",
                }}
              />
              <figcaption className="absolute inset-x-5 bottom-5 z-10">
                <span className="tape font-mono text-[10px]">14h32 · 3 mars 2026 · Mermoz</span>
              </figcaption>
            </figure>

            <div className="md:col-span-7 md:pl-6">
              <ol className="space-y-7 border-l-2 border-[var(--color-brass)]/40 pl-6">
                <li>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-brass-soft)]">
                    Lundi 2 mars · 09h17 · sur la VDN
                  </p>
                  <p className="mt-2 font-display text-xl font-light leading-snug text-white">
                    Le boîtier capte une légère baisse de pression d'huile.
                    Notif sur le téléphone de Mamadou : <em>« À vérifier cette
                    semaine. Pas urgent, mais ne traîne pas. »</em>
                  </p>
                </li>
                <li>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-brass-soft)]">
                    Mardi 3 mars · 14h32 · atelier Mermoz
                  </p>
                  <p className="mt-2 font-display text-xl font-light leading-snug text-white">
                    Diagnostic : joint spi avant qui suinte. Notre mécano a
                    déjà vu le rapport. Réparation en 90 min.{" "}
                    <strong>32 000 F. Vidange comprise.</strong>
                  </p>
                </li>
                <li>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-brass-soft)]">
                    Sans le boîtier · scénario probable
                  </p>
                  <p className="mt-2 font-display text-xl font-light leading-snug text-white">
                    Le moteur aurait tourné à sec en allant à Saly pour la
                    Korité. Démontage complet, segments, coussinets. <strong className="text-[var(--color-accent)]">272 000 F</strong> + 5 jours d'immobilisation. Famille bloquée sans voiture.
                  </p>
                </li>
              </ol>

              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/15 pt-8">
                <div>
                  <div className="font-display tabular text-4xl font-light text-[var(--color-brass-soft)] md:text-5xl">
                    240k
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
                    F CFA économisés
                  </div>
                </div>
                <div>
                  <div className="font-display tabular text-4xl font-light text-[var(--color-brass-soft)] md:text-5xl">
                    5 j
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
                    Famille mobile
                  </div>
                </div>
                <div>
                  <div className="font-display tabular text-4xl font-light text-[var(--color-brass-soft)] md:text-5xl">
                    8×
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
                    Moins cher
                  </div>
                </div>
              </div>

              <blockquote className="mt-10 border-l-4 border-[var(--color-accent)] pl-5">
                <p className="font-display text-2xl font-light italic leading-snug text-white md:text-3xl">
                  « Sans l'alerte, j'aurais roulé jusqu'à Saly avec la famille.
                  Je dois ma boîte de vitesse — et ma Korité — à DiagAutoSN. »
                </p>
                <footer className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                  — Mamadou D., Toyota Prado 2019, Mermoz · client depuis 2022
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ SÉNÉGAL — LOCAL CONTEXT ════════════════════ */}
      <section id="senegal" className="container-tight py-24 md:py-32">
        <div className="mb-12 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <span className="editorial-num">04.</span>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Fait pour rouler au Sénégal
            </p>
            <h2 className="font-display mt-4 max-w-[18ch] text-balance text-[clamp(2.2rem,5vw,3.6rem)] font-light leading-[1.02] tracking-[-0.025em]">
              On connaît tes routes.{" "}
              <span className="font-display-italic text-[var(--color-accent)]">
                Et ce qu'elles font à sa oto.
              </span>
            </h2>
          </div>
          <p className="md:col-span-5 text-base leading-7 text-[var(--color-fg-muted)]">
            Les outils diagnostic occidentaux ignorent l'harmattan, la VDN et les
            ralentisseurs sauvages de Yoff. Nous, on est nés ici. On comprend.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[20px] border border-[var(--color-border-strong)] bg-[var(--color-border-strong)] md:grid-cols-3">
          {[
            {
              tag: "Climat",
              title: "L'harmattan tue la clim.",
              text:
                "La poussière du désert sature tes filtres en trois mois. On surveille ta pression de clim et on te dit quand elle peine, avant qu'elle lâche en pleine chaleur de Tabaski.",
            },
            {
              tag: "Routes",
              title: "La VDN casse les triangles.",
              text:
                "Nids de poule, dos d'âne sauvages, ralentisseurs non signalés à Yoff : on suit la fatigue de ta suspension et on t'alerte avant que la rotule rende l'âme.",
            },
            {
              tag: "Carburant",
              title: "Le gasoil de coin de rue est inégal.",
              text:
                "Si ton moteur racle après un plein douteux, on le voit dans les données. On t'oriente vers les bonnes stations — Total Mermoz, Elton VDN, Ola Liberté 6.",
            },
            {
              tag: "Saison",
              title: "Le Magal multiplie les pannes.",
              text:
                "300 km Dakar-Touba dans la même journée, chargé : c'est dur. On prépare ta voiture deux semaines avant et on l'inspecte après le retour.",
            },
            {
              tag: "Trafic",
              title: "Le bouchon de Patte d'Oie use l'embrayage.",
              text:
                "Stop-and-go à la sortie de la VDN : on compte tes engagements d'embrayage et on prévient quand le disque arrive en bout de course.",
            },
            {
              tag: "Téranga",
              title: "Tu prêtes ta voiture ? On suit.",
              text:
                "Ton frère prend la voiture pour Mbour le week-end ? Tu vois où elle est, comment elle roule, et si l'alerte tombe. Famille tranquille, voiture tranquille.",
            },
          ].map((card, i) => (
            <motion.article
              key={card.tag}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              className="bg-[var(--color-bg-elevated)] p-7 transition hover:bg-[var(--color-surface)]"
            >
              <span className="tape inline-block">{card.tag}</span>
              <h3 className="font-display mt-6 text-2xl font-medium leading-tight tracking-[-0.015em]">
                {card.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-[var(--color-fg-muted)]">
                {card.text}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      <div className="container-tight">
        <div className="brush-divider" />
      </div>

      {/* ════════════════════ TÉRANGA — SERVICE PROMISE ════════════════════ */}
      <section id="teranga" className="container-tight py-24 md:py-32">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="editorial-num">05.</span>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Téranga DiagAutoSN
            </p>
            <h2 className="font-display mt-4 text-balance text-[clamp(2.2rem,5vw,3.6rem)] font-light leading-[1.02] tracking-[-0.025em]">
              Du matin au soir,{" "}
              <span className="font-display-italic text-[var(--color-accent)]">
                on roule avec toi.
              </span>
            </h2>
            <p className="mt-6 text-base leading-7 text-[var(--color-fg-muted)]">
              Pas une hotline qui te raccroche au nez. Pas un bot qui te dit
              « consultez la FAQ ». Une vraie équipe à Mermoz, joignable en
              wolof ou en français, qui connaît sa oto.
            </p>
          </div>

          <div className="md:col-span-7">
            <div className="grid gap-3">
              {[
                {
                  hour: "08h00 → 19h00",
                  label: "Atelier ouvert",
                  text: "On t'accueille à Mermoz, en face du Total. Sans rendez-vous pour les urgences.",
                },
                {
                  hour: "24h / 24",
                  label: "WhatsApp d'astreinte",
                  text: "Une question urgente la nuit ? On répond en moins de 30 minutes — vraiment.",
                },
                {
                  hour: "Wave · OM · cash",
                  label: "Paiement comme tu veux",
                  text: "Tu paies au moment qui t'arrange. On accepte tout, sans frais cachés.",
                },
                {
                  hour: "0 F",
                  label: "Sans engagement",
                  text: "Tu arrêtes quand tu veux. Pas de contrat de 24 mois, pas de petites lignes.",
                },
              ].map((row, i) => (
                <motion.article
                  key={row.label}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="grid grid-cols-[auto_1fr] items-start gap-5 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5"
                >
                  <div className="text-right">
                    <p className="font-display tabular text-2xl font-light leading-none text-[var(--color-accent)]">
                      {row.hour}
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                      {row.label}
                    </p>
                  </div>
                  <p className="text-base leading-7 text-[var(--color-fg-muted)]">{row.text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container-tight">
        <div className="brush-divider" />
      </div>

      {/* ════════════════════ APERÇU CARNET ════════════════════ */}
      <section id="preview" className="py-24 md:py-32">
        <div className="container-tight mb-10">
          <span className="editorial-num">06.</span>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Aperçu carnet · loolu lañu ko def
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
            voici ce qu'on a fait
          </p>
        </div>
        <LockedPreview />
      </section>

      <div className="container-tight">
        <div className="brush-divider" />
      </div>

      {/* ════════════════════ CONTACT — EDITORIAL POSTCARD ════════════════════ */}
      <section id="contact" className="container-tight py-24 md:py-32">
        <div className="grid gap-10 md:grid-cols-12 md:items-stretch">
          <div className="md:col-span-7">
            <span className="editorial-num">07.</span>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
              On démarre, wala ?
            </p>
            <h2 className="font-display mt-4 max-w-[14ch] text-balance text-[clamp(2.6rem,7vw,5.2rem)] font-light leading-[0.98] tracking-[-0.03em]">
              On vient chez toi.{" "}
              <span className="font-display-italic text-[var(--color-accent)]">
                Ton carnet s'ouvre dans l'heure.
              </span>
            </h2>
            <p className="mt-8 max-w-[58ch] text-pretty text-lg leading-8 text-[var(--color-fg-muted)]">
              Écris-nous sur WhatsApp avec ta voiture (marque, modèle, année).
              On revient sous 24 heures avec un créneau d'installation à Dakar
              ou en région. Boîtier branché en 8 minutes, carnet ouvert dans la
              foulée. Pas de paperasse, pas d'attente.
            </p>

            <ul className="mt-10 grid gap-3 text-base text-[var(--color-fg)]">
              {[
                ["I", "On vient à toi, ou tu passes à Mermoz."],
                ["II", "Wave, Orange Money, espèces, virement — tout passe."],
                ["III", "Sans engagement. Tu arrêtes quand tu veux."],
                ["IV", "Sutura sur tes données. Elles ne sortent pas du Sénégal."],
              ].map(([num, text]) => (
                <li key={num} className="flex items-start gap-4">
                  <span className="font-display italic text-2xl font-light text-[var(--color-accent)] leading-none">
                    {num}
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="md:col-span-5">
            <div className="grain-overlay grain-soft relative isolate overflow-hidden rounded-[22px] border border-[var(--color-border-strong)] bg-[var(--color-fg)] p-7 text-white shadow-[0_30px_80px_color-mix(in_srgb,var(--color-fg)_24%,transparent)]">
              <div className="flex items-center justify-between">
                <span className="editorial-stamp" style={{ color: "var(--color-brass-soft)" }}>
                  bët ci bët
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                  Dakar · Sénégal
                </span>
              </div>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">
                « œil dans l'œil » — on se parle direct
              </p>

              <p className="font-display mt-7 text-2xl font-light italic leading-snug">
                « Wax nu. Ñu def la ñu war. »
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
                Parle-nous. On fait ce qu'il faut.
              </p>

              <div className="mt-8 grid gap-3">
                <a
                  href="https://wa.me/221"
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-[12px] bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9s-.5-.1-.7.1-.7.9-.9 1.1-.4.2-.7.1c-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1s0-.4.1-.6.3-.3.4-.5l.3-.4c.1-.1.1-.3 0-.4s-.7-1.6-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4s-.9.9-.9 2.2.9 2.6 1 2.8c.1.2 1.8 2.7 4.3 3.8.6.3 1.1.4 1.4.5.6.2 1.2.2 1.6.1.5-.1 1.7-.7 1.9-1.3s.2-1.2.2-1.3c-.1-.1-.3-.1-.5-.3z" />
                    <path d="M12 2C6.5 2 2 6.5 2 12c0 1.7.5 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
                  </svg>
                  Écris-nous sur WhatsApp
                </a>
                <a
                  href="mailto:contact@diagautosn.com"
                  className="inline-flex min-h-13 items-center justify-center rounded-[12px] border-2 border-white/20 px-5 text-sm font-semibold text-white transition hover:border-white/60 active:translate-y-px"
                >
                  contact@diagautosn.com
                </a>
              </div>

              <div className="mt-8 border-t border-white/15 pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                  Atelier
                </p>
                <p className="mt-2 font-display text-lg font-light leading-tight text-white">
                  Rue de Mermoz, en face du Total
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
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
