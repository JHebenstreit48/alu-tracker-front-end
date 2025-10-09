import { useState, useEffect, ReactNode } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import { syncFromAccount } from "@/components/CarInformation/UserDataSync/syncFromAccount";

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [syncReady, setSyncReady] = useState<boolean>(false); // ✅ gate autosync

  // Load persisted credentials and hydrate once
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUsername(storedUsername);
      (async () => {
        setSyncReady(false);
        try {
          await syncFromAccount(storedToken); // ✅ merge-based hydrate (no clearing)
        } finally {
          setSyncReady(true);
        }
      })();
    }
  }, []);

  const login = (newToken: string, newUsername: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
    setToken(newToken);
    setUsername(newUsername);

    // Hydrate from server BEFORE enabling autosync
    (async () => {
      setSyncReady(false);
      try {
        await syncFromAccount(newToken);
      } finally {
        setSyncReady(true);
      }
    })();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername(null);
    setSyncReady(false);
  };

  return (
    <AuthContext.Provider value={{ token, username, syncReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};