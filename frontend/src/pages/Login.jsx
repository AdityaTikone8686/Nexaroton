import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "/lib/api.js";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const result = await authApi.login({
        email: email.trim(),
        password
      });

      // Save JWT token
      localStorage.setItem(
        "oreboundToken",
        result.token
      );

      // Save user information
      localStorage.setItem(
        "oreboundUser",
        JSON.stringify(result.user)
      );

      navigate("/Dashboard");

    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.message || "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="wrap">

        <div className="slot auth-wrap">

          {/* Logo */}
          <div className="auth-brand">
            <img
              src="/logo.png"
              alt="Orebound"
            />

            <span>Nexaroton</span>
          </div>

          <h2>Sign in</h2>

          <p className="auth-subtitle">
            Sign in to manage your Minecraft server.
          </p>

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="field">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className="field">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
              />
            </div>

            {/* Forgot password */}
            <div
              style={{
                textAlign: "right",
                marginBottom: "18px"
              }}
            >
              <button
                type="button"
                onClick={() =>
                  navigate("/forgot-password")
                }
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer"
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="err">
                {error}
              </div>
            )}

            {/* Sign in */}
            <button
              className="btn btn-primary btn-block"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign in"}
            </button>

          </form>

          {/* Signup */}
          <p className="switch-line">
            Don't have an account?{" "}

            <button
              type="button"
              onClick={() => navigate("/signup")}
            >
              Create account
            </button>
          </p>

        </div>

      </div>
    </section>
  );
}