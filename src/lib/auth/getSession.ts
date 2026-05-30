import { cookies } from "next/headers";
import { decodeSession, SESSION_COOKIE, type Session } from "./session";

/**
 * Read the current session from the request cookies in a server component
 * or route handler. Returns null when the cookie is missing or invalid.
 */
export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE.name)?.value;
  return decodeSession(token);
}
