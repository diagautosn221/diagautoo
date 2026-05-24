"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

const packs = [
  {
    name: "Essentiel mobile",
    target: "Conducteur, achat occasion, petit garage",
    price: "13 900 F CFA",
    description: "Lecture moteur, contrôle rapide, première prise en main du diagnostic.",
    features: ["Dongle OBD-II", "Application mobile", "Session de démarrage", "Support WhatsApp"],
  },
  {
    name: "Atelier multimarques",
    target: "Garage généraliste",
    price: "120 000 F CFA",
    description: "Le socle propre pour traiter la majorité des véhicules clients au quotidien.",
    features: ["Valise multimarques", "Câbles utiles", "Formation 4 heures", "Mises à jour 12 mois"],
    recommended: true,
  },
  {
    name: "Constructeur & flotte",
    target: "Spécialiste marque, responsable parc",
    price: "Sur devis",
    description: "Configuration avancée avec procédures, maintenance et accompagnement dédié.",
    features: ["Outil constructeur", "Paramétrage sur site", "Carnet véhicule", "Compte technique dédié"],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative border-t border-[var(--color-border)] py-24 md:py-32">
      <div className="container-tight">
        <Reveal className="mb-14 max-w-3xl">
          <span className="mb-4 inline-block font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Offres
          </span>
          <h2 className="text-balance text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
            Trois niveaux, aucune formule gadget.
          </h2>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.2fr_0.9fr] lg:items-stretch">
          {packs.map((plan, index) => (
            <Reveal
              key={plan.name}
              delay={index * 0.07}
              className={`panel relative flex flex-col rounded-[20px] p-7 ${
                plan.recommended ? "border-[var(--color-accent)]/55 bg-[var(--color-surface)]" : ""
              }`}
            >
              {plan.recommended && (
                <span className="mb-5 w-fit rounded-[8px] bg-[var(--color-accent)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent-ink)]">
                  recommandé atelier
                </span>
              )}
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.025em]">{plan.name}</h3>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.13em] text-[var(--color-fg-subtle)]">
                  {plan.target}
                </p>
              </div>
              <p className="mt-7 min-h-[5rem] text-sm leading-7 text-[var(--color-fg-muted)]">
                {plan.description}
              </p>
              <div className="tabular mt-3 font-mono text-2xl font-semibold text-[var(--color-fg)]">
                {plan.price}
              </div>
              <ul className="mt-8 flex flex-1 flex-col gap-3 border-t border-[var(--color-border)] pt-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-[var(--color-fg-muted)]">
                    <span className="mt-2 size-1.5 rounded-full bg-[var(--color-accent)]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="#contact"
                className={`mt-8 inline-flex min-h-11 items-center justify-center rounded-[10px] px-5 text-sm font-semibold transition duration-200 active:translate-y-px ${
                  plan.recommended
                    ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] hover:bg-[var(--color-accent-soft)]"
                    : "border border-[var(--color-border-strong)] text-[var(--color-fg)] hover:border-[var(--color-accent)] hover:bg-white/[0.03]"
                }`}
              >
                {plan.price === "Sur devis" ? "Préparer un devis" : "Choisir cette offre"}
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.22} className="mt-8 text-sm text-[var(--color-fg-subtle)]">
          Paiements acceptés: Wave, Orange Money, virement bancaire et règlement à la livraison sur Dakar.
        </Reveal>
      </div>
    </section>
  );
}
