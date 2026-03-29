import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard.tsx";
import PropertyCardSkeleton from "../components/PropertyCardSkeleton.tsx";
import AiSearchBar from "../components/AiSearchBar.tsx";
import { useListings } from "../hooks/useListings.ts";
import type { Property, ListingFilters } from "../services/api.ts";

const PROPERTY_TYPES = ["room", "apartment", "studio", "hostel", "shared"];
const CITIES = ["Lilongwe", "Blantyre", "Zomba", "Mzuzu"];
const AMENITIES_LIST = ["WiFi", "Generator", "Security", "Furnished", "Parking", "Water", "DSTV"];

export default function PropertySearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<ListingFilters>({
    city: searchParams.get("city") || undefined,
    type: searchParams.get("type") || undefined,
    search: searchParams.get("search") || undefined,
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    isFurnished: undefined,
  });
  const [aiResults, setAiResults] = useState<Property[] | null>(null);
  const [aiMessage, setAiMessage] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isError } = useListings(filters);

  const displayedProperties = aiResults ?? data?.data ?? [];
  const total = aiResults ? aiResults.length : data?.total ?? 0;

  const updateFilter = (key: keyof ListingFilters, value: any) => {
    setAiResults(null);
    setFilters((prev) => ({ ...prev, [key]: value || undefined, page: 1 }));
  };

  const clearAll = () => {
    setFilters({});
    setAiResults(null);
    setSearchParams({});
  };

  return (
    <div style={{ background: "var(--color-background)", minHeight: "100vh" }}>
      {/* ── Search Header ─────────────────────────────────── */}
      <div style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", padding: "28px 0" }}>
        <div className="container-xl">
          <h1 style={{ fontSize: "1.6rem", marginBottom: "16px" }}>Find Student Housing</h1>
          <AiSearchBar
            onResults={(results, msg) => { setAiResults(results); setAiMessage(msg); }}
            placeholder="Ask AI: e.g. 'Cheap furnished room near Polytechnic under 20k MWK'"
          />
        </div>
      </div>

      <div className="container-xl" style={{ paddingTop: "28px", paddingBottom: "60px" }}>
        <div style={{ display: "flex", gap: "28px", alignItems: "flex-start" }}>
          {/* ── Sidebar Filters ── */}
          <aside style={{
            width: "260px", flexShrink: 0,
            position: "sticky", top: "88px",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
          }} className="filter-sidebar">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Filters</h3>
              <button onClick={clearAll} className="btn btn-ghost" style={{ fontSize: "0.8rem", padding: "4px 10px" }}>Clear All</button>
            </div>

            {/* City */}
            <div style={{ marginBottom: "20px" }}>
              <label className="label">City</label>
              <select
                value={filters.city || ""}
                onChange={(e) => updateFilter("city", e.target.value)}
                className="input"
                style={{ padding: "10px 12px" }}
              >
                <option value="">All Cities</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Type */}
            <div style={{ marginBottom: "20px" }}>
              <label className="label">Property Type</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {PROPERTY_TYPES.map(t => (
                  <button key={t} onClick={() => updateFilter("type", filters.type === t ? "" : t)}
                    className={`btn ${filters.type === t ? "btn-primary" : "btn-outline"}`}
                    style={{ justifyContent: "flex-start", fontSize: "0.85rem", padding: "8px 14px", textTransform: "capitalize" }}
                  >{t}</button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: "20px" }}>
              <label className="label">Price Range (MWK/month)</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input type="number" placeholder="Min" className="input" style={{ padding: "9px 10px" }}
                  value={filters.minPrice || ""}
                  onChange={e => updateFilter("minPrice", e.target.value ? parseInt(e.target.value) : undefined)}
                />
                <span style={{ color: "var(--color-foreground-muted)" }}>–</span>
                <input type="number" placeholder="Max" className="input" style={{ padding: "9px 10px" }}
                  value={filters.maxPrice || ""}
                  onChange={e => updateFilter("maxPrice", e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div style={{ marginBottom: "20px" }}>
              <label className="label">Min Bedrooms</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {[1, 2, 3, 4].map(n => (
                  <button key={n} onClick={() => updateFilter("bedrooms", filters.bedrooms === n ? undefined : n)}
                    className={`btn ${filters.bedrooms === n ? "btn-primary" : "btn-outline"}`}
                    style={{ padding: "8px 14px", fontSize: "0.85rem", flex: 1 }}
                  >{n}+</button>
                ))}
              </div>
            </div>

            {/* Furnished */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input type="checkbox" checked={filters.isFurnished === true}
                  onChange={e => updateFilter("isFurnished", e.target.checked ? true : undefined)}
                  style={{ width: "16px", height: "16px", accentColor: "var(--color-primary)" }}
                />
                <span style={{ fontSize: "0.9rem" }}>Furnished Only</span>
              </label>
            </div>
          </aside>

          {/* ── Results ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Results header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                {aiResults ? (
                  <p style={{ color: "var(--color-foreground-muted)", fontSize: "0.9rem" }}>
                    🤖 <strong style={{ color: "var(--color-accent)" }}>{aiMessage}</strong>
                  </p>
                ) : (
                  <p style={{ color: "var(--color-foreground-muted)", fontSize: "0.9rem" }}>
                    {isLoading ? "Searching…" : `${total} properties found`}
                  </p>
                )}
              </div>
              {aiResults && (
                <button onClick={() => { setAiResults(null); setAiMessage(""); }} className="btn btn-outline" style={{ fontSize: "0.82rem", padding: "7px 14px" }}>
                  ✕ Clear AI results
                </button>
              )}
            </div>

            {/* Grid */}
            {isLoading && !aiResults ? (
              <div className="property-grid">
                {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
              </div>
            ) : isError ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "var(--color-foreground-muted)" }}>
                <div style={{ fontSize: "3rem", marginBottom: "12px" }}>⚠️</div>
                <p>Failed to load listings. Please try again.</p>
              </div>
            ) : displayedProperties.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "var(--color-foreground-muted)" }}>
                <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🔍</div>
                <h3 style={{ marginBottom: "10px" }}>No properties found</h3>
                <p style={{ maxWidth: "320px", margin: "0 auto" }}>Try adjusting your filters or ask the AI with a different description.</p>
                <button onClick={clearAll} className="btn btn-primary" style={{ marginTop: "24px" }}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="property-grid">
                  {displayedProperties.map((p) => <PropertyCard key={p.id} property={p} />)}
                </div>

                {/* Pagination */}
                {data && data.totalPages > 1 && !aiResults && (
                  <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "40px" }}>
                    {Array.from({ length: data.totalPages }).map((_, i) => (
                      <button key={i} onClick={() => updateFilter("page", i + 1)}
                        className={`btn ${(filters.page || 1) === i + 1 ? "btn-primary" : "btn-outline"}`}
                        style={{ width: "40px", height: "40px", padding: 0 }}
                      >{i + 1}</button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .filter-sidebar { display: none; }
        }
      `}</style>
    </div>
  );
}
