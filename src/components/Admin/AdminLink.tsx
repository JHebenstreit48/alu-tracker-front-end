import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/Auth/authContext";
import { fetchAdminMe } from "@/api/adminAPI";

export default function AdminLink(): JSX.Element | null {
  const { token } = useContext(AuthContext);
  const [show, setShow] = useState(false);

  useEffect(() => {
    (async () => {
      if (!token) return setShow(false);
      const { ok, data } = await fetchAdminMe(token);
      if (!ok) return setShow(false);
      const roles: string[] = data?.roles ?? [];
      setShow(roles.includes("admin") || roles.includes("owner"));
    })();
  }, [token]);

  return show ? <Link to="/admin">Admin</Link> : null;
}