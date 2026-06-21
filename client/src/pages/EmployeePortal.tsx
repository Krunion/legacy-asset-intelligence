import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { COLORS } from "@shared/colors";

const C = COLORS;
const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663776896878/TfZTrDNPnnG2dF7hgZeTPt/lai-hero-2oLJZvt3jJ23DVAW3Npj4G.webp";

export default function EmployeePortal() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [selectedResource, setSelectedResource] = useState<string | null>(null);

  // If still loading auth state, show loading screen
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "left center", backgroundAttachment: "fixed", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#E8E9EB", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", background: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "left center", backgroundAttachment: "fixed", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div style={{ width: "100%", maxWidth: 400, background: "rgba(15, 20, 25, 0.85)", borderRadius: 12, border: "1px solid rgba(255, 255, 255, 0.1)", padding: "2rem", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5rem", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              Employee Portal
            </h1>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#E8E9EB", margin: 0, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
              Access LAI resources and tools
            </p>
          </div>

          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#E8E9EB", lineHeight: 1.6, marginBottom: "1.5rem", textAlign: "center", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
            Sign in with your LAI account to access the employee portal and work on spreadsheets.
          </p>

          <a href="/api/oauth/microsoft/login" style={{ textDecoration: "none" }}>
            <button
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "#0078D4",
                color: "white",
                border: "none",
                borderRadius: 6,
                fontFamily: "'Source Sans 3', sans-serif",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.9rem",
                marginBottom: "0.75rem",
              }}
            >
              Sign In with Microsoft 365
            </button>
          </a>

          <div style={{ textAlign: "center", margin: "1rem 0", color: "#E8E9EB", fontSize: "0.85rem", fontFamily: "'Source Sans 3', sans-serif" }}>
            or
          </div>

          <a href={getLoginUrl()} style={{ textDecoration: "none" }}>
            <button
              style={{
                width: "100%",
                padding: "0.75rem",
                background: C.gold,
                color: C.charcoal,
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

          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "#E8E9EB", textAlign: "center", marginTop: "1rem", margin: 0, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
            Use your Microsoft 365 business account or LAI account to access this portal.
          </p>
        </div>
      </div>
    );
  }

  // Resources with Office 365 Online embedding
  const resources = [
    {
      id: "proposal-calculator",
      title: "Proposal Calculator",
      description: "Interactive tool for calculating client recovery opportunities and ROI",
      icon: "📊",
      type: "Spreadsheet",
      fileSize: "37 KB",
      fileType: "Excel",
      officeUrl: "https://legacyassetintelligence-my.sharepoint.com/personal/kevin_runion_legacyassetintelligence_com/_layouts/15/Doc.aspx?sourcedoc=%7B2_LAI_Proposal_Calculator%7D&action=edit",
      storageLink: "/manus-storage/2_LAI_Proposal_Calculator_34ef0147.xlsx",
    },
    {
      id: "asset-intelligence",
      title: "Asset Intelligence Assessment",
      description: "Comprehensive workbook for evaluating client asset management maturity",
      icon: "📋",
      type: "Spreadsheet",
      fileSize: "297 KB",
      fileType: "Excel",
      officeUrl: "https://legacyassetintelligence-my.sharepoint.com/personal/kevin_runion_legacyassetintelligence_com/_layouts/15/Doc.aspx?sourcedoc=%7B1_Asset_Intelligence_Opportunity_Assessment%7D&action=edit",
      storageLink: "/manus-storage/1_Asset_Intelligence_Opportunity_Assessment_Actual_f8e86b8a.xlsx",
    },
    {
      id: "recoverable-capital",
      title: "Recoverable Capital Assessment",
      description: "Detailed framework for modeling capital recovery scenarios",
      icon: "💰",
      type: "Spreadsheet",
      fileSize: "33 KB",
      fileType: "Excel",
      officeUrl: "https://legacyassetintelligence-my.sharepoint.com/personal/kevin_runion_legacyassetintelligence_com/_layouts/15/Doc.aspx?sourcedoc=%7B3_Recoverable_Capital_Assessment%7D&action=edit",
      storageLink: "/manus-storage/3_Recoverable_Capital_Assessment_Workbook_Actual_36901809.xlsx",
    },
    {
      id: "investigative-questionnaire",
      title: "Investigative Questionnaire",
      description: "Client discovery document for initial engagement assessment",
      icon: "📝",
      type: "Document",
      fileSize: "21 KB",
      fileType: "Word",
      officeUrl: "https://legacyassetintelligence-my.sharepoint.com/personal/kevin_runion_legacyassetintelligence_com/_layouts/15/Doc.aspx?sourcedoc=%7BLAIInvestigativeQuestionnaire%7D&action=edit",
      storageLink: "/manus-storage/LAIInvestigativeQuestionnaire_0f2db4d3.docx",
    },
    {
      id: "asset-panda",
      title: "Asset Panda Demo",
      description: "Access to Asset Panda platform demo for client demonstrations",
      icon: "🐼",
      type: "Platform",
      comingSoon: true,
    },
    {
      id: "ezo-integration",
      title: "EZO Integration",
      description: "EZO asset management platform integration and documentation",
      icon: "🔧",
      type: "Platform",
      comingSoon: true,
    },
  ];

  const selectedResourceData = resources.find(r => r.id === selectedResource);

  return (
    <div style={{ minHeight: "100vh", background: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "left center", backgroundAttachment: "fixed", padding: "2rem" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", padding: "1.5rem", background: "rgba(15, 20, 25, 0.85)", borderRadius: 12, border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "#FFFFFF", margin: 0, marginBottom: "0.25rem", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              Welcome, {user?.name || "Employee"}!
            </h1>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#E8E9EB", margin: 0, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
              Access your resources and tools
            </p>
          </div>
          <button
            onClick={logout}
            style={{
              padding: "0.6rem 1rem",
              background: C.gold,
              color: C.charcoal,
              border: "none",
              borderRadius: 6,
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            🚪 Logout
          </button>
        </div>

        {/* Main Content Area */}
        {selectedResourceData && !selectedResourceData.comingSoon ? (
          <div style={{ marginBottom: "2rem" }}>
            {/* Document Viewer Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", padding: "1rem", background: "rgba(15, 20, 25, 0.85)", borderRadius: 12, border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <button
                  onClick={() => setSelectedResource(null)}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: 6,
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  ← Back to Resources
                </button>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#FFFFFF", margin: 0, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                  {selectedResourceData.title}
                </h2>
              </div>
              <a href={selectedResourceData.storageLink || "#"} download style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    background: C.gold,
                    color: C.charcoal,
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
              </a>
            </div>

            {/* Document Access Section */}
            <div style={{ background: "rgba(15, 20, 25, 0.85)", borderRadius: 12, border: "1px solid rgba(255, 255, 255, 0.1)", padding: "2rem", minHeight: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{selectedResourceData.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#FFFFFF", margin: "0 0 0.5rem 0", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                {selectedResourceData.title}
              </h3>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#E8E9EB", margin: "0 0 1.5rem 0", maxWidth: "500px", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
                {selectedResourceData.fileType} • {selectedResourceData.fileSize}
              </p>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#E8E9EB", lineHeight: 1.6, marginBottom: "1.5rem", maxWidth: "600px", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
                Use the <strong>Download</strong> button above to save this file to your computer, or click <strong>Open in Browser</strong> to access it directly.
              </p>
              <a href={selectedResourceData.storageLink || "#"} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: C.gold,
                    color: C.charcoal,
                    border: "none",
                    borderRadius: 6,
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  🔗 Open in Browser
                </button>
              </a>
            </div>

            {/* Info Section */}
            <div style={{ marginTop: "1.5rem", padding: "1.5rem", background: "rgba(15, 20, 25, 0.85)", borderRadius: 12, border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5rem", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                {selectedResourceData.title}
              </h3>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#E8E9EB", lineHeight: 1.8, margin: 0, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
                {selectedResourceData.description}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Resources Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  style={{
                    padding: "1.5rem",
                    background: "rgba(15, 20, 25, 0.3)",
                    border: `1px solid rgba(255, 255, 255, 0.2)`,
                    borderRadius: 12,
                    cursor: resource.comingSoon ? "default" : "pointer",
                    transition: "all 0.3s ease",
                    opacity: resource.comingSoon ? 0.6 : 1,
                    backdropFilter: "blur(10px)",
                  }}
                  onClick={() => !resource.comingSoon && setSelectedResource(resource.id)}
                  onMouseEnter={(e) => {
                    if (!resource.comingSoon) {
                      (e.currentTarget as HTMLElement).style.background = "rgba(15, 20, 25, 0.5)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(245, 158, 11, 0.4)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(30,58,95,0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(15, 20, 25, 0.3)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255, 255, 255, 0.2)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                    <div style={{ fontSize: "2.5rem" }}>{resource.icon}</div>
                    <span style={{
                      background: resource.comingSoon ? "rgba(100, 116, 139, 0.3)" : "rgba(245, 158, 11, 0.2)",
                      color: resource.comingSoon ? "#94A3B8" : C.gold,
                      padding: "0.3rem 0.6rem",
                      borderRadius: 4,
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      border: `1px solid ${resource.comingSoon ? "rgba(100, 116, 139, 0.4)" : "rgba(245, 158, 11, 0.4)"}`,
                    }}>
                      {resource.type}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5rem", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
                    {resource.title}
                  </h3>

                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#E8E9EB", marginBottom: "1rem", lineHeight: 1.5, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
                    {resource.description}
                  </p>

                  {!resource.comingSoon && (
                    <div style={{ fontSize: "0.8rem", color: "#E8E9EB", marginBottom: "1rem", display: "flex", gap: "1rem", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
                      <span>📦 {resource.fileSize}</span>
                      <span>📄 {resource.fileType}</span>
                    </div>
                  )}

                  {resource.comingSoon ? (
                    <div style={{ padding: "0.75rem", background: "rgba(13, 148, 136, 0.15)", borderRadius: 6, textAlign: "center", border: "1px solid rgba(13, 148, 136, 0.3)" }}>
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
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#0F9488";
                        (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = C.teal;
                        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                      }}
                    >
                      📂 Access
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Info Section */}
            <div style={{ padding: "1.5rem", background: "rgba(15, 20, 25, 0.85)", borderRadius: 12, border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1rem", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                Portal Information
              </h2>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#E8E9EB", lineHeight: 1.8, marginBottom: "1rem", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
                This employee portal provides secure access to all essential LAI resources and tools. You can access spreadsheets directly in your browser, edit data for calculations, and download results for executive reporting.
              </p>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#E8E9EB", lineHeight: 1.8, margin: 0, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
                For questions or technical support, please contact the LAI support team at support@legacyassetintelligence.com.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
