import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/Auth/authContext';
import { fetchAccountViews } from '@/utils/views/fetchAccountViews';
import {
  ACCOUNT_VIEWS_PING_KEY,
  LOCAL_VIEWS_EVENT,
  LOCAL_VIEWS_STORAGE_KEY,
  readLocalCarViews,
  type ViewCounts,
} from '@/utils/views/localViews';

export function useViewCounts(): { carViews: ViewCounts; loading: boolean } {
  const { token } = useContext(AuthContext);
  const [carViews, setCarViews] = useState<ViewCounts>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (typeof token === 'string' && token.trim() !== '') {
      const signedInToken = token;

      const load = () => {
        fetchAccountViews(signedInToken).then((views) => {
          if (cancelled) return;
          setCarViews(views);
          setLoading(false);
        });
      };

      const onStorage = (e: StorageEvent) => {
        if (e.key === ACCOUNT_VIEWS_PING_KEY) load();
      };

      setLoading(true);
      load();
      window.addEventListener(LOCAL_VIEWS_EVENT, load);
      window.addEventListener('storage', onStorage);

      return () => {
        cancelled = true;
        window.removeEventListener(LOCAL_VIEWS_EVENT, load);
        window.removeEventListener('storage', onStorage);
      };
    }

    const refresh = () => setCarViews(readLocalCarViews());
    const onStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_VIEWS_STORAGE_KEY) refresh();
    };

    refresh();
    setLoading(false);
    window.addEventListener(LOCAL_VIEWS_EVENT, refresh);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener(LOCAL_VIEWS_EVENT, refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, [token]);

  return { carViews, loading };
}