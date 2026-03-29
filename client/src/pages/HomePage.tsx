import { useState } from "react";
import { Link } from "react-router-dom";
import AiSearchBar from "../components/AiSearchBar.tsx";
import PropertyCard from "../components/PropertyCard.tsx";
import PropertyCardSkeleton from "../components/PropertyCardSkeleton.tsx";
import { useListings } from "../hooks/useListings.ts";
import type { Property } from "../services/api.ts";

const CITIES = ["All", "Lilongwe", "Blantyre", "Zomba", "Mzuzu"];
const STATS = [
  { label: "Verified Listings", value: "500+", icon: "🏠" },
  { label: "Happy Students", value: "2,000+", icon: "🎓" },
  { label: "Cities Covered", value: "4", icon: "🌍" },
  { label: "Landlords", value: "300+", icon: "🤝" },
];

export default function HomePage() {
  const [aiResults, setAiResults] = useState<Property[] | null>(null);
  const [aiMessage, setAiMessage] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState("All");

  const { data, isLoading } = useListings({
    city: selectedCity === "All" ? undefined : selectedCity,
    limit: 6,
  });

  const displayedProperties = aiResults ?? data?.data ?? [];

  const handleAiResults = (results: Property[], message: string) => {
    setAiResults(results);
    setAiMessage(message);
  };

  const clearAiResults = () => {
    setAiResults(null);
    setAiMessage("");
  };

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{
        position: "relative",
        minHeight: "92vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "var(--color-background)",
      }}>
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `radial-gradient(ellipse at 30% 30%, rgba(124,92,252,0.15) 0%, transparent 60%), 
                            radial-gradient(ellipse at 70% 70%, rgba(0,229,160,0.08) 0%, transparent 60%)`,
        }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, opacity: 0.03,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px),
                            repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px)`,
        }} />

        <div className="container-xl" style={{ position: "relative", zIndex: 1, paddingTop: "60px", paddingBottom: "80px", width: "100%" }}>
          {/* Pills */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "32px", animation: "fadeUp 0.5s ease forwards" }}>
            <span className="badge badge-accent">🤖 AI-Powered Search</span>
            <span className="badge badge-primary">✅ Verified Landlords</span>
            <span className="badge badge-amber">📱 WhatsApp Integration</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)", fontWeight: 900, maxWidth: "800px", marginBottom: "24px", lineHeight: 1.05, animation: "fadeUp 0.6s 0.1s ease both" }}>
            Find Your Perfect{" "}
            <span className="gradient-text">Student Home</span>
            {" "}in Malawi
          </h1>

          <p style={{ fontSize: "1.15rem", color: "var(--color-foreground-muted)", maxWidth: "560px", marginBottom: "48px", lineHeight: 1.7, animation: "fadeUp 0.6s 0.2s ease both" }}>
            LUNDAI uses AI to match you with verified, affordable rooms near your university. No more unsafe listings — just results that fit your real needs.
          </p>

          {/* AI Search */}
          <div style={{ maxWidth: "720px", marginBottom: "28px", animation: "fadeUp 0.6s 0.3s ease both" }}>
            <AiSearchBar onResults={handleAiResults} large />
          </div>

          {/* Quick filters */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", animation: "fadeUp 0.6s 0.4s ease both" }}>
            <span style={{ color: "var(--color-foreground-muted)", fontSize: "0.85rem", alignSelf: "center", marginRight: "4px" }}>Quick:</span>
            {["Studio in Zomba", "Furnished room Lilongwe", "Near Polytechnic"].map((q) => (
              <Link key={q} to={`/search?search=${encodeURIComponent(q)}`}
                className="btn btn-outline"
                style={{ fontSize: "0.82rem", padding: "7px 16px" }}
              >{q}</Link>
            ))}
          </div>
        </div>

        {/* Floating stat cards */}
        <div style={{
          position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px",
          animation: "fadeIn 1s 0.5s ease both",
        }} className="hero-stats">
          {STATS.map((s) => (
            <div key={s.label} className="glass" style={{ padding: "20px", borderRadius: "var(--radius-lg)", textAlign: "center", minWidth: "130px" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "6px" }}>{s.icon}</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--color-primary-light)" }}>{s.value}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-foreground-muted)", marginTop: "2px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <style>{`
          @media (max-width: 1024px) { .hero-stats { display: none !important; } }
        `}</style>
      </section>

      {/* ── AI Results ────────────────────────────────────── */}
      {aiResults && (
        <section className="section-gap" style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
          <div className="container-xl">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div className="badge badge-accent" style={{ marginBottom: "8px" }}>🤖 AI Results</div>
                <h2 style={{ fontSize: "1.6rem" }}>{aiMessage || "Here's what I found for you"}</h2>
                <p style={{ color: "var(--color-foreground-muted)", fontSize: "0.9rem", marginTop: "4px" }}>{aiResults.length} properties matched</p>
              </div>
              <button onClick={clearAiResults} className="btn btn-outline">✕ Clear AI Results</button>
            </div>

            {aiResults.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "var(--color-foreground-muted)" }}>
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔍</div>
                <p style={{ fontSize: "1.1rem" }}>No properties matched your query. Try a different description.</p>
              </div>
            ) : (
              <div className="property-grid">
                {aiResults.map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Featured Listings ─────────────────────────────── */}
      {!aiResults && (
        <section className="section-gap">
          <div className="container-xl">
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <div className="badge badge-primary" style={{ marginBottom: "10px" }}>🏠 Browse Listings</div>
                <h2 style={{ fontSize: "2rem" }}>Featured Student Housing</h2>
                <p style={{ color: "var(--color-foreground-muted)", marginTop: "6px" }}>Hand-picked, verified properties across Malawi</p>
              </div>
              <Link to="/search" className="btn btn-outline">View All →</Link>
            </div>

            {/* City tab filters */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
              {CITIES.map((city) => (
                <button key={city} onClick={() => setSelectedCity(city)}
                  className={`btn ${selectedCity === city ? "btn-primary" : "btn-outline"}`}
                  style={{ fontSize: "0.85rem", padding: "8px 18px" }}
                >{city}</button>
              ))}
            </div>

            {isLoading ? (
              <div className="property-grid">
                {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
              </div>
            ) : displayedProperties.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "var(--color-foreground-muted)" }}>
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏙️</div>
                <p style={{ fontSize: "1rem" }}>No listings found for {selectedCity}. Check back soon!</p>
              </div>
            ) : (
              <div className="property-grid">
                {displayedProperties.map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="section-gap" style={{ background: "var(--color-surface)" }}>
        <div className="container-xl">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div className="badge badge-primary" style={{ marginBottom: "12px" }}>💡 How It Works</div>
            <h2 style={{ fontSize: "2.2rem" }}>Find a Room in 3 Minutes</h2>
            <p style={{ color: "var(--color-foreground-muted)", marginTop: "10px", maxWidth: "500px", margin: "10px auto 0" }}>
              LUNDAI's AI does all the hard work so you can focus on your studies.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
            {[
              { step: "1", icon: "🧠", title: "Describe What You Need", desc: "Tell our AI what you're looking for in plain language. Budget, location, university — just chat naturally." },
              { step: "2", icon: "🔍", title: "AI Matches Listings", desc: "Gemini AI parses your request and instantly surfaces the most relevant verified listings." },
              { step: "3", icon: "📸", title: "View & Compare", desc: "Browse photos, amenities, AI summaries, and landlord details. Shortlist your favourites." },
              { step: "4", icon: "🤝", title: "Book & Move In", desc: "Contact the landlord directly or pay a deposit securely via PayChangu. Then move in!" },
            ].map((item) => (
              <div key={item.step} className="card" style={{ padding: "28px", textAlign: "center" }}>
                <div style={{
                  width: 52, height: 52,
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.3rem", margin: "0 auto 16px",
                  boxShadow: "var(--shadow-glow-primary)",
                }}>{item.icon}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--color-primary-light)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Step {item.step}</div>
                <h3 style={{ fontSize: "1.05rem", marginBottom: "10px" }}>{item.title}</h3>
                <p style={{ color: "var(--color-foreground-muted)", fontSize: "0.875rem", lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA for Landlords ─────────────────────────────── */}
      <section className="section-gap">
        <div className="container-xl">
          <div style={{
            background: "linear-gradient(135deg, rgba(124,92,252,0.15) 0%, rgba(0,229,160,0.08) 100%)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            padding: "60px 48px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", background: "var(--color-primary-glow)", borderRadius: "50%", filter: "blur(60px)" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📱</div>
              <h2 style={{ fontSize: "2rem", marginBottom: "12px" }}>Are You a Landlord?</h2>
              <p style={{ color: "var(--color-foreground-muted)", maxWidth: "500px", margin: "0 auto 32px", fontSize: "1rem", lineHeight: 1.7 }}>
                List your property on LUNDAI via WhatsApp — just send a message and our AI does the rest. Reach thousands of verified students instantly.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link to="/add-listing" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
                  Add Listing Online
                </Link>
                <a href="https://wa.me/14155238886?text=LIST" className="btn btn-accent" style={{ padding: "14px 32px", fontSize: "1rem" }}>
                  📱 List via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
