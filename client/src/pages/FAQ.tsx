import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { COLORS } from "@shared/colors";

const C = COLORS;

export default function FAQ() {
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
      definition: "The official record of all assets owned by an organization, typically maintained in accounting systems. The FAR tracks asset description, acquisition date, cost, depreciation, and current book value. Ghost assets are items on the FAR that don't exist in physical reality."
    },
    {
      term: "Asset Accountability",
      definition: "The governance framework and processes that ensure all assets are accurately tracked, properly maintained, and accounted for throughout their lifecycle. Strong accountability prevents ghost asset accumulation."
    },
    {
      term: "Capital Recovery",
      definition: "The process of identifying and recovering value from ghost assets, underutilized equipment, and redundant inventory. This includes asset disposition, market-based valuation, and transaction management to return capital to the organization."
    },
    {
      term: "Asset Verification Practice",
      definition: "The methodology an organization uses to verify that assets on the FAR actually exist and are in use. Practices range from no formal verification to continuous IoT/RFID tracking. Better verification practices reduce ghost asset accumulation."
    },
    {
      term: "Depreciation",
      definition: "The accounting process of allocating an asset's cost over its useful life. Fully depreciated assets have zero book value but may still exist and require maintenance. These are common sources of ghost assets."
    },
    {
      term: "Asset Disposition",
      definition: "The process of removing an asset from service and determining its final use. Options include sale, donation, recycling, or disposal. Proper disposition prevents assets from becoming ghosts."
    },
    {
      term: "Governance Framework",
      definition: "The policies, procedures, and controls that ensure consistent asset management across an organization. A strong governance framework includes regular reconciliation, staff training, and continuous monitoring to maintain asset accuracy."
    },
    {
      term: "IoT/RFID Tracking",
      definition: "Internet of Things and Radio Frequency Identification technologies that enable automated, real-time asset tracking. These technologies significantly reduce ghost assets by providing continuous visibility into asset location and status."
    },
    {
      term: "Asset Maturity Level",
      definition: "A classification of an organization's asset management sophistication, ranging from ad-hoc (Level 1) to optimized/continuous improvement (Level 5). Higher maturity levels correlate with fewer ghost assets and better capital recovery potential."
    }
  ];

  return (
    <PageLayout
      heroTitle="Frequently Asked Questions"
      heroSubtitle="Find answers to common questions about ghost assets, capital recovery, and asset governance"
      ctaTitle="Still Have Questions?"
      ctaDescription="Our team is ready to discuss your specific situation and answer any questions about our approach."
      ctaButtonText="Contact Our Team"
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>
        {/* FAQs Column */}
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1.5rem", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
            General Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                  style={{ width: "100%", padding: "1rem", background: "white", border: "none", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span style={{ fontWeight: 600, color: C.charcoal, fontSize: "0.95rem" }}>
                    {faq.question}
                  </span>
                  <span style={{ color: C.gold, fontSize: "1.2rem", fontWeight: "bold" }}>
                    {expandedFAQ === i ? "−" : "+"}
                  </span>
                </button>
                {expandedFAQ === i && (
                  <div style={{ padding: "1rem", background: "rgba(212,175,55,0.05)", borderTop: `1px solid ${C.border}`, color: C.textDark, fontSize: "0.9rem", lineHeight: 1.6 }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Glossary Column */}
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1.5rem", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
            Glossary of Terms
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {glossary.map((item, i) => (
              <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                <button
                  onClick={() => setExpandedGlossary(expandedGlossary === i ? null : i)}
                  style={{ width: "100%", padding: "1rem", background: "white", border: "none", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span style={{ fontWeight: 600, color: C.charcoal, fontSize: "0.95rem" }}>
                    {item.term}
                  </span>
                  <span style={{ color: C.gold, fontSize: "1.2rem", fontWeight: "bold" }}>
                    {expandedGlossary === i ? "−" : "+"}
                  </span>
                </button>
                {expandedGlossary === i && (
                  <div style={{ padding: "1rem", background: "rgba(13,148,136,0.05)", borderTop: `1px solid ${C.border}`, color: C.text, fontSize: "0.9rem", lineHeight: 1.6 }}>
                    {item.definition}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "rgba(212,175,55,0.15)", padding: "2rem", borderRadius: 8, marginTop: "3rem", textAlign: "center", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1rem", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
          Need More Information?
        </h2>
        <p style={{ color: "#E8E9EB", fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "1.5rem", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
          Our team is available to discuss your specific challenges and answer detailed questions about how Legacy Asset Intelligence can help your organization.
        </p>
        <button style={{ background: C.teal, color: "white", border: "none", padding: "0.75rem 1.5rem", borderRadius: 4, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}>
          Schedule a Consultation
        </button>
      </div>
    </PageLayout>
  );
}
