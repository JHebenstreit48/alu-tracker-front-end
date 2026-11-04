import type { Car } from '@/types/shared/car';

export type ViewedCar = {
  car: Car;
  carKey: string;
  views: number;
};

export type ViewedBrand = {
  brand: string;
  views: number;
};