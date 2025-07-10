import { useState, useEffect, ReactNode } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import { syncFromAccount } from "@/components/CarInformation/UserDataSync/syncFromAccount";

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token"); // ✅ consistent key
    const storedUsername = localStorage.getItem("username");

    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUsername(storedUsername);
    }
  }, []);

  const login = (newToken: string, newUsername: string) => {
    localStorage.setItem("token", newToken); // ✅ corrected key
    localStorage.setItem("username", newUsername);
    setToken(newToken);
    setUsername(newUsername);

    console.log("🔄 Syncing progress from account after login...");
    syncFromAccount(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token"); // ✅ corrected key
    localStorage.removeItem("username");
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};