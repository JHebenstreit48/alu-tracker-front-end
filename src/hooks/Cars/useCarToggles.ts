import { useCallback, useState } from 'react';

function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

function saveFlag(key: string, value: boolean): void {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // Storage unavailable: the toggle still works, just isn't saved
  }
}

/** Owned and Key Car toggles, kept across page refreshes. */
export function useCarToggles() {
  const [showOwned, setShowOwned] = useState(() => readFlag('showOwned'));
  const [showKeyCars, setShowKeyCars] = useState(() => readFlag('showKeyCars'));

  const toggleOwned = useCallback(() => {
    setShowOwned((prev) => {
      saveFlag('showOwned', !prev);
      return !prev;
    });
  }, []);

  const toggleKeyCars = useCallback(() => {
    setShowKeyCars((prev) => {
      saveFlag('showKeyCars', !prev);
      return !prev;
    });
  }, []);

  return { showOwned, showKeyCars, toggleOwned, toggleKeyCars };
}