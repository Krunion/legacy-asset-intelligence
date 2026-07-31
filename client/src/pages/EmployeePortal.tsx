import { useState } from "react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { COLORS } from "@shared/colors";
import ProposalCalculator from "@/components/portal/ProposalCalculator";
import InvestigativeQuestionnaire from "@/components/portal/InvestigativeQuestionnaire";
import AssetIntelligenceAssessment from "@/components/portal/AssetIntelligenceAssessment";
import RecoverableCapitalAssessment from "@/components/portal/RecoverableCapitalAssessment";
import ExecutiveAssessmentForm from "@/components/portal/ExecutiveAssessmentForm";
import CorporateFinanceCalculator from "@/components/portal/CorporateFinanceCalculator";
import DepreciationCalculator from "@/components/portal/DepreciationCalculator";
import SalvageValueCalculator from "@/components/portal/SalvageValueCalculator";

const C = COLORS;
const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663776896878/TfZTrDNPnnG2dF7hgZeTPt/lai-hero-2oLJZvt3jJ23DVAW3Npj4G.webp";

type ActiveTool = null | "proposal-calculator" | "asset-intelligence" | "recoverable-capital" | "investigative-questionnaire" | "executive-assessment" | "corporate-finance-calculator" | "depreciation-calculator" | "salvage-value-calculator";

export default function EmployeePortal() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);

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
            Sign in with your LAI account to access the employee portal and interactive tools.
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
              Sign In
            </button>
          </a>

          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "#E8E9EB", textAlign: "center", marginTop: "1rem", margin: 0, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
            Use your Microsoft 365 business account or LAI account to access this portal.
          </p>
        </div>
      </div>
    );
  }

  // If a tool is active, render it full-screen with white background
  if (activeTool) {
    return (
      <div className="portal-calculator-container" style={{ minHeight: "100vh", background: "white", color: "#1E293B" }}>
        {activeTool === "proposal-calculator" && <ProposalCalculator onBack={() => setActiveTool(null)} />}
        {activeTool === "asset-intelligence" && <AssetIntelligenceAssessment onBack={() => setActiveTool(null)} />}
        {activeTool === "recoverable-capital" && <RecoverableCapitalAssessment onBack={() => setActiveTool(null)} />}
        {activeTool === "investigative-questionnaire" && <InvestigativeQuestionnaire onBack={() => setActiveTool(null)} />}
        {activeTool === "executive-assessment" && <ExecutiveAssessmentForm onBack={() => setActiveTool(null)} />}
        {activeTool === "corporate-finance-calculator" && <CorporateFinanceCalculator onBack={() => setActiveTool(null)} />}
        {activeTool === "depreciation-calculator" && <DepreciationCalculator onBack={() => setActiveTool(null)} />}
        {activeTool === "salvage-value-calculator" && <SalvageValueCalculator onBack={() => setActiveTool(null)} />}
      </div>
    );
  }

  // Resources
  const resources = [
    {
      id: "proposal-calculator" as ActiveTool,
      title: "Proposal Calculator",
      description: "Generate professional branded proposals with phase-by-phase pricing, ROI projections, and client signature lines",
      icon: "📊",
      type: "Interactive Tool",
      action: "Open Calculator",
    },
    {
      id: "asset-intelligence" as ActiveTool,
      title: "Asset Intelligence Assessment",
      description: "Score client asset management maturity across inventory, technology, governance, and financial categories",
      icon: "📋",
      type: "Interactive Tool",
      action: "Start Assessment",
    },
    {
      id: "recoverable-capital" as ActiveTool,
      title: "Recoverable Capital Assessment",
      description: "Estimate recoverable capital based on asset value, ghost assets, insurance, maintenance, and tax overpayment",
      icon: "💰",
      type: "Interactive Tool",
      action: "Run Assessment",
    },
    {
      id: "investigative-questionnaire" as ActiveTool,
      title: "Client Interview Questionnaire",
      description: "8-section structured interview covering Executive Priorities, Asset Lifecycle, FAR Accuracy, Exceptions, Inventory, Systems/Governance, Outcomes, and Scope",
      icon: "📝",
      type: "Interactive Tool",
      action: "Open Questionnaire",
    },
    {
      id: "executive-assessment" as ActiveTool,
      title: "Executive Assessment Form",
      description: "Phase 1 discovery form capturing client asset management state, financial exposure, technology maturity, and engagement readiness",
      icon: "🎯",
      type: "Interactive Tool",
      action: "Start Assessment",
    },
    {
      id: "corporate-finance-calculator" as ActiveTool,
      title: "Corporate Finance Calculator",
      description: "Calculate ROI, NPV, IRR, and payback periods for client engagements with dynamic financial modeling",
      icon: "💹",
      type: "Interactive Tool",
      action: "Open Calculator",
    },
    {
      id: "depreciation-calculator" as ActiveTool,
      title: "Depreciation Calculator",
      description: "Full item depreciation calculator with 8 methods: Straight-Line, DDB, 150% DB, SYD, Units of Production, MACRS, Section 179, and Bonus Depreciation",
      icon: "📉",
      type: "Interactive Tool",
      action: "Open Calculator",
    },
    {
      id: "salvage-value-calculator" as ActiveTool,
      title: "Salvage Value Calculator",
      description: "Multi-method salvage value estimation with condition analysis, industry benchmarks, IRS tables, and useful life projections",
      icon: "🏷️",
      type: "Interactive Tool",
      action: "Open Calculator",
    },
    {
      id: "asset-management" as ActiveTool,
      title: "Asset Management System",
      description: "Full asset register with barcode/QR generation, photo capture, label printing, and CSV import/export",
      icon: "📦",
      type: "Platform",
      action: "Open System",
      comingSoon: false,
      link: "/assets",
    },

  ];

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
              Access your interactive tools and resources
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

        {/* Resources Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          {resources.map((resource, idx) => (
            <div
              key={idx}
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
              onClick={() => { if (resource.comingSoon) return; if ((resource as any).link) { window.location.href = (resource as any).link; } else if (resource.id) { setActiveTool(resource.id); } }}
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
                  background: resource.comingSoon ? "rgba(100, 116, 139, 0.3)" : "rgba(13, 148, 136, 0.2)",
                  color: resource.comingSoon ? "#94A3B8" : C.teal,
                  padding: "0.3rem 0.6rem",
                  borderRadius: 4,
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  border: `1px solid ${resource.comingSoon ? "rgba(100, 116, 139, 0.4)" : "rgba(13, 148, 136, 0.4)"}`,
                }}>
                  {resource.type || "Platform"}
                </span>
              </div>

              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#F5F7FA", marginBottom: "0.5rem" }}>
                {resource.title}
              </h3>

              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#C8D0D8", marginBottom: "1rem", lineHeight: 1.5 }}>
                {resource.description}
              </p>

              <button
                disabled={resource.comingSoon}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  background: resource.comingSoon ? "rgba(100, 116, 139, 0.2)" : C.gold,
                  color: resource.comingSoon ? "#94A3B8" : C.charcoal,
                  border: "none",
                  borderRadius: 6,
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontWeight: 600,
                  cursor: resource.comingSoon ? "default" : "pointer",
                  fontSize: "0.85rem",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!resource.comingSoon) {
                    (e.currentTarget as HTMLElement).style.background = "#DFC06A";
                    (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!resource.comingSoon) {
                    (e.currentTarget as HTMLElement).style.background = C.gold;
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                  }
                }}
              >
                {resource.comingSoon ? "Coming Soon" : resource.action}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "2rem", color: "#E8E9EB", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
          <p>Legacy Asset Intelligence — Employee Portal</p>
          <p style={{ margin: "0.5rem 0 0 0" }}>Confidential tools for LAI staff and authorized partners</p>
        </div>
      </div>
    </div>
  );
}
