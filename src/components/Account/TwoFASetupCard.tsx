import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import { fetchMe, type MePayload } from "@/api/authAPI";
import { mfaInit, mfaConfirm, mfaDisable } from "@/api/accountAPI";

export default function TwoFASetupCard(): JSX.Element {
  const { token } = useContext(AuthContext);

  const [enabled, setEnabled] = useState<boolean>(false);
  const [otpauthUrl, setOtpauthUrl] = useState<string>(""); // QR only; never render raw value as text
  const [code, setCode] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (!token) return;
      const { ok, data } = await fetchMe(token);
      if (ok && data) {
        const me: MePayload = data;
        setEnabled(Boolean(me.twoFactorEnabled));
      }
    })();
  }, [token]);

  const start = async (): Promise<void> => {
    if (!token) return;
    setMsg(""); setErr(""); setCode("");
    const resp = await mfaInit(token); // returns { otpauthUrl, secret } but we intentionally do NOT show secret/URL
    setOtpauthUrl(resp.otpauthUrl);
  };

  const confirm = async (): Promise<void> => {
    if (!token) return;
    setErr(""); setMsg("");
    try {
      const resp = await mfaConfirm(token, code.trim());
      setEnabled(Boolean(resp.twoFactorEnabled));
      setMsg("2FA enabled. Save your recovery codes if shown.");
      // Clear sensitive state after enabling
      setOtpauthUrl("");
      setCode("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to enable 2FA");
    }
  };

  const disable = async (): Promise<void> => {
    if (!token) return;
    setErr(""); setMsg("");
    try {
      await mfaDisable(token);
      setEnabled(false);
      // Clear any in-progress setup data
      setOtpauthUrl("");
      setCode("");
      setMsg("2FA disabled.");
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

      {!enabled && (
        <>
          {!otpauthUrl ? (
            <button onClick={start} style={{ marginTop: ".5rem" }}>
              Enable 2FA
            </button>
          ) : (
            <>
              {/* QR only — do not reveal secret or raw otpauth URL */}
              <div style={{ marginTop: ".75rem" }}>
                <div style={{ marginBottom: ".4rem" }}>
                  <strong>Scan with your authenticator app:</strong>
                </div>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(otpauthUrl)}&size=220x220`}
                  width={220}
                  height={220}
                  alt="Scan this QR with your authenticator app"
                  style={{ borderRadius: 8 }}
                />
                <div className="AccountHint" style={{ marginTop: ".35rem" }}>
                  After scanning, enter the 6-digit code below to finish enabling 2FA.
                </div>
              </div>

              <div style={{ marginTop: ".75rem" }}>
                <input
                  placeholder="Enter 6-digit code"
                  inputMode="numeric"
                  pattern="\d*"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button onClick={confirm} style={{ marginLeft: ".5rem" }}>
                  Confirm
                </button>
              </div>
            </>
          )}
        </>
      )}

      {enabled && (
        <button onClick={disable} style={{ marginTop: ".75rem" }}>
          Disable 2FA
        </button>
      )}
    </div>
  );
}