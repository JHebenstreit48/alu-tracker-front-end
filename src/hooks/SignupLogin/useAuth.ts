import { useContext } from "react";
import { AuthContext } from "@/context/Auth/authContext";

export const useAuth = () => {
  return useContext(AuthContext);
};