import { useState } from "react";
import { registerUser } from "@/components/SignupLogin/api/authAPI";
// import "@/SCSS/Auth/AuthModals.scss";

interface SignUpModalProps {
  onClose: () => void;
}

export default function SignUpModal({ onClose }: SignUpModalProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await registerUser(username, email, password);
    if (result.success) {
      setSuccessMsg("Account created! You can now log in.");
    } else {
      setErrorMsg(result.message || "Sign up failed");
    }
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
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMsg && <div className="authError">{errorMsg}</div>}
          {successMsg && <div className="authSuccess">{successMsg}</div>}
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
