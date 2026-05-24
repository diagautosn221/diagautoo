"use client";

import { Reveal } from "@/components/motion/Reveal";

const steps = [
  {
    number: "01",
    title: "Audit du besoin",
    description:
      "Véhicules traités, niveau technique de l'équipe, types de pannes fréquentes, budget et contraintes de livraison.",
  },
  {
    number: "02",
    title: "Configuration utile",
    description:
      "Choix du matériel, accessoires, licences, ordinateur ou tablette, procédure de mise à jour et niveau de support.",
  },
  {
    number: "03",
    title: "Mise en service",
    description:
      "Activation, test sur véhicule réel, création du premier diagnostic et formation rapide sur les gestes à éviter.",
  },
  {
    number: "04",
    title: "Suivi après livraison",
    description:
      "Assistance WhatsApp, mises à jour, réparation des appareils et ajustement du parc selon les retours terrain.",
  },
];

export function HowItWorks() {
  return (
    <section id="process" className="relative border-t border-[var(--color-border)] py-24 md:py-32">
      <div className="container-tight">
        <Reveal className="mb-16 max-w-3xl">
          <span className="mb-4 inline-block font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Méthode
          </span>
          <h2 className="text-balance text-[clamp(2.2rem,5vw,4.1rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
            Une mise en route qui évite les achats inutiles.
          </h2>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.07} className="panel rounded-[18px] p-6">
              <div className="mb-10 flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--color-accent)]">{step.number}</span>
                <span className="h-px w-12 bg-[var(--color-border-strong)]" />
              </div>
              <h3 className="text-xl font-semibold tracking-[-0.02em]">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--color-fg-muted)]">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
