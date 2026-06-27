import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { COLORS } from "@shared/colors";

const C = COLORS;

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openGlossary, setOpenGlossary] = useState<number | null>(null);

  const faqs = [
    {
      question: "What exactly is a ghost asset?",
      answer: "A ghost asset is an item that appears on a company's Fixed Asset Register (FAR) but is physically missing, fully depreciated, or otherwise non-existent in reality. These assets continue to consume resources through maintenance contracts, insurance premiums, and IT overhead while providing no operational value."
    },
    {
      question: "How common are ghost assets in enterprise organizations?",
      answer: "Industry research shows that 15-30% of a typical organization's fixed assets are ghosts. This translates to millions in unnecessary spending. The problem is particularly acute in organizations with multiple locations, decentralized asset management, or legacy systems."
    },
    {
      question: "What's the typical timeline for a capital recovery engagement?",
      answer: "Most engagements follow our four-phase methodology: Phase 1 (Discovery & Assessment) takes 2-4 weeks. Phase 2 (Physical Accountability) takes 4-12 weeks depending on asset volume. Phase 3 (Technology Integration) takes 6-10 weeks. Phase 4 (Recurring Governance) is ongoing. Total time to first capital recovery is typically 8-12 weeks."
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
    { term: "Ghost Asset", definition: "An item that appears on a company's Fixed Asset Register (FAR) but is physically missing, fully depreciated, or otherwise non-existent." },
    { term: "Fixed Asset Register (FAR)", definition: "A comprehensive inventory of all assets owned by an organization, typically maintained in accounting systems." },
    { term: "Capital Recovery", definition: "The process of identifying, verifying, and recovering value from assets that are no longer in use or have been misclassified." },
    { term: "Asset Accountability", definition: "A governance framework ensuring that all assets are properly tracked, maintained, and accounted for throughout their lifecycle." },
    { term: "Floor-to-Book Reconciliation", definition: "The process of matching physically verified assets against the accounting records to identify discrepancies." },
    { term: "Depreciation", definition: "The accounting method of allocating the cost of an asset over its useful life. Fully depreciated assets have zero book value but may still exist physically." },
  ];

  return (
    <PageLayout
      heroTitle="Frequently Asked Questions"
      heroSubtitle="Answers to common questions about ghost assets, capital recovery, and our methodology"
    >
      {/* FAQ Section */}
      <div style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: C.text, marginBottom: "1.5rem", borderLeft: `3px solid ${C.gold}`, paddingLeft: "1rem" }}>
          General Questions
        </h2>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.25rem 0",
                background: "none",
                border: "none",
                textAlign: "left",
              }}
            >
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", fontWeight: 600, color: openIndex === i ? C.gold : C.text, transition: "color 0.2s", paddingRight: "1rem" }}>
                {faq.question}
              </span>
              <span style={{ color: C.textMuted, fontSize: "1.2rem", flexShrink: 0, transition: "transform 0.2s", transform: openIndex === i ? "rotate(45deg)" : "none" }}>
                +
              </span>
            </button>
            {openIndex === i && (
              <div style={{ padding: "0 0 1.5rem" }}>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.93rem", lineHeight: 1.7 }}>
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Glossary Section */}
      <div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: C.text, marginBottom: "1.5rem", borderLeft: `3px solid ${C.gold}`, paddingLeft: "1rem" }}>
          Glossary of Terms
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
          {glossary.map((item, i) => (
            <div key={i} style={{ padding: "1.25rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6 }}>
              <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: C.gold, marginBottom: "0.4rem" }}>
                {item.term}
              </h3>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>
                {item.definition}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
