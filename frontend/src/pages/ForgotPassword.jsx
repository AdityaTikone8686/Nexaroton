import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "/lib/api.js";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await authApi.forgotPassword({
        email: email.trim()
      });

      sessionStorage.setItem(
        "oreboundResetEmail",
        email.trim().toLowerCase()
      );

      navigate("/verify-reset-otp");

    } catch (err) {
      console.error("Forgot password error:", err);

      setError(
        err.message || "Unable to send reset OTP."
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

            <span>Orebound</span>
          </div>

          <h2>Forgot password?</h2>

          <p className="auth-subtitle">
            Enter your email address and we'll send you
            a 6-digit OTP to reset your password.
          </p>

          <form onSubmit={handleSubmit}>

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

            {error && (
              <div className="err">
                {error}
              </div>
            )}

            <button
              className="btn btn-primary btn-block"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Sending OTP..."
                : "Send reset OTP"}
            </button>

          </form>

          <p className="switch-line">
            Remember your password?{" "}

            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </p>

        </div>

      </div>
    </section>
  );
}