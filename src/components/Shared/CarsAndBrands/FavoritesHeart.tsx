import { useEffect, useMemo, useRef, useState } from "react";
import {
  FavoritesMap,
  loadFavorites,
  toggleFavorite,
} from "@/components/Shared/CarsAndBrands/FavoritesStorage";

type Props = { carKey: string; compact?: boolean };

export default function FavoriteHeart({ carKey, compact = true }: Props) {
  const [map, setMap] = useState<FavoritesMap>({});
  const [busy, setBusy] = useState(false);
  const mounted = useRef(true);

  const isFav = !!map[carKey];

  // Normalize once for stable lookups (in case callers pass mixed case/spacing)
  const normalizedKey = useMemo(() => carKey.trim().toLowerCase(), [carKey]);

  useEffect(() => {
    mounted.current = true;

    // initial hydrate (local + remote merge if logged in)
    loadFavorites().then((m) => {
      if (mounted.current) setMap(m);
    });

    // keep multiple hearts in-sync across the app & tabs
    const onFav = () => {
      loadFavorites().then((m) => {
        if (mounted.current) setMap(m);
      });
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === "carFavorites") onFav();
    };

    window.addEventListener("favorites:updated", onFav);
    window.addEventListener("storage", onStorage);

    return () => {
      mounted.current = false;
      window.removeEventListener("favorites:updated", onFav);
      window.removeEventListener("storage", onStorage);
    };
  }, []); // load once; the map will update via events

  const commitNext = (next: FavoritesMap) => {
    if (!mounted.current) return;
    setMap(next);
  };

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;

    setBusy(true);

    // Optimistic UI: flip locally first for snappy feedback
    setMap((prev) => {
      const next = { ...prev };
      if (next[normalizedKey]) delete next[normalizedKey];
      else next[normalizedKey] = true;
      return next;
    });

    try {
      const next = await toggleFavorite(normalizedKey);
      commitNext(next); // authoritative state after storage/network resolves
    } catch {
      // If toggle throws (rare), reload to real source of truth
      loadFavorites().then(commitNext);
    } finally {
      if (mounted.current) setBusy(false);
    }
  };

  const handleKey: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); (e.currentTarget as HTMLButtonElement).click(); }
  };

  return (
    <button
      type="button"
      className={`favHeart${compact ? " favHeart--compact" : ""}`}
      aria-pressed={isFav}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      title={isFav ? "Favorited" : "Add to favorites"}
      onClick={handleClick}
      onKeyDown={handleKey}
      disabled={busy}
      // optional micro UX: cursor/opacity hint while saving
      style={busy ? { opacity: 0.7, cursor: "progress" } : undefined}
    >
      {isFav ? "♥" : "♡"}
    </button>
  );
}