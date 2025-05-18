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
 * Hook to automatically sync account progress when any value in the dependencies array changes.
 * Only triggers if a valid token is present.
 */
export function useAutoSyncDependency(dependencies: unknown[]): void {
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (typeof token === "string" && token.trim() !== "") {
      debouncedSync(token);
    }
    // We intentionally exclude `debouncedSync` from deps to avoid re-creating
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
