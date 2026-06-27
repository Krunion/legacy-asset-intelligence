import PageLayout from "@/components/PageLayout";
import { COLORS } from "@shared/colors";
import { useLocation } from "wouter";

const C = COLORS;

export default function Resources() {
  const [, navigate] = useLocation();

  const resources = [
    {
      category: "Downloadable Guide",
      title: "Ghost Asset Identification Checklist",
      description: "A comprehensive 50-point checklist for identifying potential ghost assets across your organization's fixed asset register. Includes department-specific indicators and red flags.",
      format: "PDF",
      pages: "12 pages"
    },
    {
      category: "Framework",
      title: "Asset Accountability Maturity Model",
      description: "Our proprietary five-level maturity framework for evaluating your organization's asset management sophistication. Includes self-assessment scoring and improvement roadmap.",
      format: "PDF",
      pages: "18 pages"
    },
    {
      category: "Template",
      title: "Capital Recovery Business Case Template",
      description: "A ready-to-use executive presentation template for building an internal business case for asset intelligence investment. Includes ROI calculations and benchmark data.",
      format: "PPTX",
      pages: "24 slides"
    },
    {
      category: "Research Report",
      title: "2025 State of Enterprise Asset Management",
      description: "Annual research report covering industry trends, technology adoption rates, ghost asset prevalence by sector, and best practices from leading organizations.",
      format: "PDF",
      pages: "42 pages"
    },
    {
      category: "Methodology Overview",
      title: "The LAI Four-Phase Methodology",
      description: "Detailed overview of our proprietary four-phase approach to ghost asset elimination and governance implementation. Includes timelines, deliverables, and expected outcomes.",
      format: "PDF",
      pages: "16 pages"
    },
    {
      category: "Industry Brief",
      title: "Regulatory Compliance & Asset Accountability",
      description: "A guide to regulatory requirements (SOX, GASB, IFRS) related to fixed asset management and how proper asset accountability supports compliance objectives.",
      format: "PDF",
      pages: "10 pages"
    }
  ];

  const videos = [
    {
      title: "Introduction to Ghost Assets",
      duration: "2:05",
      description: "Overview of what ghost assets are, why they matter, and how organizations can begin addressing them."
    },
    {
      title: "The Executive Assessment Process",
      duration: "Coming Soon",
      description: "Walk-through of our Phase 1 discovery and executive assessment methodology."
    },
    {
      title: "Technology-Enabled Asset Governance",
      duration: "Coming Soon",
      description: "How modern platforms and IoT technology transform asset accountability from reactive to proactive."
    }
  ];

  return (
    <PageLayout
      heroTitle="Resources & Tools"
      heroSubtitle="Frameworks, templates, and educational materials to support your asset intelligence journey"
      ctaTitle="Need Custom Materials?"
      ctaDescription="Our team can develop industry-specific resources tailored to your organization's needs."
      ctaButtonText="Request Custom Materials"
    >
      {/* Downloadable Resources */}
      <div style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: C.text, marginBottom: "1.5rem", borderLeft: `3px solid ${C.gold}`, paddingLeft: "1rem" }}>
          Downloadable Resources
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
          {resources.map((resource, i) => (
            <div key={i} style={{ 
              padding: "1.75rem", 
              background: C.slate, 
              border: `1px solid ${C.border}`, 
              borderRadius: 8,
              display: "flex",
              flexDirection: "column"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold }}>
                  {resource.category}
                </span>
                <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", color: C.textMuted, background: C.navy, padding: "0.2rem 0.5rem", borderRadius: 3 }}>
                  {resource.format} · {resource.pages}
                </span>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem", lineHeight: 1.35 }}>
                {resource.title}
              </h3>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.85rem", lineHeight: 1.6, flex: 1 }}>
                {resource.description}
              </p>
              <button
                onClick={() => navigate("/contact")}
                style={{ 
                  marginTop: "1.25rem", 
                  background: "transparent", 
                  border: `1px solid ${C.gold}`, 
                  color: C.gold, 
                  padding: "0.5rem 1rem", 
                  borderRadius: 4, 
                  fontFamily: "'Source Sans 3', sans-serif", 
                  fontSize: "0.8rem", 
                  fontWeight: 600,
                  transition: "all 0.2s",
                  width: "fit-content"
                }}
              >
                Request Access
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Videos */}
      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: C.text, marginBottom: "1.5rem", borderLeft: `3px solid ${C.gold}`, paddingLeft: "1rem" }}>
          Educational Videos
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {videos.map((video, i) => (
            <div key={i} style={{ 
              padding: "1.5rem", 
              background: C.slate, 
              border: `1px solid ${C.border}`, 
              borderRadius: 8 
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: C.text }}>
                  {video.title}
                </h3>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: C.gold }}>
                  {video.duration}
                </span>
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>
                {video.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge Base CTA */}
      <div style={{ padding: "2.5rem", background: C.goldMuted, borderRadius: 8, border: `1px solid rgba(201,168,76,0.2)`, textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem" }}>
          Knowledge Base
        </h2>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.silver, fontSize: "0.95rem", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 1.5rem" }}>
          Our full knowledge base includes detailed methodology documentation, industry-specific guides, technology integration playbooks, and governance framework templates.
        </p>
        <button
          onClick={() => navigate("/contact")}
          style={{ background: C.gold, color: C.charcoal, border: "none", padding: "0.75rem 1.5rem", borderRadius: 4, fontSize: "0.9rem", fontWeight: 600 }}
        >
          Contact Us for Access
        </button>
      </div>
    </PageLayout>
  );
}
