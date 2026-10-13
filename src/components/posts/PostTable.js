import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import $ from "jquery";
import "datatables.net";
import { fetchAllPosts, getPostError, getPostStatus } from "./postSlice";
import DeletePostModal from "./DeletePostModal";
import EditPostModal from "./EditPostModal";
import AddPostModal from "./AddPostModal";
import Loading from "../../tools/Loading";
import { formatDistanceToNow, parseISO } from "date-fns";

const PostTable = () => {
  const status = useSelector(getPostStatus);
  const error = useSelector(getPostError);
  const posts = useSelector(fetchAllPosts);

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (status === "success" && posts.length > 0) {
      const table = $("#postTable");
      if ($.fn.DataTable.isDataTable("#postTable")) {
        table.DataTable().destroy();
      }
      table.DataTable({
        responsive: false,
        pageLength: 10,
        order: [[3, "desc"]],
        columnDefs: [
          { targets: [4], orderable: false },
        ],
        language: {
          search: "",
          searchPlaceholder: "Search posts...",
        },
        destroy: true,
      });
    }
  }, [posts, status]);

  if (status === "loading") return <Loading />;

  if (status === "fail") {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><i className="bi bi-wifi-off" /></div>
        <div className="empty-state-title">Failed to load posts</div>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{error}</p>
      </div>
    );
  }

  const handleEdit = (post) => {
    setSelectedPost(post);
    setShowEdit(true);
  };

  const handleDelete = (post) => {
    setSelectedPost(post);
    setShowDelete(true);
  };

  return (
    <div className="container mt-2 mb-5">
      {/* Page Header */}
      <div className="page-header d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h1 className="page-title">Post Management</h1>
          <p className="page-subtitle">{posts.length} posts total</p>
        </div>
        <button className="btn-accent" onClick={() => setShowAdd(true)}>
          <i className="bi bi-plus-lg me-1" /> New Post
        </button>
      </div>

      <div className="datatable-wrapper">
        <div className="table-responsive-container">
          <table id="postTable" className="display w-100 responsive-data-table">
            <thead>
              <tr>
                <th style={{ width: "8%" }}>ID</th>
                <th style={{ width: "30%" }}>Title</th>
                <th style={{ width: "37%" }}>Body</th>
                <th style={{ width: "15%" }}>Date</th>
                <th style={{ width: "10%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <span
                      style={{
                        background: "rgba(79,142,247,0.12)",
                        color: "var(--accent)",
                        borderRadius: 20,
                        padding: "2px 8px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      #{post.id}
                    </span>
                  </td>
                  <td style={{ maxWidth: 220 }}>
                    <span
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textTransform: "capitalize",
                      }}
                    >
                      {post.title}
                    </span>
                  </td>
                  <td style={{ maxWidth: 300 }}>
                    <span
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        color: "var(--text-secondary)",
                        fontSize: "0.8125rem",
                      }}
                    >
                      {post.body}
                    </span>
                  </td>
                  <td style={{ whiteSpace: "nowrap", color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                    {post.date
                      ? formatDistanceToNow(parseISO(post.date)) + " ago"
                      : "—"}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button
                        className="btn-edit-icon"
                        onClick={() => handleEdit(post)}
                        title="Edit"
                        aria-label="Edit post"
                      >
                        <i className="bi bi-pencil-square" />
                      </button>
                      <button
                        className="btn-delete-icon"
                        onClick={() => handleDelete(post)}
                        title="Delete"
                        aria-label="Delete post"
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddPostModal show={showAdd} handleClose={() => setShowAdd(false)} />
      <EditPostModal
        post={selectedPost}
        show={showEdit}
        handleClose={() => { setShowEdit(false); setSelectedPost(null); }}
      />
      <DeletePostModal
        post={selectedPost}
        show={showDelete}
        handleClose={() => { setShowDelete(false); setSelectedPost(null); }}
      />
    </div>
  );
};

export default PostTable;
