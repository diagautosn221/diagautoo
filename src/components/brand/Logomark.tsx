/**
 * DiagAutoSN Logomark — "The Pulse"
 *
 * A circle (the car / containment) crossed by a heartbeat line (diagnostic
 * + alive). Three sizes : icon (16-24px), default (28-40px), display
 * (200px+). The mark scales — the pulse line stays crisp at every size.
 *
 * Two modes:
 *   - `mark` only (the icon, no wordmark)
 *   - `wordmark` (icon + DIAGAUTOSN typography lockup, default)
 */

type LogomarkProps = {
  size?: number;
  /** When `true`, render only the icon glyph. */
  iconOnly?: boolean;
  /** Visual variant — light theme default; "ink" inverts for dark backgrounds. */
  tone?: "default" | "ink" | "brass";
  /** Tooltip / accessibility label. */
  title?: string;
};

export function Logomark({
  size = 32,
  iconOnly = false,
  tone = "default",
  title = "DiagAutoSN",
}: LogomarkProps) {
  const ringColor =
    tone === "ink"
      ? "rgba(255,255,255,0.85)"
      : tone === "brass"
      ? "var(--color-brass)"
      : "var(--color-fg)";
  const pulseColor = "var(--color-accent)";
  const wordmarkColor = tone === "ink" ? "rgba(255,255,255,0.92)" : "var(--color-fg)";

  if (iconOnly) {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        fill="none"
        role="img"
        aria-label={title}
      >
        <Glyph ringColor={ringColor} pulseColor={pulseColor} />
      </svg>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-2.5"
      role="img"
      aria-label={title}
    >
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        fill="none"
        className="shrink-0"
      >
        <Glyph ringColor={ringColor} pulseColor={pulseColor} />
      </svg>
      <span
        className="font-mono text-[13px] font-semibold tracking-[0.18em]"
        style={{ color: wordmarkColor }}
      >
        DIAGAUTO
        <span style={{ color: pulseColor }}>SN</span>
      </span>
    </span>
  );
}

function Glyph({ ringColor, pulseColor }: { ringColor: string; pulseColor: string }) {
  return (
    <>
      {/* Outer circle — the car / containment */}
      <circle
        cx="16"
        cy="16"
        r="13.5"
        stroke={ringColor}
        strokeWidth="1.5"
        strokeOpacity="0.85"
      />
      {/* Inner heartbeat / diagnostic pulse */}
      <path
        d="M 4.5 16 L 10 16 L 12 11 L 16 22 L 20 13 L 22 16 L 27.5 16"
        stroke={pulseColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center punctuation dot */}
      <circle cx="16" cy="16" r="0.9" fill={pulseColor} />
    </>
  );
}
