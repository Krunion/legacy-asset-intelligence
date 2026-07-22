import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { COLORS } from "@shared/colors";
import { useLocation } from "wouter";

const C = COLORS;

export default function Solutions() {
  const [, navigate] = useLocation();

  const solutions = [
    {
      title: "Capital Recovery",
      icon: "💰",
      description: "Identify and recover millions in hidden capital from ghost assets, underutilized equipment, and redundant inventory",
      benefits: ["Asset disposition strategies", "Market-based valuation", "Transaction management", "Immediate capital recovery"]
    },
    {
      title: "Asset Accountability",
      icon: "📊",
      description: "Establish complete visibility and control over your asset portfolio with modern tracking and governance",
      benefits: ["Centralized asset registry", "Real-time tracking", "Compliance reporting", "Audit readiness"]
    },
    {
      title: "Governance Framework",
      icon: "🛡️",
      description: "Implement controls and processes that prevent ghost assets from accumulating in the future",
      benefits: ["Policy documentation", "Staff training", "Ongoing monitoring", "Continuous improvement"]
    },
    {
      title: "Enterprise Intelligence",
      icon: "🔍",
      description: "Gain strategic insights into your asset portfolio to optimize operations and reduce costs",
      benefits: ["Portfolio analytics", "Utilization reporting", "Cost optimization", "Strategic planning"]
    }
  ];

  return (
    <PageLayout
      heroTitle="Our Solutions"
      heroSubtitle="Comprehensive approaches to recover capital, establish accountability, and prevent future asset loss"
      ctaTitle="Ready to Transform Your Asset Management?"
      ctaDescription="Let's discuss which solutions are right for your organization's needs."
      ctaButtonText="Start Your Journey"
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
        {solutions.map((solution, i) => (
          <div key={i} style={{ padding: "2rem", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", backdropFilter: "blur(8px)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{solution.icon}</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5rem", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              {solution.title}
            </h3>
            <p style={{ color: "#E8E9EB", marginBottom: "1.5rem", fontSize: "0.95rem", flex: 1, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
              {solution.description}
            </p>
            <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.5rem" }}>
              {solution.benefits.map((benefit, j) => (
                <li key={j} style={{ color: "#D1D5DB", marginBottom: "0.5rem", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
                  <span style={{ color: C.gold, fontWeight: 700 }}>✓</span> {benefit}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => navigate("/contact")}
              style={{ width: "100%", background: C.gold, color: C.charcoal }}
            >
              Schedule Consultation
            </Button>
          </div>
        ))}
      </div>

      {/* Integration Section */}
      <div style={{ padding: "2rem", background: "rgba(255, 255, 255, 0.08)", borderRadius: 8, border: "1px solid rgba(255, 255, 255, 0.15)", backdropFilter: "blur(8px)" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "2rem", textAlign: "center", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
          How Our Solutions Work Together
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", alignItems: "center", textAlign: "center" }}>
          {[
            { step: "1. Assessment", desc: "Identify hidden assets" },
            { step: "2. Recovery", desc: "Recover capital" },
            { step: "3. Accountability", desc: "Establish controls" },
            { step: "4. Prevention", desc: "Prevent future loss" },
          ].map((item, i) => (
            <div key={i} style={{ padding: "1.5rem", background: "rgba(212,175,55,0.15)", borderRadius: 6 }}>
              <p style={{ fontWeight: 600, color: "#E8E9EB", marginBottom: "0.5rem", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>{item.step}</p>
              <p style={{ fontSize: "0.85rem", color: "#D1D5DB", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
