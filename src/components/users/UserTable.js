import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers, getUserError, getUserStatus, getAllUsers } from "./userSlice";
import $ from "jquery";
import "datatables.net";
import Loading from "../../tools/Loading";

const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

// Cycle through gradient colors for avatars
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#4f8ef7,#7c3aed)",
  "linear-gradient(135deg,#22c55e,#059669)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#06b6d4,#3b82f6)",
  "linear-gradient(135deg,#ec4899,#8b5cf6)",
  "linear-gradient(135deg,#f97316,#ef4444)",
  "linear-gradient(135deg,#14b8a6,#06b6d4)",
  "linear-gradient(135deg,#a855f7,#ec4899)",
  "linear-gradient(135deg,#84cc16,#22c55e)",
  "linear-gradient(135deg,#f43f5e,#f97316)",
];

const UserTable = () => {
  const dispatch = useDispatch();
  const status = useSelector(getUserStatus);
  const error = useSelector(getUserError);
  const users = useSelector(fetchAllUsers);

  useEffect(() => {
    if (status === "idle") dispatch(getAllUsers());
  }, [status, dispatch]);

  useEffect(() => {
    if (status === "success" && users.length > 0) {
      if ($.fn.DataTable.isDataTable("#userTable")) {
        $("#userTable").DataTable().destroy();
      }
      $("#userTable").DataTable({
        responsive: true,
        pageLength: 10,
        language: {
          search: "",
          searchPlaceholder: "Search users...",
        },
        destroy: true,
      });
    }
  }, [users, status]);

  if (status === "loading") return <Loading />;

  if (status === "fail") {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><i className="bi bi-wifi-off" /></div>
        <div className="empty-state-title">Failed to load users</div>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-3 mb-5">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <p className="page-subtitle">{users.length} members in the community</p>
      </div>

      {/* User Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {users.map((user, idx) => (
          <div key={user.id} className="user-card">
            <div
              className="user-avatar-lg"
              style={{ background: AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length] }}
            >
              {getInitials(user.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="user-info-name">{user.name}</p>
              <p className="user-info-username">@{user.username}</p>
              <div className="user-detail">
                <i className="bi bi-envelope" />
                <a
                  href={`mailto:${user.email}`}
                  style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.78rem" }}
                >
                  {user.email}
                </a>
              </div>
              <div className="user-detail">
                <i className="bi bi-telephone" />
                <span>{user.phone}</span>
              </div>
              <div className="user-detail">
                <i className="bi bi-building" />
                <span>{user.company?.name}</span>
              </div>
              <div className="user-detail">
                <i className="bi bi-geo-alt" />
                <span>{user.address?.city}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DataTable */}
      <div className="datatable-wrapper">
        <h5 style={{ color: "var(--text-primary)", fontWeight: 600, marginBottom: "1rem" }}>
          All Users — Directory
        </h5>
        <table id="userTable" className="display w-100">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id}>
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
                    #{user.id}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(user.name)}
                    </div>
                    {user.name}
                  </div>
                </td>
                <td style={{ color: "var(--accent)", fontSize: "0.8125rem" }}>
                  @{user.username}
                </td>
                <td>
                  <a
                    href={`mailto:${user.email}`}
                    style={{ color: "var(--text-secondary)", fontSize: "0.8125rem", textDecoration: "none" }}
                  >
                    {user.email}
                  </a>
                </td>
                <td style={{ color: "var(--text-secondary)", fontSize: "0.8125rem" }}>
                  {user.phone}
                </td>
                <td style={{ fontSize: "0.8125rem" }}>{user.company?.name}</td>
                <td style={{ color: "var(--text-secondary)", fontSize: "0.8125rem" }}>
                  {user.address?.city}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
