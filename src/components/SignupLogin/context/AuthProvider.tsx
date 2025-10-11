import { useState, useEffect, ReactNode } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import { syncFromAccount } from "@/components/CarInformation/UserDataSync/syncFromAccount";
import { fetchMe } from "@/components/SignupLogin/api/authAPI";

interface Props { children: ReactNode }

export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [syncReady, setSyncReady] = useState<boolean>(false);

  // hydrate from local storage then /users/me
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUsername(storedUsername);
      hydrate(storedToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hydrate = async (tok: string) => {
    setSyncReady(false);
    try {
      const { ok, data } = await fetchMe(tok);
      if (!ok) return hardLogout(); // 401/expired → out
      if (data?.username) setUsername(data.username);
      await syncFromAccount(tok); // merge, no wipes
    } finally {
      setSyncReady(true);
    }
  };

  const login = (newToken: string, newUsername: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
    setToken(newToken);
    setUsername(newUsername);
    hydrate(newToken);
  };

  const hardLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername(null);
    setSyncReady(false);
  };

  return (
    <AuthContext.Provider value={{ token, username, syncReady, login, logout: hardLogout }}>
      {children}
    </AuthContext.Provider>
  );
};