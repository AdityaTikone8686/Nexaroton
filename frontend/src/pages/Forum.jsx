import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../lib/data.js";
import ThreadList from "../components/ThreadList.jsx";
import NewThreadForm from "../components/NewThreadForm.jsx";
import { forumApi } from "/lib/api.js";

export default function Forum() {
  const navigate = useNavigate();

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadThreads();
  }, []);

  async function loadThreads() {
    try {
      setLoading(true);
      setError("");

      const result = await forumApi.getThreads();

      setThreads(result.threads || []);
    } catch (err) {
      console.error("Failed to load forum threads:", err);
      setError(err.message || "Failed to load forum threads.");
    } finally {
      setLoading(false);
    }
  }

  function handleThreadCreated(thread) {
    if (!thread) return;

    setThreads((current) => [
      thread,
      ...current
    ]);
  }

  const recent = [...threads]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 6);

  return (
    <section>
      <div className="wrap">

        {/* ================================
            FORUM HEADER
        ================================= */}

        <div className="section-head">
          <span className="kicker">FORUM</span>

          <h2>Talk it out with the server</h2>

          <p>
            Announcements, builds, support, and everything in between.
          </p>
        </div>

        {/* ================================
            CATEGORIES
        ================================= */}

        <div className="cat-grid">
          {CATEGORIES.map((c) => {
            const count = threads.filter(
              (t) => t.category === c.id
            ).length;

            return (
              <div
                className="cat-card"
                key={c.id}
                onClick={() =>
                  navigate("/forum/c/" + c.id)
                }
              >
                <div>
                  <h4>{c.name}</h4>

                  <p
                    style={{
                      margin: 0,
                      fontSize: ".85rem"
                    }}
                  >
                    {c.desc}
                  </p>
                </div>

                <div className="count">
                  {count}
                </div>
              </div>
            );
          })}
        </div>

        {/* ================================
            RECENT THREADS
        ================================= */}

        <h3 style={{ marginTop: 36 }}>
          Recent threads
        </h3>

        {loading ? (
          <div
            className="slot"
            style={{ padding: 20 }}
          >
            <p style={{ margin: 0 }}>
              Loading threads...
            </p>
          </div>
        ) : error ? (
          <div
            className="slot"
            style={{ padding: 20 }}
          >
            <p style={{ margin: 0 }}>
              {error}
            </p>

            <button
              className="btn btn-sm"
              style={{ marginTop: 12 }}
              onClick={loadThreads}
            >
              Try again
            </button>
          </div>
        ) : (
          <ThreadList
            threads={recent}
          />
        )}

        {/* ================================
            NEW THREAD
        ================================= */}

        <NewThreadForm
          defaultCat={CATEGORIES[0].id}
          onThreadCreated={handleThreadCreated}
        />

      </div>
    </section>
  );
}