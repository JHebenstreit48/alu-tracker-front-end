import { useMemo, useState } from "react";
import PageTab from "@/components/Shared/PageTab";
import Header from "@/components/Shared/Header";
import FeedbackAdminPanel from "@/components/Shared/FeedbackAdminPanel";
import "@/scss/MiscellaneousStyle/Feedback.scss";

type Category = "bug" | "feature" | "content" | "other";

type ErrorPayload = { code: string; message: string; details?: unknown };
type ApiOkOnly = { ok: true };
type ApiErr = { ok: false; error: ErrorPayload };
type ApiResponse = ApiOkOnly | ApiErr;

const API_BASE =
  import.meta.env.VITE_COMMENTS_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://127.0.0.1:3004";

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function isApiResponse(v: unknown): v is ApiResponse {
  if (!isObject(v) || typeof v.ok !== "boolean") return false;
  if (v.ok) return true;
  if (!("error" in v) || !isObject(v.error)) return false;
  return typeof (v.error as Record<string, unknown>).message === "string";
}
function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (isObject(e) && typeof e.message === "string") return e.message;
  return "Unexpected error";
}

export default function Feedback() {
  const [category, setCategory] = useState<Category>("bug");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(localStorage.getItem("feedbackEmail") || "");
  const [includeUrl, setIncludeUrl] = useState(true);
  const [hp, setHp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxLen = 3000;
  const remaining = maxLen - message.length;
  const canSubmit = message.trim().length >= 5 && message.length <= maxLen;

  const showAdmin = useMemo(() => {
    // Only render admin panel if URL has ?admin=1 (keeps it hidden for normal users)
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("admin") === "1";
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        category,
        message: message.trim(),
        email: email || undefined,
        pageUrl: includeUrl ? window.location.href : undefined,
        hp
      };
      const r = await fetch(`${API_BASE}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const j: unknown = await r.json();
      if (!r.ok || !isApiResponse(j) || j.ok !== true) {
        const msg =
          (isObject(j) &&
            isObject((j as Record<string, unknown>).error) &&
            typeof ((j as Record<string, unknown>).error as Record<string, unknown>).message ===
              "string" &&
            String(
              ((j as Record<string, unknown>).error as Record<string, unknown>).message
            )) || "Failed to send feedback.";
        throw new Error(msg);
      }
      localStorage.setItem("feedbackEmail", email);
      setDone(true);
      setMessage("");
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageTab title="Feedback">
      <Header text="Feedback" />

      <div className="feedback-wrap">
        <div className="feedback-page">
          <p className="subtitle">Spotted a bug? Have a suggestion? Tell us below.</p>

          <form className="feedback-form" onSubmit={onSubmit} noValidate>
            <div className="row">
              <label htmlFor="fb-category">Category</label>
              <select
                id="fb-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                <option value="bug">Bug</option>
                <option value="feature">Feature</option>
                <option value="content">Content</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="row">
              <label htmlFor="fb-message">Message</label>
              <textarea
                id="fb-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={maxLen}
                rows={8}
                placeholder="What happened? What would you like to see?"
              />
              <div className={`char-count ${remaining < 0 ? "over" : ""}`}>
                {remaining} / {maxLen}
              </div>
            </div>

            <div className="row grid">
              <div className="col">
                <label htmlFor="fb-email">Email (optional)</label>
                <input
                  id="fb-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={254}
                  placeholder="So we can follow up (optional)"
                  autoComplete="email"
                />
              </div>
              <div className="col checkbox">
                <label htmlFor="fb-include-url">
                  <input
                    id="fb-include-url"
                    type="checkbox"
                    checked={includeUrl}
                    onChange={(e) => setIncludeUrl(e.target.checked)}
                  />
                  Include current page URL
                </label>
              </div>
            </div>

            {/* Honeypot */}
            <input
              type="text"
              name="hp"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              className="hp"
              aria-hidden="true"
              tabIndex={-1}
              autoComplete="off"
            />

            {error && <div className="error">{error}</div>}
            {done && <div className="success">Thanks — we’ve received your feedback!</div>}

            <button className="submit" type="submit" disabled={!canSubmit || submitting}>
              {submitting ? "Sending…" : "Send feedback"}
            </button>
          </form>

          {/* Hidden unless ?admin=1 */}
          {showAdmin && <FeedbackAdminPanel />}
        </div>
      </div>
    </PageTab>
  );
}