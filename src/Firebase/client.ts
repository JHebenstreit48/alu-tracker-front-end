import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_TRACKER_FB_API_KEY,
  authDomain: import.meta.env.VITE_TRACKER_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_TRACKER_FB_PROJECT_ID,
  appId: import.meta.env.VITE_TRACKER_FB_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const dbTracker = getFirestore(app);
export const storageTracker = getStorage(app);