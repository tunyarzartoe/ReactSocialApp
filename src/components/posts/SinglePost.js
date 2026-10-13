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
      {/* Back button */}
      <Link to="/" className="back-btn mb-3">
        <i className="bi bi-arrow-left" /> Back to Feed
      </Link>

      <div className="single-post-card">
        {/* Header */}
        <div className="single-post-header">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="single-post-badge">
              <i className="bi bi-hash" /> Post #{post.id}
            </span>
            <button
              className="btn-edit-icon"
              onClick={() => setShowEdit(true)}
              title="Edit Post"
              aria-label="Edit post"
            >
              <i className="bi bi-pencil-square me-1" />
              <span>Edit</span>
            </button>
          </div>
          <h1 className="single-post-title">{post.title}</h1>

          {/* Author info */}
          {author && (
            <div className="single-post-author-bar">
              <div className="d-flex align-items-center gap-2">
                <div className="user-avatar-lg author-avatar-mobile">
                  {getInitials(author.name)}
                </div>
                <div>
                  <div className="single-post-author-name">
                    {author.name}
                  </div>
                  <div className="single-post-author-email">
                    {author.email}
                  </div>
                </div>
              </div>
              <div className="single-post-time">
                <TimeAgo date={post.date} />
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="single-post-body-container">
          <p className="single-post-body">{post.body}</p>
        </div>

        {/* Reactions */}
        <div className="single-post-reactions-bar">
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
