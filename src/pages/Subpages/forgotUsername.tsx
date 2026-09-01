import { useState } from "react";
import { forgotUsername } from "@/api/accountAPI";

export default function ForgotUsernamePage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const doRequest = async () => {
    setMsg("");
    setErr("");
    setSubmitting(true);
    try {
      await forgotUsername(email.toLowerCase());
      setMsg("If that email exists, your username has been sent.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to send username email");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: "2rem", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
      <h2>Forgot Username</h2>
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
          {submitting ? "Sending…" : "Send Username"}
        </button>
      </div>
      {err && <div className="authError">{err}</div>}
      {msg && <div className="authSuccess">{msg}</div>}
    </div>
  );
}