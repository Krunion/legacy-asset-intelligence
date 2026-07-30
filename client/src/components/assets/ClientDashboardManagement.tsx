import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { COLORS } from "@shared/colors";

const C = COLORS;

type Tab = "access" | "progress" | "recovery" | "risks" | "tasks" | "reports" | "meetings" | "billing";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "access", label: "Portal Access", icon: "🔑" },
  { key: "progress", label: "Progress & Phases", icon: "📈" },
  { key: "recovery", label: "Recovery", icon: "💰" },
  { key: "risks", label: "Risks & Exceptions", icon: "⚠️" },
  { key: "tasks", label: "Tasks & Approvals", icon: "✅" },
  { key: "reports", label: "Reports", icon: "📄" },
  { key: "meetings", label: "Meetings", icon: "📅" },
  { key: "billing", label: "Billing", icon: "💳" },
];

export default function ClientDashboardManagement({ projectId, projectName }: { projectId: number; projectName: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("access");

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.text, margin: "0 0 0.25rem" }}>
          Client Dashboard Management
        </h2>
        <p style={{ color: C.textMuted, fontSize: "0.85rem", margin: 0 }}>
          Manage all client-facing dashboard content for {projectName}
        </p>
      </div>

      {/* Tab Navigation */}
      <nav style={{ display: "flex", gap: "0.25rem", overflowX: "auto", marginBottom: "1.5rem", borderBottom: `1px solid ${C.border}`, paddingBottom: "0.5rem" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "0.5rem 1rem",
              background: activeTab === tab.key ? `${C.gold}20` : "transparent",
              border: activeTab === tab.key ? `1px solid ${C.gold}` : `1px solid transparent`,
              borderRadius: 6,
              color: activeTab === tab.key ? C.gold : C.silver,
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: activeTab === tab.key ? 600 : 400,
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      {activeTab === "access" && <AccessPanel projectId={projectId} projectName={projectName} />}
      {activeTab === "progress" && <ProgressPanel projectId={projectId} />}
      {activeTab === "recovery" && <RecoveryPanel projectId={projectId} />}
      {activeTab === "risks" && <RisksPanel projectId={projectId} />}
      {activeTab === "tasks" && <TasksPanel projectId={projectId} />}
      {activeTab === "reports" && <ReportsPanel projectId={projectId} />}
      {activeTab === "meetings" && <MeetingsPanel projectId={projectId} />}
      {activeTab === "billing" && <BillingPanel projectId={projectId} />}
    </div>
  );
}

// ─── PANEL: Portal Access ─────────────────────────────────────────────────────
function AccessPanel({ projectId, projectName }: { projectId: number; projectName: string }) {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ clientName: "", clientEmail: "", dashboardTitle: "" });
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const { data: dashboards, isLoading } = trpc.clientPortal.listDashboards.useQuery({ projectId });

  const createMutation = trpc.clientPortal.createDashboard.useMutation({
    onSuccess: (data) => {
      utils.clientPortal.listDashboards.invalidate({ projectId });
      setCreatedLink(`${window.location.origin}${data.portalLink}`);
      setCreatedPassword(data.password);
      setShowCreate(false);
      setForm({ clientName: "", clientEmail: "", dashboardTitle: "" });
    },
  });

  const resetPwMutation = trpc.clientPortal.resetPassword.useMutation({
    onSuccess: (data) => {
      alert(`New password: ${data.newPassword}\n\nPlease share this with the client.`);
      utils.clientPortal.listDashboards.invalidate({ projectId });
    },
  });

  function handleCreate() {
    if (!form.clientName.trim()) return;
    const autoUsername = form.clientName.trim().toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20) + Math.floor(Math.random() * 1000);
    createMutation.mutate({
      projectId,
      clientName: form.clientName.trim(),
      username: autoUsername,
      clientEmail: form.clientEmail.trim() || undefined,
      dashboardTitle: form.dashboardTitle.trim() || undefined,
    });
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <button onClick={() => setShowCreate(true)} style={{ padding: "0.6rem 1.25rem", background: C.gold, border: "none", borderRadius: 8, color: C.charcoal, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
          + Create Client Dashboard
        </button>
      </div>

      {createdLink && (
        <div style={{ background: "rgba(16,185,129,0.1)", borderRadius: 12, border: "1px solid rgba(16,185,129,0.3)", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ color: "#10B981", fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Client Dashboard Created!</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <label style={{ color: C.textMuted, fontSize: "0.8rem", fontWeight: 600, minWidth: 80 }}>Client Portal:</label>
              <code style={{ flex: 1, padding: "0.5rem 0.75rem", background: C.slate, borderRadius: 6, color: C.gold, fontSize: "0.8rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{createdLink}</code>
              <button onClick={() => { navigator.clipboard.writeText(createdLink); }} style={{ padding: "0.4rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.silver, cursor: "pointer", fontSize: "0.8rem" }}>Copy</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <label style={{ color: C.textMuted, fontSize: "0.8rem", fontWeight: 600, minWidth: 80 }}>Password:</label>
              <code style={{ flex: 1, padding: "0.5rem 0.75rem", background: C.slate, borderRadius: 6, color: C.gold, fontSize: "0.8rem" }}>{createdPassword}</code>
              <button onClick={() => { navigator.clipboard.writeText(createdPassword!); }} style={{ padding: "0.4rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.silver, cursor: "pointer", fontSize: "0.8rem" }}>Copy</button>
            </div>
          </div>
          <p style={{ color: C.textMuted, fontSize: "0.75rem", marginTop: "1rem" }}>Client can change their password after first login. You and Chris always have admin access.</p>
          <button onClick={() => { setCreatedLink(null); setCreatedPassword(null); }} style={{ marginTop: "0.75rem", padding: "0.4rem 1rem", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer", fontSize: "0.8rem" }}>Dismiss</button>
        </div>
      )}

      {showCreate && (
        <div style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ color: C.text, fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Create Client Dashboard Access</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", color: C.silver, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Client Name *</label>
              <input type="text" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="e.g. Acme Corp" style={{ width: "100%", padding: "0.6rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", color: C.silver, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Client Email (optional)</label>
              <input type="email" value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} placeholder="client@example.com" style={{ width: "100%", padding: "0.6rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", color: C.silver, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Dashboard Title (optional)</label>
            <input type="text" value={form.dashboardTitle} onChange={(e) => setForm({ ...form, dashboardTitle: e.target.value })} placeholder={`Default: "${projectName} — Executive Dashboard"`} style={{ width: "100%", padding: "0.6rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button onClick={() => setShowCreate(false)} style={{ padding: "0.5rem 1rem", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer" }}>Cancel</button>
            <button onClick={handleCreate} disabled={!form.clientName.trim() || createMutation.isPending} style={{ padding: "0.5rem 1.25rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, fontWeight: 600, cursor: "pointer", opacity: !form.clientName.trim() ? 0.5 : 1 }}>
              {createMutation.isPending ? "Creating..." : "Create Dashboard"}
            </button>
          </div>
        </div>
      )}

      {isLoading ? <div style={{ textAlign: "center", padding: "2rem", color: C.textMuted }}>Loading...</div> : !dashboards?.length ? (
        <div style={{ textAlign: "center", padding: "3rem", background: C.navy, borderRadius: 12, border: `1px solid ${C.border}` }}>
          <p style={{ color: C.textMuted }}>No client dashboards created yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {dashboards.map((dash: any) => (
            <div key={dash.id} style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h4 style={{ color: C.text, fontSize: "1rem", fontWeight: 600, margin: "0 0 0.25rem" }}>{dash.clientName}</h4>
                  <p style={{ color: C.textMuted, fontSize: "0.8rem", margin: "0 0 0.5rem" }}>Username: <code style={{ color: C.gold }}>{dash.username}</code>{dash.clientEmail && <> — {dash.clientEmail}</>}</p>
                  <p style={{ color: C.textMuted, fontSize: "0.75rem", margin: 0 }}>Created {new Date(dash.createdAt).toLocaleDateString()} — Last login: {dash.lastLogin ? new Date(dash.lastLogin).toLocaleString() : "Never"}</p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <a href={`/client-portal?token=${dash.accessToken}`} target="_blank" rel="noopener noreferrer" style={{ padding: "0.4rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.silver, textDecoration: "none", fontSize: "0.8rem" }}>View</a>
                  <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/client-portal?token=${dash.accessToken}`); alert("Link copied!"); }} style={{ padding: "0.4rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.gold, cursor: "pointer", fontSize: "0.8rem" }}>Copy Link</button>
                  <button onClick={() => { if (confirm("Reset password?")) resetPwMutation.mutate({ id: dash.id }); }} style={{ padding: "0.4rem 0.75rem", background: "transparent", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 6, color: "#F59E0B", cursor: "pointer", fontSize: "0.8rem" }}>Reset PW</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PANEL: Progress & Phases ─────────────────────────────────────────────────
function ProgressPanel({ projectId }: { projectId: number }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    phaseNumber: 1, phaseName: "", status: "not_started" as string,
    completionPercent: 0, startDate: "", targetEndDate: "", actualEndDate: "",
    activities: "" as string, milestones: "" as string, deliverables: "" as string,
  });

  const utils = trpc.useUtils();
  const { data: phases, isLoading } = trpc.clientPortal.listPhases.useQuery({ projectId });
  const upsertMutation = trpc.clientPortal.upsertPhase.useMutation({
    onSuccess: () => { utils.clientPortal.listPhases.invalidate({ projectId }); resetForm(); },
  });

  function resetForm() {
    setShowForm(false); setEditId(null);
    setForm({ phaseNumber: 1, phaseName: "", status: "not_started", completionPercent: 0, startDate: "", targetEndDate: "", actualEndDate: "", activities: "", milestones: "", deliverables: "" });
  }

  function handleEdit(phase: any) {
    setEditId(phase.id);
    setForm({
      phaseNumber: phase.phaseNumber,
      phaseName: phase.phaseName,
      status: phase.status,
      completionPercent: phase.completionPercent,
      startDate: phase.startDate ? new Date(phase.startDate).toISOString().split("T")[0] : "",
      targetEndDate: phase.targetEndDate ? new Date(phase.targetEndDate).toISOString().split("T")[0] : "",
      actualEndDate: phase.actualEndDate ? new Date(phase.actualEndDate).toISOString().split("T")[0] : "",
      activities: Array.isArray(phase.activities) ? (phase.activities as string[]).join("\n") : "",
      milestones: Array.isArray(phase.milestones) ? (phase.milestones as any[]).map((m: any) => m.name).join("\n") : "",
      deliverables: Array.isArray(phase.deliverables) ? (phase.deliverables as string[]).join("\n") : "",
    });
    setShowForm(true);
  }

  function handleSubmit() {
    upsertMutation.mutate({
      id: editId || undefined,
      projectId,
      phaseNumber: form.phaseNumber,
      phaseName: form.phaseName,
      status: form.status as any,
      completionPercent: form.completionPercent,
      startDate: form.startDate || undefined,
      targetEndDate: form.targetEndDate || undefined,
      actualEndDate: form.actualEndDate || undefined,
      activities: form.activities.split("\n").filter(Boolean),
      milestones: form.milestones.split("\n").filter(Boolean).map((n) => ({ name: n, status: "pending", date: "" })),
      deliverables: form.deliverables.split("\n").filter(Boolean),
    });
  }

  const statusColors: Record<string, string> = { not_started: "#94A3B8", in_progress: "#3B82F6", completed: "#10B981", on_hold: "#F59E0B" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <p style={{ color: C.textMuted, fontSize: "0.85rem", margin: 0 }}>Define project phases (1-4) that appear on the client's dashboard progress tracker.</p>
        <button onClick={() => { resetForm(); setShowForm(true); }} style={{ padding: "0.5rem 1rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>+ Add Phase</button>
      </div>

      {showForm && (
        <div style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ color: C.text, fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>{editId ? "Edit Phase" : "Add Phase"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Phase #</label>
              <select value={form.phaseNumber} onChange={(e) => setForm({ ...form, phaseNumber: +e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem" }}>
                <option value={1}>Phase 1</option><option value={2}>Phase 2</option><option value={3}>Phase 3</option><option value={4}>Phase 4</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Phase Name *</label>
              <input type="text" value={form.phaseName} onChange={(e) => setForm({ ...form, phaseName: e.target.value })} placeholder="e.g. Discovery & Assessment" style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem" }}>
                <option value="not_started">Not Started</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="on_hold">On Hold</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Completion %</label>
              <input type="number" min={0} max={100} value={form.completionPercent} onChange={(e) => setForm({ ...form, completionPercent: +e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Start Date</label><input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} /></div>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Target End Date</label><input type="date" value={form.targetEndDate} onChange={(e) => setForm({ ...form, targetEndDate: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} /></div>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Actual End Date</label><input type="date" value={form.actualEndDate} onChange={(e) => setForm({ ...form, actualEndDate: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Activities (one per line)</label><textarea rows={3} value={form.activities} onChange={(e) => setForm({ ...form, activities: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.8rem", resize: "vertical", boxSizing: "border-box" }} /></div>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Milestones (one per line)</label><textarea rows={3} value={form.milestones} onChange={(e) => setForm({ ...form, milestones: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.8rem", resize: "vertical", boxSizing: "border-box" }} /></div>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Deliverables (one per line)</label><textarea rows={3} value={form.deliverables} onChange={(e) => setForm({ ...form, deliverables: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.8rem", resize: "vertical", boxSizing: "border-box" }} /></div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button onClick={resetForm} style={{ padding: "0.5rem 1rem", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer" }}>Cancel</button>
            <button onClick={handleSubmit} disabled={!form.phaseName.trim() || upsertMutation.isPending} style={{ padding: "0.5rem 1.25rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, fontWeight: 600, cursor: "pointer" }}>{upsertMutation.isPending ? "Saving..." : "Save Phase"}</button>
          </div>
        </div>
      )}

      {isLoading ? <div style={{ textAlign: "center", padding: "2rem", color: C.textMuted }}>Loading phases...</div> : !phases?.length ? (
        <div style={{ textAlign: "center", padding: "3rem", background: C.navy, borderRadius: 12, border: `1px solid ${C.border}` }}>
          <p style={{ color: C.textMuted }}>No phases defined yet. Add the 4 LAI project phases to populate the client's progress tracker.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {phases.map((phase: any) => (
            <div key={phase.id} style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ background: statusColors[phase.status] || C.slate, color: "#fff", padding: "0.2rem 0.6rem", borderRadius: 4, fontSize: "0.7rem", fontWeight: 600 }}>Phase {phase.phaseNumber}</span>
                  <h4 style={{ color: C.text, fontSize: "1rem", fontWeight: 600, margin: 0 }}>{phase.phaseName}</h4>
                </div>
                <button onClick={() => handleEdit(phase)} style={{ padding: "0.4rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.silver, cursor: "pointer", fontSize: "0.8rem" }}>Edit</button>
              </div>
              <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ background: C.slate, borderRadius: 4, height: 8, overflow: "hidden" }}>
                    <div style={{ background: statusColors[phase.status], height: "100%", width: `${phase.completionPercent}%`, transition: "width 0.3s" }} />
                  </div>
                </div>
                <span style={{ color: C.gold, fontWeight: 600, fontSize: "0.9rem", fontFamily: "'JetBrains Mono', monospace" }}>{phase.completionPercent}%</span>
                <span style={{ color: statusColors[phase.status], fontSize: "0.8rem", fontWeight: 500 }}>{phase.status.replace(/_/g, " ")}</span>
              </div>
              {phase.startDate && <p style={{ color: C.textMuted, fontSize: "0.75rem", marginTop: "0.5rem" }}>Started: {new Date(phase.startDate).toLocaleDateString()}{phase.targetEndDate && ` — Target: ${new Date(phase.targetEndDate).toLocaleDateString()}`}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PANEL: Recovery Opportunities ────────────────────────────────────────────
function RecoveryPanel({ projectId }: { projectId: number }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "avoided_replacement", description: "", amount: "", status: "identified", responsibleParty: "", dueDate: "", notes: "" });

  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.clientPortal.listRecoveryItems.useQuery({ projectId });
  const createMutation = trpc.clientPortal.createRecoveryItem.useMutation({ onSuccess: () => { utils.clientPortal.listRecoveryItems.invalidate({ projectId }); setShowForm(false); setForm({ category: "avoided_replacement", description: "", amount: "", status: "identified", responsibleParty: "", dueDate: "", notes: "" }); } });
  const deleteMutation = trpc.clientPortal.deleteRecoveryItem.useMutation({ onSuccess: () => { utils.clientPortal.listRecoveryItems.invalidate({ projectId }); } });
  const updateMutation = trpc.clientPortal.updateRecoveryItem.useMutation({ onSuccess: () => { utils.clientPortal.listRecoveryItems.invalidate({ projectId }); } });

  const categoryLabels: Record<string, string> = { avoided_replacement: "Avoided Replacement", sale_disposal: "Sale/Disposal", insurance_tax_exposure: "Insurance/Tax Exposure", maintenance_elimination: "Maintenance Elimination", licensing_elimination: "Licensing Elimination", idle_capital: "Idle Capital", redeployment: "Redeployment", disposal_recommendation: "Disposal Recommendation", other: "Other" };
  const statusColors: Record<string, string> = { identified: "#94A3B8", under_investigation: "#3B82F6", awaiting_validation: "#F59E0B", approved: "#10B981", in_progress: "#8B5CF6", realized: "#059669", rejected: "#EF4444", closed: "#6B7280" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <p style={{ color: C.textMuted, fontSize: "0.85rem", margin: 0 }}>Financial recovery opportunities identified during the engagement.</p>
        <button onClick={() => setShowForm(true)} style={{ padding: "0.5rem 1rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>+ Add Recovery Item</button>
      </div>

      {showForm && (
        <div style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ color: C.text, fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Add Recovery Opportunity</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem" }}>
                {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Amount ($) *</label><input type="text" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="50000" style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} /></div>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Responsible Party</label><input type="text" value={form.responsibleParty} onChange={(e) => setForm({ ...form, responsibleParty: e.target.value })} placeholder="Name" style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} /></div>
          </div>
          <div style={{ marginBottom: "1rem" }}><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Description</label><textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", resize: "vertical", boxSizing: "border-box" }} /></div>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button onClick={() => setShowForm(false)} style={{ padding: "0.5rem 1rem", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer" }}>Cancel</button>
            <button onClick={() => createMutation.mutate({ projectId, category: form.category as any, amount: form.amount, description: form.description || undefined, responsibleParty: form.responsibleParty || undefined, dueDate: form.dueDate || undefined, notes: form.notes || undefined })} disabled={!form.amount || createMutation.isPending} style={{ padding: "0.5rem 1.25rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, fontWeight: 600, cursor: "pointer" }}>{createMutation.isPending ? "Saving..." : "Save"}</button>
          </div>
        </div>
      )}

      {isLoading ? <div style={{ textAlign: "center", padding: "2rem", color: C.textMuted }}>Loading...</div> : !items?.length ? (
        <div style={{ textAlign: "center", padding: "3rem", background: C.navy, borderRadius: 12, border: `1px solid ${C.border}` }}><p style={{ color: C.textMuted }}>No recovery items yet.</p></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {items.map((item: any) => (
            <div key={item.id} style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ background: statusColors[item.status] || C.slate, color: "#fff", padding: "0.15rem 0.5rem", borderRadius: 4, fontSize: "0.65rem", fontWeight: 600 }}>{item.status.replace(/_/g, " ")}</span>
                  <span style={{ color: C.text, fontWeight: 600, fontSize: "0.9rem" }}>{categoryLabels[item.category] || item.category}</span>
                </div>
                {item.description && <p style={{ color: C.textMuted, fontSize: "0.8rem", margin: "0.25rem 0 0" }}>{item.description}</p>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ color: C.gold, fontWeight: 700, fontSize: "1.1rem", fontFamily: "'JetBrains Mono', monospace" }}>${Number(item.amount).toLocaleString()}</span>
                <select value={item.status} onChange={(e) => updateMutation.mutate({ id: item.id, status: e.target.value as any })} style={{ padding: "0.3rem 0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontSize: "0.75rem" }}>
                  <option value="identified">Identified</option><option value="under_investigation">Under Investigation</option><option value="awaiting_validation">Awaiting Validation</option><option value="approved">Approved</option><option value="in_progress">In Progress</option><option value="realized">Realized</option><option value="rejected">Rejected</option><option value="closed">Closed</option>
                </select>
                <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: item.id }); }} style={{ padding: "0.3rem 0.5rem", background: "transparent", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 4, color: "#EF4444", cursor: "pointer", fontSize: "0.75rem" }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PANEL: Risks & Exceptions ────────────────────────────────────────────────
function RisksPanel({ projectId }: { projectId: number }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ riskType: "high_value_missing", riskLevel: "medium", description: "", location: "", financialExposure: "", recommendedAction: "", responsibleParty: "", dueDate: "" });

  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.clientPortal.listRisks.useQuery({ projectId });
  const createMutation = trpc.clientPortal.createRisk.useMutation({ onSuccess: () => { utils.clientPortal.listRisks.invalidate({ projectId }); setShowForm(false); } });
  const deleteMutation = trpc.clientPortal.deleteRisk.useMutation({ onSuccess: () => { utils.clientPortal.listRisks.invalidate({ projectId }); } });
  const updateMutation = trpc.clientPortal.updateRisk.useMutation({ onSuccess: () => { utils.clientPortal.listRisks.invalidate({ projectId }); } });

  const riskTypeLabels: Record<string, string> = { high_value_missing: "High-Value Missing", no_custodian: "No Custodian", uninsured: "Uninsured", no_documentation: "No Documentation", unauthorized_location: "Unauthorized Location", duplicate_purchase: "Duplicate Purchase", obsolete_equipment: "Obsolete Equipment", cybersecurity: "Cybersecurity", compliance: "Compliance", pending_decision: "Pending Decision", other: "Other" };
  const levelColors: Record<string, string> = { critical: "#EF4444", high: "#F97316", medium: "#F59E0B", low: "#10B981" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <p style={{ color: C.textMuted, fontSize: "0.85rem", margin: 0 }}>Risk items and exceptions requiring attention or client awareness.</p>
        <button onClick={() => setShowForm(true)} style={{ padding: "0.5rem 1rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>+ Add Risk</button>
      </div>

      {showForm && (
        <div style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ color: C.text, fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Add Risk / Exception</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Risk Type *</label>
              <select value={form.riskType} onChange={(e) => setForm({ ...form, riskType: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem" }}>
                {Object.entries(riskTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Risk Level *</label>
              <select value={form.riskLevel} onChange={(e) => setForm({ ...form, riskLevel: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem" }}>
                <option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
              </select>
            </div>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Financial Exposure ($)</label><input type="text" value={form.financialExposure} onChange={(e) => setForm({ ...form, financialExposure: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Description</label><textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", resize: "vertical", boxSizing: "border-box" }} /></div>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Recommended Action</label><textarea rows={2} value={form.recommendedAction} onChange={(e) => setForm({ ...form, recommendedAction: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", resize: "vertical", boxSizing: "border-box" }} /></div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button onClick={() => setShowForm(false)} style={{ padding: "0.5rem 1rem", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer" }}>Cancel</button>
            <button onClick={() => createMutation.mutate({ projectId, riskType: form.riskType as any, riskLevel: form.riskLevel as any, description: form.description || undefined, location: form.location || undefined, financialExposure: form.financialExposure || undefined, recommendedAction: form.recommendedAction || undefined, responsibleParty: form.responsibleParty || undefined, dueDate: form.dueDate || undefined })} disabled={createMutation.isPending} style={{ padding: "0.5rem 1.25rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, fontWeight: 600, cursor: "pointer" }}>{createMutation.isPending ? "Saving..." : "Save"}</button>
          </div>
        </div>
      )}

      {isLoading ? <div style={{ textAlign: "center", padding: "2rem", color: C.textMuted }}>Loading...</div> : !items?.length ? (
        <div style={{ textAlign: "center", padding: "3rem", background: C.navy, borderRadius: 12, border: `1px solid ${C.border}` }}><p style={{ color: C.textMuted }}>No risks or exceptions recorded.</p></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {items.map((item: any) => (
            <div key={item.id} style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem", borderLeft: `4px solid ${levelColors[item.riskLevel]}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <span style={{ background: levelColors[item.riskLevel], color: "#fff", padding: "0.15rem 0.5rem", borderRadius: 4, fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase" }}>{item.riskLevel}</span>
                    <span style={{ color: C.text, fontWeight: 600, fontSize: "0.9rem" }}>{riskTypeLabels[item.riskType] || item.riskType}</span>
                  </div>
                  {item.description && <p style={{ color: C.textMuted, fontSize: "0.8rem", margin: "0.25rem 0 0" }}>{item.description}</p>}
                  {item.financialExposure && <p style={{ color: "#F59E0B", fontSize: "0.8rem", margin: "0.25rem 0 0" }}>Exposure: ${Number(item.financialExposure).toLocaleString()}</p>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <select value={item.status} onChange={(e) => updateMutation.mutate({ id: item.id, status: e.target.value as any })} style={{ padding: "0.3rem 0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontSize: "0.75rem" }}>
                    <option value="open">Open</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option><option value="accepted">Accepted</option><option value="escalated">Escalated</option>
                  </select>
                  <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: item.id }); }} style={{ padding: "0.3rem 0.5rem", background: "transparent", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 4, color: "#EF4444", cursor: "pointer", fontSize: "0.75rem" }}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PANEL: Tasks & Approvals ─────────────────────────────────────────────────
function TasksPanel({ projectId }: { projectId: number }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ actionType: "document_approval", title: "", description: "", priority: "normal", assignedTo: "", dueDate: "" });

  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.clientPortal.listActionItems.useQuery({ projectId });
  const createMutation = trpc.clientPortal.createActionItem.useMutation({ onSuccess: () => { utils.clientPortal.listActionItems.invalidate({ projectId }); setShowForm(false); setForm({ actionType: "document_approval", title: "", description: "", priority: "normal", assignedTo: "", dueDate: "" }); } });
  const deleteMutation = trpc.clientPortal.deleteActionItem.useMutation({ onSuccess: () => { utils.clientPortal.listActionItems.invalidate({ projectId }); } });
  const updateMutation = trpc.clientPortal.updateActionItem.useMutation({ onSuccess: () => { utils.clientPortal.listActionItems.invalidate({ projectId }); } });

  const actionTypeLabels: Record<string, string> = { document_approval: "Document Approval", question: "Question", asset_clarification: "Asset Clarification", milestone_acceptance: "Milestone Acceptance", change_order: "Change Order", meeting_confirmation: "Meeting Confirmation", corrective_action: "Corrective Action", upload_document: "Upload Document", other: "Other" };
  const priorityColors: Record<string, string> = { urgent: "#EF4444", high: "#F97316", normal: "#3B82F6", low: "#10B981" };
  const statusColors: Record<string, string> = { pending: "#F59E0B", in_review: "#3B82F6", approved: "#10B981", rejected: "#EF4444", completed: "#059669", overdue: "#DC2626" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <p style={{ color: C.textMuted, fontSize: "0.85rem", margin: 0 }}>Action items and approvals that require client response or attention.</p>
        <button onClick={() => setShowForm(true)} style={{ padding: "0.5rem 1rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>+ Add Task</button>
      </div>

      {showForm && (
        <div style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ color: C.text, fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Create Task / Approval Request</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Type *</label>
              <select value={form.actionType} onChange={(e) => setForm({ ...form, actionType: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem" }}>
                {Object.entries(actionTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem" }}>
                <option value="urgent">Urgent</option><option value="high">High</option><option value="normal">Normal</option><option value="low">Low</option>
              </select>
            </div>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Due Date</label><input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} /></div>
          </div>
          <div style={{ marginBottom: "1rem" }}><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Title *</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Approve Phase 1 Report" style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} /></div>
          <div style={{ marginBottom: "1rem" }}><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Description</label><textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", resize: "vertical", boxSizing: "border-box" }} /></div>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button onClick={() => setShowForm(false)} style={{ padding: "0.5rem 1rem", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer" }}>Cancel</button>
            <button onClick={() => createMutation.mutate({ projectId, actionType: form.actionType as any, title: form.title, description: form.description || undefined, priority: form.priority as any, assignedTo: form.assignedTo || undefined, dueDate: form.dueDate || undefined })} disabled={!form.title.trim() || createMutation.isPending} style={{ padding: "0.5rem 1.25rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, fontWeight: 600, cursor: "pointer" }}>{createMutation.isPending ? "Saving..." : "Create Task"}</button>
          </div>
        </div>
      )}

      {isLoading ? <div style={{ textAlign: "center", padding: "2rem", color: C.textMuted }}>Loading...</div> : !items?.length ? (
        <div style={{ textAlign: "center", padding: "3rem", background: C.navy, borderRadius: 12, border: `1px solid ${C.border}` }}><p style={{ color: C.textMuted }}>No tasks or approvals created.</p></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {items.map((item: any) => (
            <div key={item.id} style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <span style={{ background: priorityColors[item.priority], color: "#fff", padding: "0.15rem 0.5rem", borderRadius: 4, fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase" }}>{item.priority}</span>
                    <span style={{ background: statusColors[item.status] || C.slate, color: "#fff", padding: "0.15rem 0.5rem", borderRadius: 4, fontSize: "0.65rem", fontWeight: 600 }}>{item.status.replace(/_/g, " ")}</span>
                    <span style={{ color: C.text, fontWeight: 600, fontSize: "0.9rem" }}>{item.title}</span>
                  </div>
                  <p style={{ color: C.textMuted, fontSize: "0.75rem", margin: "0.25rem 0 0" }}>{actionTypeLabels[item.actionType]}{item.dueDate && ` — Due: ${new Date(item.dueDate).toLocaleDateString()}`}</p>
                  {item.response && <p style={{ color: "#10B981", fontSize: "0.8rem", margin: "0.5rem 0 0", fontStyle: "italic" }}>Client response: {item.response}</p>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <select value={item.status} onChange={(e) => updateMutation.mutate({ id: item.id, status: e.target.value as any })} style={{ padding: "0.3rem 0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontSize: "0.75rem" }}>
                    <option value="pending">Pending</option><option value="in_review">In Review</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="completed">Completed</option><option value="overdue">Overdue</option>
                  </select>
                  <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: item.id }); }} style={{ padding: "0.3rem 0.5rem", background: "transparent", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 4, color: "#EF4444", cursor: "pointer", fontSize: "0.75rem" }}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PANEL: Reports & Deliverables ────────────────────────────────────────────
function ReportsPanel({ projectId }: { projectId: number }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ reportType: "executive_assessment", title: "", version: "1.0", status: "draft" });
  const fileRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.clientPortal.listReports.useQuery({ projectId });
  const createMutation = trpc.clientPortal.createReport.useMutation({ onSuccess: () => { utils.clientPortal.listReports.invalidate({ projectId }); setShowForm(false); setForm({ reportType: "executive_assessment", title: "", version: "1.0", status: "draft" }); } });
  const deleteMutation = trpc.clientPortal.deleteReport.useMutation({ onSuccess: () => { utils.clientPortal.listReports.invalidate({ projectId }); } });
  const updateMutation = trpc.clientPortal.updateReport.useMutation({ onSuccess: () => { utils.clientPortal.listReports.invalidate({ projectId }); } });

  const reportTypeLabels: Record<string, string> = { executive_assessment: "Executive Assessment", verification_analysis: "Verification Analysis", reconciled_far: "Reconciled FAR", discrepancy_matrix: "Discrepancy Matrix", inventory_master_log: "Inventory Master Log", recovery_register: "Recovery Register", governance_scorecard: "Governance Scorecard", risk_exception_report: "Risk Exception Report", location_report: "Location Report", asset_photographs: "Asset Photographs", meeting_summary: "Meeting Summary", final_presentation: "Final Presentation", technology_plan: "Technology Plan", quarterly_report: "Quarterly Report", other: "Other" };
  const statusColors: Record<string, string> = { draft: "#94A3B8", in_review: "#3B82F6", final: "#10B981", superseded: "#6B7280" };

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", String(projectId));
    try {
      const resp = await fetch("/api/trpc/assets.uploadProjectDocument", { method: "POST", body: formData, credentials: "include" });
      const result = await resp.json();
      if (result?.result?.data) {
        createMutation.mutate({ projectId, reportType: form.reportType as any, title: form.title || file.name, version: form.version, status: form.status as any, storageKey: result.result.data.storageKey, storageUrl: result.result.data.storageUrl, fileName: file.name });
      }
    } catch { alert("Upload failed"); }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <p style={{ color: C.textMuted, fontSize: "0.85rem", margin: 0 }}>Reports and deliverables shared with the client through their dashboard.</p>
        <button onClick={() => setShowForm(true)} style={{ padding: "0.5rem 1rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>+ Add Report</button>
      </div>

      {showForm && (
        <div style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ color: C.text, fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Add Report / Deliverable</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Report Type *</label>
              <select value={form.reportType} onChange={(e) => setForm({ ...form, reportType: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem" }}>
                {Object.entries(reportTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Version</label><input type="text" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} /></div>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem" }}>
                <option value="draft">Draft</option><option value="in_review">In Review</option><option value="final">Final</option><option value="superseded">Superseded</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: "1rem" }}><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Title *</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Phase 1 Executive Assessment Report" style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} /></div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Attach File (optional)</label>
            <input ref={fileRef} type="file" onChange={handleFileUpload} style={{ color: C.silver, fontSize: "0.85rem" }} />
          </div>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button onClick={() => setShowForm(false)} style={{ padding: "0.5rem 1rem", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer" }}>Cancel</button>
            <button onClick={() => createMutation.mutate({ projectId, reportType: form.reportType as any, title: form.title, version: form.version, status: form.status as any })} disabled={!form.title.trim() || createMutation.isPending} style={{ padding: "0.5rem 1.25rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, fontWeight: 600, cursor: "pointer" }}>{createMutation.isPending ? "Saving..." : "Save (No File)"}</button>
          </div>
        </div>
      )}

      {isLoading ? <div style={{ textAlign: "center", padding: "2rem", color: C.textMuted }}>Loading...</div> : !items?.length ? (
        <div style={{ textAlign: "center", padding: "3rem", background: C.navy, borderRadius: 12, border: `1px solid ${C.border}` }}><p style={{ color: C.textMuted }}>No reports added yet.</p></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {items.map((item: any) => (
            <div key={item.id} style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ background: statusColors[item.status] || C.slate, color: "#fff", padding: "0.15rem 0.5rem", borderRadius: 4, fontSize: "0.65rem", fontWeight: 600 }}>{item.status.replace(/_/g, " ")}</span>
                  <span style={{ color: C.text, fontWeight: 600, fontSize: "0.9rem" }}>{item.title}</span>
                  <span style={{ color: C.textMuted, fontSize: "0.75rem" }}>v{item.version}</span>
                </div>
                <p style={{ color: C.textMuted, fontSize: "0.75rem", margin: "0.25rem 0 0" }}>{reportTypeLabels[item.reportType]}{item.fileName && ` — ${item.fileName}`}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {item.storageUrl && <a href={item.storageUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "0.3rem 0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 4, color: C.gold, textDecoration: "none", fontSize: "0.75rem" }}>Download</a>}
                <select value={item.status} onChange={(e) => updateMutation.mutate({ id: item.id, status: e.target.value as any })} style={{ padding: "0.3rem 0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontSize: "0.75rem" }}>
                  <option value="draft">Draft</option><option value="in_review">In Review</option><option value="final">Final</option><option value="superseded">Superseded</option>
                </select>
                <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: item.id }); }} style={{ padding: "0.3rem 0.5rem", background: "transparent", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 4, color: "#EF4444", cursor: "pointer", fontSize: "0.75rem" }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PANEL: Meetings & Messages ───────────────────────────────────────────────
function MeetingsPanel({ projectId }: { projectId: number }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ meetingType: "status_update", title: "", scheduledDate: "", duration: "60", location: "", agenda: "", attendees: "" });

  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.clientPortal.listMeetings.useQuery({ projectId });
  const createMutation = trpc.clientPortal.createMeeting.useMutation({ onSuccess: () => { utils.clientPortal.listMeetings.invalidate({ projectId }); setShowForm(false); setForm({ meetingType: "status_update", title: "", scheduledDate: "", duration: "60", location: "", agenda: "", attendees: "" }); } });
  const deleteMutation = trpc.clientPortal.deleteMeeting.useMutation({ onSuccess: () => { utils.clientPortal.listMeetings.invalidate({ projectId }); } });
  const updateMutation = trpc.clientPortal.updateMeeting.useMutation({ onSuccess: () => { utils.clientPortal.listMeetings.invalidate({ projectId }); } });

  const meetingTypeLabels: Record<string, string> = { kickoff: "Kickoff", status_update: "Status Update", review: "Review", qbr: "QBR", ad_hoc: "Ad Hoc", final: "Final" };
  const statusColors: Record<string, string> = { scheduled: "#3B82F6", completed: "#10B981", cancelled: "#EF4444", rescheduled: "#F59E0B" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <p style={{ color: C.textMuted, fontSize: "0.85rem", margin: 0 }}>Schedule and manage meetings visible on the client dashboard.</p>
        <button onClick={() => setShowForm(true)} style={{ padding: "0.5rem 1rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>+ Schedule Meeting</button>
      </div>

      {showForm && (
        <div style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ color: C.text, fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Schedule Meeting</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Type</label>
              <select value={form.meetingType} onChange={(e) => setForm({ ...form, meetingType: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem" }}>
                {Object.entries(meetingTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Date & Time</label><input type="datetime-local" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} /></div>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Duration (min)</label><input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} /></div>
          </div>
          <div style={{ marginBottom: "1rem" }}><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Title *</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Weekly Status Update" style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Location / Link</label><input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Teams link or address" style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} /></div>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Attendees (comma-separated)</label><input type="text" value={form.attendees} onChange={(e) => setForm({ ...form, attendees: e.target.value })} placeholder="John, Jane, Kevin" style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} /></div>
          </div>
          <div style={{ marginBottom: "1rem" }}><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Agenda</label><textarea rows={3} value={form.agenda} onChange={(e) => setForm({ ...form, agenda: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", resize: "vertical", boxSizing: "border-box" }} /></div>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button onClick={() => setShowForm(false)} style={{ padding: "0.5rem 1rem", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer" }}>Cancel</button>
            <button onClick={() => createMutation.mutate({ projectId, meetingType: form.meetingType as any, title: form.title, scheduledDate: form.scheduledDate || undefined, duration: +form.duration || undefined, location: form.location || undefined, attendees: form.attendees ? form.attendees.split(",").map((s) => s.trim()) : undefined, agenda: form.agenda || undefined })} disabled={!form.title.trim() || createMutation.isPending} style={{ padding: "0.5rem 1.25rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, fontWeight: 600, cursor: "pointer" }}>{createMutation.isPending ? "Saving..." : "Schedule"}</button>
          </div>
        </div>
      )}

      {isLoading ? <div style={{ textAlign: "center", padding: "2rem", color: C.textMuted }}>Loading...</div> : !items?.length ? (
        <div style={{ textAlign: "center", padding: "3rem", background: C.navy, borderRadius: 12, border: `1px solid ${C.border}` }}><p style={{ color: C.textMuted }}>No meetings scheduled.</p></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {items.map((item: any) => (
            <div key={item.id} style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <span style={{ background: statusColors[item.status] || C.slate, color: "#fff", padding: "0.15rem 0.5rem", borderRadius: 4, fontSize: "0.65rem", fontWeight: 600 }}>{item.status}</span>
                    <span style={{ color: C.text, fontWeight: 600, fontSize: "0.9rem" }}>{item.title}</span>
                  </div>
                  <p style={{ color: C.textMuted, fontSize: "0.75rem", margin: "0.25rem 0 0" }}>
                    {meetingTypeLabels[item.meetingType]} — {item.scheduledDate ? new Date(item.scheduledDate).toLocaleString() : "TBD"}{item.duration && ` (${item.duration} min)`}{item.location && ` — ${item.location}`}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <select value={item.status} onChange={(e) => updateMutation.mutate({ id: item.id, status: e.target.value as any })} style={{ padding: "0.3rem 0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontSize: "0.75rem" }}>
                    <option value="scheduled">Scheduled</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="rescheduled">Rescheduled</option>
                  </select>
                  <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: item.id }); }} style={{ padding: "0.3rem 0.5rem", background: "transparent", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 4, color: "#EF4444", cursor: "pointer", fontSize: "0.75rem" }}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PANEL: Billing & Invoicing ───────────────────────────────────────────────
function BillingPanel({ projectId }: { projectId: number }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ itemType: "invoice", description: "", amount: "", status: "pending", invoiceNumber: "", dueDate: "", notes: "" });

  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.clientPortal.listBillingItems.useQuery({ projectId });
  const createMutation = trpc.clientPortal.createBillingItem.useMutation({ onSuccess: () => { utils.clientPortal.listBillingItems.invalidate({ projectId }); setShowForm(false); setForm({ itemType: "invoice", description: "", amount: "", status: "pending", invoiceNumber: "", dueDate: "", notes: "" }); } });
  const deleteMutation = trpc.clientPortal.deleteBillingItem.useMutation({ onSuccess: () => { utils.clientPortal.listBillingItems.invalidate({ projectId }); } });
  const updateMutation = trpc.clientPortal.updateBillingItem.useMutation({ onSuccess: () => { utils.clientPortal.listBillingItems.invalidate({ projectId }); } });

  const itemTypeLabels: Record<string, string> = { invoice: "Invoice", payment: "Payment", change_order: "Change Order", credit: "Credit" };
  const statusColors: Record<string, string> = { pending: "#F59E0B", sent: "#3B82F6", paid: "#10B981", overdue: "#EF4444", cancelled: "#6B7280", approved: "#059669", rejected: "#DC2626" };

  function printInvoice(item: any) {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Invoice ${item.invoiceNumber || ""}</title><style>
      body { font-family: 'Source Sans 3', Arial, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; color: #1E293B; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; border-bottom: 3px solid #1E3A5F; padding-bottom: 1.5rem; }
      .logo { font-size: 1.5rem; font-weight: 700; color: #1E3A5F; font-family: 'Playfair Display', serif; }
      .logo-sub { font-size: 0.75rem; color: #64748B; letter-spacing: 0.1em; text-transform: uppercase; }
      .invoice-title { text-align: right; }
      .invoice-title h1 { font-size: 2rem; color: #1E3A5F; margin: 0; }
      .invoice-title p { color: #64748B; margin: 0.25rem 0 0; }
      .details { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
      .details h3 { color: #1E3A5F; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 0.5rem; }
      .details p { margin: 0.2rem 0; color: #475569; font-size: 0.9rem; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
      th { background: #1E3A5F; color: white; padding: 0.75rem 1rem; text-align: left; font-size: 0.8rem; text-transform: uppercase; }
      td { padding: 0.75rem 1rem; border-bottom: 1px solid #E2E8F0; font-size: 0.9rem; }
      .total-row td { font-weight: 700; font-size: 1.1rem; border-top: 2px solid #1E3A5F; }
      .footer { text-align: center; color: #64748B; font-size: 0.8rem; margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #E2E8F0; }
      .status { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 4px; font-weight: 600; font-size: 0.8rem; }
      .status-paid { background: #D1FAE5; color: #065F46; }
      .status-pending { background: #FEF3C7; color: #92400E; }
      .status-overdue { background: #FEE2E2; color: #991B1B; }
      .status-sent { background: #DBEAFE; color: #1E40AF; }
      @media print { body { padding: 0; } .no-print { display: none; } }
    </style></head><body>
      <div class="header">
        <div><div class="logo">Legacy Asset Intelligence</div><div class="logo-sub">Executive Asset Consulting</div></div>
        <div class="invoice-title"><h1>INVOICE</h1><p>${item.invoiceNumber || "N/A"}</p></div>
      </div>
      <div class="details">
        <div><h3>Invoice Details</h3><p><strong>Date:</strong> ${new Date(item.createdAt).toLocaleDateString()}</p><p><strong>Due Date:</strong> ${item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "Upon Receipt"}</p><p><strong>Status:</strong> <span class="status status-${item.status}">${item.status.toUpperCase()}</span></p></div>
        <div><h3>From</h3><p><strong>Legacy Asset Intelligence</strong></p><p>Executive Asset Consulting</p><p>kevin.runion@legacyassetintelligence.com</p></div>
      </div>
      <table><thead><tr><th>Description</th><th>Type</th><th style="text-align:right">Amount</th></tr></thead><tbody>
        <tr><td>${item.description}</td><td>${itemTypeLabels[item.itemType]}</td><td style="text-align:right">$${Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td></tr>
        ${item.notes ? `<tr><td colspan="3" style="color:#64748B;font-size:0.8rem;font-style:italic">Note: ${item.notes}</td></tr>` : ""}
      </tbody><tfoot><tr class="total-row"><td colspan="2">Total Due</td><td style="text-align:right">$${Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td></tr></tfoot></table>
      <div class="footer"><p>Thank you for your business.</p><p>Legacy Asset Intelligence — Recover Hidden Capital. Strengthen Financial Accountability.</p></div>
      <div class="no-print" style="text-align:center;margin-top:1rem"><button onclick="window.print()" style="padding:0.75rem 2rem;background:#1E3A5F;color:white;border:none;border-radius:6px;font-size:1rem;cursor:pointer">Print Invoice</button></div>
    </body></html>`);
    win.document.close();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <p style={{ color: C.textMuted, fontSize: "0.85rem", margin: 0 }}>Invoices, payments, and billing information for this engagement.</p>
        <button onClick={() => setShowForm(true)} style={{ padding: "0.5rem 1rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>+ Add Billing Item</button>
      </div>

      {showForm && (
        <div style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ color: C.text, fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Add Billing Item</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Type *</label>
              <select value={form.itemType} onChange={(e) => setForm({ ...form, itemType: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem" }}>
                {Object.entries(itemTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Amount ($) *</label><input type="text" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="5000.00" style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} /></div>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Invoice #</label><input type="text" value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} placeholder="INV-001" style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} /></div>
            <div><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Due Date</label><input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} /></div>
          </div>
          <div style={{ marginBottom: "1rem" }}><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Description *</label><input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Phase 1 Discovery & Assessment" style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", boxSizing: "border-box" }} /></div>
          <div style={{ marginBottom: "1rem" }}><label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem" }}>Notes</label><textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem", resize: "vertical", boxSizing: "border-box" }} /></div>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button onClick={() => setShowForm(false)} style={{ padding: "0.5rem 1rem", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer" }}>Cancel</button>
            <button onClick={() => createMutation.mutate({ projectId, itemType: form.itemType as any, description: form.description, amount: form.amount, status: form.status as any, invoiceNumber: form.invoiceNumber || undefined, dueDate: form.dueDate || undefined, notes: form.notes || undefined })} disabled={!form.description.trim() || !form.amount || createMutation.isPending} style={{ padding: "0.5rem 1.25rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, fontWeight: 600, cursor: "pointer" }}>{createMutation.isPending ? "Saving..." : "Save"}</button>
          </div>
        </div>
      )}

      {isLoading ? <div style={{ textAlign: "center", padding: "2rem", color: C.textMuted }}>Loading...</div> : !items?.length ? (
        <div style={{ textAlign: "center", padding: "3rem", background: C.navy, borderRadius: 12, border: `1px solid ${C.border}` }}><p style={{ color: C.textMuted }}>No billing items yet.</p></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {items.map((item: any) => (
            <div key={item.id} style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ background: statusColors[item.status] || C.slate, color: "#fff", padding: "0.15rem 0.5rem", borderRadius: 4, fontSize: "0.65rem", fontWeight: 600 }}>{item.status}</span>
                  <span style={{ color: C.text, fontWeight: 600, fontSize: "0.9rem" }}>{item.description}</span>
                  {item.invoiceNumber && <span style={{ color: C.textMuted, fontSize: "0.75rem" }}>#{item.invoiceNumber}</span>}
                </div>
                <p style={{ color: C.textMuted, fontSize: "0.75rem", margin: "0.25rem 0 0" }}>{itemTypeLabels[item.itemType]}{item.dueDate && ` — Due: ${new Date(item.dueDate).toLocaleDateString()}`}{item.paidDate && ` — Paid: ${new Date(item.paidDate).toLocaleDateString()}`}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ color: C.gold, fontWeight: 700, fontSize: "1.1rem", fontFamily: "'JetBrains Mono', monospace" }}>${Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                <button onClick={() => printInvoice(item)} style={{ padding: "0.3rem 0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 4, color: C.silver, cursor: "pointer", fontSize: "0.75rem" }}>🖨️ Print</button>
                <select value={item.status} onChange={(e) => updateMutation.mutate({ id: item.id, status: e.target.value as any })} style={{ padding: "0.3rem 0.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontSize: "0.75rem" }}>
                  <option value="pending">Pending</option><option value="sent">Sent</option><option value="paid">Paid</option><option value="overdue">Overdue</option><option value="cancelled">Cancelled</option>
                </select>
                <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: item.id }); }} style={{ padding: "0.3rem 0.5rem", background: "transparent", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 4, color: "#EF4444", cursor: "pointer", fontSize: "0.75rem" }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
