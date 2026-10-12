import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getPostById } from "./postSlice";
import { getUserById } from "../users/userSlice";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import EditPostModal from "./EditPostModal";

const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const SinglePost = () => {
  const { postId } = useParams();
  const post = useSelector((state) => getPostById(state, Number(postId)));
  const author = useSelector((state) =>
    post ? getUserById(state, Number(post.userId)) : null
  );
  const [showEdit, setShowEdit] = useState(false);

  if (!post) {
    return (
      <div className="not-found">
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
        <h2>Post Not Found</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          This post may have been deleted or doesn&apos;t exist.
        </p>
        <Link to="/" className="back-btn" style={{ display: "inline-flex" }}>
          <i className="bi bi-arrow-left" /> Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="single-post-wrapper">
      {/* Back */}
      <Link to="/" className="back-btn" style={{ marginBottom: "1.25rem", display: "inline-flex" }}>
        <i className="bi bi-arrow-left" /> Back to Feed
      </Link>

      <div className="single-post-card" style={{ marginTop: "1rem" }}>
        {/* Header */}
        <div style={{ padding: "1.5rem 1.5rem 1rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span className="single-post-badge">
              <i className="bi bi-hash" /> Post #{post.id}
            </span>
            <button
              className="btn-edit-icon"
              onClick={() => setShowEdit(true)}
              title="Edit Post"
            >
              <i className="bi bi-pencil-square" />
            </button>
          </div>
          <h1 className="single-post-title">{post.title}</h1>

          {/* Author info */}
          {author && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "0.75rem",
                padding: "0.75rem",
                background: "var(--bg-card)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="user-avatar-lg" style={{ width: 40, height: 40, fontSize: "1rem" }}>
                {getInitials(author.name)}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>
                  {author.name}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  {author.email}
                </div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <TimeAgo date={post.date} />
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem" }}>
          <p className="single-post-body">{post.body}</p>
        </div>

        {/* Reactions */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 500 }}>
            Reactions
          </span>
          <ReactionButtons post={post} />
        </div>
      </div>

      {/* Edit Modal */}
      <EditPostModal
        post={post}
        show={showEdit}
        handleClose={() => setShowEdit(false)}
      />
    </div>
  );
};

export default SinglePost;
