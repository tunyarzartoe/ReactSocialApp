import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import { updatePost } from "./postSlice";
import { fetchAllUsers } from "../users/userSlice";
import { toast } from "react-toastify";

const EditPostModal = ({ post, show, handleClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const users = useSelector(fetchAllUsers);

  const usersOption = users.map((u) => ({ value: u.id, label: u.name }));

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setContent(post.body || "");
      if (post.userId && users.length > 0) {
        const u = users.find((u) => u.id === post.userId);
        setAuthor(u ? { value: u.id, label: u.name } : null);
      }
    }
  }, [post, users]);

  const canUpdate =
    [title.trim(), content.trim(), author].every(Boolean) && !loading;

  const onUpdate = async (e) => {
    e.preventDefault();
    if (!canUpdate) return;
    try {
      setLoading(true);
      await dispatch(
        updatePost({
          id: post.id,
          title: title.trim(),
          body: content.trim(),
          userId: author.value,
          reactions: post.reactions,
        })
      ).unwrap();
      toast.success("✅ Post updated successfully!");
      handleClose();
    } catch (err) {
      console.error("Failed to update:", err);
      toast.error("Failed to update post. Please try again.");
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
          <i className="bi bi-pencil-square me-2" style={{ color: "var(--accent)" }} />
          Edit Post
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={onUpdate}>
          <div className="mb-3">
            <label className="form-label-custom">Post Title</label>
            <input
              type="text"
              className="form-control form-control-dark"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label-custom">Content</label>
            <textarea
              className="form-control form-control-dark"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              style={{ resize: "none" }}
            />
          </div>

          <div className="mb-1">
            <label className="form-label-custom">Author</label>
            <Select
              classNamePrefix="select"
              className="select-dark"
              value={author}
              onChange={setAuthor}
              options={usersOption}
              menuPortalTarget={typeof document !== "undefined" ? document.body : null}
              menuPosition="fixed"
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer className="modal-footer-mobile">
        <button className="btn-ghost" onClick={handleClose} disabled={loading}>
          Cancel
        </button>
        <button
          className="btn-accent"
          onClick={onUpdate}
          disabled={!canUpdate || loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" />
              Saving...
            </>
          ) : (
            <>
              <i className="bi bi-check2 me-1" /> Save Changes
            </>
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditPostModal;
