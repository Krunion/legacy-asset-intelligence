import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

const C = {
  slate: "#1E3A5F",
  teal: "#0D9488",
  border: "#E2E8F0",
  text: "#1E293B",
  muted: "#64748B",
  bg: "#F8FAFC",
};

export default function EmployeePortal() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  // If still loading auth state, show loading screen
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.muted }}>Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
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

          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: C.text, lineHeight: 1.6, marginBottom: "1.5rem", textAlign: "center" }}>
            Sign in with your LAI account to access the employee portal and download resources.
          </p>

          <a href={getLoginUrl()} style={{ textDecoration: "none" }}>
            <button
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
              Sign In with Manus
            </button>
          </a>

          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: C.muted, textAlign: "center", marginTop: "1rem", margin: 0 }}>
            You must be an LAI employee to access this portal.
          </p>
        </div>
      </div>
    );
  }

  // Resources with S3 storage paths
  const resources = [
    {
      title: "Proposal Calculator",
      description: "Interactive tool for calculating client recovery opportunities and ROI",
      icon: "📊",
      type: "Spreadsheet",
      fileSize: "37 KB",
      fileType: "Excel",
      link: "/manus-storage/2_LAI_Proposal_Calculator_d59ad2ae.xlsx",
    },
    {
      title: "Asset Intelligence Assessment",
      description: "Comprehensive workbook for evaluating client asset management maturity",
      icon: "📋",
      type: "Spreadsheet",
      fileSize: "297 KB",
      fileType: "Excel",
      link: "/manus-storage/1_Asset_Intelligence_Opportunity_Assessment_Actual_2a67d78c.xlsx",
    },
    {
      title: "Recoverable Capital Assessment",
      description: "Detailed framework for modeling capital recovery scenarios",
      icon: "💰",
      type: "Spreadsheet",
      fileSize: "33 KB",
      fileType: "Excel",
      link: "/manus-storage/3_Recoverable_Capital_Assessment_Workbook_Actual_746c287c.xlsx",
    },
    {
      title: "Investigative Questionnaire",
      description: "Client discovery document for initial engagement assessment",
      icon: "📝",
      type: "Document",
      fileSize: "21 KB",
      fileType: "Word",
      link: "/manus-storage/LAIInvestigativeQuestionnaire_76a02885.docx",
    },
    {
      title: "Asset Panda Demo",
      description: "Access to Asset Panda platform demo for client demonstrations",
      icon: "🐼",
      type: "Platform",
      comingSoon: true,
    },
    {
      title: "EZO Integration",
      description: "EZO asset management platform integration and documentation",
      icon: "🔧",
      type: "Platform",
      comingSoon: true,
    },
  ];

  const handleDownload = (link: string, fileName: string) => {
    // Create a temporary link and trigger download
    const a = document.createElement("a");
    a.href = link;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "2rem" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", padding: "1.5rem", background: "white", borderRadius: 12, border: `1px solid ${C.border}` }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: C.slate, margin: 0, marginBottom: "0.25rem" }}>
              Welcome, {user?.name || "Employee"}!
            </h1>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: C.muted, margin: 0 }}>
              Access your resources and tools
            </p>
          </div>
          <button
            onClick={logout}
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

              {!resource.comingSoon && (
                <div style={{ fontSize: "0.8rem", color: C.muted, marginBottom: "1rem", display: "flex", gap: "1rem" }}>
                  <span>📦 {resource.fileSize}</span>
                  <span>📄 {resource.fileType}</span>
                </div>
              )}

              {resource.comingSoon ? (
                <div style={{ padding: "0.75rem", background: "rgba(13, 148, 136, 0.08)", borderRadius: 6, textAlign: "center" }}>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: C.teal, fontWeight: 600, margin: 0 }}>
                    Coming Soon
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => handleDownload(resource.link || "", resource.title)}
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
                  ⬇️ Download
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
            This employee portal provides secure access to all essential LAI resources and tools. You can download spreadsheets, access interactive calculators, and connect to partner platforms.
          </p>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: C.text, lineHeight: 1.8, margin: 0 }}>
            For questions or technical support, please contact the LAI support team at support@legacyassetintelligence.com.
          </p>
        </div>
      </div>
    </div>
  );
}
