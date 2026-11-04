import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/Auth/authContext';
import { generateCarKey } from '@/utils/shared/StorageUtils';
import { incrementLocalCarView, notifyViewsChanged } from '@/utils/views/localViews';
import { recordViewsToAccount } from '@/utils/views/recordViewsToAccount';

const LAST_VIEWED_KEY = 'carViewLastSeen';
const VIEW_COOLDOWN_MS = 10_000;

function shouldCountView(carKey: string): boolean {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(LAST_VIEWED_KEY) ?? '{}');
    const lastSeen =
      parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {};
    const previous = typeof lastSeen[carKey] === 'number' ? (lastSeen[carKey] as number) : 0;
    const now = Date.now();

    if (now - previous < VIEW_COOLDOWN_MS) return false;

    localStorage.setItem(LAST_VIEWED_KEY, JSON.stringify({ ...lastSeen, [carKey]: now }));
    return true;
  } catch {
    return true;
  }
}

type ViewableCar = { brand: string; model: string } | null | undefined;

export function useRecordView(car: ViewableCar): void {
  const { token } = useContext(AuthContext);
  const carKey = car ? generateCarKey(car.brand, car.model) : '';

  useEffect(() => {
    if (!carKey || !shouldCountView(carKey)) return;

    if (typeof token === 'string' && token.trim() !== '') {
      recordViewsToAccount(token, carKey)
        .then((ok) => {
          if (ok) notifyViewsChanged();
        })
        .catch(() => undefined);
    } else {
      incrementLocalCarView(carKey);
    }
  }, [carKey, token]);
}