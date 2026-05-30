"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

type HealthScoreRingProps = {
  /** 0..100 */
  score: number;
  /** SVG render size in px. Default 220. */
  size?: number;
  /** Stroke thickness. Default 14. */
  stroke?: number;
  /** Optional label shown below the score. */
  caption?: string;
  /** When true, renders ticks every 10° of the arc. */
  ticks?: boolean;
};

function svgNumber(value: number) {
  return Number(value.toFixed(4));
}

export function HealthScoreRing({
  score,
  size = 220,
  stroke = 14,
  caption = "indice santé",
  ticks = true,
}: HealthScoreRingProps) {
  const reduce = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, Math.round(score)));

  const radius = (size - stroke) / 2;
  const center = size / 2;
  // Arc is 270° (3/4 of circle), starting from bottom-left going clockwise
  const startAngle = 135;
  const endAngle = 405;
  const arcLength = svgNumber((endAngle - startAngle) / 360 * (2 * Math.PI * radius));
  const circumference = svgNumber(2 * Math.PI * radius);
  const dashOffset = useMemo(() => arcLength * (1 - clamped / 100), [arcLength, clamped]);

  const color =
    clamped >= 85
      ? "var(--color-success)"
      : clamped >= 70
      ? "var(--color-warn)"
      : clamped >= 50
      ? "var(--color-accent)"
      : "var(--color-danger)";

  const grade =
    clamped >= 85 ? "Excellent" : clamped >= 70 ? "Correct" : clamped >= 50 ? "À surveiller" : "Critique";

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="absolute inset-0 -rotate-90 origin-center"
        aria-label={`Indice santé ${clamped} sur 100`}
      >
        {/* Background arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="color-mix(in srgb, var(--color-fg) 8%, transparent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          transform={`rotate(${startAngle - 90} ${center} ${center})`}
        />
        {/* Foreground arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={arcLength}
          transform={`rotate(${startAngle - 90} ${center} ${center})`}
          initial={reduce ? { strokeDashoffset: dashOffset } : { strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 12px color-mix(in srgb, ${color} 30%, transparent))` }}
        />
        {/* Ticks */}
        {ticks &&
          Array.from({ length: 28 }).map((_, i) => {
            const tickAngle = startAngle + (i / 27) * (endAngle - startAngle);
            const rad = (tickAngle * Math.PI) / 180;
            const innerR = radius - stroke / 2 - 6;
            const outerR = radius - stroke / 2 - 2;
            const x1 = svgNumber(center + innerR * Math.cos(rad));
            const y1 = svgNumber(center + innerR * Math.sin(rad));
            const x2 = svgNumber(center + outerR * Math.cos(rad));
            const y2 = svgNumber(center + outerR * Math.sin(rad));
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="color-mix(in srgb, var(--color-fg) 18%, transparent)"
                strokeWidth="1"
                transform={`rotate(90 ${center} ${center})`}
              />
            );
          })}
      </svg>

      {/* Center label */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="tabular font-display font-semibold leading-none tracking-[-0.05em]"
            style={{ fontSize: size * 0.32, color: "var(--color-fg)" }}
          >
            {clamped}
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
            / 100 · {caption}
          </div>
          <div
            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]"
            style={{
              background: `color-mix(in srgb, ${color} 12%, transparent)`,
              color,
              border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
            }}
          >
            <span className="size-1 rounded-full" style={{ background: color }} />
            {grade}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
