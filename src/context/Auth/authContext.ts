import { createContext } from 'react';

export interface AuthContextType {
  token: string | null;
  username: string | null;
  syncReady: boolean; // ✅ true only after hydrate-from-server finishes
  login: (token: string, username: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  username: null,
  syncReady: false,
  login: () => {},
  logout: () => {},
});