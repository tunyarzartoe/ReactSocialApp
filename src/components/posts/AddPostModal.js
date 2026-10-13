import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewPost } from "./postSlice";
import { fetchAllUsers } from "../users/userSlice";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";

const AddPostModal = ({ show, handleClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(false);

  const users = useSelector(fetchAllUsers);
  const dispatch = useDispatch();

  const usersOption = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  const canCreate = [title.trim(), content.trim(), author].every(Boolean);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setAuthor(null);
  };

  const onCancel = () => {
    resetForm();
    handleClose();
  };

  const onPostCreate = async (e) => {
    e.preventDefault();
    if (!canCreate) return;
    try {
      setLoading(true);
      await dispatch(
        addNewPost({ title: title.trim(), body: content.trim(), userId: author.value })
      ).unwrap();
      toast.success("✨ Post created successfully!");
      resetForm();
      handleClose();
    } catch (err) {
      console.error("Failed to create post:", err);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      contentClassName="modal-glass"
      dialogClassName="modal-dialog-mobile"
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>
          <i className="bi bi-plus-circle me-2" style={{ color: "var(--accent)" }} />
          New Post
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={onPostCreate}>
          <div className="mb-3">
            <label className="form-label-custom">Post Title</label>
            <input
              type="text"
              className="form-control form-control-dark"
              placeholder="Enter an engaging title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label-custom">Content</label>
            <textarea
              className="form-control form-control-dark"
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              style={{ resize: "none" }}
            />
          </div>

          <div className="mb-1">
            <label className="form-label-custom">Author</label>
            <Select
              placeholder="Select an author..."
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
        <button className="btn-ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button
          className="btn-accent"
          onClick={onPostCreate}
          disabled={!canCreate || loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
              Creating...
            </>
          ) : (
            <>
              <i className="bi bi-send me-1" /> Publish Post
            </>
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPostModal;
