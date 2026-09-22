const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid response from server.");
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || "Something went wrong.");
  }

  return data;
}

// ================================
// AUTH API
// ================================

export const authApi = {
  signup(data) {
    return request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  verifyEmail(data) {
    return request("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  login(data) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  forgotPassword(data) {
    return request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  verifyResetOtp(data) {
    return request("/auth/verify-reset-otp", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  resetPassword(data) {
    return request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  resendVerification(data) {
    return request("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
};

// ================================
// FORUM API
// ================================

export const forumApi = {
  getThreads() {
    return request("/forum/threads");
  },

  getThread(id) {
    return request(`/forum/threads/${id}`);
  },

  createThread(data) {
    const token = localStorage.getItem("oreboundToken");

    return request("/forum/threads", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
  },

  addReply(threadId, body) {
    const token = localStorage.getItem("oreboundToken");

    return request(`/forum/threads/${threadId}/replies`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        body
      })
    });
  }
};

// ================================
// MINECRAFT API
// ================================

export const minecraftApi = {
  getStatus() {
    const token = localStorage.getItem("oreboundToken");

    return request("/minecraft/status", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  start() {
    const token = localStorage.getItem("oreboundToken");

    return request("/minecraft/start", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  stop() {
    const token = localStorage.getItem("oreboundToken");

    return request("/minecraft/stop", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

