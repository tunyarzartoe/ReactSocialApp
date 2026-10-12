import React, { useState } from "react";
import { useSelector } from "react-redux";
import PostLists from "../../components/posts/PostLists";
import AddPostModal from "../../components/posts/AddPostModal";
import { fetchAllPosts, getPostStatus } from "../../components/posts/postSlice";
import { fetchAllUsers } from "../../components/users/userSlice";

const PostContainer = () => {
  const [showAdd, setShowAdd] = useState(false);
  const posts = useSelector(fetchAllPosts);
  const users = useSelector(fetchAllUsers);
  const status = useSelector(getPostStatus);

  // Total reactions across all posts
  const totalReactions = posts.reduce((sum, p) => {
    if (!p.reactions) return sum;
    return sum + Object.values(p.reactions).reduce((s, v) => s + v, 0);
  }, 0);

  return (
    <div className="container" style={{ maxWidth: 600, paddingTop: "0.5rem" }}>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">
          <i className="bi bi-rss me-2" style={{ color: "var(--accent)", fontSize: "1.4rem" }} />
          Feed
        </h1>
        <p className="page-subtitle">Discover posts from the community</p>
      </div>

      {/* Stats bar */}
      {status === "success" && (
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-value">{posts.length}</div>
            <div className="stat-label">Posts</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{users.length}</div>
            <div className="stat-label">Authors</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalReactions}</div>
            <div className="stat-label">Reactions</div>
          </div>
        </div>
      )}

      {/* Post Feed */}
      <PostLists />

      {/* Floating Action Button */}
      <button
        className="fab"
        title="New Post"
        onClick={() => setShowAdd(true)}
      >
        <i className="bi bi-plus-lg" />
      </button>

      {/* Add Post Modal */}
      <AddPostModal show={showAdd} handleClose={() => setShowAdd(false)} />
    </div>
  );
};

export default PostContainer;
