export type CommentType = "missing-data" | "correction" | "general";
export type Filter = "all" | CommentType;

export type CommentCardItem = {
  _id: string;
  type: CommentType;
  body: string;
  authorName?: string;
  createdAt: string;
};

export type CommentItem = CommentCardItem & {
  normalizedKey: string;
  brand?: string;
  model?: string;
  status: "visible" | "pending" | "hidden";
  updatedAt: string;
};

export type ErrorPayload = { code: string; message: string; details?: unknown };
export type CommentsListData = { comments: CommentItem[] };

export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = { ok: false; error: ErrorPayload };
export type ApiResponse<T> = ApiOk<T> | ApiErr;

export type CreateCommentData = { id: string; status?: "visible"|"pending"|"hidden"; editKey?: string };

export type PanelProps = { normalizedKey: string; brand?: string; model?: string };