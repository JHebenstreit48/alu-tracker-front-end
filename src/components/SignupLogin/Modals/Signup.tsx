import { useState, useContext } from "react";
import { registerUser } from "@/components/SignupLogin/api/authAPI";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import "@/scss/SignupLogin/LoginSignupModal.scss";

interface SignUpModalProps { onClose: () => void }

export default function SignUpModal({ onClose }: SignUpModalProps) {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); setSuccessMsg("");
    const result = await registerUser(username, email.toLowerCase(), password);

    if (!result.success) {
      setErrorMsg(result.message || "Sign up failed");
      return;
    }
    // Auto-login using token returned by register
    if (result.token && result.username) {
      login(result.token, result.username);
      onClose();
      return;
    }
    // Fallback (should not happen): show success but don’t auto-login
    setSuccessMsg("Account created! Please log in.");
  };

  return (
    <div className="authModal">
      <div className="authModalContent">
        <div className="authModalHeader">
          Sign Up
          <button className="closeButton" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="authForm">
          <input
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            style={{ textTransform: "lowercase" }}
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

          {errorMsg && <div className="authError">{errorMsg}</div>}
          {successMsg && <div className="authSuccess">{successMsg}</div>}
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}