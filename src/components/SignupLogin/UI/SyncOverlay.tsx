import { useContext } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";

export default function SyncOverlay(): JSX.Element | null {
  const { token, syncReady } = useContext(AuthContext);
  if (!token || syncReady) return null;

  return (
    <div className="syncOverlay" role="status" aria-live="polite">
      <div className="syncPanel">Syncing your garage…</div>
    </div>
  );
}