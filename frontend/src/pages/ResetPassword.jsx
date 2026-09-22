import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "/lib/api.js";

export default function ResetPassword() {
  const navigate = useNavigate();

  const resetToken =
    sessionStorage.getItem("oreboundResetToken") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!resetToken) {
      setError(
        "Password reset session expired. Please start again."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await authApi.resetPassword({
        resetToken,
        newPassword: password
      });

      // Remove temporary reset data
      sessionStorage.removeItem(
        "oreboundResetToken"
      );

      sessionStorage.removeItem(
        "oreboundResetEmail"
      );

      // Go back to sign in
      navigate("/login");

    } catch (err) {
      console.error(
        "Password reset error:",
        err
      );

      setError(
        err.message || "Unable to reset password."
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

          <h2>Reset password</h2>

          <p className="auth-subtitle">
            Create a new password for your Orebound
            account.
          </p>

          <form onSubmit={handleSubmit}>

            {/* New password */}
            <div className="field">

              <label htmlFor="password">
                New password
              </label>

              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Minimum 6 characters"
              />

            </div>

            {/* Confirm password */}
            <div className="field">

              <label htmlFor="confirmPassword">
                Confirm new password
              </label>

              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Enter your password again"
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
                ? "Resetting password..."
                : "Reset password"}
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