import React from "react";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../lib/store.jsx";

export default function ThreadList({
  threads = [],
  showReplyCount = true
}) {
  const navigate = useNavigate();

  if (!threads.length) {
    return (
      <div className="slot" style={{ padding: 20 }}>
        <p style={{ margin: 0 }}>
          No threads here yet.
        </p>
      </div>
    );
  }

  return (
    <div className="slot" style={{ padding: 0 }}>
      {threads.map((thread) => {
        const threadId = thread._id;
        const replyCount = thread.replies?.length || 0;

        return (
          <div
            key={threadId}
            className="thread-row"
            onClick={() =>
              navigate("/forum/t/" + threadId)
            }
            style={{ cursor: "pointer" }}
          >
            <div>
              <div>{thread.title}</div>

              <div className="meta">
                {thread.author} ·{" "}
                {timeAgo(
                  new Date(thread.createdAt).getTime()
                )}

                {showReplyCount &&
                  ` · ${replyCount} ${
                    replyCount === 1
                      ? "reply"
                      : "replies"
                  }`}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

