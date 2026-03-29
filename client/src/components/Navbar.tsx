import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../services/api.ts";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = authApi.getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(10,10,15,0.85)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--color-border)",
    }}>
      <div className="container-xl" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: "68px" }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{
            width: 36, height: 36,
            background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: "1rem", color: "#fff",
          }}>L</div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem" }}>
            <span className="gradient-text">LUND</span>
            <span style={{ color: "var(--color-foreground)" }}>AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="desktop-nav">
          <Link to="/search" className="btn btn-ghost" style={{ fontSize: "0.9rem" }}>Browse</Link>
          <Link to="/add-listing" className="btn btn-ghost" style={{ fontSize: "0.9rem" }}>List Property</Link>
          {user?.role === "landlord" && (
            <Link to="/dashboard/landlord" className="btn btn-ghost" style={{ fontSize: "0.9rem" }}>Dashboard</Link>
          )}
          {user?.role === "admin" && (
            <Link to="/dashboard/admin" className="btn btn-ghost" style={{ fontSize: "0.9rem" }}>Admin</Link>
          )}

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "0.85rem", color: "#fff",
              }}>
                {user.fullName[0].toUpperCase()}
              </div>
              <button onClick={handleLogout} className="btn btn-outline" style={{ fontSize: "0.85rem", padding: "7px 16px" }}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/search" className="btn btn-primary" style={{ padding: "9px 22px" }}>
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="btn btn-ghost"
          style={{ display: "none", padding: "8px" }}
          aria-label="Toggle menu"
          id="mobile-menu-toggle"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
            ) : (
              <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          padding: "12px 24px 20px",
          borderTop: "1px solid var(--color-border)",
          display: "flex", flexDirection: "column", gap: "4px",
        }}>
          <Link to="/search" className="btn btn-ghost" style={{ justifyContent: "flex-start" }} onClick={() => setMenuOpen(false)}>Browse Properties</Link>
          <Link to="/add-listing" className="btn btn-ghost" style={{ justifyContent: "flex-start" }} onClick={() => setMenuOpen(false)}>List Your Property</Link>
          {user ? (
            <button onClick={handleLogout} className="btn btn-outline" style={{ marginTop: "8px" }}>Logout</button>
          ) : (
            <Link to="/search" className="btn btn-primary" style={{ marginTop: "8px" }} onClick={() => setMenuOpen(false)}>Get Started</Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          #mobile-menu-toggle { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
