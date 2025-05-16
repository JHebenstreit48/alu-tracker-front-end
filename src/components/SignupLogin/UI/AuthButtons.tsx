import { useContext, useState } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import LoginModal from "@/components/SignupLogin/Modals/Login";
import SignUpModal from "@/components/SignupLogin/Modals/Signup";

export default function AuthButtons() {
  const { token, username, logout } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <>
      {token ? (
        <div className="authWelcome">
          Welcome, {username}! <button onClick={logout}>Logout</button>
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
