"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { easings } from "@/lib/motion/easings";

const metrics = [
  { value: "147", label: "capteurs actifs" },
  { value: "214", label: "vehicules suivis" },
  { value: "5", label: "ordres ouverts" },
];

const alerts = [
  { code: "P0420", label: "Rendement catalyseur", state: "atelier" },
  { code: "U0121", label: "Communication ABS", state: "surveiller" },
  { code: "VID", label: "Vidange dans 1 200 km", state: "a planifier" },
];

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden pt-28 pb-20 md:pt-36">
      <div className="pointer-events-none absolute -left-10 top-24 hidden text-[11vw] font-black leading-none tracking-[-0.08em] hero-wordmark lg:block">
        DIAGAUTO
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(to_top,var(--color-bg),transparent)]" />

      <div className="container-tight relative">
        <div className="grid min-h-[calc(100dvh-9rem)] items-center gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easings.signature }}
              className="mb-7 flex w-fit items-center gap-3 rounded-full border border-[var(--color-border)] bg-[#101012]/78 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              <span className="size-1.5 rounded-full bg-[var(--color-success)] live-dot" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
                Dakar - atelier connecte - capteur embarque
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, ease: easings.signature, delay: 0.08 }}
              className="max-w-[12.8ch] text-balance text-[clamp(2.85rem,7.8vw,6.7rem)] font-black leading-[0.9] tracking-[-0.068em] md:leading-[0.86]"
            >
              Le poste de commande pour garage connecte.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.68, ease: easings.signature, delay: 0.2 }}
              className="mt-8 max-w-[59ch] text-pretty text-base leading-8 text-[var(--color-fg-muted)] md:text-lg"
            >
              DiagAutoSN doit fonctionner comme un outil de travail: clients,
              vehicules, diagnostics, alertes legales, relances, capteurs IoT et
              ordres atelier dans un cockpit visible des la premiere minute.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.66, ease: easings.signature, delay: 0.32 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="#console"
                className="group inline-flex min-h-12 items-center justify-center overflow-hidden rounded-[14px] bg-[var(--color-accent)] px-6 font-semibold text-[var(--color-accent-ink)] transition duration-200 hover:bg-[var(--color-accent-soft)] active:translate-y-px"
              >
                <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
                  Ouvrir le cockpit
                </span>
              </Link>
              <Link
                href="#ecosysteme"
                className="inline-flex min-h-12 items-center justify-center rounded-[14px] border border-[var(--color-border-strong)] bg-[#101012]/70 px-6 font-semibold text-[var(--color-fg)] transition duration-200 hover:border-[var(--color-accent)] hover:bg-white/[0.04] active:translate-y-px"
              >
                Voir le portail client
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.46 }}
              className="mt-12 grid max-w-xl grid-cols-3 overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[#101012]/72"
            >
              {metrics.map((metric) => (
                <div key={metric.label} className="border-r border-[var(--color-border)] px-4 py-4 last:border-r-0">
                  <div className="tabular font-mono text-xl font-bold tracking-tight text-[var(--color-fg)] sm:text-2xl">
                    {metric.value}
                  </div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                    {metric.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, ease: easings.signature, delay: 0.14 }}
            className="relative min-h-[520px] lg:min-h-[640px]"
          >
            <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_50%_36%,rgba(226,61,61,0.25),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.015))] opacity-90" />
            <div className="absolute inset-x-8 bottom-10 top-16 overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-[#08080a] shadow-[0_35px_90px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(226,61,61,0.22),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent)]" />
              <div className="road-flow absolute left-1/2 top-8 h-[88%] w-px bg-[linear-gradient(to_bottom,transparent,var(--color-accent),transparent)]" />
              <div className="road-flow absolute left-[34%] top-10 h-[82%] w-px bg-[linear-gradient(to_bottom,transparent,rgba(248,242,242,0.24),transparent)] [animation-delay:600ms]" />
              <div className="road-flow absolute right-[34%] top-10 h-[82%] w-px bg-[linear-gradient(to_bottom,transparent,rgba(248,242,242,0.24),transparent)] [animation-delay:1200ms]" />

              <div className="absolute left-1/2 top-[42%] h-[24%] w-[78%] -translate-x-1/2 rounded-[48%_48%_18%_18%] border border-[var(--color-accent)]/40 bg-[linear-gradient(180deg,rgba(226,61,61,0.26),rgba(226,61,61,0.08))] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]" />
              <div className="absolute left-[26%] top-[34%] h-[19%] w-[25%] skew-x-[-18deg] rounded-tl-[2rem] border border-[var(--color-accent)]/28 bg-[#08080a]/78" />
              <div className="absolute right-[26%] top-[34%] h-[19%] w-[25%] skew-x-[18deg] rounded-tr-[2rem] border border-[var(--color-accent)]/28 bg-[#08080a]/78" />
              <div className="absolute bottom-[26%] left-[24%] size-16 rounded-full border-[13px] border-[#050506] bg-[var(--color-border-strong)] shadow-[0_0_0_1px_rgba(226,61,61,0.25)]" />
              <div className="absolute bottom-[26%] right-[24%] size-16 rounded-full border-[13px] border-[#050506] bg-[var(--color-border-strong)] shadow-[0_0_0_1px_rgba(226,61,61,0.25)]" />
              <div className="scan-line absolute left-[10%] right-[10%] top-20 h-16 rounded-full bg-[linear-gradient(to_bottom,transparent,rgba(226,61,61,0.55),transparent)] blur-[1px]" />
            </div>

            <div className="float-panel absolute right-0 top-7 w-[235px] rounded-[20px] border border-[var(--color-border)] bg-[#111113]/90 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.42)] backdrop-blur-md max-sm:right-3 max-sm:w-[210px]">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                  client live
                </span>
                <span className="rounded-md bg-[var(--color-success)]/14 px-2 py-1 font-mono text-[10px] text-[var(--color-success)]">
                  route ok
                </span>
              </div>
              <div className="relative mx-auto mb-3 grid size-28 place-items-center rounded-full border border-[var(--color-border)] bg-[#09090b]">
                <div className="absolute inset-3 rounded-full border-4 border-[var(--color-accent)]/25" />
                <div className="gauge-sweep absolute bottom-5 h-12 w-1 rounded-full bg-[var(--color-accent)]" />
                <span className="tabular font-mono text-3xl font-black">87</span>
              </div>
              <p className="text-center text-xs leading-5 text-[var(--color-fg-muted)]">
                score visible dans le compte personnel
              </p>
            </div>

            <div className="absolute bottom-0 left-0 w-[min(92%,430px)] rounded-[22px] border border-[var(--color-border)] bg-[#111113]/94 p-4 shadow-[0_28px_80px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                  scan IoT - Toyota Prado
                </span>
                <span className="font-mono text-[10px] text-[var(--color-accent)]">14:32</span>
              </div>
              <div className="grid gap-2.5">
                {alerts.map((alert) => (
                  <div
                    key={alert.code}
                    className="grid grid-cols-[4.6rem_1fr_auto] items-center gap-3 rounded-[12px] border border-[var(--color-border)] bg-white/[0.025] px-3 py-3"
                  >
                    <span className="font-mono text-sm font-black text-[var(--color-accent)]">{alert.code}</span>
                    <span className="truncate text-sm text-[var(--color-fg-muted)]">{alert.label}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
                      {alert.state}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
