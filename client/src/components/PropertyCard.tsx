import { useState } from "react";
import { Link } from "react-router-dom";
import type { Property } from "../services/api.ts";

interface PropertyCardProps {
  property: Property;
}

const TYPE_LABELS: Record<string, string> = {
  room: "Room", apartment: "Apartment", hostel: "Hostel", studio: "Studio", shared: "Shared",
};

const TYPE_COLORS: Record<string, string> = {
  room: "badge-primary", apartment: "badge-accent", hostel: "badge-amber", studio: "badge-primary", shared: "badge-rose",
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const [imgError, setImgError] = useState(false);
  const primaryImage = property.images?.[0];

  return (
    <Link to={`/properties/${property.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div className="card" style={{ overflow: "hidden", cursor: "pointer" }}>
        {/* Image */}
        <div style={{ position: "relative", height: "200px", background: "var(--color-surface-2)", overflow: "hidden" }}>
          {primaryImage && !imgError ? (
            <img
              src={primaryImage}
              alt={property.title}
              onError={() => setImgError(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>🏠</div>
          )}

          {/* Verified badge */}
          {property.isVerified && (
            <div style={{ position: "absolute", top: "12px", right: "12px" }}>
              <span className="badge badge-accent" style={{ background: "rgba(0,229,160,0.9)", backdropFilter: "blur(8px)" }}>
                ✓ Verified
              </span>
            </div>
          )}

          {/* Type badge */}
          <div style={{ position: "absolute", top: "12px", left: "12px" }}>
            <span className={`badge ${TYPE_COLORS[property.type] || "badge-primary"}`} style={{ backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.5)" }}>
              {TYPE_LABELS[property.type] || property.type}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "16px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "6px", color: "var(--color-foreground)", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>
            {property.title}
          </h3>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-foreground-muted)", fontSize: "0.82rem", marginBottom: "12px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {property.city}, {property.country}
          </div>

          {/* AI Summary */}
          {property.aiSummary && (
            <p style={{ fontSize: "0.8rem", color: "var(--color-foreground-muted)", marginBottom: "12px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>
              🤖 {property.aiSummary}
            </p>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
              {(property.amenities as string[]).slice(0, 3).map((a) => (
                <span key={a} className="tag" style={{ fontSize: "0.72rem" }}>{a}</span>
              ))}
              {property.amenities.length > 3 && (
                <span className="tag" style={{ fontSize: "0.72rem" }}>+{property.amenities.length - 3}</span>
              )}
            </div>
          )}

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--color-border)", paddingTop: "12px" }}>
            <div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--color-primary-light)" }}>
                {parseInt(property.price).toLocaleString()} <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--color-foreground-muted)" }}>{property.currency}/mo</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", color: "var(--color-foreground-muted)", fontSize: "0.78rem", alignItems: "center" }}>
              <span>🛏 {property.bedrooms}</span>
              <span>🛁 {property.bathrooms}</span>
              {property.isFurnished && <span>🪑</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
