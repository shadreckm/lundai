import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{
      background: "var(--color-surface)",
      borderTop: "1px solid var(--color-border)",
      padding: "48px 0 28px",
    }}>
      <div className="container-xl">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "40px" }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{
                width: 34, height: 34,
                background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: "1rem", color: "#fff",
              }}>L</div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.15rem" }}>
                <span className="gradient-text">LUND</span>
                <span style={{ color: "var(--color-foreground)" }}>AI</span>
              </span>
            </div>
            <p style={{ color: "var(--color-foreground-muted)", fontSize: "0.875rem", lineHeight: 1.7 }}>
              AI-powered student housing marketplace helping African students find safe, verified accommodation near their campus.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "16px", fontSize: "0.9rem" }}>Platform</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[["Browse Listings", "/search"], ["Add Property", "/add-listing"], ["AI Search", "/search"]].map(([label, href]) => (
                <Link key={href} to={href} style={{ color: "var(--color-foreground-muted)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--color-foreground)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--color-foreground-muted)")}
                >{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "16px", fontSize: "0.9rem" }}>Cities</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {["Lilongwe", "Blantyre", "Zomba", "Mzuzu"].map(city => (
                <Link key={city} to={`/search?city=${city}`} style={{ color: "var(--color-foreground-muted)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--color-foreground)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--color-foreground-muted)")}
                >{city}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "16px", fontSize: "0.9rem" }}>Contact</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a href="https://wa.me/14155238886" style={{ color: "var(--color-accent)", textDecoration: "none", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "6px" }}>
                📱 WhatsApp Bot
              </a>
              <a href="mailto:hello@lundai.com" style={{ color: "var(--color-foreground-muted)", textDecoration: "none", fontSize: "0.875rem" }}>
                hello@lundai.com
              </a>
            </div>
          </div>
        </div>

        <div className="divider" style={{ marginBottom: "24px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ color: "var(--color-foreground-muted)", fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} LUNDAI. Built for African students. 🌍
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <span className="badge badge-accent">🤖 AI-Powered</span>
            <span className="badge badge-primary">✅ Verified Listings</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
