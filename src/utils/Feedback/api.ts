import type {
    PublicFeedbackItem,
    PublicFeedbackResponse,
  } from "@/interfaces/Feedback";
  
  const API_BASE = (
    import.meta.env.VITE_PLATFORM_API_BASE_URL ??
    import.meta.env.VITE_COMMENTS_API_BASE_URL ??
    (import.meta.env.DEV
      ? "http://127.0.0.1:3004"
      : "https://alu-tracker-comments-api.onrender.com")
  ).replace(/\/+$/, "");
  
  const join = (base: string, path: string): string => {
    const b = base.replace(/\/+$/, "");
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${b}${p}`;
  };
  
  const isRec = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null;
  
  const isOkList = (v: unknown): v is PublicFeedbackResponse => {
    if (!isRec(v)) return false;
  
    const okVal = (v as { ok?: unknown }).ok;
    if (okVal !== true) return false;
  
    const dataVal = (v as { data?: unknown }).data;
    if (!isRec(dataVal)) return false;
  
    const items = (dataVal as { items?: unknown }).items;
    return Array.isArray(items);
  };
  
  export async function fetchPublicFeedback(): Promise<PublicFeedbackItem[]> {
    if (
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("nofeedback")
    ) {
      return [];
    }
  
    const res = await fetch(
      join(API_BASE, "/api/feedback/public?status=triaged"),
      { cache: "no-store" }
    );
  
    const json: unknown = await res.json().catch(() => ({}));
  
    if (!res.ok || !isOkList(json)) {
      throw new Error(`Failed to load feedback (${res.status})`);
    }
  
    return json.data.items;
  }  