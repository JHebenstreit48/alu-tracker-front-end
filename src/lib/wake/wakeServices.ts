export type WakeUpdateInfo = {
  attempt: number;  // 1-based attempt counter
  ok?: boolean;     // present only when done
  done: boolean;    // true when success/fail finalizes
};

export type WakeOpts = {
  bases?: string[];
  path?: string;                         // default /api/health
  method?: "GET" | "HEAD";               // default GET
  retries?: number;                      // default 3
  timeoutMs?: number;                    // default 6000
  backoffMs?: number;                    // default 1200
  endpoints?: Record<string, string>;    // per-base override path
  onUpdate?: (base: string, info: WakeUpdateInfo) => void; // <-- add this
};

const ENV_BASES = [
  import.meta.env.VITE_AUTH_API_URL,
  import.meta.env.VITE_CARS_API_BASE_URL,
  import.meta.env.VITE_COMMENTS_API_BASE_URL,
  import.meta.env.VITE_CONTENT_API_BASE_URL,
].filter(Boolean) as string[];

// flip on verbose logs by setting VITE_DEBUG_WAKE=true
const DEBUG_WAKE =
  String(import.meta.env.VITE_DEBUG_WAKE ?? "").toLowerCase() === "true";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function jitter(ms: number, pct = 0.35) {
  const d = ms * pct;
  return ms + (Math.random() * 2 - 1) * d;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {}
) {
  const { timeoutMs = 6000, ...rest } = init;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, {
      cache: "no-store",
      keepalive: true,
      signal: ctrl.signal,
      ...rest,
    });
  } finally {
    clearTimeout(t);
  }
}

async function wakeOne(
  base: string,
  path: string,
  method: "GET" | "HEAD",
  retries: number,
  timeoutMs: number,
  backoffMs: number,
  onUpdate?: WakeOpts["onUpdate"]            // <-- add this
) {
  const root = base.replace(/\/+$/, "");
  const probe = `${root}${path.startsWith("/") ? "" : "/"}${path}`;

  for (let i = 0; i <= retries; i++) {
    const attempt = i + 1;
    try {
      onUpdate?.(base, { attempt, done: false });       // <-- stream attempt start
      if (DEBUG_WAKE) console.time(`wake:${probe}#${attempt}`);
      const res = await fetchWithTimeout(probe, { method, timeoutMs });
      if (DEBUG_WAKE) {
        console.timeEnd(`wake:${probe}#${attempt}`);
        console.debug(`→ ${probe} ${res.ok ? "OK" : `FAIL ${res.status}`}`);
      }
      if (res.ok) {
        onUpdate?.(base, { attempt, ok: true, done: true }); // <-- success
        return true;
      }
    } catch (e) {
      if (DEBUG_WAKE) console.debug(`⚠️ wake error ${probe} try ${attempt}:`, e);
    }
    if (i < retries) await sleep(jitter(backoffMs * (i + 1)));
  }
  onUpdate?.(base, { attempt: retries + 1, ok: false, done: true });  // <-- final fail
  return false;
}

export async function wakeServices(opts: WakeOpts = {}) {
  const {
    bases = [],
    path = "/api/health",
    method = "GET",
    retries = 3,
    timeoutMs = 6000,
    backoffMs = 1200,
    endpoints = {},
    onUpdate,                                 // <-- pick it up
  } = opts;

  const allBases = Array.from(new Set([...ENV_BASES, ...bases]));
  const queue = [...allBases];
  const out: [string, boolean][] = [];

  // Limit concurrency to 2 workers to avoid socket pressure/cold-start stampede
  async function worker() {
    while (queue.length) {
      const base = queue.shift()!;
      await sleep(jitter(150, 0.8)); // tiny start jitter per service
      const p = endpoints[base] ?? path;
      const ok = await wakeOne(base, p, method, retries, timeoutMs, backoffMs, onUpdate); // <-- pass it
      out.push([base, ok]);
    }
  }

  await Promise.all([worker(), worker()]); // two workers
  const result = Object.fromEntries(out) as Record<string, boolean>;

  // Broadcast that at least one service is awake (optional UI hook)
  if (Object.values(result).some(Boolean)) {
    window.dispatchEvent(new Event("services-awake"));
  }

  return result;
}