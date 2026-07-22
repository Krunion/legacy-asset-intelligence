import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";

const C = {
  slate: "#1E3A5F",
  teal: "#0D9488",
  amber: "#F59E0B",
  border: "#E2E8F0",
  text: "#1E293B",
  muted: "#64748B",
};

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      industry: "Healthcare System",
      challenge: "A 15-hospital network had no centralized asset tracking across locations",
      solution: "Conducted comprehensive physical inventory across all facilities and implemented unified tracking platform",
      results: ["$4.2M in ghost assets identified", "92% asset accuracy achieved", "Annual savings of $680K in avoided maintenance"]
    },
    {
      industry: "Manufacturing Conglomerate",
      challenge: "Multiple production facilities with inconsistent asset records and high maintenance costs",
      solution: "Unified asset database, implemented controls, and optimized equipment utilization",
      results: ["$7.8M capital recovered", "45% reduction in maintenance spend", "15% improvement in equipment ROI"]
    },
    {
      industry: "Government Agency",
      challenge: "Regulatory audit revealed significant asset accountability gaps across departments",
      solution: "Established governance framework, trained staff, and implemented ongoing monitoring",
      results: ["100% compliance with audit requirements", "$2.3M in unrecorded assets documented", "Prevented future ghost asset accumulation"]
    },
    {
      industry: "Utility Company",
      challenge: "Infrastructure assets spread across 50+ locations with legacy tracking systems",
      solution: "Migrated to modern asset management platform with real-time visibility",
      results: ["$12.1M in infrastructure optimization", "60% faster asset location queries", "Improved maintenance planning efficiency"]
    }
  ];

  return (
    <PageLayout
      heroTitle="Case Studies"
      heroSubtitle="Real results from organizations that recovered millions in hidden capital"
      ctaTitle="Your Organization's Success Story"
      ctaDescription="Discover how much capital your organization could recover. Let's start the conversation."
      ctaButtonText="Get Your Assessment"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {caseStudies.map((study, i) => (
          <div key={i} style={{ padding: "2rem", background: "white", border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 2px 8px rgba(30,58,95,0.05)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", alignItems: "start" }}>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: C.slate, marginBottom: "1rem" }}>
                  {study.industry}
                </h3>
                <div style={{ marginBottom: "1.5rem" }}>
                  <p style={{ fontSize: "0.8rem", color: C.teal, fontWeight: 600, marginBottom: "0.3rem", textTransform: "uppercase" }}>Challenge</p>
                  <p style={{ color: C.text, fontSize: "0.95rem" }}>{study.challenge}</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.8rem", color: C.teal, fontWeight: 600, marginBottom: "0.3rem", textTransform: "uppercase" }}>Solution</p>
                  <p style={{ color: C.text, fontSize: "0.95rem" }}>{study.solution}</p>
                </div>
              </div>
              <div style={{ padding: "1.5rem", background: "rgba(13,148,136,0.08)", borderRadius: 6 }}>
                <p style={{ fontSize: "0.8rem", color: C.teal, fontWeight: 600, marginBottom: "1rem", textTransform: "uppercase" }}>Results</p>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {study.results.map((result, j) => (
                    <li key={j} style={{ color: C.slate, marginBottom: "0.75rem", fontSize: "0.95rem", fontWeight: 600, display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                      <span style={{ color: C.amber, marginTop: "2px" }}>✓</span>
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
