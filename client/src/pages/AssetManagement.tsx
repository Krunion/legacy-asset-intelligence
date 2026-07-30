import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { COLORS } from "@shared/colors";
import { useParams, useLocation } from "wouter";
import AssetList from "@/components/assets/AssetList";
import AssetDetail from "@/components/assets/AssetDetail";
import AssetForm from "@/components/assets/AssetForm";
import AssetScanner from "@/components/assets/AssetScanner";
import AssetImport from "@/components/assets/AssetImport";
import AssetDashboard from "@/components/assets/AssetDashboard";
import LabelPrinter from "@/components/assets/LabelPrinter";
import AssetExport from "@/components/assets/AssetExport";

const C = COLORS;

type View = "dashboard" | "list" | "detail" | "add" | "edit" | "scan" | "import" | "export" | "labels";

function PrintLabelsView({ projectId, onPrint }: { projectId: number; onPrint: (assets: any[]) => void }) {
  const { data, isLoading } = trpc.assets.list.useQuery({ projectId, page: 1, pageSize: 100 });
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (!data?.items) return;
    if (selected.size === data.items.length) setSelected(new Set());
    else setSelected(new Set(data.items.map((a) => a.id)));
  };

  const handlePrint = () => {
    if (!data?.items) return;
    const assets = data.items.filter((a) => selected.has(a.id));
    if (assets.length > 0) onPrint(assets);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.text }}>Print Labels</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={selectAll} style={{ padding: "0.5rem 1rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.silver, cursor: "pointer", fontSize: "0.85rem" }}>
            {selected.size === (data?.items?.length || 0) ? "Deselect All" : "Select All"}
          </button>
          <button
            onClick={handlePrint}
            disabled={selected.size === 0}
            style={{ padding: "0.5rem 1rem", background: selected.size > 0 ? C.gold : "rgba(100,116,139,0.2)", border: "none", borderRadius: 6, color: selected.size > 0 ? C.charcoal : C.textMuted, cursor: selected.size > 0 ? "pointer" : "not-allowed", fontWeight: 600, fontSize: "0.85rem" }}
          >
            Print {selected.size} Label{selected.size !== 1 ? "s" : ""}
          </button>
        </div>
      </div>

      {isLoading ? (
        <p style={{ color: C.textMuted }}>Loading assets...</p>
      ) : !data?.items?.length ? (
        <p style={{ color: C.textMuted }}>No assets to print labels for. Add assets first.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.75rem" }}>
          {data.items.map((asset) => (
            <div
              key={asset.id}
              onClick={() => toggleSelect(asset.id)}
              style={{
                padding: "0.75rem",
                background: selected.has(asset.id) ? `${C.gold}15` : C.navy,
                border: `1px solid ${selected.has(asset.id) ? C.gold : C.border}`,
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input type="checkbox" checked={selected.has(asset.id)} readOnly style={{ accentColor: C.gold }} />
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: C.gold }}>{asset.assetTag}</div>
                  <div style={{ fontSize: "0.85rem", color: C.text }}>{asset.name}</div>
                  {asset.serialNumber && <div style={{ fontSize: "0.75rem", color: C.textMuted }}>SN: {asset.serialNumber}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AssetManagement() {
  const { user, loading, isAuthenticated } = useAuth();
  const params = useParams<{ projectId: string }>();
  const [, navigate] = useLocation();
  const projectId = parseInt(params.projectId || "0", 10);

  const [view, setView] = useState<View>("dashboard");
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLabels, setShowLabels] = useState(false);
  const [labelAssets, setLabelAssets] = useState<any[]>([]);

  // Fetch project info
  const projectQuery = trpc.assets.getProject.useQuery({ id: projectId }, { enabled: projectId > 0 });

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.charcoal, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="animate-spin" style={{ width: 40, height: 40, border: `3px solid ${C.border}`, borderTopColor: C.gold, borderRadius: "50%", margin: "0 auto 1rem" }} />
          <p style={{ color: C.textMuted, fontFamily: "'Source Sans 3', sans-serif" }}>Loading Asset Management...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", background: C.charcoal, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div style={{ maxWidth: 400, background: C.slate, borderRadius: 12, border: `1px solid ${C.border}`, padding: "2rem", textAlign: "center" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: C.text, marginBottom: "0.5rem" }}>
            Asset Management
          </h1>
          <p style={{ color: C.textMuted, marginBottom: "1.5rem" }}>Sign in to access the LAI Asset Management System</p>
          <a
            href={getLoginUrl()}
            style={{ display: "inline-block", padding: "0.75rem 2rem", background: C.gold, color: C.charcoal, borderRadius: 8, fontWeight: 600, textDecoration: "none" }}
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (!projectId || projectId <= 0) {
    navigate("/assets");
    return null;
  }

  const handleViewAsset = (id: number) => {
    setSelectedAssetId(id);
    setView("detail");
  };

  const handleEditAsset = (id: number) => {
    setSelectedAssetId(id);
    setView("edit");
  };

  const handleBack = () => {
    setView("list");
    setSelectedAssetId(null);
  };

  const projectName = projectQuery.data?.name || "Project";

  return (
    <div style={{ minHeight: "100vh", background: C.charcoal }}>
      {/* Top Navigation Bar */}
      <header style={{ background: C.navy, borderBottom: `1px solid ${C.border}`, padding: "0.75rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => navigate("/assets")}
            style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", padding: "0.25rem", display: "flex", alignItems: "center" }}
            title="Back to Projects"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: C.text, margin: 0 }}>
              <span style={{ color: C.gold }}>{projectName}</span>
            </h1>
            <p style={{ fontSize: "0.75rem", color: C.textMuted, margin: 0 }}>Asset Management</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: C.textMuted, fontSize: "0.85rem" }}>{user?.name || user?.email}</span>
        </div>
      </header>

      {/* Secondary Nav */}
      <nav style={{ background: C.navy, borderBottom: `1px solid ${C.border}`, padding: "0 1.5rem", display: "flex", gap: "0.25rem", overflowX: "auto" }}>
        {[
          { key: "dashboard", label: "Dashboard", icon: "◆" },
          { key: "list", label: "Assets", icon: "▦" },
          { key: "scan", label: "Scan", icon: "⊞" },
          { key: "add", label: "Add Asset", icon: "+" },
          { key: "import", label: "Import", icon: "↑" },
          { key: "export", label: "Export", icon: "↓" },
          { key: "labels", label: "Print Labels", icon: "🏷" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key as View)}
            style={{
              padding: "0.75rem 1rem",
              background: view === tab.key ? `${C.gold}15` : "transparent",
              border: "none",
              borderBottom: view === tab.key ? `2px solid ${C.gold}` : "2px solid transparent",
              color: view === tab.key ? C.gold : C.textMuted,
              cursor: "pointer",
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.9rem",
              fontWeight: view === tab.key ? 600 : 400,
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
          >
            <span style={{ marginRight: "0.4rem" }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main style={{ padding: "1.5rem", maxWidth: 1400, margin: "0 auto" }}>
        {view === "dashboard" && <AssetDashboard projectId={projectId} onNavigate={(v: string) => setView(v as View)} />}
        {view === "list" && (
          <AssetList
            projectId={projectId}
            onView={handleViewAsset}
            onEdit={handleEditAsset}
            onAdd={() => setView("add")}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}
        {view === "detail" && selectedAssetId && (
          <AssetDetail
            assetId={selectedAssetId}
            onBack={handleBack}
            onEdit={() => handleEditAsset(selectedAssetId)}
          />
        )}
        {view === "add" && <AssetForm projectId={projectId} onSuccess={handleBack} onCancel={handleBack} />}
        {view === "edit" && selectedAssetId && (
          <AssetForm projectId={projectId} assetId={selectedAssetId} onSuccess={handleBack} onCancel={handleBack} />
        )}
        {view === "scan" && <AssetScanner projectId={projectId} onAssetFound={handleViewAsset} onAssetCreated={handleViewAsset} />}
        {view === "import" && <AssetImport projectId={projectId} onComplete={() => setView("list")} />}
        {view === "export" && <AssetExport projectId={projectId} onClose={() => setView("list")} />}
        {view === "labels" && <PrintLabelsView projectId={projectId} onPrint={(assets) => { setLabelAssets(assets); setShowLabels(true); }} />}
      </main>

      {/* Modals */}
      {showLabels && labelAssets.length > 0 && (
        <LabelPrinter assets={labelAssets} onClose={() => { setShowLabels(false); setLabelAssets([]); }} />
      )}
    </div>
  );
}
