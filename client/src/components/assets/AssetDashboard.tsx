import { trpc } from "@/lib/trpc";
import { COLORS } from "@shared/colors";

const C = COLORS;

interface Props {
  projectId: number;
  onNavigate: (view: string) => void;
}

export default function AssetDashboard({ projectId, onNavigate }: Props) {
  const { data: stats, isLoading } = trpc.assets.stats.useQuery({ projectId });

  const statCards = [
    { label: "Total Assets", value: stats?.totalAssets ?? 0, icon: "▦", color: C.gold },
    { label: "Active Assets", value: stats?.activeAssets ?? 0, icon: "✓", color: "#10B981" },
    { label: "Categories", value: stats?.categories ?? 0, icon: "◈", color: C.teal },
    { label: "Total Value", value: `$${(stats?.totalValue ?? 0).toLocaleString()}`, icon: "$", color: C.goldLight },
  ];

  const quickActions = [
    { label: "Add New Asset", icon: "+", action: () => onNavigate("add"), desc: "Register a new asset" },
    { label: "Scan Barcode", icon: "⊞", action: () => onNavigate("scan"), desc: "Scan to find or add" },
    { label: "Import CSV", icon: "↑", action: () => onNavigate("import"), desc: "Bulk import assets" },
    { label: "View All Assets", icon: "▦", action: () => onNavigate("list"), desc: "Browse asset register" },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.text, marginBottom: "1.5rem" }}>
        Asset Management Dashboard
      </h2>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {statCards.map((card) => (
          <div key={card.label} style={{ background: C.slate, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1.25rem", transition: "border-color 0.15s" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ color: C.textMuted, fontSize: "0.85rem", fontFamily: "'Source Sans 3', sans-serif" }}>{card.label}</span>
              <span style={{ color: card.color, fontSize: "1.2rem" }}>{card.icon}</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.6rem", fontWeight: 700, color: card.color }}>
              {isLoading ? "—" : card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h3 style={{ color: C.silver, fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", fontFamily: "'Source Sans 3', sans-serif" }}>Quick Actions</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={action.action}
            style={{
              background: C.navy,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "1.25rem",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "0.5rem", color: C.gold }}>{action.icon}</span>
            <span style={{ display: "block", color: C.text, fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.25rem" }}>{action.label}</span>
            <span style={{ display: "block", color: C.textMuted, fontSize: "0.8rem" }}>{action.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
