import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import { fetchMe, type MePayload } from "@/api/authAPI";
import { Link } from "react-router-dom";

export default function AdminLink(): JSX.Element | null {
  const { token } = useContext(AuthContext);
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (!token) return setShow(false);
      const { ok, data } = await fetchMe(token);
      if (!ok || !data) return setShow(false);

      const payload: MePayload = data; // ← explicit use of MePayload
      const roles: string[] = payload.roles ?? [];
      setShow(roles.includes("admin") || roles.includes("owner"));
    })();
  }, [token]);

  return show ? <Link to="/admin">Admin</Link> : null;
}