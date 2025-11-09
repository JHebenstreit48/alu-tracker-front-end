import { useContext } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";

export const useAuth = () => {
  return useContext(AuthContext);
};
