import { Link } from "react-router-dom";
import { useListings } from "../hooks/useListings.ts";

export default function AdminDashboard() {
  const { data, isLoading } = useListings({ limit: 50 });
  const listings = data?.data || [];

  const stats = [
    { label: "Total Properties", value: data?.total || 0, icon: "🏠", color: "var(--color-primary-light)", change: "+12 this week" },
    { label: "Active Listings", value: listings.filter(l => l.status === "active").length, icon: "✅", color: "var(--color-accent)", change: "+5 today" },
    { label: "Pending Review", value: listings.filter(l => l.status === "pending").length, icon: "⏳", color: "var(--color-amber)", change: "Needs action" },
    { label: "Verified", value: listings.filter(l => l.isVerified).length, icon: "🛡️", color: "var(--color-sky)", change: "Trust score: 92%" },
  ];

  const cities = ["Lilongwe", "Blantyre", "Zomba", "Mzuzu"];
  const listingsByCity = cities.map(c => ({
    city: c,
    count: listings.filter(l => l.city === c).length,
    pct: listings.length ? Math.round((listings.filter(l => l.city === c).length / listings.length) * 100) : 0,
  }));

  return (
    <div style={{ background: "var(--color-background)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", padding: "32px 0" }}>
        <div className="container-xl">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div className="badge badge-rose" style={{ marginBottom: "8px" }}>🔑 Admin Portal</div>
              <h1 style={{ fontSize: "1.8rem" }}>LUNDAI Admin Dashboard</h1>
              <p style={{ color: "var(--color-foreground-muted)", fontSize: "0.9rem", marginTop: "4px" }}>Platform overview & management</p>
            </div>
            <Link to="/add-listing" className="btn btn-primary">+ Add Listing</Link>
          </div>
        </div>
      </div>

      <div className="container-xl" style={{ paddingTop: "32px", paddingBottom: "60px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "36px" }}>
          {stats.map(s => (
            <div key={s.label} className="card" style={{ padding: "22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <span style={{ fontSize: "1.6rem" }}>{s.icon}</span>
                <span className="badge badge-accent" style={{ fontSize: "0.7rem", padding: "3px 8px" }}>{s.change}</span>
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: s.color }}>{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</div>
              <div style={{ fontSize: "0.82rem", color: "var(--color-foreground-muted)", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", marginBottom: "36px" }}>
          {/* City breakdown */}
          <div className="card" style={{ padding: "24px" }}>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "20px" }}>📍 Listings by City</h2>
            {listingsByCity.map(({ city, count, pct }) => (
              <div key={city} style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{city}</span>
                  <span style={{ fontSize: "0.82rem", color: "var(--color-foreground-muted)" }}>{count} listings</span>
                </div>
                <div style={{ height: "6px", background: "var(--color-surface-3)", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))", borderRadius: "99px", transition: "width 0.5s ease" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ padding: "24px" }}>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>⚡ Quick Actions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link to="/search" className="btn btn-outline" style={{ justifyContent: "flex-start", fontSize: "0.88rem" }}>🔍 Browse All Listings</Link>
              <Link to="/add-listing" className="btn btn-outline" style={{ justifyContent: "flex-start", fontSize: "0.88rem" }}>➕ Add New Listing</Link>
              <button className="btn btn-outline" style={{ justifyContent: "flex-start", fontSize: "0.88rem" }} onClick={() => alert("WhatsApp bot management coming soon.")}>📱 WhatsApp Bot Status</button>
              <button className="btn btn-outline" style={{ justifyContent: "flex-start", fontSize: "0.88rem" }} onClick={() => alert("AI analytics coming soon.")}>🤖 AI Search Analytics</button>
            </div>
          </div>
        </div>

        {/* Listings Table */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "1.1rem" }}>All Platform Listings</h2>
            <span className="badge badge-primary">{data?.total || 0} total</span>
          </div>
          {isLoading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "var(--color-foreground-muted)" }}>Loading…</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                    {["Property", "City", "Type", "Price", "Status", "Verified", "Views", "Actions"].map(h => (
                      <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: "0.75rem", color: "var(--color-foreground-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {listings.map(l => (
                    <tr key={l.id} style={{ borderBottom: "1px solid var(--color-border)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td style={{ padding: "12px 14px", maxWidth: "200px" }}>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title}</div>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: "0.85rem", color: "var(--color-foreground-muted)" }}>{l.city}</td>
                      <td style={{ padding: "12px 14px", fontSize: "0.82rem", textTransform: "capitalize", color: "var(--color-foreground-muted)" }}>{l.type}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--color-primary-light)", fontSize: "0.85rem", whiteSpace: "nowrap" }}>{parseInt(l.price).toLocaleString()}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span className={`badge ${l.status === "active" ? "badge-accent" : l.status === "pending" ? "badge-amber" : "badge-rose"}`}>{l.status}</span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        {l.isVerified ? <span className="badge badge-accent">✅</span> : <span className="badge badge-rose">❌</span>}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: "0.85rem", color: "var(--color-foreground-muted)" }}>{l.viewCount}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <Link to={`/properties/${l.id}`} className="btn btn-outline" style={{ fontSize: "0.75rem", padding: "5px 10px" }}>View</Link>
                          <button className="btn btn-ghost" style={{ fontSize: "0.75rem", padding: "5px 10px", color: "var(--color-amber)" }} onClick={() => alert("Edit functionality coming soon.")}>Edit</button>
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
