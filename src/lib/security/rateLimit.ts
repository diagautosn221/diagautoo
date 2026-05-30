/**
 * In-memory sliding window rate limiter.
 *
 * Trade-offs:
 *   - Process-local map. Multi-instance deployments need Redis/upstash.
 *     For single Node / Vercel-edge-with-low-traffic this is fine and zero
 *     dependency. The exported shape lets us swap the store later without
 *     touching the call site.
 *   - Token bucket semantics: each event consumes a token, refilled at a
 *     fixed cadence. Bursts of `capacity` are allowed; sustained traffic
 *     above `refillPerSecond` gets throttled.
 *
 * Usage:
 *   const limit = rateLimit({ capacity: 5, refillSeconds: 300 });
 *   const result = limit.consume(ipKey);
 *   if (!result.ok) return 429 with Retry-After: result.retryAfterSeconds;
 */

type Bucket = {
  tokens: number;
  /** Epoch ms of last refill. */
  updatedAt: number;
};

export type RateLimitOptions = {
  capacity: number;
  /** Seconds to fully refill the bucket from empty. */
  refillSeconds: number;
};

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSeconds: number };

export function rateLimit({ capacity, refillSeconds }: RateLimitOptions) {
  const store = new Map<string, Bucket>();
  const refillPerMs = capacity / (refillSeconds * 1000);

  function readBucket(key: string, now: number): Bucket {
    const existing = store.get(key);
    if (!existing) {
      const fresh: Bucket = { tokens: capacity, updatedAt: now };
      store.set(key, fresh);
      return fresh;
    }
    const elapsed = now - existing.updatedAt;
    if (elapsed > 0) {
      existing.tokens = Math.min(capacity, existing.tokens + elapsed * refillPerMs);
      existing.updatedAt = now;
    }
    return existing;
  }

  return {
    consume(key: string): RateLimitResult {
      const now = Date.now();
      const bucket = readBucket(key, now);
      if (bucket.tokens < 1) {
        const missing = 1 - bucket.tokens;
        const retryAfterSeconds = Math.ceil(missing / refillPerMs / 1000);
        return { ok: false, retryAfterSeconds: Math.max(1, retryAfterSeconds) };
      }
      bucket.tokens -= 1;
      return { ok: true, remaining: Math.floor(bucket.tokens) };
    },
    /** Successful auth — refund all tokens for this key. */
    refund(key: string) {
      const now = Date.now();
      const bucket = readBucket(key, now);
      bucket.tokens = capacity;
      bucket.updatedAt = now;
    },
    /** Optional housekeeping — GC keys idle for > 1h to bound memory. */
    sweep() {
      const cutoff = Date.now() - 3600_000;
      for (const [key, bucket] of store) {
        if (bucket.updatedAt < cutoff && bucket.tokens >= capacity) {
          store.delete(key);
        }
      }
    },
  };
}

/**
 * Best-effort client IP extraction from a Next.js Request.
 * Honors X-Forwarded-For first hop (most upstream), falls back to a fixed
 * key so misconfigured proxies still get rate-limited (worst case: same
 * bucket for everyone behind that proxy — still better than no limit).
 */
export function clientKey(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return `ip:${first}`;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return `ip:${realIp.trim()}`;
  return "ip:unknown";
}
