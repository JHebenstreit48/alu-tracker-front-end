import { useContext } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import { syncToAccount } from "@/components/CarInformation/UserDataSync/syncToAccount";
import { syncFromAccount } from "@/components/CarInformation/UserDataSync/syncFromAccount";

export default function SyncButton() {
  const { token } = useContext(AuthContext);

  const handlePush = async () => {
    if (!token) return alert("Not logged in.");
    const result = await syncToAccount(token);
    if (result.success) {
      // notify CarTracker to refresh local state
      window.dispatchEvent(new Event("user-progress-synced"));
      alert("✅ Progress pushed to account!");
    } else {
      alert("❌ Push failed: " + result.message);
    }
  };

  const handlePull = async () => {
    if (!token) return alert("Not logged in.");
    console.log("🔄 Syncing progress from account...");
    await syncFromAccount(token);
    // notify CarTracker to refresh local state
    window.dispatchEvent(new Event("user-progress-synced"));
    alert("✅ Progress pulled from account!");
  };

  return (
    <div className="syncButtonGroup">
      <button onClick={handlePush}>Push to Account</button>
      <button onClick={handlePull}>Pull from Account</button>
    </div>
  );
}
