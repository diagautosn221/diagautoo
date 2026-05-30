import { NextResponse, type NextRequest } from "next/server";
import { EDGE_SESSION_COOKIE, readEdgeSession } from "@/lib/auth/edgeSession";

/**
 * Gate the private surfaces of DiagAutoSN.
 *
 * Rules:
 * - /carnet, /atelier, /admin require a valid session.
 * - /carnet: only role "client".
 * - /atelier: only role "atelier" or "admin".
 * - /admin: only role "admin".
 * - Unauthenticated visitors get redirected to /login with ?next=<path>.
 * - Authenticated visitors with the wrong role get bounced to their landing.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(EDGE_SESSION_COOKIE.name)?.value;
  const session = readEdgeSession(token);

  if (!session) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/carnet") && session.role !== "client") {
    const target = session.role === "atelier" ? "/atelier" : "/admin";
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (pathname.startsWith("/atelier") && session.role === "client") {
    return NextResponse.redirect(new URL("/carnet", request.url));
  }

  if (pathname.startsWith("/admin") && session.role !== "admin") {
    const target = session.role === "client" ? "/carnet" : "/atelier";
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/carnet/:path*", "/atelier/:path*", "/admin/:path*"],
};
