import { useState } from "react";
import { forgotPassword, forgotUsername } from "@/components/SignupLogin/api/accountAPI";

export default function SecurityActions() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string>("");

  const doForgotPw = async () => {
    setMsg("");
    await forgotPassword(email.toLowerCase());
    setMsg("If that email exists, a reset link has been sent.");
  };

  const doForgotUser = async () => {
    setMsg("");
    await forgotUsername(email.toLowerCase());
    setMsg("If that email exists, your username has been sent.");
  };

  return (
    <div className="card" style={{ marginTop: "1rem" }}>
      <h2>Security Actions</h2>
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ textTransform: "lowercase" }}
      />
      <div style={{ marginTop: ".5rem", display: "flex", gap: ".5rem" }}>
        <button onClick={doForgotPw}>Forgot Password</button>
        <button onClick={doForgotUser}>Forgot Username</button>
      </div>
      {msg && <div className="authInfo" style={{ marginTop: ".5rem" }}>{msg}</div>}
    </div>
  );
}