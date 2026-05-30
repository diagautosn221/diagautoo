"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { easings } from "@/lib/motion/easings";
import { getEquipmentPhoto } from "@/lib/photos";

type Product = {
  ref: string;
  /** Photo lookup key — see EQUIPMENT registry in src/lib/photos. */
  photoKey: string;
  name: string;
  coverage: string;
  useCase: string;
  price: string;
  level: "Essentiel" | "Atelier" | "Constructeur";
};

const products: Product[] = [
  {
    ref: "DA-014",
    photoKey: "elm327",
    name: "ELM 327 Bluetooth",
    coverage: "OBD-II basique",
    useCase: "Lecture moteur, effacement simple, contrôle avant achat.",
    price: "3 900 F CFA",
    level: "Essentiel",
  },
  {
    ref: "DA-018",
    photoKey: "obd-mini",
    name: "Mini WiFi OBD-II",
    coverage: "Smartphone iOS / Android",
    useCase: "Lecture en direct depuis le téléphone, app fournie.",
    price: "10 000 F CFA",
    level: "Essentiel",
  },
  {
    ref: "DA-021",
    photoKey: "bmw-enet",
    name: "BMW ENET",
    coverage: "BMW E / F / G",
    useCase: "Codage, diagnostic avancé, programmation légère.",
    price: "30 000 F CFA",
    level: "Atelier",
  },
  {
    ref: "DA-038",
    photoKey: "autocom",
    name: "Autocom CDP+ / Delphi DS150e",
    coverage: "VL, utilitaires, poids lourds",
    useCase: "Garage multimarques, lecture complète et tests actionneurs.",
    price: "90 000 F CFA",
    level: "Atelier",
  },
  {
    ref: "DA-052",
    photoKey: "mb-star",
    name: "MB STAR C6",
    coverage: "Mercedes-Benz",
    useCase: "Diagnostic constructeur, codage, SCN selon configuration.",
    price: "150 000 F CFA",
    level: "Constructeur",
  },
  {
    ref: "DA-067",
    photoKey: "launch-x431",
    name: "Launch X431 SmartLink",
    coverage: "Multimarques premium",
    useCase: "ADAS, diagnostic à distance, programmation, atelier exigeant.",
    price: "Sur devis",
    level: "Constructeur",
  },
];

const levelStyle: Record<Product["level"], { dot: string; text: string }> = {
  Essentiel: { dot: "bg-[var(--color-success)]", text: "text-[var(--color-success)]" },
  Atelier: { dot: "bg-[var(--color-accent)]", text: "text-[var(--color-accent)]" },
  Constructeur: { dot: "bg-[var(--color-warn)]", text: "text-[var(--color-warn)]" },
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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.ref} product={product} index={index} />
          ))}
        </div>

        <Reveal delay={0.2} className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[var(--color-fg-muted)]">
            Besoin spécifique constructeur ou flotte mixte ? L'équipe prépare une configuration cohérente avant devis.
          </p>
          <a
            href="#contact"
            className="inline-flex min-h-11 items-center justify-center rounded-[10px] border border-[var(--color-border-strong)] px-5 text-sm font-semibold text-[var(--color-fg)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Demander une configuration
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const style = levelStyle[product.level];
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: easings.signature }}
      className="group panel relative flex flex-col overflow-hidden rounded-[20px]"
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[color-mix(in_srgb,var(--color-fg)_4%,transparent)]">
        <motion.img
          src={getEquipmentPhoto(product.photoKey, "card")}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        {/* Subtle bottom shade to ground the photo. */}
        <div
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          aria-hidden
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-fg) 25%, transparent) 100%)",
          }}
        />
        {/* Level pill in top-left */}
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] backdrop-blur-md ${style.text}`}
        >
          <span className={`size-1.5 rounded-full ${style.dot}`} />
          {product.level}
        </span>
        {/* Ref in bottom-left */}
        <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/80">
          {product.ref}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="font-display text-xl font-semibold leading-tight tracking-[-0.02em]">
            {product.name}
          </h3>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
            {product.coverage}
          </p>
        </div>
        <p className="text-sm leading-6 text-[var(--color-fg-muted)]">{product.useCase}</p>
        <div className="mt-auto flex items-baseline justify-between border-t border-[var(--color-border)] pt-4">
          <span className="tabular font-mono text-sm font-semibold text-[var(--color-fg)]">
            {product.price}
          </span>
          <a
            href="#contact"
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent)] transition hover:gap-2"
          >
            Demander
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </motion.article>
  );
}
