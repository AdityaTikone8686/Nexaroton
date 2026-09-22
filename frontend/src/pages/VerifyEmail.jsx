import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "/lib/api.js";

export default function VerifyEmail() {
  const navigate = useNavigate();

  const email =
    sessionStorage.getItem("oreboundVerificationEmail") || "";

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
      setError("Verification session expired. Please sign up again.");
      return;
    }

    try {
      setLoading(true);

      const result = await authApi.verifyEmail({
        email,
        otp
      });

      // Save login token
      localStorage.setItem(
        "oreboundToken",
        result.token
      );

      // Remove temporary email
      sessionStorage.removeItem(
        "oreboundVerificationEmail"
      );

      // Go to dashboard
      navigate("/Dashboard");

    } catch (err) {
      console.error("Verification error:", err);

      setError(
        err.message || "Unable to verify your email."
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

          {/* Heading */}
          <h2>Verify your email</h2>

          <p className="auth-subtitle">
            We sent a 6-digit verification code to:
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

          {/* Form */}
          <form onSubmit={handleSubmit}>

            <div className="field">

              <label htmlFor="otp">
                Verification code
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

            {/* Error */}
            {error && (
              <div className="err">
                {error}
              </div>
            )}

            {/* Verify button */}
            <button
              className="btn btn-primary btn-block"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : "Verify email"}
            </button>

          </form>

          {/* Back */}
          <p className="switch-line">

            Wrong email?{" "}

            <button
              type="button"
              onClick={() => navigate("/signup")}
            >
              Go back
            </button>

          </p>

        </div>

      </div>
    </section>
  );
}
