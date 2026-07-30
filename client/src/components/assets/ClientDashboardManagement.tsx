import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { COLORS } from "@shared/colors";

const C = COLORS;

export default function ClientDashboardManagement({ projectId, projectName }: { projectId: number; projectName: string }) {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    dashboardTitle: "",
  });
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPw, setCopiedPw] = useState(false);

  const utils = trpc.useUtils();
  const { data: dashboards, isLoading } = trpc.clientPortal.listDashboards.useQuery({ projectId });

  const createMutation = trpc.clientPortal.createDashboard.useMutation({
    onSuccess: (data) => {
      utils.clientPortal.listDashboards.invalidate({ projectId });
      // Build full URL using the production domain
      const origin = window.location.origin;
      setCreatedLink(`${origin}${data.portalLink}`);
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
    // Auto-generate username from client name
    const autoUsername = form.clientName.trim().toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20) + Math.floor(Math.random() * 1000);
    createMutation.mutate({
      projectId,
      clientName: form.clientName.trim(),
      username: autoUsername,
      clientEmail: form.clientEmail.trim() || undefined,
      dashboardTitle: form.dashboardTitle.trim() || undefined,
    });
  }

  function handleResetPassword(id: number) {
    if (confirm("Generate a new password for this client? The old password will stop working.")) {
      resetPwMutation.mutate({ id });
    }
  }

  function copyToClipboard(text: string, type: "link" | "pw") {
    navigator.clipboard.writeText(text);
    if (type === "link") { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }
    else { setCopiedPw(true); setTimeout(() => setCopiedPw(false), 2000); }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.text, margin: "0 0 0.25rem" }}>
            Client Dashboard
          </h2>
          <p style={{ color: C.textMuted, fontSize: "0.85rem", margin: 0 }}>
            Create and manage client portal access for {projectName}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          style={{ padding: "0.6rem 1.25rem", background: C.gold, border: "none", borderRadius: 8, color: C.charcoal, fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}
        >
          + Create Client Dashboard
        </button>
      </div>

      {/* Success Banner */}
      {createdLink && (
        <div style={{ background: "rgba(16,185,129,0.1)", borderRadius: 12, border: "1px solid rgba(16,185,129,0.3)", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ color: "#10B981", fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Client Dashboard Created!</h3>
          <p style={{ color: C.silver, fontSize: "0.85rem", marginBottom: "0.75rem" }}>Share these credentials with your client:</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <label style={{ color: C.textMuted, fontSize: "0.8rem", fontWeight: 600, minWidth: 80 }}>Client Portal:</label>
              <code style={{ flex: 1, padding: "0.5rem 0.75rem", background: C.slate, borderRadius: 6, color: C.gold, fontSize: "0.8rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {createdLink}
              </code>
              <button onClick={() => copyToClipboard(createdLink, "link")} style={{ padding: "0.4rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: copiedLink ? "#10B981" : C.silver, cursor: "pointer", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                {copiedLink ? "Copied!" : "Copy"}
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <label style={{ color: C.textMuted, fontSize: "0.8rem", fontWeight: 600, minWidth: 80 }}>Password:</label>
              <code style={{ flex: 1, padding: "0.5rem 0.75rem", background: C.slate, borderRadius: 6, color: C.gold, fontSize: "0.8rem" }}>
                {createdPassword}
              </code>
              <button onClick={() => copyToClipboard(createdPassword!, "pw")} style={{ padding: "0.4rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: copiedPw ? "#10B981" : C.silver, cursor: "pointer", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                {copiedPw ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <p style={{ color: C.textMuted, fontSize: "0.75rem", marginTop: "1rem" }}>
            The client can change their password after first login. You and Chris will always have admin access regardless of their password.
          </p>
          <button onClick={() => { setCreatedLink(null); setCreatedPassword(null); }} style={{ marginTop: "0.75rem", padding: "0.4rem 1rem", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer", fontSize: "0.8rem" }}>
            Dismiss
          </button>
        </div>
      )}

      {/* Create Form */}
      {showCreate && (
        <div style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ color: C.text, fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Create Client Dashboard Access</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", color: C.silver, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Client Name *</label>
              <input
                type="text"
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                placeholder="e.g. Acme Corp"
                style={{ width: "100%", padding: "0.6rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", color: C.silver, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Client Email (optional)</label>
              <input
                type="email"
                value={form.clientEmail}
                onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                placeholder="client@example.com"
                style={{ width: "100%", padding: "0.6rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", color: C.silver, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Dashboard Title (optional)</label>
            <input
              type="text"
              value={form.dashboardTitle}
              onChange={(e) => setForm({ ...form, dashboardTitle: e.target.value })}
              placeholder={`Default: "${projectName} — Executive Dashboard"`}
              style={{ width: "100%", padding: "0.6rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <p style={{ color: C.textMuted, fontSize: "0.8rem", marginBottom: "1rem" }}>
            A username and generic password will be auto-generated. The client can change their password after login.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button onClick={() => setShowCreate(false)} style={{ padding: "0.5rem 1rem", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer" }}>
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!form.clientName.trim() || createMutation.isPending}
              style={{ padding: "0.5rem 1.25rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, fontWeight: 600, cursor: "pointer", opacity: !form.clientName.trim() ? 0.5 : 1 }}
            >
              {createMutation.isPending ? "Creating..." : "Create Dashboard"}
            </button>
          </div>
        </div>
      )}

      {/* Existing Dashboards */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: C.textMuted }}>Loading dashboards...</div>
      ) : !dashboards || dashboards.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: C.navy, borderRadius: 12, border: `1px solid ${C.border}` }}>
          <p style={{ color: C.textMuted, fontSize: "1rem", marginBottom: "0.5rem" }}>No client dashboards created</p>
          <p style={{ color: C.textMuted, fontSize: "0.85rem" }}>Create a client dashboard to give your client access to their executive asset overview.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {dashboards.map((dash: any) => (
            <div key={dash.id} style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h4 style={{ color: C.text, fontSize: "1rem", fontWeight: 600, margin: "0 0 0.25rem" }}>{dash.clientName}</h4>
                  <p style={{ color: C.textMuted, fontSize: "0.8rem", margin: "0 0 0.5rem" }}>
                    Username: <code style={{ color: C.gold }}>{dash.username}</code>
                    {dash.clientEmail && <> — {dash.clientEmail}</>}
                  </p>
                  <p style={{ color: C.textMuted, fontSize: "0.75rem", margin: 0 }}>
                    Created {new Date(dash.createdAt).toLocaleDateString()} — Last login: {dash.lastLogin ? new Date(dash.lastLogin).toLocaleString() : "Never"}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <a
                    href={`/client-portal?token=${dash.accessToken}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: "0.4rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.silver, textDecoration: "none", fontSize: "0.8rem" }}
                  >
                    View Dashboard
                  </a>
                  <button
                    onClick={() => {
                      const fullLink = `${window.location.origin}/client-portal?token=${dash.accessToken}`;
                      navigator.clipboard.writeText(fullLink);
                      alert(`Client Portal link copied:\n${fullLink}`);
                    }}
                    style={{ padding: "0.4rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.gold, cursor: "pointer", fontSize: "0.8rem" }}
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => handleResetPassword(dash.id)}
                    style={{ padding: "0.4rem 0.75rem", background: "transparent", border: `1px solid rgba(245,158,11,0.3)`, borderRadius: 6, color: "#F59E0B", cursor: "pointer", fontSize: "0.8rem" }}
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
