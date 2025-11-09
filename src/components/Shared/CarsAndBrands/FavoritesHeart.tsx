import { useEffect, useMemo, useRef, useState } from "react";
import { FavoritesMap, loadFavorites, toggleFavorite } from "@/utils/UserDataSync/FavoritesStorage";

type Props = { carKey: string; compact?: boolean };

export default function FavoriteHeart({ carKey, compact = true }: Props) {
  const [map, setMap] = useState<FavoritesMap>({});
  const [busy, setBusy] = useState(false);
  const mounted = useRef(true);

  const normalizedKey = useMemo(() => carKey.trim().toLowerCase().replace(/-/g, "_").replace(/\./g, "").replace(/__+/g, "_"), [carKey]);
  const isFav = !!map[normalizedKey];

  useEffect(() => {
    mounted.current = true;
    loadFavorites().then((m) => mounted.current && setMap(m));

    const onFav = () => loadFavorites().then((m) => mounted.current && setMap(m));
    const onStorage = (e: StorageEvent) => { if (e.key === "carFavorites") onFav(); };

    window.addEventListener("favorites:updated", onFav);
    window.addEventListener("storage", onStorage);
    return () => {
      mounted.current = false;
      window.removeEventListener("favorites:updated", onFav);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);

    // Optimistic flip
    setMap((prev) => {
      const next = { ...prev };
      if (next[normalizedKey]) delete next[normalizedKey];
      else next[normalizedKey] = true;
      return next;
    });

    try {
      const next = await toggleFavorite(normalizedKey);
      if (mounted.current) setMap(next);
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
      style={busy ? { opacity: 0.7, cursor: "progress" } : undefined}
    >
      {isFav ? "♥" : "♡"}
    </button>
  );
}