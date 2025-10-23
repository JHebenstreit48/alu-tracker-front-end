type WakeOpts = {
    bases?: string[];
    path?: string;
    method?: "GET" | "HEAD";
    retries?: number;
    timeoutMs?: number;
    backoffMs?: number;
    endpoints?: Record<string, string>;
  };
  
  const ENV_BASES = [
    import.meta.env.VITE_AUTH_API_URL,
    import.meta.env.VITE_CARS_API_BASE_URL,
    import.meta.env.VITE_COMMENTS_API_BASE_URL,
    import.meta.env.VITE_CONTENT_API_BASE_URL,
  ].filter(Boolean) as string[];
  
  function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
  
  async function fetchWithTimeout(
    url: string,
    init: RequestInit & { timeoutMs?: number } = {}
  ) {
    const { timeoutMs = 8000, ...rest } = init;
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
    backoffMs: number
  ) {
    const root = base.replace(/\/+$/, "");
    const probe = `${root}${path.startsWith("/") ? "" : "/"}${path}`;
    for (let i = 0; i <= retries; i++) {
      try {
        const res = await fetchWithTimeout(probe, { method, timeoutMs });
        if (res.ok) return true;
      } catch {
        // cold-start; retry
      }
      if (i < retries) await sleep(backoffMs * (i + 1));
    }
    return false;
  }
  
  export async function wakeServices(opts: WakeOpts = {}) {
    const {
      bases = [],
      path = "/api/test",
      method = "GET",
      retries = 3,
      timeoutMs = 8000,
      backoffMs = 3000,
      endpoints = {},
    } = opts;
  
    const allBases = Array.from(new Set([...ENV_BASES, ...bases]));
  
    const pairs = await Promise.all(
      allBases.map(async (base) => {
        const p = endpoints[base] ?? path;
        const ok = await wakeOne(base, p, method, retries, timeoutMs, backoffMs);
        return [base, ok] as const;
      })
    );
  
    const result = Object.fromEntries(pairs) as Record<string, boolean>;
  
    // Optional: broadcast that services are awake
    if (Object.values(result).some(Boolean)) {
      window.dispatchEvent(new Event("services-awake"));
    }
    return result;
  }  