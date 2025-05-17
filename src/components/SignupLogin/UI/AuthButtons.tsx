import { useContext, useState } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import LoginModal from "@/components/SignupLogin/Modals/Login";
import SignUpModal from "@/components/SignupLogin/Modals/Signup";

import "@/SCSS/MiscellaneousStyle/AuthButtons.scss";

export default function AuthButtons() {
  const { token, username, logout } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <>
      {token ? (
        <div className="authWrapper">
          <div className="authWelcome">Welcome, {username}!</div>
          <div className="logoutWrapper">
            <button onClick={logout} className="logout">
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="authControls">
          <button onClick={() => setShowLogin(true)}>Login</button>
          <button onClick={() => setShowSignUp(true)}>Sign Up</button>
        </div>
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showSignUp && <SignUpModal onClose={() => setShowSignUp(false)} />}
    </>
  );
}
