import { useContext, useState } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import LoginModal from "@/components/SignupLogin/Modals/Login";
import SignUpModal from "@/components/SignupLogin/Modals/Signup";

import "@/scss/SignupLogin/AuthButtons.scss";

export default function AuthButtons() {
  const { token, username, logout } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <>
      {token ? (
        <div className="authWelcome" aria-live="polite">
          <span className="authWelcome__text">Welcome, {username}!</span>
          <div className="logoutWrapper">
            <button onClick={logout} className="logout" aria-label="Log out">
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="authControls">
          <button onClick={() => setShowLogin(true)} aria-haspopup="dialog" aria-controls="login-modal">
            Login
          </button>
          <button onClick={() => setShowSignUp(true)} aria-haspopup="dialog" aria-controls="signup-modal">
            Sign Up
          </button>
        </div>
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showSignUp && <SignUpModal onClose={() => setShowSignUp(false)} />}
    </>
  );
}