import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "react-bootstrap";
import { deletePost } from "./postSlice";
import { toast } from "react-toastify";

const DeletePostModal = ({ post, show, handleClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    if (!post) return;
    try {
      setLoading(true);
      await dispatch(deletePost({ id: post.id })).unwrap();
      toast.success("🗑️ Post deleted successfully!");
      handleClose();
    } catch (err) {
      console.error("Failed to delete:", err);
      toast.error("Failed to delete post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="modal-glass"
      dialogClassName="modal-dialog-mobile"
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>
          <i
            className="bi bi-exclamation-triangle-fill me-2"
            style={{ color: "var(--accent-red)" }}
          />
          Delete Post
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p style={{ color: "var(--text-secondary)", marginBottom: 0, wordBreak: "break-word" }}>
          Are you sure you want to delete{" "}
          <strong style={{ color: "var(--text-primary)" }}>
            &ldquo;{post?.title}&rdquo;
          </strong>
          ? This action cannot be undone.
        </p>
      </Modal.Body>

      <Modal.Footer className="modal-footer-mobile">
        <button className="btn-ghost" onClick={handleClose} disabled={loading}>
          Cancel
        </button>
        <button
          onClick={onDelete}
          disabled={loading}
          style={{
            background: "var(--accent-red)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius-sm)",
            padding: "0.45rem 1.1rem",
            fontWeight: 500,
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "var(--transition)",
          }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" />
              Deleting...
            </>
          ) : (
            <>
              <i className="bi bi-trash me-1" /> Delete
            </>
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeletePostModal;
