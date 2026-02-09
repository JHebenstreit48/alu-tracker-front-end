import { useContext, useState } from 'react';
import { AuthContext } from '@/context/Auth/authContext';
import { bootstrapOwner } from '@/api/adminAPI';

type BootstrapResp =
  | { ok: true; userId: string; roles: string[] }
  | { message?: string; ownerUserId?: string; userId?: string; roles?: string[] };

export default function AdminTools(): JSX.Element | null {
  const { token, roles, refreshMe } = useContext(AuthContext);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  if (!token) return null;

  const hasAdminAccess = roles.includes('owner') || roles.includes('admin');

  const onBootstrap = async () => {
    setBusy(true);
    setMsg(null);
    setErr(null);

    try {
      const { ok, data } = await bootstrapOwner(token);
      const d = data as BootstrapResp;

      if (ok) {
        const gotRoles = (d as any)?.roles;
        setMsg(
          `Owner bootstrap complete. Roles: ${
            Array.isArray(gotRoles) ? gotRoles.join(', ') : 'updated'
          }`
        );

        // ✅ try to reflect roles immediately in UI
        await refreshMe();
        return;
      }

      const message =
        (d as any)?.message || 'Bootstrap failed (this usually means it was already bootstrapped).';
      const ownerUserId = (d as any)?.ownerUserId;

      setErr(ownerUserId ? `${message} Owner userId: ${ownerUserId}` : message);
    } catch (e: any) {
      setErr(e?.message || 'Bootstrap failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card AdminTools">
      <h2 className="AdminToolsTitle">Admin Tools</h2>

      <div className="AdminToolsBody">
        <p className="AdminToolsRoles">
          Roles: <strong>{roles.length ? roles.join(', ') : 'user'}</strong>
        </p>

        {hasAdminAccess ? (
          <p className="AdminToolsHint">
            You already have admin access. (Nice. The bouncers know you.)
          </p>
        ) : (
          <>
            <p className="AdminToolsHint">
              Not an admin yet. If you’re the project owner, you can bootstrap the owner role one
              time.
            </p>

            <button
              type="button"
              className="AdminToolsBtn"
              onClick={onBootstrap}
              disabled={busy}
            >
              {busy ? 'Bootstrapping...' : 'Bootstrap Owner (one-time)'}
            </button>
          </>
        )}

        {msg && <div className="AdminToolsMsg AdminToolsMsg--ok">{msg}</div>}
        {err && <div className="AdminToolsMsg AdminToolsMsg--err">{err}</div>}
      </div>
    </div>
  );
}