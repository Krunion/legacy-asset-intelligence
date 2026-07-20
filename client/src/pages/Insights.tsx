/**
 * Legacy Asset Intelligence — Executive Insights Page
 * Section 6: Thought leadership, industry analysis, executive perspectives,
 * educational content, and strategic intelligence
 */

import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { COLORS, HERO_IMG } from "@shared/colors";

const C = {
  ...COLORS,
  glass: "rgba(26, 34, 48, 0.75)",
  glassBorder: "rgba(168,178,189,0.08)",
  goldBorder: "rgba(201,168,76,0.25)",
};

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.05 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section id={id} ref={ref} className={`transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ scrollMarginTop: "2rem" }}>
      {children}
    </section>
  );
}

const insights = [
  { category: "Executive Guide", title: "The Hidden Cost of Ghost Assets: A CFO's Perspective", excerpt: "Organizations unknowingly pay millions in property taxes, insurance, and maintenance on assets that no longer exist. This guide examines the financial impact and provides a framework for executive action.", readTime: "12 min read", slug: "ghost-assets-cfo-perspective" },
  { category: "Industry Analysis", title: "Fixed Asset Management in Healthcare: Regulatory Compliance and Capital Recovery", excerpt: "Healthcare systems face unique challenges in asset accountability due to regulatory requirements, rapid technology turnover, and distributed facility networks. Learn how leading systems are recovering capital.", readTime: "9 min read", slug: "fixed-asset-management-healthcare" },
  { category: "Whitepaper", title: "From Spreadsheets to Smart Governance: The Asset Maturity Journey", excerpt: "A five-level maturity framework for evaluating your organization's asset management sophistication, with practical steps to advance from reactive tracking to proactive governance.", readTime: "15 min read", slug: "asset-maturity-journey" },
  { category: "Industry Scenario", title: "Illustrative Scenario: Manufacturing Ghost Asset Recovery", excerpt: "A modeled examination of how a mid-market manufacturer might discover that a significant portion of their fixed asset register consists of ghost assets, and the systematic approach used to identify recovery opportunities.", readTime: "8 min read", slug: "2025-state-enterprise-asset-management" },
  { category: "Technology Brief", title: "RFID, IoT, and the Future of Asset Verification", excerpt: "Emerging technologies are transforming how organizations track and verify physical assets. This brief examines the ROI of technology-enabled asset management versus traditional manual approaches.", readTime: "10 min read", slug: "technology-selection-framework" },
  { category: "Executive Guide", title: "Building a Business Case for Asset Intelligence Investment", excerpt: "A step-by-step framework for building an internal business case that quantifies the ROI of professional asset verification and governance implementation.", readTime: "11 min read", slug: "capital-recovery-business-case-template" },
  { category: "Industry Analysis", title: "Government & Education: Compliance-Driven Asset Accountability", excerpt: "Public sector organizations face GASB compliance requirements that demand accurate asset records. This analysis explores how agencies are meeting compliance while recovering hidden capital.", readTime: "9 min read", slug: "regulatory-compliance-asset-accountability" },
  { category: "Whitepaper", title: "Enterprise Asset Management Market Dynamics & Growth Outlook", excerpt: "Analysis of the global enterprise asset management market, growth drivers, competitive landscape, and where organizations may benefit from structured asset governance programs.", readTime: "14 min read", slug: "fixed-asset-management-market-dynamics" },
  { category: "Executive Perspective", title: "Why Asset Accountability is a Board-Level Conversation", excerpt: "Asset management has traditionally been an operations concern. This article explores why executive leadership and board members should treat asset accountability as a strategic governance priority.", readTime: "7 min read", slug: "asset-accountability-maturity-model" },
  { category: "Industry Analysis", title: "Construction & Heavy Equipment: Mobile Asset Challenges", excerpt: "Construction companies face unique challenges tracking equipment across job sites. This analysis examines how leading firms are implementing governance frameworks for mobile asset accountability.", readTime: "8 min read", slug: "ghost-asset-identification-checklist" },
  { category: "Strategic Brief", title: "The Relationship Between Asset Intelligence and ESG Reporting", excerpt: "Accurate asset data supports environmental, social, and governance reporting requirements. This brief explores the intersection of asset accountability and sustainability commitments.", readTime: "6 min read", slug: "lai-four-phase-methodology" },
  { category: "Executive Guide", title: "Preparing Your Organization for an Asset Intelligence Assessment", excerpt: "What leadership should know before engaging in an Executive Asset Intelligence Assessment — preparation steps, stakeholder involvement, and how to maximize value from the process.", readTime: "8 min read", slug: "executive-assessment-preparation" },
];

export default function Insights() {
  const [, navigate] = useLocation();
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", "Executive Guide", "Industry Analysis", "Whitepaper", "Industry Scenario", "Technology Brief", "Executive Perspective", "Strategic Brief"];
  const filtered = filter === "All" ? insights : insights.filter(i => i.category === filter);

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(to bottom, rgba(11,15,19,0.92), rgba(11,15,19,0.96)), url('${HERO_IMG}') center/cover fixed`, color: C.text }}>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: "8rem 2rem 4rem", textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "1.5rem" }}>Thought Leadership</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 700, color: C.text, lineHeight: 1.15, marginBottom: "2rem" }}>
          Executive Insights &<br /><span style={{ color: C.gold }}>Strategic Intelligence</span>
        </h1>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.05rem", color: C.textMuted, lineHeight: 1.8, maxWidth: 780, margin: "0 auto" }}>
          Research, analysis, and practical guidance for executive leadership navigating the complexities of enterprise asset management, governance, and capital accountability.
        </p>
      </section>

      {/* ═══ FEATURED INSIGHT ═══ */}
      <Section id="featured">
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 2rem 3rem" }}>
          <div style={{ background: C.glass, backdropFilter: "blur(12px)", border: `1px solid ${C.glassBorder}`, borderRadius: 10, padding: "2.5rem", borderLeft: `3px solid ${C.gold}` }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>Featured</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: C.text, marginBottom: "1rem", lineHeight: 1.3 }}>{insights[0].title}</h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.95rem", lineHeight: 1.75, marginBottom: "1.25rem" }}>{insights[0].excerpt}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: C.silver }}>{insights[0].readTime}</span>
              <button onClick={() => navigate("/insights/ghost-assets-cfo-perspective")} style={{ background: C.gold, border: "none", color: C.charcoal, padding: "0.5rem 1.25rem", borderRadius: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
                Read Full Article
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ CATEGORY FILTER ═══ */}
      <Section id="filter">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem 2rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  background: filter === cat ? C.goldMuted : "transparent",
                  border: `1px solid ${filter === cat ? C.gold : C.glassBorder}`,
                  borderRadius: 20,
                  padding: "0.45rem 1rem",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.78rem",
                  color: filter === cat ? C.gold : C.silver,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ INSIGHTS GRID ═══ */}
      <Section id="insights-grid">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem 4rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
            {filtered.slice(1).map((insight, i) => (
              <div key={i} onClick={() => navigate(`/insights/${insight.slug}`)} style={{ background: C.glass, backdropFilter: "blur(8px)", border: `1px solid ${C.glassBorder}`, borderRadius: 8, padding: "1.75rem", display: "flex", flexDirection: "column", transition: "border-color 0.3s", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold }}>{insight.category}</span>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.72rem", color: C.textMuted }}>{insight.readTime}</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.02rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem", lineHeight: 1.35 }}>{insight.title}</h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.83rem", lineHeight: 1.65, flex: 1 }}>{insight.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ CUSTOM ANALYSIS CTA ═══ */}
      <Section id="custom-cta">
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>
            Want Insights Tailored to Your Industry?
          </h2>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1rem", lineHeight: 1.75, maxWidth: 600, margin: "0 auto 2rem" }}>
            Our team can provide a custom analysis of your organization's ghost asset risk profile and governance maturity, with specific recommendations for your industry and operational environment.
          </p>
          <button onClick={() => navigate("/contact")} style={{ background: C.gold, color: "#0B0F13", border: "none", padding: "0.85rem 2rem", borderRadius: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}>
            Request Custom Analysis
          </button>
        </div>
      </Section>

      <div style={{ height: "4rem" }} />
    </div>
  );
}
