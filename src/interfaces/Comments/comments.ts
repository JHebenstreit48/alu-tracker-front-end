export type CommentType = "missing-data" | "correction" | "general";
export type CommentStatus = "visible" | "pending" | "hidden";
export type Filter = "all" | CommentType;

export interface Comment {
  _id: string;
  normalizedKey: string;
  brand?: string;
  model?: string;
  type: CommentType;
  body: string;
  authorName?: string;
  status: CommentStatus;
  createdAt: string;    // ISO
  updatedAt?: string;   // ISO
}

export type CommentItem = Comment;

export interface CommentsListData {
  comments: CommentItem[];
}

export interface ErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiOk<T> {
  ok: true;
  data: T;
}

export interface ApiErr {
  ok: false;
  error: ErrorPayload;
}

export type ApiResponse<T> = ApiOk<T> | ApiErr;

export interface CreateCommentData {
  id: string;
  status?: CommentStatus;
  editKey?: string;
}

export interface PanelProps {
  normalizedKey: string;
  brand?: string;
  model?: string;
}