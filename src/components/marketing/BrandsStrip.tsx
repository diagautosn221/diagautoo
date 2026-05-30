"use client";

/**
 * BrandsStrip — infinite marquee of supported car brands.
 *
 * Pure CSS animation (no JS rAF). Two duplicated lists glide in opposite
 * directions for an organic dual-flow. Tasteful, monotype, no logos
 * (we don't have rights — and typographic brand names read more refined).
 */

const brands = [
  "Toyota",
  "Mercedes-Benz",
  "BMW",
  "Hyundai",
  "Renault",
  "Peugeot",
  "Ford",
  "Nissan",
  "Kia",
  "Audi",
  "Land Rover",
  "Volkswagen",
];

export function BrandsStrip() {
  return (
    <section
      aria-label="Marques de véhicules suivies"
      className="relative overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-10"
    >
      <p className="container-tight mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
        Toutes marques · même les vieilles
      </p>

      <div className="relative">
        {/* Fade edges */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32"
          style={{
            background:
              "linear-gradient(90deg, var(--color-bg-elevated), transparent)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32"
          style={{
            background:
              "linear-gradient(270deg, var(--color-bg-elevated), transparent)",
          }}
          aria-hidden
        />

        {/* Marquee row */}
        <div className="flex overflow-hidden" aria-hidden>
          <ul className="brands-marquee flex shrink-0 items-center gap-12 pr-12 font-display text-2xl font-light tracking-[-0.015em] text-[var(--color-fg-muted)] md:text-3xl lg:text-[2.25rem]">
            {[...brands, ...brands].map((brand, i) => (
              <li key={`a-${brand}-${i}`} className="flex items-center gap-12">
                <span>{brand}</span>
                <span
                  aria-hidden
                  className="inline-block size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes brands-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .brands-marquee {
          animation: brands-scroll 48s linear infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .brands-marquee { animation: none; }
        }
      `}</style>
    </section>
  );
}
