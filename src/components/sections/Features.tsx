"use client";

import { Reveal } from "@/components/motion/Reveal";

const feed = [
  { time: "08:12", item: "Prado TXL", status: "rouler" },
  { time: "09:46", item: "Sprinter 313", status: "atelier" },
  { time: "11:05", item: "Hilux flotte", status: "surveiller" },
];

const modules = [
  {
    title: "Clients et vehicules au meme endroit",
    text: "Chaque garage gere ses clients, ses vehicules, ses diagnostics, ses factures et ses prochaines actions sans feuille volante.",
    meta: "crm garage",
  },
  {
    title: "Compte client personnel",
    text: "Le client se connecte, voit son score vehicule, ses alertes, ses documents et le suivi de chaque intervention.",
    meta: "portail client",
  },
  {
    title: "Capteur IoT embarque",
    text: "Les signaux terrain remontent en continu: tension batterie, temperature, codes OBD, mouvements et etat de roulage.",
    meta: "temps reel",
  },
];

export function Features() {
  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="container-tight">
        <Reveal className="mb-14 grid gap-7 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <span className="mb-4 inline-block font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
              plateforme garage
            </span>
            <h2 className="text-balance text-[clamp(2.45rem,6vw,5.2rem)] font-black leading-[0.86] tracking-[-0.065em]">
              Une tour de controle, pas un simple logiciel.
            </h2>
          </div>
          <p className="md:col-span-4 md:col-start-9 text-pretty text-base leading-8 text-[var(--color-fg-muted)]">
            L'atelier pilote l'activite. Le client suit son vehicule. Le capteur
            IoT alimente les deux avec des signaux exploitables.
          </p>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-12 lg:auto-rows-[minmax(210px,auto)]">
          <Reveal className="panel relative overflow-hidden rounded-[28px] p-6 lg:col-span-7 lg:row-span-2 md:p-8">
            <div className="absolute -right-24 -top-24 size-72 rounded-full bg-[var(--color-accent)]/16 blur-3xl" />
            <div className="relative flex h-full flex-col justify-between gap-10">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.17em] text-[var(--color-accent)]">
                  verdict conducteur
                </span>
                <h3 className="mt-4 max-w-[12ch] text-4xl font-black leading-[0.9] tracking-[-0.055em] md:text-6xl">
                  Rouler. Surveiller. Atelier.
                </h3>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {["rouler", "surveiller", "atelier"].map((status, index) => (
                  <div
                    key={status}
                    className={`rounded-[18px] border p-5 ${
                      index === 0
                        ? "border-[var(--color-success)]/35 bg-[var(--color-success)]/10"
                        : index === 1
                          ? "border-[var(--color-warn)]/35 bg-[var(--color-warn)]/10"
                          : "border-[var(--color-danger)]/35 bg-[var(--color-danger)]/10"
                    }`}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                      option 0{index + 1}
                    </div>
                    <div className="mt-8 text-2xl font-black tracking-[-0.04em]">{status}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.05} className="panel rounded-[28px] p-6 lg:col-span-5 md:p-8">
            <div className="mb-7 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.17em] text-[var(--color-fg-subtle)]">
                feed atelier
              </span>
              <span className="size-2 rounded-full bg-[var(--color-success)] live-dot" />
            </div>
            <div className="flex flex-col gap-3">
              {feed.map((entry) => (
                <div
                  key={entry.time}
                  className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-[14px] border border-[var(--color-border)] bg-[#09090b]/70 px-3 py-3"
                >
                  <span className="font-mono text-xs text-[var(--color-accent)]">{entry.time}</span>
                  <span className="text-sm font-semibold">{entry.item}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
                    {entry.status}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08} className="panel relative overflow-hidden rounded-[28px] p-6 lg:col-span-5 md:p-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.17em] text-[var(--color-fg-subtle)]">
                  disponibilite flotte
                </span>
                <div className="tabular mt-3 font-mono text-6xl font-black tracking-[-0.08em]">74.8</div>
              </div>
              <div className="relative h-24 w-24 rounded-full border border-[var(--color-border)]">
                <div className="absolute inset-3 rounded-full border-[10px] border-[var(--color-accent)]/25" />
                <div className="gauge-sweep absolute bottom-4 left-1/2 h-10 w-1 rounded-full bg-[var(--color-accent)]" />
              </div>
            </div>
            <p className="text-sm leading-7 text-[var(--color-fg-muted)]">
              Une lecture rapide des vehicules qui risquent de bloquer l'activite du garage ou de la flotte.
            </p>
          </Reveal>

          {modules.map((module, index) => (
            <Reveal
              key={module.title}
              delay={0.1 + index * 0.04}
              className="panel rounded-[24px] p-6 md:p-7 lg:col-span-4"
            >
              <div className="mb-9 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
                {module.meta}
              </div>
              <h3 className="text-2xl font-black leading-tight tracking-[-0.045em]">{module.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--color-fg-muted)]">{module.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
