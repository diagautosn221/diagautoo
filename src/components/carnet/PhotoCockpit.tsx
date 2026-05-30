"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { HealthScoreRing } from "./HealthScoreRing";
import { getCarPhoto } from "@/lib/photos";

export type PhotoCockpitSeverity = "ok" | "watch" | "urgent" | "blocked";

export type PhotoCockpitAlert = {
  id: string;
  label: string;
  source?: string;
  severity: PhotoCockpitSeverity;
};

type PhotoCockpitProps = {
  brand: string;
  model: string;
  vehicleLabel: string;
  plate?: string;
  vin?: string;
  mileage: number;
  healthScore: number;
  /** Live alerts to surface as a stacked badge column. Top 3 shown. */
  alerts?: PhotoCockpitAlert[];
  /** Telemetry pings — drives the "last seen Xs ago" label. */
  lastSeenAt?: string | null;
  /** Optional override of the photo URL — tests / future per-vehicle photos. */
  photoUrl?: string;
  /** Public preview mode: hides plate, VIN, mileage and client-like details. */
  privacyMode?: boolean;
};

const severityColor: Record<PhotoCockpitSeverity, string> = {
  ok: "var(--color-success)",
  watch: "var(--color-warn)",
  urgent: "var(--color-accent)",
  blocked: "var(--color-danger)",
};

const severityLabel: Record<PhotoCockpitSeverity, string> = {
  ok: "Nominal",
  watch: "Surveiller",
  urgent: "Action",
  blocked: "Critique",
};

export function PhotoCockpit({
  brand,
  model,
  vehicleLabel,
  plate,
  vin,
  mileage,
  healthScore,
  alerts = [],
  lastSeenAt,
  photoUrl,
  privacyMode = false,
}: PhotoCockpitProps) {
  const reduce = useReducedMotion();
  const [hoverAlert, setHoverAlert] = useState<string | null>(null);

  const photo = photoUrl ?? getCarPhoto(brand, model, "hero");

  const counts = useMemo(() => {
    return alerts.reduce(
      (acc, a) => {
        acc[a.severity] = (acc[a.severity] ?? 0) + 1;
        return acc;
      },
      { ok: 0, watch: 0, urgent: 0, blocked: 0 } as Record<PhotoCockpitSeverity, number>
    );
  }, [alerts]);

  const lastSeenLabel = useMemo(() => {
    if (!lastSeenAt) return "à l'instant";
    const seenAt = new Date(lastSeenAt).getTime();
    if (Number.isNaN(seenAt)) {
      return "à l'instant";
    }
    const diff = Math.max(0, Date.now() - seenAt);
    const seconds = Math.round(diff / 1000);
    if (seconds < 60) return `il y a ${seconds}s`;
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `il y a ${minutes} min`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `il y a ${hours}h`;
    const days = Math.round(hours / 24);
    return `il y a ${days}j`;
  }, [lastSeenAt]);

  const topAlerts = alerts.slice(0, 3);

  return (
    <article className="relative isolate overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-black shadow-[0_30px_110px_color-mix(in_srgb,var(--color-fg)_22%,transparent)]">
      {/* ── Hero photo ──────────────────────────────────────────────── */}
      <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-[16/9] xl:aspect-[21/9]">
        <motion.img
          src={photo}
          alt={`${brand} ${model}`}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
          initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Cinematic grading layers */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.08) 30%, rgba(0,0,0,0.35) 65%, rgba(0,0,0,0.82) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(255,255,255,0.10), transparent 70%)",
          }}
        />

        {/* ── Top strip — kit info + sync ─────────────────────────── */}
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute left-4 right-4 top-4 flex flex-wrap items-start justify-between gap-3 md:left-6 md:right-6 md:top-6"
        >
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-[var(--color-accent)] live-dot" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/85">
              {privacyMode ? "aperçu anonymisé" : `boîtier connecté · ${lastSeenLabel}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {(["urgent", "watch", "blocked"] as PhotoCockpitSeverity[]).map((sev) =>
              counts[sev] > 0 ? (
                <span
                  key={sev}
                  className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] backdrop-blur-md"
                  style={{ color: severityColor[sev] }}
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{
                      background: severityColor[sev],
                      boxShadow: `0 0 10px ${severityColor[sev]}`,
                    }}
                  />
                  {counts[sev]} {severityLabel[sev]}
                </span>
              ) : null
            )}
          </div>
        </motion.div>

        {/* ── Health ring — floating left ─────────────────────────── */}
        <motion.div
          initial={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="absolute bottom-6 left-6 hidden rounded-[24px] border border-white/12 bg-black/55 p-3 backdrop-blur-xl md:block"
        >
          <HealthScoreRingDark score={healthScore} />
        </motion.div>

        {/* ── Alert stack — floating right ────────────────────────── */}
        {topAlerts.length > 0 && (
          <motion.div
            initial={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="absolute bottom-6 right-6 hidden max-w-[280px] flex-col gap-2 md:flex"
          >
            {topAlerts.map((a) => (
              <button
                key={a.id}
                type="button"
                onMouseEnter={() => setHoverAlert(a.id)}
                onMouseLeave={() => setHoverAlert((c) => (c === a.id ? null : c))}
                className="group relative flex items-start gap-2 rounded-[14px] border border-white/12 bg-black/55 p-3 text-left backdrop-blur-xl transition hover:border-white/30"
              >
                <span
                  className="mt-1 size-2 shrink-0 rounded-full"
                  style={{
                    background: severityColor[a.severity],
                    boxShadow: `0 0 12px ${severityColor[a.severity]}`,
                  }}
                />
                <div className="min-w-0">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/55">
                    {a.source ?? "alerte"}
                  </p>
                  <p
                    className={`mt-0.5 text-[12px] font-semibold leading-tight text-white transition ${
                      hoverAlert === a.id ? "" : "line-clamp-2"
                    }`}
                  >
                    {a.label}
                  </p>
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {/* ── Vehicle identity — bottom ──────────────────────────── */}
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="absolute inset-x-4 bottom-4 grid gap-2 text-white md:inset-x-6 md:bottom-6 md:grid-cols-[1fr_auto] md:items-end md:gap-6"
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/65">
              {privacyMode ? "simulation publique" : "véhicule connecté"}
            </p>
            <h2 className="mt-1.5 font-display text-3xl font-semibold leading-[0.96] tracking-[-0.04em] md:text-5xl">
              {vehicleLabel}
            </h2>
          </div>
          {privacyMode ? (
            <div className="rounded-[12px] border border-white/12 bg-black/55 px-3 py-2 text-right backdrop-blur-md">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/55">
                données privées
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                plaque, VIN et km masqués
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 md:flex md:items-end md:gap-4">
              <StatCell label="plaque" value={plate ?? "—"} mono />
              <StatCell label="km" value={mileage.toLocaleString("fr-FR")} mono />
              <StatCell label="VIN" value={vin ? `…${vin.slice(-6)}` : "masqué"} mono />
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Mobile-only ring strip ──────────────────────────────────── */}
      <div className="grid gap-3 border-t border-white/8 bg-black/85 p-4 md:hidden">
        <HealthScoreRingDark score={healthScore} compact />
      </div>
    </article>
  );
}

function StatCell({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-[12px] border border-white/12 bg-black/55 px-3 py-2 backdrop-blur-md">
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/55">
        {label}
      </p>
      <p
        className={`mt-0.5 text-sm font-semibold text-white ${
          mono ? "tabular font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/**
 * Dark-skinned variant of HealthScoreRing so it reads on photo backgrounds.
 * The original ring is tuned for the light theme. Wrapper enforces dark
 * tones without forking the underlying component.
 */
function HealthScoreRingDark({ score, compact = false }: { score: number; compact?: boolean }) {
  return (
    <div
      className="relative"
      style={{
        // Re-skin CSS vars locally so the ring picks dark-on-photo values.
        ["--color-fg" as string]: "rgba(255,255,255,0.96)",
        ["--color-fg-subtle" as string]: "rgba(255,255,255,0.55)",
      }}
    >
      <HealthScoreRing score={score} size={compact ? 140 : 170} stroke={11} ticks={!compact} />
    </div>
  );
}
