import type {
  ApiOk,
  CommentsListData,
  CreateCommentData,
} from '@/components/CarInformation/CarDetails/OtherComponents/Comments/types';

// Relative is fine in prod (via Netlify proxy); explicit in dev.
export const COMMENTS_BASE = (
  import.meta.env.VITE_COMMENTS_API_BASE_URL ??
  (import.meta.env.DEV ? 'http://127.0.0.1:3004' : '/api-comments')
).replace(/\/+$/, '');

export function join(base: string, path: string) {
  const b = base.replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

export async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

function isRec(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

export function apiErrorMessage(payload: unknown): string | null {
  if (!isRec(payload)) return null;
  const error = (payload as { error?: unknown }).error;
  if (!isRec(error)) return null;
  const msg = (error as { message?: unknown }).message;
  return typeof msg === 'string' ? msg : null;
}

function isCommentsListData(v: unknown): v is CommentsListData {
  if (!isRec(v)) return false;
  const comments = (v as Record<string, unknown>).comments;
  return Array.isArray(comments);
}

export function isCommentsOk(v: unknown): v is ApiOk<CommentsListData> {
  if (!isRec(v)) return false;
  const okVal = (v as Record<string, unknown>).ok;
  if (okVal !== true) return false;
  const data = (v as Record<string, unknown>).data;
  return isCommentsListData(data);
}

function isCreateData(v: unknown): v is CreateCommentData {
  if (!isRec(v)) return false;
  const r = v as Record<string, unknown>;
  const id = r.id;
  const status = r.status;
  const editKey = r.editKey;
  const statusOk =
    status === undefined || status === 'visible' || status === 'pending' || status === 'hidden';
  return (
    typeof id === 'string' && statusOk && (editKey === undefined || typeof editKey === 'string')
  );
}

export function isCreateOk(v: unknown): v is ApiOk<CreateCommentData> {
  if (!isRec(v)) return false;
  const okVal = (v as Record<string, unknown>).ok;
  if (okVal !== true) return false;
  const data = (v as Record<string, unknown>).data;
  return isCreateData(data);
}

export function isOk(v: unknown): v is { ok: true } {
  return isRec(v) && (v as Record<string, unknown>).ok === true;
}

export async function getComments(normalizedKey: string) {
  const r = await fetch(join(COMMENTS_BASE, `api/comments/${encodeURIComponent(normalizedKey)}`), {
    cache: 'no-store',
  });
  const j = await safeJson(r);
  return { r, j };
}

export async function postComment(body: unknown, headers: HeadersInit) {
  const r = await fetch(join(COMMENTS_BASE, 'api/comments'), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const j = await safeJson(r);
  return { r, j };
}

export async function adminCall(
  method: 'PATCH' | 'DELETE',
  id: string,
  adminKey: string,
  action?: 'visible' | 'hide'
) {
  const url =
    method === 'DELETE'
      ? join(COMMENTS_BASE, `api/comments/${encodeURIComponent(id)}`)
      : join(COMMENTS_BASE, `api/comments/${encodeURIComponent(id)}/${action}`);
  const r = await fetch(url, { method, headers: { 'x-admin-key': adminKey } });
  const j = await safeJson(r);
  return { r, j };
}

export async function selfEdit(id: string, newBody: string, key: string) {
  const r = await fetch(join(COMMENTS_BASE, `api/comments/${encodeURIComponent(id)}/self`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: newBody, editKey: key }),
  });
  const j = await safeJson(r);
  return { r, j };
}

export async function selfDelete(id: string, key: string) {
  const r = await fetch(join(COMMENTS_BASE, `api/comments/${encodeURIComponent(id)}/self`), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ editKey: key }),
  });
  const j = await safeJson(r);
  return { r, j };
}