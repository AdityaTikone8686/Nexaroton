import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { planById } from "../lib/data.js";
import { useApp } from "../lib/store.jsx";
import { minecraftApi } from "/lib/api.js";

function copyIP(toast) {
  const text = "enuthusiasm-salvation.tun.ply.gg";

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => toast("Server IP copied: " + text))
      .catch(() => toast(text));
  } else {
    toast(text);
  }
}

export default function Dashboard() {
  const {
    currentUser,
    logout,
    addWhitelist,
    removeWhitelist,
    toast
  } = useApp();

  const navigate = useNavigate();

  const [mcname, setMcname] = useState("");

  /*
   * Real Minecraft server status
   */
  const [minecraftStatus, setMinecraftStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState("");

  /*
   * Start / Stop loading states
   */
  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);

  /*
   * Real authentication user
   */
  const [realUser, setRealUser] = useState(null);

  /*
   * Start Minecraft server
   */
  const handleStart = async () => {
    if (starting || stopping) return;

    try {
      setStarting(true);
      setStatusError("");

      await minecraftApi.start();

      toast("Minecraft server is starting.");

      /*
       * Give Minecraft a moment to start before
       * checking its status.
       */
      setTimeout(async () => {
        try {
          const status = await minecraftApi.getStatus();
          setMinecraftStatus(status);
        } catch (error) {
          console.error(
            "Failed to refresh Minecraft status:",
            error
          );
        }
      }, 2000);

    } catch (error) {
      console.error(
        "Failed to start Minecraft:",
        error
      );

      toast(
        error.message ||
        "Failed to start Minecraft server."
      );
    } finally {
      setStarting(false);
    }
  };

  /*
   * Stop Minecraft server
   */
  const handleStop = async () => {
    if (starting || stopping) return;

    try {
      setStopping(true);
      setStatusError("");

      await minecraftApi.stop();

      toast("Minecraft server stopped.");

      /*
       * Refresh status after stopping.
       */
      const status = await minecraftApi.getStatus();
      setMinecraftStatus(status);

    } catch (error) {
      console.error(
        "Failed to stop Minecraft:",
        error
      );

      toast(
        error.message ||
        "Failed to stop Minecraft server."
      );
    } finally {
      setStopping(false);
    }
  };

  /*
   * Authentication
   */
  useEffect(() => {
    const token = localStorage.getItem("oreboundToken");
    const savedUser = localStorage.getItem("oreboundUser");

    if (!token) {
      navigate("/login");
      return;
    }

    if (savedUser) {
      try {
        setRealUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("oreboundUser");
      }
    }
  }, [navigate]);

  /*
   * Fetch real Minecraft server status
   *
   * The status is refreshed every 10 seconds.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadMinecraftStatus() {
      try {
        setStatusLoading(true);
        setStatusError("");

        const data = await minecraftApi.getStatus();

        if (!cancelled) {
          setMinecraftStatus(data);
        }
      } catch (err) {
        console.error(
          "Minecraft status error:",
          err
        );

        if (!cancelled) {
          setStatusError(
            err.message ||
            "Unable to load Minecraft server status"
          );
        }
      } finally {
        if (!cancelled) {
          setStatusLoading(false);
        }
      }
    }

    loadMinecraftStatus();

    const interval = setInterval(
      loadMinecraftStatus,
      10000
    );

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  /*
   * Use real authenticated user if available.
   * Keep the old store as fallback so existing
   * dashboard features continue working.
   */
  const user = realUser || currentUser;

  if (!user) {
    return (
      <section>
        <div className="wrap">
          <div className="slot center-note">

            <h3>
              Sign in to see your dashboard
            </h3>

            <p>
              Your server stats, whitelist, and plan
              live here once you're signed in.
            </p>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>{" "}

            <button
              className="btn btn-ghost"
              onClick={() => navigate("/signup")}
            >
              Create account
            </button>

          </div>
        </div>
      </section>
    );
  }

  /*
   * Existing plan system
   */
  const plan = user.plan
    ? planById(user.plan)
    : null;

  /*
   * Real Minecraft information
   */
  const players =
    minecraftStatus?.playerStatus?.playersOnline ?? 0;

  const maxPlayers =
    minecraftStatus?.playerStatus?.playersMax ?? 0;

  const serverOnline =
    minecraftStatus?.live?.running === true &&
    minecraftStatus?.playerStatus?.online === true;

  const serverPid =
    minecraftStatus?.live?.pid ?? null;

  const wl = user.whitelist || [];

  /*
   * Add player to whitelist
   */
  function handleAddWhitelist(e) {
    e.preventDefault();

    if (!mcname.trim()) return;

    addWhitelist(mcname.trim());

    setMcname("");
  }

  /*
   * Logout
   */
  function handleLogout() {
    /*
     * Remove real authentication
     */
    localStorage.removeItem("oreboundToken");
    localStorage.removeItem("oreboundUser");

    /*
     * Also clear old demo authentication
     */
    logout();

    navigate("/login");
  }

  return (
    <section>
      <div className="wrap">

        {/* Dashboard header */}
        <div className="dash-head">

          <div>
            <span className="kicker">
              DASHBOARD
            </span>

            <h2>
              Welcome back, {user.username}
            </h2>
          </div>

          <button
            className="btn btn-ghost btn-sm"
            onClick={handleLogout}
          >
            Sign out
          </button>

        </div>

        {/* Status error */}
        {statusError && (
          <div
            className="slot"
            style={{
              marginBottom: 16
            }}
          >
            <p style={{ margin: 0 }}>
              Unable to load Minecraft server status.
            </p>
          </div>
        )}

        {/* Metrics */}
        <div className="metric-grid">

          {/* Players */}
          <div className="slot metric">
            <b>
              {statusLoading
                ? "…"
                : `${players}/${maxPlayers}`}
            </b>

            <span>
              players online now
            </span>
          </div>

          {/* Server status */}
          <div className="slot metric">
            <b>
              {statusLoading
                ? "…"
                : serverOnline
                  ? "ONLINE"
                  : "OFFLINE"}
            </b>

            <span>
              server status
            </span>
          </div>

          {/* Minecraft server */}
          <div className="slot metric">
            <b>
              {statusLoading
                ? "…"
                : serverOnline
                  ? "ONLINE"
                  : "OFFLINE"}
            </b>

            <span>
              Minecraft server
            </span>
          </div>

        </div>

        {/* Dashboard grid */}
        <div className="dash-grid">

          {/* Server */}
          <div className="slot card">

            <h3>
              Server
            </h3>

            <p style={{ fontSize: ".85rem" }}>
              Server status
            </p>

            <p
              style={{
                fontSize: ".9rem",
                marginBottom: 12
              }}
            >
              {statusLoading
                ? "Checking server..."
                : serverOnline
                  ? "Minecraft server is online."
                  : "Minecraft server is offline."}
            </p>

            {serverPid && (
              <p
                style={{
                  fontSize: ".8rem",
                  opacity: 0.7
                }}
              >
                Process ID: {serverPid}
              </p>
            )}

            {/* Server controls */}
            <div
              style={{
                marginTop: 20,
                display: "flex",
                gap: 10,
                flexWrap: "wrap"
              }}
            >

              {/* Start */}
              <button
                className="btn btn-sm"
                disabled={
                  serverOnline ||
                  starting ||
                  stopping
                }
                onClick={handleStart}
              >
                {starting
                  ? "Starting..."
                  : "Start server"}
              </button>

              {/* Stop */}
              <button
                className="btn btn-danger btn-sm"
                disabled={
                  !serverOnline ||
                  starting ||
                  stopping
                }
                onClick={handleStop}
              >
                {stopping
                  ? "Stopping..."
                  : "Stop server"}
              </button>

              {/* Copy IP */}
              <button
                className="btn btn-ghost btn-sm"
                onClick={() =>
                  copyIP(toast)
                }
              >
                Copy server IP
              </button>

            </div>

            {/* Whitelist */}
            <h3 style={{ marginTop: 26 }}>
              Whitelist
            </h3>

            <form
              onSubmit={handleAddWhitelist}
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 8
              }}
            >

              <input
                placeholder="Minecraft username"
                value={mcname}
                onChange={(e) =>
                  setMcname(e.target.value)
                }
              />

              <button
                className="btn btn-sm"
                type="submit"
              >
                Add
              </button>

            </form>

            {wl.length ? (

              wl.map((n) => (

                <div
                  className="whitelist-row"
                  key={n}
                >

                  {n}

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() =>
                      removeWhitelist(n)
                    }
                  >
                    Remove
                  </button>

                </div>

              ))

            ) : (

              <p style={{ fontSize: ".85rem" }}>
                No players whitelisted yet.
              </p>

            )}

          </div>

          {/* Plan */}
          <div className="slot card">

            <h3>
              Your plan
            </h3>

            {plan ? (

              <div>

                <span
                  className="swatch"
                  style={{
                    background: plan.color
                  }}
                ></span>

                <h3
                  style={{
                    marginTop: ".4em"
                  }}
                >
                  {plan.name} plan
                </h3>

                <p>
                  ${plan.price.toFixed(2)}
                  /month · {plan.ram} RAM ·{" "}
                  {plan.slots}
                </p>

                <button
                  className="btn btn-sm"
                  onClick={() =>
                    navigate("/plans")
                  }
                >
                  Change plan
                </button>

              </div>

            ) : (

              <div className="empty-plan">

                <p>
                  No active plan yet.
                </p>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    navigate("/plans")
                  }
                >
                  Choose a plan
                </button>

              </div>

            )}

          </div>

        </div>

      </div>
    </section>
  );
}



