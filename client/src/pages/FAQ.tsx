import { useState } from "react";
import { useLocation } from "wouter";
import PageLayout from "@/components/PageLayout";
import { COLORS } from "@shared/colors";

const C = COLORS;

export default function FAQ() {
  const [, navigate] = useLocation();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [expandedGlossary, setExpandedGlossary] = useState<number | null>(null);

  const faqs = [
    {
      question: "What exactly is a ghost asset?",
      answer: "A ghost asset is an item that appears on a company's Fixed Asset Register (FAR) but is physically missing, fully depreciated, or otherwise non-existent in reality. These assets continue to consume resources through maintenance contracts, insurance premiums, and IT overhead while providing no operational value."
    },
    {
      question: "How common are ghost assets in enterprise organizations?",
      answer: "Industry research shows that 15-30% of typical organization's fixed assets are ghosts. This translates to millions in unnecessary spending. The problem is particularly acute in organizations with multiple locations, decentralized asset management, or legacy systems."
    },
    {
      question: "What's the typical timeline for a capital recovery engagement?",
      answer: "Most engagements follow our three-phase methodology: Phase 1 (Physical Inventory & Assessment) typically takes 4-8 weeks depending on asset volume and locations. Phase 2 (Technology Integration) takes 2-4 weeks. Phase 3 (Governance Implementation) is ongoing, with initial setup taking 2-3 weeks. Total time to first capital recovery is typically 8-12 weeks."
    },
    {
      question: "How much capital can we realistically recover?",
      answer: "Recovery amounts vary significantly based on asset base size, industry, and asset verification maturity. Our ROI Calculator provides personalized estimates. Typical recoveries range from $500K for small organizations to $15M+ for large enterprises. We've seen organizations recover 15-30% of their identified ghost asset value."
    },
    {
      question: "Do you work with specific asset management systems?",
      answer: "Yes, we integrate with most major platforms including SAP, Oracle, Infor, Microsoft Dynamics, and specialized asset management systems. We also work with organizations using spreadsheet-based tracking and help implement modern platforms where needed."
    },
    {
      question: "What happens after the initial recovery phase?",
      answer: "We implement an ongoing governance framework to prevent ghost asset re-accumulation. This includes periodic reconciliation cycles, staff training, process documentation, and continuous monitoring. Most organizations see sustained benefits for years after the initial engagement."
    },
    {
      question: "Is this process disruptive to our operations?",
      answer: "We design engagements to minimize operational disruption. Physical inventory work is typically scheduled during maintenance windows or off-peak periods. Technology integration happens in controlled phases. Most organizations experience minimal impact on day-to-day operations."
    },
    {
      question: "How do you ensure audit compliance during this process?",
      answer: "We follow established audit frameworks (SOX, GASB, IFRS) throughout the engagement. All procedures are documented, all findings are verified, and we provide comprehensive audit-ready reporting. Many of our clients use our work to achieve 100% audit readiness."
    }
  ];

  const glossary = [
    {
      term: "Ghost Asset",
      definition: "An item that appears on a company's Fixed Asset Register (FAR) but is physically missing, fully depreciated, or otherwise non-existent in reality. These assets continue to consume resources through maintenance contracts, insurance premiums, and IT overhead."
    },
    {
      term: "Fixed Asset Register (FAR)",
      definition: "A comprehensive inventory of all assets owned by an organization, typically maintained in accounting systems. The FAR tracks asset location, condition, depreciation, and ownership."
    },
    {
      term: "Capital Recovery",
      definition: "The process of identifying, verifying, and recovering value from assets that are no longer in use or have been misclassified in the accounting records."
    },
    {
      term: "Asset Accountability",
      definition: "A governance framework ensuring that all assets are properly tracked, maintained, and accounted for throughout their lifecycle."
    },
    {
      term: "Depreciation",
      definition: "The accounting method of allocating the cost of an asset over its useful life. Fully depreciated assets have zero book value but may still exist physically."
    }
  ];

  return (
    <PageLayout heroTitle="FAQ" heroSubtitle="Find answers to your questions">
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5rem", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
          Frequently Asked Questions
        </h1>
        <p style={{ color: "#D4C5B0", fontSize: "1rem", marginBottom: "2rem", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
          Find answers to common questions about ghost assets, capital recovery, and our methodology.
        </p>

        {/* FAQ Section */}
        <div style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#D4C5B0", marginBottom: "1.5rem" }}>
            General Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {faqs.map((faq, idx) => (
              <div key={idx} style={{ border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 8, overflow: "hidden", background: "rgba(0,0,0,0.2)" }}>
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "1rem",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    fontSize: "1rem",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(212,175,55,0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                  <span>{faq.question}</span>
                  <span style={{ fontSize: "1.2rem", transition: "transform 0.2s", transform: expandedFAQ === idx ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                </button>
                {expandedFAQ === idx && (
                  <div style={{ padding: "1rem", borderTop: `1px solid rgba(255,255,255,0.1)`, color: "#E8E9EB", lineHeight: 1.8, fontSize: "0.95rem" }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Glossary Section */}
        <div style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#D4C5B0", marginBottom: "1.5rem" }}>
            Glossary
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {glossary.map((item, idx) => (
              <div key={idx} style={{ border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 8, overflow: "hidden", background: "rgba(0,0,0,0.2)" }}>
                <button
                  onClick={() => setExpandedGlossary(expandedGlossary === idx ? null : idx)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "1rem",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    fontSize: "1rem",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(212,175,55,0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                  <span>{item.term}</span>
                  <span style={{ fontSize: "1.2rem", transition: "transform 0.2s", transform: expandedGlossary === idx ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                </button>
                {expandedGlossary === idx && (
                  <div style={{ padding: "1rem", borderTop: `1px solid rgba(255,255,255,0.1)`, color: "#E8E9EB", lineHeight: 1.8, fontSize: "0.95rem" }}>
                    {item.definition}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ background: "rgba(212,175,55,0.15)", padding: "2rem", borderRadius: 8, marginTop: "3rem", textAlign: "center", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1rem", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
            Need More Information?
          </h2>
          <p style={{ color: "#E8E9EB", fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "1.5rem", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
            Our team is available to discuss your specific challenges and answer detailed questions about how Legacy Asset Intelligence can help your organization.
          </p>
          <button onClick={() => navigate("/contact")} style={{ background: C.teal, color: "white", border: "none", padding: "0.75rem 1.5rem", borderRadius: 4, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}>
            Schedule a Consultation
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
