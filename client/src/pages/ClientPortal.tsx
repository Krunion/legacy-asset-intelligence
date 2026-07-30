import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { COLORS } from "@shared/colors";

const C = COLORS;

// Logo
const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663776896878/TfZTrDNPnnG2dF7hgZeTPt/lai-logo-5QXNLUsEDRp3nBVBAMiXK4.webp";

type PortalView = "login" | "dashboard" | "change-password";

export default function ClientPortal() {
  const [view, setView] = useState<PortalView>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [session, setSession] = useState<{
    accountId: number;
    accessToken: string;
    clientName: string;
    dashboardTitle: string | null;
    projectId: number;
    username: string;
  } | null>(null);

  // Check for token in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setSession({ accountId: 0, accessToken: token, clientName: "", dashboardTitle: null, projectId: 0, username: "" });
    }
  }, []);

  // Token-based login query
  const tokenParam = new URLSearchParams(window.location.search).get("token");
  const tokenQuery = trpc.clientPortal.loginByToken.useQuery(
    { token: tokenParam || "" },
    { enabled: !!tokenParam && !session?.projectId }
  );

  useEffect(() => {
    if (tokenQuery.data) {
      setSession({
        accountId: tokenQuery.data.accountId,
        accessToken: tokenParam!,
        clientName: tokenQuery.data.clientName,
        dashboardTitle: tokenQuery.data.dashboardTitle,
        projectId: tokenQuery.data.projectId,
        username: tokenQuery.data.username,
      });
      setView("dashboard");
    }
  }, [tokenQuery.data]);

  // Login mutation
  const loginMutation = trpc.clientPortal.clientLogin.useMutation({
    onSuccess: (data) => {
      setSession({
        accountId: data.accountId,
        accessToken: data.accessToken!,
        clientName: data.clientName,
        dashboardTitle: data.dashboardTitle,
        projectId: data.projectId,
        username,
      });
      setView("dashboard");
      setLoginError("");
    },
    onError: (err) => {
      setLoginError(err.message);
    },
  });

  // Password change
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  const changePwMutation = trpc.clientPortal.changePassword.useMutation({
    onSuccess: () => {
      setPwSuccess(true);
      setPwError("");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    },
    onError: (err) => {
      setPwError(err.message);
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setLoginError("Please enter both username and password.");
      return;
    }
    loginMutation.mutate({ username: username.trim(), password });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      setPwError("New passwords do not match.");
      return;
    }
    if (newPw.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    changePwMutation.mutate({
      username: session!.username,
      currentPassword: currentPw,
      newPassword: newPw,
    });
  };

  const handleLogout = () => {
    setSession(null);
    setView("login");
    setUsername("");
    setPassword("");
    // Clear token from URL
    window.history.replaceState({}, "", window.location.pathname);
  };

  // ─── LOGIN VIEW ────────────────────────────────────────────────────────────
  if (view === "login") {
    return (
      <div style={{ minHeight: "100vh", background: C.charcoal, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative" }}>
        {/* Back to main site */}
        <a
          href="/"
          style={{ position: "absolute", top: "1.5rem", left: "1.5rem", display: "flex", alignItems: "center", gap: "0.4rem", color: C.silver, textDecoration: "none", fontSize: "0.85rem", opacity: 0.8, transition: "opacity 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Back to Main Site
        </a>
        <div style={{ width: "100%", maxWidth: 420, background: C.navy, borderRadius: 16, border: `1px solid ${C.border}`, padding: "2.5rem", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <img src={LOGO_IMG} alt="LAI" style={{ height: 50, marginBottom: "1rem" }} />
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.text, margin: "0 0 0.25rem" }}>
              Client Portal
            </h1>
            <p style={{ color: C.textMuted, fontSize: "0.85rem", margin: 0 }}>
              Access your executive asset dashboard
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", color: C.silver, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                style={{ width: "100%", padding: "0.75rem 1rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", color: C.silver, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ width: "100%", padding: "0.75rem 1rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {loginError && (
              <p style={{ color: "#EF4444", fontSize: "0.85rem", marginBottom: "1rem", textAlign: "center" }}>{loginError}</p>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              style={{ width: "100%", padding: "0.85rem", background: C.gold, border: "none", borderRadius: 8, color: C.charcoal, fontWeight: 700, fontSize: "1rem", cursor: loginMutation.isPending ? "not-allowed" : "pointer", opacity: loginMutation.isPending ? 0.7 : 1 }}
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", color: C.textMuted, fontSize: "0.8rem", marginTop: "1.5rem" }}>
            Credentials provided by Legacy Asset Intelligence
          </p>
        </div>
      </div>
    );
  }

  // ─── CHANGE PASSWORD VIEW ──────────────────────────────────────────────────
  if (view === "change-password") {
    return (
      <div style={{ minHeight: "100vh", background: C.charcoal, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: 420, background: C.navy, borderRadius: 16, border: `1px solid ${C.border}`, padding: "2.5rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, marginBottom: "1.5rem", textAlign: "center" }}>
            Change Password
          </h2>

          {pwSuccess ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#10B981", fontSize: "1rem", marginBottom: "1rem" }}>Password changed successfully!</p>
              <button onClick={() => { setView("dashboard"); setPwSuccess(false); }} style={{ padding: "0.6rem 1.5rem", background: C.gold, border: "none", borderRadius: 8, color: C.charcoal, fontWeight: 600, cursor: "pointer" }}>
                Return to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", color: C.silver, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.4rem" }}>Current Password</label>
                <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} style={{ width: "100%", padding: "0.7rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", color: C.silver, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.4rem" }}>New Password</label>
                <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} style={{ width: "100%", padding: "0.7rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", color: C.silver, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.4rem" }}>Confirm New Password</label>
                <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} style={{ width: "100%", padding: "0.7rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
              </div>

              {pwError && <p style={{ color: "#EF4444", fontSize: "0.85rem", marginBottom: "1rem" }}>{pwError}</p>}

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button type="button" onClick={() => setView("dashboard")} style={{ flex: 1, padding: "0.7rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 8, color: C.silver, cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={changePwMutation.isPending} style={{ flex: 1, padding: "0.7rem", background: C.gold, border: "none", borderRadius: 8, color: C.charcoal, fontWeight: 600, cursor: "pointer" }}>
                  {changePwMutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ─── DASHBOARD VIEW ────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.charcoal }}>
      {/* Header */}
      <header style={{ background: C.navy, borderBottom: `1px solid ${C.border}`, padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: C.silver, textDecoration: "none", fontSize: "0.8rem", padding: "0.3rem 0.6rem", background: C.slate, borderRadius: 6, border: `1px solid ${C.border}` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            Main Site
          </a>
          <img src={LOGO_IMG} alt="LAI" style={{ height: 36 }} />
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: C.text, margin: 0 }}>
              {session?.dashboardTitle || "Executive Dashboard"}
            </h1>
            <p style={{ color: C.textMuted, fontSize: "0.75rem", margin: 0 }}>
              Welcome, {session?.clientName}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button onClick={() => setView("change-password")} style={{ padding: "0.5rem 1rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.silver, cursor: "pointer", fontSize: "0.8rem" }}>
            Change Password
          </button>
          <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer", fontSize: "0.8rem" }}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Dashboard Content */}
      {session?.projectId ? (
        <ClientDashboardContent projectId={session.projectId} accessToken={session.accessToken} />
      ) : (
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <p style={{ color: C.textMuted }}>Loading dashboard...</p>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard Content Component ──────────────────────────────────────────────
function ClientDashboardContent({ projectId, accessToken }: { projectId: number; accessToken: string }) {
  const { data, isLoading, error } = trpc.clientPortal.getDashboardData.useQuery(
    { projectId, accessToken },
    { refetchInterval: 30000 } // Refresh every 30s
  );

  if (isLoading) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${C.border}`, borderTopColor: C.gold, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
        <p style={{ color: C.textMuted }}>Loading dashboard data...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <p style={{ color: "#EF4444" }}>Error loading dashboard: {error.message}</p>
      </div>
    );
  }

  if (!data) return null;

  const statusColors: Record<string, string> = {
    active: "#10B981",
    inactive: "#6B7280",
    disposed: "#EF4444",
    in_repair: "#F59E0B",
    lost: "#DC2626",
    transferred: "#8B5CF6",
    dam_op: "#F97316",
    dam_inop: "#DC2626",
  };

  const conditionColors: Record<string, string> = {
    new: "#10B981",
    excellent: "#34D399",
    good: "#60A5FA",
    fair: "#FBBF24",
    poor: "#F97316",
    salvage: "#EF4444",
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 1400, margin: "0 auto" }}>
      {/* Project Info Banner */}
      <div style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem 2rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.text, margin: "0 0 0.25rem" }}>
              {data.project.name}
            </h2>
            <p style={{ color: C.textMuted, fontSize: "0.85rem", margin: 0 }}>
              {data.project.clientName} — {data.project.industry || "General"} — {data.project.location || ""}
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <span style={{ padding: "0.3rem 0.75rem", background: data.project.status === "active" ? "rgba(16,185,129,0.15)" : "rgba(107,114,128,0.15)", border: `1px solid ${data.project.status === "active" ? "#10B981" : "#6B7280"}`, borderRadius: 20, color: data.project.status === "active" ? "#10B981" : "#6B7280", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase" }}>
              {data.project.status}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        <StatCard label="Total Assets" value={data.stats.totalAssets.toLocaleString()} color={C.gold} />
        <StatCard label="Active Assets" value={data.stats.activeAssets.toLocaleString()} color="#10B981" />
        <StatCard label="Total Value" value={`$${data.stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} color={C.silver} />
        <StatCard label="Categories" value={(data.categoryBreakdown?.length || 0).toString()} color="#8B5CF6" />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* Status Breakdown */}
        <div style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem" }}>
          <h3 style={{ color: C.text, fontSize: "1rem", fontWeight: 600, marginBottom: "1.25rem" }}>Asset Status</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {data.statusBreakdown.map((s) => {
              const pct = data.stats.totalAssets > 0 ? (s.count / data.stats.totalAssets) * 100 : 0;
              return (
                <div key={s.status}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <span style={{ color: C.silver, fontSize: "0.8rem", textTransform: "capitalize" }}>{s.status.replace("_", " ")}</span>
                    <span style={{ color: C.textMuted, fontSize: "0.8rem" }}>{s.count} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div style={{ height: 6, background: C.slate, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: statusColors[s.status] || C.gold, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Condition Breakdown */}
        <div style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem" }}>
          <h3 style={{ color: C.text, fontSize: "1rem", fontWeight: 600, marginBottom: "1.25rem" }}>Asset Condition</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {data.conditionBreakdown.map((c) => {
              const pct = data.stats.totalAssets > 0 ? (c.count / data.stats.totalAssets) * 100 : 0;
              return (
                <div key={c.condition}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <span style={{ color: C.silver, fontSize: "0.8rem", textTransform: "capitalize" }}>{c.condition}</span>
                    <span style={{ color: C.textMuted, fontSize: "0.8rem" }}>{c.count} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div style={{ height: 6, background: C.slate, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: conditionColors[c.condition] || C.gold, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Assets Table */}
      <div style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${C.border}` }}>
          <h3 style={{ color: C.text, fontSize: "1rem", fontWeight: 600, margin: 0 }}>Recent Assets</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", color: C.textMuted, fontWeight: 600 }}>Tag</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", color: C.textMuted, fontWeight: 600 }}>Name</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", color: C.textMuted, fontWeight: 600 }}>Status</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", color: C.textMuted, fontWeight: 600 }}>Condition</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", color: C.textMuted, fontWeight: 600 }}>Location</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "right", color: C.textMuted, fontWeight: 600 }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {data.recentAssets.map((asset) => (
                <tr key={asset.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "0.6rem 1rem", color: C.gold, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}>{asset.assetTag}</td>
                  <td style={{ padding: "0.6rem 1rem", color: C.text }}>{asset.name}</td>
                  <td style={{ padding: "0.6rem 1rem" }}>
                    <span style={{ padding: "0.2rem 0.5rem", background: `${statusColors[asset.status] || C.textMuted}20`, color: statusColors[asset.status] || C.textMuted, borderRadius: 4, fontSize: "0.75rem", fontWeight: 600, textTransform: "capitalize" }}>
                      {asset.status.replace("_", " ")}
                    </span>
                  </td>
                  <td style={{ padding: "0.6rem 1rem" }}>
                    <span style={{ color: conditionColors[asset.condition] || C.textMuted, fontSize: "0.8rem", textTransform: "capitalize" }}>
                      {asset.condition}
                    </span>
                  </td>
                  <td style={{ padding: "0.6rem 1rem", color: C.textMuted }}>{asset.location || "—"}</td>
                  <td style={{ padding: "0.6rem 1rem", color: C.silver, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>
                    {asset.acquisitionCost ? `$${parseFloat(asset.acquisitionCost).toLocaleString()}` : "—"}
                  </td>
                </tr>
              ))}
              {data.recentAssets.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: C.textMuted }}>No assets recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "2rem 0", color: C.textMuted, fontSize: "0.75rem" }}>
        <p>Powered by Legacy Asset Intelligence — Executive Asset Governance</p>
      </div>
    </div>
  );
}

// ─── Stat Card Component ──────────────────────────────────────────────────────
function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.25rem 1.5rem" }}>
      <p style={{ color: C.textMuted, fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.5rem" }}>{label}</p>
      <p style={{ color, fontSize: "1.6rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", margin: 0 }}>{value}</p>
    </div>
  );
}
