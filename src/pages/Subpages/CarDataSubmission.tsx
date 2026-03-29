import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import PageTab from "@/components/Shared/Navigation/PageTab";
import Header from "@/components/Shared/HeaderFooter/Header";
import { AuthContext } from "@/context/Auth/authContext";
import CarDataForm from "@/components/CarDataForm/Form/CarDataForm";

import "@/scss/CarDataForm/DataForm.scss";

export default function CarDataSubmission(): JSX.Element {
  const { token, syncReady, roles } = useContext(AuthContext);
  const navigate = useNavigate();

  const onBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <PageTab title="Car Data Submission">
      <Header text="Car Data Submission" className="accountHeader" />

      <div className="CarDataSubmissionPage">
        <div className="CarDataSubmissionBackRow">
          <button
            className="CarDataSubmissionBackBtn"
            onClick={onBack}
            aria-label="Go back"
            type="button"
          >
            ← Back
          </button>
        </div>

        {!syncReady ? (
          <div className="CarDataSubmissionGate">Loading…</div>
        ) : (
          <>
            <header className="CarDataSubmissionHeader">
              <h1 className="CarDataSubmissionTitle">
                Car Data Submission
              </h1>
              <p className="CarDataSubmissionSubtitle">
                Select cars, edit fields, and submit a review request.
                {token && roles.length > 0 && (
                  <br />
                )}
                {token && (
                  <span className="CarDataSubmissionMeta">
                    Roles:{" "}
                    <strong>
                      {roles.length ? roles.join(", ") : "user"}
                    </strong>
                  </span>
                )}
              </p>
            </header>

            <CarDataForm />
          </>
        )}
      </div>
    </PageTab>
  );
}