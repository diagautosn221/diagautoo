"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { easings } from "@/lib/motion/easings";

type Product = {
  ref: string;
  name: string;
  coverage: string;
  useCase: string;
  price: string;
  level: "Essentiel" | "Atelier" | "Constructeur";
};

const products: Product[] = [
  {
    ref: "DA-014",
    name: "ELM 327 Bluetooth",
    coverage: "OBD-II basique",
    useCase: "Lecture moteur, effacement simple, contrôle avant achat",
    price: "3 900 F CFA",
    level: "Essentiel",
  },
  {
    ref: "DA-021",
    name: "BMW ENET",
    coverage: "BMW E / F / G",
    useCase: "Codage, diagnostic avancé, programmation légère",
    price: "30 000 F CFA",
    level: "Atelier",
  },
  {
    ref: "DA-038",
    name: "Autocom CDP+ / Delphi DS150e",
    coverage: "VL, utilitaires, poids lourds",
    useCase: "Garage multimarques, lecture complète et tests actionneurs",
    price: "90 000 F CFA",
    level: "Atelier",
  },
  {
    ref: "DA-052",
    name: "MB STAR C6",
    coverage: "Mercedes-Benz",
    useCase: "Diagnostic constructeur, codage, SCN selon configuration",
    price: "150 000 F CFA",
    level: "Constructeur",
  },
  {
    ref: "DA-067",
    name: "Launch X431 SmartLink",
    coverage: "Multimarques premium",
    useCase: "ADAS, diagnostic à distance, programmation, atelier exigeant",
    price: "Sur devis",
    level: "Constructeur",
  },
];

const levelStyle: Record<Product["level"], string> = {
  Essentiel: "text-[var(--color-success)]",
  Atelier: "text-[var(--color-accent)]",
  Constructeur: "text-[var(--color-warn)]",
};

export function Diagnostic() {
  return (
    <section
      id="catalogue"
      className="relative border-t border-[var(--color-border)] py-24 md:py-32"
    >
      <div className="container-tight">
        <Reveal className="mb-12 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <span className="mb-4 inline-block font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Catalogue terrain
            </span>
            <h2 className="max-w-4xl text-balance text-[clamp(2.2rem,5vw,4.2rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
              Des outils choisis pour des interventions réelles.
            </h2>
          </div>
          <p className="md:col-span-4 text-sm leading-7 text-[var(--color-fg-muted)]">
            Le catalogue est volontairement resserré. L'objectif n'est pas
            d'empiler des références, mais d'équiper correctement un atelier.
          </p>
        </Reveal>

        <div className="panel overflow-hidden rounded-[22px]">
          <div className="hidden grid-cols-[0.7fr_1.2fr_1fr_1.45fr_0.8fr] border-b border-[var(--color-border)] px-6 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)] md:grid">
            <span>Réf.</span>
            <span>Équipement</span>
            <span>Couverture</span>
            <span>Usage recommandé</span>
            <span className="text-right">Prix</span>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {products.map((product, index) => (
              <ProductRow key={product.ref} product={product} index={index} />
            ))}
          </div>
        </div>

        <Reveal delay={0.2} className="mt-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[var(--color-fg-muted)]">
            Besoin spécifique constructeur ou flotte mixte? L'équipe prépare une configuration cohérente avant devis.
          </p>
          <a
            href="#contact"
            className="inline-flex min-h-11 items-center justify-center rounded-[10px] border border-[var(--color-border-strong)] px-5 text-sm font-semibold text-[var(--color-fg)] transition duration-200 hover:border-[var(--color-accent)] hover:bg-white/[0.03]"
          >
            Demander une configuration
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function ProductRow({ product, index }: { product: Product; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.55, delay: index * 0.04, ease: easings.signature }}
      className="grid gap-4 px-5 py-5 transition duration-300 hover:bg-white/[0.025] md:grid-cols-[0.7fr_1.2fr_1fr_1.45fr_0.8fr] md:items-center md:px-6"
    >
      <div className="font-mono text-xs text-[var(--color-fg-subtle)]">{product.ref}</div>
      <div>
        <h3 className="font-semibold tracking-[-0.015em]">{product.name}</h3>
        <div className={`mt-1 font-mono text-[10px] uppercase tracking-[0.14em] ${levelStyle[product.level]}`}>
          {product.level}
        </div>
      </div>
      <div className="text-sm text-[var(--color-fg-muted)]">{product.coverage}</div>
      <p className="text-sm leading-6 text-[var(--color-fg-muted)]">{product.useCase}</p>
      <div className="tabular font-mono text-sm font-semibold text-[var(--color-fg)] md:text-right">
        {product.price}
      </div>
    </motion.article>
  );
}
