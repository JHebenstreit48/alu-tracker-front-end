const API_BASE_URL = String(import.meta.env.VITE_USER_API_URL || "").replace(/\/+$/, "");

/* ---------- Types ---------- */
export type LoginOk = {
  success: true;
  token: string;
  username: string;
  userId: string;
  twoFactorEnabled?: boolean;
};
export type LoginNeeds2FA = { success: true; requires2fa: true; userId: string };
export type LoginFail = { success: false; message: string };

export type RegisterResp =
  | { success: true; token: string; username: string; userId: string }
  | { success: false; message: string };

export interface MePayload {
  username: string;
  userId: string;
  roles: string[];
  twoFactorEnabled: boolean;
}

export interface FetchMeResult {
  ok: boolean;
  data?: MePayload;
}

/* ---------- API: Auth ---------- */
export const loginUser = async (
  email: string,
  password: string
): Promise<LoginOk | LoginNeeds2FA | LoginFail> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Login failed" };
    }
    if (data?.requires2fa) {
      return { success: true, requires2fa: true, userId: data.userId };
    }
    return {
      success: true,
      token: data.token,
      username: data.username,
      userId: data.userId,
      twoFactorEnabled: data.twoFactorEnabled ?? false,
    };
  } catch (e) {
    console.error("[authAPI] Login error:", e);
    return { success: false, message: "An error occurred during login" };
  }
};

export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<RegisterResp> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Signup failed" };
    }
    return {
      success: true,
      token: data.token,
      username: data.username,
      userId: data.userId,
    };
  } catch (e) {
    console.error("[authAPI] Signup error:", e);
    return { success: false, message: "An error occurred during sign up" };
  }
};

/* ---------- API: Me ---------- */
export const fetchMe = async (token: string): Promise<FetchMeResult> => {
  const res = await fetch(`${API_BASE_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  let data: MePayload | undefined;
  try {
    data = (await res.json()) as MePayload;
  } catch {
    data = undefined;
  }
  return { ok: res.ok, data };
};