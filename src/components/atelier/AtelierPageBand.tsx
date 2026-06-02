import { getWorkshopPhoto } from "@/lib/photos";

type AtelierPageBandProps = {
  scene: "hero" | "diagnostic" | "service" | "training" | "bay" | "hands" | "install" | "team";
  eyebrow: string;
  title: string;
  caption?: string;
  /** Right-side stat or status chips (max 3 recommended). */
  chips?: Array<{ label: string; value: string }>;
};

/**
 * Thin photo banner used at the top of /atelier subpages to give each
 * surface a distinct visual identity. Self-contained — drop it under the
 * page header and it inherits its own background.
 */
export function AtelierPageBand({ scene, eyebrow, title, caption, chips }: AtelierPageBandProps) {
  return (
    <section className="container-tight mb-4 md:mb-6">
      <div className="relative isolate overflow-hidden rounded-[22px] border border-[var(--color-border)] bg-black shadow-[0_18px_54px_color-mix(in_srgb,var(--color-fg)_10%,transparent)]">
        <img
          src={getWorkshopPhoto(scene, "hero")}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "linear-gradient(110deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.18) 100%)",
          }}
        />

        <div className="relative grid gap-4 p-4 text-white md:grid-cols-[1.4fr_1fr] md:items-end md:p-7">
          <div>
            <p className="font-mono text-[10px] uppercase text-[var(--color-accent)] md:text-[11px]">
              {eyebrow}
            </p>
            <h1 className="mt-2 max-w-[20ch] text-balance font-display text-2xl font-semibold leading-[1.02] md:text-[2.4rem]">
              {title}
            </h1>
            {caption && (
              <p className="mt-2 hidden max-w-[58ch] text-sm leading-6 text-white/75 sm:block">{caption}</p>
            )}
          </div>

          {chips && chips.length > 0 && (
            <div className="grid grid-cols-3 gap-2 md:justify-self-end">
              {chips.map((c) => (
                <div
                  key={c.label}
                  className="rounded-[12px] border border-white/12 bg-black/45 px-2.5 py-2 backdrop-blur-md"
                >
                  <p className="font-mono text-[9px] uppercase text-white/55">
                    {c.label}
                  </p>
                  <p className="tabular mt-1 font-display text-base font-semibold leading-none md:text-lg">
                    {c.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
