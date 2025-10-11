import { useContext, useState } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import AuthModal from "@/components/SignupLogin/Modals/AuthModal";
import "@/scss/SignupLogin/AuthButtons.scss";

export default function AuthButtons(): JSX.Element {
  const { token, username, logout } = useContext(AuthContext);
  const [showAuth, setShowAuth] = useState<boolean>(false);

  return (
    <>
      {token ? (
        <div className="authWelcome" aria-live="polite">
          {/* Username acts as Account link */}
          <a
            href="/account"
            className="authWelcome__text accountLink"
            title="View your account"
          >
            {username}
          </a>

          <div className="logoutWrapper">
            <button
              onClick={logout}
              className="logout"
              aria-label="Log out"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="authControls">
          <button
            onClick={() => setShowAuth(true)}
            aria-haspopup="dialog"
            aria-controls="auth-modal"
          >
            Sign in
          </button>
        </div>
      )}

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} initialMode="login" />
      )}
    </>
  );
}