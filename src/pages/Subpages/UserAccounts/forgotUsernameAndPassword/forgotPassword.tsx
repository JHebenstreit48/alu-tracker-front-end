import { useState } from "react";
import { forgotPassword, resetPassword } from "@/api/accountAPI";

type Step = "request" | "reset";

export default function ForgotPasswordPage(): JSX.Element {
  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get("token");

  const [step, setStep] = useState<Step>(urlToken ? "reset" : "request");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [needsMfa, setNeedsMfa] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const formatCode = (raw: string) => {
    const digitsOnly = raw.replace(/\D/g, "").slice(0, 6);
    return digitsOnly.length > 3
      ? `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3)}`
      : digitsOnly;
  };

  const doRequest = async () => {
    setMsg("");
    setErr("");
    setSubmitting(true);
    try {
      await forgotPassword(email.toLowerCase());
      setMsg("If that email exists, a reset link has been sent.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to send reset email");
    } finally {
      setSubmitting(false);
    }
  };

  const doReset = async () => {
    if (!urlToken) return;
    setMsg("");
    setErr("");
    setSubmitting(true);
    try {
      const res = await resetPassword(urlToken, newPassword, mfaCode.replace(/\s/g, "") || undefined);
      if (res.requires2fa) {
        setNeedsMfa(true);
        setMsg("Enter your 6-digit authenticator code to finish.");
        return;
      }
      setMsg("Password reset. You can now sign in with your new password.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to reset password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: "2rem", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
      <h2>Forgot Password</h2>

      {step === "request" && (
        <>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            style={{ textTransform: "lowercase" }}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
          <div style={{ marginTop: ".5rem" }}>
            <button onClick={doRequest} disabled={submitting}>
              {submitting ? "Sending…" : "Send Reset Link"}
            </button>
          </div>
        </>
      )}

      {step === "reset" && (
        <>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={submitting}
          />
          {needsMfa && (
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{3} ?\d{0,3}"
              placeholder="123 456"
              value={mfaCode}
              onChange={(e) => setMfaCode(formatCode(e.target.value))}
              maxLength={7}
              disabled={submitting}
              style={{ marginTop: ".5rem" }}
            />
          )}
          <div style={{ marginTop: ".5rem" }}>
            <button onClick={doReset} disabled={submitting}>
              {submitting ? "Resetting…" : "Reset Password"}
            </button>
          </div>
        </>
      )}

      {err && <div className="authError">{err}</div>}
      {msg && <div className="authSuccess">{msg}</div>}
    </div>
  );
}