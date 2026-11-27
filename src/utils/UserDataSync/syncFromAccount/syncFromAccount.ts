import { applyServerProgress } from '@/utils/UserDataSync/syncFromAccount/applyServerProgress';
import {
  isObject,
  isProgressResponse,
  safeParseJSON,
} from '@/utils/UserDataSync/syncFromAccount/parseProgressRepsonse';
import type { PullResult } from '@/types/shared/userDataSync/syncFromAccount';

const USER_API_BASE = (import.meta.env.VITE_USER_API_URL || '').replace(/\/+$/, '');

export async function syncFromAccount(
  token: string,
  opts: { timeoutMs?: number } = {}
): Promise<PullResult> {
  const timeoutMs = typeof opts.timeoutMs === 'number' ? opts.timeoutMs : 15000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  if (!USER_API_BASE) {
    return { success: false, message: 'User API base URL is not configured.' };
  }

  try {
    const url = `${USER_API_BASE}/api/users/get-progress`;
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    });

    const rawText = await res.text();
    const dataUnknown = safeParseJSON(rawText);

    if (!res.ok) {
      const message =
        (isObject(dataUnknown) &&
          (typeof dataUnknown['message'] === 'string'
            ? dataUnknown['message']
            : typeof dataUnknown['error'] === 'string'
              ? dataUnknown['error']
              : undefined)) ||
        `HTTP ${res.status}`;
      return { success: false, message };
    }

    if (!isProgressResponse(dataUnknown) || !dataUnknown.progress) {
      return { success: true, message: 'No progress found on server' };
    }

    applyServerProgress(dataUnknown.progress);

    // Tell open pages (car page, tracker) to re-read the downloaded progress
    window.dispatchEvent(new Event('user-progress-synced'));

    return { success: true };
  } catch (err) {
    const message =
      err instanceof DOMException && err.name === 'AbortError'
        ? `Request timed out after ${timeoutMs}ms`
        : err instanceof Error
          ? err.message
          : 'Failed to fetch user progress';
    return { success: false, message };
  } finally {
    clearTimeout(timer);
  }
}