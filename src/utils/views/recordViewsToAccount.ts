const USER_API_BASE = (import.meta.env.VITE_USER_API_URL || '').replace(/\/+$/, '');

export async function recordViewsToAccount(token: string, carKey: string): Promise<boolean> {
  if (!USER_API_BASE) return false;

  try {
    const res = await fetch(`${USER_API_BASE}/api/users/views/record`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ carKey }),
    });
    return res.ok;
  } catch {
    return false;
  }
}