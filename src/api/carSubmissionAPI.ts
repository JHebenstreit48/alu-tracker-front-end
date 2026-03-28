import type { CarSubmissionPayload } from "@/types/CarDataSubmission/carSubmission";

const API_BASE_URL = String(import.meta.env.VITE_USER_API_URL || "").replace(
  /\/+$/,
  ""
);

const json = async (res: Response) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Request failed");
  return data;
};

export async function createSubmission(
  payload: CarSubmissionPayload,
  token?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api/submissions`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return json(res);
}