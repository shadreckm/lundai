import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useListing } from "../hooks/useListings.ts";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, isError } = useListing(id!);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });

  if (isLoading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", flexDirection: "column", gap: "16px" }}>
      <div style={{ width: 48, height: 48, border: "3px solid var(--color-primary)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <p style={{ color: "var(--color-foreground-muted)" }}>Loading property…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (isError || !property) return (
    <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--color-foreground-muted)" }}>
      <div style={{ fontSize: "4rem", marginBottom: "16px" }}>😕</div>
      <h2 style={{ marginBottom: "10px" }}>Property Not Found</h2>
      <Link to="/search" className="btn btn-primary">Browse All Listings</Link>
    </div>
  );

  const images = property.images || [];
  const amenities = property.amenities as string[];

  return (
    <div style={{ background: "var(--color-background)", minHeight: "100vh" }}>
      <div className="container-xl" style={{ paddingTop: "32px", paddingBottom: "64px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "24px", fontSize: "0.85rem", color: "var(--color-foreground-muted)" }}>
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <Link to="/search" style={{ color: "inherit", textDecoration: "none" }}>Listings</Link>
          <span>/</span>
          <span style={{ color: "var(--color-foreground)" }}>{property.city}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px", alignItems: "start" }}>
          {/* Left */}
          <div>
            {/* Gallery */}
            <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: "24px", background: "var(--color-surface-2)" }}>
              {images.length > 0 ? (
                <div style={{ position: "relative", height: "400px" }}>
                  <img src={images[currentImageIndex]} alt={property.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {images.length > 1 && (
                    <>
                      <button onClick={() => setCurrentImageIndex(i => (i - 1 + images.length) % images.length)}
                        style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: 40, height: 40, color: "#fff", cursor: "pointer", fontSize: "1.2rem" }}>‹</button>
                      <button onClick={() => setCurrentImageIndex(i => (i + 1) % images.length)}
                        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: 40, height: 40, color: "#fff", cursor: "pointer", fontSize: "1.2rem" }}>›</button>
                    </>
                  )}
                </div>
              ) : (
                <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>🏠</div>
              )}
            </div>

            {/* Title */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
                <span className="badge badge-primary" style={{ textTransform: "capitalize" }}>{property.type}</span>
                {property.isVerified && <span className="badge badge-accent">✅ Verified</span>}
                {property.isFurnished && <span className="badge badge-amber">🪑 Furnished</span>}
              </div>
              <h1 style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{property.title}</h1>
              <p style={{ color: "var(--color-foreground-muted)", fontSize: "0.9rem" }}>📍 {property.address}, {property.city}, {property.country}</p>
            </div>

            {/* AI Summary */}
            {property.aiSummary && (
              <div style={{ background: "rgba(124,92,252,0.08)", border: "1px solid rgba(124,92,252,0.2)", borderRadius: "var(--radius-md)", padding: "16px", marginBottom: "24px", display: "flex", gap: "12px" }}>
                <span style={{ fontSize: "1.3rem" }}>🤖</span>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--color-primary-light)", fontWeight: 700, marginBottom: "4px", textTransform: "uppercase" }}>AI Summary</div>
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>{property.aiSummary}</p>
                </div>
              </div>
            )}

            {/* Description */}
            <h2 style={{ fontSize: "1.15rem", marginBottom: "10px" }}>About This Property</h2>
            <p style={{ color: "var(--color-foreground-muted)", lineHeight: 1.8, marginBottom: "24px", fontSize: "0.93rem" }}>{property.description}</p>

            {/* Details */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
              {[
                { icon: "🛏", label: "Bedrooms", value: property.bedrooms },
                { icon: "🛁", label: "Bathrooms", value: property.bathrooms },
                { icon: "🏷️", label: "Type", value: property.type },
                { icon: "🪑", label: "Furnished", value: property.isFurnished ? "Yes" : "No" },
              ].map(item => (
                <div key={item.label} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "14px", display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "1.3rem" }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "var(--color-foreground-muted)", textTransform: "uppercase", fontWeight: 600 }}>{item.label}</div>
                    <div style={{ fontWeight: 700, textTransform: "capitalize" }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "1.15rem", marginBottom: "12px" }}>Amenities</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {amenities.map(a => <span key={a} className="tag">{a}</span>)}
                </div>
              </div>
            )}

            {/* Universities */}
            {(property.nearbyUniversities as string[]).length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "1.15rem", marginBottom: "10px" }}>Nearby Universities</h2>
                {(property.nearbyUniversities as string[]).map(u => (
                  <div key={u} style={{ color: "var(--color-foreground-muted)", fontSize: "0.9rem", marginBottom: "6px" }}>🎓 {u}</div>
                ))}
              </div>
            )}

            {/* Map Placeholder */}
            <div className="map-placeholder" style={{ height: "200px", marginTop: "16px" }}>
              <span style={{ fontSize: "2rem" }}>🗺️</span>
              <p style={{ fontWeight: 600 }}>{property.address}, {property.city}</p>
              <p style={{ fontSize: "0.8rem", opacity: 0.5 }}>Map integration coming soon</p>
            </div>
          </div>

          {/* Right – Booking */}
          <div style={{ position: "sticky", top: "88px" }}>
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "1.9rem", fontWeight: 900, color: "var(--color-primary-light)" }}>
                  {parseInt(property.price).toLocaleString()} <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--color-foreground-muted)" }}>{property.currency}/mo</span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-accent)", marginTop: "4px" }}>👁 {property.viewCount} views</div>
              </div>
              <div className="divider" style={{ marginBottom: "16px" }} />

              {!showContactForm ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button onClick={() => setShowContactForm(true)} className="btn btn-primary" style={{ width: "100%", padding: "13px" }}>📩 Contact Landlord</button>
                  <a href={`https://wa.me/?text=I'm interested in: ${encodeURIComponent(property.title)}`} className="btn btn-accent" style={{ width: "100%", padding: "13px", textAlign: "center" }}>📱 WhatsApp</a>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); alert("Inquiry sent! Landlord will contact you shortly."); setShowContactForm(false); }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input type="text" className="input" required placeholder="Your name" value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))} />
                    <input type="email" className="input" required placeholder="Email address" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} />
                    <input type="tel" className="input" placeholder="Phone (optional)" value={contactForm.phone} onChange={e => setContactForm(p => ({ ...p, phone: e.target.value }))} />
                    <textarea className="input" rows={3} required placeholder="Your message…" value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} style={{ resize: "vertical" }} />
                    <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Send Inquiry</button>
                    <button type="button" onClick={() => setShowContactForm(false)} className="btn btn-ghost" style={{ width: "100%", fontSize: "0.85rem" }}>Cancel</button>
                  </div>
                </form>
              )}

              <div className="divider" style={{ margin: "16px 0" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", color: "var(--color-foreground-muted)", fontSize: "0.8rem" }}>
                <span>🛡️ Verified by LUNDAI</span>
                <span>💳 Secure deposits via PayChangu</span>
                <span>⚡ Responds within 24 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
