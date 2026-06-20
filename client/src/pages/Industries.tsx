import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";

const C = {
  slate: "#1E3A5F",
  teal: "#0D9488",
  border: "#E2E8F0",
  text: "#1E293B",
  muted: "#64748B",
};

export default function Industries() {
  const industries = [
    {
      name: "Healthcare",
      description: "Hospitals, clinics, and medical systems managing complex asset portfolios",
      challenges: ["Regulatory compliance", "Equipment tracking", "Facility management"],
      recovery: "$2-5M typical"
    },
    {
      name: "Manufacturing",
      description: "Industrial facilities with distributed equipment and production assets",
      challenges: ["Multi-site coordination", "Equipment depreciation", "Inventory accuracy"],
      recovery: "$3-8M typical"
    },
    {
      name: "Utilities & Energy",
      description: "Power generation, distribution, and infrastructure asset management",
      challenges: ["Infrastructure complexity", "Regulatory reporting", "Maintenance tracking"],
      recovery: "$5-15M typical"
    },
    {
      name: "Government & Public Sector",
      description: "Federal, state, and municipal agencies managing public assets",
      challenges: ["Budget constraints", "Compliance requirements", "Multi-department coordination"],
      recovery: "$2-10M typical"
    },
    {
      name: "Education",
      description: "Universities and school systems with campus-wide asset portfolios",
      challenges: ["Distributed locations", "Legacy systems", "Department silos"],
      recovery: "$1-3M typical"
    },
    {
      name: "Distribution & Logistics",
      description: "Warehouses, distribution centers, and transportation networks",
      challenges: ["High asset turnover", "Location tracking", "Equipment utilization"],
      recovery: "$2-6M typical"
    }
  ];

  return (
    <PageLayout
      heroTitle="Industries We Serve"
      heroSubtitle="Specialized expertise across key sectors managing significant asset portfolios"
      ctaTitle="Your Industry, Your Challenges"
      ctaDescription="We understand the unique asset management challenges in your sector. Let's discuss your situation."
      ctaButtonText="Schedule Consultation"
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
        {industries.map((industry, i) => (
          <div key={i} style={{ padding: "2rem", background: "white", border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 2px 8px rgba(30,58,95,0.05)" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: C.slate, marginBottom: "0.5rem" }}>
              {industry.name}
            </h3>
            <p style={{ color: C.muted, marginBottom: "1.5rem", fontSize: "0.95rem" }}>
              {industry.description}
            </p>
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.8rem", color: C.teal, fontWeight: 600, marginBottom: "0.5rem", textTransform: "uppercase" }}>Key Challenges</p>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {industry.challenges.map((challenge, j) => (
                  <li key={j} style={{ color: C.text, marginBottom: "0.3rem", fontSize: "0.9rem" }}>• {challenge}</li>
                ))}
              </ul>
            </div>
            <div style={{ padding: "1rem", background: "rgba(13,148,136,0.08)", borderRadius: 6, marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.9rem", fontWeight: 600, color: C.slate }}>
                Typical Recovery: <span style={{ color: "#F59E0B" }}>{industry.recovery}</span>
              </p>
            </div>
            <Button style={{ width: "100%", background: C.teal, color: "white" }}>Learn More</Button>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
