import Link from "next/link";

const columns = [
  {
    title: "Plateforme",
    links: [
      { href: "#catalogue", label: "Outils diagnostic" },
      { href: "#services", label: "Suivi atelier" },
      { href: "#process", label: "Méthode de déploiement" },
    ],
  },
  {
    title: "Services",
    links: [
      { href: "#services", label: "Configuration" },
      { href: "#services", label: "Formation" },
      { href: "#services", label: "Maintenance" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { href: "#contact", label: "Contact" },
      { href: "#", label: "Confidentialité" },
      { href: "#", label: "Conditions générales" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-border)]">
      <div className="container-tight py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-[10px] border border-[var(--color-accent)]/35 bg-[var(--color-accent)]/12">
                <span className="h-3 w-5 rounded-sm border border-[var(--color-accent)]" />
              </span>
              <span className="font-mono text-[13px] font-semibold tracking-[0.18em]">
                DIAGAUTO<span className="text-[var(--color-accent)]">SN</span>
              </span>
            </div>
            <p className="max-w-sm text-lg font-medium leading-snug text-[var(--color-fg)]">
              La santé véhicule, lisible pour le conducteur et exploitable par l'atelier.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-fg-muted)]">
              Dakar, Sénégal. Diagnostic, carnet de santé et équipement professionnel pour garages, flottes et propriétaires exigeants.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-fg-muted)] transition-colors duration-200 hover:text-[var(--color-fg)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--color-border)] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs tracking-wider text-[var(--color-fg-subtle)]">
            © {new Date().getFullYear()} DiagAutoSN - Dakar, Sénégal
          </p>
          <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-[var(--color-fg-subtle)]">
            <span className="size-1.5 rounded-full bg-[var(--color-success)] live-dot" />
            Support technique actif
          </div>
        </div>
      </div>
    </footer>
  );
}
