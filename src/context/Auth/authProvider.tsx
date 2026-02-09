import { useState, useEffect, ReactNode } from "react";
import { AuthContext } from "@/context/Auth/authContext";
import { syncFromAccount } from "@/utils/UserDataSync/syncFromAccount";
import { hydrateGarageLevelsFromAccount } from "@/utils/UserDataSync/hydrateGarageLevelsFromAccount";
import { fetchMe } from "@/api/authAPI";

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // ✅ add
  const [userId, setUserId] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  const [syncReady, setSyncReady] = useState<boolean>(false);

  // hydrate from local storage then /users/me
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    // Optional: if present, helps UI render roles instantly while hydrate runs
    const storedUserId = localStorage.getItem("userId");
    const storedRolesRaw = localStorage.getItem("roles");

    if (storedUserId) setUserId(storedUserId);
    if (storedRolesRaw) {
      try {
        const parsed = JSON.parse(storedRolesRaw);
        if (Array.isArray(parsed)) setRoles(parsed);
      } catch {
        // ignore
      }
    }

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

      // ✅ NEW: keep roles/userId in sync with server
      if (data?.userId) {
        setUserId(data.userId);
        localStorage.setItem("userId", data.userId);
      }
      const nextRoles = Array.isArray(data?.roles) ? data!.roles : ["user"];
      setRoles(nextRoles);
      localStorage.setItem("roles", JSON.stringify(nextRoles));

      await syncFromAccount(tok); // merge, no wipes
      await hydrateGarageLevelsFromAccount(tok); // ✅ add garage level hydration
    } finally {
      setSyncReady(true);
    }
  };

  const login = (newToken: string, newUsername: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);

    setToken(newToken);
    setUsername(newUsername);

    // roles/userId will be refreshed in hydrate()
    hydrate(newToken);
  };

  const hardLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    // ✅ clear new fields too (safe)
    localStorage.removeItem("userId");
    localStorage.removeItem("roles");

    setToken(null);
    setUsername(null);
    setUserId(null);
    setRoles([]);
    setSyncReady(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        userId,
        roles,
        syncReady,
        login,
        logout: hardLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};