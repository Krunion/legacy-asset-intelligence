import PageLayout from "@/components/PageLayout";
import { COLORS } from "@shared/colors";

const C = COLORS;

export default function Resources() {
  const resources = [
    {
      type: "White Paper",
      title: "The Ghost Asset Phenomenon: A $264B Market Opportunity",
      description: "Comprehensive analysis of the fixed asset management market, ghost asset prevalence across industries, and the business case for capital recovery initiatives.",
      pages: 24,
      industry: "All Industries"
    },
    {
      type: "Industry Report",
      title: "Healthcare Asset Management: Compliance and Capital Recovery",
      description: "Deep dive into asset management challenges specific to healthcare systems, regulatory requirements (HIPAA, SOX), and proven recovery methodologies.",
      pages: 18,
      industry: "Healthcare"
    },
    {
      type: "White Paper",
      title: "Manufacturing Asset Optimization: From Chaos to Control",
      description: "Guide to establishing asset accountability in multi-site manufacturing operations, managing equipment lifecycles, and preventing future ghost asset accumulation.",
      pages: 20,
      industry: "Manufacturing"
    },
    {
      type: "Implementation Guide",
      title: "Asset Governance Framework: Building Sustainable Controls",
      description: "Step-by-step framework for implementing governance structures, staff training, ongoing monitoring, and continuous improvement in asset management.",
      pages: 16,
      industry: "All Industries"
    },
    {
      type: "Case Study Collection",
      title: "Capital Recovery Success Stories: $50M+ in Recovered Assets",
      description: "Real-world examples from healthcare, manufacturing, utilities, and government sectors showing how organizations identified and recovered hidden capital.",
      pages: 28,
      industry: "All Industries"
    },
    {
      type: "Industry Report",
      title: "Government Asset Management: Compliance, Accountability, and Audit Readiness",
      description: "Analysis of government-specific asset management challenges, GASB compliance requirements, and strategies for achieving 100% audit readiness.",
      pages: 22,
      industry: "Government"
    }
  ];

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      "White Paper": C.gold,
      "Industry Report": C.gold,
      "Implementation Guide": C.gold,
      "Case Study Collection": C.gold
    };
    return colors[type] || C.gold;
  };

  return (
    <PageLayout
      heroTitle="Resources & Research"
      heroSubtitle="Download white papers, industry reports, and implementation guides to accelerate your asset intelligence journey"
      ctaTitle="Need Custom Research?"
      ctaDescription="Our team can develop custom research and analysis tailored to your specific industry and challenges."
      ctaButtonText="Request Custom Research"
    >
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: C.charcoal, marginBottom: "1.5rem" }}>
          Featured Resources
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {resources.map((resource, i) => (
            <div key={i} style={{ padding: "1.5rem", background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 2px 8px rgba(15,20,25,0.05)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <span style={{ padding: "0.4rem 0.8rem", background: `${getTypeColor(resource.type)}20`, color: getTypeColor(resource.type), borderRadius: 4, fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase" }}>
                  {resource.type}
                </span>
                <span style={{ color: C.textMuted, fontSize: "0.8rem", fontWeight: 500 }}>
                  {resource.pages} pages
                </span>
              </div>
              
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: C.charcoal, marginBottom: "0.75rem", lineHeight: 1.4 }}>
                {resource.title}
              </h3>
              
              <p style={{ color: C.textDark, fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1rem", flex: 1 }}>
                {resource.description}
              </p>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: `1px solid ${C.border}` }}>
                <span style={{ color: C.textMuted, fontSize: "0.8rem" }}>
                  {resource.industry}
                </span>
                <button style={{ background: C.gold, color: C.charcoal, border: "none", padding: "0.5rem 1rem", borderRadius: 4, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "rgba(212,175,55,0.08)", padding: "2rem", borderRadius: 8, marginTop: "3rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: C.charcoal, marginBottom: "1rem" }}>
          Knowledge Base
        </h2>
        <p style={{ color: C.textDark, fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "1rem" }}>
          Our comprehensive knowledge base includes articles, guides, and FAQs covering every aspect of asset management, capital recovery, and governance implementation. Search by industry, topic, or challenge to find the information you need.
        </p>
        <button style={{ background: C.gold, color: C.charcoal, border: "none", padding: "0.75rem 1.5rem", borderRadius: 4, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}>
          Explore Knowledge Base
        </button>
      </div>
    </PageLayout>
  );
}
