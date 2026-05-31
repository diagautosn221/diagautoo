import Link from "next/link";
import { Logomark } from "@/components/brand/Logomark";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#preview", label: "Compte client" },
  { href: "/login", label: "Connexion" },
  { href: "/#contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-white">
      <div className="container-tight grid gap-5 py-7 md:grid-cols-[1fr_auto] md:items-center">
        <div className="min-w-0">
          <Logomark size={28} />
          <p className="mt-3 max-w-md text-sm leading-6 text-[var(--color-fg-muted)]">
            Ta voiture parle. DiagAutoSN traduit, alerte et garde ton carnet
            privé à jour.
          </p>
        </div>

        <div className="grid gap-4 md:justify-items-end">
          <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Liens pied de page">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-sm font-semibold text-[var(--color-fg-muted)] transition hover:text-[var(--color-accent)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
            <span>© {year} DiagAutoSN</span>
            <span>Dakar · Sénégal</span>
            <span>Wave · OM · Cash</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
