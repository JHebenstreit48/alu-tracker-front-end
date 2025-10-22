export type CountMap = Record<string, number>;

const CAR_VIEWS_KEY = "carViews";
const BRAND_VIEWS_KEY = "brandViews";

declare global {
  interface Window {
    ALU_LOAD_VIEWS?: () => Promise<{ carViews: CountMap; brandViews: CountMap }>;
    ALU_SYNC_VIEWS?: (payload: { carViews: CountMap; brandViews: CountMap }) => Promise<void>;
  }
}

function read(key: string): CountMap {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as CountMap) : {};
  } catch {
    return {};
  }
}
function write(key: string, map: CountMap): void {
  localStorage.setItem(key, JSON.stringify(map));
}
function addOne(map: CountMap, k: string): CountMap {
  const next = { ...map };
  next[k] = (next[k] ?? 0) + 1;
  return next;
}

export async function incrementView(carKey: string, brand: string): Promise<void> {
  const nextCars = addOne(read(CAR_VIEWS_KEY), carKey);
  const nextBrands = addOne(read(BRAND_VIEWS_KEY), brand);
  write(CAR_VIEWS_KEY, nextCars);
  write(BRAND_VIEWS_KEY, nextBrands);
  window.dispatchEvent(new Event("views:updated"));

  if (typeof window.ALU_SYNC_VIEWS === "function") {
    try {
      await window.ALU_SYNC_VIEWS({ carViews: nextCars, brandViews: nextBrands });
    } catch {
      // Local storage already persisted; ignore network sync errors
      void 0; // satisfy eslint(no-empty)
    }
  }
}