"use client";

import { type FormEvent, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

type ClientRow = {
  id: string;
  fullName: string;
  city: string | null;
  phone: string | null;
  vehicles: number;
  openAlerts: number;
  avgHealth: number;
};

type InstallationRow = {
  id: string;
  summary: string;
  entityId: string;
  createdAt: string;
};

type InstallationResult = {
  client: { id: string; fullName: string };
  vehicle: { id: string; brand: string; model: string; plate: string };
  device: { id: string; serial: string };
  user: { id: string; email: string; issuedPassword: string };
};

type Props = {
  clients: ClientRow[];
  initialInstallations: InstallationRow[];
};

type ClientMode = "existing" | "new";
type VehicleMode = "existing" | "new";

function displayInstallText(value: string) {
  return value.replace(/\bQA Backend\b/gi, "Client test").replace(/\bbackend\b/gi, "test");
}

export function InstallationConsole({ clients, initialInstallations }: Props) {
  const [clientMode, setClientMode] = useState<ClientMode>(clients.length > 0 ? "existing" : "new");
  const [vehicleMode, setVehicleMode] = useState<VehicleMode>("new");
  const [selectedClient, setSelectedClient] = useState<string>(clients[0]?.id ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InstallationResult | null>(null);
  const [recent, setRecent] = useState<InstallationRow[]>(initialInstallations);
  const [copied, setCopied] = useState<"email" | "password" | null>(null);

  const sortedClients = useMemo(
    () =>
      [...clients]
        .map((client) => ({ ...client, fullName: displayInstallText(client.fullName) }))
        .sort((a, b) => a.fullName.localeCompare(b.fullName)),
    [clients]
  );

  function reset() {
    setResult(null);
    setError(null);
    setCopied(null);
  }

  async function copy(value: string, kind: "email" | "password") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      setTimeout(() => setCopied((c) => (c === kind ? null : c)), 1600);
    } catch {
      /* clipboard denied — silent */
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);

    const form = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {
      dongleSerial: String(form.get("dongleSerial") || ""),
      technicianNote: String(form.get("technicianNote") || ""),
    };

    if (clientMode === "existing") {
      payload.clientId = selectedClient;
    } else {
      payload.newClient = {
        fullName: String(form.get("clientName") || ""),
        email: String(form.get("clientEmail") || ""),
        phone: String(form.get("clientPhone") || ""),
        city: String(form.get("clientCity") || ""),
      };
    }

    if (vehicleMode === "existing") {
      payload.vehicleId = String(form.get("vehicleId") || "");
    } else {
      payload.newVehicle = {
        brand: String(form.get("vehicleBrand") || ""),
        model: String(form.get("vehicleModel") || ""),
        plate: String(form.get("vehiclePlate") || ""),
        vin: String(form.get("vehicleVin") || ""),
        mileage: Number(form.get("vehicleMileage") || 0),
      };
    }

    try {
      const response = await fetch("/api/atelier/installations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as { ok?: boolean; result?: InstallationResult; error?: string };
      if (!response.ok || !body.ok || !body.result) {
        throw new Error(body.error || "Installation refusée.");
      }
      setResult({
        ...body.result,
        client: {
          ...body.result.client,
          fullName: displayInstallText(body.result.client.fullName),
        },
      });
      // refresh recent list
      const fresh = await fetch("/api/atelier/installations", { cache: "no-store" });
      if (fresh.ok) {
        const list = (await fresh.json()) as { installations?: InstallationRow[] };
        setRecent(list.installations ?? []);
      }
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      {/* LEFT — main form */}
      <section className="panel rounded-[22px] p-6 md:p-7">
        <form onSubmit={onSubmit} className="grid gap-6">
          {/* Client block */}
          <fieldset className="grid gap-3">
            <legend className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
              Client
            </legend>
            <div className="flex flex-wrap gap-2">
              <ModeChip
                active={clientMode === "existing"}
                disabled={clients.length === 0}
                onClick={() => setClientMode("existing")}
              >
                Client existant
              </ModeChip>
              <ModeChip active={clientMode === "new"} onClick={() => setClientMode("new")}>
                Nouveau client
              </ModeChip>
            </div>

            {clientMode === "existing" ? (
              <label className="grid gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                  Sélectionner
                </span>
                <select
                  required
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="field-surface rounded-[10px] px-3 py-2.5 text-sm text-[var(--color-fg)]"
                >
                  {sortedClients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} · {c.city ?? "—"} · {c.vehicles} véhicule{c.vehicles > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <Field name="clientName" label="Nom complet" placeholder="Mamadou Diop" required />
                <Field name="clientPhone" label="Téléphone" placeholder="+221 77 …" required />
                <Field name="clientEmail" label="Email (optionnel)" placeholder="auto-généré si vide" type="email" />
                <Field name="clientCity" label="Ville" placeholder="Dakar" />
              </div>
            )}
          </fieldset>

          {/* Vehicle block */}
          <fieldset className="grid gap-3">
            <legend className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
              Véhicule
            </legend>
            <div className="flex flex-wrap gap-2">
              <ModeChip
                active={vehicleMode === "existing"}
                disabled={clientMode === "new"}
                onClick={() => setVehicleMode("existing")}
              >
                Véhicule existant
              </ModeChip>
              <ModeChip active={vehicleMode === "new"} onClick={() => setVehicleMode("new")}>
                Nouveau véhicule
              </ModeChip>
            </div>

            {vehicleMode === "existing" && clientMode === "existing" ? (
              <label className="grid gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                  ID véhicule
                </span>
                <input
                  name="vehicleId"
                  required
                  placeholder="v-001"
                  className="field-surface rounded-[10px] px-3 py-2.5 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)]"
                />
                <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">
                  Si vous ne connaissez pas l'ID, utilisez « nouveau véhicule ».
                </span>
              </label>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <Field name="vehicleBrand" label="Marque" placeholder="Toyota" required />
                <Field name="vehicleModel" label="Modèle" placeholder="Prado" required />
                <Field name="vehiclePlate" label="Plaque" placeholder="DK 4582 AA" required />
                <Field name="vehicleVin" label="VIN (optionnel)" placeholder="JTEBU3FJ…" />
                <Field name="vehicleMileage" label="Kilométrage" placeholder="124800" type="number" />
              </div>
            )}
          </fieldset>

          {/* Kit block */}
          <fieldset className="grid gap-3">
            <legend className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
              Boîtier connecté
            </legend>
            <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
              <Field
                name="dongleSerial"
                label="Numéro du boîtier"
                placeholder="DASN-0421"
                required
              />
              <Field
                name="technicianNote"
                label="Note atelier (optionnel)"
                placeholder="Pose sous tableau de bord, client briefé"
              />
            </div>
            <p className="rounded-[12px] border border-[var(--color-border)] bg-white/75 px-3 py-2 text-xs leading-5 text-[var(--color-fg-muted)]">
              Ce numéro reste côté atelier. Le client voit seulement que sa voiture est connectée
              et que son carnet personnel est prêt.
            </p>
          </fieldset>

          {error && (
            <div
              role="alert"
              className="rounded-[12px] border border-[var(--color-danger)]/35 bg-[var(--color-danger)]/10 px-3 py-2 text-sm text-[var(--color-danger)]"
            >
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t border-[var(--color-border)] pt-5">
            <button
              type="submit"
              disabled={busy}
              className="inline-flex min-h-12 items-center justify-center rounded-[12px] bg-[var(--color-accent)] px-6 text-sm font-semibold text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent-soft)] active:translate-y-px disabled:opacity-60"
            >
              {busy ? "Connexion en cours…" : "Connecter le boîtier · ouvrir le carnet"}
            </button>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
              Compte client + voiture connectée + premières alertes prêtes
            </p>
          </div>
        </form>

        {/* Result card */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45 }}
              className="mt-7 rounded-[20px] border border-[var(--color-success)]/35 bg-[var(--color-success)]/8 p-5"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-success)]">
                Carnet ouvert · accès prêts à remettre au client (affichés une seule fois)
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.02em]">
                {result.client.fullName} · {result.vehicle.brand} {result.vehicle.model} ({result.vehicle.plate})
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <CopyRow
                  label="Email du compte"
                  value={result.user.email}
                  onCopy={() => copy(result.user.email, "email")}
                  copied={copied === "email"}
                />
                <CopyRow
                  label="Mot de passe (affiché 1 fois)"
                  value={result.user.issuedPassword}
                  onCopy={() => copy(result.user.issuedPassword, "password")}
                  copied={copied === "password"}
                  highlight
                />
              </div>
              <div className="mt-4 grid gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                <span>Boîtier connecté · {result.device.serial}</span>
                <span>Véhicule · {result.vehicle.id}</span>
                <span>Client · {result.client.id}</span>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href={`/atelier/clients/${result.client.id}`}
                  className="inline-flex min-h-10 items-center justify-center rounded-[10px] border border-[var(--color-fg)] bg-[var(--color-fg)] px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white transition hover:bg-[var(--color-fg-muted)]"
                >
                  Voir le carnet de ce client
                </Link>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex min-h-10 items-center justify-center rounded-[10px] border border-[var(--color-border)] bg-white px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  Installer un autre boîtier
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* RIGHT — recent installations */}
      <aside className="panel rounded-[22px] p-6 md:p-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
          Installations récentes
        </p>
        <h3 className="mt-1.5 font-display text-lg font-semibold tracking-[-0.02em]">
          {recent.length} installation{recent.length > 1 ? "s" : ""} enregistrée{recent.length > 1 ? "s" : ""}
        </h3>
        <ul className="mt-5 space-y-2">
          {recent.length === 0 && (
            <li className="text-sm text-[var(--color-fg-muted)]">
              Aucune installation enregistrée. Connectez un boîtier pour ouvrir le carnet client.
            </li>
          )}
          {recent.map((row) => (
            <li key={row.id} className="hairline-card rounded-[12px] p-3">
              <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                <span>{row.entityId}</span>
                <span>{row.createdAt.replace("T", " ").slice(0, 16)}</span>
              </div>
              <p className="mt-1 text-sm leading-snug text-[var(--color-fg)]">{displayInstallText(row.summary)}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
          Les mots de passe ne sont jamais conservés dans l'historique.
        </p>
      </aside>
    </div>
  );
}

function Field({
  name,
  label,
  placeholder,
  required,
  type = "text",
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="field-surface rounded-[10px] px-3 py-2.5 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)]"
      />
    </label>
  );
}

function ModeChip({
  active,
  disabled,
  children,
  onClick,
}: {
  active: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition disabled:opacity-50 ${
        active
          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8 text-[var(--color-accent)]"
          : "border-[var(--color-border)] bg-white text-[var(--color-fg-muted)] hover:border-[var(--color-fg-muted)]"
      }`}
    >
      {children}
    </button>
  );
}

function CopyRow({
  label,
  value,
  onCopy,
  copied,
  highlight,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[14px] border p-3 transition ${
        highlight
          ? "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5"
          : "border-[var(--color-border)] bg-white"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
        {label}
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <code className="truncate font-mono text-sm font-semibold text-[var(--color-fg)]">{value}</code>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[var(--color-border)] bg-white px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          {copied ? "✓ copié" : "copier"}
        </button>
      </div>
    </div>
  );
}
