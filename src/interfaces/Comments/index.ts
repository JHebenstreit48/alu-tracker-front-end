export type CommentType = "missing-data" | "correction" | "general";
export type CommentStatus = "visible" | "pending" | "hidden";

export interface Comment {
  _id: string;
  normalizedKey: string;
  brand?: string;
  model?: string;
  type: CommentType;
  body: string;
  authorName?: string;
  status: CommentStatus;
  createdAt: string;
}

export interface CommentsListData {
  comments: Comment[];
}

export interface CreateCommentData {
  id: string;
  status?: CommentStatus;
  editKey?: string;
}

export interface ApiOk<T> {
  ok: true;
  data: T;
}