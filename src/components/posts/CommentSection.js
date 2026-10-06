import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCommentsForPost,
  getPostComments,
  getCommentsLoading,
  addComment,
  deleteComment,
  toggleLikeComment,
} from "./postSlice";
import { getCurrentUser } from "../users/userSlice";
import TimeAgo from "./TimeAgo";

const CommentSection = ({ postId }) => {
  const dispatch = useDispatch();
  const comments = useSelector((state) => getPostComments(state, postId));
  const isLoading = useSelector((state) => getCommentsLoading(state, postId));
  const currentUser = useSelector(getCurrentUser);

  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (comments.length === 0 && !isLoading) {
      dispatch(fetchCommentsForPost(postId));
    }
  }, [postId, comments.length, isLoading, dispatch]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    dispatch(
      addComment({
        postId,
        comment: {
          name: currentUser?.name || "Anonymous",
          email: currentUser?.email || "user@reactsocial.app",
          body: commentText.trim(),
          avatar: currentUser?.avatar,
          userId: currentUser?.id,
        },
      })
    );

    setCommentText("");
  };

  const handleDelete = (commentId) => {
    dispatch(deleteComment({ postId, commentId }));
  };

  const handleLike = (commentId) => {
    dispatch(toggleLikeComment({ postId, commentId }));
  };

  return (
    <div className="comments-container animate-fade-in">
      {/* Add comment input */}
      <form onSubmit={handleAddComment} className="d-flex gap-2 mb-3">
        <img
          src={
            currentUser?.avatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          }
          alt="Current user"
          className="avatar-sm avatar-img align-self-start"
        />
        <div className="flex-grow-1 position-relative">
          <input
            type="text"
            className="form-control social-search-input py-2 px-3"
            placeholder="Write a thoughtful comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={!commentText.trim()}
          className="btn btn-primary px-3 rounded-pill d-flex align-items-center gap-1"
          style={{ height: "38px" }}
        >
          <i className="bi bi-send-fill" style={{ fontSize: "0.85rem" }}></i>
          <span className="d-none d-sm-inline">Post</span>
        </button>
      </form>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-3 text-muted small">
          <div
            className="spinner-border spinner-border-sm text-primary me-2"
            role="status"
          ></div>
          Loading conversations...
        </div>
      )}

      {/* Comments list */}
      <div className="d-flex flex-column gap-2 mt-2">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <img
              src={
                comment.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  comment.name
                )}&background=6366f1&color=fff`
              }
              alt={comment.name}
              className="avatar-sm avatar-img flex-shrink-0"
            />
            <div className="comment-bubble">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <div>
                  <span className="comment-author-name">{comment.name}</span>
                  <span className="text-muted ms-2" style={{ fontSize: "0.75rem" }}>
                    <TimeAgo date={comment.date} />
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleLike(comment.id)}
                    className="btn btn-sm p-0 border-0 text-muted"
                    style={{
                      color: comment.userLiked ? "#ec4899" : "inherit",
                      fontSize: "0.8rem",
                    }}
                    title="Like comment"
                  >
                    <i
                      className={`bi ${
                        comment.userLiked ? "bi-heart-fill text-danger" : "bi-heart"
                      } me-1`}
                    ></i>
                    <span>{comment.likes || 0}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    className="btn btn-sm p-0 border-0 text-muted"
                    style={{ fontSize: "0.8rem" }}
                    title="Delete comment"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
              <p className="comment-text">{comment.body}</p>
            </div>
          </div>
        ))}

        {!isLoading && comments.length === 0 && (
          <p className="text-muted text-center py-2 small">
            No comments yet. Be the first to start the discussion!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
