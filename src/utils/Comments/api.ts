import type {
  ApiOk,
  CommentsListData,
  CreateCommentData,
} from "@/interfaces/Comments";

// Resolve base URL for comments/feedback API.
// No localhost fallback. You MUST configure this.
export const COMMENTS_BASE = (() => {
  const envBase =
    import.meta.env.VITE_COMMENTS_API_BASE_URL ??
    import.meta.env.VITE_PLATFORM_API_BASE_URL;

  // If not set, fail loudly so you notice.
  if (!envBase) {
    console.error(
      "[Comments] Missing VITE_COMMENTS_API_BASE_URL or VITE_PLATFORM_API_BASE_URL"
    );
    throw new Error(
      "COMMENTS_BASE not configured. Set VITE_COMMENTS_API_BASE_URL or VITE_PLATFORM_API_BASE_URL."
    );
  }

  return envBase.replace(/\/+$/, "");
})();

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

/* ---------- Type guards ---------- */

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