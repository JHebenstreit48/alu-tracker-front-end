import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import PageTab from "@/components/Shared/PageTab";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import ProfileCard from "@/components/Account/ProfileCard";
import TwoFASetupCard from "@/components/Account/TwoFASetupCard";
import SecurityActions from "@/components/Account/SecurityActions";
import "@/scss/MiscellaneousStyle/Account.scss";

export default function Account(): JSX.Element {
  const { token, username } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!token) {
    return (
      <PageTab title="Account">
        <div className="AccountPage">
          <div className="AccountBackRow">
            <button
              className="AccountBackBtn"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              type="button"
            >
              ← Back
            </button>
          </div>

          <div className="AccountGate">
            Your session ended. Please sign in again.
          </div>
        </div>
      </PageTab>
    );
  }

  return (
    <PageTab title="Account">
      <div className="AccountPage">
        <div className="AccountBackRow">
          <button
            className="AccountBackBtn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            type="button"
          >
            ← Back
          </button>
        </div>

        <header className="AccountHeader">
          <h1 className="AccountTitle">Account</h1>
          {username && (
            <p className="AccountSubtitle">
              Signed in as <strong>{username}</strong>
            </p>
          )}
        </header>

        <main className="AccountGrid">
          <section className="AccountSection"><ProfileCard /></section>
          <section className="AccountSection"><TwoFASetupCard /></section>
          <section className="AccountSection"><SecurityActions /></section>
        </main>
      </div>
    </PageTab>
  );
}