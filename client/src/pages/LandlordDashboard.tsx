import { Link } from "react-router-dom";
import { useListings } from "../hooks/useListings.ts";

export default function LandlordDashboard() {
  const { data, isLoading } = useListings({ limit: 20 });
  const listings = data?.data || [];

  const stats = [
    { label: "Total Listings", value: listings.length, icon: "🏠", color: "var(--color-primary-light)" },
    { label: "Active", value: listings.filter(l => l.status === "active").length, icon: "✅", color: "var(--color-accent)" },
    { label: "Pending Review", value: listings.filter(l => l.status === "pending").length, icon: "⏳", color: "var(--color-amber)" },
    { label: "Total Views", value: listings.reduce((s, l) => s + l.viewCount, 0), icon: "👁", color: "var(--color-sky)" },
  ];

  return (
    <div style={{ background: "var(--color-background)", minHeight: "100vh" }}>
      <div style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", padding: "32px 0" }}>
        <div className="container-xl">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div className="badge badge-primary" style={{ marginBottom: "8px" }}>Landlord Dashboard</div>
              <h1 style={{ fontSize: "1.8rem" }}>My Listings</h1>
            </div>
            <Link to="/add-listing" className="btn btn-primary" style={{ padding: "12px 24px" }}>+ Add New Listing</Link>
          </div>
        </div>
      </div>

      <div className="container-xl" style={{ paddingTop: "32px", paddingBottom: "60px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "36px" }}>
          {stats.map(s => (
            <div key={s.label} className="card" style={{ padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{s.icon}</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: s.color }}>{s.value.toLocaleString()}</div>
              <div style={{ fontSize: "0.82rem", color: "var(--color-foreground-muted)", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Listings Table */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "1.1rem" }}>All Listings</h2>
          </div>
          {isLoading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "var(--color-foreground-muted)" }}>Loading…</div>
          ) : listings.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📭</div>
              <p style={{ color: "var(--color-foreground-muted)", marginBottom: "20px" }}>You haven't added any listings yet.</p>
              <Link to="/add-listing" className="btn btn-primary">Add Your First Listing</Link>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                    {["Property", "City", "Price", "Status", "Views", "Actions"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.78rem", color: "var(--color-foreground-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {listings.map(l => (
                    <tr key={l.id} style={{ borderBottom: "1px solid var(--color-border)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "2px" }}>{l.title}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--color-foreground-muted)", textTransform: "capitalize" }}>{l.type}</div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "0.88rem", color: "var(--color-foreground-muted)" }}>{l.city}</td>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: "var(--color-primary-light)", fontSize: "0.9rem" }}>{parseInt(l.price).toLocaleString()} {l.currency}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span className={`badge ${l.status === "active" ? "badge-accent" : l.status === "pending" ? "badge-amber" : "badge-rose"}`}>
                          {l.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "0.88rem", color: "var(--color-foreground-muted)" }}>👁 {l.viewCount}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Link to={`/properties/${l.id}`} className="btn btn-outline" style={{ fontSize: "0.78rem", padding: "5px 12px" }}>View</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
