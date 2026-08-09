import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { COLORS } from "@shared/colors";

const C = COLORS;

type Tab = "setup" | "verification" | "milestones" | "recovery" | "risks" | "locations" | "tasks" | "reports" | "meetings" | "access" | "audit";

const TABS: { key: Tab; label: string }[] = [
  { key: "setup", label: "Project Setup & FAR" },
  { key: "verification", label: "Verification Metrics" },
  { key: "milestones", label: "Phase 2 Milestones" },
  { key: "recovery", label: "Recovery Opportunities" },
  { key: "risks", label: "Risks & Exceptions" },
  { key: "locations", label: "Locations & Depts" },
  { key: "tasks", label: "Tasks & Approvals" },
  { key: "reports", label: "Reports & Docs" },
  { key: "meetings", label: "Meetings & Messages" },
  { key: "access", label: "Portal Access" },
  { key: "audit", label: "Audit History" },
];

// Shared styles
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.75rem", color: C.silver, marginBottom: "0.3rem", fontWeight: 500 };
const btnStyle: React.CSSProperties = { padding: "0.5rem 1rem", background: C.gold, color: "#0B0F13", border: "none", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" };
const cardStyle: React.CSSProperties = { background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.25rem", marginBottom: "1rem" };

export default function ClientDashboardManagement({ projectId, projectName }: { projectId: number; projectName: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("setup");

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.text, margin: "0 0 0.25rem" }}>
          Client Dashboard Management
        </h2>
        <p style={{ color: C.textMuted, fontSize: "0.85rem", margin: 0 }}>
          Project Manager Control Center for <strong>{projectName}</strong>
        </p>
        <p style={{ color: C.gold, fontSize: "0.75rem", margin: "0.25rem 0 0", fontWeight: 600 }}>
          Phase 2 – Verification & Reconciliation
        </p>
      </div>

      {/* Tab Navigation */}
      <nav style={{ display: "flex", gap: "0.25rem", overflowX: "auto", marginBottom: "1.5rem", borderBottom: `1px solid ${C.border}`, paddingBottom: "0.5rem" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "0.5rem 0.85rem",
              background: activeTab === tab.key ? `${C.gold}20` : "transparent",
              border: activeTab === tab.key ? `1px solid ${C.gold}` : `1px solid transparent`,
              borderRadius: 6,
              color: activeTab === tab.key ? C.gold : C.silver,
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: activeTab === tab.key ? 600 : 400,
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      {activeTab === "setup" && <SetupPanel projectId={projectId} />}
      {activeTab === "verification" && <VerificationPanel projectId={projectId} />}
      {activeTab === "milestones" && <MilestonesPanel projectId={projectId} />}
      {activeTab === "recovery" && <RecoveryPanel projectId={projectId} />}
      {activeTab === "risks" && <RisksPanel projectId={projectId} />}
      {activeTab === "locations" && <LocationsPanel projectId={projectId} />}
      {activeTab === "tasks" && <TasksPanel projectId={projectId} />}
      {activeTab === "reports" && <ReportsPanel projectId={projectId} />}
      {activeTab === "meetings" && <MeetingsPanel projectId={projectId} />}
      {activeTab === "access" && <AccessPanel projectId={projectId} projectName={projectName} />}
      {activeTab === "audit" && <AuditPanel projectId={projectId} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. PROJECT SETUP & FAR BASELINE
// ═══════════════════════════════════════════════════════════════════════════════
function SetupPanel({ projectId }: { projectId: number }) {
  const { data: metrics, refetch } = trpc.clientPortal.getVerificationMetrics.useQuery({ projectId });
  const upsertMetrics = trpc.clientPortal.upsertVerificationMetrics.useMutation({ onSuccess: () => refetch() });
  const createVersion = trpc.clientPortal.createFarBaselineVersion.useMutation({ onSuccess: () => { refetch(); refetchVersions(); } });
  const { data: versions, refetch: refetchVersions } = trpc.clientPortal.listFarBaselineVersions.useQuery({ projectId });

  const [form, setForm] = useState<any>({});
  const [baselineChange, setBaselineChange] = useState({ newCount: "", newValue: "", reason: "" });
  const [showBaselineChange, setShowBaselineChange] = useState(false);

  // Initialize form from metrics
  useState(() => {
    if (metrics) {
      setForm({
        phase2Status: metrics.phase2Status || "not_started",
        phase2StartDate: metrics.phase2StartDate ? new Date(metrics.phase2StartDate).toISOString().split("T")[0] : "",
        phase2TargetDate: metrics.phase2TargetDate ? new Date(metrics.phase2TargetDate).toISOString().split("T")[0] : "",
        phase2CostBasis: metrics.phase2CostBasis || "",
        farBaselineCount: metrics.farBaselineCount || 0,
        farBaselineValue: metrics.farBaselineValue || "",
        clientFacingSummary: metrics.clientFacingSummary || "",
        internalNotes: metrics.internalNotes || "",
        lastUpdateNotes: metrics.lastUpdateNotes || "",
      });
    }
  });

  const handleSave = () => {
    upsertMetrics.mutate({
      projectId,
      phase2Status: form.phase2Status,
      phase2StartDate: form.phase2StartDate || undefined,
      phase2TargetDate: form.phase2TargetDate || undefined,
      phase2CostBasis: form.phase2CostBasis || undefined,
      farBaselineCount: parseInt(form.farBaselineCount) || 0,
      farBaselineValue: form.farBaselineValue || undefined,
      clientFacingSummary: form.clientFacingSummary || undefined,
      internalNotes: form.internalNotes || undefined,
      lastUpdateNotes: form.lastUpdateNotes || undefined,
    });
  };

  const handleBaselineChange = () => {
    const prevCount = metrics?.farBaselineCount || 0;
    const prevValue = metrics?.farBaselineValue || "0";
    createVersion.mutate({
      projectId,
      previousCount: prevCount,
      newCount: parseInt(baselineChange.newCount) || 0,
      previousValue: prevValue,
      newValue: baselineChange.newValue || undefined,
      reason: baselineChange.reason,
    });
    // Also update the metrics
    upsertMetrics.mutate({
      projectId,
      farBaselineCount: parseInt(baselineChange.newCount) || 0,
      farBaselineValue: baselineChange.newValue || undefined,
    });
    setShowBaselineChange(false);
    setBaselineChange({ newCount: "", newValue: "", reason: "" });
  };

  return (
    <div>
      <h3 style={{ color: C.text, fontSize: "1rem", marginBottom: "1rem" }}>Project Setup & FAR Baseline</h3>
      <p style={{ color: C.gold, fontSize: "0.8rem", fontWeight: 600, marginBottom: "1rem" }}>Phase 2 – Verification & Reconciliation</p>

      <div style={cardStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Phase 2 Status</label>
            <select style={inputStyle} value={form.phase2Status || "not_started"} onChange={e => setForm({ ...form, phase2Status: e.target.value })}>
              <option value="not_started">Not Started</option>
              <option value="on_track">On Track</option>
              <option value="at_risk">At Risk</option>
              <option value="delayed">Delayed</option>
              <option value="complete">Complete</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Phase 2 Cost Basis ($)</label>
            <input style={inputStyle} type="text" value={form.phase2CostBasis || ""} onChange={e => setForm({ ...form, phase2CostBasis: e.target.value })} placeholder="0.00" />
          </div>
          <div>
            <label style={labelStyle}>Start Date</label>
            <input style={inputStyle} type="date" value={form.phase2StartDate || ""} onChange={e => setForm({ ...form, phase2StartDate: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Target Completion Date</label>
            <input style={inputStyle} type="date" value={form.phase2TargetDate || ""} onChange={e => setForm({ ...form, phase2TargetDate: e.target.value })} />
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h4 style={{ color: C.silver, fontSize: "0.85rem", marginBottom: "0.75rem" }}>Approved FAR Baseline</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
          <div>
            <label style={labelStyle}>FAR Baseline Count</label>
            <input style={inputStyle} type="number" value={form.farBaselineCount || ""} onChange={e => setForm({ ...form, farBaselineCount: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>FAR Baseline Value ($)</label>
            <input style={inputStyle} type="text" value={form.farBaselineValue || ""} onChange={e => setForm({ ...form, farBaselineValue: e.target.value })} placeholder="0.00" />
          </div>
          <button style={{ ...btnStyle, background: "rgba(255,255,255,0.1)", color: C.silver, fontSize: "0.75rem" }} onClick={() => setShowBaselineChange(true)}>
            Adjust Baseline
          </button>
        </div>
        {showBaselineChange && (
          <div style={{ marginTop: "1rem", padding: "1rem", background: "rgba(201,168,76,0.05)", border: `1px solid ${C.gold}40`, borderRadius: 6 }}>
            <p style={{ color: C.gold, fontSize: "0.75rem", marginBottom: "0.5rem", fontWeight: 600 }}>FAR Baseline Adjustment (creates versioned record)</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div>
                <label style={labelStyle}>New Count</label>
                <input style={inputStyle} type="number" value={baselineChange.newCount} onChange={e => setBaselineChange({ ...baselineChange, newCount: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>New Value ($)</label>
                <input style={inputStyle} type="text" value={baselineChange.newValue} onChange={e => setBaselineChange({ ...baselineChange, newValue: e.target.value })} />
              </div>
            </div>
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={labelStyle}>Reason for Change *</label>
              <textarea style={{ ...inputStyle, minHeight: 60 }} value={baselineChange.reason} onChange={e => setBaselineChange({ ...baselineChange, reason: e.target.value })} placeholder="Explain why the FAR baseline is being adjusted..." />
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button style={btnStyle} onClick={handleBaselineChange} disabled={!baselineChange.reason}>Save Adjustment</button>
              <button style={{ ...btnStyle, background: "transparent", color: C.silver, border: `1px solid ${C.border}` }} onClick={() => setShowBaselineChange(false)}>Cancel</button>
            </div>
          </div>
        )}
        {versions && versions.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <p style={{ color: C.silver, fontSize: "0.75rem", marginBottom: "0.5rem" }}>Baseline History</p>
            {versions.map((v: any) => (
              <div key={v.id} style={{ fontSize: "0.75rem", color: C.textMuted, padding: "0.3rem 0", borderBottom: `1px solid ${C.border}20` }}>
                {new Date(v.createdAt).toLocaleDateString()} — {v.previousCount} → {v.newCount} ({v.reason}) — by {v.changedByName}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Client-Facing Project Summary</label>
          <textarea style={{ ...inputStyle, minHeight: 80 }} value={form.clientFacingSummary || ""} onChange={e => setForm({ ...form, clientFacingSummary: e.target.value })} placeholder="Summary visible to the client on their dashboard..." />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Internal Notes (not visible to client)</label>
          <textarea style={{ ...inputStyle, minHeight: 60 }} value={form.internalNotes || ""} onChange={e => setForm({ ...form, internalNotes: e.target.value })} placeholder="Internal team notes..." />
        </div>
        <div>
          <label style={labelStyle}>Last Update Notes</label>
          <textarea style={{ ...inputStyle, minHeight: 60 }} value={form.lastUpdateNotes || ""} onChange={e => setForm({ ...form, lastUpdateNotes: e.target.value })} placeholder="Notes about the most recent update..." />
        </div>
      </div>

      <button style={btnStyle} onClick={handleSave} disabled={upsertMetrics.isPending}>
        {upsertMetrics.isPending ? "Saving..." : "Save Project Setup"}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. VERIFICATION & RECONCILIATION METRICS
// ═══════════════════════════════════════════════════════════════════════════════
function VerificationPanel({ projectId }: { projectId: number }) {
  const { data: metrics, refetch } = trpc.clientPortal.getVerificationMetrics.useQuery({ projectId });
  const upsertMetrics = trpc.clientPortal.upsertVerificationMetrics.useMutation({ onSuccess: () => refetch() });
  const [form, setForm] = useState<any>({});

  // Sync form from metrics
  const m = metrics || {} as any;

  // Calculations
  const farBaseline = parseInt(form.farBaselineCount ?? m.farBaselineCount) || 0;
  const verified = parseInt(form.verifiedFarAssets ?? m.verifiedFarAssets) || 0;
  const notFound = parseInt(form.notFoundAssets ?? m.notFoundAssets) || 0;
  const additional = parseInt(form.additionalAssetsFound ?? m.additionalAssetsFound) || 0;
  const remaining = Math.max(farBaseline - verified - notFound, 0);
  const totalPhysicallyVerified = verified + additional;
  const farRecordsProcessed = verified + notFound;
  const verificationCoverage = farBaseline > 0 ? ((verified + notFound + additional) / farBaseline) * 100 : 0;

  // Validation warnings
  const ghostCount = parseInt(form.ghostAssetCount ?? m.ghostAssetCount) || 0;
  const warnings: string[] = [];
  if (ghostCount > notFound) warnings.push("Ghost Asset count exceeds Not Found count — please verify classifications.");

  const handleSave = () => {
    upsertMetrics.mutate({
      projectId,
      verifiedFarAssets: verified,
      notFoundAssets: notFound,
      additionalAssetsFound: additional,
      ghostAssetCount: ghostCount,
      ghostAssetValue: form.ghostAssetValue ?? m.ghostAssetValue ?? undefined,
      zombieAssetCount: parseInt(form.zombieAssetCount ?? m.zombieAssetCount) || 0,
      zombieAssetValue: form.zombieAssetValue ?? m.zombieAssetValue ?? undefined,
      vampireAssetCount: parseInt(form.vampireAssetCount ?? m.vampireAssetCount) || 0,
      vampireAssetValue: form.vampireAssetValue ?? m.vampireAssetValue ?? undefined,
      duplicateAssetCount: parseInt(form.duplicateAssetCount ?? m.duplicateAssetCount) || 0,
      duplicateAssetValue: form.duplicateAssetValue ?? m.duplicateAssetValue ?? undefined,
      assetsInRepair: parseInt(form.assetsInRepair ?? m.assetsInRepair) || 0,
      activeAssets: parseInt(form.activeAssets ?? m.activeAssets) || 0,
      ghostNotes: form.ghostNotes ?? m.ghostNotes ?? undefined,
      zombieNotes: form.zombieNotes ?? m.zombieNotes ?? undefined,
      vampireNotes: form.vampireNotes ?? m.vampireNotes ?? undefined,
      duplicateNotes: form.duplicateNotes ?? m.duplicateNotes ?? undefined,
      generalNotes: form.generalNotes ?? m.generalNotes ?? undefined,
    });
  };

  const f = (key: string) => form[key] ?? (m as any)[key] ?? "";
  const set = (key: string, val: string) => setForm({ ...form, [key]: val });

  return (
    <div>
      <h3 style={{ color: C.text, fontSize: "1rem", marginBottom: "1rem" }}>Verification & Reconciliation Metrics</h3>

      {/* Calculated Summary */}
      <div style={{ ...cardStyle, background: "rgba(201,168,76,0.05)", border: `1px solid ${C.gold}40` }}>
        <p style={{ color: C.gold, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.75rem" }}>Calculated Values (auto-updated from inputs below)</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          <div><span style={{ color: C.textMuted, fontSize: "0.7rem", display: "block" }}>Remaining</span><span style={{ color: C.text, fontSize: "1.1rem", fontWeight: 700 }}>{remaining}</span></div>
          <div><span style={{ color: C.textMuted, fontSize: "0.7rem", display: "block" }}>Total Physically Verified</span><span style={{ color: C.text, fontSize: "1.1rem", fontWeight: 700 }}>{totalPhysicallyVerified}</span></div>
          <div><span style={{ color: C.textMuted, fontSize: "0.7rem", display: "block" }}>FAR Records Processed</span><span style={{ color: C.text, fontSize: "1.1rem", fontWeight: 700 }}>{farRecordsProcessed}</span></div>
          <div><span style={{ color: C.textMuted, fontSize: "0.7rem", display: "block" }}>Verification Coverage</span><span style={{ color: verificationCoverage > 100 ? C.gold : C.text, fontSize: "1.1rem", fontWeight: 700 }}>{farBaseline > 0 ? `${verificationCoverage.toFixed(1)}%` : "—"}</span></div>
        </div>
      </div>

      {warnings.length > 0 && (
        <div style={{ background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 6, padding: "0.75rem", marginBottom: "1rem" }}>
          {warnings.map((w, i) => <p key={i} style={{ color: "#E74C3C", fontSize: "0.8rem", margin: 0 }}>⚠️ {w}</p>)}
        </div>
      )}

      {/* Input Fields */}
      <div style={cardStyle}>
        <h4 style={{ color: C.silver, fontSize: "0.85rem", marginBottom: "0.75rem" }}>FAR Verification Counts</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>FAR-Listed Assets Verified</label>
            <input style={inputStyle} type="number" value={f("verifiedFarAssets")} onChange={e => set("verifiedFarAssets", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>FAR-Listed Assets Not Found</label>
            <input style={inputStyle} type="number" value={f("notFoundAssets")} onChange={e => set("notFoundAssets", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Additional Assets Found (Zombie)</label>
            <input style={inputStyle} type="number" value={f("additionalAssetsFound")} onChange={e => set("additionalAssetsFound", e.target.value)} />
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h4 style={{ color: C.silver, fontSize: "0.85rem", marginBottom: "0.75rem" }}>Asset Classifications</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
          {[
            { label: "Ghost Assets", countKey: "ghostAssetCount", valueKey: "ghostAssetValue", noteKey: "ghostNotes", def: "Listed on FAR but not physically located" },
            { label: "Zombie Assets", countKey: "zombieAssetCount", valueKey: "zombieAssetValue", noteKey: "zombieNotes", def: "Physically found but not on FAR" },
            { label: "Vampire Assets", countKey: "vampireAssetCount", valueKey: "vampireAssetValue", noteKey: "vampireNotes", def: "Idle/unused, still creating expenses" },
            { label: "Duplicate Assets", countKey: "duplicateAssetCount", valueKey: "duplicateAssetValue", noteKey: "duplicateNotes", def: "Same asset, multiple records" },
          ].map(cls => (
            <div key={cls.countKey}>
              <label style={labelStyle}>{cls.label}</label>
              <p style={{ color: C.textMuted, fontSize: "0.65rem", margin: "0 0 0.4rem" }}>{cls.def}</p>
              <input style={{ ...inputStyle, marginBottom: "0.4rem" }} type="number" placeholder="Count" value={f(cls.countKey)} onChange={e => set(cls.countKey, e.target.value)} />
              <input style={{ ...inputStyle, marginBottom: "0.4rem" }} type="text" placeholder="Value ($)" value={f(cls.valueKey)} onChange={e => set(cls.valueKey, e.target.value)} />
              <textarea style={{ ...inputStyle, minHeight: 40, fontSize: "0.75rem" }} placeholder="Notes/evidence" value={f(cls.noteKey)} onChange={e => set(cls.noteKey, e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <h4 style={{ color: C.silver, fontSize: "0.85rem", marginBottom: "0.75rem" }}>Additional Status</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Assets In Repair</label>
            <input style={inputStyle} type="number" value={f("assetsInRepair")} onChange={e => set("assetsInRepair", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Active Assets</label>
            <input style={inputStyle} type="number" value={f("activeAssets")} onChange={e => set("activeAssets", e.target.value)} />
          </div>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label style={labelStyle}>General Notes</label>
          <textarea style={{ ...inputStyle, minHeight: 60 }} value={f("generalNotes")} onChange={e => set("generalNotes", e.target.value)} placeholder="General verification notes..." />
        </div>
      </div>

      <button style={btnStyle} onClick={handleSave} disabled={upsertMetrics.isPending}>
        {upsertMetrics.isPending ? "Saving..." : "Save Verification Metrics"}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. PHASE 2 MILESTONES
// ═══════════════════════════════════════════════════════════════════════════════
function MilestonesPanel({ projectId }: { projectId: number }) {
  const { data: milestones, refetch } = trpc.clientPortal.listPhase2Milestones.useQuery({ projectId });
  const upsertMilestone = trpc.clientPortal.upsertPhase2Milestone.useMutation({ onSuccess: () => refetch() });
  const deleteMilestone = trpc.clientPortal.deletePhase2Milestone.useMutation({ onSuccess: () => refetch() });
  const [editing, setEditing] = useState<any>(null);

  const DEFAULT_MILESTONES = [
    { milestoneNumber: 1, milestoneName: "FAR Received and Validated" },
    { milestoneNumber: 2, milestoneName: "Field Verification" },
    { milestoneNumber: 3, milestoneName: "Reconciliation and Exception Resolution" },
    { milestoneNumber: 4, milestoneName: "Quality Assurance and Client Validation" },
    { milestoneNumber: 5, milestoneName: "Approved Reconciled FAR and Phase 2 Closeout" },
  ];

  const initMilestones = () => {
    DEFAULT_MILESTONES.forEach(m => {
      upsertMilestone.mutate({ projectId, ...m, status: "not_started", completionPercent: 0 });
    });
  };

  const handleSave = (m: any) => {
    upsertMilestone.mutate({
      id: m.id || undefined,
      projectId,
      milestoneNumber: m.milestoneNumber,
      milestoneName: m.milestoneName,
      status: m.status,
      completionPercent: parseInt(m.completionPercent) || 0,
      startDate: m.startDate || undefined,
      targetDate: m.targetDate || undefined,
      completionDate: m.completionDate || undefined,
      clientUpdate: m.clientUpdate || undefined,
      internalNote: m.internalNote || undefined,
    });
    setEditing(null);
  };

  return (
    <div>
      <h3 style={{ color: C.text, fontSize: "1rem", marginBottom: "1rem" }}>Phase 2 Milestones</h3>

      {(!milestones || milestones.length === 0) && (
        <div style={{ ...cardStyle, textAlign: "center" }}>
          <p style={{ color: C.textMuted, fontSize: "0.85rem", marginBottom: "1rem" }}>No milestones defined yet.</p>
          <button style={btnStyle} onClick={initMilestones}>Initialize Default Phase 2 Milestones</button>
        </div>
      )}

      {milestones && milestones.map((m: any) => (
        <div key={m.id} style={cardStyle}>
          {editing?.id === m.id ? (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div>
                  <label style={labelStyle}>#{m.milestoneNumber}</label>
                  <input style={inputStyle} value={editing.milestoneName} onChange={e => setEditing({ ...editing, milestoneName: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle} value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value })}>
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>% Complete</label>
                  <input style={inputStyle} type="number" min="0" max="100" value={editing.completionPercent} onChange={e => setEditing({ ...editing, completionPercent: e.target.value })} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div><label style={labelStyle}>Start Date</label><input style={inputStyle} type="date" value={editing.startDate || ""} onChange={e => setEditing({ ...editing, startDate: e.target.value })} /></div>
                <div><label style={labelStyle}>Target Date</label><input style={inputStyle} type="date" value={editing.targetDate || ""} onChange={e => setEditing({ ...editing, targetDate: e.target.value })} /></div>
                <div><label style={labelStyle}>Completion Date</label><input style={inputStyle} type="date" value={editing.completionDate || ""} onChange={e => setEditing({ ...editing, completionDate: e.target.value })} /></div>
              </div>
              <div style={{ marginBottom: "0.75rem" }}>
                <label style={labelStyle}>Client-Facing Update</label>
                <textarea style={{ ...inputStyle, minHeight: 50 }} value={editing.clientUpdate || ""} onChange={e => setEditing({ ...editing, clientUpdate: e.target.value })} />
              </div>
              <div style={{ marginBottom: "0.75rem" }}>
                <label style={labelStyle}>Internal Note</label>
                <textarea style={{ ...inputStyle, minHeight: 50 }} value={editing.internalNote || ""} onChange={e => setEditing({ ...editing, internalNote: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button style={btnStyle} onClick={() => handleSave(editing)}>Save</button>
                <button style={{ ...btnStyle, background: "transparent", color: C.silver, border: `1px solid ${C.border}` }} onClick={() => setEditing(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ color: C.gold, fontSize: "0.75rem", marginRight: "0.5rem" }}>#{m.milestoneNumber}</span>
                <span style={{ color: C.text, fontSize: "0.9rem", fontWeight: 500 }}>{m.milestoneName}</span>
                <span style={{ color: C.textMuted, fontSize: "0.75rem", marginLeft: "1rem" }}>
                  {m.status.replace("_", " ")} — {m.completionPercent}%
                </span>
                {m.clientUpdate && <p style={{ color: C.textMuted, fontSize: "0.75rem", margin: "0.25rem 0 0" }}>Client: {m.clientUpdate}</p>}
              </div>
              <button style={{ ...btnStyle, background: "transparent", color: C.silver, border: `1px solid ${C.border}`, fontSize: "0.7rem" }} onClick={() => setEditing({
                ...m,
                startDate: m.startDate ? new Date(m.startDate).toISOString().split("T")[0] : "",
                targetDate: m.targetDate ? new Date(m.targetDate).toISOString().split("T")[0] : "",
                completionDate: m.completionDate ? new Date(m.completionDate).toISOString().split("T")[0] : "",
              })}>Edit</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. RECOVERY OPPORTUNITIES
// ═══════════════════════════════════════════════════════════════════════════════
function RecoveryPanel({ projectId }: { projectId: number }) {
  const { data: items, refetch } = trpc.clientPortal.listRecoveryItems.useQuery({ projectId });
  const createItem = trpc.clientPortal.createRecoveryItem.useMutation({ onSuccess: () => { refetch(); setShowAdd(false); } });
  const updateItem = trpc.clientPortal.updateRecoveryItem.useMutation({ onSuccess: () => refetch() });
  const deleteItem = trpc.clientPortal.deleteRecoveryItem.useMutation({ onSuccess: () => refetch() });
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<any>({});

  const CATEGORIES = ["avoided_replacement", "sale_disposal", "insurance_tax_exposure", "maintenance_elimination", "licensing_elimination", "idle_capital", "redeployment", "disposal_recommendation", "other"];
  const STATUSES = ["identified", "under_review", "verified", "client_decision_required", "approved", "in_progress", "realized", "rejected", "closed"];

  // Calculations
  const totalIdentified = (items || []).filter((i: any) => !["rejected", "closed"].includes(i.status)).reduce((s: number, i: any) => s + parseFloat(i.amount || "0"), 0);
  const realized = (items || []).filter((i: any) => i.status === "realized").reduce((s: number, i: any) => s + parseFloat(i.realizedValue || i.amount || "0"), 0);
  const pending = (items || []).filter((i: any) => ["identified", "under_review", "approved", "in_progress"].includes(i.status)).reduce((s: number, i: any) => s + parseFloat(i.amount || "0"), 0);

  const handleCreate = () => {
    createItem.mutate({ projectId, category: form.category || "other", amount: form.amount || "0", title: form.title, description: form.description, status: form.status || "identified", isClientVisible: form.isClientVisible ?? 1, estimatedValue: form.estimatedValue, notes: form.notes });
    setForm({});
  };

  return (
    <div>
      <h3 style={{ color: C.text, fontSize: "1rem", marginBottom: "1rem" }}>Recovery Opportunities</h3>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={cardStyle}><span style={{ color: C.textMuted, fontSize: "0.7rem", display: "block" }}>Total Identified</span><span style={{ color: C.gold, fontSize: "1.1rem", fontWeight: 700 }}>${totalIdentified.toLocaleString()}</span></div>
        <div style={cardStyle}><span style={{ color: C.textMuted, fontSize: "0.7rem", display: "block" }}>Realized</span><span style={{ color: "#27AE60", fontSize: "1.1rem", fontWeight: 700 }}>${realized.toLocaleString()}</span></div>
        <div style={cardStyle}><span style={{ color: C.textMuted, fontSize: "0.7rem", display: "block" }}>Pending</span><span style={{ color: C.text, fontSize: "1.1rem", fontWeight: 700 }}>${pending.toLocaleString()}</span></div>
        <div style={cardStyle}><span style={{ color: C.textMuted, fontSize: "0.7rem", display: "block" }}>Opportunities</span><span style={{ color: C.text, fontSize: "1.1rem", fontWeight: 700 }}>{(items || []).length}</span></div>
      </div>

      <button style={{ ...btnStyle, marginBottom: "1rem" }} onClick={() => setShowAdd(!showAdd)}>+ Add Recovery Opportunity</button>

      {showAdd && (
        <div style={{ ...cardStyle, border: `1px solid ${C.gold}40` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div><label style={labelStyle}>Title</label><input style={inputStyle} value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><label style={labelStyle}>Category</label><select style={inputStyle} value={form.category || ""} onChange={e => setForm({ ...form, category: e.target.value })}><option value="">Select...</option>{CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}</select></div>
            <div><label style={labelStyle}>Amount ($)</label><input style={inputStyle} type="text" value={form.amount || ""} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div><label style={labelStyle}>Status</label><select style={inputStyle} value={form.status || "identified"} onChange={e => setForm({ ...form, status: e.target.value })}>{STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}</select></div>
            <div><label style={labelStyle}>Client Visible</label><select style={inputStyle} value={form.isClientVisible ?? 1} onChange={e => setForm({ ...form, isClientVisible: parseInt(e.target.value) })}><option value={1}>Yes</option><option value={0}>No</option></select></div>
          </div>
          <div style={{ marginBottom: "0.75rem" }}><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, minHeight: 50 }} value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <button style={btnStyle} onClick={handleCreate}>Save Opportunity</button>
        </div>
      )}

      {/* List */}
      {(items || []).map((item: any) => (
        <div key={item.id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ color: C.text, fontSize: "0.85rem", fontWeight: 500 }}>{item.title || item.category?.replace(/_/g, " ")}</span>
            <span style={{ color: C.gold, fontSize: "0.8rem", marginLeft: "1rem" }}>${parseFloat(item.amount || "0").toLocaleString()}</span>
            <span style={{ color: C.textMuted, fontSize: "0.7rem", marginLeft: "0.75rem", textTransform: "capitalize" }}>{item.status?.replace(/_/g, " ")}</span>
            {item.isClientVisible === 1 && <span style={{ color: "#27AE60", fontSize: "0.65rem", marginLeft: "0.5rem" }}>● Client Visible</span>}
          </div>
          <div style={{ display: "flex", gap: "0.3rem" }}>
            <button style={{ ...btnStyle, background: "transparent", color: C.silver, border: `1px solid ${C.border}`, fontSize: "0.7rem", padding: "0.3rem 0.6rem" }} onClick={() => deleteItem.mutate({ id: item.id })}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. RISKS & EXCEPTIONS
// ═══════════════════════════════════════════════════════════════════════════════
function RisksPanel({ projectId }: { projectId: number }) {
  const { data: items, refetch } = trpc.clientPortal.listRisks.useQuery({ projectId });
  const createItem = trpc.clientPortal.createRisk.useMutation({ onSuccess: () => { refetch(); setShowAdd(false); } });
  const deleteItem = trpc.clientPortal.deleteRisk.useMutation({ onSuccess: () => refetch() });
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<any>({});

  const TYPES = ["high_value_missing", "no_custodian", "uninsured", "no_documentation", "unauthorized_location", "duplicate_purchase", "obsolete_equipment", "cybersecurity", "compliance", "pending_decision", "risk", "exception", "assessment", "finding", "other"];
  const STATUSES = ["open", "under_review", "mitigation_in_progress", "in_progress", "resolved", "closed", "accepted", "escalated"];

  const openCount = (items || []).filter((i: any) => ["open", "under_review", "mitigation_in_progress", "in_progress"].includes(i.status)).length;

  const handleCreate = () => {
    createItem.mutate({ projectId, riskType: form.riskType || "other", riskLevel: form.riskLevel || "medium", title: form.title, description: form.description, location: form.location, owner: form.owner, isClientVisible: form.isClientVisible ?? 1 });
    setForm({});
  };

  return (
    <div>
      <h3 style={{ color: C.text, fontSize: "1rem", marginBottom: "0.5rem" }}>Risks & Exceptions</h3>
      <p style={{ color: C.textMuted, fontSize: "0.8rem", marginBottom: "1rem" }}>Open: {openCount} | Total: {(items || []).length}</p>

      <button style={{ ...btnStyle, marginBottom: "1rem" }} onClick={() => setShowAdd(!showAdd)}>+ Add Risk/Exception</button>

      {showAdd && (
        <div style={{ ...cardStyle, border: `1px solid ${C.gold}40` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div><label style={labelStyle}>Title</label><input style={inputStyle} value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><label style={labelStyle}>Type</label><select style={inputStyle} value={form.riskType || ""} onChange={e => setForm({ ...form, riskType: e.target.value })}><option value="">Select...</option>{TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}</select></div>
            <div><label style={labelStyle}>Severity</label><select style={inputStyle} value={form.riskLevel || "medium"} onChange={e => setForm({ ...form, riskLevel: e.target.value })}><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div><label style={labelStyle}>Owner</label><input style={inputStyle} value={form.owner || ""} onChange={e => setForm({ ...form, owner: e.target.value })} /></div>
            <div><label style={labelStyle}>Location</label><input style={inputStyle} value={form.location || ""} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
            <div><label style={labelStyle}>Client Visible</label><select style={inputStyle} value={form.isClientVisible ?? 1} onChange={e => setForm({ ...form, isClientVisible: parseInt(e.target.value) })}><option value={1}>Yes</option><option value={0}>No</option></select></div>
          </div>
          <div style={{ marginBottom: "0.75rem" }}><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, minHeight: 50 }} value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <button style={btnStyle} onClick={handleCreate}>Save Risk</button>
        </div>
      )}

      {(items || []).map((item: any) => (
        <div key={item.id} style={{ ...cardStyle, borderLeft: `3px solid ${item.riskLevel === "critical" ? "#E74C3C" : item.riskLevel === "high" ? "#F39C12" : item.riskLevel === "medium" ? "#F1C40F" : "#27AE60"}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ color: C.text, fontSize: "0.85rem", fontWeight: 500 }}>{item.title || item.riskType?.replace(/_/g, " ")}</span>
              <span style={{ color: C.textMuted, fontSize: "0.7rem", marginLeft: "0.75rem" }}>{item.status?.replace(/_/g, " ")}</span>
              {item.isClientVisible === 1 && <span style={{ color: "#27AE60", fontSize: "0.65rem", marginLeft: "0.5rem" }}>● Visible</span>}
              {item.description && <p style={{ color: C.textMuted, fontSize: "0.75rem", margin: "0.25rem 0 0" }}>{item.description.substring(0, 100)}</p>}
            </div>
            <button style={{ ...btnStyle, background: "transparent", color: C.silver, border: `1px solid ${C.border}`, fontSize: "0.7rem", padding: "0.3rem 0.6rem" }} onClick={() => deleteItem.mutate({ id: item.id })}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. LOCATIONS & DEPARTMENTS
// ═══════════════════════════════════════════════════════════════════════════════
function LocationsPanel({ projectId }: { projectId: number }) {
  const { data: locations, refetch: refetchLoc } = trpc.clientPortal.listLocations.useQuery({ projectId });
  const { data: departments, refetch: refetchDept } = trpc.clientPortal.listDepartments.useQuery({ projectId });
  const createLoc = trpc.clientPortal.createLocation.useMutation({ onSuccess: () => refetchLoc() });
  const deleteLoc = trpc.clientPortal.deleteLocation.useMutation({ onSuccess: () => refetchLoc() });
  const createDept = trpc.clientPortal.createDepartment.useMutation({ onSuccess: () => refetchDept() });
  const deleteDept = trpc.clientPortal.deleteDepartment.useMutation({ onSuccess: () => refetchDept() });
  const [locForm, setLocForm] = useState<any>({});
  const [deptForm, setDeptForm] = useState<any>({});
  const [showAddLoc, setShowAddLoc] = useState(false);
  const [showAddDept, setShowAddDept] = useState(false);

  return (
    <div>
      <h3 style={{ color: C.text, fontSize: "1rem", marginBottom: "1rem" }}>Locations & Departments</h3>

      {/* Locations */}
      <h4 style={{ color: C.silver, fontSize: "0.85rem", marginBottom: "0.75rem" }}>Locations ({(locations || []).length})</h4>
      <button style={{ ...btnStyle, marginBottom: "1rem", fontSize: "0.75rem" }} onClick={() => setShowAddLoc(!showAddLoc)}>+ Add Location</button>

      {showAddLoc && (
        <div style={{ ...cardStyle, border: `1px solid ${C.gold}40` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div><label style={labelStyle}>Location Name *</label><input style={inputStyle} value={locForm.locationName || ""} onChange={e => setLocForm({ ...locForm, locationName: e.target.value })} /></div>
            <div><label style={labelStyle}>Site Code</label><input style={inputStyle} value={locForm.siteCode || ""} onChange={e => setLocForm({ ...locForm, siteCode: e.target.value })} /></div>
            <div><label style={labelStyle}>Contact</label><input style={inputStyle} value={locForm.contact || ""} onChange={e => setLocForm({ ...locForm, contact: e.target.value })} /></div>
          </div>
          <div style={{ marginBottom: "0.75rem" }}><label style={labelStyle}>Address</label><textarea style={{ ...inputStyle, minHeight: 40 }} value={locForm.address || ""} onChange={e => setLocForm({ ...locForm, address: e.target.value })} /></div>
          <button style={btnStyle} onClick={() => { createLoc.mutate({ projectId, ...locForm }); setLocForm({}); setShowAddLoc(false); }}>Save Location</button>
        </div>
      )}

      {(locations || []).map((loc: any) => (
        <div key={loc.id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ color: C.text, fontSize: "0.85rem", fontWeight: 500 }}>{loc.locationName}</span>
            {loc.siteCode && <span style={{ color: C.textMuted, fontSize: "0.7rem", marginLeft: "0.75rem" }}>({loc.siteCode})</span>}
            <span style={{ color: C.textMuted, fontSize: "0.7rem", marginLeft: "0.75rem" }}>{loc.verificationStatus?.replace("_", " ")}</span>
            {loc.address && <p style={{ color: C.textMuted, fontSize: "0.7rem", margin: "0.2rem 0 0" }}>{loc.address}</p>}
          </div>
          <button style={{ ...btnStyle, background: "transparent", color: C.silver, border: `1px solid ${C.border}`, fontSize: "0.7rem", padding: "0.3rem 0.6rem" }} onClick={() => deleteLoc.mutate({ id: loc.id })}>Delete</button>
        </div>
      ))}

      {/* Departments */}
      <h4 style={{ color: C.silver, fontSize: "0.85rem", margin: "2rem 0 0.75rem" }}>Departments ({(departments || []).length})</h4>
      <button style={{ ...btnStyle, marginBottom: "1rem", fontSize: "0.75rem" }} onClick={() => setShowAddDept(!showAddDept)}>+ Add Department</button>

      {showAddDept && (
        <div style={{ ...cardStyle, border: `1px solid ${C.gold}40` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div><label style={labelStyle}>Department Name *</label><input style={inputStyle} value={deptForm.departmentName || ""} onChange={e => setDeptForm({ ...deptForm, departmentName: e.target.value })} /></div>
            <div><label style={labelStyle}>Department Code</label><input style={inputStyle} value={deptForm.departmentCode || ""} onChange={e => setDeptForm({ ...deptForm, departmentCode: e.target.value })} /></div>
            <div><label style={labelStyle}>Contact</label><input style={inputStyle} value={deptForm.contact || ""} onChange={e => setDeptForm({ ...deptForm, contact: e.target.value })} /></div>
          </div>
          <button style={btnStyle} onClick={() => { createDept.mutate({ projectId, ...deptForm }); setDeptForm({}); setShowAddDept(false); }}>Save Department</button>
        </div>
      )}

      {(departments || []).map((dept: any) => (
        <div key={dept.id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ color: C.text, fontSize: "0.85rem", fontWeight: 500 }}>{dept.departmentName}</span>
            {dept.departmentCode && <span style={{ color: C.textMuted, fontSize: "0.7rem", marginLeft: "0.75rem" }}>({dept.departmentCode})</span>}
            <span style={{ color: C.textMuted, fontSize: "0.7rem", marginLeft: "0.75rem" }}>{dept.verificationStatus?.replace("_", " ")}</span>
          </div>
          <button style={{ ...btnStyle, background: "transparent", color: C.silver, border: `1px solid ${C.border}`, fontSize: "0.7rem", padding: "0.3rem 0.6rem" }} onClick={() => deleteDept.mutate({ id: dept.id })}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. TASKS & APPROVALS
// ═══════════════════════════════════════════════════════════════════════════════
function TasksPanel({ projectId }: { projectId: number }) {
  const { data: items, refetch } = trpc.clientPortal.listActionItems.useQuery({ projectId });
  const createItem = trpc.clientPortal.createActionItem.useMutation({ onSuccess: () => { refetch(); setShowAdd(false); } });
  const deleteItem = trpc.clientPortal.deleteActionItem.useMutation({ onSuccess: () => refetch() });
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<any>({});

  const TYPES = ["document_approval", "question", "asset_clarification", "milestone_acceptance", "change_order", "meeting_confirmation", "corrective_action", "upload_document", "other"];

  return (
    <div>
      <h3 style={{ color: C.text, fontSize: "1rem", marginBottom: "1rem" }}>Tasks & Approvals</h3>
      <button style={{ ...btnStyle, marginBottom: "1rem" }} onClick={() => setShowAdd(!showAdd)}>+ Add Task</button>

      {showAdd && (
        <div style={{ ...cardStyle, border: `1px solid ${C.gold}40` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div><label style={labelStyle}>Title *</label><input style={inputStyle} value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><label style={labelStyle}>Type</label><select style={inputStyle} value={form.actionType || ""} onChange={e => setForm({ ...form, actionType: e.target.value })}><option value="">Select...</option>{TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}</select></div>
            <div><label style={labelStyle}>Priority</label><select style={inputStyle} value={form.priority || "normal"} onChange={e => setForm({ ...form, priority: e.target.value })}><option value="urgent">Urgent</option><option value="high">High</option><option value="normal">Normal</option><option value="low">Low</option></select></div>
          </div>
          <div style={{ marginBottom: "0.75rem" }}><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, minHeight: 50 }} value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <button style={btnStyle} onClick={() => { createItem.mutate({ projectId, title: form.title || "Untitled", actionType: form.actionType || "other", priority: form.priority || "normal", description: form.description }); setForm({}); }}>Save Task</button>
        </div>
      )}

      {(items || []).map((item: any) => (
        <div key={item.id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ color: C.text, fontSize: "0.85rem", fontWeight: 500 }}>{item.title}</span>
            <span style={{ color: C.textMuted, fontSize: "0.7rem", marginLeft: "0.75rem" }}>{item.status} | {item.priority}</span>
            {item.description && <p style={{ color: C.textMuted, fontSize: "0.75rem", margin: "0.2rem 0 0" }}>{item.description.substring(0, 80)}</p>}
          </div>
          <button style={{ ...btnStyle, background: "transparent", color: C.silver, border: `1px solid ${C.border}`, fontSize: "0.7rem", padding: "0.3rem 0.6rem" }} onClick={() => deleteItem.mutate({ id: item.id })}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. REPORTS & DOCUMENTS
// ═══════════════════════════════════════════════════════════════════════════════
function ReportsPanel({ projectId }: { projectId: number }) {
  const { data: items, refetch } = trpc.clientPortal.listReports.useQuery({ projectId });
  const createItem = trpc.clientPortal.createReport.useMutation({ onSuccess: () => { refetch(); setShowAdd(false); } });
  const deleteItem = trpc.clientPortal.deleteReport.useMutation({ onSuccess: () => refetch() });
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<any>({});

  const TYPES = ["executive_assessment", "verification_analysis", "reconciled_far", "discrepancy_matrix", "inventory_master_log", "recovery_register", "governance_scorecard", "risk_exception_report", "location_report", "asset_photographs", "meeting_summary", "final_presentation", "technology_plan", "quarterly_report", "other"];

  return (
    <div>
      <h3 style={{ color: C.text, fontSize: "1rem", marginBottom: "1rem" }}>Reports & Documents</h3>
      <button style={{ ...btnStyle, marginBottom: "1rem" }} onClick={() => setShowAdd(!showAdd)}>+ Add Report</button>

      {showAdd && (
        <div style={{ ...cardStyle, border: `1px solid ${C.gold}40` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div><label style={labelStyle}>Title *</label><input style={inputStyle} value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><label style={labelStyle}>Type</label><select style={inputStyle} value={form.reportType || ""} onChange={e => setForm({ ...form, reportType: e.target.value })}><option value="">Select...</option>{TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}</select></div>
            <div><label style={labelStyle}>Status</label><select style={inputStyle} value={form.status || "draft"} onChange={e => setForm({ ...form, status: e.target.value })}><option value="draft">Draft</option><option value="in_review">In Review</option><option value="final">Published</option><option value="superseded">Superseded</option></select></div>
          </div>
          <button style={btnStyle} onClick={() => { createItem.mutate({ projectId, title: form.title || "Untitled", reportType: form.reportType || "other", status: form.status || "draft" }); setForm({}); }}>Save Report</button>
        </div>
      )}

      {(items || []).map((item: any) => (
        <div key={item.id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ color: C.text, fontSize: "0.85rem", fontWeight: 500 }}>{item.title}</span>
            <span style={{ color: C.textMuted, fontSize: "0.7rem", marginLeft: "0.75rem" }}>{item.reportType?.replace(/_/g, " ")} | {item.status}</span>
          </div>
          <button style={{ ...btnStyle, background: "transparent", color: C.silver, border: `1px solid ${C.border}`, fontSize: "0.7rem", padding: "0.3rem 0.6rem" }} onClick={() => deleteItem.mutate({ id: item.id })}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 9. MEETINGS & MESSAGES
// ═══════════════════════════════════════════════════════════════════════════════
function MeetingsPanel({ projectId }: { projectId: number }) {
  const { data: items, refetch } = trpc.clientPortal.listMeetings.useQuery({ projectId });
  const createItem = trpc.clientPortal.createMeeting.useMutation({ onSuccess: () => { refetch(); setShowAdd(false); } });
  const deleteItem = trpc.clientPortal.deleteMeeting.useMutation({ onSuccess: () => refetch() });
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<any>({});

  return (
    <div>
      <h3 style={{ color: C.text, fontSize: "1rem", marginBottom: "1rem" }}>Meetings & Messages</h3>
      <button style={{ ...btnStyle, marginBottom: "1rem" }} onClick={() => setShowAdd(!showAdd)}>+ Add Meeting/Message</button>

      {showAdd && (
        <div style={{ ...cardStyle, border: `1px solid ${C.gold}40` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div><label style={labelStyle}>Title *</label><input style={inputStyle} value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><label style={labelStyle}>Type</label><select style={inputStyle} value={form.meetingType || "status_update"} onChange={e => setForm({ ...form, meetingType: e.target.value })}><option value="kickoff">Kickoff</option><option value="status_update">Status Update</option><option value="review">Review</option><option value="qbr">QBR</option><option value="ad_hoc">Ad Hoc</option><option value="final">Final</option></select></div>
            <div><label style={labelStyle}>Date</label><input style={inputStyle} type="datetime-local" value={form.scheduledDate || ""} onChange={e => setForm({ ...form, scheduledDate: e.target.value })} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div><label style={labelStyle}>Summary</label><textarea style={{ ...inputStyle, minHeight: 50 }} value={form.summary || ""} onChange={e => setForm({ ...form, summary: e.target.value })} /></div>
            <div><label style={labelStyle}>Client Visible</label><select style={inputStyle} value={form.isClientVisible ?? 1} onChange={e => setForm({ ...form, isClientVisible: parseInt(e.target.value) })}><option value={1}>Yes</option><option value={0}>No</option></select></div>
          </div>
          <button style={btnStyle} onClick={() => { createItem.mutate({ projectId, title: form.title || "Untitled", meetingType: form.meetingType || "status_update", scheduledDate: form.scheduledDate || undefined, summary: form.summary, isClientVisible: form.isClientVisible ?? 1 }); setForm({}); }}>Save</button>
        </div>
      )}

      {(items || []).map((item: any) => (
        <div key={item.id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ color: C.text, fontSize: "0.85rem", fontWeight: 500 }}>{item.title}</span>
            <span style={{ color: C.textMuted, fontSize: "0.7rem", marginLeft: "0.75rem" }}>{item.meetingType?.replace(/_/g, " ")} | {item.status}</span>
            {item.scheduledDate && <span style={{ color: C.textMuted, fontSize: "0.7rem", marginLeft: "0.5rem" }}>{new Date(item.scheduledDate).toLocaleDateString()}</span>}
            {item.isClientVisible === 1 && <span style={{ color: "#27AE60", fontSize: "0.65rem", marginLeft: "0.5rem" }}>● Visible</span>}
          </div>
          <button style={{ ...btnStyle, background: "transparent", color: C.silver, border: `1px solid ${C.border}`, fontSize: "0.7rem", padding: "0.3rem 0.6rem" }} onClick={() => deleteItem.mutate({ id: item.id })}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 10. PORTAL ACCESS
// ═══════════════════════════════════════════════════════════════════════════════
function AccessPanel({ projectId, projectName }: { projectId: number; projectName: string }) {
  const { data: account, refetch } = trpc.clientPortal.adminViewDashboard.useQuery({ projectId });
  const createDashboard = trpc.clientPortal.createDashboard.useMutation({ onSuccess: () => refetch() });
  const [form, setForm] = useState({ clientName: "", username: "", clientEmail: "", clientCompany: "", dashboardTitle: "" });

  if (account) {
    return (
      <div>
        <h3 style={{ color: C.text, fontSize: "1rem", marginBottom: "1rem" }}>Portal Access</h3>
        <div style={cardStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div><span style={{ ...labelStyle, display: "block" }}>Client Name</span><span style={{ color: C.text, fontSize: "0.85rem" }}>{account.clientName}</span></div>
            <div><span style={{ ...labelStyle, display: "block" }}>Username</span><span style={{ color: C.text, fontSize: "0.85rem" }}>{account.username}</span></div>
            <div><span style={{ ...labelStyle, display: "block" }}>Status</span><span style={{ color: account.isActive ? "#27AE60" : "#E74C3C", fontSize: "0.85rem" }}>{account.isActive ? "Active" : "Inactive"}</span></div>
            <div><span style={{ ...labelStyle, display: "block" }}>Last Login</span><span style={{ color: C.text, fontSize: "0.85rem" }}>{account.lastLogin ? new Date(account.lastLogin).toLocaleString() : "Never"}</span></div>
          </div>
          <p style={{ color: C.textMuted, fontSize: "0.75rem", marginTop: "1rem" }}>
            Portal URL: {window.location.origin}/client-portal
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ color: C.text, fontSize: "1rem", marginBottom: "1rem" }}>Create Client Portal Access</h3>
      <div style={cardStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <div><label style={labelStyle}>Client Name *</label><input style={inputStyle} value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} /></div>
          <div><label style={labelStyle}>Username *</label><input style={inputStyle} value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></div>
          <div><label style={labelStyle}>Email</label><input style={inputStyle} value={form.clientEmail} onChange={e => setForm({ ...form, clientEmail: e.target.value })} /></div>
          <div><label style={labelStyle}>Company</label><input style={inputStyle} value={form.clientCompany} onChange={e => setForm({ ...form, clientCompany: e.target.value })} /></div>
        </div>
        <button style={btnStyle} onClick={() => createDashboard.mutate({ projectId, ...form })} disabled={!form.clientName || !form.username}>
          Create Portal Access
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 11. AUDIT HISTORY
// ═══════════════════════════════════════════════════════════════════════════════
function AuditPanel({ projectId }: { projectId: number }) {
  const { data: history } = trpc.clientPortal.getAuditHistory.useQuery({ projectId, limit: 50 });

  return (
    <div>
      <h3 style={{ color: C.text, fontSize: "1rem", marginBottom: "1rem" }}>Audit History</h3>
      {(!history || history.length === 0) && <p style={{ color: C.textMuted, fontSize: "0.85rem" }}>No audit records yet.</p>}
      {(history || []).map((entry: any) => (
        <div key={entry.id} style={{ padding: "0.5rem 0", borderBottom: `1px solid ${C.border}20`, fontSize: "0.8rem" }}>
          <span style={{ color: C.textMuted }}>{new Date(entry.createdAt).toLocaleString()}</span>
          <span style={{ color: C.silver, marginLeft: "0.75rem" }}>{entry.changedByName || "System"}</span>
          <span style={{ color: C.text, marginLeft: "0.75rem" }}>{entry.description}</span>
        </div>
      ))}
    </div>
  );
}
