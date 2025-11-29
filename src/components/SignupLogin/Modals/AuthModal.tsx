import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import { loginUser, registerUser } from "@/api/authAPI";
import { mfaLogin } from "@/api/accountAPI";
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

  // MFA second step
  const [needs2fa, setNeeds2fa] = useState<{ userId: string } | null>(null);
  const [mfaCode, setMfaCode] = useState<string>("");

  const [submitting, setSubmitting] = useState<boolean>(false);

  // After successful auth, wait for first hydrate to complete before closing
  const [postAuth, setPostAuth] = useState<boolean>(false);

  useEffect(() => {
    if (postAuth && token && syncReady) {
      onClose(); // close once /users/me + syncFromAccount finish
    }
  }, [postAuth, token, syncReady, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); setInfoMsg("");

    // If we're in the MFA step, verify code now
    if (needs2fa) {
      if (mfaCode.trim().length < 6) {
        setErrorMsg("Enter your 6-digit code.");
        return;
      }
      setSubmitting(true);
      try {
        const res = await mfaLogin(needs2fa.userId, mfaCode.trim());
        login(res.token, res.username);
        setPostAuth(true);
        setInfoMsg("Signing you in… syncing your garage.");
      } catch (e) {
        setErrorMsg(e instanceof Error ? e.message : "Invalid or expired 2FA code");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Otherwise normal login/signup
    setSubmitting(true);
    try {
      if (mode === "login") {
        const res = await loginUser(email.toLowerCase(), password);
        if (!res.success) { setErrorMsg(res.message || "Login failed"); return; }

        if ("requires2fa" in res && res.requires2fa) {
          setNeeds2fa({ userId: res.userId });
          setInfoMsg("Enter your 6-digit code to finish signing in.");
          return; // wait for MFA verify
        }

        if ("token" in res && res.token && res.username) {
          login(res.token, res.username);
          setPostAuth(true);              // wait for hydrate
          setInfoMsg("Signing you in… syncing your garage.");
          return;
        }
        setErrorMsg("Unexpected response from server.");
      } else {
        const reg = await registerUser(username.trim(), email.toLowerCase(), password);
        if (!reg.success) { setErrorMsg(reg.message || "Sign up failed"); return; }

        if (reg.token && reg.username) {
          login(reg.token, reg.username);
          setPostAuth(true);              // wait for hydrate
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
              aria-selected={mode === "login" && !needs2fa}
              className={mode === "login" && !needs2fa ? "tab active" : "tab"}
              onClick={() => { if (!submitting && !postAuth && !needs2fa) setMode("login"); }}
              disabled={submitting || postAuth || !!needs2fa}
            >
              Sign in
            </button>
            <button
              role="tab"
              aria-selected={mode === "signup"}
              className={mode === "signup" ? "tab active" : "tab"}
              onClick={() => { if (!submitting && !postAuth && !needs2fa) setMode("signup"); }}
              disabled={submitting || postAuth || !!needs2fa}
            >
              Create account
            </button>
          </div>
          <button
            className="closeButton"
            onClick={onClose}
            aria-label="Close"
            disabled={submitting || postAuth}
            title={postAuth ? "Finishing first sync…" : "Close"}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="authForm">
          {/* Signup-only field */}
          {mode === "signup" && !needs2fa && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting || postAuth}
            />
          )}

          {/* Hide email/password during MFA step */}
          {!needs2fa && (
            <>
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
            </>
          )}

          {/* MFA second-step */}
          {needs2fa && (
            <>
              <div className="authInfo">
                2FA enabled on your account. Enter your 6-digit code to finish signing in.
              </div>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                placeholder="6-digit code"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                disabled={submitting || postAuth}
              />
            </>
          )}

          {errorMsg && <div className="authError">{errorMsg}</div>}
          {infoMsg && <div className="authSuccess">{infoMsg}</div>}

          <button type="submit" disabled={submitting || postAuth}>
            {needs2fa
              ? (submitting ? "Verifying…" : "Verify code")
              : (submitting
                  ? (mode === "login" ? "Signing in…" : "Creating account…")
                  : (mode === "login" ? "Sign in" : "Create account"))}
          </button>

          {mode === "login" && !needs2fa && (
            <div className="authLinks">
              <a href="/account">Forgot password?</a>
              <a href="/account">Forgot username?</a>
            </div>
          )}
        </form>

        {/* Inline footer status while waiting for first hydrate */}
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