const API_BASE_URL = `${import.meta.env.VITE_USER_API_URL}/api`;

const json = async (res: Response) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// --- Recovery ---
export async function forgotPassword(email: string) {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return json(res); // {ok:true}
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
  return json(res); // {ok:true}
}

export async function forgotUsername(email: string) {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-username`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return json(res); // {ok:true}
}

// --- MFA ---
export async function mfaInit(token: string) {
  // BE returns: { otpauthUrl, base32 }
  const res = await fetch(`${API_BASE_URL}/auth/mfa/init`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await json(res); // expect { otpauthUrl, base32 }
  // Normalize to your existing FE shape:
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

  // No runtime change; this just lets TS know recoveryCodes may exist.
  return json(res) as Promise<{ twoFactorEnabled: boolean; recoveryCodes?: string[] }>;
}

/**
 * Backwards-compatible:
 * - existing callers can keep calling mfaDisable(token)
 * - new callers can call mfaDisable(token, proof)
 */
export async function mfaDisable(token: string, proof?: string) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  const v = (proof || "").trim();

  // Old behavior preserved (no body). This may 400 if backend requires proof.
  if (!v) {
    const res = await fetch(`${API_BASE_URL}/auth/mfa/disable`, {
      method: "POST",
      headers,
    });
    return json(res);
  }

  // New behavior: send proof in body (totp or recovery)
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