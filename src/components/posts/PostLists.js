import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getPostStatus, getPostError, fetchAllPosts } from "./postSlice";
import PostItem from "./PostItem";
import Loading from "../../tools/Loading";

const PostLists = () => {
  const status = useSelector(getPostStatus);
  const error = useSelector(getPostError);
  const posts = useSelector(fetchAllPosts);
  const [search, setSearch] = useState("");

  if (status === "loading") return <Loading />;

  if (status === "fail") {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <i className="bi bi-wifi-off" />
        </div>
        <div className="empty-state-title">Failed to load posts</div>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{error}</p>
      </div>
    );
  }

  if (status !== "success") return null;

  const orderedPosts = posts
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  const filtered = search.trim()
    ? orderedPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.body.toLowerCase().includes(search.toLowerCase())
      )
    : orderedPosts;

  return (
    <div>
      {/* Search */}
      <div className="search-wrapper">
        <i className="bi bi-search" />
        <input
          type="text"
          className="search-input"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="bi bi-search" />
          </div>
          <div className="empty-state-title">No posts found</div>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Try a different search term.
          </p>
        </div>
      ) : (
        filtered.map((post) => <PostItem key={post.id} post={post} />)
      )}
    </div>
  );
};

export default PostLists;
