import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserById } from "./userSlice";

const PostAuthor = ({ userId, showAvatar = true, avatarSize = "avatar-sm" }) => {
  const author = useSelector((state) => getUserById(state, userId));

  if (!author) {
    return (
      <span className="text-muted small d-inline-flex align-items-center gap-1">
        <i className="bi bi-person-circle"></i>
        <span>Unknown author</span>
      </span>
    );
  }

  return (
    <Link
      to={`/users/${author.id}`}
      className="text-decoration-none d-inline-flex align-items-center gap-2 text-white"
    >
      {showAvatar && (
        <img
          src={
            author.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              author.name
            )}&background=6366f1&color=fff`
          }
          alt={author.name}
          className={`${avatarSize} avatar-img`}
        />
      )}
      <div>
        <div className="fw-bold small text-white text-nowrap">{author.name}</div>
        <div className="text-muted" style={{ fontSize: "0.75rem" }}>
          {author.handle || `@${author.username.toLowerCase()}`}
        </div>
      </div>
    </Link>
  );
};

export default PostAuthor;