import { useState, useContext } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import { loginUser } from "@/components/SignupLogin/api/authAPI";
import "@/scss/SignupLogin/LoginSignupModal.scss";

interface LoginModalProps { onClose: () => void }

export default function LoginModal({ onClose }: LoginModalProps) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [needs2fa, setNeeds2fa] = useState<{ userId: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const result = await loginUser(email, password);

    if (!result.success) {
      setErrorMsg(result.message || "Login failed");
      return;
    }
    if ("requires2fa" in result && result.requires2fa) {
      setNeeds2fa({ userId: result.userId });
      return; // MFA step handled later (Account page flow)
    }
    if ("token" in result && result.token && result.username) {
      login(result.token, result.username);
      onClose();
    } else {
      setErrorMsg("Unexpected response from server.");
    }
  };

  return (
    <div className="authModal">
      <div className="authModalContent">
        <div className="authModalHeader">
          Login
          <button className="closeButton" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="authForm">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="passwordWrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="togglePasswordButton"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁" : "🙈"}
            </button>
          </div>

          {needs2fa && (
            <div className="authInfo">
              2FA required — we’ll complete this on the Account page right after we ship it.
            </div>
          )}
          {errorMsg && <div className="authError">{errorMsg}</div>}

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}