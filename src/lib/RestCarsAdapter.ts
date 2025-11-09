import type { Car } from "@/types/car";

const API_BASE = (import.meta.env.VITE_CARS_API_BASE_URL || "").replace(/\/+$/, "");

export class RestCarsAdapter {
  async list(): Promise<Car[]> {
    const res = await fetch(`${API_BASE}/api/cars`);
    if (!res.ok) {
      throw new Error(`Failed to load cars. Status: ${res.status}`);
    }
    const data = (await res.json()) as Car[];
    return data;
  }

  async getById(id: string): Promise<Car> {
    const res = await fetch(`${API_BASE}/api/cars/${encodeURIComponent(id)}`);
    if (!res.ok) {
      throw new Error(`Car not found: ${id} (Status: ${res.status})`);
    }
    const data = (await res.json()) as Car;
    return data;
  }
}
