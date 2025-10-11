import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import { fetchMe, type MePayload } from "@/components/SignupLogin/api/authAPI";
import { mfaInit, mfaConfirm, mfaDisable } from "@/components/SignupLogin/api/accountAPI";

export default function TwoFASetupCard(): JSX.Element {
  const { token } = useContext(AuthContext);
  const [enabled, setEnabled] = useState<boolean>(false);

  // Setup payload (kept in state only while setting up)
  const [otpauthUrl, setOtpauthUrl] = useState<string>("");
  const [secret, setSecret] = useState<string>("");

  // UX state
  const [code, setCode] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [err, setErr] = useState<string>("");

  // Visibility toggles (masked by default)
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [showUrl, setShowUrl] = useState<boolean>(false);

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
    setShowSecret(false); setShowUrl(false);
    const resp = await mfaInit(token); // normalized to { otpauthUrl, secret }
    setOtpauthUrl(resp.otpauthUrl);
    setSecret(resp.secret);
  };

  const confirm = async (): Promise<void> => {
    if (!token) return;
    setErr(""); setMsg("");
    try {
      const resp = await mfaConfirm(token, code.trim());
      setEnabled(Boolean(resp.twoFactorEnabled));
      setMsg("2FA enabled. Save your recovery codes if shown.");
      // security hygiene: clear sensitive fields
      setOtpauthUrl(""); setSecret(""); setCode("");
      setShowSecret(false); setShowUrl(false);
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
      // clear any in-progress setup data
      setOtpauthUrl(""); setSecret(""); setCode("");
      setShowSecret(false); setShowUrl(false);
      setMsg("2FA disabled.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to disable 2FA");
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setMsg("Copied to clipboard.");
      // auto-clear message after a moment
      window.setTimeout(() => setMsg(""), 1200);
    } catch {
      setErr("Unable to copy to clipboard.");
      window.setTimeout(() => setErr(""), 1500);
    }
  };

  // Mask helpers
  const mask = (value: string, keep = 4): string => {
    if (!value) return "";
    if (value.length <= keep) return "*".repeat(value.length);
    return value.slice(0, keep) + "…" + "*".repeat(Math.max(0, value.length - keep - 1));
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
              {/* QR first: preferred setup path */}
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
              </div>

              {/* Secret (masked by default) */}
              <div style={{ marginTop: ".75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
                  <strong>Secret:</strong>
                  <span style={{ wordBreak: "break-all", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                    {showSecret ? secret : mask(secret)}
                  </span>
                </div>
                <div style={{ display: "flex", gap: ".5rem", marginTop: ".35rem", flexWrap: "wrap" }}>
                  <button type="button" onClick={() => setShowSecret(s => !s)}>
                    {showSecret ? "Hide" : "Reveal"}
                  </button>
                  <button type="button" onClick={() => copy(secret)}>Copy</button>
                </div>
              </div>

              {/* otpauth URL (masked; rarely needed) */}
              <div style={{ marginTop: ".75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
                  <strong>URL:</strong>
                  <span style={{ wordBreak: "break-all", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                    {showUrl ? otpauthUrl : mask(otpauthUrl, 12)}
                  </span>
                </div>
                <div style={{ display: "flex", gap: ".5rem", marginTop: ".35rem", flexWrap: "wrap" }}>
                  <button type="button" onClick={() => setShowUrl(s => !s)}>
                    {showUrl ? "Hide" : "Reveal"}
                  </button>
                  <button type="button" onClick={() => copy(otpauthUrl)}>Copy</button>
                </div>
                <div className="AccountHint" style={{ marginTop: ".35rem" }}>
                  Tip: Most authenticator apps only need the QR. Revealing the secret/URL is optional.
                </div>
              </div>

              {/* Confirmation code */}
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