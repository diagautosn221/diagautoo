"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type LoginResult = {
  ok?: boolean;
  role?: "client" | "atelier" | "admin";
  fullName?: string;
  redirectTo?: string;
  error?: string;
};

export function LoginForm({ nextPath }: { nextPath: string | null }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = (await response.json()) as LoginResult;
      if (!response.ok || !result.ok) {
        setError(result.error || "Connexion impossible.");
        return;
      }
      const target = nextPath || result.redirectTo || "/";
      router.replace(target);
      router.refresh();
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-7 grid gap-3">
      <label className="grid gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
          Email
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field-surface rounded-[12px] px-4 py-3 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
          placeholder="vous@diagautosn.local"
        />
      </label>
      <label className="grid gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
          Mot de passe
        </span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field-surface rounded-[12px] px-4 py-3 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
          placeholder="••••••••"
        />
      </label>

      {error && (
        <div
          role="alert"
          className="rounded-[12px] border border-[var(--color-danger)]/35 bg-[var(--color-danger)]/8 px-3 py-2 text-sm text-[var(--color-danger)]"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-2 inline-flex min-h-12 items-center justify-center rounded-[12px] bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px disabled:opacity-60"
      >
        {busy ? "Connexion…" : "Entrer dans mon carnet"}
      </button>

      <a
        href="/#contact"
        className="mt-1 text-center text-xs text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)]"
      >
        Pas encore client ? Contacter DiagAutoSN
      </a>
    </form>
  );
}
