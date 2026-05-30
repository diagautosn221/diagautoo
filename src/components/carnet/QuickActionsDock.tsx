"use client";

import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";

export type QuickAction = {
  id: string;
  label: string;
  status?: string;
  icon: ReactNode;
  /** When provided, called on click. Receives the action id. */
  onTrigger?: (id: string) => Promise<void> | void;
};

type QuickActionsDockProps = {
  actions: QuickAction[];
  /** Optional title at the top of the dock. */
  title?: string;
};

export function QuickActionsDock({
  actions,
  title = "Actions rapides",
}: QuickActionsDockProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  async function onClick(action: QuickAction) {
    if (!action.onTrigger) return;
    setBusyId(action.id);
    setConfirmedId(null);
    try {
      await action.onTrigger(action.id);
      setConfirmedId(action.id);
      setTimeout(() => setConfirmedId((c) => (c === action.id ? null : c)), 1800);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="panel rounded-[18px] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
          {title}
        </p>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
          {actions.length} disponibles
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {actions.map((action, i) => {
          const busy = busyId === action.id;
          const confirmed = confirmedId === action.id;
          return (
            <motion.button
              key={action.id}
              type="button"
              onClick={() => onClick(action)}
              disabled={busy}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileTap={{ scale: 0.97 }}
              className="hairline-card group relative grid min-h-[92px] place-items-center gap-1 rounded-[14px] p-3 text-center transition hover:border-[var(--color-accent)]/40 hover:bg-[color-mix(in_srgb,var(--color-accent)_4%,transparent)] disabled:opacity-70"
            >
              <span
                className={`grid size-9 place-items-center rounded-full border transition ${
                  confirmed
                    ? "border-[var(--color-success)]/40 bg-[var(--color-success)]/15 text-[var(--color-success)]"
                    : "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/8 text-[var(--color-accent)] group-hover:scale-110"
                } [&_svg]:size-[18px]`}
                style={{ transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)" }}
              >
                {confirmed ? <CheckGlyph /> : busy ? <SpinnerGlyph /> : action.icon}
              </span>
              <span className="text-[11px] font-semibold leading-tight text-[var(--color-fg)]">
                {action.label}
              </span>
              {action.status && (
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
                  {action.status}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M5 12l5 5 9-11" />
    </svg>
  );
}

function SpinnerGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <motion.path
        d="M12 3 a 9 9 0 0 1 0 18"
        strokeLinecap="round"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "12px 12px", transformBox: "fill-box" }}
      />
    </svg>
  );
}
