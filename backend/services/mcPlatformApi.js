const MC_PLATFORM_URL =
  process.env.MC_PLATFORM_URL || "http://localhost:5000";

const OREBOUND_API_KEY = process.env.OREBOUND_API_KEY;
console.log(
  "OREBOUND_API_KEY loaded:",
  OREBOUND_API_KEY ? "YES" : "NO"
);

console.log(
  "MC_PLATFORM_URL:",
  MC_PLATFORM_URL
);

async function mcPlatformRequest(endpoint, options = {}) {
  if (!OREBOUND_API_KEY) {
    throw new Error("OREBOUND_API_KEY is not configured");
  }

  const response = await fetch(`${MC_PLATFORM_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "x-orebound-key": OREBOUND_API_KEY,
      "Content-Type": "application/json"
    }
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid response from mc-platform");
  }

  if (!response.ok) {
    throw new Error(data.message || "mc-platform request failed");
  }

  return data;
}

export const mcPlatformApi = {
  getStatus() {
    return mcPlatformRequest("/api/internal/status");
  },

  start() {
    return mcPlatformRequest("/api/internal/start", {
      method: "POST"
    });
  },

  stop() {
    return mcPlatformRequest("/api/internal/stop", {
      method: "POST"
    });
  },

  restart() {
    return mcPlatformRequest("/api/internal/restart", {
      method: "POST"
    });
  }
};