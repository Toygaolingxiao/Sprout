type Bucket = { count: number; reset: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();

  if (buckets.size > 1000) {
    for (const [entryKey, entry] of buckets) {
      if (entry.reset <= now) buckets.delete(entryKey);
    }
  }

  const current = buckets.get(key);
  if (!current || current.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true as const };
  }

  if (current.count >= limit) return { ok: false as const };
  current.count += 1;
  return { ok: true as const };
}
