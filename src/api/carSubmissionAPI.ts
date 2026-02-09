import type { CarSubmissionPayload } from "@/types/CarDataSubmission/carSubmission";

const API_BASE_URL = String(import.meta.env.VITE_USER_API_URL || "").replace(/\/+$/, "");

const json = async (res: Response) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export async function createSubmission(token: string, payload: CarSubmissionPayload) {
  const res = await fetch(`${API_BASE_URL}/api/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return json(res);
}