/**
 * Zero-dependency input validation. Modelled after Zod's surface area but
 * stripped to what we need today: object schemas with per-field validators
 * that produce both a typed value and a per-field error map.
 *
 * Why not Zod: 60 KB compressed of dependency just to validate two route
 * payloads is wasted bytes. When a third payload appears, revisit.
 */

export type FieldResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export type FieldDef<T> = {
  parse: (raw: unknown) => FieldResult<T>;
};

export type SchemaShape = Record<string, FieldDef<unknown>>;

export type SchemaValue<S extends SchemaShape> = {
  [K in keyof S]: S[K] extends FieldDef<infer T> ? T : never;
};

export type ParseResult<S extends SchemaShape> =
  | { ok: true; value: SchemaValue<S> }
  | { ok: false; errors: Partial<Record<keyof S, string>> };

export type Schema<S extends SchemaShape> = {
  parse: (raw: unknown) => ParseResult<S>;
};

export function schema<S extends SchemaShape>(shape: S): Schema<S> {
  const keys = Object.keys(shape) as Array<keyof S>;
  return {
    parse(raw) {
      if (!raw || typeof raw !== "object") {
        const errors: Partial<Record<keyof S, string>> = {};
        for (const k of keys) errors[k] = "Champ requis.";
        return { ok: false, errors };
      }
      const source = raw as Record<string, unknown>;
      const value = {} as SchemaValue<S>;
      const errors: Partial<Record<keyof S, string>> = {};
      for (const k of keys) {
        const def = shape[k] as FieldDef<unknown>;
        const result = def.parse(source[k as string]);
        if (result.ok) {
          (value as Record<string, unknown>)[k as string] = result.value;
        } else {
          errors[k] = result.error;
        }
      }
      if (Object.keys(errors).length > 0) return { ok: false, errors };
      return { ok: true, value };
    },
  };
}

/* ── String ───────────────────────────────────────────────────────────── */

type StringOpts = {
  min?: number;
  max?: number;
  trim?: boolean;
  optional?: boolean;
  default?: string;
  email?: boolean;
  pattern?: RegExp;
  patternError?: string;
};

export function fieldString(opts: StringOpts = {}): FieldDef<string> {
  const { trim = true, optional = false, email = false } = opts;
  return {
    parse(raw) {
      if (raw === undefined || raw === null || raw === "") {
        if (opts.default !== undefined) return { ok: true, value: opts.default };
        if (optional) return { ok: true, value: "" };
        return { ok: false, error: "Champ requis." };
      }
      if (typeof raw !== "string") return { ok: false, error: "Type invalide." };
      const value = trim ? raw.trim() : raw;
      if (opts.min !== undefined && value.length < opts.min) {
        return { ok: false, error: `Min ${opts.min} caractères.` };
      }
      if (opts.max !== undefined && value.length > opts.max) {
        return { ok: false, error: `Max ${opts.max} caractères.` };
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return { ok: false, error: "Email invalide." };
      }
      if (opts.pattern && !opts.pattern.test(value)) {
        return { ok: false, error: opts.patternError ?? "Format invalide." };
      }
      return { ok: true, value };
    },
  };
}

/* ── Number ───────────────────────────────────────────────────────────── */

type NumberOpts = {
  min?: number;
  max?: number;
  int?: boolean;
  optional?: boolean;
  default?: number;
};

export function fieldNumber(opts: NumberOpts = {}): FieldDef<number> {
  return {
    parse(raw) {
      if (raw === undefined || raw === null || raw === "") {
        if (opts.default !== undefined) return { ok: true, value: opts.default };
        if (opts.optional) return { ok: true, value: 0 };
        return { ok: false, error: "Champ requis." };
      }
      const num = typeof raw === "number" ? raw : Number(raw);
      if (!Number.isFinite(num)) return { ok: false, error: "Nombre invalide." };
      if (opts.int && !Number.isInteger(num)) return { ok: false, error: "Entier requis." };
      if (opts.min !== undefined && num < opts.min) {
        return { ok: false, error: `Min ${opts.min}.` };
      }
      if (opts.max !== undefined && num > opts.max) {
        return { ok: false, error: `Max ${opts.max}.` };
      }
      return { ok: true, value: num };
    },
  };
}

/* ── Object (nested) ──────────────────────────────────────────────────── */

export function fieldObject<S extends SchemaShape>(
  inner: Schema<S>,
  opts: { optional?: boolean } = {}
): FieldDef<SchemaValue<S> | null> {
  return {
    parse(raw) {
      if (raw === undefined || raw === null) {
        if (opts.optional) return { ok: true, value: null };
        return { ok: false, error: "Objet requis." };
      }
      const result = inner.parse(raw);
      if (!result.ok) {
        const firstField = Object.keys(result.errors)[0];
        const firstError = firstField ? result.errors[firstField as keyof S] : undefined;
        return { ok: false, error: firstError ?? "Champ invalide." };
      }
      return { ok: true, value: result.value };
    },
  };
}
