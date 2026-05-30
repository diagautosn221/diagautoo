"use client";

import { motion, useReducedMotion } from "framer-motion";

export type TimelineEntry = {
  id: string;
  date: string;            // pretty date "22 avril 2026"
  label: string;
  detail?: string;
  mileageKm?: number;
  costFcfa?: number;
  technician?: string;
  state: "past" | "today" | "upcoming";
  severity?: "ok" | "watch" | "urgent" | "blocked";
  code?: string;
};

type MaintenanceTimelineProps = {
  entries: TimelineEntry[];
  title?: string;
  /** Caps how many rows are shown. */
  maxItems?: number;
};

const severityColor = {
  ok: "var(--color-success)",
  watch: "var(--color-warn)",
  urgent: "var(--color-accent)",
  blocked: "var(--color-danger)",
} as const;

export function MaintenanceTimeline({
  entries,
  title = "Historique & prochaines actions",
  maxItems = 12,
}: MaintenanceTimelineProps) {
  const reduce = useReducedMotion();
  const visible = entries.slice(0, maxItems);

  return (
    <div className="panel rounded-[20px] p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
            Maintenance · timeline
          </p>
          <h3 className="mt-1.5 font-display text-lg font-semibold tracking-[-0.02em]">
            {title}
          </h3>
        </div>
        <span className="rounded-full border border-[var(--color-border)] bg-white/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
          {visible.length} entrées
        </span>
      </div>

      <ol className="relative">
        {/* vertical rail */}
        <span
          aria-hidden
          className="absolute left-[14px] top-2 bottom-2 w-px bg-[color-mix(in_srgb,var(--color-fg)_10%,transparent)]"
        />

        {visible.map((entry, i) => {
          const sev = entry.severity ?? (entry.state === "upcoming" ? "watch" : "ok");
          const color = severityColor[sev];
          const isUpcoming = entry.state === "upcoming";
          const isToday = entry.state === "today";

          return (
            <motion.li
              key={entry.id}
              initial={reduce ? { opacity: 1 } : { opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className="relative grid grid-cols-[36px_1fr] gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="relative pt-1.5">
                <span
                  className={`absolute left-[10px] top-2 z-10 size-2 rounded-full ${isUpcoming || isToday ? "live-dot" : ""}`}
                  style={{
                    background: color,
                    boxShadow: `0 0 0 4px color-mix(in srgb, ${color} 14%, transparent)`,
                  }}
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                    {entry.date}
                  </span>
                  {entry.mileageKm !== undefined && (
                    <span className="tabular font-mono text-[10px] text-[var(--color-fg-subtle)]">
                      {entry.mileageKm.toLocaleString("fr-FR")} km
                    </span>
                  )}
                  {entry.code && (
                    <span
                      className="rounded-sm px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]"
                      style={{
                        background: `color-mix(in srgb, ${color} 12%, transparent)`,
                        color,
                      }}
                    >
                      {entry.code}
                    </span>
                  )}
                  {isUpcoming && (
                    <span
                      className="rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em]"
                      style={{
                        background: `color-mix(in srgb, ${color} 14%, transparent)`,
                        color,
                      }}
                    >
                      à venir
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm font-semibold leading-snug text-[var(--color-fg)]">
                  {entry.label}
                </p>
                {entry.detail && (
                  <p className="mt-1 text-sm leading-6 text-[var(--color-fg-muted)]">
                    {entry.detail}
                  </p>
                )}
                {(entry.technician || entry.costFcfa) && (
                  <div className="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                    {entry.technician && <span>tech · {entry.technician}</span>}
                    {entry.costFcfa !== undefined && (
                      <span className="tabular">{entry.costFcfa.toLocaleString("fr-FR")} F CFA</span>
                    )}
                  </div>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
