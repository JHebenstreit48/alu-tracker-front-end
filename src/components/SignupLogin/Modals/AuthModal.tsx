import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import { loginUser, registerUser } from "@/components/SignupLogin/api/authAPI";
import "@/scss/SignupLogin/LoginSignupModal.scss";

type Mode = "login" | "signup";

interface Props {
  onClose: () => void;
  initialMode?: Mode;
}

export default function AuthModal({ onClose, initialMode = "login" }: Props): JSX.Element {
  const { login, syncReady, token } = useContext(AuthContext);
  const [mode, setMode] = useState<Mode>(initialMode);

  // shared fields
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // signup-only
  const [username, setUsername] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [infoMsg, setInfoMsg] = useState<string>("");
  const [needs2fa, setNeeds2fa] = useState<{ userId: string } | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // NEW: after successful auth, wait for first hydrate to complete before closing
  const [postAuth, setPostAuth] = useState<boolean>(false);

  useEffect(() => {
    if (postAuth && token && syncReady) {
      onClose(); // close as soon as the first /users/me + syncFromAccount are done
    }
  }, [postAuth, token, syncReady, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); setInfoMsg(""); setNeeds2fa(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        const res = await loginUser(email.toLowerCase(), password);
        if (!res.success) { setErrorMsg(res.message || "Login failed"); return; }

        if ("requires2fa" in res && res.requires2fa) {
          setNeeds2fa({ userId: res.userId });
          return; // Optional: add code-entry step here later
        }

        if ("token" in res && res.token && res.username) {
          login(res.token, res.username);
          setPostAuth(true);           // ← wait for hydrate
          setInfoMsg("Signing you in… syncing your garage.");
          return;
        }
        setErrorMsg("Unexpected response from server.");
      } else {
        const reg = await registerUser(username.trim(), email.toLowerCase(), password);
        if (!reg.success) { setErrorMsg(reg.message || "Sign up failed"); return; }

        if (reg.token && reg.username) {
          login(reg.token, reg.username);
          setPostAuth(true);           // ← wait for hydrate
          setInfoMsg("Creating your account… syncing your garage.");
          return;
        }
        setInfoMsg("Account created! Please sign in.");
        setMode("login");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="authModal" role="dialog" aria-modal="true" aria-label="Authentication" id="auth-modal">
      <div className="authModalContent">
        <div className="authModalHeader">
          <div className="tabRow" role="tablist" aria-label="Auth tabs">
            <button
              role="tab"
              aria-selected={mode === "login"}
              className={mode === "login" ? "tab active" : "tab"}
              onClick={() => setMode("login")}
              disabled={submitting || postAuth}
            >
              Sign in
            </button>
            <button
              role="tab"
              aria-selected={mode === "signup"}
              className={mode === "signup" ? "tab active" : "tab"}
              onClick={() => setMode("signup")}
              disabled={submitting || postAuth}
            >
              Create account
            </button>
          </div>
          <button
            className="closeButton"
            onClick={onClose}
            aria-label="Close"
            disabled={submitting || postAuth} // lock close while we hydrate
            title={postAuth ? "Finishing first sync…" : "Close"}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="authForm">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting || postAuth}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            style={{ textTransform: "lowercase" }}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting || postAuth}
          />

          <div className="passwordWrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting || postAuth}
            />
            <button
              type="button"
              className="togglePasswordButton"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={submitting || postAuth}
            >
              {showPassword ? "👁" : "🙈"}
            </button>
          </div>

          {needs2fa && (
            <div className="authInfo">
              2FA required — we’ll complete this on the Account page (or add the code step here next).
            </div>
          )}
          {errorMsg && <div className="authError">{errorMsg}</div>}
          {infoMsg && <div className="authSuccess">{infoMsg}</div>}

          <button type="submit" disabled={submitting || postAuth}>
            {submitting
              ? (mode === "login" ? "Signing in…" : "Creating account…")
              : (mode === "login" ? "Sign in" : "Create account")}
          </button>

          {mode === "login" && (
            <div className="authLinks">
              <a href="/account">Forgot password?</a>
              <a href="/account">Forgot username?</a>
            </div>
          )}
        </form>

        {/* NEW: inline footer status while waiting for first hydrate */}
        {postAuth && (
          <div className="authSyncFooter" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true" />
            <span>Syncing your garage…</span>
          </div>
        )}
      </div>
    </div>
  );
}