const API_BASE_URL = String(import.meta.env.VITE_USER_API_URL || "").replace(
  /\/+$/,
  ""
);

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

/* ---------- Helpers ---------- */
const isJsonResponse = (res: Response): boolean =>
  (res.headers.get("content-type") || "").toLowerCase().includes("application/json");

const safeReadJson = async <T>(res: Response): Promise<T | undefined> => {
  if (!isJsonResponse(res)) return undefined;
  try {
    return (await res.json()) as T;
  } catch {
    return undefined;
  }
};

const safeReadText = async (res: Response): Promise<string> => {
  try {
    return await res.text();
  } catch {
    return "";
  }
};

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

    const data = await safeReadJson<any>(res);

    if (!res.ok) {
      // Prefer JSON error message; fallback to status/text
      const msg =
        data?.message ||
        `Login failed (${res.status})` ||
        "Login failed";
      return { success: false, message: msg };
    }

    if (data?.requires2fa) {
      return { success: true, requires2fa: true, userId: data.userId };
    }

    return {
      success: true,
      token: data?.token,
      username: data?.username,
      userId: data?.userId,
      twoFactorEnabled: data?.twoFactorEnabled ?? false,
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

    const data = await safeReadJson<any>(res);

    if (!res.ok) {
      const msg =
        data?.message ||
        `Signup failed (${res.status})` ||
        "Signup failed";
      return { success: false, message: msg };
    }

    return {
      success: true,
      token: data?.token,
      username: data?.username,
      userId: data?.userId,
    };
  } catch (e) {
    console.error("[authAPI] Signup error:", e);
    return { success: false, message: "An error occurred during sign up" };
  }
};

/* ---------- API: Me ---------- */
export const fetchMe = async (token: string): Promise<FetchMeResult> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await safeReadJson<MePayload>(res);

    // If backend returned HTML (e.g., 404), don't crash
    if (!data && !res.ok) {
      // Optional: you can read text for debugging
      await safeReadText(res);
    }

    return { ok: res.ok, data };
  } catch (e) {
    console.error("[authAPI] fetchMe error:", e);
    return { ok: false };
  }
};