import { useEffect, useState } from "react";
import { confirmEmailChange } from "@/api/accountAPI";
import "@/scss/account/index.scss";

type Status = "loading" | "success" | "error";

export default function ConfirmEmailChangePage(): JSX.Element {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("Confirming your new email…");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Missing confirmation token.");
      return;
    }

    (async () => {
      try {
        await confirmEmailChange(token);
        setStatus("success");
        setMessage("Your email has been updated. You can now sign in with your new email.");
      } catch (e) {
        setStatus("error");
        setMessage(e instanceof Error ? e.message : "Failed to confirm email change.");
      }
    })();
  }, []);

  return (
    <div className="EmailChangePage">
      <div className="EmailChangeCard">
        <h2>Email Change</h2>
        <div className={status === "error" ? "authError" : "authSuccess"}>{message}</div>
        {status !== "loading" && (
          <a className="EmailChangeReturn" href="/">
            Return home
          </a>
        )}
      </div>
    </div>
  );
}