import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "/lib/api.js";

export default function VerifyResetOTP() {
  const navigate = useNavigate();

  const email =
    sessionStorage.getItem("oreboundResetEmail") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    if (!email) {
      setError(
        "Password reset session expired. Please start again."
      );
      return;
    }

    try {
      setLoading(true);

      const result = await authApi.verifyResetOtp({
        email,
        otp
      });

      // Save temporary password reset token
      sessionStorage.setItem(
        "oreboundResetToken",
        result.resetToken
      );

      navigate("/reset-password");

    } catch (err) {
      console.error(
        "Reset OTP verification error:",
        err
      );

      setError(
        err.message || "Unable to verify OTP."
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

          <h2>Verify reset code</h2>

          <p className="auth-subtitle">
            Enter the 6-digit OTP sent to:
          </p>

          <p
            style={{
              textAlign: "center",
              fontWeight: "600",
              marginBottom: "24px"
            }}
          >
            {email || "your email address"}
          </p>

          <form onSubmit={handleSubmit}>

            <div className="field">

              <label htmlFor="otp">
                Reset OTP
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="123456"
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
                ? "Verifying..."
                : "Verify OTP"}
            </button>

          </form>

          <p className="switch-line">

            Wrong email?{" "}

            <button
              type="button"
              onClick={() =>
                navigate("/forgot-password")
              }
            >
              Go back
            </button>

          </p>

        </div>

      </div>
    </section>
  );
}