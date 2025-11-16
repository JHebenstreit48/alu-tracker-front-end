import { FirebaseCarsAdapter } from "@/lib/Firebase/FirebaseCarsAdapter";

const backend = (import.meta.env.VITE_CARS_BACKEND || "firebase").toLowerCase();

export const carsAdapter =
  backend === "firebase" ? new FirebaseCarsAdapter() : new FirebaseCarsAdapter();