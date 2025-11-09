import { ReactNode, useEffect, useMemo, useState } from "react";
import { getAllCarTrackingData } from "@/utils/shared/StorageUtils";

type Props = {
  carKey: string;
  children: ReactNode;   // typically the <Link/>
  className?: string;    // optional extra classes for the <td>
};

export interface CarTrackingEntry {
  owned?: boolean;
  isOwned?: boolean;
  hasCar?: boolean;
  hasOwned?: boolean;
  goldMaxed?: boolean;
  isGoldMaxed?: boolean;
  maxed?: boolean;
  isMaxed?: boolean;
}

type CarTrackingMap = Record<string, CarTrackingEntry>;

function toTrackingMap(maybe: unknown): CarTrackingMap {
  if (maybe && typeof maybe === "object") {
    return maybe as CarTrackingMap;
  }
  return {};
}

function isOwnedAndGoldMaxed(entry: CarTrackingEntry | undefined): boolean {
  if (!entry) return false;
  const owned =
    Boolean(entry.owned) ||
    Boolean(entry.isOwned) ||
    Boolean(entry.hasCar) ||
    Boolean(entry.hasOwned);

  const gold =
    Boolean(entry.goldMaxed) ||
    Boolean(entry.isGoldMaxed) ||
    Boolean(entry.maxed) ||
    Boolean(entry.isMaxed);

  return owned && gold;
}

function useGoldFlag(carKey: string): boolean {
  const read = useMemo(() => {
    return () => {
      const map = toTrackingMap(getAllCarTrackingData());
      return isOwnedAndGoldMaxed(map[carKey]);
    };
  }, [carKey]);

  const [gold, setGold] = useState<boolean>(read);

  useEffect(() => {
    const handle = () => setGold(read());
    window.addEventListener("storage", handle);
    window.addEventListener("tracking:updated", handle);
    return () => {
      window.removeEventListener("storage", handle);
      window.removeEventListener("tracking:updated", handle);
    };
  }, [read]);

  return gold;
}

/**
 * Wraps the Manufacturer/Model cell. If the car is owned+gold-maxed,
 * adds a BEM modifier that SCSS will render with a gold background.
 */
export default function OwnedGoldHighlighter({ carKey, children, className }: Props) {
  const gold = useGoldFlag(carKey);
  const tdClass =
    `carName${gold ? " carName--gold" : ""}` + (className ? ` ${className}` : "");
  return <td className={tdClass}>{children}</td>;
}