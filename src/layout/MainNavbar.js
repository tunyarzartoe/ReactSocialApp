import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Offcanvas } from "react-bootstrap";

const MainNavbar = () => {
  const location = useLocation();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const navLinks = [
    { to: "/", label: "Home", icon: "bi-house-fill" },
    { to: "/post/post-table", label: "Posts", icon: "bi-file-text-fill" },
    { to: "/users", label: "Users", icon: "bi-people-fill" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleClose = () => setShowOffcanvas(false);
  const handleToggle = () => setShowOffcanvas((prev) => !prev);

  return (
    <Navbar expand="md" sticky="top" className="navbar">
      <Container>
        <Link to="/" className="brand-logo" onClick={handleClose}>
          <div className="brand-logo-icon">
            <img
              src="/network.png"
              alt="logo"
              width="22"
              height="22"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
          <span className="brand-logo-text">SocialApp</span>
        </Link>

        <Navbar.Toggle
          aria-controls="offcanvasNavbar"
          onClick={handleToggle}
          className="navbar-toggler-custom"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list" style={{ color: "var(--text-primary)", fontSize: "1.35rem" }} />
        </Navbar.Toggle>

        <Navbar.Offcanvas
          id="offcanvasNavbar"
          placement="end"
          show={showOffcanvas}
          onHide={handleClose}
          className="navbar-offcanvas-custom"
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title className="d-flex align-items-center gap-2">
              <div className="brand-logo-icon" style={{ width: 30, height: 30, fontSize: 14 }}>
                <img
                  src="/network.png"
                  alt="logo"
                  width="18"
                  height="18"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
              <span style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "1.1rem" }}>
                SocialApp
              </span>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="ms-auto gap-2">
              {navLinks.map(({ to, label, icon }) => (
                <Nav.Item key={to}>
                  <Link
                    to={to}
                    onClick={handleClose}
                    className={`nav-pill-link ${isActive(to) ? "active-nav" : ""}`}
                  >
                    <i className={`bi ${icon}`} />
                    <span>{label}</span>
                  </Link>
                </Nav.Item>
              ))}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
