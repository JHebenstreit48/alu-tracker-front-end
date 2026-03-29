import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTab from '@/components/Shared/Navigation/PageTab';
import Header from '@/components/Shared/HeaderFooter/Header';
import { AuthContext } from '@/context/Auth/authContext';
import { fetchPendingSubmissions, reviewSubmission } from '@/api/submissionReviewAPI';

interface CarPatch {
  [key: string]: unknown;
}

interface Submission {
  id: string;
  submitterUsername: string;
  submittedBy: string | null;
  cars: Record<string, CarPatch>;
  submitterNote: string;
  status: string;
  createdAt: { _seconds: number } | string;
}

export default function AdminSubmissions(): JSX.Element {
  const { token, roles } = useContext(AuthContext);
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const hasAdminAccess = roles.includes('owner') || roles.includes('admin');

  useEffect(() => {
    if (!token || !hasAdminAccess) return;
    void load();
  }, [token]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPendingSubmissions(token!);
      setSubmissions(data.submissions ?? []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const onReview = async (id: string, status: 'approved' | 'rejected') => {
    setBusy(id);
    setMsg(null);
    try {
      await reviewSubmission(token!, id, status);
      setMsg(`Submission ${status} successfully.`);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch (e: any) {
      setMsg(e?.message || 'Action failed');
    } finally {
      setBusy(null);
    }
  };

  const formatDate = (val: { _seconds: number } | string) => {
    if (!val) return 'Unknown';
    if (typeof val === 'string') return new Date(val).toLocaleString();
    return new Date(val._seconds * 1000).toLocaleString();
  };

  if (!token || !hasAdminAccess) {
    return (
      <PageTab title="Admin Submissions">
        <Header text="Admin Submissions" className="accountHeader" />
        <div className="AccountPage">
          <div className="AccountGate">Access denied. Admin role required.</div>
        </div>
      </PageTab>
    );
  }

  return (
    <PageTab title="Submission Review">
      <Header text="Submission Review" className="accountHeader" />

      <div className="AccountPage">
        <div className="AccountBackRow">
          <button
            className="AccountBackBtn"
            onClick={() => navigate('/account')}
            type="button"
          >
            ← Back
          </button>
        </div>

        <header className="AccountHeader">
          <h1 className="AccountTitle">Submission Review</h1>
          <p className="AccountSubtitle">
            Pending car data submissions awaiting approval.
          </p>
        </header>

        {msg && (
          <div className="CarDataFormMsg CarDataFormMsg--ok">{msg}</div>
        )}

        {loading && <p className="CarDataFormHint">Loading submissions…</p>}
        {error && <p className="CarDataFormError">{error}</p>}

        {!loading && !error && submissions.length === 0 && (
          <p className="CarDataFormHint">No pending submissions. You're all caught up!</p>
        )}

        <div className="AdminSubmissionsList">
          {submissions.map((s) => (
            <div key={s.id} className="card AdminSubmissionCard">
              <div className="AdminSubmissionMeta">
                <span>
                  <strong>Submitted by:</strong> {s.submitterUsername}
                  {s.submittedBy ? ` (${s.submittedBy})` : ' (guest)'}
                </span>
                <span>
                  <strong>Date:</strong> {formatDate(s.createdAt)}
                </span>
                <span>
                  <strong>ID:</strong> {s.id}
                </span>
              </div>

              <div className="AdminSubmissionCars">
                <strong>Cars ({Object.keys(s.cars).length}):</strong>{' '}
                {Object.keys(s.cars).join(', ')}
              </div>

              {s.submitterNote && (
                <div className="AdminSubmissionNote">
                  <strong>Note:</strong> {s.submitterNote}
                </div>
              )}

              <details className="AdminSubmissionDetails">
                <summary>View raw data</summary>
                <pre className="AdminSubmissionPre">
                  {JSON.stringify(s.cars, null, 2)}
                </pre>
              </details>

              <div className="CarDataFormRow">
                <button
                  type="button"
                  className="AdminToolsBtn"
                  onClick={() => onReview(s.id, 'approved')}
                  disabled={busy === s.id}
                >
                  {busy === s.id ? 'Processing…' : '✓ Approve'}
                </button>
                <button
                  type="button"
                  className="AdminToolsBtn AdminToolsBtn--danger"
                  onClick={() => onReview(s.id, 'rejected')}
                  disabled={busy === s.id}
                >
                  {busy === s.id ? 'Processing…' : '✗ Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTab>
  );
}