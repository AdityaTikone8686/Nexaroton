import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../lib/store.jsx";

export default function Header() {
  const { toggleTheme } = useApp();

  const [open, setOpen] = useState(false);
  const [realUser, setRealUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  function loadAuthUser() {
    const token = localStorage.getItem("oreboundToken");
    const savedUser = localStorage.getItem("oreboundUser");

    if (token && savedUser) {
      try {
        setRealUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("oreboundUser");
        setRealUser(null);
      }
    } else {
      setRealUser(null);
    }
  }

  // Check authentication whenever the route changes
  useEffect(() => {
    loadAuthUser();
  }, [location.pathname]);

  function go(path) {
    setOpen(false);
    navigate(path);
  }

  const user = realUser;

  const isLoggedIn =
    Boolean(localStorage.getItem("oreboundToken")) &&
    Boolean(user);

  const hasActiveSubscription =
    user?.subscription?.status === "active";

  return (
    <header>
      <div className="nav">

        {/* BRAND */}
        <button
          className="brand"
          onClick={() => go("/")}
        >
          <img
            src="/logo.png"
            alt="Nexaroton"
            className="brand-logo"
          />

          <span>Nexaroton</span>
        </button>

        {/* MOBILE MENU */}
        <button
          className="menu-btn"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>

        {/* NAVIGATION */}
        <nav className={"navlinks" + (open ? " open" : "")}>

          <NavLink
            to="/"
            end
            onClick={() => setOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/plans"
            onClick={() => setOpen(false)}
          >
            Plans
          </NavLink>

          <NavLink
            to="/forum"
            onClick={() => setOpen(false)}
          >
            Forum
          </NavLink>

          {/* ONLY SHOW DASHBOARD WITH ACTIVE SUBSCRIPTION */}
          {isLoggedIn && hasActiveSubscription && (
            <NavLink
              to="/dashboard"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </NavLink>
          )}

        </nav>

        {/* RIGHT SIDE */}
        <div className="navauth">

          <button
            className="theme-toggle"
            title="Toggle day/night theme"
            onClick={toggleTheme}
          >
            ◐
          </button>

          {isLoggedIn ? (
            <button
              className="btn btn-sm"
              onClick={() =>
                go(
                  hasActiveSubscription
                    ? "/dashboard"
                    : "/plans"
                )
              }
            >
              {user.username}
            </button>
          ) : (
            <>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => go("/login")}
              >
                Sign in
              </button>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => go("/signup")}
              >
                Create account
              </button>
            </>
          )}

        </div>

      </div>
    </header>
  );
}