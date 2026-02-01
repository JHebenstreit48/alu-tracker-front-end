import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/Auth/authContext";
import { fetchMe, type MePayload } from "@/api/authAPI";
import { mfaConfirm, mfaDisable, mfaInit } from "@/api/accountAPI";
import MfaQrStep from "@/components/Account/MFA/MfaQrStep";
import MfaDisableStep from "@/components/Account/MFA/MfaDisableStep";
import RecoveryCodesPanel from "@/components/Account/MFA/RecoveryCodesPanel";

const RECOVERY_CACHE_KEY = "alu_recovery_codes_once";

export default function TwoFASetupCard(): JSX.Element {
  const { token, username } = useContext(AuthContext);

  const [enabled, setEnabled] = useState(false);
  const [otpauthUrl, setOtpauthUrl] = useState("");
  const [code, setCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      if (!token) return;
      const { ok, data } = await fetchMe(token);
      if (ok && data) setEnabled(Boolean((data as MePayload).twoFactorEnabled));
    })();
  }, [token]);

  const start = async () => {
    if (!token) return;
    setMsg(""); setErr(""); setCode(""); setRecoveryCodes(null);

    // Clear any stale "one-time" cached codes when starting a new setup
    sessionStorage.removeItem(RECOVERY_CACHE_KEY);

    try {
      const resp = await mfaInit(token);
      setOtpauthUrl(resp.otpauthUrl);
      setMsg("QR generated. Scan it, then enter the 6-digit code.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to init 2FA");
      setOtpauthUrl("");
    }
  };

  const confirm = async () => {
    if (!token) return;
    setErr(""); setMsg("");
    try {
      const resp = await mfaConfirm(token, code.trim());
      setEnabled(Boolean(resp.twoFactorEnabled));
      setRecoveryCodes(Array.isArray(resp.recoveryCodes) ? resp.recoveryCodes : null);
      setMsg("2FA enabled. Save your recovery codes below.");
      setOtpauthUrl("");
      setCode("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to enable 2FA");
    }
  };

  const disable = async (proof: string) => {
    if (!token) return;
    setErr(""); setMsg("");
    try {
      await mfaDisable(token, proof);
      setEnabled(false);
      setRecoveryCodes(null);
      setOtpauthUrl("");
      setCode("");
      setMsg("2FA disabled.");

      // If they disable, any pending cached codes should not hang around
      sessionStorage.removeItem(RECOVERY_CACHE_KEY);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to disable 2FA");
    }
  };

  return (
    <div className="card" style={{ marginTop: "1rem" }}>
      <h2>Two-Factor Authentication</h2>
      <div><strong>Status:</strong> {enabled ? "Enabled" : "Disabled"}</div>

      {err && <div className="authError" style={{ marginTop: ".5rem" }}>{err}</div>}
      {msg && <div className="authSuccess" style={{ marginTop: ".5rem" }}>{msg}</div>}

      {!enabled && !otpauthUrl && (
        <button onClick={start} style={{ marginTop: ".5rem" }} type="button">
          Enable 2FA
        </button>
      )}

      {!enabled && otpauthUrl && (
        <MfaQrStep
          otpauthUrl={otpauthUrl}
          code={code}
          setCode={setCode}
          onConfirm={confirm}
        />
      )}

      {/* Always render so it can show the "one-time cached" codes after refresh */}
      <RecoveryCodesPanel
        codes={recoveryCodes}
        username={username}
        onDone={() => setRecoveryCodes(null)}
      />

      {enabled && <MfaDisableStep onDisable={disable} />}
    </div>
  );
}