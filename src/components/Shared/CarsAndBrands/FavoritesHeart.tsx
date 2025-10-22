import { useEffect, useState } from "react";
import {
  FavoritesMap,
  loadFavorites,
  toggleFavorite,
} from "@/components/Shared/CarsAndBrands/FavoritesStorage";

type Props = { carKey: string; compact?: boolean };

export default function FavoriteHeart({ carKey, compact = true }: Props) {
  const [map, setMap] = useState<FavoritesMap>({});
  const isFav = !!map[carKey];

  useEffect(() => {
    let alive = true;
    loadFavorites().then((m) => alive && setMap(m));

    const onFav = () => loadFavorites().then((m) => alive && setMap(m));
    const onStorage = (e: StorageEvent) => { if (e.key === "carFavorites") onFav(); };

    window.addEventListener("favorites:updated", onFav);
    window.addEventListener("storage", onStorage);
    return () => {
      alive = false;
      window.removeEventListener("favorites:updated", onFav);
      window.removeEventListener("storage", onStorage);
    };
  }, [carKey]);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = await toggleFavorite(carKey);
    setMap(next);
  };

  const handleKey: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); (e.target as HTMLButtonElement).click(); }
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
    >
      {isFav ? "♥" : "♡"}
    </button>
  );
}
