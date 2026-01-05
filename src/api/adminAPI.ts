const API_BASE_URL = String(import.meta.env.VITE_USER_API_URL || "").replace(/\/+$/, "");

export async function fetchAdminMe(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function bootstrapOwner(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin/bootstrap-owner`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function setUserRoles(token: string, body: { email?: string; userId?: string; roles: string[] }) {
  const res = await fetch(`${API_BASE_URL}/api/admin/users/set-roles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}