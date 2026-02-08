export type FeedbackCategory = "bug" | "feature" | "content" | "other";
export type FeedbackStatus = "new" | "triaged" | "closed";

export interface PublicFeedbackItem {
  _id: string;
  category: FeedbackCategory;
  message: string;
  pageUrl?: string;
  status: FeedbackStatus;
  createdAt: string;
}

export interface PublicFeedbackResponse {
  ok: true;
  data: { items: PublicFeedbackItem[] };
}