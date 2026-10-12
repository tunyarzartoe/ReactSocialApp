import React from "react";
import { Link } from "react-router-dom";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import PostAuthor from "../users/PostAuthor";

const PostItem = ({ post }) => {
  return (
    <div className="post-card">
      <div className="post-card-header">
        <h3 className="post-card-title">{post.title}</h3>
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "var(--accent)",
            background: "rgba(79,142,247,0.12)",
            border: "1px solid rgba(79,142,247,0.25)",
            borderRadius: 20,
            padding: "2px 8px",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          #{post.id}
        </span>
      </div>

      <div className="post-card-body">
        <p className="post-excerpt">{post.body}</p>
        <ReactionButtons post={post} />
      </div>

      <div className="post-card-footer">
        <div className="post-meta">
          <PostAuthor post={post} />
          <TimeAgo date={post.date} />
        </div>
        <Link to={`/post/${post.id}`} className="view-post-btn">
          Read more <i className="bi bi-arrow-right" />
        </Link>
      </div>
    </div>
  );
};

export default PostItem;
