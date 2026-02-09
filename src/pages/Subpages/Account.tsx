import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageTab from "@/components/Shared/Navigation/PageTab";
import Header from "@/components/Shared/HeaderFooter/Header";
import { AuthContext } from "@/context/Auth/authContext";
import ProfileCard from "@/components/Account/ProfileCard";
import TwoFASetupCard from "@/components/Account/MFA/TwoFASetupCard";
import SecurityActions from "@/components/Account/SecurityActions";
import AdminTools from "@/components/Admin/AdminTools";

import "@/scss/MiscellaneousStyle/Account.scss";

export default function Account(): JSX.Element {
  const { token, username } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!token) {
    return (
      <PageTab title="Account">
        <Header text="Account" className="accountHeader" />

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

          <div className="AccountGate">Your session ended. Please sign in again.</div>
        </div>
      </PageTab>
    );
  }

  return (
    <PageTab title="Account">
      <Header text="Account" className="accountHeader" />

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
          <section className="AccountSection">
            <ProfileCard />
          </section>

          <section className="AccountSection">
            <TwoFASetupCard />
          </section>

          <section className="AccountSection">
            <SecurityActions />
          </section>

          <section className="AccountSection">
            <AdminTools />
          </section>

          {/* NEW: link into the submission workflow */}
          <section className="AccountSection AccountSection--full">
            <div className="card">
              <h2>Car Data</h2>
              <p className="AccountHint">
                Submit updates for missing/incorrect car data (stats, blueprints, etc.).
              </p>

              <Link
                to="/car-data-submission"
                state={{ from: "/account" }}
                className="AccountBackBtn"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
              >
                Open Car Data Submission →
              </Link>
            </div>
          </section>
        </main>
      </div>
    </PageTab>
  );
}