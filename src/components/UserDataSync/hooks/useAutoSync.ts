import { useContext, useEffect } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import { syncToAccount } from "@/components/UserDataSync/syncToAccount";

// Type-safe debounce function
function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Debounced sync to account (runs once per second max)
const debouncedSync = debounce((token: string) => {
  console.log("🔁 Auto-syncing to account...");
  syncToAccount(token);
}, 1000);

/**
 * Triggers a debounced sync when any of the provided dependencies change,
 * provided a valid auth token exists AND post-login hydrate has completed.
 *
 * We collapse deps to a JSON key so the effect array is stable-length.
 */
export function useAutoSyncDependency(dependencies: unknown[]): void {
  const { token, syncReady } = useContext(AuthContext);

  const safeDeps = Array.isArray(dependencies) ? dependencies : [];
  const depsKey = JSON.stringify(
    safeDeps,
    (_k, v) => {
      if (typeof v === "function") return "__fn__";
      if (v instanceof Date) return v.toISOString();
      return v;
    }
  );

  useEffect(() => {
    if (typeof token === "string" && token.trim() !== "" && syncReady) {
      debouncedSync(token);
    } else {
      // If no token or not ready, do nothing (prevents early/empty writes)
    }
  }, [token, syncReady, depsKey]);
}