import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { seedThreads } from "./data.js";

const DB_KEY = "orebound_state_v1";
const THEME_KEY = "orebound_theme";

function loadState() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    /* ignore — fall through to fresh state */
  }
  return { users: [], sessionUserId: null, threads: seedThreads() };
}

function uid(prefix) {
  return prefix + "_" + Math.random().toString(36).slice(2, 9);
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || "";
    } catch (e) {
      return "";
    }
  });

  // persist app state
  useEffect(() => {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(state));
    } catch (e) {
      /* storage unavailable — app still works in-memory */
    }
  }, [state]);

  // apply + persist theme
  useEffect(() => {
    if (theme) document.documentElement.setAttribute("data-theme", theme);
    else document.documentElement.removeAttribute("data-theme");
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
  }, [theme]);

  const toast = useCallback((message, kind) => {
    const id = uid("toast");
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.sessionUserId) || null,
    [state.users, state.sessionUserId]
  );

  const findUserByEmail = useCallback(
    (email) => state.users.find((u) => u.email === email.trim().toLowerCase()) || null,
    [state.users]
  );

  const signup = useCallback(
    ({ username, email, password }) => {
      username = username.trim();
      email = email.trim().toLowerCase();
      if (username.length < 3) return { error: "Username needs at least 3 characters." };
      if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Enter a valid email address." };
      if (password.length < 6) return { error: "Password needs at least 6 characters." };
      if (findUserByEmail(email)) return { error: "An account with that email already exists — sign in instead." };
      const user = { id: uid("u"), username, email, pass: password, plan: null, whitelist: [], joined: Date.now() };
      setState((s) => ({ ...s, users: [...s.users, user], sessionUserId: user.id }));
      toast("Account created — welcome, " + username + ".");
      return { error: null };
    },
    [findUserByEmail, toast]
  );

  const login = useCallback(
    ({ email, password }) => {
      const user = findUserByEmail(email);
      if (!user || user.pass !== password) return { error: "Email or password is incorrect." };
      setState((s) => ({ ...s, sessionUserId: user.id }));
      toast("Welcome back, " + user.username + ".");
      return { error: null };
    },
    [findUserByEmail, toast]
  );

  const logout = useCallback(() => {
    setState((s) => ({ ...s, sessionUserId: null }));
    toast("Signed out.");
  }, [toast]);

  const choosePlan = useCallback(
    (planId, planName) => {
      if (!currentUser) return false;
      setState((s) => ({
        ...s,
        users: s.users.map((u) => (u.id === s.sessionUserId ? { ...u, plan: planId } : u))
      }));
      toast(planName + " plan activated.");
      return true;
    },
    [currentUser, toast]
  );

  const addWhitelist = useCallback(
    (name) => {
      if (!currentUser || !name.trim()) return;
      setState((s) => ({
        ...s,
        users: s.users.map((u) =>
          u.id === s.sessionUserId && !(u.whitelist || []).includes(name)
            ? { ...u, whitelist: [...(u.whitelist || []), name] }
            : u
        )
      }));
    },
    [currentUser]
  );

  const removeWhitelist = useCallback((name) => {
    setState((s) => ({
      ...s,
      users: s.users.map((u) =>
        u.id === s.sessionUserId ? { ...u, whitelist: (u.whitelist || []).filter((n) => n !== name) } : u
      )
    }));
  }, []);

  const submitThread = useCallback(
    ({ cat, title, body }) => {
      if (!currentUser) return null;
      const t = { id: uid("t"), cat, title: title.trim(), body: body.trim(), author: currentUser.username, created: Date.now(), replies: [] };
      setState((s) => ({ ...s, threads: [t, ...s.threads] }));
      toast("Thread posted.");
      return t.id;
    },
    [currentUser, toast]
  );

  const submitReply = useCallback(
    (threadId, body) => {
      if (!currentUser || !body.trim()) return;
      setState((s) => ({
        ...s,
        threads: s.threads.map((t) =>
          t.id === threadId
            ? { ...t, replies: [...t.replies, { author: currentUser.username, body: body.trim(), created: Date.now() }] }
            : t
        )
      }));
    },
    [currentUser]
  );

  const toggleTheme = useCallback(() => {
    setTheme((cur) => {
      const order = ["", "dark", "light"];
      return order[(order.indexOf(cur) + 1) % order.length];
    });
  }, []);

  const value = {
    threads: state.threads,
    users: state.users,
    currentUser,
    toasts,
    theme,
    toggleTheme,
    toast,
    signup,
    login,
    logout,
    choosePlan,
    addWhitelist,
    removeWhitelist,
    submitThread,
    submitReply
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  const d = Math.floor(h / 24);
  return d + "d ago";
}
