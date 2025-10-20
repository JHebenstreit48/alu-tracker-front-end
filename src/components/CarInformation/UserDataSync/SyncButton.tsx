import { useContext, useState } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import { syncToAccount } from "@/components/CarInformation/UserDataSync/syncToAccount";
import { syncFromAccount } from "@/components/CarInformation/UserDataSync/syncFromAccount";

export default function SyncButton() {
  const { token } = useContext(AuthContext);
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  const handlePush = async () => {
    if (!token) return alert("Not logged in.");
    try {
      setIsPushing(true);
      const result = await syncToAccount(token, { timeoutMs: 15000 });
      if (result.success) {
        window.dispatchEvent(new Event("user-progress-synced"));
        alert("✅ Progress pushed to account!");
      } else {
        alert("❌ Push failed: " + (result.message || "Unknown error"));
      }
    } finally {
      setIsPushing(false);
    }
  };

  const handlePull = async () => {
    if (!token) return alert("Not logged in.");
    try {
      setIsPulling(true);
      const result = await syncFromAccount(token, { timeoutMs: 15000 });
      if (result.success) {
        window.dispatchEvent(new Event("user-progress-synced"));
        alert("✅ Progress pulled from account!");
      } else {
        alert("❌ Pull failed: " + (result.message || "Unknown error"));
      }
    } finally {
      setIsPulling(false);
    }
  };

  return (
    <div className="syncButtonGroup">
      <button onClick={handlePush} disabled={isPushing || isPulling} aria-busy={isPushing}>
        {isPushing ? "Pushing…" : "Push to Account"}
      </button>
      <button onClick={handlePull} disabled={isPushing || isPulling} aria-busy={isPulling}>
        {isPulling ? "Pulling…" : "Pull from Account"}
      </button>
    </div>
  );
}