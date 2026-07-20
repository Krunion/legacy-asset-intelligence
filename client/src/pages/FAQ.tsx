import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { COLORS } from "@shared/colors";

const C = COLORS;

interface FAQCategory {
  title: string;
  questions: { question: string; answer: string }[];
}

export default function FAQ() {
  const [openIndices, setOpenIndices] = useState<Record<string, number | null>>({});
  const [openGlossary, setOpenGlossary] = useState<number | null>(null);

  const toggleQuestion = (category: string, index: number) => {
    setOpenIndices(prev => ({
      ...prev,
      [category]: prev[category] === index ? null : index
    }));
  };

  const categories: FAQCategory[] = [
    {
      title: "Understanding Ghost Assets",
      questions: [
        {
          question: "What exactly is a ghost asset?",
          answer: "A ghost asset is an item that appears on a company's Fixed Asset Register (FAR) but is physically missing, fully depreciated, disposed of, or otherwise non-existent in reality. These assets continue to consume resources through property tax assessments, insurance premiums, maintenance contracts, and IT overhead while providing no operational value. Ghost assets represent one of the most significant — and most overlooked — sources of financial waste in enterprise organizations."
        },
        {
          question: "How common are ghost assets in enterprise organizations?",
          answer: "Industry sources suggest that a significant percentage of assets on a typical fixed asset register may be ghost assets. The rate varies widely by organization, industry, and how recently a physical verification was conducted. The problem is particularly acute in organizations with multiple locations, decentralized asset management, legacy systems, or those that have undergone mergers and acquisitions. A professional assessment can determine your organization's specific exposure."
        },
        {
          question: "What causes ghost assets to accumulate?",
          answer: "Ghost assets accumulate through several common mechanisms: assets disposed of without updating records, equipment relocated without documentation, items replaced during upgrades without retiring old records, organizational mergers that create duplicate entries, decentralized purchasing that bypasses asset tracking, and natural attrition where items reach end-of-life without formal retirement. Without periodic physical verification, these discrepancies compound year over year."
        },
        {
          question: "How do ghost assets affect our financial statements?",
          answer: "Ghost assets inflate your balance sheet with non-existent value, distort depreciation schedules, increase property tax assessments (since many jurisdictions tax based on declared asset values), inflate insurance premiums (you're insuring assets that don't exist), and can trigger audit findings. They also undermine capital planning by presenting an inaccurate picture of your actual asset base and its condition."
        },
        {
          question: "What's the difference between a ghost asset and a zombie asset?",
          answer: "A ghost asset exists only on paper — it's completely missing physically. A zombie asset exists physically but has been fully depreciated and removed from records, meaning it operates without proper tracking, maintenance scheduling, or insurance coverage. Both represent governance failures, but zombie assets carry additional liability risk since they're in active use without proper oversight."
        }
      ]
    },
    {
      title: "Our Methodology & Process",
      questions: [
        {
          question: "What's the typical timeline for a capital recovery engagement?",
          answer: "Most engagements follow our four-phase methodology: Phase 1 (Executive Asset Intelligence Assessment) takes 2-4 weeks and involves analyzing your current asset register, identifying high-risk categories, and developing a verification strategy. Phase 2 (Physical Verification & Reconciliation) takes 4-12 weeks depending on asset volume and location count. Phase 3 (Capital Recovery & Financial Impact) takes 6-10 weeks. Phase 4 (Governance Implementation & Technology Enablement) is ongoing. Total time to initial findings is typically 8-12 weeks."
        },
        {
          question: "How do you conduct physical verification without disrupting operations?",
          answer: "We design engagements to minimize operational disruption. Physical inventory work is scheduled during maintenance windows, shift changes, or off-peak periods. We use zone-based approaches that verify one area at a time rather than shutting down entire facilities. Technology integration happens in controlled phases. Most organizations experience minimal impact on day-to-day operations. For 24/7 facilities, we develop custom scheduling that works around production cycles."
        },
        {
          question: "What technology do you use for asset verification?",
          answer: "We leverage enterprise-grade asset management platforms including Asset Panda and EZO for tracking and governance. Our methodology incorporates barcode and RFID scanning, GPS-enabled mobile verification, photographic documentation, and integration with existing ERP systems. The specific technology stack is tailored to each client's existing infrastructure and future needs."
        },
        {
          question: "Do you work with our existing asset management systems?",
          answer: "Yes, we integrate with most major platforms including SAP, Oracle, Infor, Microsoft Dynamics, Sage, and specialized asset management systems. We also work with organizations using spreadsheet-based tracking and help implement modern platforms where needed. Our approach is system-agnostic — we focus on data quality and process governance regardless of the underlying technology."
        },
        {
          question: "What does 'floor-to-book reconciliation' mean in practice?",
          answer: "Floor-to-book reconciliation is the process of physically verifying every asset in a location (the 'floor') and matching it against accounting records (the 'book'). This identifies three types of discrepancies: assets on the book but not on the floor (ghost assets), assets on the floor but not on the book (zombie assets), and assets that exist but have incorrect information (location, condition, custodian). This comprehensive approach ensures complete accuracy."
        }
      ]
    },
    {
      title: "Financial Impact & ROI",
      questions: [
        {
          question: "How much capital can we realistically recover?",
          answer: "Recovery potential varies significantly based on asset base size, industry, and current asset verification maturity. The primary sources of cost reduction include property tax exposure from ghost assets on tax rolls, insurance premium alignment with actual asset values, maintenance contract optimization, and prevention of duplicate purchases. Our ROI Estimator provides directional estimates based on your inputs, though actual outcomes depend on organizational factors. Contact us for a confidential preliminary assessment."
        },
        {
          question: "What's the typical ROI on an LAI engagement?",
          answer: "Organizations that engage in structured asset verification and governance programs often find that the engagement investment is recovered through identified cost reductions. The primary return drivers include property tax exposure reduction, insurance coverage alignment, and maintenance contract optimization. Ongoing governance helps prevent re-accumulation of record exceptions, meaning benefits can compound over time. Specific ROI depends on portfolio size, data quality, and organizational factors."
        },
        {
          question: "How quickly do we see financial results?",
          answer: "Initial findings and quick-win recommendations typically emerge within 4-6 weeks of engagement start. Property tax appeals can be filed within 8-12 weeks. Insurance adjustments can be made immediately upon verification completion. The full financial impact materializes over 6-12 months as all recovery mechanisms are activated. We provide monthly progress reports with quantified savings throughout the engagement."
        },
        {
          question: "Do you guarantee specific savings amounts?",
          answer: "We do not guarantee specific dollar amounts because every organization's situation is unique. Our engagement structure is designed so that Phase 1 (Executive Assessment) provides you with a clear picture of potential opportunity before committing to subsequent phases. Organizations with substantial fixed asset portfolios that have not conducted recent physical verification typically have meaningful improvement potential. We provide detailed projections during the assessment phase so you can make informed decisions about next steps."
        }
      ]
    },
    {
      title: "Engagement & Working With Us",
      questions: [
        {
          question: "How do we get started?",
          answer: "The process begins with a complimentary Executive Assessment — a 60-90 minute consultation where we review your current asset management practices, identify potential risk areas, and provide preliminary recovery estimates. If there's alignment, we develop a detailed engagement proposal with scope, timeline, investment, and projected returns. There's no obligation at any stage until you're confident in the value proposition."
        },
        {
          question: "What information do you need from us to begin?",
          answer: "For the initial assessment, we need: a current Fixed Asset Register (or equivalent listing), information about your facility locations and types, your current asset management processes and systems, and access to key stakeholders (typically CFO, Facilities Director, and IT leadership). We handle all the analysis — your team's time commitment during assessment is typically 4-6 hours total."
        },
        {
          question: "How do you ensure audit compliance during this process?",
          answer: "Our work product is designed to support your organization's compliance objectives. All procedures are documented with supporting detail, and findings include verification evidence. We provide audit-supportive reporting that can assist your organization and its auditors. Note: LAI does not perform audits or provide assurance opinions. We coordinate with your internal audit team and external auditors to ensure our work product aligns with their requirements."
        },
        {
          question: "What happens after the initial recovery phase?",
          answer: "We implement an ongoing governance framework to prevent ghost asset re-accumulation. This includes periodic reconciliation cycles (quarterly or semi-annually), staff training and certification, process documentation, technology-enabled monitoring, and executive reporting dashboards. Most organizations see sustained benefits for years after the initial engagement. We offer ongoing advisory relationships for organizations that want continuous oversight."
        },
        {
          question: "Can you work with organizations across multiple states or countries?",
          answer: "Yes, we serve organizations with distributed operations across multiple locations. Our methodology is designed for multi-site deployments with standardized processes that scale efficiently. We understand jurisdiction-specific requirements for property tax, insurance, and regulatory compliance. For international organizations, we partner with local experts to ensure compliance with regional standards."
        }
      ]
    },
    {
      title: "Industry-Specific Questions",
      questions: [
        {
          question: "How does asset verification work in healthcare environments?",
          answer: "Healthcare presents unique challenges including biomedical equipment regulations, patient care continuity requirements, and HIPAA considerations. We schedule verification around clinical operations, coordinate with biomedical engineering teams, and ensure all documentation meets Joint Commission and CMS requirements. Healthcare organizations typically have high ghost asset rates due to rapid equipment turnover and complex procurement processes."
        },
        {
          question: "What about manufacturing environments with production-critical assets?",
          answer: "We never disrupt production schedules. Our manufacturing methodology uses planned maintenance windows, shift transitions, and weekend periods for physical verification. We coordinate with production planning teams to ensure zero impact on output. Manufacturing organizations benefit significantly because their asset bases are large, equipment is expensive, and ghost assets often represent substantial property tax and insurance exposure."
        },
        {
          question: "How do you handle government and education sector requirements?",
          answer: "Government and education organizations have specific compliance requirements (GASB standards, federal property management regulations, state reporting requirements). Our methodology is designed to meet these standards and produce documentation that satisfies audit requirements. We also understand the unique procurement and disposal processes in public sector environments, including surplus property regulations and grant-funded asset tracking."
        }
      ]
    }
  ];

  const glossary = [
    { term: "Ghost Asset", definition: "An item that appears on a company's Fixed Asset Register (FAR) but is physically missing, fully depreciated, or otherwise non-existent." },
    { term: "Zombie Asset", definition: "A physical asset that exists and is in use but has been removed from accounting records, operating without proper tracking or insurance coverage." },
    { term: "Fixed Asset Register (FAR)", definition: "A comprehensive inventory of all assets owned by an organization, typically maintained in accounting systems for depreciation and tax purposes." },
    { term: "Capital Recovery", definition: "The process of identifying, verifying, and recovering financial value from ghost assets through tax appeals, insurance adjustments, and contract eliminations." },
    { term: "Asset Accountability", definition: "A governance framework ensuring that all assets are properly tracked, maintained, and accounted for throughout their lifecycle." },
    { term: "Floor-to-Book Reconciliation", definition: "The process of matching physically verified assets against the accounting records to identify discrepancies in both directions." },
    { term: "Book-to-Floor Reconciliation", definition: "Starting from accounting records and verifying each listed asset exists physically — the inverse of floor-to-book." },
    { term: "Depreciation", definition: "The accounting method of allocating the cost of an asset over its useful life. Fully depreciated assets have zero book value but may still exist physically." },
    { term: "Asset Verification Maturity", definition: "A measure of how well an organization manages its asset lifecycle, from ad-hoc tracking to fully governed, technology-enabled oversight." },
    { term: "Property Tax Exposure", definition: "The excess property tax paid on ghost assets that no longer exist but remain on tax declarations." },
    { term: "Governance Framework", definition: "The policies, procedures, and technology systems that ensure ongoing asset accountability and prevent ghost asset re-accumulation." },
    { term: "Governance & Technology Enablement", definition: "Ongoing monitoring, periodic verification, and technology-enabled oversight that maintains asset register accuracy after initial engagement." },
  ];

  return (
    <PageLayout
      heroTitle="Frequently Asked Questions"
      heroSubtitle="Answers to common questions about ghost assets, capital recovery, and our methodology"
    >
      {/* FAQ Categories */}
      {categories.map((category, catIdx) => (
        <div key={catIdx} style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: C.text, marginBottom: "1.5rem", borderLeft: `3px solid ${C.gold}`, paddingLeft: "1rem" }}>
            {category.title}
          </h2>
          {category.questions.map((faq, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
              <button
                onClick={() => toggleQuestion(category.title, i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1.25rem 0",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", fontWeight: 600, color: openIndices[category.title] === i ? C.gold : C.text, transition: "color 0.2s", paddingRight: "1rem" }}>
                  {faq.question}
                </span>
                <span style={{ color: C.textMuted, fontSize: "1.2rem", flexShrink: 0, transition: "transform 0.2s", transform: openIndices[category.title] === i ? "rotate(45deg)" : "none" }}>
                  +
                </span>
              </button>
              {openIndices[category.title] === i && (
                <div style={{ padding: "0 0 1.5rem" }}>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.93rem", lineHeight: 1.7 }}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Glossary Section */}
      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: C.text, marginBottom: "1.5rem", borderLeft: `3px solid ${C.gold}`, paddingLeft: "1rem" }}>
          Glossary of Terms
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
          {glossary.map((item, i) => (
            <div key={i} style={{ padding: "1.25rem", background: "rgba(30,58,95,0.4)", border: `1px solid ${C.border}`, borderRadius: 6 }}>
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

      {/* Still Have Questions CTA */}
      <div style={{ marginTop: "4rem", textAlign: "center", padding: "3rem 2rem", background: "rgba(30,58,95,0.3)", borderRadius: 8, border: `1px solid ${C.border}` }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.text, marginBottom: "0.75rem" }}>
          Still Have Questions?
        </h3>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, marginBottom: "1.5rem", maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
          Schedule a complimentary executive assessment to discuss your specific situation and receive personalized guidance.
        </p>
        <a
          href="/contact"
          style={{
            display: "inline-block",
            padding: "0.85rem 2rem",
            background: C.gold,
            color: "#1a1a1a",
            fontFamily: "'Source Sans 3', sans-serif",
            fontWeight: 600,
            fontSize: "0.9rem",
            borderRadius: 4,
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
        >
          Schedule Executive Assessment
        </a>
      </div>
    </PageLayout>
  );
}
