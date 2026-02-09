import { useMemo, useState } from "react";
import type { CarPatch, CarSubmissionPayload } from "@/types/CarDataSubmission/carSubmission";

export function useCarSubmission() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [patchByKey, setPatchByKey] = useState<Record<string, CarPatch>>({});
  const [submitterNote, setSubmitterNote] = useState("");

  const toggleKey = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const updatePatch = (key: string, partial: Partial<CarPatch>) => {
    setPatchByKey((prev) => ({ ...prev, [key]: { ...(prev[key] || {}), ...partial } }));
  };

  const clearAll = () => {
    setSelectedKeys([]);
    setPatchByKey({});
    setSubmitterNote("");
  };

  const payload: CarSubmissionPayload = useMemo(() => {
    const cars: CarSubmissionPayload["cars"] = {};
    for (const key of selectedKeys) cars[key] = patchByKey[key] || {};
    return { cars, submitterNote };
  }, [selectedKeys, patchByKey, submitterNote]);

  return {
    selectedKeys,
    toggleKey,
    patchByKey,
    updatePatch,
    clearAll,
    submitterNote,
    setSubmitterNote,
    payload,
  };
}