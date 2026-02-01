import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/Auth/authContext";
import { fetchMe, type MePayload } from "@/api/authAPI";

function isError(x: unknown): x is Error {
  return typeof x === "object" && x !== null && "message" in x;
}

export default function ProfileCard(): JSX.Element {
  const { token, username } = useContext(AuthContext);
  const [me, setMe] = useState<MePayload | null>(null);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!token) return;
      try {
        const { ok, data } = await fetchMe(token);
        if (!alive) return;
        if (!ok || !data) {
          setErr("Failed to load profile");
          return;
        }
        setMe(data);
      } catch (e: unknown) {
        if (!alive) return;
        setErr(isError(e) ? e.message : "Failed to load profile");
      }
    })();

    return () => {
      alive = false;
    };
  }, [token]);

  return (
    <div className="card" style={{ marginTop: "1rem" }}>
      <h2>Profile</h2>
      {err && <div className="authError">{err}</div>}
      <div><strong>Username:</strong> {username}</div>
      <div><strong>Roles:</strong> {me?.roles?.join(", ") || "user"}</div>
      <div><strong>2FA:</strong> {me?.twoFactorEnabled ? "Enabled" : "Disabled"}</div>
    </div>
  );
}