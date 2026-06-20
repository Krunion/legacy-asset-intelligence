import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { COLORS } from "@shared/colors";

const C = COLORS;

export default function Solutions() {
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
          <div key={i} style={{ padding: "2rem", background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 2px 8px rgba(15,20,25,0.05)", display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{solution.icon}</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: C.charcoal, marginBottom: "0.5rem" }}>
              {solution.title}
            </h3>
            <p style={{ color: C.textMuted, marginBottom: "1.5rem", fontSize: "0.95rem", flex: 1 }}>
              {solution.description}
            </p>
            <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.5rem" }}>
              {solution.benefits.map((benefit, j) => (
                <li key={j} style={{ color: C.textDark, marginBottom: "0.5rem", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ color: C.gold, fontWeight: 700 }}>✓</span> {benefit}
                </li>
              ))}
            </ul>
            <Button style={{ width: "100%", background: C.gold, color: C.charcoal }}>Learn More</Button>
          </div>
        ))}
      </div>

      {/* Integration Section */}
      <div style={{ padding: "2rem", background: C.cardBg, borderRadius: 8, border: `1px solid ${C.border}` }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: C.charcoal, marginBottom: "2rem", textAlign: "center" }}>
          How Our Solutions Work Together
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr", gap: "1rem", alignItems: "center", textAlign: "center" }}>
          <div style={{ padding: "1.5rem", background: "rgba(212,175,55,0.08)", borderRadius: 6 }}>
            <p style={{ fontWeight: 600, color: C.charcoal, marginBottom: "0.5rem" }}>1. Assessment</p>
            <p style={{ fontSize: "0.85rem", color: C.textMuted }}>Identify hidden assets</p>
          </div>
          <div style={{ fontSize: "1.5rem", color: C.gold }}>→</div>
          <div style={{ padding: "1.5rem", background: "rgba(212,175,55,0.08)", borderRadius: 6 }}>
            <p style={{ fontWeight: 600, color: C.charcoal, marginBottom: "0.5rem" }}>2. Recovery</p>
            <p style={{ fontSize: "0.85rem", color: C.textMuted }}>Recover capital</p>
          </div>
          <div style={{ fontSize: "1.5rem", color: C.gold }}>→</div>
          <div style={{ padding: "1.5rem", background: "rgba(212,175,55,0.08)", borderRadius: 6 }}>
            <p style={{ fontWeight: 600, color: C.charcoal, marginBottom: "0.5rem" }}>3. Accountability</p>
            <p style={{ fontSize: "0.85rem", color: C.textMuted }}>Establish controls</p>
          </div>
          <div style={{ fontSize: "1.5rem", color: C.gold }}>→</div>
          <div style={{ padding: "1.5rem", background: "rgba(212,175,55,0.08)", borderRadius: 6 }}>
            <p style={{ fontWeight: 600, color: C.charcoal, marginBottom: "0.5rem" }}>4. Prevention</p>
            <p style={{ fontSize: "0.85rem", color: C.textMuted }}>Prevent future loss</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
