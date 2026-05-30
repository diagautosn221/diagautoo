const COOKIE_NAME = "dauth";

type EdgeSession = {
  userId?: string;
  role?: "client" | "atelier" | "admin";
  clientId?: string;
  exp?: number;
};

function base64UrlDecode(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
}

export function readEdgeSession(token: string | undefined | null): EdgeSession | null {
  if (!token) return null;
  const payload = token.split(".")[0];
  if (!payload) return null;

  try {
    const session = JSON.parse(base64UrlDecode(payload)) as EdgeSession;
    if (!session.role || !session.userId) return null;
    if (typeof session.exp !== "number" || session.exp * 1000 < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export const EDGE_SESSION_COOKIE = {
  name: COOKIE_NAME,
};
