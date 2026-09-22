import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../lib/data.js";
import { useApp } from "../lib/store.jsx";
import { forumApi } from "/lib/api.js";

export default function NewThreadForm({ defaultCat }) {
  const { currentUser, toast } = useApp();
  const navigate = useNavigate();

  const [realUser, setRealUser] = useState(null);
  const [cat, setCat] = useState(defaultCat);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("oreboundToken");
    const savedUser = localStorage.getItem("oreboundUser");

    if (token && savedUser) {
      try {
        setRealUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("oreboundUser");
      }
    }
  }, []);

  const user = realUser || currentUser;

  if (!user) {
    return (
      <div className="slot" style={{ padding: 20, marginTop: 24 }}>
        <p style={{ margin: 0 }}>
          Sign in to start a new thread.{" "}
          <button
            className="btn btn-sm"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      return;
    }

    try {
      setLoading(true);

      const result = await forumApi.createThread({
        category: cat,
        title: title.trim(),
        body: body.trim()
      });

      toast("Thread posted.");

      setTitle("");
      setBody("");

      navigate("/forum/t/" + result.thread._id);
    } catch (error) {
      console.error("Create thread error:", error);
      toast(error.message || "Failed to post thread.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="slot" style={{ padding: 24, marginTop: 24 }}>
      <h3>Start a new thread</h3>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Category</label>

          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Title</label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>Message</label>

          <textarea
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>

        <button
          className="btn btn-primary btn-sm"
          type="submit"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post thread"}
        </button>
      </form>
    </div>
  );
}