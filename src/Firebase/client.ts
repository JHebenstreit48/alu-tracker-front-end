import { initializeApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_TRACKER_FB_API_KEY,
  authDomain: import.meta.env.VITE_TRACKER_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_TRACKER_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_TRACKER_FB_STORAGE_BUCKET,
  appId: import.meta.env.VITE_TRACKER_FB_APP_ID,
};

const app = initializeApp(firebaseConfig);

/** Firestore with a browser cache (IndexedDB), shared across tabs; falls back to no cache if unavailable. */
function createFirestore(): Firestore {
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    });
  } catch {
    return getFirestore(app);
  }
}

export const dbTracker = createFirestore();
export const storageTracker = getStorage(app);