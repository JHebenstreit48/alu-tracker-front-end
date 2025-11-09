import { useEffect, useState, useMemo } from "react";
import type { PublicFeedbackItem } from "@/interfaces/Feedback";
import { fetchPublicFeedback } from "@/utils/Feedback/api";

export function usePublicFeedback() {
  const [items, setItems] = useState<PublicFeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fmt = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await fetchPublicFeedback();
        if (alive) setItems(list);
      } catch (e) {
        if (alive) {
          setError(
            e instanceof Error ? e.message : "Failed to load feedback."
          );
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { items, loading, error, fmt };
}