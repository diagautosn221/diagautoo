"use client";

type TopBarProps = {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
};

export function TopBar({ title, subtitle, breadcrumbs, actions }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-[var(--color-bg)]/80 border-b border-[var(--color-border)]">
      <div className="px-6 lg:px-10 py-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.15em] text-[var(--color-fg-subtle)] mb-2">
              {breadcrumbs.map((b, i) => (
                <span key={`${b.label}-${i}`} className="flex items-center gap-1.5">
                  {b.href ? (
                    <a href={b.href} className="hover:text-[var(--color-fg-muted)]">
                      {b.label}
                    </a>
                  ) : (
                    <span>{b.label}</span>
                  )}
                  {i < breadcrumbs.length - 1 && <span className="opacity-40">/</span>}
                </span>
              ))}
            </nav>
          )}
          <h1 className="font-display text-2xl md:text-[1.75rem] font-light tracking-[-0.015em] leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-[var(--color-fg-muted)] mt-1.5">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </header>
  );
}
