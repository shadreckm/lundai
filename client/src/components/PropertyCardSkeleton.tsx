export default function PropertyCardSkeleton() {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div className="skeleton" style={{ height: "200px", borderRadius: "0" }} />
      <div style={{ padding: "16px" }}>
        <div className="skeleton" style={{ height: "20px", width: "75%", marginBottom: "8px" }} />
        <div className="skeleton" style={{ height: "14px", width: "50%", marginBottom: "12px" }} />
        <div className="skeleton" style={{ height: "12px", width: "90%", marginBottom: "4px" }} />
        <div className="skeleton" style={{ height: "12px", width: "70%", marginBottom: "14px" }} />
        <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
          <div className="skeleton" style={{ height: "22px", width: "60px", borderRadius: "99px" }} />
          <div className="skeleton" style={{ height: "22px", width: "50px", borderRadius: "99px" }} />
          <div className="skeleton" style={{ height: "22px", width: "55px", borderRadius: "99px" }} />
        </div>
        <div className="divider" style={{ marginBottom: "12px" }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="skeleton" style={{ height: "24px", width: "120px" }} />
          <div className="skeleton" style={{ height: "20px", width: "60px" }} />
        </div>
      </div>
    </div>
  );
}
