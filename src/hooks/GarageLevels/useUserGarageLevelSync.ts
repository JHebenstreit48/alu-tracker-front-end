import { useEffect, useState } from "react";
import {
  DEFAULT_GL_STATE,
  GarageLevelSyncState,
  isDefaultGarageLevelState,
  readGarageLevelsFromLocalStorage,
  writeGarageLevelsToLocalStorage,
} from "./userGarageLevelStorage";

type BackendProgress = {
  xp?: number;
  currentGarageLevel?: number;
  currentGLXp?: number;
  garageLevelTrackerMode?: string;
};

type GetProgressResponse = {
  progress: BackendProgress;
};

type Source = "firebase" | "localStorage" | "default";

export function useUserGarageLevelSync() {
  const [state, setState] = useState<GarageLevelSyncState>(DEFAULT_GL_STATE);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<Source>("default");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      const local = readGarageLevelsFromLocalStorage();
      let remote: GarageLevelSyncState | null = null;
      let useLocalForMigration = false;

      try {
        const res = await fetch("/api/progress/get-progress", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const json = (await res.json()) as GetProgressResponse;
          const p = json.progress || {};

          const rawXp =
            p.currentGLXp !== undefined ? p.currentGLXp : p.xp ?? 0;
          const rawLevel =
            p.currentGarageLevel !== undefined ? p.currentGarageLevel : 1;
          const mode =
            typeof p.garageLevelTrackerMode === "string"
              ? p.garageLevelTrackerMode
              : DEFAULT_GL_STATE.garageLevelTrackerMode;

          remote = {
            currentGarageLevel: Number(rawLevel) || 1,
            currentGLXp: Number(rawXp) || 0,
            garageLevelTrackerMode: mode,
          };

          // Firebase looks default, but local has non-default → migrate
          if (
            remote &&
            isDefaultGarageLevelState(remote) &&
            local &&
            !isDefaultGarageLevelState(local)
          ) {
            useLocalForMigration = true;
          }
        }
      } catch (err) {
        // 401 / network / whatever → ignore, we’ll use local/default
        console.error("[useUserGarageLevelSync] fetch error:", err);
      }

      let chosen: GarageLevelSyncState;
      let chosenSource: Source;

      if (useLocalForMigration && local) {
        chosen = local;
        chosenSource = "localStorage";
        void saveToFirebase(local);
      } else if (remote) {
        chosen = remote;
        chosenSource = "firebase";
      } else if (local) {
        chosen = local;
        chosenSource = "localStorage";
      } else {
        chosen = DEFAULT_GL_STATE;
        chosenSource = "default";
      }

      if (!cancelled) {
        writeGarageLevelsToLocalStorage(chosen);
        setState(chosen);
        setSource(chosenSource);
        setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    ...state,
    loading,
    source,
  };
}

async function saveToFirebase(state: GarageLevelSyncState): Promise<void> {
  try {
    const body = {
      xp: state.currentGLXp,
      currentGLXp: state.currentGLXp,
      currentGarageLevel: state.currentGarageLevel,
      garageLevelTrackerMode: state.garageLevelTrackerMode,
    };

    await fetch("/api/progress/save-progress", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("[useUserGarageLevelSync] save error:", err);
  }
}