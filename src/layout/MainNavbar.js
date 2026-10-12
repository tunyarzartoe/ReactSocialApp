import React from "react";
import { Link, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Offcanvas } from "react-bootstrap";

const MainNavbar = () => {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home", icon: "bi-house-fill" },
    { to: "/post/post-table", label: "Posts", icon: "bi-file-text-fill" },
    { to: "/users", label: "Users", icon: "bi-people-fill" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Navbar expand="md" sticky="top" className="navbar">
      <Container>
        <Link to="/" className="brand-logo">
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
          style={{ border: "1px solid rgba(255,255,255,0.15)", padding: "4px 8px" }}
        >
          <i className="bi bi-list" style={{ color: "var(--text-primary)", fontSize: "1.2rem" }} />
        </Navbar.Toggle>

        <Navbar.Offcanvas
          id="offcanvasNavbar"
          placement="end"
          style={{ maxWidth: "240px", background: "var(--bg-modal)", borderLeft: "1px solid var(--border)" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title style={{ color: "var(--text-primary)", fontWeight: 700 }}>
              SocialApp
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="ms-auto gap-1">
              {navLinks.map(({ to, label, icon }) => (
                <Nav.Item key={to}>
                  <Link
                    to={to}
                    className={`nav-pill-link ${isActive(to) ? "active-nav" : ""}`}
                  >
                    <i className={`bi ${icon}`} />
                    {label}
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
