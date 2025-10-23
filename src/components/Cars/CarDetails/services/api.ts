import type { FullCar, CarStatus, ApiStatusDoc } from "@/components/Cars/CarDetails/types";
import { mapApiStatus } from "@/components/Cars/CarDetails/utils/status";

const API_BASE_URL =
  import.meta.env.VITE_CARS_API_BASE_URL ?? "https://alutracker-api.onrender.com";

export async function fetchCarDetail(slug: string): Promise<FullCar> {
  const res = await fetch(`${API_BASE_URL}/api/cars/detail/${slug}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return (await res.json()) as FullCar;
}

export async function fetchCarStatus(slug: string): Promise<CarStatus | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/status/by-slug/${slug}`);
    if (!res.ok) return null;
    const doc = (await res.json()) as ApiStatusDoc;
    return mapApiStatus(doc);
  } catch {
    return null;
  }
}