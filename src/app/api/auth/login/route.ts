import { NextResponse } from "next/server";
import { findUserByEmailFromDb } from "@/lib/db/diagauto";
import { verifyPassword } from "@/lib/auth/password";
import { encodeSession, SESSION_COOKIE, type SessionRole } from "@/lib/auth/session";
import { clientKey, rateLimit } from "@/lib/security/rateLimit";
import { loginPayloadSchema } from "@/lib/validation/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 5 attempts per 5 minutes per client IP. Successful login refunds.
const limiter = rateLimit({ capacity: 5, refillSeconds: 300 });

function scopeToRole(scope: string): SessionRole | null {
  if (scope === "client") return "client";
  if (scope === "garage") return "atelier";
  if (scope === "admin") return "admin";
  return null;
}

export async function POST(request: Request) {
  const key = clientKey(request);
  const limited = limiter.consume(key);
  if (!limited.ok) {
    return NextResponse.json(
      {
        error: `Trop de tentatives. Réessayez dans ${limited.retryAfterSeconds}s.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSeconds) },
      }
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = loginPayloadSchema.parse(raw);
  if (!parsed.ok) {
    return NextResponse.json(
      { error: "Email et mot de passe sont requis.", fieldErrors: parsed.errors },
      { status: 400 }
    );
  }

  const user = findUserByEmailFromDb(parsed.value.email);
  // Same error for missing user and bad password (anti-enumeration). Always
  // runs verifyPassword to keep response timing similar.
  const passwordOk =
    user !== null ? verifyPassword(parsed.value.password, user.password_hash) : false;

  if (!user || !passwordOk) {
    return NextResponse.json(
      { error: "Identifiants incorrects." },
      { status: 401 }
    );
  }

  const role = scopeToRole(user.scope);
  if (!role) {
    return NextResponse.json(
      { error: "Rôle utilisateur non reconnu." },
      { status: 500 }
    );
  }

  // Successful auth — refund the bucket so the next legitimate login
  // from the same IP is not delayed.
  limiter.refund(key);

  const token = encodeSession({
    userId: user.id,
    role,
    fullName: user.full_name,
    email: user.email,
    clientId: user.client_id ?? undefined,
  });

  const redirectTo =
    role === "client" ? "/carnet" : role === "atelier" ? "/atelier" : "/admin";

  const response = NextResponse.json({
    ok: true,
    role,
    fullName: user.full_name,
    redirectTo,
  });
  response.cookies.set(SESSION_COOKIE.name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE.maxAge,
  });
  return response;
}
