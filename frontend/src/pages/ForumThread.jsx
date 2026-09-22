import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CATEGORIES } from "../lib/data.js";
import { useApp, timeAgo } from "../lib/store.jsx";
import { forumApi } from "/lib/api.js";

export default function ForumThread() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [error, setError] = useState("");

  const [realUser, setRealUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("oreboundUser");

    if (savedUser) {
      try {
        setRealUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("oreboundUser");
      }
    }
  }, []);

  const user = realUser || currentUser;

  useEffect(() => {
    async function loadThread() {
      try {
        setLoading(true);
        setError("");

        const result = await forumApi.getThread(threadId);

        setThread(result.thread);
      } catch (err) {
        console.error("Failed to load thread:", err);
        setError(err.message || "Failed to load thread.");
      } finally {
        setLoading(false);
      }
    }

    if (threadId) {
      loadThread();
    }
  }, [threadId]);

  async function handleReply(e) {
    e.preventDefault();

    if (!reply.trim()) return;

    try {
      setReplyLoading(true);

      const result = await forumApi.addReply(
        threadId,
        reply.trim()
      );

      setThread(result.thread);
      setReply("");
    } catch (err) {
      console.error("Failed to post reply:", err);
      alert(err.message || "Failed to post reply.");
    } finally {
      setReplyLoading(false);
    }
  }

  if (loading) {
    return (
      <section>
        <div className="wrap">
          <p>Loading thread...</p>
        </div>
      </section>
    );
  }

  if (error || !thread) {
    return (
      <section>
        <div className="wrap">
          <p>{error || "Thread not found."}</p>

          <button
            className="btn btn-sm"
            onClick={() => navigate("/forum")}
          >
            Back to Forum
          </button>
        </div>
      </section>
    );
  }

  const category = CATEGORIES.find(
    (c) => c.id === thread.category
  );

  const replies = thread.replies || [];

  return (
    <section>
      <div className="wrap">

        {/* Breadcrumbs */}
        <div className="crumbs">
          <button onClick={() => navigate("/forum")}>
            Forum
          </button>

          {" / "}

          <button
            onClick={() =>
              navigate("/forum/c/" + thread.category)
            }
          >
            {category ? category.name : thread.category}
          </button>
        </div>

        {/* Thread */}
        <div
          className="slot"
          style={{ padding: 26 }}
        >
          <h2>{thread.title}</h2>

          <div
            className="meta"
            style={{
              color: "var(--text-dim)",
              fontSize: ".85rem",
              marginBottom: 14
            }}
          >
            {thread.author} ·{" "}
            {timeAgo(new Date(thread.createdAt).getTime())}
          </div>

          <p style={{ maxWidth: "none" }}>
            {thread.body}
          </p>
        </div>

        {/* Replies */}
        <h3 style={{ margin: "28px 0 4px" }}>
          {replies.length}{" "}
          {replies.length === 1 ? "reply" : "replies"}
        </h3>

        <div
          className="slot"
          style={{ padding: "8px 24px" }}
        >
          {replies.length ? (
            replies.map((r, index) => (
              <div
                className="reply"
                key={r._id || index}
              >
                <div className="who">
                  {r.author}{" "}
                  <span>
                    {timeAgo(
                      new Date(r.createdAt).getTime()
                    )}
                  </span>
                </div>

                <p style={{ maxWidth: "none" }}>
                  {r.body}
                </p>
              </div>
            ))
          ) : (
            <p style={{ padding: "16px 0" }}>
              No replies yet — be the first.
            </p>
          )}
        </div>

        {/* Reply form */}
        <div
          className="slot"
          style={{
            padding: 24,
            marginTop: 20
          }}
        >
          {user ? (
            <form onSubmit={handleReply}>
              <div className="field">
                <label>
                  Reply as {user.username}
                </label>

                <textarea
                  rows={3}
                  value={reply}
                  onChange={(e) =>
                    setReply(e.target.value)
                  }
                  required
                />
              </div>

              <button
                className="btn btn-primary btn-sm"
                type="submit"
                disabled={replyLoading}
              >
                {replyLoading
                  ? "Posting..."
                  : "Post reply"}
              </button>
            </form>
          ) : (
            <p>
              Sign in to reply.{" "}
              <button
                className="btn btn-sm"
                onClick={() => navigate("/login")}
              >
                Sign in
              </button>
            </p>
          )}
        </div>

      </div>
    </section>
  );
}