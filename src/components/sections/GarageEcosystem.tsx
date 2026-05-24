"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { easings } from "@/lib/motion/easings";

const lifecycleAlerts = [
  {
    title: "Alerte vidange",
    detail: "1 200 km restants",
    source: "Capteur IoT + historique atelier",
    tone: "warn",
  },
  {
    title: "Alerte visite technique",
    detail: "18 jours avant expiration",
    source: "Dossier administratif client",
    tone: "danger",
  },
  {
    title: "Alerte assurance",
    detail: "9 jours avant echeance",
    source: "Contrat rattache au vehicule",
    tone: "danger",
  },
];

const telemetry = [
  { label: "Batterie", value: "12.6V" },
  { label: "Temp.", value: "82C" },
  { label: "OBD", value: "3 codes" },
  { label: "GPS", value: "Dakar" },
];

const queue = [
  { client: "Awa Diop", vehicle: "Toyota RAV4", status: "Assurance" },
  { client: "Garage Ndiaye", vehicle: "Sprinter 313", status: "Atelier" },
  { client: "M. Fall", vehicle: "Hyundai Tucson", status: "Vidange" },
];

function alertTone(tone: string) {
  if (tone === "danger") {
    return "border-[var(--color-danger)]/35 bg-[var(--color-danger)]/10 text-[var(--color-danger)]";
  }

  return "border-[var(--color-warn)]/35 bg-[var(--color-warn)]/10 text-[var(--color-warn)]";
}

export function GarageEcosystem() {
  return (
    <section id="ecosysteme" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,var(--color-accent),transparent)] opacity-60" />
      <div className="container-tight">
        <Reveal className="mb-14 max-w-4xl">
          <span className="mb-4 inline-block font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
            garage + client + IoT
          </span>
          <h2 className="text-balance text-[clamp(2.5rem,6.5vw,5.6rem)] font-black leading-[0.86] tracking-[-0.067em]">
            Le client ne demande plus des nouvelles. Il les voit.
          </h2>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-[var(--color-fg-muted)] md:text-lg">
            Le garage garde la main sur le planning, les dossiers et les relances.
            Le client accede a son compte personnel et suit en direct les signaux
            du capteur installe dans sa voiture.
          </p>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
          <Reveal className="panel relative overflow-hidden rounded-[30px] p-5 md:p-7">
            <div className="absolute -right-28 top-12 size-72 rounded-full bg-[var(--color-accent)]/14 blur-3xl" />
            <div className="relative rounded-[24px] border border-[var(--color-border)] bg-[#08080a] p-4">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.17em] text-[var(--color-fg-subtle)]">
                    cockpit garage
                  </div>
                  <h3 className="mt-2 text-2xl font-black tracking-[-0.045em]">
                    File clients active
                  </h3>
                </div>
                <span className="rounded-full border border-[var(--color-accent)]/35 bg-[var(--color-accent)]/12 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--color-accent)]">
                  live
                </span>
              </div>

              <div className="grid gap-3">
                {queue.map((item) => (
                  <motion.div
                    key={`${item.client}-${item.vehicle}`}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.25, ease: easings.signature }}
                    className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[16px] border border-[var(--color-border)] bg-white/[0.025] px-4 py-4"
                  >
                    <div>
                      <div className="text-sm font-bold">{item.client}</div>
                      <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
                        {item.vehicle}
                      </div>
                    </div>
                    <span className="rounded-lg bg-[var(--color-accent)]/12 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-accent)]">
                      {item.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative mt-4 grid gap-3 sm:grid-cols-3">
              {lifecycleAlerts.map((alert) => (
                <div key={alert.title} className={`rounded-[18px] border p-4 ${alertTone(alert.tone)}`}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.13em] opacity-80">
                    {alert.title}
                  </div>
                  <div className="mt-5 text-xl font-black tracking-[-0.04em] text-[var(--color-fg)]">
                    {alert.detail}
                  </div>
                  <p className="mt-3 text-xs leading-5 text-[var(--color-fg-muted)]">{alert.source}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08} className="panel relative min-h-[620px] overflow-hidden rounded-[30px] p-5 md:p-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(226,61,61,0.22),transparent_34%)]" />
            <div className="absolute inset-x-10 top-12 h-[78%] rounded-[34px] border border-[var(--color-border)] bg-[#070708] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
            <div className="absolute left-1/2 top-20 h-[72%] w-[min(76%,340px)] -translate-x-1/2 rounded-[38px] border border-[var(--color-border-strong)] bg-[#101012] p-4 shadow-[0_38px_100px_rgba(0,0,0,0.46)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                    compte client
                  </div>
                  <h3 className="mt-1 text-xl font-black tracking-[-0.045em]">Toyota Prado</h3>
                </div>
                <span className="size-2 rounded-full bg-[var(--color-success)] live-dot" />
              </div>

              <div className="rounded-[24px] border border-[var(--color-border)] bg-[#070708] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                    sante vehicule
                  </span>
                  <span className="font-mono text-[10px] text-[var(--color-accent)]">maintenant</span>
                </div>
                <div className="relative mx-auto grid size-40 place-items-center rounded-full border border-[var(--color-border)]">
                  <div className="absolute inset-4 rounded-full border-[12px] border-[var(--color-accent)]/20" />
                  <div className="absolute inset-4 rounded-full border-t-[12px] border-t-[var(--color-accent)]" />
                  <span className="tabular font-mono text-5xl font-black tracking-[-0.08em]">87</span>
                </div>
                <p className="mt-4 text-center text-sm leading-6 text-[var(--color-fg-muted)]">
                  Vehicule autorise a rouler. Vidange a planifier avant le prochain long trajet.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {telemetry.map((item) => (
                  <div key={item.label} className="rounded-[15px] border border-[var(--color-border)] bg-white/[0.025] p-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--color-fg-subtle)]">
                      {item.label}
                    </div>
                    <div className="tabular mt-2 font-mono text-xl font-black">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-[18px] border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent)]">
                  prochaine action
                </div>
                <div className="mt-2 text-sm font-bold">Confirmer la vidange cette semaine</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
