import type {
    ApiOk,
    CommentsListData,
    CreateCommentData,
  } from "@/interfaces/Comments";
  
  const COMMENTS_BASE = (
    import.meta.env.VITE_PLATFORM_API_BASE_URL ??
    import.meta.env.VITE_COMMENTS_API_BASE_URL ??
    (import.meta.env.DEV ? "http://127.0.0.1:3004" : "/api-comments")
  ).replace(/\/+$/, "");
  
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
  
    const errorVal = (payload as { error?: unknown }).error;
    if (!isRec(errorVal)) return null;
  
    const msg = (errorVal as { message?: unknown }).message;
    return typeof msg === "string" ? msg : null;
  }
  
  function isCommentsListData(v: unknown): v is CommentsListData {
    if (!isRec(v)) return false;
    const comments = (v as { comments?: unknown }).comments;
    return Array.isArray(comments);
  }
  
  export function isCommentsOk(v: unknown): v is ApiOk<CommentsListData> {
    if (!isRec(v)) return false;
  
    const okVal = (v as { ok?: unknown }).ok;
    if (okVal !== true) return false;
  
    const dataVal = (v as { data?: unknown }).data;
    return isCommentsListData(dataVal);
  }
  
  function isCreateData(v: unknown): v is CreateCommentData {
    if (!isRec(v)) return false;
  
    const rec = v as {
      id?: unknown;
      status?: unknown;
      editKey?: unknown;
    };
  
    const { id, status, editKey } = rec;
  
    if (typeof id !== "string") return false;
  
    const statusAllowed =
      status === undefined ||
      status === "visible" ||
      status === "pending" ||
      status === "hidden";
  
    if (!statusAllowed) return false;
  
    if (editKey !== undefined && typeof editKey !== "string") return false;
  
    return true;
  }
  
  export function isCreateOk(v: unknown): v is ApiOk<CreateCommentData> {
    if (!isRec(v)) return false;
  
    const okVal = (v as { ok?: unknown }).ok;
    if (okVal !== true) return false;
  
    const dataVal = (v as { data?: unknown }).data;
    return isCreateData(dataVal);
  }
  
  export const isOk = (v: unknown): v is { ok: true } => {
    if (!isRec(v)) return false;
    return (v as { ok?: unknown }).ok === true;
  };
  
  export async function getComments(normalizedKey: string): Promise<{
    r: Response;
    j: unknown;
  }> {
    const r = await fetch(
      join(COMMENTS_BASE, `/api/comments/${encodeURIComponent(normalizedKey)}`),
      { cache: "no-store" }
    );
    const j = await safeJson(r);
    return { r, j };
  }
  
  export async function postComment(
    body: unknown,
    headers: HeadersInit
  ): Promise<{ r: Response; j: unknown }> {
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
  ): Promise<{ r: Response; j: unknown }> {
    const basePath =
      method === "DELETE"
        ? `/api/comments/${encodeURIComponent(id)}`
        : `/api/comments/${encodeURIComponent(id)}/${action ?? ""}`;
  
    const url = join(COMMENTS_BASE, basePath);
  
    const r = await fetch(url, {
      method,
      headers: { "x-admin-key": adminKey },
    });
    const j = await safeJson(r);
    return { r, j };
  }
  
  export async function selfEdit(
    id: string,
    newBody: string,
    key: string
  ): Promise<{ r: Response; j: unknown }> {
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
  
  export async function selfDelete(
    id: string,
    key: string
  ): Promise<{ r: Response; j: unknown }> {
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