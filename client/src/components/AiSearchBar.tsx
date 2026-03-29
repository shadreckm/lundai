import { useState, useRef } from "react";
import { useAiSearch } from "../hooks/useListings.ts";

interface AiSearchBarProps {
  onResults?: (results: any[], message: string) => void;
  placeholder?: string;
  large?: boolean;
}

const SUGGESTIONS = [
  "Furnished room near Chancellor College under 20,000 MWK",
  "2-bedroom apartment in Lilongwe with WiFi and generator",
  "Cheap hostel near Polytechnic in Blantyre",
  "Self-contained studio near LUANAR",
  "Budget room in Mzuzu near the university",
];

export default function AiSearchBar({ onResults, placeholder, large }: AiSearchBarProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: search, isPending } = useAiSearch();

  const handleSearch = (q = query) => {
    if (!q.trim() || q.trim().length < 3) return;
    setShowSuggestions(false);
    search(q.trim(), {
      onSuccess: (data) => {
        onResults?.(data.results, data.aiMessage);
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Search input */}
      <div style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        background: "var(--color-surface-2)",
        border: "1.5px solid " + (isPending ? "var(--color-primary)" : "rgba(255,255,255,0.1)"),
        borderRadius: "var(--radius-full)",
        boxShadow: isPending ? "0 0 0 4px var(--color-primary-glow)" : "var(--shadow-card)",
        transition: "border-color 0.2s, box-shadow 0.2s",
        overflow: "hidden",
      }}>
        {/* AI Icon */}
        <div style={{ paddingLeft: large ? "24px" : "18px", paddingRight: "12px", display: "flex", alignItems: "center" }}>
          {isPending ? (
            <div style={{ width: 20, height: 20, border: "2px solid var(--color-primary)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          ) : (
            <span style={{ fontSize: large ? "1.3rem" : "1rem" }}>🤖</span>
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(e.target.value.length === 0); }}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length === 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={placeholder || "Describe your ideal student home… (AI-powered 🧠)"}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: "var(--color-foreground)", fontSize: large ? "1.05rem" : "0.95rem",
            padding: large ? "20px 0" : "14px 0",
            fontFamily: "var(--font-sans)",
          }}
        />

        <button
          onClick={() => handleSearch()}
          disabled={isPending || !query.trim()}
          className="btn btn-primary"
          style={{
            margin: "6px", borderRadius: "var(--radius-full)",
            padding: large ? "12px 28px" : "9px 20px",
            fontSize: "0.9rem", opacity: isPending || !query.trim() ? 0.6 : 1,
          }}
        >
          {isPending ? "Searching…" : "Search"}
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-elevated)",
          zIndex: 50, overflow: "hidden",
        }}>
          <div style={{ padding: "10px 16px 6px", fontSize: "0.75rem", color: "var(--color-foreground-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Try asking…
          </div>
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => { setQuery(s); handleSearch(s); }}
              style={{
                width: "100%", textAlign: "left", background: "none", border: "none",
                padding: "10px 16px", color: "var(--color-foreground)", fontSize: "0.88rem",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "10px",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,92,252,0.1)")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >
              <span style={{ color: "var(--color-primary-light)", fontSize: "0.85rem" }}>⚡</span>
              {s}
            </button>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
