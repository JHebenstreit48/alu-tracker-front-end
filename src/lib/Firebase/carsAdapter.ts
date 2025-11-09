import { RestCarsAdapter } from "@/lib/RestCarsAdapter";
import { FirebaseCarsAdapter } from "@/lib/Firebase/FirebaseCarsAdapter";

const backend = (import.meta.env.VITE_CARS_BACKEND || "rest").toLowerCase();

export const carsAdapter =
  backend === "firebase" ? new FirebaseCarsAdapter() : new RestCarsAdapter();