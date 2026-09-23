const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("oreboundToken");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`
          }
        : {}),

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
    const error = new Error(
      data.error ||
      data.message ||
      "Something went wrong."
    );

    error.status = response.status;
    error.data = data;

    throw error;
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
    return request("/forum/threads", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  addReply(threadId, body) {
    return request(`/forum/threads/${threadId}/replies`, {
      method: "POST",
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
    return request("/minecraft/status");
  },

  start() {
    return request("/minecraft/start", {
      method: "POST"
    });
  },

  stop() {
    return request("/minecraft/stop", {
      method: "POST"
    });
  }
};

export const paymentApi = {
  createOrder(planId) {
    return request("/payment/create-order", {
      method: "POST",
      body: JSON.stringify({
        planId
      })
    });
  },

  verifyPayment(data) {
    return request("/payment/verify", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
};

