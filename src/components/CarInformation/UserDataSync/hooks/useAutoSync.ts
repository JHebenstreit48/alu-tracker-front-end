import { useContext, useEffect } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import { syncToAccount } from "@/components/CarInformation/UserDataSync/syncToAccount";

// Type-safe debounce function
function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
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
 * useAutoSyncDependency
 * Triggers a debounced sync when any of the provided dependencies change,
 * provided a valid auth token exists.
 *
 * IMPORTANT: We collapse the (potentially variable-length) deps array into a
 * single stable string key so the effect's dependency array length is constant.
 */
export function useAutoSyncDependency(dependencies: unknown[]): void {
  const { token } = useContext(AuthContext);

  // Always coerce to array to be safe
  const safeDeps = Array.isArray(dependencies) ? dependencies : [];

  // Build a stable signature for the deps (no functions, dates normalized)
  const depsKey = JSON.stringify(
    safeDeps,
    (_k, v) => {
      if (typeof v === "function") return "__fn__";
      if (v instanceof Date) return v.toISOString();
      return v;
    }
  );

  useEffect(() => {
    if (typeof token === "string" && token.trim() !== "") {
      debouncedSync(token);
    }
    // ✅ Dependency array length is now constant (always 2)
  }, [token, depsKey]);
}