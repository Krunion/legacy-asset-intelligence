/**
 * Legacy Asset Intelligence — Executive Home Page
 * Redesigned per Section 2: Executive consulting introduction
 * Sections: Hero → Business Challenges → Methodology → Deliverables → Trust → Thought Leadership → Industries → Closing
 */

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import ROICalculator from "@/components/ROICalculator";
import CaseStudies from "@/components/CaseStudies";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import VideoModal from "@/components/VideoModal";
import { HERO_IMG } from "@shared/colors";

// ─── Colors ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#0B0F13",
  navy: "#111820",
  slate: "#1A2230",
  gold: "#C9A84C",
  goldMuted: "rgba(201,168,76,0.12)",
  goldBorder: "rgba(201,168,76,0.25)",
  silver: "#A8B2BD",
  silverLight: "#C8D0D8",
  text: "#EAEDF0",
  textMuted: "#7A8694",
  border: "rgba(168,178,189,0.1)",
  borderLight: "rgba(168,178,189,0.2)",
  teal: "#0D9488",
  tealLight: "#14B8A6",
  emerald: "#1B4D3E",
  glass: "rgba(26, 34, 48, 0.75)",
  glassBorder: "rgba(168,178,189,0.08)",
};

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ end, suffix = "", prefix = "", duration = 1800 }: {
  end: number; suffix?: string; prefix?: string; duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = performance.now();
        const step = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ─── Section Wrapper with fade-in ────────────────────────────────────────────
function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.03 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ scrollMarginTop: "2rem" }}
    >
      {children}
    </section>
  );
}

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div style={{ background: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", minHeight: "100vh" }}>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <Section id="hero">
        <div style={{ padding: "8rem 2rem 6rem", textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "1.5rem" }}>
            Executive Asset Intelligence
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 700, color: C.text, lineHeight: 1.1, marginBottom: "1.75rem" }}>
            Recover Hidden Capital.<br />Strengthen Financial Accountability.
          </h1>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "clamp(1rem, 2vw, 1.15rem)", color: C.silver, maxWidth: 720, margin: "0 auto 2.5rem", lineHeight: 1.8 }}>
            Legacy Asset Intelligence helps executive leadership make better financial and operational decisions by identifying ghost assets, recovering lost capital, and building governance programs that protect investments permanently.
          </p>

          {/* Dual CTAs */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
            <button
              onClick={() => navigate("/contact")}
              style={{ background: C.gold, color: C.bg, border: "none", padding: "0.85rem 2rem", borderRadius: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.02em", cursor: "pointer", transition: "transform 0.16s ease-out" }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Schedule Executive Assessment
            </button>
            <button
              onClick={() => document.getElementById("methodology")?.scrollIntoView({ behavior: "smooth" })}
              style={{ background: "transparent", color: C.silver, border: `1px solid ${C.borderLight}`, padding: "0.85rem 2rem", borderRadius: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer", transition: "border-color 0.2s" }}
            >
              Explore Our Methodology
            </button>
          </div>

          {/* Founder Video */}
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <VideoModal
              phaseNumber={1}
              phaseName="Founder Introduction"
              description="Hear from our Founder about the mission of Legacy Asset Intelligence and why Executive Asset Intelligence matters for modern organizations."
              videoUrl="https://youtu.be/1rpOJFl52nQ"
              isYouTube={true}
            />
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          BUSINESS CHALLENGES SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <Section id="challenges">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>
              The Hidden Financial Crisis
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1rem" }}>
              Inaccurate Asset Information Creates<br />Significant Financial Exposure
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1rem", maxWidth: 700, margin: "0 auto", lineHeight: 1.7 }}>
              Most organizations unknowingly carry 15–30% of their fixed asset register as ghost assets — items that no longer exist physically but continue generating real financial obligations.
            </p>
          </div>

          {/* Challenge Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
            {[
              { title: "Ghost Assets & Phantom Costs", desc: "Assets that appear on your register but no longer exist physically — generating property taxes, insurance premiums, and maintenance contracts on equipment you don't own.", stat: "15–30%", statLabel: "of typical registers" },
              { title: "Duplicate & Unnecessary Purchases", desc: "Without accurate visibility into existing assets, organizations routinely purchase equipment they already own, wasting capital that could be deployed strategically.", stat: "$2.4M", statLabel: "avg. annual waste" },
              { title: "Insurance & Tax Overpayment", desc: "Inflated asset registers directly increase insurance premiums and property tax assessments. Organizations pay to insure and tax assets that no longer exist.", stat: "35%", statLabel: "of recoverable savings" },
              { title: "Inaccurate Financial Reporting", desc: "Ghost assets distort depreciation schedules, net book values, and balance sheet accuracy — creating compliance risk and misleading executive decision-making.", stat: "SOX", statLabel: "compliance risk" },
              { title: "Inefficient Capital Planning", desc: "Without accurate asset intelligence, capital expenditure decisions are based on incomplete information, leading to misallocated budgets and deferred critical investments.", stat: "25%", statLabel: "of IT budgets affected" },
              { title: "Governance & Accountability Gaps", desc: "Organizations without formal asset governance programs experience recurring accuracy degradation, losing the benefits of any previous inventory effort within 18–24 months.", stat: "18mo", statLabel: "accuracy half-life" },
            ].map((challenge, i) => (
              <div key={i} style={{ background: C.glass, backdropFilter: "blur(8px)", borderRadius: 8, border: `1px solid ${C.glassBorder}`, padding: "2rem", transition: "border-color 0.3s" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1rem" }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: C.gold }}>{challenge.stat}</span>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{challenge.statLabel}</span>
                </div>
                <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", fontWeight: 600, color: C.text, marginBottom: "0.75rem" }}>
                  {challenge.title}
                </h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: C.silver, lineHeight: 1.7, margin: 0 }}>
                  {challenge.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Summary stat bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            {[
              { value: 15, suffix: "%", label: "Ghost Asset Rate", sub: "of typical portfolio" },
              { value: 264, suffix: "B", prefix: "$", label: "Market Size", sub: "Fixed Asset Mgmt (2023)" },
              { value: 25, suffix: "%", label: "Budget Waste", sub: "from ghost assets" },
              { value: 28, suffix: "%", label: "Market Growth", sub: "CAGR through 2030" },
            ].map((m, i) => (
              <div key={i} style={{ textAlign: "center", padding: "1.5rem", background: C.glass, backdropFilter: "blur(6px)", borderRadius: 8, border: `1px solid ${C.glassBorder}` }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: C.gold }}>
                  <AnimatedCounter end={m.value} prefix={m.prefix || ""} suffix={m.suffix} />
                </div>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: C.silverLight, marginTop: "0.5rem", fontSize: "0.85rem" }}>{m.label}</p>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.75rem", marginTop: "0.2rem" }}>{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          METHODOLOGY SECTION — Executive Consulting Framework
          ═══════════════════════════════════════════════════════════════════════ */}
      <Section id="methodology">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>
              Our Approach
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1rem" }}>
              The Executive Asset Intelligence Framework
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1rem", maxWidth: 750, margin: "0 auto", lineHeight: 1.7 }}>
              A comprehensive consulting methodology that guides organizations from initial discovery through long-term governance — creating sustainable asset accountability that extends far beyond a single inventory event.
            </p>
          </div>

          {/* Phase progression visual */}
          <div style={{ display: "flex", alignItems: "stretch", gap: 0, marginBottom: "3rem", position: "relative" }}>
            {[
              { phase: "01", title: "Executive Discovery & Assessment", accent: C.silver, desc: "Stakeholder interviews, asset management maturity review, opportunity modeling, and a strategic roadmap for capital recovery.", deliverable: "Discovery Report + Recovery Roadmap" },
              { phase: "02", title: "Physical Verification & Accountability", accent: C.gold, desc: "Wall-to-wall inventory, asset tagging, condition assessment, floor-to-book reconciliation, and ghost asset identification.", deliverable: "Complete Asset Inventory + Reconciled FAR" },
              { phase: "03", title: "Technology Enablement & Governance", accent: C.teal, desc: "Platform selection, data migration, dashboard configuration, automated workflows, ERP integration, and staff training.", deliverable: "Live Asset Tracking Platform" },
              { phase: "04", title: "Recurring Intelligence & Accountability", accent: C.emerald, desc: "Quarterly rolling audits, continuous reconciliation, executive KPI dashboards, compliance reporting, and governance refinement.", deliverable: "Ongoing Governance Retainer" },
            ].map((p, i) => (
              <div key={i} style={{ flex: 1, background: C.glass, backdropFilter: "blur(8px)", border: `1px solid ${C.glassBorder}`, borderRadius: i === 0 ? "8px 0 0 8px" : i === 3 ? "0 8px 8px 0" : 0, padding: "2rem 1.5rem", borderRight: i < 3 ? `1px solid ${C.border}` : undefined, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: p.accent }}>{p.phase}</span>
                  <div style={{ height: 1, flex: 1, background: `linear-gradient(to right, ${p.accent}, transparent)` }} />
                </div>
                <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: C.text, marginBottom: "0.75rem", lineHeight: 1.3 }}>
                  {p.title}
                </h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.82rem", color: C.textMuted, lineHeight: 1.6, flex: 1, marginBottom: "1rem" }}>
                  {p.desc}
                </p>
                <div style={{ background: C.goldMuted, borderRadius: 4, padding: "0.6rem 0.75rem" }}>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.6rem", fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.15rem" }}>Deliverable</p>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: C.text, margin: 0 }}>{p.deliverable}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Video Section */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
            <div style={{ padding: "1.5rem", background: C.glass, backdropFilter: "blur(6px)", borderRadius: 8, border: `1px solid ${C.glassBorder}`, textAlign: "center" }}>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 500, color: C.silver, marginBottom: "0.75rem", fontSize: "0.85rem" }}>Discovery & Assessment</p>
              <VideoModal phaseNumber={1} phaseName="Discovery & Executive Assessments" description="Understand how we conduct executive assessments and opportunity modeling." videoUrl="https://youtu.be/1rpOJFl52nQ" isYouTube={true} />
            </div>
            <div style={{ padding: "1.5rem", background: C.glass, backdropFilter: "blur(6px)", borderRadius: 8, border: `1px solid ${C.glassBorder}`, textAlign: "center" }}>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 500, color: C.silver, marginBottom: "0.75rem", fontSize: "0.85rem" }}>Physical Verification</p>
              <VideoModal phaseNumber={2} phaseName="Physical Asset Accountability" description="Our wall-to-wall inventory process and floor-to-book reconciliation." />
            </div>
            <div style={{ padding: "1.5rem", background: C.glass, backdropFilter: "blur(6px)", borderRadius: 8, border: `1px solid ${C.glassBorder}`, textAlign: "center" }}>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 500, color: C.silver, marginBottom: "0.75rem", fontSize: "0.85rem" }}>Technology & Governance</p>
              <VideoModal phaseNumber={3} phaseName="Technology Platform Integration" description="How we select, configure, and integrate asset management platforms." />
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          EXECUTIVE DELIVERABLES SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <Section id="deliverables">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>
              What You Receive
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1rem" }}>
              Executive-Level Intelligence & Deliverables
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1rem", maxWidth: 700, margin: "0 auto", lineHeight: 1.7 }}>
              We deliver actionable intelligence — not just data. Every engagement produces strategic recommendations and measurable outcomes that executive leadership can act upon immediately.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {[
              { title: "Executive Assessment Report", desc: "Comprehensive analysis of your organization's asset management maturity, risk exposure, and recovery opportunity with prioritized recommendations." },
              { title: "Recoverable Capital Analysis", desc: "Detailed financial modeling of ghost asset elimination savings across property tax, insurance, maintenance, and duplicate purchase categories." },
              { title: "Asset Accountability Score", desc: "Proprietary scoring framework that benchmarks your organization's asset governance maturity against industry standards and best practices." },
              { title: "Governance Maturity Evaluation", desc: "Assessment of existing policies, procedures, and controls with a roadmap for advancing to proactive asset governance." },
              { title: "Strategic Roadmap", desc: "Phased implementation plan with timelines, resource requirements, expected ROI milestones, and executive decision points." },
              { title: "Executive Dashboard", desc: "Real-time visibility into asset accuracy, recovery progress, governance compliance, and financial impact through customized reporting." },
              { title: "Board-Level Presentations", desc: "Professional presentation materials designed for board reporting, including financial impact summaries and strategic recommendations." },
            ].map((d, i) => (
              <div key={i} style={{ background: C.glass, backdropFilter: "blur(8px)", borderRadius: 8, border: `1px solid ${C.glassBorder}`, padding: "1.75rem", transition: "border-color 0.3s" }}>
                <div style={{ width: 32, height: 2, background: C.gold, marginBottom: "1.25rem", borderRadius: 1 }} />
                <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", fontWeight: 600, color: C.text, marginBottom: "0.75rem" }}>
                  {d.title}
                </h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.silver, lineHeight: 1.7, margin: 0 }}>
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TRUST & CREDIBILITY SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <Section id="trust">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>
              Why Organizations Trust Us
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1rem" }}>
              Built on Integrity, Expertise & Accountability
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
            {[
              { title: "Veteran-Owned Business", desc: "Founded by military veterans who bring discipline, integrity, and mission-focused execution to every client engagement." },
              { title: "SDVOSB Certification", desc: "Service-Disabled Veteran-Owned Small Business certification pending — providing procurement advantages for government and enterprise clients." },
              { title: "Professional Liability Coverage", desc: "Comprehensive Professional Liability, General Liability, and Cyber Liability insurance protecting every client engagement." },
              { title: "Asset Panda Expertise", desc: "Deep platform expertise in Asset Panda configuration, implementation, and optimization for enterprise asset tracking environments." },
              { title: "Proven Methodology", desc: "Our four-phase framework has been developed through extensive industry research and real-world consulting experience across multiple sectors." },
              { title: "Executive-Level Engagement", desc: "We work directly with CFOs, COOs, and VP-level leadership — ensuring strategic alignment and organizational commitment from day one." },
            ].map((t, i) => (
              <div key={i} style={{ background: C.glass, backdropFilter: "blur(8px)", borderRadius: 8, border: `1px solid ${C.glassBorder}`, padding: "1.75rem" }}>
                <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: C.text, marginBottom: "0.75rem" }}>
                  {t.title}
                </h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.silver, lineHeight: 1.7, margin: 0 }}>
                  {t.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Future testimonials placeholder */}
          <div style={{ background: C.goldMuted, borderRadius: 8, border: `1px solid ${C.goldBorder}`, padding: "2rem", textAlign: "center" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.silver, lineHeight: 1.7, margin: 0 }}>
              <em>Client testimonials, measurable project outcomes, and success stories will be featured here as our engagement portfolio grows.</em>
            </p>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          THOUGHT LEADERSHIP SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <Section id="thought-leadership">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>
              Knowledge & Insights
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1rem" }}>
              Executive Education & Thought Leadership
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1rem", maxWidth: 700, margin: "0 auto", lineHeight: 1.7 }}>
              Explore our library of executive guides, whitepapers, and educational content designed to help leadership teams understand and address asset intelligence challenges.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2.5rem" }}>
            {[
              { type: "EXECUTIVE GUIDE", title: "The Hidden Cost of Ghost Assets: A CFO's Perspective", desc: "How ghost assets silently erode profitability and what executive leadership can do about it.", link: "/insights" },
              { type: "WHITEPAPER", title: "From Spreadsheets to Smart Governance: The Asset Maturity Journey", desc: "A five-level framework for evaluating and advancing your organization's asset management sophistication.", link: "/resources" },
              { type: "INDUSTRY ANALYSIS", title: "Fixed Asset Management in Healthcare: Compliance & Capital Recovery", desc: "Unique challenges healthcare systems face in asset accountability and regulatory compliance.", link: "/insights" },
            ].map((item, i) => (
              <div key={i} onClick={() => navigate(item.link)} style={{ background: C.glass, backdropFilter: "blur(8px)", borderRadius: 8, border: `1px solid ${C.glassBorder}`, padding: "2rem", cursor: "pointer", transition: "border-color 0.3s, transform 0.2s" }}>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.gold, marginBottom: "1rem" }}>
                  {item.type}
                </p>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem", lineHeight: 1.3 }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.silver, lineHeight: 1.7, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => navigate("/insights")}
              style={{ background: "transparent", color: C.gold, border: `1px solid ${C.goldBorder}`, padding: "0.75rem 2rem", borderRadius: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer" }}
            >
              Explore All Insights
            </button>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          INDUSTRIES SERVED SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <Section id="industries">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>
              Industries We Serve
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1rem" }}>
              Deep Expertise Across Capital-Intensive Sectors
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1rem", maxWidth: 700, margin: "0 auto", lineHeight: 1.7 }}>
              Every industry faces unique asset accountability challenges. We understand the operational realities, regulatory requirements, and financial pressures specific to your sector.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
            {[
              { name: "Healthcare Systems", challenge: "Rapid technology turnover, distributed facilities, regulatory compliance requirements (Joint Commission, CMS), and complex capital equipment lifecycles create persistent ghost asset accumulation." },
              { name: "Manufacturing", challenge: "High-value production equipment, multi-facility operations, M&A integration complexity, and continuous capital investment create significant reconciliation challenges." },
              { name: "Education & Universities", challenge: "Distributed campus environments, decentralized purchasing, technology refresh cycles, and grant-funded equipment tracking requirements." },
              { name: "Utilities & Energy", challenge: "Geographically dispersed infrastructure, long asset lifecycles, regulatory reporting requirements, and complex depreciation schedules." },
              { name: "Logistics & Distribution", challenge: "Mobile assets, high-volume equipment turnover, multi-location warehouse operations, and fleet management complexity." },
              { name: "Construction & Engineering", challenge: "Project-based asset deployment, equipment sharing across job sites, high depreciation rates, and theft/loss exposure." },
              { name: "Government & Public Sector", challenge: "Strict accountability requirements, audit compliance mandates, procurement regulations, and multi-agency coordination challenges." },
            ].map((ind, i) => (
              <div key={i} style={{ background: C.glass, backdropFilter: "blur(8px)", borderRadius: 8, border: `1px solid ${C.glassBorder}`, padding: "1.75rem" }}>
                <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", fontWeight: 600, color: C.gold, marginBottom: "0.75rem" }}>
                  {ind.name}
                </h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.silver, lineHeight: 1.7, margin: 0 }}>
                  {ind.challenge}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CLIENT RESULTS / CASE STUDIES
          ═══════════════════════════════════════════════════════════════════════ */}
      <Section id="case-studies">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>
              Proven Results
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1rem" }}>
              Real-World Capital Recovery Examples
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1rem", maxWidth: 700, margin: "0 auto", lineHeight: 1.7 }}>
              See how organizations across industries have recovered significant capital and strengthened governance through our methodology.
            </p>
          </div>
          <CaseStudies />
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          ROI CALCULATOR — Consultative CTA
          ═══════════════════════════════════════════════════════════════════════ */}
      <Section id="calculator">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>
              Assess Your Opportunity
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1rem" }}>
              Recoverable Capital Calculator
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1rem", maxWidth: 700, margin: "0 auto", lineHeight: 1.7 }}>
              Estimate your organization's ghost asset recovery potential in minutes. Receive a personalized analysis of potential savings across property tax, insurance, maintenance, and duplicate purchases.
            </p>
          </div>
          <ROICalculator />
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CLOSING SECTION — Final CTA
          ═══════════════════════════════════════════════════════════════════════ */}
      <Section id="closing">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "6rem 2rem", textAlign: "center" }}>
          <div style={{ background: C.glass, backdropFilter: "blur(12px)", borderRadius: 12, border: `1px solid ${C.goldBorder}`, padding: "4rem 3rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1.5rem" }}>
              Your Organization Deserves Accurate Asset Intelligence
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: C.silver, lineHeight: 1.8, maxWidth: 650, margin: "0 auto 2rem" }}>
              Ghost assets are silently eroding your financial position. Inaccurate registers are inflating your tax obligations, insurance premiums, and maintenance costs. Legacy Asset Intelligence provides the expertise, methodology, and technology to recover hidden capital and build permanent accountability.
            </p>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.7, maxWidth: 600, margin: "0 auto 2.5rem" }}>
              Schedule an Executive Asset Intelligence Assessment to understand your organization's recovery opportunity, evaluate your governance maturity, and receive a strategic roadmap for improvement.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/contact")}
                style={{ background: C.gold, color: C.bg, border: "none", padding: "0.9rem 2.5rem", borderRadius: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", transition: "transform 0.16s ease-out" }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Schedule Executive Assessment
              </button>
              <button
                onClick={() => navigate("/resources")}
                style={{ background: "transparent", color: C.silver, border: `1px solid ${C.borderLight}`, padding: "0.9rem 2.5rem", borderRadius: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 500, cursor: "pointer" }}
              >
                Download Resources
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          EXPANDED FOOTER
          ═══════════════════════════════════════════════════════════════════════ */}
      <footer style={{ background: "rgba(11, 15, 19, 0.95)", backdropFilter: "blur(8px)", borderTop: `1px solid ${C.border}`, padding: "4rem 2rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>
            {/* Brand */}
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>
                Legacy Asset Intelligence
              </h3>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.7, marginBottom: "1rem" }}>
                Specialized consulting firm helping organizations recover hidden capital, strengthen financial accountability, and build sustainable asset governance programs.
              </p>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: C.textMuted }}>
                Veteran-Owned Business
              </p>
            </div>
            {/* Quick Links */}
            <div>
              <h4 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: C.gold, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Company</h4>
              {[{ label: "Team", path: "/team" }, { label: "Careers", path: "/career" }, { label: "Contact", path: "/contact" }, { label: "FAQ", path: "/faq" }].map(l => (
                <p key={l.path} onClick={() => navigate(l.path)} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.silver, marginBottom: "0.5rem", cursor: "pointer" }}>{l.label}</p>
              ))}
            </div>
            {/* Resources */}
            <div>
              <h4 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: C.gold, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Resources</h4>
              {[{ label: "Executive Insights", path: "/insights" }, { label: "Whitepapers & Guides", path: "/resources" }, { label: "ROI Calculator", path: "#calculator" }, { label: "FAQ", path: "/faq" }].map(l => (
                <p key={l.label} onClick={() => l.path.startsWith("#") ? document.getElementById(l.path.slice(1))?.scrollIntoView({ behavior: "smooth" }) : navigate(l.path)} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.silver, marginBottom: "0.5rem", cursor: "pointer" }}>{l.label}</p>
              ))}
            </div>
            {/* Contact */}
            <div>
              <h4 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: C.gold, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Get in Touch</h4>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.silver, marginBottom: "0.5rem" }}>info@legacyassetintelligence.com</p>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.silver, marginBottom: "1rem" }}>legacyassetintelligence.com</p>
              <button
                onClick={() => navigate("/contact")}
                style={{ background: C.gold, color: C.bg, border: "none", padding: "0.5rem 1.25rem", borderRadius: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
              >
                Request Consultation
              </button>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: C.textMuted }}>
              &copy; {new Date().getFullYear()} Legacy Asset Intelligence. All rights reserved.
            </p>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: C.textMuted }}>
              Veteran-Owned &middot; Professional Liability Insured &middot; Cyber Liability Insured
            </p>
          </div>
        </div>
      </footer>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}
