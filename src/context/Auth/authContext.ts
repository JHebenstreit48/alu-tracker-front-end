import { createContext } from "react";

export interface AuthContextType {
  token: string | null;
  username: string | null;
  userId: string | null;
  roles: string[];
  syncReady: boolean;

  login: (token: string, username: string) => void;
  logout: () => void;

  // ✅ add: lets UI re-fetch roles/userId after bootstrap-owner
  refreshMe: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  username: null,
  userId: null,
  roles: [],
  syncReady: false,
  login: () => {},
  logout: () => {},
  refreshMe: async () => {},
});