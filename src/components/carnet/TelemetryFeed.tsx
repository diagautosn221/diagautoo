"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export type FeedSeverity = "info" | "watch" | "urgent" | "blocked";

export type TelemetryEntry = {
  id: string;
  at: string;             // ISO or pretty time
  vehicle: string;        // "Mercedes C220 · DK-4582-AA"
  code?: string;          // "P0420"
  source: string;         // user-facing source label, e.g. "Lecture boîtier"
  severity: FeedSeverity;
  message: string;
};

type TelemetryFeedProps = {
  entries: TelemetryEntry[];
  /** When true, rotate through entries with a streaming effect. */
  stream?: boolean;
  /** Visible row count. */
  rows?: number;
  /** Title shown in the header. */
  title?: string;
};

const sevColor: Record<FeedSeverity, string> = {
  info: "var(--color-success)",
  watch: "var(--color-warn)",
  urgent: "var(--color-accent)",
  blocked: "var(--color-danger)",
};

const sevLabel: Record<FeedSeverity, string> = {
  info: "info",
  watch: "watch",
  urgent: "urgent",
  blocked: "critique",
};

export function TelemetryFeed({
  entries,
  stream = true,
  rows = 5,
  title = "Lecture boîtier en direct",
}: TelemetryFeedProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!stream || entries.length === 0) return;
    const interval = setInterval(() => setTick((t) => t + 1), 3200);
    return () => clearInterval(interval);
  }, [stream, entries.length]);

  const visible = useMemo(() => {
    if (entries.length === 0) return [];
    if (!stream) return entries.slice(0, rows);
    const start = tick % entries.length;
    const order = [...entries.slice(start), ...entries.slice(0, start)];
    return order.slice(0, rows);
  }, [entries, rows, stream, tick]);

  return (
    <div className="ops-surface relative overflow-hidden rounded-[20px] p-5 text-white">
      <div className="flex items-center justify-between border-b border-white/8 pb-3">
        <div className="flex items-center gap-3">
          <span className="relative grid size-8 place-items-center rounded-md border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/12">
            <span className="size-1.5 rounded-full bg-[var(--color-accent)] live-dot" />
          </span>
          <div>
            <h3 className="font-display text-sm font-semibold tracking-[-0.01em] text-white">
              {title}
            </h3>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
              lecture en direct · {entries.length} info(s) reçue(s)
            </p>
          </div>
        </div>
        <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">
          live
        </span>
      </div>

      <ul className="mt-3 space-y-2">
        <AnimatePresence initial={false}>
          {visible.map((entry, i) => (
            <motion.li
              key={`${entry.id}-${tick}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-[auto_1fr_auto] items-start gap-3 rounded-[12px] border border-white/8 bg-white/[0.025] px-3 py-2.5"
            >
              <div className="mt-0.5 flex flex-col items-center gap-1">
                <span
                  className="size-2 rounded-full"
                  style={{
                    background: sevColor[entry.severity],
                    boxShadow: `0 0 12px ${sevColor[entry.severity]}`,
                  }}
                />
                {entry.code && (
                  <span
                    className="rounded-sm px-1 font-mono text-[9px] uppercase tracking-[0.14em]"
                    style={{
                      background: `color-mix(in srgb, ${sevColor[entry.severity]} 18%, transparent)`,
                      color: sevColor[entry.severity],
                    }}
                  >
                    {entry.code}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
                  {entry.vehicle} · {entry.source}
                </p>
                <p className="mt-1 text-sm leading-snug text-white/90">{entry.message}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
                  {entry.at}
                </p>
                <p
                  className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em]"
                  style={{ color: sevColor[entry.severity] }}
                >
                  {sevLabel[entry.severity]}
                </p>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {entries.length === 0 && (
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
          aucune info reçue pour l'instant
        </p>
      )}
    </div>
  );
}
