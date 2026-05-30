"use client";

import { useEffect, useState } from "react";
import { PhotoCockpit, type PhotoCockpitAlert } from "@/components/carnet/PhotoCockpit";

/**
 * LiveCockpitDemo — the product, visible, working, on the home.
 *
 * Cycles through 3 demo states every 5s so the visitor sees the cockpit
 * change without lifting a finger. No lock overlay, no "sign up to see"
 * — the product proves itself.
 */

type DemoState = {
  vehicleLabel: string;
  brand: string;
  model: string;
  healthScore: number;
  alerts: PhotoCockpitAlert[];
};

const states: DemoState[] = [
  {
    vehicleLabel: "Toyota Prado",
    brand: "Toyota",
    model: "Prado",
    healthScore: 87,
    alerts: [
      {
        id: "s1-a",
        label: "Vidange dans 1 800 km",
        source: "On te rappellera",
        severity: "watch",
      },
      {
        id: "s1-b",
        label: "Pneus arrière à surveiller",
        source: "Pression légèrement basse",
        severity: "watch",
      },
    ],
  },
  {
    vehicleLabel: "Mercedes C220",
    brand: "Mercedes",
    model: "C220 d",
    healthScore: 72,
    alerts: [
      {
        id: "s2-a",
        label: "Voyant moteur · à montrer au garage",
        source: "Action recommandée cette semaine",
        severity: "urgent",
      },
      {
        id: "s2-b",
        label: "Batterie un peu basse le matin",
        source: "À surveiller",
        severity: "watch",
      },
    ],
  },
  {
    vehicleLabel: "Hyundai Tucson",
    brand: "Hyundai",
    model: "Tucson",
    healthScore: 94,
    alerts: [
      {
        id: "s3-a",
        label: "Tout est nominal",
        source: "Continue de rouler en jamm",
        severity: "ok",
      },
    ],
  },
];

export function LiveCockpitDemo() {
  const [stateIndex, setStateIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStateIndex((i) => (i + 1) % states.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  const current = states[stateIndex] ?? states[0]!;

  return (
    <section
      id="produit"
      aria-label="Aperçu produit en direct"
      className="container-tight py-20 md:py-28"
    >
      <div className="mb-10 max-w-3xl">
        <p className="kicker kicker-accent inline-flex">
          Le produit, en direct
        </p>
        <h2 className="font-display mt-6 text-balance text-[clamp(2.2rem,5.5vw,4rem)] font-light leading-[1.02] tracking-[-0.03em]">
          Voici à quoi ressemble{" "}
          <span className="font-display-italic text-[var(--color-accent)]">
            sa oto dans ton téléphone.
          </span>
        </h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-[var(--color-fg-muted)]">
          Trois voitures différentes, trois états de santé. Le cockpit
          tourne en boucle pour te montrer ce que reçoit le client équipé.
        </p>
      </div>

      <div className="relative">
        <PhotoCockpit
          key={current.brand + current.model}
          brand={current.brand}
          model={current.model}
          vehicleLabel={current.vehicleLabel}
          mileage={0}
          healthScore={current.healthScore}
          alerts={current.alerts}
          lastSeenAt={new Date(Date.now() - 30_000).toISOString()}
          privacyMode
        />

        {/* Indicator pills under the cockpit */}
        <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="Voitures démo">
          {states.map((s, i) => (
            <button
              key={s.vehicleLabel}
              type="button"
              role="tab"
              aria-selected={i === stateIndex}
              aria-label={`Voir ${s.vehicleLabel}`}
              onClick={() => setStateIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === stateIndex
                  ? "w-10 bg-[var(--color-accent)]"
                  : "w-1.5 bg-[var(--color-fg)]/15 hover:bg-[var(--color-fg)]/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
