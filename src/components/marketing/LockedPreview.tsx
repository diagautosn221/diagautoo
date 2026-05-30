"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PhotoCockpit, type PhotoCockpitAlert } from "@/components/carnet/PhotoCockpit";

const demoAlerts: PhotoCockpitAlert[] = [
  {
    id: "demo-1",
    label: "Voyant moteur · à montrer à ton mécano cette semaine",
    source: "On lui envoie déjà le rapport",
    severity: "urgent",
  },
  {
    id: "demo-2",
    label: "Batterie un peu faiblarde le matin",
    source: "Garde-la à l'œil avant qu'elle te lâche",
    severity: "watch",
  },
  {
    id: "demo-3",
    label: "Vidange dans 800 km · ndank ndank",
    source: "On te rappellera quand ce sera le moment",
    severity: "watch",
  },
];

export function LockedPreview() {
  return (
    <section className="relative">
      <div className="container-tight">
        <header className="mb-10 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Sa oto, dans ta poche · voici à quoi ça ressemble
            </p>
            <h2 className="mt-4 text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-5xl">
              Ta voiture, en direct, comme un appel WhatsApp.
            </h2>
          </div>
          <p className="md:col-span-5 text-base leading-7 text-[var(--color-fg-muted)]">
            On a fait simple : ta voiture est là, son état est clair, et quand
            quelque chose ne va pas, on te le dit dans une phrase que tu
            comprends, avec la prochaine action à faire. Aucune plaque réelle,
            aucun VIN réel et aucun kilométrage client ne sont affichés ici.
          </p>
        </header>

        <div className="relative">
          {/* Underlying preview — real PhotoCockpit, sample data only. */}
          <div className="pointer-events-none select-none">
            <PhotoCockpit
              brand="Toyota"
              model="SUV"
              vehicleLabel="Voiture équipée"
              mileage={0}
              healthScore={82}
              alerts={demoAlerts}
              lastSeenAt={new Date(Date.now() - 90_000).toISOString()}
              privacyMode
            />
          </div>

          {/* Bottom fade so the lock CTA sits cleanly above the photo. */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] rounded-b-[28px]"
            aria-hidden
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-bg) 60%, transparent) 55%, var(--color-bg) 92%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-5 px-6 pb-10 text-center md:pb-14"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/92 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-muted)] backdrop-blur-md">
              <LockGlyph />
              Aperçu anonymisé · accès complet après installation
            </span>

            <h3 className="max-w-[30ch] text-balance font-display text-2xl font-semibold leading-tight tracking-[-0.025em] text-[var(--color-fg)] md:text-3xl">
              Tu veux voir sa oto comme ça ? Dafa neex, na nu démarre.
            </h3>

            <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3">
              <Link
                href="#contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-accent)] px-6 text-sm font-semibold text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px"
              >
                Demander l'installation
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-white px-6 text-sm font-semibold text-[var(--color-fg)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] active:translate-y-px"
              >
                Ouvrir mon carnet
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function LockGlyph() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
