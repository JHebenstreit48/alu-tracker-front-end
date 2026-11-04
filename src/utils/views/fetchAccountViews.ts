import { sanitizeViewCounts, type ViewCounts } from '@/utils/views/localViews';

const USER_API_BASE = (import.meta.env.VITE_USER_API_URL || '').replace(/\/+$/, '');

export async function fetchAccountViews(token: string): Promise<ViewCounts> {
  if (!USER_API_BASE) return {};

  try {
    const res = await fetch(`${USER_API_BASE}/api/users/views`, {
      credentials: 'include',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return {};

    const data: unknown = await res.json();
    const carViews =
      data && typeof data === 'object' && 'carViews' in data
        ? (data as { carViews: unknown }).carViews
        : {};

    return sanitizeViewCounts(carViews);
  } catch {
    return {};
  }
}