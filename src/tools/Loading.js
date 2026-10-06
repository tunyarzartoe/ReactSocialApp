import React from "react";

const Loading = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div
        className="spinner-border text-primary"
        role="status"
        style={{ width: "2.75rem", height: "2.75rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted fw-semibold" style={{ letterSpacing: "0.5px" }}>
        Loading feed updates...
      </p>
    </div>
  );
};

export default Loading;
