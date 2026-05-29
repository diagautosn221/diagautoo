"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import type { VehicleAiResult } from "@/lib/vehicle-ai";

type VehicleAiResponse = {
  result?: VehicleAiResult;
  error?: string;
};

const riskLabels: Record<VehicleAiResult["riskLevel"], string> = {
  faible: "Risque faible",
  surveillance: "A surveiller",
  urgent: "Priorite atelier",
};

export function VehicleAiAssistant() {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<VehicleAiResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    setFileName(file?.name || "");
    setPreview(null);

    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  }

  async function submitAnalysis(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/vehicle-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName,
          plate: String(form.get("plate") || ""),
          vin: String(form.get("vin") || ""),
          mileage: Number(form.get("mileage") || 0),
          notes: String(form.get("notes") || ""),
        }),
      });
      const payload = (await response.json()) as VehicleAiResponse;
      if (!response.ok || !payload.result) throw new Error(payload.error || "Analyse impossible");
      setResult(payload.result);
    } catch {
      setError("Analyse indisponible. Verifiez les infos puis relancez.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4 overflow-hidden rounded-[30px] border border-[var(--color-border)] bg-white shadow-[0_24px_90px_color-mix(in_srgb,var(--color-fg)_8%,transparent)] lg:grid-cols-[0.9fr_1.1fr]">
      <div className="relative min-h-[360px] bg-[var(--color-fg)] p-5 text-white md:p-7">
        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--color-accent)]" />
        <div className="flex min-h-full flex-col justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent-soft)]">Vehicle AI</p>
            <h2 className="mt-5 max-w-[11ch] text-4xl font-black leading-[0.9] tracking-[-0.055em] md:text-6xl">
              Identifier. Trier. Agir.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/68">
              Une aide rapide pour reconnaitre un vehicule, reperer les indices utiles et transformer une photo ou une description en action atelier.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[18px] border border-white/12 bg-white/12">
            {["photo", "plaque", "VIN"].map((item) => (
              <div key={item} className="bg-white/[0.035] p-3">
                <div className="h-1.5 w-7 rounded-full bg-[var(--color-accent)]" />
                <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-white/60">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 md:p-7">
        <form onSubmit={submitAnalysis} className="grid gap-4">
          <label className="grid min-h-[156px] cursor-pointer place-items-center rounded-[24px] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] p-4 text-center transition hover:border-[var(--color-accent)]">
            <input className="sr-only" type="file" accept="image/*" onChange={handleImage} />
            {preview ? (
              <img src={preview} alt="Apercu vehicule" className="h-32 w-full rounded-[18px] object-cover" />
            ) : (
              <span>
                <span className="block text-sm font-black">Ajouter une photo du vehicule</span>
                <span className="mt-2 block text-xs leading-5 text-[var(--color-fg-muted)]">Face, profil ou arriere. La photo reste locale dans ce prototype.</span>
              </span>
            )}
          </label>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">Plaque</span>
              <input name="plate" className="min-h-12 rounded-[12px] border border-[var(--color-border)] bg-white px-3 text-sm outline-none focus:border-[var(--color-accent)]" placeholder="DK 4582 AA" />
            </label>
            <label className="grid gap-2 sm:col-span-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">VIN</span>
              <input name="vin" className="min-h-12 rounded-[12px] border border-[var(--color-border)] bg-white px-3 text-sm uppercase outline-none focus:border-[var(--color-accent)]" placeholder="17 caracteres" />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-[0.42fr_0.58fr]">
            <label className="grid gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">Kilometrage</span>
              <input name="mileage" type="number" min="0" className="min-h-12 rounded-[12px] border border-[var(--color-border)] bg-white px-3 text-sm outline-none focus:border-[var(--color-accent)]" placeholder="124900" />
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">Indices visibles</span>
              <input name="notes" className="min-h-12 rounded-[12px] border border-[var(--color-border)] bg-white px-3 text-sm outline-none focus:border-[var(--color-accent)]" placeholder="Toyota Prado, fumee, vidange..." />
            </label>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-accent)] px-5 text-sm font-black text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Analyse en cours" : "Analyser le vehicule"}
          </button>
        </form>

        {error ? <div className="rounded-[16px] border border-[var(--color-danger)]/35 bg-[var(--color-danger)]/10 p-4 text-sm font-semibold text-[var(--color-danger)]">{error}</div> : null}

        {result ? (
          <section className="grid gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">Hypothese</p>
                <h3 className="mt-2 text-2xl font-black tracking-[-0.045em]">{result.likelyVehicle}</h3>
              </div>
              <div className="flex gap-2">
                <span className="rounded-full bg-[var(--color-fg)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white">{result.confidence}%</span>
                <span className="rounded-full bg-[var(--color-accent)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white">{riskLabels[result.riskLevel]}</span>
              </div>
            </div>

            <div className="grid gap-2">
              {result.observations.slice(0, 4).map((item) => (
                <p key={item} className="text-sm leading-6 text-[var(--color-fg-muted)]">{item}</p>
              ))}
            </div>

            <div className="grid gap-2 border-t border-[var(--color-border)] pt-4">
              <p className="text-sm font-black">Prochaine action</p>
              <p className="text-sm leading-6 text-[var(--color-fg-muted)]">{result.recommendedNextStep}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {result.serviceTags.map((tag) => (
                <span key={tag} className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">
                  {tag}
                </span>
              ))}
            </div>

            <details className="group rounded-[18px] border border-[var(--color-border)] bg-white p-4">
              <summary className="cursor-pointer text-sm font-black">Checklist atelier</summary>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--color-fg-muted)]">
                {result.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
            <p className="text-xs leading-5 text-[var(--color-fg-subtle)]">{result.disclaimer}</p>
          </section>
        ) : null}
      </div>
    </div>
  );
}
