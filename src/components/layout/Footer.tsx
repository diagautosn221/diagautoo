import Link from "next/link";

const columns: Array<{
  title: string;
  links: Array<{ href: string; label: string }>;
}> = [
  {
    title: "Le service",
    links: [
      { href: "/#pourquoi", label: "Pourquoi DiagAutoSN" },
      { href: "/#what", label: "Ce qu'on fait" },
      { href: "/#preview", label: "Voir le carnet" },
      { href: "/#contact", label: "Nous joindre" },
    ],
  },
  {
    title: "Pour les pros",
    links: [
      { href: "/login", label: "Espace atelier" },
      { href: "/login", label: "Espace admin" },
      { href: "/#contact", label: "Devenir partenaire" },
    ],
  },
  {
    title: "Légal & confiance",
    links: [
      { href: "/#contact", label: "Mentions légales" },
      { href: "/#contact", label: "Confidentialité" },
      { href: "/#contact", label: "Conditions" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
      <div className="container-tight grid gap-12 py-16 md:grid-cols-12 md:gap-10">
        {/* Brand block */}
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-[10px] border border-[var(--color-accent)]/35 bg-[var(--color-accent)]/12">
              <span className="h-3 w-5 rounded-sm border border-[var(--color-accent)]" />
            </span>
            <span className="font-mono text-[13px] font-semibold tracking-[0.18em] text-[var(--color-fg)]">
              DIAGAUTO<span className="text-[var(--color-accent)]">SN</span>
            </span>
          </div>

          <p className="mt-5 max-w-sm text-pretty text-xl font-medium italic leading-snug text-[var(--color-fg)] font-display">
            « Sa oto la wax. Nun lañu la jangale. »
          </p>
          <p className="mt-2 max-w-sm text-sm leading-7 text-[var(--color-fg-muted)]">
            Ta voiture parle. Nous, on traduit. Atelier à Mermoz, équipe à
            Dakar, téranga partout au Sénégal.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
            <span className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5">Wave accepté</span>
            <span className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5">Orange Money</span>
            <span className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5">WhatsApp 24h</span>
          </div>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.title} className="md:col-span-2">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
              {col.title}
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={`${col.title}-${link.label}`}>
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

        {/* Contact column */}
        <div className="md:col-span-1">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
            Direct
          </h4>
          <ul className="mt-4 flex flex-col gap-2.5">
            <li>
              <a
                href="https://wa.me/221"
                className="text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-accent)]"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href="mailto:contact@diagautosn.com"
                className="text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-accent)]"
              >
                Email
              </a>
            </li>
            <li>
              <a
                href="tel:+221"
                className="text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-accent)]"
              >
                Téléphone
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)]">
        <div className="container-tight flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
            © {year} DiagAutoSN · Dakar · Sénégal
          </p>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[var(--color-success)] live-dot" />
              Atelier Mermoz · jamm ak jamm · 24/7
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
