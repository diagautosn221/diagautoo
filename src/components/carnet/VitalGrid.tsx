"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

export type VitalStatus = "ok" | "warn" | "alert";
export type VitalTrend = "up" | "down" | "stable";

export type VitalMetric = {
  key: string;
  label: string;
  value: string;
  unit?: string;
  status: VitalStatus;
  trend: VitalTrend;
  /** Last 12 readings, normalized 0..1 for the sparkline. */
  series?: number[];
  /** Optional hint (e.g. "depuis 45 min"). */
  caption?: string;
};

type VitalGridProps = {
  metrics: VitalMetric[];
};

const statusColor: Record<VitalStatus, string> = {
  ok: "var(--color-success)",
  warn: "var(--color-warn)",
  alert: "var(--color-danger)",
};

const trendGlyph: Record<VitalTrend, string> = {
  up: "↑",
  down: "↓",
  stable: "→",
};

export function VitalGrid({ metrics }: VitalGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {metrics.map((m, index) => (
        <VitalTile key={m.key} metric={m} index={index} />
      ))}
    </div>
  );
}

function VitalTile({ metric, index }: { metric: VitalMetric; index: number }) {
  const reduce = useReducedMotion();
  const color = statusColor[metric.status];
  const path = useMemo(() => sparklinePath(metric.series ?? defaultSeries(metric.status)), [metric.series, metric.status]);

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      className="hairline-card group relative overflow-hidden rounded-[14px] p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
          {metric.label}
        </span>
        <span
          className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em]"
          style={{ color }}
        >
          <span className="size-1 rounded-full" style={{ background: color }} />
          {metric.status === "ok" ? "ok" : metric.status === "warn" ? "alerte" : "critique"}
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="tabular font-display text-[1.85rem] font-semibold leading-none tracking-[-0.035em] text-[var(--color-fg)]">
          {metric.value}
        </span>
        {metric.unit && (
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
            {metric.unit}
          </span>
        )}
        <span
          className="ml-auto font-mono text-xs"
          style={{ color: metric.trend === "stable" ? "var(--color-fg-subtle)" : color }}
          aria-label={`tendance ${metric.trend}`}
        >
          {trendGlyph[metric.trend]}
        </span>
      </div>

      <svg
        viewBox="0 0 100 24"
        preserveAspectRatio="none"
        className="mt-3 h-6 w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id={`vital-fill-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.32" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={`${path} L 100 24 L 0 24 Z`}
          fill={`url(#vital-fill-${metric.key})`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.05 + 0.2 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: index * 0.05 + 0.05, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      {metric.caption && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
          {metric.caption}
        </p>
      )}

      {/* hover gradient flourish */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-12 right-0 size-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 60%)`, filter: "blur(20px)" }}
      />
    </motion.div>
  );
}

function sparklinePath(series: number[]) {
  if (series.length === 0) return "M 0 12 L 100 12";
  const w = 100;
  const h = 24;
  const step = w / (series.length - 1 || 1);
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const points = series.map((v, i) => {
    const x = i * step;
    const y = h - 4 - ((v - min) / range) * (h - 8);
    return [x, y] as const;
  });
  return points
    .map((p, i) => (i === 0 ? `M ${p[0].toFixed(2)} ${p[1].toFixed(2)}` : `L ${p[0].toFixed(2)} ${p[1].toFixed(2)}`))
    .join(" ");
}

function defaultSeries(status: VitalStatus) {
  if (status === "alert") return [0.7, 0.62, 0.55, 0.5, 0.42, 0.3, 0.22, 0.18, 0.12, 0.08, 0.05, 0.04];
  if (status === "warn") return [0.55, 0.6, 0.5, 0.48, 0.55, 0.42, 0.38, 0.35, 0.32, 0.38, 0.3, 0.28];
  return [0.5, 0.55, 0.6, 0.58, 0.62, 0.65, 0.6, 0.68, 0.7, 0.66, 0.72, 0.74];
}
