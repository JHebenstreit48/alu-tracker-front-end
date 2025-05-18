import { useContext } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import { syncToAccount } from "@/components/CarInformation/UserDataSync/syncToAccount";

export default function SyncButton() {
  const { token } = useContext(AuthContext);

  const handleSync = async () => {
    if (!token) return alert("Not logged in.");
    const result = await syncToAccount(token);
    if (result.success) {
      alert("✅ sync successful!");
    } else {
      alert("❌ Sync failed: " + result.message);
    }
  };

  return <button onClick={handleSync}>Push to Account</button>;
}
