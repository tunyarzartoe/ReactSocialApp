import React from "react";

const MainLoading = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0d1117 0%, #161b27 50%, #0d1b35 100%)",
      }}
    >
      <div className="spinner-ring" style={{ width: 56, height: 56, borderWidth: 4 }} />
    </div>
  );
};

export default MainLoading;
