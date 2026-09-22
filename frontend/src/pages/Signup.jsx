import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "/lib/api.js";

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const result = await authApi.signup({
        username: username.trim(),
        email: email.trim(),
        password
      });

      console.log("Signup successful:", result);

      // Save email temporarily for OTP verification
      sessionStorage.setItem(
        "oreboundVerificationEmail",
        email.trim().toLowerCase()
      );

      // Go to email verification page
      navigate("/verify-email");

    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="wrap">
        <div className="slot auth-wrap">

          <div className="auth-brand">
            <img src="/logo.png" alt="Orebound" />
            <span>Nexaroton</span>
          </div>

          <h2>Create your account</h2>

          <p className="auth-subtitle">
            Create your Nexaroton account and start managing your Minecraft server.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="field">
              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                required
                minLength={3}
                maxLength={30}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>

            <div className="field">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="field">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
              />
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>

          <p className="switch-line">
            Already have an account?{" "}
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