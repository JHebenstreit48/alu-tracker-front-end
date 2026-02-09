import { createContext } from "react";

export interface AuthContextType {
  token: string | null;
  username: string | null;
  userId: string | null;     // ✅ add
  roles: string[];           // ✅ add
  syncReady: boolean;
  login: (token: string, username: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  username: null,
  userId: null,
  roles: [],
  syncReady: false,
  login: () => {},
  logout: () => {},
});