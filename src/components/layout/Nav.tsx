"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Logomark } from "@/components/brand/Logomark";

const links = [
  { href: "#services", label: "Services" },
  { href: "#preview", label: "Compte client" },
  { href: "#contact", label: "Installer" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <div className={`mx-auto mt-3 max-w-[1240px] px-3 transition-all duration-300 ${scrolled ? "md:px-5" : ""}`}>
        <nav
          className={`flex items-center justify-between gap-3 rounded-[18px] border px-3 py-3 transition-all duration-300 md:px-5 ${
            scrolled
              ? "border-[var(--color-border)] bg-[rgba(10,10,12,0.86)] shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-md"
              : "border-transparent bg-transparent"
          }`}
          aria-label="Navigation principale"
        >
          <Link
            href="/"
            className="group inline-flex min-h-11 shrink items-center rounded-[14px] bg-white px-3 shadow-[0_12px_34px_color-mix(in_srgb,var(--color-fg)_8%,transparent)] ring-1 ring-[var(--color-border)] transition hover:ring-[var(--color-accent)]"
            aria-label="DiagAutoSN — accueil"
          >
            <Logomark size={28} />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`whitespace-nowrap rounded-md px-2.5 py-2 text-sm transition-colors duration-200 lg:px-3 ${
                    scrolled
                      ? "text-white/68 hover:bg-white/[0.08] hover:text-white"
                      : "text-[var(--color-fg-muted)] hover:bg-black/[0.04] hover:text-[var(--color-fg)]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/login"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-[10px] bg-[var(--color-accent)] px-3 text-sm font-semibold text-[var(--color-accent-ink)] transition duration-200 hover:bg-[var(--color-accent-soft)] active:translate-y-px sm:px-4"
          >
            <span className="sm:hidden">Espace</span>
            <span className="hidden sm:inline">Se connecter</span>
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
