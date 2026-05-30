#!/usr/bin/env node
/**
 * scripts/smoke.mjs — end-to-end sanity check for DiagAutoSN.
 *
 * Hits the running dev server and verifies the critical user-facing
 * invariants:
 *   1. /                              → 200, contains marketing tagline
 *   2. /login                         → 200, form rendered
 *   3. /api/carnet/dashboard (no auth)→ 401 redirect via middleware
 *   4. /api/auth/login (bad creds)    → 401, same error string
 *   5. /api/auth/login (good creds)   → 200, sets dauth cookie
 *   6. /api/carnet/dashboard (auth)   → 200, dashboards present
 *   7. Rate limiter                   → 6th bad login in <5min → 429
 *
 * Usage:
 *   node scripts/smoke.mjs            # default http://localhost:3000
 *   node scripts/smoke.mjs http://localhost:3001
 *
 * Exits non-zero on first failure. Prints a green ✓ for each pass.
 */

const BASE = (process.argv[2] || process.env.SMOKE_BASE || "http://localhost:3000").replace(/\/$/, "");
const CLIENT_EMAIL = process.env.SMOKE_CLIENT_EMAIL || "awa.diop@diagautosn.local";
const PASSWORD = process.env.SMOKE_PASSWORD || "diagauto";

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

let passed = 0;
let failed = 0;

function ok(label) {
  passed++;
  console.log(`${GREEN}✓${RESET} ${label}`);
}

function ko(label, details) {
  failed++;
  console.log(`${RED}✗${RESET} ${label}`);
  if (details) console.log(`  ${DIM}${details}${RESET}`);
}

function extractCookie(setCookie, name) {
  if (!setCookie) return null;
  const headers = Array.isArray(setCookie) ? setCookie : [setCookie];
  for (const raw of headers) {
    const first = raw.split(";")[0];
    if (first.startsWith(`${name}=`)) return first.slice(name.length + 1);
  }
  return null;
}

async function request(path, init = {}) {
  const response = await fetch(`${BASE}${path}`, {
    redirect: "manual",
    ...init,
    headers: {
      "User-Agent": "diagauto-smoke/1.0",
      ...(init.headers || {}),
    },
  });
  const setCookie = response.headers.getSetCookie?.() ?? response.headers.get("set-cookie");
  let body = "";
  try {
    body = await response.text();
  } catch {
    /* binary or empty */
  }
  return { status: response.status, body, setCookie, headers: response.headers };
}

async function main() {
  console.log(`${DIM}smoke target: ${BASE}${RESET}\n`);

  // ── 1. Public marketing ────────────────────────────────────────────
  try {
    const r = await request("/");
    if (r.status !== 200) ko("GET / returns 200", `status ${r.status}`);
    else if (!/qui va plus loin|DiagAutoSN/i.test(r.body)) ko("GET / contains brand text");
    else ok("GET / returns 200 and brand text");
  } catch (e) {
    ko("GET /", e.message);
  }

  // ── 2. Login page ──────────────────────────────────────────────────
  try {
    const r = await request("/login");
    if (r.status !== 200) ko("GET /login returns 200", `status ${r.status}`);
    else ok("GET /login returns 200");
  } catch (e) {
    ko("GET /login", e.message);
  }

  // ── 3. /api/carnet/dashboard without session → 401 ─────────────────
  try {
    const r = await request("/api/carnet/dashboard");
    if (r.status !== 401) ko("GET /api/carnet/dashboard rejects unauthenticated", `status ${r.status}`);
    else ok("GET /api/carnet/dashboard → 401 without session");
  } catch (e) {
    ko("GET /api/carnet/dashboard", e.message);
  }

  // ── 4. Login with bad credentials → 401 ────────────────────────────
  try {
    const r = await request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: CLIENT_EMAIL, password: "definitely-wrong" }),
    });
    if (r.status !== 401) ko("POST /api/auth/login bad password → 401", `status ${r.status}`);
    else ok("POST /api/auth/login bad password → 401");
  } catch (e) {
    ko("POST /api/auth/login bad password", e.message);
  }

  // ── 5. Login with good credentials → 200 + cookie ──────────────────
  let sessionCookie = null;
  try {
    const r = await request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: CLIENT_EMAIL, password: PASSWORD }),
    });
    if (r.status !== 200) {
      ko("POST /api/auth/login good password → 200", `status ${r.status} body ${r.body.slice(0, 200)}`);
    } else {
      sessionCookie = extractCookie(r.setCookie, "dauth");
      if (!sessionCookie) ko("Login sets dauth cookie");
      else ok("POST /api/auth/login good password → 200 + dauth cookie");
    }
  } catch (e) {
    ko("POST /api/auth/login good password", e.message);
  }

  // ── 6. /api/carnet/dashboard with session → 200 + dashboards ──────
  if (sessionCookie) {
    try {
      const r = await request("/api/carnet/dashboard", {
        headers: { Cookie: `dauth=${sessionCookie}` },
      });
      if (r.status !== 200) {
        ko("GET /api/carnet/dashboard with session → 200", `status ${r.status}`);
      } else {
        const body = JSON.parse(r.body);
        if (!Array.isArray(body.dashboards) || body.dashboards.length === 0) {
          ko("Dashboard response has dashboards array", `body ${r.body.slice(0, 200)}`);
        } else {
          ok(`GET /api/carnet/dashboard with session → 200 (${body.dashboards.length} véhicule(s))`);
        }
      }
    } catch (e) {
      ko("GET /api/carnet/dashboard with session", e.message);
    }
  } else {
    ko("GET /api/carnet/dashboard with session", "skipped — login failed");
  }

  // ── 7. Rate limit: 6th bad attempt within 5 min should 429 ─────────
  // Use a never-existing email so we don't accidentally rate-limit the
  // valid demo account.
  try {
    let saw429 = false;
    let lastStatus = 0;
    for (let i = 0; i < 8; i++) {
      const r = await request("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "ratelimit.probe@diagautosn.local", password: "nope" }),
      });
      lastStatus = r.status;
      if (r.status === 429) {
        saw429 = true;
        break;
      }
    }
    if (saw429) ok("Rate limiter trips after burst → 429");
    else ko("Rate limiter trips after burst → 429", `last status ${lastStatus}`);
  } catch (e) {
    ko("Rate limit probe", e.message);
  }

  console.log();
  if (failed === 0) {
    console.log(`${GREEN}${passed} checks passed${RESET}`);
    process.exit(0);
  } else {
    console.log(`${RED}${failed} failed${RESET} · ${GREEN}${passed} passed${RESET}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`${RED}smoke crashed${RESET}`, error);
  process.exit(2);
});
