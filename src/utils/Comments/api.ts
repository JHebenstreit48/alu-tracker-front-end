import type {
  ApiOk,
  CommentsListData,
  CreateCommentData,
} from "@/interfaces/Comments";

// Comments API base:
// - Uses VITE_CARS_BACKEND if set
// - Otherwise falls back to same-origin (""), so fetch("/api/comments/...").
const rawBase = import.meta.env.VITE_CARS_BACKEND ?? "";
export const COMMENTS_BASE = rawBase.replace(/\/+$/, "");

const join = (base: string, path: string): string => {
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
};

const isRec = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

export async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export function apiErrorMessage(payload: unknown): string | null {
  if (!isRec(payload)) return null;
  const error = (payload as { error?: unknown }).error;
  if (!isRec(error)) return null;
  const msg = (error as { message?: unknown }).message;
  return typeof msg === "string" ? msg : null;
}

function isCommentsListData(v: unknown): v is CommentsListData {
  if (!isRec(v)) return false;
  const comments = (v as { comments?: unknown }).comments;
  return Array.isArray(comments);
}

export function isCommentsOk(v: unknown): v is ApiOk<CommentsListData> {
  if (!isRec(v)) return false;
  if ((v as { ok?: unknown }).ok !== true) return false;
  const data = (v as { data?: unknown }).data;
  return isCommentsListData(data);
}

function isCreateData(v: unknown): v is CreateCommentData {
  if (!isRec(v)) return false;

  const { id, status, editKey } = v as {
    id?: unknown;
    status?: unknown;
    editKey?: unknown;
  };

  const statusOk =
    status === undefined ||
    status === "visible" ||
    status === "pending" ||
    status === "hidden";

  return (
    typeof id === "string" &&
    statusOk &&
    (editKey === undefined || typeof editKey === "string")
  );
}

export function isCreateOk(v: unknown): v is ApiOk<CreateCommentData> {
  if (!isRec(v)) return false;
  if ((v as { ok?: unknown }).ok !== true) return false;
  const data = (v as { data?: unknown }).data;
  return isCreateData(data);
}

export function isOk(v: unknown): v is { ok: true } {
  return isRec(v) && (v as { ok?: unknown }).ok === true;
}

/* ---------- API calls ---------- */

export async function getComments(normalizedKey: string) {
  const r = await fetch(
    join(COMMENTS_BASE, `/api/comments/${encodeURIComponent(normalizedKey)}`),
    { cache: "no-store" }
  );
  const j = await safeJson(r);
  return { r, j };
}

export async function postComment(body: unknown, headers: HeadersInit) {
  const r = await fetch(join(COMMENTS_BASE, "/api/comments"), {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const j = await safeJson(r);
  return { r, j };
}

export async function adminCall(
  method: "PATCH" | "DELETE",
  id: string,
  adminKey: string,
  action?: "visible" | "hide"
) {
  const url =
    method === "DELETE"
      ? join(COMMENTS_BASE, `/api/comments/${encodeURIComponent(id)}`)
      : join(
          COMMENTS_BASE,
          `/api/comments/${encodeURIComponent(id)}/${action}`
        );

  const r = await fetch(url, {
    method,
    headers: { "x-admin-key": adminKey },
  });
  const j = await safeJson(r);
  return { r, j };
}

export async function selfEdit(id: string, newBody: string, key: string) {
  const r = await fetch(
    join(COMMENTS_BASE, `/api/comments/${encodeURIComponent(id)}/self`),
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: newBody, editKey: key }),
    }
  );
  const j = await safeJson(r);
  return { r, j };
}

export async function selfDelete(id: string, key: string) {
  const r = await fetch(
    join(COMMENTS_BASE, `/api/comments/${encodeURIComponent(id)}/self`),
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ editKey: key }),
    }
  );
  const j = await safeJson(r);
  return { r, j };
}