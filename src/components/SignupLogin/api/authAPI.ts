const API_BASE_URL = "https://alutracker-api.onrender.com/api";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Login failed" };
    }

    return {
      success: true,
      token: data.token,
      username: data.username,
      userId: data.userId,
    };
  } catch (err) {
    console.error("[authAPI] Login error:", err);
    return { success: false, message: "An error occurred during login" };
  }
};

export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Signup failed" };
    }

    return { success: true };
  } catch (err) {
    console.error("[authAPI] Signup error:", err);
    return { success: false, message: "An error occurred during sign up" };
  }
};
