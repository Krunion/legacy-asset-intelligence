import { useState } from "react";
import { COLORS } from "@shared/colors";

const C = COLORS;

// ─── Types ────────────────────────────────────────────────────────────────────
type DashboardSection =
  | "overview"
  | "progress"
  | "assets"
  | "recovery"
  | "risks"
  | "locations"
  | "actions"
  | "reports"
  | "meetings"
  | "billing"
  | "settings";

interface DashboardProps {
  data: any;
  accessToken: string;
  clientName: string;
  dashboardTitle: string | null;
  onChangePassword: () => void;
  onLogout: () => void;
  onRespondToAction?: (actionId: number, response: string, status: string) => void;
}

// ─── Nav Items ────────────────────────────────────────────────────────────────
const NAV_ITEMS: { id: DashboardSection; label: string; icon: string }[] = [
  { id: "overview", label: "Dashboard", icon: "📊" },
  { id: "progress", label: "Project Progress", icon: "📈" },
  { id: "assets", label: "Assets", icon: "🏷️" },
  { id: "recovery", label: "Recovery Opportunities", icon: "💰" },
  { id: "risks", label: "Risks & Exceptions", icon: "⚠️" },
  { id: "locations", label: "Locations", icon: "📍" },
  { id: "actions", label: "Tasks & Approvals", icon: "✅" },
  { id: "reports", label: "Reports & Documents", icon: "📄" },
  { id: "meetings", label: "Meetings & Messages", icon: "📅" },
  { id: "billing", label: "Billing", icon: "💳" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

// ─── Helper Components ────────────────────────────────────────────────────────
function StatusBadge({ status, colors }: { status: string; colors?: Record<string, string> }) {
  const defaultColors: Record<string, string> = {
    on_track: "#10B981", active: "#10B981", completed: "#10B981", approved: "#10B981", realized: "#10B981", paid: "#10B981",
    at_risk: "#F59E0B", in_progress: "#F59E0B", under_review: "#F59E0B", pending: "#F59E0B", in_review: "#F59E0B", sent: "#F59E0B",
    delayed: "#EF4444", overdue: "#EF4444", critical: "#EF4444", rejected: "#EF4444", cancelled: "#EF4444",
    on_hold: "#8B5CF6", not_started: "#6B7280", draft: "#6B7280", scheduled: "#60A5FA",
  };
  const c = colors || defaultColors;
  const color = c[status] || "#6B7280";
  return (
    <span style={{ padding: "0.2rem 0.6rem", background: `${color}20`, color, borderRadius: 4, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em", whiteSpace: "nowrap" }}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function ProgressBar({ percent, color = C.gold, height = 8 }: { percent: number; color?: string; height?: number }) {
  return (
    <div style={{ height, background: C.slate, borderRadius: height / 2, overflow: "hidden", width: "100%" }}>
      <div style={{ height: "100%", width: `${Math.min(100, percent)}%`, background: color, borderRadius: height / 2, transition: "width 0.5s ease" }} />
    </div>
  );
}

function Card({ children, title, subtitle, action }: { children: React.ReactNode; title?: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
      {(title || action) && (
        <div style={{ padding: "1rem 1.5rem", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {title && <h3 style={{ color: C.text, fontSize: "0.95rem", fontWeight: 600, margin: 0 }}>{title}</h3>}
            {subtitle && <p style={{ color: C.textMuted, fontSize: "0.75rem", margin: "0.2rem 0 0" }}>{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div style={{ padding: "1.25rem 1.5rem" }}>{children}</div>
    </div>
  );
}

function MetricCard({ label, value, sub, color = C.gold }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem 1.25rem" }}>
      <p style={{ color: C.textMuted, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.4rem" }}>{label}</p>
      <p style={{ color, fontSize: "1.4rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", margin: 0 }}>{value}</p>
      {sub && <p style={{ color: C.textMuted, fontSize: "0.7rem", margin: "0.3rem 0 0" }}>{sub}</p>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ClientExecutiveDashboard({ data, accessToken, clientName, dashboardTitle, onChangePassword, onLogout, onRespondToAction }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const project = data.project;
  const stats = data.stats;
  const kpis = data.kpis;
  const phases = data.phases || [];
  const recovery = data.financialRecovery || { items: [], totalRecovery: 0, realizedRecovery: 0, pendingRecovery: 0 };
  const risks = data.risks || [];
  const actionItems = data.actionItems || [];
  const reports = data.reports || [];
  const meetings = data.meetings || [];
  const billing = data.billing || [];
  const locationBreakdown = data.locationBreakdown || [];
  const departmentBreakdown = data.departmentBreakdown || [];

  // Calculate overall completion
  const overallCompletion = phases.length > 0
    ? Math.round(phases.reduce((sum: number, p: any) => sum + (p.completionPercent || 0), 0) / phases.length)
    : 0;

  // Determine project status
  const projectStatus = project.status === "active" ? "on_track" : project.status;

  // Days remaining
  const daysRemaining = project.endDate
    ? Math.max(0, Math.ceil((new Date(project.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  // Current phase
  const currentPhase = phases.find((p: any) => p.status === "in_progress") || phases[0];

  // Pending actions count
  const pendingActions = actionItems.filter((a: any) => a.status === "pending" || a.status === "overdue").length;

  const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663776896878/TfZTrDNPnnG2dF7hgZeTPt/lai-logo-5QXNLUsEDRp3nBVBAMiXK4.webp";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.charcoal }}>
      {/* Top Header */}
      <header style={{ background: C.navy, borderBottom: `1px solid ${C.border}`, padding: "0.75rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: C.silver, textDecoration: "none", fontSize: "0.8rem", padding: "0.3rem 0.6rem", background: C.slate, borderRadius: 6, border: `1px solid ${C.border}` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            Main Site
          </a>
          <img src={LOGO_IMG} alt="LAI" style={{ height: 32 }} />
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.text, margin: 0 }}>
              {dashboardTitle || "Executive Dashboard"}
            </h1>
            <p style={{ color: C.textMuted, fontSize: "0.7rem", margin: 0 }}>
              Welcome, {clientName || project.clientName}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ color: C.textMuted, fontSize: "0.7rem" }}>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </header>

      {/* Body: Sidebar + Main */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 60,
        background: C.navy,
        borderRight: `1px solid ${C.border}`,
        transition: "width 0.2s ease",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
      }}>
        <div style={{ padding: "1rem", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {sidebarOpen && <span style={{ color: C.gold, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em" }}>NAVIGATION</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: "1.1rem" }}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>
        <nav style={{ flex: 1, padding: "0.5rem", overflowY: "auto" }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                width: "100%",
                padding: sidebarOpen ? "0.6rem 0.75rem" : "0.6rem",
                background: activeSection === item.id ? `${C.gold}15` : "transparent",
                border: activeSection === item.id ? `1px solid ${C.gold}40` : "1px solid transparent",
                borderRadius: 8,
                color: activeSection === item.id ? C.gold : C.silver,
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: activeSection === item.id ? 600 : 400,
                textAlign: "left",
                marginBottom: "0.25rem",
                transition: "all 0.15s ease",
                justifyContent: sidebarOpen ? "flex-start" : "center",
              }}
            >
              <span style={{ fontSize: "1rem" }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
              {sidebarOpen && item.id === "actions" && pendingActions > 0 && (
                <span style={{ marginLeft: "auto", background: "#EF4444", color: "white", fontSize: "0.65rem", padding: "0.1rem 0.4rem", borderRadius: 10, fontWeight: 700 }}>{pendingActions}</span>
              )}
            </button>
          ))}
        </nav>
        {sidebarOpen && (
          <div style={{ padding: "1rem", borderTop: `1px solid ${C.border}` }}>
            <button onClick={onChangePassword} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.silver, cursor: "pointer", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
              Change Password
            </button>
            <button onClick={onLogout} style={{ width: "100%", padding: "0.5rem", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer", fontSize: "0.75rem" }}>
              Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto", maxHeight: "100vh" }}>
        {activeSection === "overview" && <OverviewSection project={project} stats={stats} kpis={kpis} phases={phases} overallCompletion={overallCompletion} projectStatus={projectStatus} daysRemaining={daysRemaining} currentPhase={currentPhase} recovery={recovery} pendingActions={pendingActions} risks={risks} />}
        {activeSection === "progress" && <ProgressSection phases={phases} />}
        {activeSection === "assets" && <AssetsSection data={data} />}
        {activeSection === "recovery" && <RecoverySection recovery={recovery} />}
        {activeSection === "risks" && <RisksSection risks={risks} />}
        {activeSection === "locations" && <LocationsSection locationBreakdown={locationBreakdown} departmentBreakdown={departmentBreakdown} stats={stats} />}
        {activeSection === "actions" && <ActionsSection actionItems={actionItems} accessToken={accessToken} onRespond={onRespondToAction} />}
        {activeSection === "reports" && <ReportsSection reports={reports} />}
        {activeSection === "meetings" && <MeetingsSection meetings={meetings} />}
        {activeSection === "billing" && <BillingSection billing={billing} />}
        {activeSection === "settings" && <SettingsSection onChangePassword={onChangePassword} />}
      </main>
      </div>
    </div>
  );
}

// ─── SECTION: Executive Overview ──────────────────────────────────────────────
function OverviewSection({ project, stats, kpis, phases, overallCompletion, projectStatus, daysRemaining, currentPhase, recovery, pendingActions, risks }: any) {
  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Project Banner */}
      <div style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem 2rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.text, margin: "0 0 0.25rem" }}>
              {project.clientName || project.name}
            </h1>
            <p style={{ color: C.textMuted, fontSize: "0.85rem", margin: "0 0 0.5rem" }}>
              {project.name} — {project.industry || "Asset Governance Engagement"}
            </p>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              <span style={{ color: C.silver, fontSize: "0.8rem" }}>Phase: <strong style={{ color: C.gold }}>{currentPhase?.phaseName || "Discovery"}</strong></span>
              <span style={{ color: C.silver, fontSize: "0.8rem" }}>PM: <strong>{project.projectManager || "LAI Team"}</strong></span>
              {daysRemaining !== null && <span style={{ color: C.silver, fontSize: "0.8rem" }}>Days Remaining: <strong style={{ color: daysRemaining < 14 ? "#F59E0B" : C.text }}>{daysRemaining}</strong></span>}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <StatusBadge status={projectStatus} />
            <div style={{ textAlign: "center" }}>
              <p style={{ color: C.gold, fontSize: "1.5rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", margin: 0 }}>{overallCompletion}%</p>
              <p style={{ color: C.textMuted, fontSize: "0.65rem", margin: 0 }}>COMPLETE</p>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <ProgressBar percent={overallCompletion} />
        </div>
        <div style={{ display: "flex", gap: "2rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
          {project.startDate && <span style={{ color: C.textMuted, fontSize: "0.75rem" }}>Started: {new Date(project.startDate).toLocaleDateString()}</span>}
          {project.endDate && <span style={{ color: C.textMuted, fontSize: "0.75rem" }}>Target: {new Date(project.endDate).toLocaleDateString()}</span>}
          <span style={{ color: C.textMuted, fontSize: "0.75rem" }}>Last Updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <MetricCard label="Total Assets" value={stats.totalAssets.toLocaleString()} color={C.gold} />
        <MetricCard label="Verified" value={kpis?.assetsPhysicallyVerified?.toLocaleString() || stats.activeAssets.toLocaleString()} color="#10B981" />
        <MetricCard label="Remaining" value={kpis?.assetsRemaining?.toLocaleString() || "—"} color="#F59E0B" />
        <MetricCard label="Not Found" value={kpis?.assetsNotFound?.toLocaleString() || "0"} color="#EF4444" />
        <MetricCard label="Recovery Identified" value={`$${recovery.totalRecovery.toLocaleString()}`} sub={kpis?.financialStatus?.replace(/_/g, " ") || ""} color="#10B981" />
        <MetricCard label="Pending Actions" value={pendingActions.toString()} color={pendingActions > 0 ? "#EF4444" : "#10B981"} />
      </div>

      {/* Phase Summary */}
      {phases.length > 0 && (
        <Card title="Phase Progress">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
            {phases.map((phase: any) => (
              <div key={phase.id} style={{ padding: "1rem", background: C.slate, borderRadius: 8, border: `1px solid ${phase.status === "in_progress" ? C.gold + "40" : C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ color: C.text, fontSize: "0.8rem", fontWeight: 600 }}>Phase {phase.phaseNumber}</span>
                  <StatusBadge status={phase.status} />
                </div>
                <p style={{ color: C.silver, fontSize: "0.75rem", margin: "0 0 0.5rem" }}>{phase.phaseName}</p>
                <ProgressBar percent={phase.completionPercent} color={phase.status === "completed" ? "#10B981" : C.gold} height={6} />
                <p style={{ color: C.textMuted, fontSize: "0.7rem", margin: "0.3rem 0 0", textAlign: "right" }}>{phase.completionPercent}%</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>
        <Card title="Financial Recovery Summary">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: C.silver, fontSize: "0.8rem" }}>Total Identified</span>
              <span style={{ color: C.gold, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", fontWeight: 600 }}>${recovery.totalRecovery.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: C.silver, fontSize: "0.8rem" }}>Realized</span>
              <span style={{ color: "#10B981", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", fontWeight: 600 }}>${recovery.realizedRecovery.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: C.silver, fontSize: "0.8rem" }}>Pending</span>
              <span style={{ color: "#F59E0B", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", fontWeight: 600 }}>${recovery.pendingRecovery.toLocaleString()}</span>
            </div>
            {stats.totalValue > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${C.border}`, paddingTop: "0.5rem", marginTop: "0.25rem" }}>
                <span style={{ color: C.silver, fontSize: "0.8rem" }}>Estimated ROI</span>
                <span style={{ color: C.gold, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", fontWeight: 600 }}>
                  {stats.totalValue > 0 ? `${((recovery.totalRecovery / stats.totalValue) * 100).toFixed(1)}%` : "—"}
                </span>
              </div>
            )}
          </div>
        </Card>

        <Card title="Open Risks" subtitle={`${risks?.filter((r: any) => r.status === "open").length || 0} open exceptions`}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {(risks || []).filter((r: any) => r.status === "open").slice(0, 4).map((risk: any) => (
              <div key={risk.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: C.silver, fontSize: "0.8rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>{risk.description || risk.riskType.replace(/_/g, " ")}</span>
                <StatusBadge status={risk.riskLevel} />
              </div>
            ))}
            {(!risks || risks.filter((r: any) => r.status === "open").length === 0) && (
              <p style={{ color: C.textMuted, fontSize: "0.8rem", textAlign: "center" }}>No open risks</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── SECTION: Project Progress ────────────────────────────────────────────────
function ProgressSection({ phases }: { phases: any[] }) {
  return (
    <div style={{ maxWidth: 1000 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, marginBottom: "1.5rem" }}>Project Phase Tracker</h2>
      {phases.length === 0 ? (
        <Card><p style={{ color: C.textMuted, textAlign: "center" }}>Phase information will be available once your engagement begins.</p></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {phases.map((phase: any) => (
            <Card key={phase.id} title={`Phase ${phase.phaseNumber}: ${phase.phaseName}`} subtitle={phase.status === "in_progress" ? "Currently Active" : undefined}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <StatusBadge status={phase.status} />
                    <span style={{ color: C.gold, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{phase.completionPercent}%</span>
                  </div>
                  <ProgressBar percent={phase.completionPercent} color={phase.status === "completed" ? "#10B981" : C.gold} />
                  <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {phase.startDate && <span style={{ color: C.textMuted, fontSize: "0.75rem" }}>Start: {new Date(phase.startDate).toLocaleDateString()}</span>}
                    {phase.targetEndDate && <span style={{ color: C.textMuted, fontSize: "0.75rem" }}>Target: {new Date(phase.targetEndDate).toLocaleDateString()}</span>}
                    {phase.actualEndDate && <span style={{ color: "#10B981", fontSize: "0.75rem" }}>Completed: {new Date(phase.actualEndDate).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div>
                  {phase.activities && phase.activities.length > 0 && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <p style={{ color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.4rem" }}>Activities:</p>
                      {(phase.activities as string[]).map((a: string, i: number) => (
                        <p key={i} style={{ color: C.textMuted, fontSize: "0.75rem", margin: "0.2rem 0", paddingLeft: "0.75rem", borderLeft: `2px solid ${C.gold}30` }}>{a}</p>
                      ))}
                    </div>
                  )}
                  {phase.milestones && (phase.milestones as any[]).length > 0 && (
                    <div>
                      <p style={{ color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.4rem" }}>Milestones:</p>
                      {(phase.milestones as any[]).map((m: any, i: number) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                          <span style={{ color: C.textMuted, fontSize: "0.75rem" }}>{m.name}</span>
                          <StatusBadge status={m.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SECTION: Assets ──────────────────────────────────────────────────────────
function AssetsSection({ data }: { data: any }) {
  const [filter, setFilter] = useState<string>("all");
  const statusBreakdown = data.statusBreakdown || [];
  const conditionBreakdown = data.conditionBreakdown || [];
  const recentAssets = data.recentAssets || [];

  const statusColors: Record<string, string> = {
    active: "#10B981", inactive: "#6B7280", disposed: "#EF4444", in_repair: "#F59E0B",
    lost: "#DC2626", transferred: "#8B5CF6", dam_op: "#F97316", dam_inop: "#DC2626",
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, marginBottom: "1.5rem" }}>Asset Verification Summary</h2>

      {/* Status Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {statusBreakdown.map((s: any) => (
          <div key={s.status} style={{ background: C.navy, borderRadius: 8, border: `1px solid ${C.border}`, padding: "0.75rem 1rem", cursor: "pointer", borderColor: filter === s.status ? C.gold : C.border }} onClick={() => setFilter(filter === s.status ? "all" : s.status)}>
            <p style={{ color: statusColors[s.status] || C.textMuted, fontSize: "1.2rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", margin: 0 }}>{s.count}</p>
            <p style={{ color: C.silver, fontSize: "0.7rem", textTransform: "capitalize", margin: "0.2rem 0 0" }}>{s.status.replace(/_/g, " ")}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Status Breakdown */}
        <Card title="Status Distribution">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {statusBreakdown.map((s: any) => {
              const pct = data.stats.totalAssets > 0 ? (s.count / data.stats.totalAssets) * 100 : 0;
              return (
                <div key={s.status}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                    <span style={{ color: C.silver, fontSize: "0.75rem", textTransform: "capitalize" }}>{s.status.replace(/_/g, " ")}</span>
                    <span style={{ color: C.textMuted, fontSize: "0.75rem" }}>{s.count} ({pct.toFixed(0)}%)</span>
                  </div>
                  <ProgressBar percent={pct} color={statusColors[s.status] || C.gold} height={6} />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Condition Breakdown */}
        <Card title="Condition Assessment">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {conditionBreakdown.map((c: any) => {
              const pct = data.stats.totalAssets > 0 ? (c.count / data.stats.totalAssets) * 100 : 0;
              const condColors: Record<string, string> = { new: "#10B981", excellent: "#34D399", good: "#60A5FA", fair: "#FBBF24", poor: "#F97316", salvage: "#EF4444" };
              return (
                <div key={c.condition}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                    <span style={{ color: C.silver, fontSize: "0.75rem", textTransform: "capitalize" }}>{c.condition}</span>
                    <span style={{ color: C.textMuted, fontSize: "0.75rem" }}>{c.count} ({pct.toFixed(0)}%)</span>
                  </div>
                  <ProgressBar percent={pct} color={condColors[c.condition] || C.gold} height={6} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Assets Table */}
      <Card title="Recent Assets" subtitle={filter !== "all" ? `Filtered: ${filter.replace(/_/g, " ")}` : undefined}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <th style={{ padding: "0.6rem 0.75rem", textAlign: "left", color: C.textMuted, fontWeight: 600 }}>Tag</th>
                <th style={{ padding: "0.6rem 0.75rem", textAlign: "left", color: C.textMuted, fontWeight: 600 }}>Name</th>
                <th style={{ padding: "0.6rem 0.75rem", textAlign: "left", color: C.textMuted, fontWeight: 600 }}>Status</th>
                <th style={{ padding: "0.6rem 0.75rem", textAlign: "left", color: C.textMuted, fontWeight: 600 }}>Condition</th>
                <th style={{ padding: "0.6rem 0.75rem", textAlign: "left", color: C.textMuted, fontWeight: 600 }}>Location</th>
                <th style={{ padding: "0.6rem 0.75rem", textAlign: "right", color: C.textMuted, fontWeight: 600 }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {recentAssets
                .filter((a: any) => filter === "all" || a.status === filter)
                .map((asset: any) => (
                  <tr key={asset.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "0.5rem 0.75rem", color: C.gold, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem" }}>{asset.assetTag}</td>
                    <td style={{ padding: "0.5rem 0.75rem", color: C.text }}>{asset.name}</td>
                    <td style={{ padding: "0.5rem 0.75rem" }}><StatusBadge status={asset.status} /></td>
                    <td style={{ padding: "0.5rem 0.75rem", color: C.silver, textTransform: "capitalize" }}>{asset.condition}</td>
                    <td style={{ padding: "0.5rem 0.75rem", color: C.textMuted }}>{asset.location || "—"}</td>
                    <td style={{ padding: "0.5rem 0.75rem", color: C.silver, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>
                      {asset.acquisitionCost ? `$${parseFloat(asset.acquisitionCost).toLocaleString()}` : "—"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── SECTION: Financial Recovery ──────────────────────────────────────────────
function RecoverySection({ recovery }: { recovery: any }) {
  const items = recovery.items || [];
  const categoryLabels: Record<string, string> = {
    avoided_replacement: "Avoided Replacement", sale_disposal: "Sale/Disposal Proceeds",
    insurance_tax_exposure: "Insurance & Tax Exposure", maintenance_elimination: "Maintenance Elimination",
    licensing_elimination: "Licensing Elimination", idle_capital: "Idle Capital",
    redeployment: "Redeployment", disposal_recommendation: "Disposal Recommendation", other: "Other",
  };

  // Group by category
  const byCategory = items.reduce((acc: any, item: any) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = { total: 0, items: [] };
    acc[cat].total += parseFloat(item.amount || "0");
    acc[cat].items.push(item);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 1200 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, marginBottom: "1.5rem" }}>Financial Recovery Dashboard</h2>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <MetricCard label="Total Identified" value={`$${recovery.totalRecovery.toLocaleString()}`} color={C.gold} />
        <MetricCard label="Realized" value={`$${recovery.realizedRecovery.toLocaleString()}`} color="#10B981" />
        <MetricCard label="Pending Validation" value={`$${recovery.pendingRecovery.toLocaleString()}`} color="#F59E0B" />
        <MetricCard label="Opportunities" value={items.length.toString()} color={C.silver} />
      </div>

      {/* By Category */}
      <Card title="Recovery by Category">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {Object.entries(byCategory).map(([cat, data]: [string, any]) => (
            <div key={cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: `1px solid ${C.border}` }}>
              <div>
                <span style={{ color: C.silver, fontSize: "0.85rem" }}>{categoryLabels[cat] || cat}</span>
                <span style={{ color: C.textMuted, fontSize: "0.7rem", marginLeft: "0.5rem" }}>({data.items.length} items)</span>
              </div>
              <span style={{ color: C.gold, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>${data.total.toLocaleString()}</span>
            </div>
          ))}
          {Object.keys(byCategory).length === 0 && (
            <p style={{ color: C.textMuted, textAlign: "center", fontSize: "0.85rem" }}>Recovery opportunities will appear here as they are identified during the engagement.</p>
          )}
        </div>
      </Card>

      {/* Items Table */}
      {items.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <Card title="All Recovery Opportunities">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    <th style={{ padding: "0.6rem", textAlign: "left", color: C.textMuted }}>Category</th>
                    <th style={{ padding: "0.6rem", textAlign: "left", color: C.textMuted }}>Description</th>
                    <th style={{ padding: "0.6rem", textAlign: "right", color: C.textMuted }}>Amount</th>
                    <th style={{ padding: "0.6rem", textAlign: "center", color: C.textMuted }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any) => (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "0.5rem 0.6rem", color: C.silver }}>{categoryLabels[item.category] || item.category}</td>
                      <td style={{ padding: "0.5rem 0.6rem", color: C.textMuted }}>{item.description || "—"}</td>
                      <td style={{ padding: "0.5rem 0.6rem", color: C.gold, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>${parseFloat(item.amount).toLocaleString()}</td>
                      <td style={{ padding: "0.5rem 0.6rem", textAlign: "center" }}><StatusBadge status={item.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── SECTION: Risks & Exceptions ──────────────────────────────────────────────
function RisksSection({ risks }: { risks: any[] }) {
  const riskTypeLabels: Record<string, string> = {
    high_value_missing: "High-Value Missing", no_custodian: "No Custodian", uninsured: "Uninsured",
    no_documentation: "No Documentation", unauthorized_location: "Unauthorized Location",
    duplicate_purchase: "Duplicate Purchase", obsolete_equipment: "Obsolete Equipment",
    cybersecurity: "Cybersecurity", compliance: "Compliance", pending_decision: "Pending Decision", other: "Other",
  };

  const riskLevelColors: Record<string, string> = { critical: "#EF4444", high: "#F97316", medium: "#F59E0B", low: "#10B981" };

  const openRisks = risks.filter(r => r.status === "open" || r.status === "in_progress");
  const resolvedRisks = risks.filter(r => r.status === "resolved" || r.status === "accepted");

  return (
    <div style={{ maxWidth: 1200 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, marginBottom: "1.5rem" }}>Risk & Exception Management</h2>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <MetricCard label="Critical" value={risks.filter(r => r.riskLevel === "critical" && r.status === "open").length.toString()} color="#EF4444" />
        <MetricCard label="High" value={risks.filter(r => r.riskLevel === "high" && r.status === "open").length.toString()} color="#F97316" />
        <MetricCard label="Medium" value={risks.filter(r => r.riskLevel === "medium" && r.status === "open").length.toString()} color="#F59E0B" />
        <MetricCard label="Resolved" value={resolvedRisks.length.toString()} color="#10B981" />
      </div>

      {/* Open Risks */}
      <Card title={`Open Exceptions (${openRisks.length})`}>
        {openRisks.length === 0 ? (
          <p style={{ color: C.textMuted, textAlign: "center", fontSize: "0.85rem" }}>No open risk exceptions at this time.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {openRisks.map((risk) => (
              <div key={risk.id} style={{ padding: "1rem", background: C.slate, borderRadius: 8, borderLeft: `3px solid ${riskLevelColors[risk.riskLevel] || C.gold}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <span style={{ color: C.text, fontSize: "0.85rem", fontWeight: 600 }}>{riskTypeLabels[risk.riskType] || risk.riskType}</span>
                  <StatusBadge status={risk.riskLevel} />
                </div>
                {risk.description && <p style={{ color: C.textMuted, fontSize: "0.8rem", margin: "0.3rem 0" }}>{risk.description}</p>}
                <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                  {risk.location && <span style={{ color: C.textMuted, fontSize: "0.7rem" }}>Location: {risk.location}</span>}
                  {risk.financialExposure && <span style={{ color: "#F59E0B", fontSize: "0.7rem" }}>Exposure: ${parseFloat(risk.financialExposure).toLocaleString()}</span>}
                  {risk.dueDate && <span style={{ color: C.textMuted, fontSize: "0.7rem" }}>Due: {new Date(risk.dueDate).toLocaleDateString()}</span>}
                </div>
                {risk.recommendedAction && <p style={{ color: C.silver, fontSize: "0.75rem", margin: "0.5rem 0 0", fontStyle: "italic" }}>Recommended: {risk.recommendedAction}</p>}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── SECTION: Locations ───────────────────────────────────────────────────────
function LocationsSection({ locationBreakdown, departmentBreakdown, stats }: { locationBreakdown: any[]; departmentBreakdown: any[]; stats: any }) {
  return (
    <div style={{ maxWidth: 1200 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, marginBottom: "1.5rem" }}>Locations & Departments</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <Card title="By Location" subtitle={`${locationBreakdown.filter(l => l.location).length} locations`}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {locationBreakdown.filter(l => l.location).map((loc: any, i: number) => {
              const pct = stats.totalAssets > 0 ? (loc.count / stats.totalAssets) * 100 : 0;
              return (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                    <span style={{ color: C.silver, fontSize: "0.8rem" }}>{loc.location}</span>
                    <span style={{ color: C.textMuted, fontSize: "0.75rem" }}>{loc.count} assets</span>
                  </div>
                  <ProgressBar percent={pct} color={C.gold} height={5} />
                </div>
              );
            })}
            {locationBreakdown.filter(l => l.location).length === 0 && (
              <p style={{ color: C.textMuted, textAlign: "center", fontSize: "0.85rem" }}>Location data will populate as assets are verified.</p>
            )}
          </div>
        </Card>

        <Card title="By Department" subtitle={`${departmentBreakdown.filter(d => d.department).length} departments`}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {departmentBreakdown.filter(d => d.department).map((dept: any, i: number) => {
              const pct = stats.totalAssets > 0 ? (dept.count / stats.totalAssets) * 100 : 0;
              return (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                    <span style={{ color: C.silver, fontSize: "0.8rem" }}>{dept.department}</span>
                    <span style={{ color: C.textMuted, fontSize: "0.75rem" }}>{dept.count} assets</span>
                  </div>
                  <ProgressBar percent={pct} color="#8B5CF6" height={5} />
                </div>
              );
            })}
            {departmentBreakdown.filter(d => d.department).length === 0 && (
              <p style={{ color: C.textMuted, textAlign: "center", fontSize: "0.85rem" }}>Department data will populate as assets are verified.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── SECTION: Action Center ───────────────────────────────────────────────────
function ActionsSection({ actionItems, accessToken, onRespond }: { actionItems: any[]; accessToken: string; onRespond?: (id: number, response: string, status: string) => void }) {
  const [respondingTo, setRespondingTo] = useState<number | null>(null);
  const [responseText, setResponseText] = useState("");

  const pending = actionItems.filter(a => a.status === "pending" || a.status === "overdue");
  const completed = actionItems.filter(a => a.status === "completed" || a.status === "approved" || a.status === "rejected");

  const priorityColors: Record<string, string> = { urgent: "#EF4444", high: "#F97316", normal: "#F59E0B", low: "#10B981" };

  const actionTypeLabels: Record<string, string> = {
    document_approval: "Document Approval", question: "Question", asset_clarification: "Asset Clarification",
    milestone_acceptance: "Milestone Acceptance", change_order: "Change Order", meeting_confirmation: "Meeting Confirmation",
    corrective_action: "Corrective Action", upload_document: "Upload Document", other: "Other",
  };

  const handleRespond = (actionId: number, status: string) => {
    if (onRespond) {
      onRespond(actionId, responseText, status);
      setRespondingTo(null);
      setResponseText("");
    }
  };

  return (
    <div style={{ maxWidth: 1000 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, marginBottom: "1.5rem" }}>Tasks & Approvals</h2>

      {/* Pending Actions */}
      <Card title={`Awaiting Your Action (${pending.length})`} subtitle="Items requiring your review or response">
        {pending.length === 0 ? (
          <p style={{ color: C.textMuted, textAlign: "center", fontSize: "0.85rem", padding: "1rem 0" }}>No pending actions at this time.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {pending.map((action) => (
              <div key={action.id} style={{ padding: "1rem", background: C.slate, borderRadius: 8, borderLeft: `3px solid ${priorityColors[action.priority] || C.gold}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: C.text, fontSize: "0.85rem", fontWeight: 600 }}>{action.title}</span>
                    <StatusBadge status={action.priority} />
                  </div>
                  <span style={{ color: C.textMuted, fontSize: "0.7rem" }}>{actionTypeLabels[action.actionType] || action.actionType}</span>
                </div>
                {action.description && <p style={{ color: C.textMuted, fontSize: "0.8rem", margin: "0.3rem 0" }}>{action.description}</p>}
                {action.dueDate && (
                  <p style={{ color: new Date(action.dueDate) < new Date() ? "#EF4444" : C.textMuted, fontSize: "0.7rem", margin: "0.3rem 0" }}>
                    Due: {new Date(action.dueDate).toLocaleDateString()}
                    {new Date(action.dueDate) < new Date() && " (OVERDUE)"}
                  </p>
                )}

                {respondingTo === action.id ? (
                  <div style={{ marginTop: "0.75rem" }}>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Enter your response..."
                      style={{ width: "100%", padding: "0.6rem", background: C.navy, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.8rem", minHeight: 60, resize: "vertical", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                      <button onClick={() => handleRespond(action.id, "approved")} style={{ padding: "0.4rem 0.75rem", background: "#10B981", border: "none", borderRadius: 4, color: "white", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>Approve</button>
                      <button onClick={() => handleRespond(action.id, "rejected")} style={{ padding: "0.4rem 0.75rem", background: "#EF4444", border: "none", borderRadius: 4, color: "white", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>Reject</button>
                      <button onClick={() => handleRespond(action.id, "completed")} style={{ padding: "0.4rem 0.75rem", background: C.gold, border: "none", borderRadius: 4, color: C.charcoal, fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>Mark Complete</button>
                      <button onClick={() => { setRespondingTo(null); setResponseText(""); }} style={{ padding: "0.4rem 0.75rem", background: C.navy, border: `1px solid ${C.border}`, borderRadius: 4, color: C.silver, fontSize: "0.75rem", cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                    <button onClick={() => setRespondingTo(action.id)} style={{ padding: "0.35rem 0.7rem", background: C.gold, border: "none", borderRadius: 4, color: C.charcoal, fontSize: "0.7rem", fontWeight: 600, cursor: "pointer" }}>Respond</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Completed Actions */}
      {completed.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <Card title={`Completed (${completed.length})`}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {completed.slice(0, 10).map((action) => (
                <div key={action.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.textMuted, fontSize: "0.8rem" }}>{action.title}</span>
                  <StatusBadge status={action.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── SECTION: Reports & Documents ─────────────────────────────────────────────
function ReportsSection({ reports }: { reports: any[] }) {
  const reportTypeLabels: Record<string, string> = {
    executive_assessment: "Executive Assessment", verification_analysis: "Verification & Recovery Analysis",
    reconciled_far: "Reconciled Fixed Asset Register", discrepancy_matrix: "FAR Discrepancy Matrix",
    inventory_master_log: "Inventory Master Log", recovery_register: "Recovery Opportunity Register",
    governance_scorecard: "Governance Scorecard", risk_exception_report: "Risk & Exception Report",
    location_report: "Location Completion Report", asset_photographs: "Asset Photographs",
    meeting_summary: "Meeting Summary", final_presentation: "Final Presentation",
    technology_plan: "Technology Implementation Plan", quarterly_report: "Quarterly Governance Report", other: "Other",
  };

  return (
    <div style={{ maxWidth: 1000 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, marginBottom: "1.5rem" }}>Reports & Deliverables</h2>

      <Card>
        {reports.length === 0 ? (
          <p style={{ color: C.textMuted, textAlign: "center", fontSize: "0.85rem", padding: "2rem 0" }}>Reports and deliverables will be published here as they become available during the engagement.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <th style={{ padding: "0.6rem", textAlign: "left", color: C.textMuted }}>Document</th>
                  <th style={{ padding: "0.6rem", textAlign: "left", color: C.textMuted }}>Type</th>
                  <th style={{ padding: "0.6rem", textAlign: "center", color: C.textMuted }}>Version</th>
                  <th style={{ padding: "0.6rem", textAlign: "center", color: C.textMuted }}>Status</th>
                  <th style={{ padding: "0.6rem", textAlign: "left", color: C.textMuted }}>Date</th>
                  <th style={{ padding: "0.6rem", textAlign: "center", color: C.textMuted }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "0.5rem 0.6rem", color: C.text, fontWeight: 500 }}>{report.title}</td>
                    <td style={{ padding: "0.5rem 0.6rem", color: C.textMuted }}>{reportTypeLabels[report.reportType] || report.reportType}</td>
                    <td style={{ padding: "0.5rem 0.6rem", color: C.silver, textAlign: "center" }}>{report.version || "1.0"}</td>
                    <td style={{ padding: "0.5rem 0.6rem", textAlign: "center" }}><StatusBadge status={report.status} /></td>
                    <td style={{ padding: "0.5rem 0.6rem", color: C.textMuted }}>{report.publishedAt ? new Date(report.publishedAt).toLocaleDateString() : new Date(report.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: "0.5rem 0.6rem", textAlign: "center" }}>
                      {report.storageUrl ? (
                        <a href={report.storageUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.gold, fontSize: "0.75rem", textDecoration: "none" }}>Download</a>
                      ) : (
                        <span style={{ color: C.textMuted, fontSize: "0.75rem" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── SECTION: Meetings & Communications ───────────────────────────────────────
function MeetingsSection({ meetings }: { meetings: any[] }) {
  const upcoming = meetings.filter(m => m.status === "scheduled" && m.scheduledDate && new Date(m.scheduledDate) >= new Date());
  const past = meetings.filter(m => m.status === "completed");

  return (
    <div style={{ maxWidth: 1000 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, marginBottom: "1.5rem" }}>Meetings & Communications</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Upcoming */}
        <Card title="Upcoming Meetings">
          {upcoming.length === 0 ? (
            <p style={{ color: C.textMuted, textAlign: "center", fontSize: "0.85rem" }}>No upcoming meetings scheduled.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {upcoming.map((meeting) => (
                <div key={meeting.id} style={{ padding: "0.75rem", background: C.slate, borderRadius: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: C.text, fontSize: "0.85rem", fontWeight: 600 }}>{meeting.title}</span>
                    <StatusBadge status={meeting.meetingType} />
                  </div>
                  {meeting.scheduledDate && <p style={{ color: C.gold, fontSize: "0.75rem", margin: "0.3rem 0 0" }}>{new Date(meeting.scheduledDate).toLocaleString()}</p>}
                  {meeting.location && <p style={{ color: C.textMuted, fontSize: "0.7rem", margin: "0.2rem 0 0" }}>{meeting.location}</p>}
                  {meeting.agenda && <p style={{ color: C.textMuted, fontSize: "0.75rem", margin: "0.4rem 0 0", borderTop: `1px solid ${C.border}`, paddingTop: "0.4rem" }}>{meeting.agenda}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Past Meetings */}
        <Card title="Recent Meeting Summaries">
          {past.length === 0 ? (
            <p style={{ color: C.textMuted, textAlign: "center", fontSize: "0.85rem" }}>Meeting summaries will appear here after meetings are completed.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {past.slice(0, 5).map((meeting) => (
                <div key={meeting.id} style={{ padding: "0.75rem", background: C.slate, borderRadius: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: C.text, fontSize: "0.85rem", fontWeight: 600 }}>{meeting.title}</span>
                    <span style={{ color: C.textMuted, fontSize: "0.7rem" }}>{meeting.scheduledDate ? new Date(meeting.scheduledDate).toLocaleDateString() : ""}</span>
                  </div>
                  {meeting.summary && <p style={{ color: C.textMuted, fontSize: "0.8rem", margin: "0.4rem 0 0" }}>{meeting.summary}</p>}
                  {meeting.decisions && (meeting.decisions as string[]).length > 0 && (
                    <div style={{ marginTop: "0.4rem" }}>
                      <p style={{ color: C.silver, fontSize: "0.7rem", fontWeight: 600 }}>Decisions:</p>
                      {(meeting.decisions as string[]).map((d: string, i: number) => (
                        <p key={i} style={{ color: C.textMuted, fontSize: "0.7rem", margin: "0.1rem 0", paddingLeft: "0.5rem" }}>• {d}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* LAI Contact */}
      <div style={{ marginTop: "1.5rem" }}>
        <Card title="LAI Contact Information">
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <div>
              <p style={{ color: C.silver, fontSize: "0.8rem", fontWeight: 600 }}>Legacy Asset Intelligence</p>
              <p style={{ color: C.textMuted, fontSize: "0.8rem" }}>info@legacyassetintelligence.com</p>
            </div>
            <div>
              <p style={{ color: C.silver, fontSize: "0.8rem", fontWeight: 600 }}>Support</p>
              <p style={{ color: C.textMuted, fontSize: "0.8rem" }}>For urgent matters, contact your assigned project manager directly.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── SECTION: Billing ─────────────────────────────────────────────────────────
function BillingSection({ billing }: { billing: any[] }) {
  const invoices = billing.filter(b => b.itemType === "invoice");
  const payments = billing.filter(b => b.itemType === "payment");
  const totalInvoiced = invoices.reduce((sum, b) => sum + parseFloat(b.amount || "0"), 0);
  const totalPaid = payments.reduce((sum, b) => sum + parseFloat(b.amount || "0"), 0);
  const outstanding = totalInvoiced - totalPaid;

  return (
    <div style={{ maxWidth: 1000 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, marginBottom: "1.5rem" }}>Billing & Engagement</h2>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <MetricCard label="Total Invoiced" value={`$${totalInvoiced.toLocaleString()}`} color={C.silver} />
        <MetricCard label="Amount Paid" value={`$${totalPaid.toLocaleString()}`} color="#10B981" />
        <MetricCard label="Outstanding" value={`$${outstanding.toLocaleString()}`} color={outstanding > 0 ? "#F59E0B" : "#10B981"} />
      </div>

      <Card title="Billing History">
        {billing.length === 0 ? (
          <p style={{ color: C.textMuted, textAlign: "center", fontSize: "0.85rem", padding: "2rem 0" }}>Billing information will appear here once invoices are generated.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <th style={{ padding: "0.6rem", textAlign: "left", color: C.textMuted }}>Type</th>
                  <th style={{ padding: "0.6rem", textAlign: "left", color: C.textMuted }}>Description</th>
                  <th style={{ padding: "0.6rem", textAlign: "left", color: C.textMuted }}>Invoice #</th>
                  <th style={{ padding: "0.6rem", textAlign: "right", color: C.textMuted }}>Amount</th>
                  <th style={{ padding: "0.6rem", textAlign: "center", color: C.textMuted }}>Status</th>
                  <th style={{ padding: "0.6rem", textAlign: "left", color: C.textMuted }}>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {billing.map((item) => (
                  <tr key={item.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "0.5rem 0.6rem", color: C.silver, textTransform: "capitalize" }}>{item.itemType.replace(/_/g, " ")}</td>
                    <td style={{ padding: "0.5rem 0.6rem", color: C.text }}>{item.description}</td>
                    <td style={{ padding: "0.5rem 0.6rem", color: C.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{item.invoiceNumber || "—"}</td>
                    <td style={{ padding: "0.5rem 0.6rem", color: C.gold, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>${parseFloat(item.amount).toLocaleString()}</td>
                    <td style={{ padding: "0.5rem 0.6rem", textAlign: "center" }}><StatusBadge status={item.status} /></td>
                    <td style={{ padding: "0.5rem 0.6rem", color: C.textMuted }}>{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── SECTION: Settings ────────────────────────────────────────────────────────
function SettingsSection({ onChangePassword }: { onChangePassword: () => void }) {
  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, marginBottom: "1.5rem" }}>Settings</h2>
      <Card title="Account Security">
        <p style={{ color: C.textMuted, fontSize: "0.85rem", marginBottom: "1rem" }}>
          Manage your portal access credentials. For additional user accounts or permission changes, please contact your LAI project manager.
        </p>
        <button onClick={onChangePassword} style={{ padding: "0.6rem 1.25rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
          Change Password
        </button>
      </Card>
    </div>
  );
}
