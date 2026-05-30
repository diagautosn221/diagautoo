/**
 * Lightweight session for DiagAutoSN.
 *
 * Strategy:
 * - Single httpOnly cookie "dauth" containing base64url(JSON).HMAC-SHA256.
 * - Signed with SESSION_SECRET (env) or a development fallback.
 * - 7-day sliding expiry.
 *
 * Production hardening (later): rotate the secret, encrypt the payload,
 * swap for iron-session or NextAuth. The shape stays the same.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "dauth";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const SECRET =
  process.env.SESSION_SECRET ||
  "dev-only-secret-rotate-me-before-prod-please-1f3a72c8";

export type SessionRole = "client" | "atelier" | "admin";

export type Session = {
  userId: string;
  role: SessionRole;
  fullName: string;
  email: string;
  /** Present only when role === "client". */
  clientId?: string;
  iat: number;
  exp: number;
};

function base64UrlEncode(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(input: string) {
  return Buffer.from(
    input.replace(/-/g, "+").replace(/_/g, "/") + "==".slice(0, (4 - (input.length % 4)) % 4),
    "base64"
  );
}

function sign(payload: string) {
  return base64UrlEncode(createHmac("sha256", SECRET).update(payload).digest());
}

export function encodeSession(seed: Omit<Session, "iat" | "exp">): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + MAX_AGE_SECONDS;
  const session: Session = { ...seed, iat, exp };
  const payload = base64UrlEncode(JSON.stringify(session));
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function decodeSession(token: string | undefined | null): Session | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const payload = parts[0];
  const signature = parts[1];
  if (!payload || !signature) return null;
  const expected = sign(payload);

  let signatureBuffer: Buffer;
  let expectedBuffer: Buffer;
  try {
    signatureBuffer = base64UrlDecode(signature);
    expectedBuffer = base64UrlDecode(expected);
  } catch {
    return null;
  }
  if (signatureBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  let session: Session;
  try {
    session = JSON.parse(base64UrlDecode(payload).toString("utf8")) as Session;
  } catch {
    return null;
  }
  if (typeof session.exp !== "number" || session.exp * 1000 < Date.now()) return null;
  return session;
}

export const SESSION_COOKIE = {
  name: COOKIE_NAME,
  maxAge: MAX_AGE_SECONDS,
};
