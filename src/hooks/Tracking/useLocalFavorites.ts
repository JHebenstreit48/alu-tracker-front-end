import { useEffect, useState } from 'react';

const STORAGE_KEY = 'carFavorites';

function readFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== 'object') return new Set();
    return new Set(
      Object.entries(parsed as Record<string, unknown>)
        .filter(([, value]) => value === true)
        .map(([key]) => key)
    );
  } catch {
    return new Set();
  }
}

export function useLocalFavorites(): Set<string> {
  const [favorites, setFavorites] = useState<Set<string>>(readFavorites);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setFavorites(readFavorites());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return favorites;
}