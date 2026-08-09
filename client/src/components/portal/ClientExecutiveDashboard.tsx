import { useState } from "react";
import { COLORS } from "@shared/colors";

const C = COLORS;

type Section = "overview" | "progress" | "assets" | "recovery" | "risks" | "locations" | "actions" | "reports" | "meetings" | "billing";

const NAV_ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: "overview", label: "Dashboard", icon: "📊" },
  { id: "progress", label: "Project Progress", icon: "📈" },
  { id: "assets", label: "Assets", icon: "🏷️" },
  { id: "recovery", label: "Recovery", icon: "💰" },
  { id: "risks", label: "Risks & Exceptions", icon: "⚠️" },
  { id: "locations", label: "Locations", icon: "📍" },
  { id: "actions", label: "Tasks & Approvals", icon: "✅" },
  { id: "reports", label: "Reports & Documents", icon: "📄" },
  { id: "meetings", label: "Meetings & Messages", icon: "📅" },
  { id: "billing", label: "Billing", icon: "💳" },
];

interface DashboardProps {
  data: any;
  accessToken: string;
  clientName: string;
  dashboardTitle: string | null;
  onChangePassword: () => void;
  onLogout: () => void;
  onRespondToAction?: (actionId: number, response: string, status: string) => void;
}

const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663776896878/TfZTrDNPnnG2dF7hgZeTPt/lai-logo-5QXNLUsEDRp3nBVBAMiXK4.webp";

export default function ClientExecutiveDashboard({ data, accessToken, clientName, dashboardTitle, onChangePassword, onLogout, onRespondToAction }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!data) return <div style={{ padding: "2rem", color: C.textMuted }}>Loading dashboard...</div>;

  const project = data.project || {};
  const verification = data.verification || {};
  const milestones = data.milestones || [];
  const recovery = data.financialRecovery || { items: [], totalRecovery: 0, realizedRecovery: 0, pendingRecovery: 0 };
  const risks = data.risks || [];
  const openRisks = data.openRisks || 0;
  const pendingClientActions = data.pendingClientActions || 0;
  const actionItems = data.actionItems || [];
  const reports = data.reports || [];
  const meetings = data.meetings || [];
  const billing = data.billing || [];
  const documents = data.documents || [];
  const locations = data.locations || [];
  const departments = data.departments || [];
  const recentAssets = data.recentAssets || [];
  const conditionBreakdown = data.conditionBreakdown || [];
  const locationBreakdown = data.locationBreakdown || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.charcoal }}>
      {/* Header */}
      <header style={{ background: C.navy, borderBottom: `1px solid ${C.border}`, padding: "0.75rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: C.silver, textDecoration: "none", fontSize: "0.8rem", padding: "0.3rem 0.6rem", background: C.slate, borderRadius: 6, border: `1px solid ${C.border}` }}>
            ← Main Site
          </a>
          <img src={LOGO_IMG} alt="LAI" style={{ height: 32 }} />
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.text, margin: 0 }}>{dashboardTitle || "Executive Dashboard"}</h1>
            <p style={{ color: C.textMuted, fontSize: "0.7rem", margin: 0 }}>Welcome, {clientName || project.clientName}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button onClick={onChangePassword} style={{ padding: "0.4rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.silver, cursor: "pointer", fontSize: "0.7rem" }}>Password</button>
          <button onClick={onLogout} style={{ padding: "0.4rem 0.75rem", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer", fontSize: "0.7rem" }}>Sign Out</button>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <aside style={{ width: sidebarOpen ? 220 : 60, background: C.navy, borderRight: `1px solid ${C.border}`, transition: "width 0.2s", flexShrink: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "0.75rem", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {sidebarOpen && <span style={{ color: C.gold, fontSize: "0.7rem", fontWeight: 700 }}>PHASE 2</span>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer" }}>{sidebarOpen ? "◀" : "▶"}</button>
          </div>
          <nav style={{ flex: 1, padding: "0.5rem", overflowY: "auto" }}>
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)} style={{
                display: "flex", alignItems: "center", gap: "0.6rem", width: "100%",
                padding: sidebarOpen ? "0.55rem 0.7rem" : "0.55rem",
                background: activeSection === item.id ? `${C.gold}15` : "transparent",
                border: activeSection === item.id ? `1px solid ${C.gold}40` : "1px solid transparent",
                borderRadius: 8, color: activeSection === item.id ? C.gold : C.silver,
                cursor: "pointer", fontSize: "0.78rem", fontWeight: activeSection === item.id ? 600 : 400,
                textAlign: "left", marginBottom: "0.2rem", justifyContent: sidebarOpen ? "flex-start" : "center",
              }}>
                <span>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
                {sidebarOpen && item.id === "actions" && pendingClientActions > 0 && (
                  <span style={{ marginLeft: "auto", background: "#EF4444", color: "white", fontSize: "0.6rem", padding: "0.1rem 0.35rem", borderRadius: 10, fontWeight: 700 }}>{pendingClientActions}</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
          {activeSection === "overview" && <OverviewSection project={project} verification={verification} recovery={recovery} openRisks={openRisks} pendingClientActions={pendingClientActions} milestones={milestones} />}
          {activeSection === "progress" && <ProgressSection milestones={milestones} verification={verification} />}
          {activeSection === "assets" && <AssetsSection verification={verification} recentAssets={recentAssets} conditionBreakdown={conditionBreakdown} locationBreakdown={locationBreakdown} />}
          {activeSection === "recovery" && <RecoverySection recovery={recovery} />}
          {activeSection === "risks" && <RisksSection risks={risks} />}
          {activeSection === "locations" && <LocationsSection locations={locations} departments={departments} />}
          {activeSection === "actions" && <ActionsSection items={actionItems} accessToken={accessToken} onRespond={onRespondToAction} />}
          {activeSection === "reports" && <ReportsSection reports={reports} documents={documents} />}
          {activeSection === "meetings" && <MeetingsSection meetings={meetings} project={project} />}
          {activeSection === "billing" && <BillingSection billing={billing} />}
        </main>
      </div>
    </div>
  );
}

// ═══ OVERVIEW ═══════════════════════════════════════════════════════════════════
function OverviewSection({ project, verification: v, recovery: r, openRisks, pendingClientActions, milestones }: any) {
  const phase2Completion = v?.phase2Completion || 0;

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Banner */}
      <div style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem 2rem", marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.text, margin: "0 0 0.25rem" }}>{project.clientName || project.name}</h1>
        <p style={{ color: C.gold, fontSize: "0.8rem", fontWeight: 600, margin: "0 0 0.5rem" }}>Phase 2 – Verification & Reconciliation</p>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ color: C.silver, fontSize: "0.8rem" }}>Status: <strong style={{ color: v?.phase2Status === "on_track" ? "#10B981" : v?.phase2Status === "at_risk" ? "#F59E0B" : v?.phase2Status === "delayed" ? "#EF4444" : C.text, textTransform: "capitalize" }}>{(v?.phase2Status || "not started").replace(/_/g, " ")}</strong></span>
          <span style={{ color: C.silver, fontSize: "0.8rem" }}>PM: <strong>{project.projectManager || "LAI Team"}</strong></span>
        </div>
        <div style={{ marginTop: "1rem", height: 10, background: C.slate, borderRadius: 5, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(100, phase2Completion)}%`, background: C.gold, borderRadius: 5, transition: "width 0.5s" }} />
        </div>
        <p style={{ color: C.textMuted, fontSize: "0.75rem", marginTop: "0.4rem" }}>{phase2Completion}% Complete</p>
        {v?.clientFacingSummary && <p style={{ color: C.textMuted, fontSize: "0.85rem", marginTop: "0.75rem", lineHeight: 1.6 }}>{v.clientFacingSummary}</p>}
      </div>

      {/* Key Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "FAR Baseline", value: v?.farBaseline || "—", color: C.text },
          { label: "Verified", value: v?.totalPhysicallyVerified || 0, color: C.gold },
          { label: "Remaining", value: v?.remaining || 0, color: C.text },
          { label: "Coverage", value: v?.farBaseline > 0 ? `${v.verificationCoverage}%` : "—", color: C.gold },
        ].map((m, i) => (
          <div key={i} style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem" }}>
            <p style={{ color: C.textMuted, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", margin: "0 0 0.3rem" }}>{m.label}</p>
            <p style={{ color: m.color, fontSize: "1.3rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", margin: 0 }}>{m.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Not Found", value: v?.notFound || 0 },
          { label: "Additional Found", value: v?.additional || 0 },
          { label: "Recovery Identified", value: r?.totalRecovery > 0 ? `$${r.totalRecovery.toLocaleString()}` : "—" },
          { label: "Pending Actions", value: pendingClientActions || 0 },
        ].map((m, i) => (
          <div key={i} style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem" }}>
            <p style={{ color: C.textMuted, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", margin: "0 0 0.3rem" }}>{m.label}</p>
            <p style={{ color: C.text, fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Recovery Summary */}
      {r && r.totalRecovery > 0 && (
        <div style={{ background: `${C.gold}08`, borderRadius: 12, border: `1px solid ${C.gold}40`, padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ color: C.gold, fontSize: "0.85rem", fontWeight: 600, margin: "0 0 0.75rem" }}>Financial Recovery Summary</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            <div><span style={{ color: C.textMuted, fontSize: "0.7rem", display: "block" }}>Total Identified</span><span style={{ color: C.text, fontSize: "1rem", fontWeight: 600 }}>${r.totalRecovery.toLocaleString()}</span></div>
            <div><span style={{ color: C.textMuted, fontSize: "0.7rem", display: "block" }}>Realized</span><span style={{ color: "#10B981", fontSize: "1rem", fontWeight: 600 }}>${r.realizedRecovery.toLocaleString()}</span></div>
            <div><span style={{ color: C.textMuted, fontSize: "0.7rem", display: "block" }}>Pending</span><span style={{ color: C.text, fontSize: "1rem", fontWeight: 600 }}>${r.pendingRecovery.toLocaleString()}</span></div>
          </div>
        </div>
      )}

      {openRisks > 0 && (
        <div style={{ background: "rgba(239,68,68,0.05)", borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)", padding: "1rem 1.25rem" }}>
          <span style={{ color: "#EF4444", fontSize: "0.85rem", fontWeight: 600 }}>⚠️ {openRisks} Open Risk{openRisks > 1 ? "s" : ""} Requiring Attention</span>
        </div>
      )}
    </div>
  );
}

// ═══ PROGRESS ════════════════════════════════════════════════════════════════════
function ProgressSection({ milestones, verification }: any) {
  return (
    <div style={{ maxWidth: 900 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, margin: "0 0 0.25rem" }}>Phase 2 Progress</h2>
      <p style={{ color: C.gold, fontSize: "0.8rem", fontWeight: 600, margin: "0 0 1.5rem" }}>Verification & Reconciliation</p>

      <div style={{ height: 12, background: C.slate, borderRadius: 6, overflow: "hidden", marginBottom: "2rem" }}>
        <div style={{ height: "100%", width: `${Math.min(100, verification?.phase2Completion || 0)}%`, background: C.gold, borderRadius: 6, transition: "width 0.5s" }} />
      </div>

      {(milestones || []).map((m: any, i: number) => (
        <div key={m.id || i} style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1.25rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <div>
              <span style={{ color: C.gold, fontSize: "0.7rem", marginRight: "0.5rem" }}>M{m.milestoneNumber}</span>
              <span style={{ color: C.text, fontSize: "0.9rem", fontWeight: 500 }}>{m.milestoneName}</span>
            </div>
            <span style={{ padding: "0.2rem 0.5rem", background: m.status === "completed" ? "#10B98120" : m.status === "in_progress" ? `${C.gold}20` : `${C.slate}`, color: m.status === "completed" ? "#10B981" : m.status === "in_progress" ? C.gold : C.textMuted, borderRadius: 4, fontSize: "0.7rem", fontWeight: 600, textTransform: "capitalize" }}>
              {m.status?.replace(/_/g, " ")}
            </span>
          </div>
          <div style={{ height: 6, background: C.slate, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${m.completionPercent || 0}%`, background: m.status === "completed" ? "#10B981" : C.gold, transition: "width 0.3s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
            <span style={{ color: C.textMuted, fontSize: "0.7rem" }}>{m.completionPercent || 0}%</span>
            {m.targetDate && <span style={{ color: C.textMuted, fontSize: "0.7rem" }}>Target: {new Date(m.targetDate).toLocaleDateString()}</span>}
          </div>
          {m.clientUpdate && <p style={{ color: C.silver, fontSize: "0.8rem", margin: "0.5rem 0 0", fontStyle: "italic" }}>{m.clientUpdate}</p>}
        </div>
      ))}

      {(!milestones || milestones.length === 0) && <p style={{ color: C.textMuted }}>Milestones will appear once the project manager initializes them.</p>}
    </div>
  );
}

// ═══ ASSETS ═════════════════════════════════════════════════════════════════════
function AssetsSection({ verification: v, recentAssets, conditionBreakdown, locationBreakdown }: any) {
  return (
    <div style={{ maxWidth: 1100 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, margin: "0 0 1.5rem" }}>Asset Verification Status</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "FAR Baseline", val: v?.farBaseline || 0 },
          { label: "Verified", val: v?.verified || 0 },
          { label: "Not Found", val: v?.notFound || 0 },
          { label: "Additional Found", val: v?.additional || 0 },
          { label: "Ghost Assets", val: v?.ghostAssets || 0 },
          { label: "Zombie Assets", val: v?.zombieAssets || 0 },
          { label: "Vampire Assets", val: v?.vampireAssets || 0 },
          { label: "Duplicates", val: v?.duplicateAssets || 0 },
          { label: "Active", val: v?.activeAssets || 0 },
          { label: "In Repair", val: v?.assetsInRepair || 0 },
          { label: "Remaining", val: v?.remaining || 0 },
          { label: "Coverage", val: v?.farBaseline > 0 ? `${v.verificationCoverage}%` : "—" },
        ].map((item, i) => (
          <div key={i} style={{ background: C.navy, borderRadius: 8, border: `1px solid ${C.border}`, padding: "0.75rem 1rem" }}>
            <span style={{ color: C.textMuted, fontSize: "0.65rem", display: "block" }}>{item.label}</span>
            <span style={{ color: C.text, fontSize: "1rem", fontWeight: 600 }}>{item.val}</span>
          </div>
        ))}
      </div>

      {recentAssets && recentAssets.length > 0 && (
        <div style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1.25rem", overflow: "auto" }}>
          <h3 style={{ color: C.silver, fontSize: "0.85rem", margin: "0 0 0.75rem" }}>Recent Verified Assets</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
            <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>
              <th style={{ textAlign: "left", padding: "0.5rem", color: C.silver }}>Tag</th>
              <th style={{ textAlign: "left", padding: "0.5rem", color: C.silver }}>Name</th>
              <th style={{ textAlign: "left", padding: "0.5rem", color: C.silver }}>Status</th>
              <th style={{ textAlign: "left", padding: "0.5rem", color: C.silver }}>Condition</th>
              <th style={{ textAlign: "left", padding: "0.5rem", color: C.silver }}>Location</th>
            </tr></thead>
            <tbody>
              {recentAssets.slice(0, 15).map((a: any) => (
                <tr key={a.id} style={{ borderBottom: `1px solid ${C.border}20` }}>
                  <td style={{ padding: "0.4rem 0.5rem", color: C.gold }}>{a.assetTag}</td>
                  <td style={{ padding: "0.4rem 0.5rem", color: C.text }}>{a.name}</td>
                  <td style={{ padding: "0.4rem 0.5rem", color: C.textMuted, textTransform: "capitalize" }}>{a.status?.replace("_", " ")}</td>
                  <td style={{ padding: "0.4rem 0.5rem", color: C.textMuted, textTransform: "capitalize" }}>{a.condition}</td>
                  <td style={{ padding: "0.4rem 0.5rem", color: C.textMuted }}>{a.location || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══ RECOVERY ═══════════════════════════════════════════════════════════════════
function RecoverySection({ recovery }: any) {
  return (
    <div style={{ maxWidth: 1000 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, margin: "0 0 1.5rem" }}>Financial Recovery</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem" }}><p style={{ color: C.textMuted, fontSize: "0.7rem", margin: "0 0 0.3rem" }}>Total Identified</p><p style={{ color: C.gold, fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>${(recovery?.totalRecovery || 0).toLocaleString()}</p></div>
        <div style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem" }}><p style={{ color: C.textMuted, fontSize: "0.7rem", margin: "0 0 0.3rem" }}>Realized</p><p style={{ color: "#10B981", fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>${(recovery?.realizedRecovery || 0).toLocaleString()}</p></div>
        <div style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem" }}><p style={{ color: C.textMuted, fontSize: "0.7rem", margin: "0 0 0.3rem" }}>Pending</p><p style={{ color: C.text, fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>${(recovery?.pendingRecovery || 0).toLocaleString()}</p></div>
        <div style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem" }}><p style={{ color: C.textMuted, fontSize: "0.7rem", margin: "0 0 0.3rem" }}>Est. ROI</p><p style={{ color: C.gold, fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>{recovery?.estimatedRoi != null ? `${recovery.estimatedRoi}%` : "—"}</p></div>
      </div>
      {recovery?.items?.length > 0 && recovery.items.map((item: any) => (
        <div key={item.id} style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem", marginBottom: "0.75rem", display: "flex", justifyContent: "space-between" }}>
          <div>
            <span style={{ color: C.text, fontSize: "0.85rem", fontWeight: 500 }}>{item.title || item.category?.replace(/_/g, " ")}</span>
            <span style={{ color: C.textMuted, fontSize: "0.7rem", marginLeft: "0.75rem", textTransform: "capitalize" }}>{item.status?.replace(/_/g, " ")}</span>
            {item.description && <p style={{ color: C.textMuted, fontSize: "0.75rem", margin: "0.2rem 0 0" }}>{item.description}</p>}
          </div>
          <span style={{ color: C.gold, fontSize: "0.9rem", fontWeight: 600 }}>${parseFloat(item.amount || "0").toLocaleString()}</span>
        </div>
      ))}
      {(!recovery?.items || recovery.items.length === 0) && <p style={{ color: C.textMuted }}>No recovery opportunities identified yet.</p>}
    </div>
  );
}

// ═══ RISKS ══════════════════════════════════════════════════════════════════════
function RisksSection({ risks }: any) {
  const open = (risks || []).filter((r: any) => ["open", "under_review", "mitigation_in_progress", "in_progress"].includes(r.status));
  const resolved = (risks || []).filter((r: any) => ["resolved", "closed", "accepted"].includes(r.status));
  return (
    <div style={{ maxWidth: 1000 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, margin: "0 0 1.5rem" }}>Risks & Exceptions</h2>
      <p style={{ color: C.textMuted, fontSize: "0.85rem", marginBottom: "1.5rem" }}>Open: {open.length} | Resolved: {resolved.length}</p>
      {open.map((r: any) => (
        <div key={r.id} style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, borderLeft: `3px solid ${r.riskLevel === "critical" ? "#EF4444" : r.riskLevel === "high" ? "#F59E0B" : "#F1C40F"}`, padding: "1rem", marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: C.text, fontSize: "0.85rem", fontWeight: 500 }}>{r.title || r.riskType?.replace(/_/g, " ")}</span>
            <span style={{ color: C.textMuted, fontSize: "0.7rem", textTransform: "capitalize" }}>{r.riskLevel} | {r.status?.replace(/_/g, " ")}</span>
          </div>
          {r.description && <p style={{ color: C.textMuted, fontSize: "0.8rem", margin: "0.3rem 0 0" }}>{r.description}</p>}
        </div>
      ))}
      {resolved.length > 0 && <h3 style={{ color: C.silver, fontSize: "0.85rem", margin: "1.5rem 0 0.75rem" }}>Resolved ({resolved.length})</h3>}
      {resolved.map((r: any) => (
        <div key={r.id} style={{ background: C.navy, borderRadius: 8, border: `1px solid ${C.border}20`, padding: "0.75rem", marginBottom: "0.5rem", opacity: 0.7 }}>
          <span style={{ color: C.text, fontSize: "0.8rem" }}>{r.title || r.riskType?.replace(/_/g, " ")}</span>
          <span style={{ color: "#10B981", fontSize: "0.7rem", marginLeft: "0.75rem" }}>✓ Resolved</span>
        </div>
      ))}
      {(!risks || risks.length === 0) && <p style={{ color: C.textMuted }}>No risks or exceptions reported.</p>}
    </div>
  );
}

// ═══ LOCATIONS ══════════════════════════════════════════════════════════════════
function LocationsSection({ locations, departments }: any) {
  return (
    <div style={{ maxWidth: 1000 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, margin: "0 0 1.5rem" }}>Locations & Departments</h2>
      {locations?.length > 0 && <h3 style={{ color: C.silver, fontSize: "0.85rem", marginBottom: "0.75rem" }}>Locations ({locations.length})</h3>}
      {(locations || []).map((l: any) => (
        <div key={l.id} style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem", marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: C.text, fontSize: "0.85rem", fontWeight: 500 }}>{l.locationName}</span>
            <span style={{ color: l.verificationStatus === "completed" ? "#10B981" : C.textMuted, fontSize: "0.75rem", textTransform: "capitalize" }}>{l.verificationStatus?.replace("_", " ")}</span>
          </div>
          {l.address && <p style={{ color: C.textMuted, fontSize: "0.75rem", margin: "0.2rem 0 0" }}>{l.address}</p>}
          {l.clientNotes && <p style={{ color: C.silver, fontSize: "0.75rem", margin: "0.2rem 0 0", fontStyle: "italic" }}>{l.clientNotes}</p>}
        </div>
      ))}
      {departments?.length > 0 && <h3 style={{ color: C.silver, fontSize: "0.85rem", margin: "1.5rem 0 0.75rem" }}>Departments ({departments.length})</h3>}
      {(departments || []).map((d: any) => (
        <div key={d.id} style={{ background: C.navy, borderRadius: 8, border: `1px solid ${C.border}`, padding: "0.75rem", marginBottom: "0.5rem" }}>
          <span style={{ color: C.text, fontSize: "0.85rem" }}>{d.departmentName}</span>
          {d.departmentCode && <span style={{ color: C.textMuted, fontSize: "0.7rem", marginLeft: "0.5rem" }}>({d.departmentCode})</span>}
        </div>
      ))}
      {(!locations || locations.length === 0) && (!departments || departments.length === 0) && <p style={{ color: C.textMuted }}>No locations or departments configured yet.</p>}
    </div>
  );
}

// ═══ ACTIONS ════════════════════════════════════════════════════════════════════
function ActionsSection({ items, accessToken, onRespond }: { items: any[]; accessToken: string; onRespond?: (id: number, response: string, status: string) => void }) {
  const [responseText, setResponseText] = useState<Record<number, string>>({});
  const [selectedDecision, setSelectedDecision] = useState<Record<number, string>>({});
  const [submitError, setSubmitError] = useState<Record<number, string>>({});

  const handleSubmit = (itemId: number) => {
    const decision = selectedDecision[itemId];
    const comments = responseText[itemId] || "";
    if (!decision) { setSubmitError({ ...submitError, [itemId]: "Please select a decision." }); return; }
    if (decision !== "approved" && !comments.trim()) { setSubmitError({ ...submitError, [itemId]: "Written explanation required for this decision." }); return; }
    setSubmitError({ ...submitError, [itemId]: "" });
    onRespond?.(itemId, comments, decision);
    setResponseText({ ...responseText, [itemId]: "" });
    setSelectedDecision({ ...selectedDecision, [itemId]: "" });
  };

  return (
    <div style={{ maxWidth: 1000 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, margin: "0 0 1.5rem" }}>Tasks & Approvals</h2>
      {(items || []).map((item: any) => (
        <div key={item.id} style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1.25rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: C.text, fontSize: "0.9rem", fontWeight: 500 }}>{item.title}</span>
            <span style={{ padding: "0.15rem 0.5rem", background: item.status === "pending" ? "#F59E0B20" : item.status === "completed" ? "#10B98120" : `${C.slate}`, color: item.status === "pending" ? "#F59E0B" : item.status === "completed" ? "#10B981" : C.textMuted, borderRadius: 4, fontSize: "0.7rem", fontWeight: 600, textTransform: "capitalize" }}>{item.status}</span>
          </div>
          {item.description && <p style={{ color: C.textMuted, fontSize: "0.8rem", margin: "0 0 0.5rem" }}>{item.description}</p>}
          {item.dueDate && <p style={{ color: C.textMuted, fontSize: "0.7rem", margin: "0 0 0.5rem" }}>Due: {new Date(item.dueDate).toLocaleDateString()}</p>}
          {item.responseDecision && (
            <div style={{ marginTop: "0.5rem", padding: "0.5rem 0.75rem", background: `${C.slate}50`, borderRadius: 6, borderLeft: `3px solid ${item.responseDecision === "approved" ? "#10B981" : "#EF4444"}` }}>
              <p style={{ color: C.silver, fontSize: "0.75rem", margin: "0 0 0.25rem" }}>Response: <strong style={{ color: item.responseDecision === "approved" ? "#10B981" : "#EF4444" }}>{item.responseDecision.replace(/_/g, " ").toUpperCase()}</strong></p>
              {item.responseComments && <p style={{ color: C.textMuted, fontSize: "0.75rem", margin: 0 }}>{item.responseComments}</p>}
              {item.respondedBy && <p style={{ color: C.textMuted, fontSize: "0.65rem", margin: "0.25rem 0 0" }}>— {item.respondedBy}, {item.respondedAt ? new Date(item.respondedAt).toLocaleString() : ""}</p>}
            </div>
          )}
          {item.status === "pending" && onRespond && (
            <div style={{ marginTop: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                {["approved", "rejected", "changes_requested", "clarification_requested"].map(d => (
                  <button key={d} onClick={() => setSelectedDecision({ ...selectedDecision, [item.id]: d })} style={{ padding: "0.35rem 0.6rem", background: selectedDecision[item.id] === d ? (d === "approved" ? "#10B981" : "#EF4444") : C.slate, border: `1px solid ${selectedDecision[item.id] === d ? "transparent" : C.border}`, borderRadius: 6, color: selectedDecision[item.id] === d ? "white" : C.silver, fontSize: "0.7rem", cursor: "pointer", fontWeight: selectedDecision[item.id] === d ? 600 : 400 }}>
                    {d.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
              <textarea style={{ width: "100%", padding: "0.5rem 0.6rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.8rem", minHeight: 50, resize: "vertical", boxSizing: "border-box" }} placeholder={selectedDecision[item.id] && selectedDecision[item.id] !== "approved" ? "Written explanation required..." : "Comments (optional for Approved)..."} value={responseText[item.id] || ""} onChange={e => setResponseText({ ...responseText, [item.id]: e.target.value })} />
              {submitError[item.id] && <p style={{ color: "#EF4444", fontSize: "0.75rem", margin: "0.25rem 0" }}>{submitError[item.id]}</p>}
              <button onClick={() => handleSubmit(item.id)} style={{ marginTop: "0.5rem", padding: "0.4rem 1rem", background: C.gold, border: "none", borderRadius: 6, color: "#0B0F13", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>Submit Response</button>
            </div>
          )}
        </div>
      ))}
      {(!items || items.length === 0) && <p style={{ color: C.textMuted }}>No pending tasks or approvals.</p>}
    </div>
  );
}

// ═══ REPORTS ════════════════════════════════════════════════════════════════════
function ReportsSection({ reports, documents }: any) {
  const published = (reports || []).filter((r: any) => r.status === "final");
  return (
    <div style={{ maxWidth: 1000 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, margin: "0 0 1.5rem" }}>Reports & Documents</h2>
      {published.length > 0 && <h3 style={{ color: C.silver, fontSize: "0.85rem", marginBottom: "0.75rem" }}>Published Reports</h3>}
      {published.map((r: any) => (
        <div key={r.id} style={{ background: C.navy, borderRadius: 8, border: `1px solid ${C.border}`, padding: "1rem", marginBottom: "0.5rem" }}>
          <span style={{ color: C.text, fontSize: "0.85rem", fontWeight: 500 }}>{r.title}</span>
          <span style={{ color: C.textMuted, fontSize: "0.7rem", marginLeft: "0.75rem" }}>{r.reportType?.replace(/_/g, " ")}</span>
        </div>
      ))}
      {documents?.length > 0 && <h3 style={{ color: C.silver, fontSize: "0.85rem", margin: "1.5rem 0 0.75rem" }}>Documents</h3>}
      {(documents || []).map((d: any) => (
        <div key={d.id} style={{ background: C.navy, borderRadius: 8, border: `1px solid ${C.border}`, padding: "0.75rem", marginBottom: "0.5rem" }}>
          <span style={{ color: C.text, fontSize: "0.85rem" }}>{d.fileName}</span>
          <span style={{ color: C.textMuted, fontSize: "0.7rem", marginLeft: "0.75rem" }}>{d.documentType?.replace(/_/g, " ")}</span>
        </div>
      ))}
      {published.length === 0 && (!documents || documents.length === 0) && <p style={{ color: C.textMuted }}>No reports or documents available yet.</p>}
    </div>
  );
}

// ═══ MEETINGS ═══════════════════════════════════════════════════════════════════
function MeetingsSection({ meetings, project }: any) {
  const upcoming = (meetings || []).filter((m: any) => m.status === "scheduled");
  const completed = (meetings || []).filter((m: any) => m.status === "completed");
  return (
    <div style={{ maxWidth: 1000 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, margin: "0 0 1.5rem" }}>Meetings & Messages</h2>
      {project?.projectManager && (
        <div style={{ background: `${C.gold}08`, borderRadius: 10, border: `1px solid ${C.gold}40`, padding: "1rem", marginBottom: "1.5rem" }}>
          <span style={{ color: C.gold, fontSize: "0.75rem", fontWeight: 600 }}>Your LAI Project Manager</span>
          <p style={{ color: C.text, fontSize: "0.9rem", margin: "0.2rem 0 0" }}>{project.projectManager}</p>
        </div>
      )}
      {upcoming.length > 0 && <h3 style={{ color: C.silver, fontSize: "0.85rem", marginBottom: "0.75rem" }}>Upcoming</h3>}
      {upcoming.map((m: any) => (
        <div key={m.id} style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem", marginBottom: "0.75rem" }}>
          <span style={{ color: C.text, fontSize: "0.85rem", fontWeight: 500 }}>{m.title}</span>
          {m.scheduledDate && <span style={{ color: C.gold, fontSize: "0.75rem", marginLeft: "0.75rem" }}>{new Date(m.scheduledDate).toLocaleString()}</span>}
        </div>
      ))}
      {completed.length > 0 && <h3 style={{ color: C.silver, fontSize: "0.85rem", margin: "1.5rem 0 0.75rem" }}>Completed</h3>}
      {completed.map((m: any) => (
        <div key={m.id} style={{ background: C.navy, borderRadius: 8, border: `1px solid ${C.border}`, padding: "1rem", marginBottom: "0.5rem" }}>
          <span style={{ color: C.text, fontSize: "0.85rem" }}>{m.title}</span>
          {m.summary && <p style={{ color: C.textMuted, fontSize: "0.8rem", margin: "0.2rem 0 0" }}>{m.summary}</p>}
        </div>
      ))}
      {(!meetings || meetings.length === 0) && <p style={{ color: C.textMuted }}>No meetings or messages.</p>}
    </div>
  );
}

// ═══ BILLING ════════════════════════════════════════════════════════════════════
function BillingSection({ billing }: any) {
  const items = billing || [];
  const totalInvoiced = items.reduce((s: number, b: any) => s + parseFloat(b.amount || "0"), 0);
  const totalPaid = items.reduce((s: number, b: any) => s + parseFloat(b.amountPaid || "0"), 0);
  const outstanding = totalInvoiced - totalPaid;

  return (
    <div style={{ maxWidth: 1100 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, margin: "0 0 1.5rem" }}>Billing</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem" }}><p style={{ color: C.textMuted, fontSize: "0.7rem", margin: "0 0 0.3rem" }}>Total Invoiced</p><p style={{ color: C.text, fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>${totalInvoiced.toLocaleString()}</p></div>
        <div style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem" }}><p style={{ color: C.textMuted, fontSize: "0.7rem", margin: "0 0 0.3rem" }}>Paid</p><p style={{ color: "#10B981", fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>${totalPaid.toLocaleString()}</p></div>
        <div style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem" }}><p style={{ color: C.textMuted, fontSize: "0.7rem", margin: "0 0 0.3rem" }}>Outstanding</p><p style={{ color: outstanding > 0 ? "#F59E0B" : C.text, fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>${outstanding.toLocaleString()}</p></div>
      </div>
      {items.length > 0 && (
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
            <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>
              <th style={{ textAlign: "left", padding: "0.5rem", color: C.silver }}>Invoice</th>
              <th style={{ textAlign: "left", padding: "0.5rem", color: C.silver }}>Description</th>
              <th style={{ textAlign: "left", padding: "0.5rem", color: C.silver }}>Due</th>
              <th style={{ textAlign: "right", padding: "0.5rem", color: C.silver }}>Amount</th>
              <th style={{ textAlign: "right", padding: "0.5rem", color: C.silver }}>Paid</th>
              <th style={{ textAlign: "left", padding: "0.5rem", color: C.silver }}>Status</th>
            </tr></thead>
            <tbody>
              {items.map((b: any) => (
                <tr key={b.id} style={{ borderBottom: `1px solid ${C.border}20` }}>
                  <td style={{ padding: "0.4rem 0.5rem", color: C.gold }}>{b.invoiceNumber || "—"}</td>
                  <td style={{ padding: "0.4rem 0.5rem", color: C.text }}>{b.description}</td>
                  <td style={{ padding: "0.4rem 0.5rem", color: C.textMuted }}>{b.dueDate ? new Date(b.dueDate).toLocaleDateString() : "—"}</td>
                  <td style={{ padding: "0.4rem 0.5rem", color: C.text, textAlign: "right" }}>${parseFloat(b.amount || "0").toLocaleString()}</td>
                  <td style={{ padding: "0.4rem 0.5rem", color: "#10B981", textAlign: "right" }}>${parseFloat(b.amountPaid || "0").toLocaleString()}</td>
                  <td style={{ padding: "0.4rem 0.5rem", color: b.status === "paid" ? "#10B981" : b.status === "past_due" || b.status === "overdue" ? "#EF4444" : C.textMuted, textTransform: "capitalize" }}>{b.status?.replace("_", " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {items.length === 0 && <p style={{ color: C.textMuted }}>No billing records available.</p>}
    </div>
  );
}
