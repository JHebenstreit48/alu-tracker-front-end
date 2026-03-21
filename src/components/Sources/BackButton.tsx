import { useNavigate } from "react-router-dom";
import "@/scss/MiscellaneousStyle/Sources.scss";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      className="BackButton"
      onClick={() => navigate(-1)}
      aria-label="Go back to previous page"
    >
      ← Back
    </button>
  );
}