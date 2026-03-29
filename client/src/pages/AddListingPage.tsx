import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateListing } from "../hooks/useListings.ts";

const PROPERTY_TYPES = ["room", "apartment", "studio", "hostel", "shared"];
const CITIES = ["Lilongwe", "Blantyre", "Zomba", "Mzuzu"];
const AMENITIES_OPTIONS = ["WiFi", "Generator", "Security", "Furnished", "Parking", "Water", "DSTV", "Borehole", "Study Room", "AC"];
const UNIVERSITIES = ["Chancellor College", "Malawi Polytechnic", "MUST", "LUANAR", "Mzuzu University", "KCN", "Lilongwe University"];

export default function AddListingPage() {
  const navigate = useNavigate();
  const { mutate: createListing, isPending } = useCreateListing();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", type: "room", price: "", currency: "MWK",
    address: "", city: "", country: "Malawi",
    bedrooms: 1, bathrooms: 1, isFurnished: false,
    amenities: [] as string[],
    nearbyUniversities: [] as string[],
    landlordName: "", landlordEmail: "", landlordPhone: "",
  });

  const set = (key: string, val: any) => setForm(p => ({ ...p, [key]: val }));

  const toggleAmenity = (a: string) => {
    set("amenities", form.amenities.includes(a) ? form.amenities.filter(x => x !== a) : [...form.amenities, a]);
  };
  const toggleUniversity = (u: string) => {
    set("nearbyUniversities", form.nearbyUniversities.includes(u) ? form.nearbyUniversities.filter(x => x !== u) : [...form.nearbyUniversities, u]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createListing({
      ...form,
      price: form.price,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
    } as any, {
      onSuccess: () => setSuccess(true),
      onError: () => alert("Failed to create listing. Please try again."),
    });
  };

  if (success) return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px", textAlign: "center", padding: "40px" }}>
      <div style={{ fontSize: "5rem", animation: "fadeUp 0.5s ease" }}>🎉</div>
      <h1 style={{ fontSize: "2rem" }}>Listing Submitted!</h1>
      <p style={{ color: "var(--color-foreground-muted)", maxWidth: "420px", lineHeight: 1.7 }}>
        Your property has been submitted for review. Our team will verify it within 24 hours. Students will be able to find it once approved.
      </p>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={() => { setSuccess(false); setStep(1); setForm(p => ({ ...p, title: "", description: "", price: "" })); }}
          className="btn btn-outline">Add Another Listing</button>
        <button onClick={() => navigate("/")} className="btn btn-primary">Go Home</button>
      </div>
    </div>
  );

  return (
    <div style={{ background: "var(--color-background)", minHeight: "100vh", paddingBottom: "60px" }}>
      {/* Header */}
      <div style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", padding: "32px 0" }}>
        <div className="container-xl">
          <div className="badge badge-primary" style={{ marginBottom: "10px" }}>🏠 For Landlords</div>
          <h1 style={{ fontSize: "2rem", marginBottom: "8px" }}>List Your Property</h1>
          <p style={{ color: "var(--color-foreground-muted)" }}>Reach thousands of verified students searching near their university</p>

          {/* Steps */}
          <div style={{ display: "flex", gap: "0", marginTop: "24px", maxWidth: "500px" }}>
            {["Property Details", "Amenities", "Contact Info"].map((label, i) => (
              <div key={i} style={{ flex: 1, display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: 1 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    background: step > i + 1 ? "var(--color-accent)" : step === i + 1 ? "var(--color-primary)" : "var(--color-surface-3)",
                    fontSize: "0.75rem", fontWeight: 700, color: step > i + 1 ? "#000" : "#fff",
                  }}>{step > i + 1 ? "✓" : i + 1}</div>
                  <span style={{ fontSize: "0.72rem", color: step === i + 1 ? "var(--color-foreground)" : "var(--color-foreground-muted)", textAlign: "center" }}>{label}</span>
                </div>
                {i < 2 && <div style={{ height: "1px", flex: 0.5, background: step > i + 1 ? "var(--color-accent)" : "var(--color-border)", marginBottom: "16px" }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-xl" style={{ paddingTop: "40px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ maxWidth: "680px" }}>
            {/* Step 1 */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", animation: "fadeUp 0.4s ease" }}>
                <div>
                  <label className="label">Listing Title *</label>
                  <input className="input" required placeholder="e.g. Modern Studio near Chancellor College"
                    value={form.title} onChange={e => set("title", e.target.value)} />
                </div>
                <div>
                  <label className="label">Description *</label>
                  <textarea className="input" required rows={4} placeholder="Describe the property in detail — location, features, what's nearby…"
                    value={form.description} onChange={e => set("description", e.target.value)} style={{ resize: "vertical" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label className="label">Property Type *</label>
                    <select className="input" value={form.type} onChange={e => set("type", e.target.value)} style={{ padding: "10px 12px" }}>
                      {PROPERTY_TYPES.map(t => <option key={t} value={t} style={{ textTransform: "capitalize" }}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">City *</label>
                    <select className="input" value={form.city} onChange={e => set("city", e.target.value)} required style={{ padding: "10px 12px" }}>
                      <option value="">Select City</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Monthly Rent (MWK) *</label>
                    <input type="number" className="input" required placeholder="e.g. 25000" min="1000"
                      value={form.price} onChange={e => set("price", e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Address *</label>
                    <input className="input" required placeholder="Street, Area, Township"
                      value={form.address} onChange={e => set("address", e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Bedrooms</label>
                    <select className="input" value={form.bedrooms} onChange={e => set("bedrooms", parseInt(e.target.value))} style={{ padding: "10px 12px" }}>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Bathrooms</label>
                    <select className="input" value={form.bathrooms} onChange={e => set("bathrooms", parseInt(e.target.value))} style={{ padding: "10px 12px" }}>
                      {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <input type="checkbox" checked={form.isFurnished} onChange={e => set("isFurnished", e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "var(--color-primary)" }} />
                  <span>This property is furnished</span>
                </label>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => { if (!form.title || !form.city || !form.price) { alert("Please fill required fields"); return; } setStep(2); }}
                    className="btn btn-primary" style={{ padding: "12px 32px" }}>Next: Amenities →</button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div style={{ animation: "fadeUp 0.4s ease" }}>
                <div style={{ marginBottom: "28px" }}>
                  <label className="label" style={{ marginBottom: "12px" }}>Amenities Available</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {AMENITIES_OPTIONS.map(a => (
                      <button key={a} type="button" onClick={() => toggleAmenity(a)}
                        className={`btn ${form.amenities.includes(a) ? "btn-primary" : "btn-outline"}`}
                        style={{ fontSize: "0.85rem", padding: "9px 18px" }}>{a}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: "28px" }}>
                  <label className="label" style={{ marginBottom: "12px" }}>Nearby Universities</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {UNIVERSITIES.map(u => (
                      <label key={u} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                        <input type="checkbox" checked={form.nearbyUniversities.includes(u)} onChange={() => toggleUniversity(u)}
                          style={{ width: "15px", height: "15px", accentColor: "var(--color-primary)" }} />
                        <span style={{ fontSize: "0.9rem" }}>🎓 {u}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
                  <button type="button" onClick={() => setStep(1)} className="btn btn-outline">← Back</button>
                  <button type="button" onClick={() => setStep(3)} className="btn btn-primary" style={{ padding: "12px 32px" }}>Next: Contact Info →</button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div style={{ animation: "fadeUp 0.4s ease" }}>
                <div style={{ marginBottom: "24px", background: "rgba(0,229,160,0.06)", border: "1px solid rgba(0,229,160,0.2)", borderRadius: "var(--radius-md)", padding: "16px" }}>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-foreground-muted)", lineHeight: 1.7 }}>
                    ℹ️ Your contact details are private and only shared with interested students via our platform. Students won't see your email directly.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div>
                    <label className="label">Your Full Name *</label>
                    <input className="input" required placeholder="Your name" value={form.landlordName} onChange={e => set("landlordName", e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Email Address *</label>
                    <input type="email" className="input" required placeholder="your@email.com" value={form.landlordEmail} onChange={e => set("landlordEmail", e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Phone / WhatsApp *</label>
                    <input type="tel" className="input" required placeholder="+265 xxx xxxxxx" value={form.landlordPhone} onChange={e => set("landlordPhone", e.target.value)} />
                  </div>

                  {/* Summary */}
                  <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "16px" }}>
                    <h3 style={{ fontSize: "0.9rem", marginBottom: "12px", color: "var(--color-foreground-muted)" }}>Listing Summary</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.88rem" }}>
                      <div>🏠 <strong>{form.title}</strong></div>
                      <div>📍 {form.address}, {form.city}</div>
                      <div>💰 {parseInt(form.price || "0").toLocaleString()} MWK/month</div>
                      <div>🛏 {form.bedrooms} bed · 🛁 {form.bathrooms} bath · {form.isFurnished ? "🪑 Furnished" : "Unfurnished"}</div>
                      {form.amenities.length > 0 && <div>✨ {form.amenities.join(", ")}</div>}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "space-between", marginTop: "24px" }}>
                  <button type="button" onClick={() => setStep(2)} className="btn btn-outline">← Back</button>
                  <button type="submit" disabled={isPending} className="btn btn-accent" style={{ padding: "13px 36px", fontSize: "1rem" }}>
                    {isPending ? "Submitting…" : "🚀 Submit Listing"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
