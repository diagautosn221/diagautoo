"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { VehicleAiAssistant } from "@/components/product/VehicleAiAssistant";

type PublicHomeProps = {
  site: {
    pages: Array<{
      slug?: string;
      title?: string;
      description?: string;
      status?: string;
    }>;
    services: Array<{
      id?: string;
      title?: string;
      description?: string;
      priceLabel?: string;
      status?: string;
    }>;
    proof: {
      clients: number;
      vehicles: number;
      connectedDevices: number;
    };
  };
};

const carPhotos = {
  redSuv: "https://images.pexels.com/photos/4639907/pexels-photo-4639907.jpeg?auto=compress&cs=tinysrgb&w=1400",
  whiteSuv: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1400",
  garage: "https://images.pexels.com/photos/31154207/pexels-photo-31154207.jpeg?auto=compress&cs=tinysrgb&w=1400",
};

const quickControls: Array<[string, string]> = [
  ["Verrouillage", "Securise"],
  ["Climatisation", "Preparer"],
  ["Localisation", "Dakar"],
  ["Diagnostic", "OBD live"],
];

const productSteps: Array<[string, string]> = [
  ["Compte client", "Le proprietaire voit sa voiture, ses documents, ses alertes et ses demandes atelier."],
  ["Capteur IoT", "Le boitier remonte batterie, DTC, kilometrage, temperature et evenements critiques."],
  ["Reception garage", "Le conseiller ouvre un dossier, ajoute les photos, cree un devis et planifie la baie."],
  ["Suivi temps reel", "Client et garage partagent la meme verite : etat, cout, action suivante, historique."],
];

const teslaInspired: Array<[string, string]> = [
  ["Etat vehicule", "Photo centrale, score visible, autonomie capteur et dernier signal en haut de l'ecran."],
  ["Actions rapides", "Verrouiller, localiser, demander rappel, lancer diagnostic sans chercher dans un menu."],
  ["Rappels intelligents", "Vidange, visite technique, assurance et alertes moteur avec priorite claire."],
  ["Carnet vivant", "Documents, devis, paiement, historique atelier et preuves photo dans le compte client."],
];

function PhoneCockpit({ proof }: { proof: PublicHomeProps["site"]["proof"] }) {
  return (
    <div className="mx-auto w-full max-w-[390px] rounded-[34px] border border-[var(--color-border)] bg-[var(--color-fg)] p-2 shadow-[0_34px_110px_color-mix(in_srgb,var(--color-fg)_22%,transparent)]">
      <div className="overflow-hidden rounded-[28px] bg-white">
        <div className="relative min-h-[250px]">
          <img src={carPhotos.redSuv} alt="SUV rouge connecte DiagAutoSN" className="h-[250px] w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--color-fg)] via-[color-mix(in_srgb,var(--color-fg)_72%,transparent)] to-transparent p-4 text-white">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/58">Compte client</p>
                <h2 className="mt-1 text-3xl font-black tracking-[-0.055em]">Toyota Prado</h2>
                <p className="mt-1 text-xs text-white/64">DK 4582 AA · capteur DASN-IOT-0421</p>
              </div>
              <div className="rounded-full bg-[var(--color-accent)] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.12em]">
                En ligne
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-px bg-[var(--color-border)]">
          {[
            ["score", "91"],
            ["km", "124k"],
            ["alertes", "03"],
          ].map(([label, value]) => (
            <div key={label} className="bg-white p-3 text-center">
              <div className="tabular font-mono text-xl font-black">{value}</div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 p-4">
          <div className="grid grid-cols-4 gap-2">
            {quickControls.map(([label, status]) => (
              <button
                key={label}
                type="button"
                className="grid min-h-[74px] place-items-center rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 text-center transition hover:border-[var(--color-accent)] active:scale-[0.98]"
              >
                <span className="grid size-7 place-items-center rounded-full bg-[var(--color-accent)] text-[11px] font-black text-white">
                  {label.slice(0, 1)}
                </span>
                <span className="text-[10px] font-black leading-3">{label}</span>
                <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-[var(--color-fg-subtle)]">{status}</span>
              </button>
            ))}
          </div>

          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-fg)] p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/50">Signal IoT</p>
                <p className="mt-1 text-lg font-black">Moteur stable</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--color-fg)]">
                2 min
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/12">
              <div className="h-full w-[76%] rounded-full bg-[var(--color-accent)]" />
            </div>
          </div>

          <div className="grid gap-2">
            {[
              ["Vidange", "1 180 km restants"],
              ["Visite technique", "17 jours"],
              ["Assurance", "8 jours"],
            ].map(([label, due]) => (
              <div key={label} className="flex items-center justify-between rounded-[16px] border border-[var(--color-border)] p-3">
                <span className="text-sm font-black">{label}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-accent)]">{due}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-border)]">
            {[
              ["clients", proof.clients],
              ["vehicules", proof.vehicles],
              ["capteurs", proof.connectedDevices],
            ].map(([label, value]) => (
              <div key={label} className="bg-white p-3">
                <div className="tabular font-mono text-lg font-black">{value}</div>
                <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.1em] text-[var(--color-fg-subtle)]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RealImageRail() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {[
        ["SUV client", carPhotos.redSuv, "Suivi mobile, documents, alertes et historique du vehicule."],
        ["Atelier", carPhotos.garage, "Reception, diagnostic, devis, intervention et livraison."],
        ["Flotte premium", carPhotos.whiteSuv, "Vue claire pour garages, flottes et proprietaires exigeants."],
      ].map(([title, src, text]) => (
        <article key={title} className="overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-white">
          <img src={src} alt={title} className="h-48 w-full object-cover md:h-56" />
          <div className="p-4">
            <h3 className="text-xl font-black tracking-[-0.04em]">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--color-fg-muted)]">{text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function PublicHome({ site }: PublicHomeProps) {
  const homepage = site.pages.find((page) => page.slug === "accueil");
  const animatedSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let cleanup = () => {};
    let mounted = true;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, scrollModule]) => {
      if (!mounted || !animatedSectionRef.current) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const cards = gsap.utils.toArray<HTMLElement>(".mobile-reveal-card");
      const tween = gsap.fromTo(
        cards,
        { y: 34, opacity: 0.72 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: animatedSectionRef.current,
            start: "top 72%",
            end: "bottom 72%",
            scrub: 0.7,
          },
        }
      );

      cleanup = () => tween.kill();
    });

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  return (
    <main className="min-h-[100dvh] bg-[var(--color-bg)] text-[var(--color-fg)]">
      <section className="container-tight grid min-h-[100svh] gap-8 pb-14 pt-24 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">DiagAutoSN mobile garage</p>
          <h1 className="mt-5 max-w-[10ch] text-balance font-display text-6xl font-black leading-[0.86] tracking-[-0.07em] md:text-8xl">
            Votre voiture. Votre garage. En direct.
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-[var(--color-fg-muted)] md:text-xl">
            {homepage?.description ||
              "Un compte client mobile-first relie le garage, les mecaniciens, les documents et le capteur IoT installe dans la voiture."}
          </p>
          <div className="mt-9 grid gap-3 sm:grid-cols-[auto_auto] sm:justify-start">
            <Link
              href="/login"
              className="inline-flex min-h-13 items-center justify-center rounded-full bg-[var(--color-accent)] px-6 text-sm font-black text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px"
            >
              Ouvrir mon espace
            </Link>
            <Link
              href="/carnet"
              className="inline-flex min-h-13 items-center justify-center rounded-full border border-[var(--color-fg)] bg-white px-6 text-sm font-black text-[var(--color-fg)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] active:translate-y-px"
            >
              Voir le carnet client
            </Link>
          </div>
        </div>
        <PhoneCockpit proof={site.proof} />
      </section>

      <section className="container-tight pb-20">
        <RealImageRail />
      </section>

      <section ref={animatedSectionRef} className="container-tight grid gap-8 py-16 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="h-fit rounded-[30px] border border-[var(--color-fg)] bg-[var(--color-fg)] p-6 text-white md:p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent-soft)]">
            inspire par les meilleurs cockpits connectes
          </p>
          <h2 className="mt-4 max-w-[11ch] text-4xl font-black leading-[0.92] tracking-[-0.055em] md:text-6xl">
            Le client ne doit jamais demander ou en est sa voiture.
          </h2>
          <p className="mt-6 text-base leading-8 text-white/70">
            DiagAutoSN met le statut, les commandes rapides et les prochaines echeances au meme endroit, sur mobile, sans friction.
          </p>
        </div>

        <div className="grid gap-3">
          {teslaInspired.map(([title, text], index) => (
            <article key={title} className="mobile-reveal-card rounded-[26px] border border-[var(--color-border)] bg-white p-6 shadow-[0_24px_90px_color-mix(in_srgb,var(--color-fg)_8%,transparent)]">
              <div className="font-mono text-xs text-[var(--color-accent)]">0{index + 1}</div>
              <h3 className="mt-5 text-3xl font-black tracking-[-0.045em]">{title}</h3>
              <p className="mt-3 max-w-xl text-base leading-7 text-[var(--color-fg-muted)]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-tight pb-20">
        <div className="grid gap-3 md:grid-cols-4">
          {productSteps.map(([title, text], index) => (
            <article key={title} className="rounded-[24px] border border-[var(--color-border)] bg-white p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent)]">etape 0{index + 1}</span>
              <h3 className="mt-4 text-2xl font-black tracking-[-0.045em]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--color-fg-muted)]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="vehicle-ai" className="container-tight pb-20">
        <VehicleAiAssistant />
      </section>

      <section id="services" className="container-tight pb-20">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">services garage</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[0.96] tracking-[-0.055em] md:text-6xl">
              Tout ce qu'un client attend, visible avant meme de creer son compte.
            </h2>
          </div>
          <Link
            href="/admin"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-white px-5 text-sm font-black hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Gerer le CMS
          </Link>
        </div>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {site.services.map((service, index) => (
            <article
              key={service.id}
              className="mobile-reveal-card min-h-[320px] min-w-[min(84vw,390px)] snap-center rounded-[30px] border border-[var(--color-border)] bg-white p-6 shadow-[0_24px_90px_color-mix(in_srgb,var(--color-fg)_8%,transparent)]"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-xs text-[var(--color-accent)]">0{index + 1}</span>
                <span className="rounded-full border border-[var(--color-border)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">
                  {service.priceLabel}
                </span>
              </div>
              <h3 className="mt-12 text-3xl font-black tracking-[-0.045em]">{service.title}</h3>
              <p className="mt-4 text-base leading-7 text-[var(--color-fg-muted)]">{service.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
