"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { easings } from "@/lib/motion/easings";

const brands = [
  "Launch",
  "Autel",
  "Thinkcar",
  "BMW ENET",
  "Mercedes STAR",
  "Autocom",
  "Delphi",
  "Multidiag",
];

export function Brands() {
  return (
    <section className="relative border-t border-[var(--color-border)] py-20 md:py-24">
      <div className="container-tight">
        <Reveal className="mb-10 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <span className="mb-4 inline-block font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Marques et protocoles
            </span>
            <h2 className="text-balance text-[clamp(1.9rem,4vw,3.1rem)] font-semibold leading-[1] tracking-[-0.04em]">
              Couverture sérieuse, sans promesse floue.
            </h2>
          </div>
          <p className="md:col-span-5 md:col-start-8 text-sm leading-7 text-[var(--color-fg-muted)]">
            Les références sont sélectionnées selon la compatibilité locale, la disponibilité des mises à jour et la qualité du support.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-4">
          {brands.map((brand, index) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: index * 0.03, ease: easings.signature }}
              className="bg-[var(--color-bg-elevated)] px-5 py-7 text-center text-sm font-semibold tracking-[-0.01em] text-[var(--color-fg-muted)] transition duration-300 hover:bg-[var(--color-surface)] hover:text-[var(--color-fg)]"
            >
              {brand}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
