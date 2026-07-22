import { usePageMeta } from "@/hooks/usePageMeta";
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
  usePageMeta({ title: "Resources & Guides | Legacy Asset Intelligence", description: "Online guides, video library, and tools including our ROI Estimator to help evaluate asset management improvement opportunities.", canonical: "/resources" });
  const [, navigate] = useLocation();

  const whitepapers = [
    { category: "Executive Whitepaper", title: "The Hidden Cost of Ghost Assets: A CFO's Perspective", desc: "Organizations unknowingly pay millions in property taxes, insurance, and maintenance on assets that no longer exist. This guide examines the financial impact and provides a framework for executive action.", pages: "18 pages", readTime: "12 min", url: "/insights/ghost-assets-cfo-perspective" },
    { category: "Research Report", title: "2025 State of Enterprise Asset Management", desc: "Annual research report covering industry trends, technology adoption rates, ghost asset prevalence by sector, and best practices from leading organizations.", pages: "42 pages", readTime: "25 min", url: "/insights/2025-state-enterprise-asset-management" },
    { category: "Whitepaper", title: "Enterprise Asset Management Market Dynamics", desc: "Analysis of the global enterprise asset management market, growth drivers, competitive landscape, and where organizations may benefit from structured asset governance programs.", pages: "28 pages", readTime: "14 min", url: "/insights/fixed-asset-management-market-dynamics" },
    { category: "Whitepaper", title: "From Spreadsheets to Smart Governance: The Asset Maturity Journey", desc: "A five-level maturity framework for evaluating your organization's asset management sophistication, with practical steps to advance from reactive tracking to proactive governance.", pages: "22 pages", readTime: "15 min", url: "/insights/asset-maturity-journey" },
    { category: "Industry Report", title: "Fixed Asset Management in Healthcare: Regulatory Compliance and Capital Recovery", desc: "Healthcare systems face unique challenges in asset accountability due to regulatory requirements, rapid technology turnover, and distributed facility networks.", pages: "16 pages", readTime: "9 min", url: "/insights/fixed-asset-management-healthcare" },
    { category: "Compliance Guide", title: "Regulatory Compliance & Asset Accountability (SOX, GASB, IFRS)", desc: "A guide to regulatory requirements related to fixed asset management and how proper asset accountability supports compliance objectives across frameworks.", pages: "14 pages", readTime: "10 min", url: "/insights/regulatory-compliance-asset-accountability" },
  ];

  const guides = [
    { title: "Ghost Asset Identification Checklist", desc: "A guide to identifying potential ghost assets across your organization's fixed asset register. Includes department-specific indicators and red flags.", format: "Online Guide", url: "/insights/ghost-asset-identification-checklist" },
    { title: "Asset Accountability Maturity Model", desc: "A five-level maturity framework for evaluating your organization's asset management sophistication. Includes self-assessment scoring and improvement roadmap.", format: "Online Guide", url: "/insights/asset-accountability-maturity-model" },
    { title: "Capital Recovery Business Case Template", desc: "A framework for building an internal business case for asset intelligence investment. Includes considerations for structuring ROI analysis and stakeholder communication.", format: "Online Guide", url: "/insights/capital-recovery-business-case-template" },
    { title: "The LAI Four-Phase Methodology Overview", desc: "Detailed overview of our four-phase approach to asset intelligence, verification, technology enablement, and recurring governance. Includes timelines and deliverables.", format: "Online Guide", url: "/insights/lai-four-phase-methodology" },
    { title: "Executive Assessment Preparation Guide", desc: "How to prepare your organization for a Discovery and Executive Assessment — what to gather, who to involve, and what to expect from the process.", format: "Online Guide", url: "/insights/executive-assessment-preparation" },
    { title: "Technology Selection Framework", desc: "A structured evaluation framework for selecting asset management technology platforms, including scoring criteria, integration requirements, and implementation considerations.", format: "Online Guide", url: "/insights/technology-selection-framework" },
  ];

  const videos = [
    { title: "Introduction to Ghost Assets", id: "1rpOJFl52nQ", duration: "2:05", desc: "Overview of what ghost assets are, why they matter, and how organizations can begin addressing them." },
    { title: "Fixed Assets Audit Made Simple", id: "KfFMzLuUz6g", duration: "15:42", desc: "Step-by-step guide through the entire fixed asset lifecycle from acquisition and capitalization to depreciation, revaluation, and disposal." },
    { title: "The Fixed Asset Register Explained", id: "f4BBYjivdNg", duration: "12:18", desc: "Learn the basics of the fixed asset register, including templates and best practices for maintaining accuracy." },
    { title: "Streamlining Fixed Asset Verification", id: "AeP2DfVOjp4", duration: "8:34", desc: "Explore the challenges in physical verification of fixed assets and how technology-based solutions can overcome them." },
    { title: "Enterprise Asset Management Overview", id: "MRKGsyxx_n0", duration: "11:26", desc: "A comprehensive guide to enterprise asset management and EAM software, covering key concepts and best practices." },
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
          Access our library of executive whitepapers, practical frameworks, educational videos, and online guides designed to support informed decision-making about enterprise asset intelligence.
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
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.5rem" }}>Online Guides</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: C.text }}>Executive Guides & Frameworks</h2>
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
                  Read Guide
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {videos.map((video, i) => (
              <div key={i} style={{ background: C.glass, backdropFilter: "blur(8px)", border: `1px solid ${C.glassBorder}`, borderRadius: 8, padding: "1.25rem" }}>
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 6, marginBottom: "1rem" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: C.text, margin: 0 }}>{video.title}</h3>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: C.gold }}>{video.duration}</span>
                </div>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.8rem", lineHeight: 1.6, margin: 0 }}>{video.desc}</p>
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
          <div style={{ maxWidth: 400 }}>
            <div style={{ background: C.glass, backdropFilter: "blur(8px)", border: `1px solid ${C.goldBorder}`, borderRadius: 8, padding: "1.75rem" }}>
              <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: C.text, marginBottom: "0.5rem" }}>ROI Estimator</h3>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.82rem", lineHeight: 1.6, marginBottom: "0.75rem" }}>Explore a directional planning estimate for your organization's potential asset-record exposure based on portfolio size and industry.</p>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.7rem", lineHeight: 1.5, marginBottom: "1.25rem", fontStyle: "italic" }}>This tool provides a directional planning estimate — not a quote, valuation, or guarantee of recovery.</p>
              <button onClick={() => navigate("/")} style={{ background: C.gold, color: "#0B0F13", border: "none", padding: "0.6rem 1.25rem", borderRadius: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>View Estimator</button>
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
