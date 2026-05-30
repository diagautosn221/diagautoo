"use client";

import { motion, useReducedMotion } from "framer-motion";

type RangeBarProps = {
  /** Current odometer km. */
  currentKm: number;
  /** Km at which the next service is due. */
  nextServiceKm: number;
  /** Last service km — defines the start of the bar. */
  lastServiceKm?: number;
  /** Label for the service (e.g. "vidange", "visite technique"). */
  serviceLabel?: string;
  /** Optional ETA date string ("23 juin 2026"). */
  etaLabel?: string;
};

/**
 * Tesla-style "range remaining" horizontal bar adapted for service intervals.
 *
 * The bar runs from lastServiceKm to nextServiceKm. The fill represents the
 * km already covered since the last service. The remaining gap shows the
 * km left until the next service is due. Colour escalates as we approach
 * the end of the interval.
 */
export function RangeBar({
  currentKm,
  nextServiceKm,
  lastServiceKm = 0,
  serviceLabel = "Prochain entretien",
  etaLabel,
}: RangeBarProps) {
  const reduce = useReducedMotion();
  const span = Math.max(1, nextServiceKm - lastServiceKm);
  const used = Math.max(0, Math.min(span, currentKm - lastServiceKm));
  const remaining = Math.max(0, nextServiceKm - currentKm);
  const ratio = used / span;
  const percent = Math.round(ratio * 100);

  const color =
    ratio < 0.7
      ? "var(--color-success)"
      : ratio < 0.9
      ? "var(--color-warn)"
      : "var(--color-danger)";

  const overdue = currentKm > nextServiceKm;

  return (
    <div className="hairline-card rounded-[16px] p-4">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
            {serviceLabel}
          </p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span
              className="tabular font-display text-3xl font-semibold leading-none tracking-[-0.035em]"
              style={{ color: overdue ? "var(--color-danger)" : "var(--color-fg)" }}
            >
              {overdue ? "−" : ""}
              {Math.abs(remaining).toLocaleString("fr-FR")}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
              km {overdue ? "de retard" : "restants"}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color }}>
            {percent}%
          </p>
          {etaLabel && (
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
              ETA · {etaLabel}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-fg)_6%,transparent)]">
        <motion.div
          initial={reduce ? { width: `${Math.min(100, percent)}%` } : { width: 0 }}
          whileInView={{ width: `${Math.min(100, percent)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, color-mix(in srgb, ${color} 50%, transparent), ${color})`,
            boxShadow: `0 0 16px color-mix(in srgb, ${color} 60%, transparent)`,
          }}
        >
          <span className="absolute right-1 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-white shadow" />
        </motion.div>
      </div>

      <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
        <span className="tabular">{lastServiceKm.toLocaleString("fr-FR")} km</span>
        <span className="tabular text-[var(--color-fg)]">{currentKm.toLocaleString("fr-FR")} km</span>
        <span className="tabular">{nextServiceKm.toLocaleString("fr-FR")} km</span>
      </div>
    </div>
  );
}
