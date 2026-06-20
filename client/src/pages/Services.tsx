import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { COLORS } from "@shared/colors";

const C = COLORS;

export default function Services() {
  const services = [
    {
      title: "Executive Asset Assessment",
      description: "Comprehensive physical inventory and asset verification across your entire organization",
      features: ["Physical asset tagging", "Data reconciliation", "Gap analysis", "Executive reporting"]
    },
    {
      title: "Asset Accountability Framework",
      description: "Establish governance structures and controls to prevent ghost assets",
      features: ["Process documentation", "Control design", "Staff training", "Ongoing monitoring"]
    },
    {
      title: "Technology Platform Integration",
      description: "Modern asset tracking systems for real-time visibility and management",
      features: ["System selection", "Data migration", "User training", "Support & optimization"]
    },
    {
      title: "Recovery Optimization",
      description: "Identify and recover capital from underutilized and redundant assets",
      features: ["Asset disposition", "Market analysis", "Negotiation support", "Transaction management"]
    }
  ];

  return (
    <PageLayout
      heroTitle="Our Services"
      heroSubtitle="Comprehensive asset intelligence solutions tailored to your organization's needs"
      ctaTitle="Ready to Recover Your Hidden Capital?"
      ctaDescription="Schedule a consultation with our team to discuss your organization's asset intelligence needs."
      ctaButtonText="Schedule Assessment"
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        {services.map((service, i) => (
          <div key={i} style={{ padding: "2rem", background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 2px 8px rgba(15,20,25,0.05)" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: C.charcoal, marginBottom: "0.5rem" }}>
              {service.title}
            </h3>
            <p style={{ color: C.textMuted, marginBottom: "1.5rem", fontSize: "0.95rem" }}>
              {service.description}
            </p>
            <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.5rem" }}>
              {service.features.map((feature, j) => (
                <li key={j} style={{ color: C.textDark, marginBottom: "0.5rem", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ color: C.gold, fontWeight: 700 }}>✓</span> {feature}
                </li>
              ))}
            </ul>
            <Button style={{ width: "100%", background: C.gold, color: C.charcoal }}>Learn More</Button>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
