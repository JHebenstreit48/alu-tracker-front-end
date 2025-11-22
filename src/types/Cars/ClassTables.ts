import type { Car } from "@/types/shared/car";

export interface ClassTablesProps {
  cars: Car[];
  selectedClass: string;
  loading: boolean;
  trackerMode?: boolean;
}