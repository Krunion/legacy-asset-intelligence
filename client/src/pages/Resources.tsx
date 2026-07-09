/**
 * Legacy Asset Intelligence — Executive Resources Page
 * Section 6: Whitepaper library, executive guides, video content library,
 * downloadable frameworks, templates, and educational materials
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

export default function Resources() {
  const [, navigate] = useLocation();

  const whitepapers = [
    { category: "Executive Whitepaper", title: "The Hidden Cost of Ghost Assets: A CFO's Perspective", desc: "Organizations unknowingly pay millions in property taxes, insurance, and maintenance on assets that no longer exist. This guide examines the financial impact and provides a framework for executive action.", pages: "18 pages", readTime: "12 min", url: "/insights/ghost-assets-cfo-perspective" },
    { category: "Research Report", title: "2025 State of Enterprise Asset Management", desc: "Annual research report covering industry trends, technology adoption rates, ghost asset prevalence by sector, and best practices from leading organizations.", pages: "42 pages", readTime: "25 min", url: "/insights/2025-state-enterprise-asset-management" },
    { category: "Whitepaper", title: "The $264 Billion Opportunity: Fixed Asset Management Market Dynamics", desc: "In-depth analysis of the global fixed asset management market, growth drivers, competitive landscape, and where organizations should invest for maximum capital recovery.", pages: "28 pages", readTime: "14 min", url: "/insights/fixed-asset-management-market-dynamics" },
    { category: "Whitepaper", title: "From Spreadsheets to Smart Governance: The Asset Maturity Journey", desc: "A five-level maturity framework for evaluating your organization's asset management sophistication, with practical steps to advance from reactive tracking to proactive governance.", pages: "22 pages", readTime: "15 min", url: "/insights/asset-maturity-journey" },
    { category: "Industry Report", title: "Fixed Asset Management in Healthcare: Regulatory Compliance and Capital Recovery", desc: "Healthcare systems face unique challenges in asset accountability due to regulatory requirements, rapid technology turnover, and distributed facility networks.", pages: "16 pages", readTime: "9 min", url: "/insights/fixed-asset-management-healthcare" },
    { category: "Compliance Guide", title: "Regulatory Compliance & Asset Accountability (SOX, GASB, IFRS)", desc: "A guide to regulatory requirements related to fixed asset management and how proper asset accountability supports compliance objectives across frameworks.", pages: "14 pages", readTime: "10 min", url: "/insights/regulatory-compliance-asset-accountability" },
  ];

  const guides = [
    { title: "Ghost Asset Identification Checklist", desc: "A comprehensive 50-point checklist for identifying potential ghost assets across your organization's fixed asset register. Includes department-specific indicators and red flags.", format: "PDF · 12 pages", url: "/insights/ghost-asset-identification-checklist" },
    { title: "Asset Accountability Maturity Model", desc: "Our proprietary five-level maturity framework for evaluating your organization's asset management sophistication. Includes self-assessment scoring and improvement roadmap.", format: "PDF · 18 pages", url: "/insights/asset-accountability-maturity-model" },
    { title: "Capital Recovery Business Case Template", desc: "A ready-to-use executive presentation template for building an internal business case for asset intelligence investment. Includes ROI calculations and benchmark data.", format: "PPTX · 24 slides", url: "/insights/capital-recovery-business-case-template" },
    { title: "The LAI Four-Phase Methodology Overview", desc: "Detailed overview of our proprietary four-phase approach to ghost asset elimination and governance implementation. Includes timelines, deliverables, and expected outcomes.", format: "PDF · 16 pages", url: "/insights/lai-four-phase-methodology" },
    { title: "Executive Assessment Preparation Guide", desc: "How to prepare your organization for an Executive Asset Intelligence Assessment — what to gather, who to involve, and what to expect from the process.", format: "PDF · 8 pages", url: "/insights/executive-assessment-preparation" },
    { title: "Technology Selection Framework", desc: "A structured evaluation framework for selecting asset management technology platforms, including scoring criteria, integration requirements, and implementation considerations.", format: "PDF · 14 pages", url: "/insights/technology-selection-framework" },
  ];

  const videos = [
    { title: "Introduction to Ghost Assets", duration: "2:05", desc: "Overview of what ghost assets are, why they matter, and how organizations can begin addressing them.", status: "Available" },
    { title: "The Executive Assessment Process", duration: "Coming Soon", desc: "Walk-through of our Phase 1 discovery and executive assessment methodology.", status: "Coming Soon" },
    { title: "Technology-Enabled Asset Governance", duration: "Coming Soon", desc: "How modern platforms and IoT technology transform asset accountability from reactive to proactive.", status: "Coming Soon" },
    { title: "Understanding Your Asset Accountability Score", duration: "Coming Soon", desc: "Explanation of our proprietary scoring methodology and what it reveals about organizational maturity.", status: "Coming Soon" },
    { title: "Capital Recovery: From Identification to Realization", duration: "Coming Soon", desc: "The process of identifying, validating, and realizing capital recovery opportunities from ghost assets.", status: "Coming Soon" },
    { title: "Building Executive Support for Asset Intelligence", duration: "Coming Soon", desc: "How to build internal support and secure executive sponsorship for asset intelligence initiatives.", status: "Coming Soon" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(to bottom, rgba(11,15,19,0.92), rgba(11,15,19,0.96)), url('${HERO_IMG}') center/cover fixed`, color: C.text }}>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: "8rem 2rem 4rem", textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "1.5rem" }}>Executive Resources</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 700, color: C.text, lineHeight: 1.15, marginBottom: "2rem" }}>
          Research, Frameworks &<br /><span style={{ color: C.gold }}>Educational Materials</span>
        </h1>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.05rem", color: C.textMuted, lineHeight: 1.8, maxWidth: 780, margin: "0 auto" }}>
          Access our library of executive whitepapers, practical frameworks, educational videos, and downloadable tools designed to support informed decision-making about enterprise asset intelligence.
        </p>
      </section>

      {/* ═══ WHITEPAPER LIBRARY ═══ */}
      <Section id="whitepapers">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.5rem" }}>Whitepaper Library</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: C.text }}>Executive Research & Analysis</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.25rem" }}>
            {whitepapers.map((wp, i) => (
              <div key={i} style={{ background: C.glass, backdropFilter: "blur(8px)", border: `1px solid ${C.glassBorder}`, borderRadius: 8, padding: "1.75rem", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold }}>{wp.category}</span>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", color: C.textMuted }}>{wp.pages}</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem", lineHeight: 1.35 }}>{wp.title}</h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.85rem", lineHeight: 1.65, flex: 1 }}>{wp.desc}</p>
                <button onClick={() => navigate(wp.url)} style={{ marginTop: "1.25rem", background: "transparent", border: `1px solid ${C.goldBorder}`, color: C.gold, padding: "0.5rem 1rem", borderRadius: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", width: "fit-content" }}>
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ EXECUTIVE GUIDES & FRAMEWORKS ═══ */}
      <Section id="guides">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.5rem" }}>Downloadable Frameworks</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: C.text }}>Executive Guides & Tools</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
            {guides.map((guide, i) => (
              <div key={i} style={{ background: C.glass, backdropFilter: "blur(8px)", border: `1px solid ${C.glassBorder}`, borderRadius: 8, padding: "1.5rem", display: "flex", flexDirection: "column" }}>
                <div style={{ marginBottom: "0.75rem" }}>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", color: C.textMuted, background: "rgba(201,168,76,0.1)", padding: "0.2rem 0.5rem", borderRadius: 3 }}>{guide.format}</span>
                </div>
                <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: C.text, marginBottom: "0.6rem", lineHeight: 1.35 }}>{guide.title}</h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.82rem", lineHeight: 1.6, flex: 1 }}>{guide.desc}</p>
                <button onClick={() => navigate(guide.url)} style={{ marginTop: "1rem", background: "transparent", border: `1px solid ${C.glassBorder}`, color: C.silver, padding: "0.45rem 0.9rem", borderRadius: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", width: "fit-content" }}>
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ VIDEO LIBRARY ═══ */}
      <Section id="videos">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.5rem" }}>Video Library</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: C.text }}>Educational Video Content</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
            {videos.map((video, i) => (
              <div key={i} style={{ background: C.glass, backdropFilter: "blur(8px)", border: `1px solid ${C.glassBorder}`, borderRadius: 8, padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.92rem", fontWeight: 700, color: C.text }}>{video.title}</h3>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: video.status === "Available" ? C.gold : C.textMuted }}>{video.duration}</span>
                </div>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.82rem", lineHeight: 1.6, margin: 0 }}>{video.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ INTERACTIVE TOOLS ═══ */}
      <Section id="interactive-tools">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.5rem" }}>Interactive Tools</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: C.text }}>Self-Assessment & Planning Tools</h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.9rem", lineHeight: 1.7, marginTop: "0.75rem" }}>Interactive tools to help you evaluate your organization's asset management maturity and estimate potential capital recovery.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            <div style={{ background: C.glass, backdropFilter: "blur(8px)", border: `1px solid ${C.goldBorder}`, borderRadius: 8, padding: "1.75rem" }}>
              <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: C.text, marginBottom: "0.5rem" }}>ROI Calculator</h3>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.82rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>Estimate your organization's potential capital recovery based on asset base size, industry, and current verification practices.</p>
              <button onClick={() => navigate("/#roi-calculator")} style={{ background: C.gold, color: "#0B0F13", border: "none", padding: "0.6rem 1.25rem", borderRadius: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>Open Calculator</button>
            </div>
            <div style={{ background: C.glass, backdropFilter: "blur(8px)", border: `1px solid ${C.glassBorder}`, borderRadius: 8, padding: "1.75rem", opacity: 0.7 }}>
              <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: C.text, marginBottom: "0.5rem" }}>Maturity Self-Assessment</h3>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.82rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>Score your organization across five dimensions of asset management maturity and receive a personalized improvement roadmap.</p>
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: C.gold, fontWeight: 600 }}>Coming Soon</span>
            </div>
            <div style={{ background: C.glass, backdropFilter: "blur(8px)", border: `1px solid ${C.glassBorder}`, borderRadius: 8, padding: "1.75rem", opacity: 0.7 }}>
              <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: C.text, marginBottom: "0.5rem" }}>Governance Readiness Scorecard</h3>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.82rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>Evaluate your organization's readiness for implementing a comprehensive asset governance framework.</p>
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: C.gold, fontWeight: 600 }}>Coming Soon</span>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ KNOWLEDGE BASE CTA ═══ */}
      <Section id="knowledge-base">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ background: C.goldMuted, borderRadius: 8, border: `1px solid ${C.goldBorder}`, padding: "3rem", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>
              Need Custom Materials?
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1rem", lineHeight: 1.75, maxWidth: 600, margin: "0 auto 2rem" }}>
              Our team can develop industry-specific resources, custom presentations, and tailored analysis materials for your organization's specific needs and executive audience.
            </p>
            <button onClick={() => navigate("/contact")} style={{ background: C.gold, color: "#0B0F13", border: "none", padding: "0.85rem 2rem", borderRadius: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}>
              Request Custom Materials
            </button>
          </div>
        </div>
      </Section>

      <div style={{ height: "4rem" }} />
    </div>
  );
}
