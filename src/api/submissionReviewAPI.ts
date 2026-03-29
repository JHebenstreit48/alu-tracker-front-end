const API_BASE_URL = `${import.meta.env.VITE_USER_API_URL}/api`;

const json = async (res: Response) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || 'Request failed');
  return data;
};

export async function fetchPendingSubmissions(token: string) {
  const res = await fetch(`${API_BASE_URL}/submissions?status=pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return json(res);
}

export async function reviewSubmission(
  token: string,
  id: string,
  status: 'approved' | 'rejected',
  reviewNote?: string
) {
  const res = await fetch(`${API_BASE_URL}/submissions/${id}/review`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status, reviewNote }),
  });
  return json(res);
}