import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import { fetchMe, type MePayload } from "@/components/SignupLogin/api/authAPI";
import { mfaInit, mfaConfirm, mfaDisable } from "@/components/SignupLogin/api/accountAPI";

export default function TwoFASetupCard(): JSX.Element {
  const { token } = useContext(AuthContext);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [otpauthUrl, setOtpauthUrl] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (!token) return;
      const { ok, data } = await fetchMe(token);
      if (ok && data) {
        const payload: MePayload = data; // ← explicit use of MePayload
        setEnabled(Boolean(payload.twoFactorEnabled));
      }
    })();
  }, [token]);

  const start = async (): Promise<void> => {
    if (!token) return;
    setMsg("");
    const resp: { otpauthUrl: string; secret: string } = await mfaInit(token);
    setOtpauthUrl(resp.otpauthUrl);
    setSecret(resp.secret);
  };

  const confirm = async (): Promise<void> => {
    if (!token) return;
    const resp: { twoFactorEnabled: boolean; recoveryCodes?: string[] } = await mfaConfirm(token, code);
    setEnabled(Boolean(resp.twoFactorEnabled));
    setMsg("2FA enabled. Save your recovery codes if shown.");
  };

  const disable = async (): Promise<void> => {
    if (!token) return;
    await mfaDisable(token);
    setEnabled(false);
    setOtpauthUrl("");
    setSecret("");
    setCode("");
    setMsg("2FA disabled.");
  };

  return (
    <div className="card" style={{ marginTop: "1rem" }}>
      <h2>Two-Factor Authentication</h2>
      <div><strong>Status:</strong> {enabled ? "Enabled" : "Disabled"}</div>

      {!enabled && (
        <>
          {!otpauthUrl ? (
            <button onClick={start}>Enable 2FA</button>
          ) : (
            <>
              <div style={{ marginTop: ".5rem" }}>
                <div><strong>Secret:</strong> {secret}</div>
                <div style={{ wordBreak: "break-all" }}>
                  <strong>URL:</strong> {otpauthUrl}
                </div>
              </div>
              <div style={{ marginTop: ".5rem" }}>
                <input
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button onClick={confirm}>Confirm</button>
              </div>
            </>
          )}
        </>
      )}

      {enabled && (
        <button onClick={disable} style={{ marginTop: ".5rem" }}>
          Disable 2FA
        </button>
      )}

      {msg && <div className="authSuccess" style={{ marginTop: ".5rem" }}>{msg}</div>}
    </div>
  );
}