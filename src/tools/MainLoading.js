import React from "react";

const MainLoading = () => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="spinner-grow text-primary"
        role="status"
        style={{ width: "3.5rem", height: "3.5rem" }}
      >
        <span className="visually-hidden">Loading Social App...</span>
      </div>
      <h5 className="mt-4 text-white fw-bold">SocialVerse</h5>
      <p className="text-muted small">Connecting your social sphere...</p>
    </div>
  );
};

export default MainLoading;
