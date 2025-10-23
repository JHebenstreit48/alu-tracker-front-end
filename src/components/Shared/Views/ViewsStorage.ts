export type CountMap = Record<string, number>;

const CAR_VIEWS_KEY = "carViews";
const BRAND_VIEWS_KEY = "brandViews";

const getToken = () =>
  localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

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

/** Call this later (e.g., from CarDetailsBody on mount) when you want to start tracking. */
export async function incrementView(carKey: string, brand: string): Promise<void> {
  const nextCars = addOne(read(CAR_VIEWS_KEY), carKey);
  const nextBrands = addOne(read(BRAND_VIEWS_KEY), brand);
  write(CAR_VIEWS_KEY, nextCars);
  write(BRAND_VIEWS_KEY, nextBrands);
  window.dispatchEvent(new Event("views:updated"));

  const token = getToken();
  if (!token) return;

  try {
    await fetch("/api/users/save-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        views: { carViews: { [carKey]: 1 }, brandViews: { [brand]: 1 } },
      }),
    });
  } catch {
    /* local persisted; server can catch up later */
  }
}