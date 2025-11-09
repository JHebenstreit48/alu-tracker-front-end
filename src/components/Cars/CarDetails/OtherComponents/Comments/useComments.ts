import { useCallback, useEffect, useMemo, useState } from "react";
import { DISABLE_COMMENTS } from "@/components/Cars/CarDetails/OtherComponents/Comments/flags";
import {
  getComments,
  postComment,
  adminCall,
  selfEdit,
  selfDelete,
  apiErrorMessage,
  isCommentsOk,
  isCreateOk,
  isOk
} from "@/utils/Comments/api";
import type {
  CommentItem,
  CommentsListData,
  ApiOk,
  Filter,
  CommentType,
  PanelProps,
  CreateCommentData
} from "@/interfaces/Comments/types";

function msgOf(e: unknown) {
  return e instanceof Error ? e.message : "Unexpected error";
}

export function useComments(
  { normalizedKey, brand, model }: PanelProps,
  auth?: { token: string | null; username?: string | null }
) {
  const token = auth?.token ?? null;
  const username = auth?.username ?? null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  const fetchList = useCallback(async () => {
    if (DISABLE_COMMENTS) {
      setComments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { r, j } = await getComments(normalizedKey);
      if (!r.ok || !isCommentsOk(j)) throw new Error("Failed to load comments.");
      const data = (j as ApiOk<CommentsListData>).data;
      setComments(data.comments);
    } catch (e) {
      setError(msgOf(e));
    } finally {
      setLoading(false);
    }
  }, [normalizedKey]);

  useEffect(() => {
    void fetchList();
  }, [fetchList]);

  const filtered = useMemo(
    () => (filter === "all" ? comments : comments.filter((c) => c.type === filter)),
    [comments, filter]
  );

  async function submit(
    type: CommentType,
    body: string,
    authorName?: string,
    authorEmail?: string,
    hp?: string
  ): Promise<{ ok: true; id?: string; editKey?: string; localOnly?: boolean }> {
    if (DISABLE_COMMENTS) return { ok: true, localOnly: true };

    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const payload = {
      normalizedKey,
      brand,
      model,
      type,
      body: body.trim(),
      authorName: token ? (username ?? undefined) : (authorName || undefined),
      authorEmail: token ? undefined : (authorEmail || undefined),
      hp
    };

    const { r, j } = await postComment(payload, headers);
    if (!r.ok || !isCreateOk(j)) throw new Error(apiErrorMessage(j) ?? "Failed to submit comment.");

    const data = (j as ApiOk<CreateCommentData>).data;

    // refresh so the new comment shows immediately
    await fetchList();

    return { ok: true, id: data.id, editKey: data.editKey };
  }

  async function admin(method: "PATCH" | "DELETE", id: string, adminKey: string, action?: "visible" | "hide") {
    if (DISABLE_COMMENTS) return;
    const { r, j } = await adminCall(method, id, adminKey, action);
    if (!r.ok || !isOk(j)) throw new Error("Admin action failed");
    await fetchList();
  }

  async function saveSelfLocal(id: string, newBody: string) {
    const key = localStorage.getItem(`comment_editkey_${id}`) || "";
    if (!key) throw new Error("Missing edit key for this comment.");

    const prev = comments;
    setComments(prev.map((c) => (c._id === id ? { ...c, body: newBody } : c)));
    try {
      if (DISABLE_COMMENTS) return;
      const { r, j } = await selfEdit(id, newBody, key);
      if (!r.ok) throw new Error(apiErrorMessage(j) ?? `Failed to save (${r.status})`);
    } catch (e) {
      setComments(prev);
      throw (e instanceof Error ? e : new Error("Failed to save changes."));
    }
  }

  async function deleteSelfLocal(id: string) {
    const key = localStorage.getItem(`comment_editkey_${id}`) || "";
    if (!key) throw new Error("Missing edit key for this comment.");

    const prev = comments;
    setComments(prev.filter((c) => c._id !== id));
    try {
      if (DISABLE_COMMENTS) {
        localStorage.removeItem(`comment_editkey_${id}`);
        return;
      }
      const { r, j } = await selfDelete(id, key);
      if (!r.ok) throw new Error(apiErrorMessage(j) ?? `Failed to delete (${r.status})`);
      localStorage.removeItem(`comment_editkey_${id}`);
    } catch (e) {
      setComments(prev);
      throw (e instanceof Error ? e : new Error("Failed to delete comment."));
    }
  }

  return {
    loading,
    error,
    filtered,
    setFilter,
    submit,
    admin,
    saveSelfLocal,
    deleteSelfLocal,
    refresh: fetchList
  };
}