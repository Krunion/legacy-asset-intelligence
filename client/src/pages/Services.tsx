import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { COLORS } from "@shared/colors";
import { useLocation } from "wouter";

const C = COLORS;

export default function Services() {
  const [, navigate] = useLocation();

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
          <div key={i} style={{ padding: "2rem", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.2)", backdropFilter: "blur(8px)" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5rem", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              {service.title}
            </h3>
            <p style={{ color: "#E8E9EB", marginBottom: "1.5rem", fontSize: "0.95rem", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
              {service.description}
            </p>
            <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.5rem" }}>
              {service.features.map((feature, j) => (
                <li key={j} style={{ color: "#D1D5DB", marginBottom: "0.5rem", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
                  <span style={{ color: C.gold, fontWeight: 700 }}>✓</span> {feature}
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
    </PageLayout>
  );
}
