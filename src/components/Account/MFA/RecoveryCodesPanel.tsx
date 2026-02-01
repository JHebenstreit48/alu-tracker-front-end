import { useEffect, useMemo, useState } from "react";
import { downloadTextFile } from "@/utils/Account/downloadTextFile";

type Props = {
  codes: string[] | null;
  username?: string | null;
  onDone: () => void; // should clear parent state too
};

const STORAGE_KEY = "alu_recovery_codes_once";

function loadCached(): string[] | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    return Array.isArray(arr) && arr.every((x) => typeof x === "string") ? arr : null;
  } catch {
    return null;
  }
}

export default function RecoveryCodesPanel({ codes, username, onDone }: Props) {
  const [cached, setCached] = useState<string[] | null>(null);

  // If codes are provided (fresh from confirm), cache them for this tab session
  useEffect(() => {
    if (codes && codes.length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
      setCached(codes);
      return;
    }
    // Otherwise, try loading any pending cached codes
    setCached(loadCached());
  }, [codes]);

  const finalCodes = cached;
  const text = useMemo(() => (finalCodes ? finalCodes.join("\n") : ""), [finalCodes]);
  const [copied, setCopied] = useState(false);

  if (!finalCodes || finalCodes.length === 0) return null;

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const download = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    const namePart = username ? `-${username}` : "";
    downloadTextFile(`alu-recovery-codes${namePart}-${stamp}.txt`, text);
  };

  const done = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setCached(null);
    onDone();
  };

  return (
    <div style={{ marginTop: ".75rem" }}>
      <div style={{ marginBottom: ".35rem" }}>
        <strong>Recovery codes (save these now):</strong>
      </div>

      <pre style={{ whiteSpace: "pre-wrap", userSelect: "text" }}>{text}</pre>

      <div style={{ display: "flex", gap: ".5rem", marginTop: ".5rem" }}>
        <button onClick={copy} type="button">
          {copied ? "Copied!" : "Copy"}
        </button>
        <button onClick={download} type="button">
          Download .txt
        </button>
        <button onClick={done} type="button">
          I saved these
        </button>
      </div>

      <div className="AccountHint" style={{ marginTop: ".35rem" }}>
        These are shown once per setup. If you refresh right after enabling, they’ll still be available in this tab until you click “I saved these”.
      </div>
    </div>
  );
}