/**
 * Password hashing for DiagAutoSN.
 *
 * Strategy: PBKDF2-SHA512, 100 000 iterations, 32-byte salt, 64-byte derived
 * key. Format stored in the database:
 *
 *     pbkdf2$sha512$100000$<salt-b64>$<hash-b64>
 *
 * Why PBKDF2 over bcrypt/argon2:
 *   - Native to node:crypto. Zero new npm dependencies.
 *   - No native build step → works cleanly on Windows / WSL / mac / Linux.
 *   - Iteration count tunable per environment via PBKDF2_ITERATIONS env var.
 *
 * When the team adopts argon2id, swap the helpers below: the on-disk shape
 * is namespaced ("pbkdf2$…") so verifyPassword can dispatch by prefix and
 * support both formats during rotation.
 */

import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

const ALGO = "sha512";
const ITERATIONS = Number(process.env.PBKDF2_ITERATIONS ?? 100_000);
const SALT_BYTES = 32;
const KEY_BYTES = 64;

export function hashPassword(plain: string): string {
  if (!plain || typeof plain !== "string") {
    throw new Error("hashPassword: empty input");
  }
  const salt = randomBytes(SALT_BYTES);
  const derived = pbkdf2Sync(plain, salt, ITERATIONS, KEY_BYTES, ALGO);
  return `pbkdf2$${ALGO}$${ITERATIONS}$${salt.toString("base64")}$${derived.toString("base64")}`;
}

export function verifyPassword(plain: string, stored: string | null | undefined): boolean {
  if (!plain || !stored) return false;
  const parts = stored.split("$");
  if (parts.length !== 5) return false;
  const [scheme, algo, iterationsStr, saltB64, hashB64] = parts;
  if (scheme !== "pbkdf2") return false;
  if (algo !== ALGO) return false;
  if (!iterationsStr || !saltB64 || !hashB64) return false;

  const iterations = Number(iterationsStr);
  if (!Number.isFinite(iterations) || iterations < 1000) return false;

  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = Buffer.from(saltB64, "base64");
    expected = Buffer.from(hashB64, "base64");
  } catch {
    return false;
  }
  if (expected.length === 0) return false;

  const derived = pbkdf2Sync(plain, salt, iterations, expected.length, algo);
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

/**
 * Generate a random human-typeable password for issued accounts.
 * 12 characters, alphabet that avoids visually-ambiguous glyphs.
 */
export function generateIssuedPassword(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const len = 12;
  const buf = randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) {
    const byte = buf[i];
    if (byte === undefined) continue;
    out += alphabet.charAt(byte % alphabet.length);
  }
  return out;
}
