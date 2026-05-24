"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

export function CTA() {
  return (
    <section id="contact" className="relative border-t border-[var(--color-border)] py-24 md:py-32">
      <div className="container-tight">
        <div className="panel relative overflow-hidden rounded-[24px] p-7 md:p-12">
          <div className="grid gap-10 md:grid-cols-[1fr_0.8fr] md:items-end">
            <div>
              <Reveal>
                <span className="mb-6 inline-flex rounded-[8px] border border-[var(--color-accent)]/35 bg-[var(--color-accent)]/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
                  réponse sous 24 heures
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="max-w-[13ch] text-balance text-[clamp(2.3rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.055em]">
                  Votre atelier mérite un diagnostic net.
                </h2>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-7 max-w-[58ch] text-pretty text-base leading-8 text-[var(--color-fg-muted)]">
                  Envoyez le type de véhicules, les pannes fréquentes et votre budget.
                  Nous revenons avec une configuration adaptée, pas une liste de produits au hasard.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.22} className="rounded-[18px] border border-[var(--color-border)] bg-[#0f100d] p-5">
              <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                contact direct
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="https://wa.me/221"
                  className="inline-flex min-h-12 items-center justify-center rounded-[12px] bg-[var(--color-accent)] px-5 font-semibold text-[var(--color-accent-ink)] transition duration-200 hover:bg-[var(--color-accent-soft)] active:translate-y-px"
                >
                  Ouvrir WhatsApp
                </Link>
                <Link
                  href="mailto:contact@diagautosn.com"
                  className="inline-flex min-h-12 items-center justify-center rounded-[12px] border border-[var(--color-border-strong)] px-5 font-semibold text-[var(--color-fg)] transition duration-200 hover:border-[var(--color-accent)] hover:bg-white/[0.03]"
                >
                  contact@diagautosn.com
                </Link>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[var(--color-border)] pt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
                <span>Dakar</span>
                <span>Sénégal</span>
                <span>Atelier</span>
                <span>Flotte</span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
