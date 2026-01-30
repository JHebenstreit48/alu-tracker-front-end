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
  progress?: BackendProgress;
};

type Source = "firebase" | "localStorage" | "default";

function safeParseJSON(text: string): unknown {
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

const USER_API_BASE = (import.meta.env.VITE_USER_API_URL || "").trim().replace(/\/+$/, "");

export function useUserGarageLevelSync(token: string | null) {
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

      // If no token or no API base, we can’t call the account API safely.
      if (!token) {
        // No remote; fall through to local/default
      } else if (!USER_API_BASE) {
        console.error(
          "[useUserGarageLevelSync] VITE_USER_API_URL is missing. Garage progress fetch would hit Netlify and return HTML."
        );
      } else {
        const url = `${USER_API_BASE}/api/users/get-progress`;

        try {
          const res = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            // keep credentials if you use cookies too; harmless if not
            credentials: "include",
          });

          const contentType = res.headers.get("content-type") || "";
          const rawText = await res.text();

          // Loud debug (you can remove once confirmed)
          console.log("[useUserGarageLevelSync] response", {
            url: res.url,
            status: res.status,
            contentType,
            preview: rawText.slice(0, 200),
          });

          if (!res.ok) {
            console.error("[useUserGarageLevelSync] non-OK response", {
              status: res.status,
              preview: rawText.slice(0, 200),
            });
          } else if (!contentType.includes("application/json")) {
            // This is the exact “DOCTYPE” problem, but now it becomes readable.
            console.error("[useUserGarageLevelSync] expected JSON, got:", {
              contentType,
              preview: rawText.slice(0, 200),
            });
          } else {
            const dataUnknown = safeParseJSON(rawText) as GetProgressResponse;
            const p = dataUnknown.progress || {};

            const rawXp = p.currentGLXp !== undefined ? p.currentGLXp : p.xp ?? 0;
            const rawLevel = p.currentGarageLevel !== undefined ? p.currentGarageLevel : 1;

            const mode =
              typeof p.garageLevelTrackerMode === "string"
                ? p.garageLevelTrackerMode
                : DEFAULT_GL_STATE.garageLevelTrackerMode;

            remote = {
              currentGarageLevel: Number(rawLevel) || 1,
              currentGLXp: Number(rawXp) || 0,
              garageLevelTrackerMode: mode,
            };

            // Remote looks default, but local has non-default → migrate
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
          console.error("[useUserGarageLevelSync] fetch error:", err);
        }
      }

      let chosen: GarageLevelSyncState;
      let chosenSource: Source;

      if (useLocalForMigration && local) {
        chosen = local;
        chosenSource = "localStorage";
        // migrate up (token required)
        if (token) void saveToAccount(token, local);
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
  }, [token]);

  return {
    ...state,
    loading,
    source,
  };
}

async function saveToAccount(token: string, state: GarageLevelSyncState): Promise<void> {
  if (!USER_API_BASE) {
    console.error("[useUserGarageLevelSync] save skipped: missing VITE_USER_API_URL");
    return;
  }

  try {
    const body = {
      xp: state.currentGLXp,
      currentGLXp: state.currentGLXp,
      currentGarageLevel: state.currentGarageLevel,
      garageLevelTrackerMode: state.garageLevelTrackerMode,
    };

    const url = `${USER_API_BASE}/api/users/save-progress`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const rawText = await res.text();
    if (!res.ok) {
      console.error("[useUserGarageLevelSync] save non-OK", {
        status: res.status,
        preview: rawText.slice(0, 200),
      });
    }
  } catch (err) {
    console.error("[useUserGarageLevelSync] save error:", err);
  }
}