const API_BASE_URL = `${import.meta.env.VITE_USER_API_URL}/api`;

const json = async (res: Response) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export async function forgotPassword(email: string) {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, origin: window.location.origin }),
  });
  return json(res);
}

export async function resetPassword(token: string, newPassword: string, mfaCode?: string) {
  const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword, ...(mfaCode ? { mfaCode } : {}) }),
  });
  return json(res) as Promise<{ ok?: boolean; requires2fa?: boolean }>;
}

export async function forgotUsername(email: string) {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-username`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return json(res);
}

export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string,
  mfaCode?: string
) {
  const res = await fetch(`${API_BASE_URL}/users/me/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword, ...(mfaCode ? { mfaCode } : {}) }),
  });
  return json(res);
}

export async function requestEmailChange(
  token: string,
  newEmail: string,
  proof: { password?: string; mfaCode?: string }
) {
  const res = await fetch(`${API_BASE_URL}/users/me/email-change`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newEmail, ...proof, origin: window.location.origin }),
  });
  return json(res);
}

export async function confirmEmailChange(confirmToken: string) {
  const res = await fetch(`${API_BASE_URL}/users/me/email-change/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: confirmToken }),
  });
  return json(res);
}

export async function mfaInit(token: string) {
  const res = await fetch(`${API_BASE_URL}/auth/mfa/init`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await json(res);
  return { otpauthUrl: data.otpauthUrl, secret: data.base32 as string };
}

export async function mfaConfirm(token: string, code: string) {
  const res = await fetch(`${API_BASE_URL}/auth/mfa/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });
  return json(res) as Promise<{ twoFactorEnabled: boolean; recoveryCodes?: string[] }>;
}

export async function mfaDisable(token: string, proof?: string) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  const v = (proof || "").trim();

  if (!v) {
    const res = await fetch(`${API_BASE_URL}/auth/mfa/disable`, {
      method: "POST",
      headers,
    });
    return json(res);
  }

  const isTotp = /^\d{6,8}$/.test(v);
  const payload = isTotp ? { code: v } : { recoveryCode: v };

  const res = await fetch(`${API_BASE_URL}/auth/mfa/disable`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return json(res);
}

export async function mfaLogin(userId: string, code: string) {
  const res = await fetch(`${API_BASE_URL}/auth/mfa/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, code }),
  });
  return json(res) as Promise<{
    token: string;
    username: string;
    userId: string;
    twoFactorEnabled?: boolean;
  }>;
}