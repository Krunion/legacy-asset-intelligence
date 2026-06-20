import { useState } from "react";
import { Button } from "@/components/ui/button";

const C = {
  slate: "#1E3A5F",
  teal: "#0D9488",
  border: "#E2E8F0",
  text: "#1E293B",
  muted: "#64748B",
  bg: "#F8FAFC",
};

export default function EmployeePortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple validation - in production, this would call an API
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    // Mock login - in production, authenticate with backend
    setIsLoggedIn(true);
    setEmployeeName(email.split("@")[0]);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setEmployeeName("");
  };

  const resources = [
    {
      title: "Proposal Calculator",
      description: "Interactive tool for calculating client recovery opportunities and ROI",
      icon: "📊",
      type: "Tool",
      link: "#",
    },
    {
      title: "Asset Intelligence Assessment",
      description: "Comprehensive workbook for evaluating client asset management maturity",
      icon: "📋",
      type: "Spreadsheet",
      link: "#",
    },
    {
      title: "Recoverable Capital Assessment",
      description: "Detailed framework for modeling capital recovery scenarios",
      icon: "💰",
      type: "Spreadsheet",
      link: "#",
    },
    {
      title: "Investigative Questionnaire",
      description: "Client discovery document for initial engagement assessment",
      icon: "📝",
      type: "Document",
      link: "#",
    },
    {
      title: "Asset Panda Demo",
      description: "Access to Asset Panda platform demo for client demonstrations",
      icon: "🐼",
      type: "Platform (Coming Soon)",
      link: "#",
      comingSoon: true,
    },
    {
      title: "EZO Integration",
      description: "EZO asset management platform integration and documentation",
      icon: "🔧",
      type: "Platform (Coming Soon)",
      link: "#",
      comingSoon: true,
    },
  ];

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div style={{ width: "100%", maxWidth: 400, background: "white", borderRadius: 12, border: `1px solid ${C.border}`, padding: "2rem", boxShadow: "0 4px 16px rgba(30,58,95,0.1)" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: C.slate, marginBottom: "0.5rem" }}>
              Employee Portal
            </h1>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: C.muted, margin: 0 }}>
              Access LAI resources and tools
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ marginBottom: "1.5rem" }}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@legacyassetintelligence.com"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.9rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.9rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {error && (
              <div style={{ padding: "0.75rem", background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: 6, marginBottom: "1rem" }}>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#DC2626", margin: 0 }}>
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.75rem",
                background: C.teal,
                color: "white",
                border: "none",
                borderRadius: 6,
                fontFamily: "'Source Sans 3', sans-serif",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Sign In
            </button>
          </form>

          <div style={{ padding: "1rem", background: "rgba(13, 148, 136, 0.08)", borderRadius: 6, textAlign: "center" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: C.muted, margin: 0 }}>
              Demo: Use any email and password to access the portal
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "2rem" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", padding: "1.5rem", background: "white", borderRadius: 12, border: `1px solid ${C.border}` }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: C.slate, margin: 0, marginBottom: "0.25rem" }}>
              Welcome, {employeeName}!
            </h1>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: C.muted, margin: 0 }}>
              Access your resources and tools
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.6rem 1.2rem",
              background: "transparent",
              color: C.teal,
              border: `1px solid ${C.teal}`,
              borderRadius: 6,
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Sign Out
          </button>
        </div>

        {/* Resources Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {resources.map((resource, i) => (
            <div
              key={i}
              style={{
                padding: "1.5rem",
                background: "white",
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                cursor: resource.comingSoon ? "default" : "pointer",
                transition: "all 0.2s",
                opacity: resource.comingSoon ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!resource.comingSoon) {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(30,58,95,0.12)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                <div style={{ fontSize: "2.5rem" }}>{resource.icon}</div>
                <span style={{
                  background: resource.comingSoon ? "#E5E7EB" : C.teal,
                  color: resource.comingSoon ? C.muted : "white",
                  padding: "0.3rem 0.6rem",
                  borderRadius: 4,
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}>
                  {resource.type}
                </span>
              </div>

              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: C.slate, marginBottom: "0.5rem" }}>
                {resource.title}
              </h3>

              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: C.muted, marginBottom: "1rem", lineHeight: 1.5 }}>
                {resource.description}
              </p>

              {resource.comingSoon ? (
                <div style={{ padding: "0.75rem", background: "rgba(13, 148, 136, 0.08)", borderRadius: 6, textAlign: "center" }}>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: C.teal, fontWeight: 600, margin: 0 }}>
                    Coming Soon
                  </p>
                </div>
              ) : (
                <button
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    background: C.teal,
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  Access Resource
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div style={{ marginTop: "2rem", padding: "1.5rem", background: "white", borderRadius: 12, border: `1px solid ${C.border}` }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: C.slate, marginBottom: "1rem" }}>
            Portal Information
          </h2>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: C.text, lineHeight: 1.8, marginBottom: "1rem" }}>
            This employee portal provides access to all essential LAI resources and tools. You can download spreadsheets, access interactive calculators, and connect to partner platforms.
          </p>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: C.text, lineHeight: 1.8, margin: 0 }}>
            For questions or technical support, please contact the LAI support team at support@legacyassetintelligence.com.
          </p>
        </div>
      </div>
    </div>
  );
}
