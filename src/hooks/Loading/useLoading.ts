import { useContext } from "react";
import { LoadingContext } from "@/context/Loading/LoadingContext";
import type { LoadingContextType } from "@/context/Loading/LoadingContext";

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading must be used within a LoadingProvider");
  return context;
};