"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession, clearSession } from "@/lib/data/session";
import type { Role } from "@/lib/data/types";
import { useRouter } from "next/navigation";

type NavItem = { href: string; label: string; icon: React.ReactNode };

const clientNav: NavItem[] = [
  {
    href: "/carnet",
    label: "Mes voitures",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 13l2-5a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 8l2 5M5 16h14M6 19v-3M18 19v-3" />
        <circle cx="7.5" cy="14" r="1.5" />
        <circle cx="16.5" cy="14" r="1.5" />
      </svg>
    ),
  },
  {
    href: "/carnet/historique",
    label: "Historique",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 3v5h5M3 8a9 9 0 1 0 3-6.7" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    href: "/carnet/documents",
    label: "Documents",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M9 14h6M9 18h6" />
      </svg>
    ),
  },
];

const atelierNav: NavItem[] = [
  {
    href: "/atelier",
    label: "Vue d'ensemble",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    href: "/atelier/clients",
    label: "Clients",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
      </svg>
    ),
  },
  {
    href: "/atelier/diagnostics",
    label: "Diagnostics actifs",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    href: "/atelier/planning",
    label: "Planning",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    setRole(session.role);
    setName(session.fullName);
  }, [router]);

  const items = role === "atelier" ? atelierNav : clientNav;

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg)] sticky top-0 h-dvh">
      <div className="px-6 pt-7 pb-6 border-b border-[var(--color-border)]">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative size-8 grid place-items-center rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30">
            <span className="size-2 rounded-full bg-[var(--color-accent)] live-dot" />
          </span>
          <div>
            <div className="font-mono text-[13px] font-medium tracking-[0.18em] leading-none">
              DIAGAUTO<span className="text-[var(--color-accent)]">SN</span>
            </div>
            <div className="font-display italic text-[13px] text-[var(--color-fg-muted)] mt-1 leading-none">
              Carnet
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-5 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
          {role === "atelier" ? "Atelier" : "Mon espace"}
        </div>
        <ul className="space-y-0.5">
          {items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 ${
                    active
                      ? "bg-[var(--color-accent)]/10 text-[var(--color-fg)] border border-[var(--color-accent)]/20"
                      : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface)]/60 border border-transparent"
                  }`}
                >
                  <span
                    className={`[&_svg]:size-[18px] ${
                      active ? "text-[var(--color-accent)]" : "text-[var(--color-fg-subtle)] group-hover:text-[var(--color-fg-muted)]"
                    } transition-colors duration-200`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {active && (
                    <span className="size-1 rounded-full bg-[var(--color-accent)]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-4 pb-5 pt-3 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="size-9 rounded-full bg-gradient-to-br from-[var(--color-accent)]/30 to-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 grid place-items-center font-mono text-xs font-medium">
            {name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{name}</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-fg-subtle)]">
              {role === "atelier" ? "Mécanicien" : "Propriétaire"}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)] transition-colors"
            aria-label="Déconnexion"
            title="Déconnexion"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
