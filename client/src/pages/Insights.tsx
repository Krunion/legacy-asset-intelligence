import PageLayout from "@/components/PageLayout";
import { COLORS } from "@shared/colors";

const C = COLORS;

const insights = [
  {
    category: "Executive Guide",
    title: "The Hidden Cost of Ghost Assets: A CFO's Perspective",
    excerpt: "Organizations unknowingly pay millions in property taxes, insurance, and maintenance on assets that no longer exist. This guide examines the financial impact and provides a framework for executive action.",
    readTime: "12 min read",
    date: "2025"
  },
  {
    category: "Industry Analysis",
    title: "Fixed Asset Management in Healthcare: Regulatory Compliance and Capital Recovery",
    excerpt: "Healthcare systems face unique challenges in asset accountability due to regulatory requirements, rapid technology turnover, and distributed facility networks. Learn how leading systems are recovering capital.",
    readTime: "9 min read",
    date: "2025"
  },
  {
    category: "Whitepaper",
    title: "From Spreadsheets to Smart Governance: The Asset Maturity Journey",
    excerpt: "A five-level maturity framework for evaluating your organization's asset management sophistication, with practical steps to advance from reactive tracking to proactive governance.",
    readTime: "15 min read",
    date: "2025"
  },
  {
    category: "Case Insight",
    title: "How a $2B Manufacturer Recovered $4.2M in Ghost Assets",
    excerpt: "A detailed examination of how a mid-market manufacturer discovered that 22% of their fixed asset register consisted of ghost assets, and the systematic approach used to recover capital.",
    readTime: "8 min read",
    date: "2025"
  },
  {
    category: "Technology Brief",
    title: "RFID, IoT, and the Future of Asset Verification",
    excerpt: "Emerging technologies are transforming how organizations track and verify physical assets. This brief examines the ROI of technology-enabled asset management versus traditional manual approaches.",
    readTime: "10 min read",
    date: "2025"
  },
  {
    category: "Executive Guide",
    title: "Building a Business Case for Asset Intelligence Investment",
    excerpt: "A step-by-step framework for building an internal business case that quantifies the ROI of professional asset verification and governance implementation.",
    readTime: "11 min read",
    date: "2025"
  },
  {
    category: "Industry Analysis",
    title: "Government & Education: Compliance-Driven Asset Accountability",
    excerpt: "Public sector organizations face GASB compliance requirements that demand accurate asset records. This analysis explores how agencies are meeting compliance while recovering hidden capital.",
    readTime: "9 min read",
    date: "2025"
  },
  {
    category: "Whitepaper",
    title: "The $264 Billion Opportunity: Fixed Asset Management Market Dynamics",
    excerpt: "An in-depth analysis of the global fixed asset management market, growth drivers, competitive landscape, and where organizations should invest for maximum capital recovery.",
    readTime: "14 min read",
    date: "2025"
  }
];

export default function Insights() {
  return (
    <PageLayout
      heroTitle="Executive Insights"
      heroSubtitle="Research, analysis, and practical guidance for enterprise asset intelligence"
      ctaTitle="Want Insights Tailored to Your Industry?"
      ctaDescription="Our team can provide a custom analysis of your organization's ghost asset risk profile."
      ctaButtonText="Request Custom Analysis"
    >
      {/* Featured Insight */}
      <div style={{ marginBottom: "3rem", padding: "2.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 8, borderLeft: `3px solid ${C.gold}` }}>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>
          Featured
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem", lineHeight: 1.3 }}>
          {insights[0].title}
        </h2>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1rem" }}>
          {insights[0].excerpt}
        </p>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: C.silver }}>
          {insights[0].readTime}
        </span>
      </div>

      {/* Insights Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {insights.slice(1).map((insight, i) => (
          <div key={i} style={{ 
            padding: "1.75rem", 
            background: C.slate, 
            border: `1px solid ${C.border}`, 
            borderRadius: 8,
            transition: "border-color 0.3s ease",
            display: "flex",
            flexDirection: "column"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold }}>
                {insight.category}
              </span>
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: C.textMuted }}>
                {insight.readTime}
              </span>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem", lineHeight: 1.35, flex: "none" }}>
              {insight.title}
            </h3>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.85rem", lineHeight: 1.6, flex: 1 }}>
              {insight.excerpt}
            </p>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
