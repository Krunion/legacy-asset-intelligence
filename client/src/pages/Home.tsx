/**
 * Legacy Asset Intelligence — Executive Home Page
 * Design: Dark executive consulting aesthetic
 * No white cards. Generous spacing. Outcome-focused messaging.
 */

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
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
  silver: "#A8B2BD",
  silverLight: "#C8D0D8",
  text: "#EAEDF0",
  textMuted: "#7A8694",
  border: "rgba(168,178,189,0.1)",
  borderLight: "rgba(168,178,189,0.2)",
  teal: "#0D9488",
  tealLight: "#14B8A6",
  emerald: "#1B4D3E",
};

// ─── Chart Data ───────────────────────────────────────────────────────────────
const marketData = [
  { name: "Manufacturing", value: 28, color: C.gold },
  { name: "Healthcare", value: 24, color: C.teal },
  { name: "IT / Data Centers", value: 22, color: C.silver },
  { name: "Government / Education", value: 16, color: C.emerald },
  { name: "Other Industries", value: 10, color: C.textMuted },
];

const ghostAssetImpactData = [
  { category: "Property Tax", savings: 35 },
  { category: "Insurance", savings: 25 },
  { category: "Maintenance", savings: 20 },
  { category: "Duplicate Purchases", savings: 12 },
  { category: "Audit & Compliance", savings: 8 },
];

const marketGrowthData = [
  { year: "2023", size: 264.7 },
  { year: "2024", size: 339.6 },
  { year: "2025", size: 435.7 },
  { year: "2026", size: 558.9 },
  { year: "2027", size: 717.0 },
  { year: "2028", size: 919.8 },
  { year: "2029", size: 1180.0 },
  { year: "2030", size: 1513.7 },
];

const competitorData = [
  { name: "Kroll", breadth: 95, specialization: 70, techPlatform: 65, governance: 80 },
  { name: "Verasset", breadth: 60, specialization: 90, techPlatform: 55, governance: 50 },
  { name: "TagMyAssets", breadth: 45, specialization: 85, techPlatform: 50, governance: 40 },
  { name: "LAI (Us)", breadth: 75, specialization: 95, techPlatform: 90, governance: 95 },
];

// ─── Nav Sections ─────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: "executive-summary", label: "Executive Summary" },
  { id: "market-analysis", label: "Market Analysis" },
  { id: "services", label: "Methodology" },
  { id: "competitive", label: "Competitive Position" },
  { id: "case-studies", label: "Client Results" },
  { id: "calculator", label: "Capital Calculator" },
];

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

// ─── Section Wrapper ──────────────────────────────────────────────────────────
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
    <section
      id={id}
      ref={ref}
      className={`transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{ scrollMarginTop: "2rem", marginBottom: "5rem" }}
    >
      {children}
    </section>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ label, title, subtitle }: {
  label: string; title: string; subtitle?: string;
}) {
  return (
    <div className="section-header" style={{ marginBottom: "2.5rem" }}>
      <p style={{ color: C.gold, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        {label}
      </p>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: C.text, lineHeight: 1.2 }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ color: C.textMuted, marginTop: "0.75rem", fontSize: "1rem", fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.6 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, prefix = "", suffix = "" }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(26, 34, 48, 0.9)", border: `1px solid ${C.borderLight}`, borderRadius: 6, padding: "10px 14px", backdropFilter: "blur(4px)" }}>
      <p style={{ fontWeight: 600, color: C.text, marginBottom: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem" }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || C.silver, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", margin: 0 }}>
          {p.name}: {prefix}{p.value.toLocaleString()}{suffix}
        </p>
      ))}
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();
  const [activeSection, setActiveSection] = useState("executive-summary");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_SECTIONS.map(s => document.getElementById(s.id));
      const scrollY = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(NAV_SECTIONS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileNavOpen(false);
  };

  return (
    <div style={{ background: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", minHeight: "100vh" }}>

      {/* ── INTERNAL NAV BAR ── */}
      <header style={{ background: "rgba(17, 24, 32, 0.9)", backdropFilter: "blur(8px)", position: "sticky", top: 56, zIndex: 40, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 48 }} className="header-container">
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", overflowX: "auto" }}>
            {NAV_SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: activeSection === s.id ? C.gold : C.textMuted,
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.78rem",
                  fontWeight: activeSection === s.id ? 600 : 400,
                  whiteSpace: "nowrap",
                  transition: "color 0.2s",
                  padding: "0.5rem 0",
                  borderBottom: activeSection === s.id ? `2px solid ${C.gold}` : "2px solid transparent",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate("/contact")}
            style={{
              background: C.gold,
              color: C.bg,
              border: "none",
              padding: "0.4rem 1.2rem",
              borderRadius: 4,
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.02em",
              flexShrink: 0,
            }}
          >
            Schedule Assessment
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem" }} className="main-content">

        {/* SECTION 1: HERO / EXECUTIVE SUMMARY */}
        <Section id="executive-summary">
          {/* Hero */}
          <div style={{ marginBottom: "4rem", textAlign: "center" }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, color: C.text, lineHeight: 1.15, marginBottom: "1.5rem" }}>
              Recover Millions in Hidden Capital.
            </h1>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "clamp(1rem, 2vw, 1.15rem)", color: C.textMuted, maxWidth: 700, margin: "0 auto", lineHeight: 1.7 }}>
              We help healthcare systems, manufacturers, utilities, and government organizations identify ghost assets, recover lost capital, and implement governance programs that protect investments permanently.
            </p>
          </div>

          {/* Key Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "4rem" }}>
            {[
              { value: 15, suffix: "%", label: "Ghost Asset Loss", sub: "of typical portfolio" },
              { value: 264, suffix: "B", prefix: "$", label: "Market Opportunity", sub: "Fixed Asset Mgmt" },
              { value: 25, suffix: "%", label: "IT Budget Waste", sub: "from ghost assets" },
              { value: 28, suffix: "%", label: "CAGR Growth", sub: "through 2030" },
            ].map((m, i) => (
              <div key={i} className="metric-card">
                <div className="stat-number">
                  <AnimatedCounter end={m.value} prefix={m.prefix || ""} suffix={m.suffix} />
                </div>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: C.silverLight, marginTop: "0.6rem", fontSize: "0.9rem" }}>
                  {m.label}
                </p>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.78rem", marginTop: "0.25rem" }}>
                  {m.sub}
                </p>
              </div>
            ))}
          </div>

          {/* Executive Summary Text */}
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.silver, lineHeight: 1.85, fontSize: "0.97rem", maxWidth: 900 }}>
            <p style={{ marginBottom: "1.25rem" }}>
              <strong style={{ color: C.text }}>Legacy Asset Intelligence</strong> is a specialized consulting firm built to solve one of the most overlooked financial problems in enterprise operations: <strong style={{ color: C.gold }}>ghost assets</strong>. These are items that appear on a company's Fixed Asset Register but are physically missing, fully depreciated, or otherwise non-existent. Industry research consistently shows that 15% to 30% of a typical organization's fixed assets are ghosts, silently consuming up to 25% of IT and operational budgets through unnecessary maintenance contracts, inflated insurance premiums, and overpaid property taxes.
            </p>
            <p style={{ marginBottom: "1.25rem" }}>
              Our firm addresses this problem through a proprietary four-phase methodology: executive assessment and opportunity modeling, physical asset accountability and verification, technology platform integration and governance design, and optional recurring governance services.
            </p>
            <p>
              The global fixed asset management market was valued at <strong style={{ color: C.text }}>$264.68 billion in 2023</strong> and is projected to grow at a 28.3% CAGR through 2030, reaching over $1.5 trillion. Legacy Asset Intelligence is positioned to capture a meaningful share of this expanding market.
            </p>
          </div>
        </Section>

        {/* SECTION 2: MARKET ANALYSIS */}
        <Section id="market-analysis">
          <SectionHeader label="Market Analysis" title="The Ghost Asset Crisis" subtitle="15-30% of enterprise fixed assets are invisible, costing billions annually in unnecessary expenditures." />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginBottom: "3rem", alignItems: "start" }}>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: C.text, marginBottom: "1.25rem" }}>
                Industry Impact
              </h3>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.silver, lineHeight: 1.8, fontSize: "0.95rem" }}>
                <p style={{ marginBottom: "1rem" }}>
                  Ghost assets represent a pervasive financial drain across enterprise organizations, driven by:
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {["Inadequate physical inventory controls", "Manual, infrequent asset reconciliation", "Siloed asset management systems", "Lack of governance accountability", "Organizational complexity and M&A integration"].map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
                      <span style={{ color: C.gold, fontSize: "0.7rem" }}>●</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{ background: "rgba(26, 34, 48, 0.8)", borderRadius: 8, padding: "1.5rem", border: `1px solid ${C.border}`, backdropFilter: "blur(4px)" }}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={marketData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} ${value}%`} outerRadius={90} fill="#8884d8" dataKey="value">
                    {marketData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} contentStyle={{ background: C.navy, border: `1px solid ${C.borderLight}`, color: C.text }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ghost Asset Impact */}
          <div style={{ background: "rgba(26, 34, 48, 0.8)", borderRadius: 8, border: `1px solid ${C.border}`, padding: "2rem", marginBottom: "2.5rem", backdropFilter: "blur(4px)" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: C.text, marginBottom: "1.5rem" }}>
              Financial Impact of Ghost Assets
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ghostAssetImpactData}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="category" tick={{ fill: C.textMuted, fontFamily: "'Source Sans 3', sans-serif", fontSize: 11 }} />
                <YAxis tick={{ fill: C.textMuted, fontFamily: "'Source Sans 3', sans-serif", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip suffix="%" />} />
                <Bar dataKey="savings" fill={C.gold} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Market Growth */}
          <div style={{ background: "rgba(26, 34, 48, 0.8)", borderRadius: 8, border: `1px solid ${C.border}`, padding: "2rem", backdropFilter: "blur(4px)" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: C.text, marginBottom: "1.5rem" }}>
              Fixed Asset Management Market Growth
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={marketGrowthData}>
                <defs>
                  <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.gold} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={C.gold} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="year" tick={{ fill: C.textMuted, fontFamily: "'Source Sans 3', sans-serif", fontSize: 11 }} />
                <YAxis tick={{ fill: C.textMuted, fontFamily: "'Source Sans 3', sans-serif", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip prefix="$" suffix="B" />} />
                <Area type="monotone" dataKey="size" stroke={C.gold} fillOpacity={1} fill="url(#colorSize)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* SECTION 3: SERVICES & METHODOLOGY */}
        <Section id="services">
          <SectionHeader label="Methodology" title="The LAI Four-Phase Framework" subtitle="A systematic, technology-backed approach to permanent ghost asset elimination and ongoing governance." />

          <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.silver, lineHeight: 1.8, fontSize: "0.97rem", marginBottom: "2.5rem", maxWidth: 900 }}>
            Legacy Asset Intelligence employs a proprietary four-phase methodology that distinguishes us from competitors who offer only point-in-time audits. Each phase builds on the previous, creating compounding value for clients who engage us for long-term asset management excellence.
          </p>

          {/* Phase Cards — Dark, no white */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "3rem" }}>
            {[
              {
                phase: "01", title: "Discovery & Executive Assessment", accent: C.silver,
                description: "Executive assessment, asset accountability maturity review, opportunity modeling, and a practical roadmap.",
                items: ["Executive stakeholder interviews", "Asset management process review", "Fixed Asset Register analysis", "Ghost asset risk assessment", "Capital recovery modeling", "Governance maturity evaluation"],
                deliverable: "Discovery Report + Recovery Roadmap"
              },
              {
                phase: "02", title: "Physical Asset Accountability", accent: C.gold,
                description: "Physical verification, reconciliation, exception analysis, and capital recovery opportunity reporting.",
                items: ["Wall-to-wall physical inventory", "Asset tagging (RFID/barcode/QR)", "Condition assessment", "Floor-to-book reconciliation", "Ghost asset identification", "FAR cleansing and validation"],
                deliverable: "Complete Asset Inventory + Reconciled FAR"
              },
              {
                phase: "03", title: "Technology Platform Integration", accent: C.teal,
                description: "Governance design, technology enablement, training, implementation support, and operating controls.",
                items: ["Platform selection & configuration", "Data migration & integration", "Custom dashboard setup", "Automated workflow design", "ERP/accounting integration", "Staff training & change mgmt"],
                deliverable: "Live Asset Tracking Platform"
              },
              {
                phase: "04", title: "Recurring Governance & Audits", accent: C.emerald,
                description: "Recurring audits, executive reporting, scorecards, maturity updates, and ongoing accountability.",
                items: ["Quarterly rolling audit program", "Continuous asset reconciliation", "Offboarding/acquisition workflows", "Annual compliance reporting", "Executive KPI dashboards", "Governance policy refinement"],
                deliverable: "Ongoing Governance Retainer"
              },
            ].map(service => (
              <div key={service.phase} style={{ 
                background: "rgba(26, 34, 48, 0.8)", 
                backdropFilter: "blur(4px)",
                borderRadius: 8, 
                border: `1px solid ${C.border}`,
                overflow: "hidden",
                transition: "border-color 0.3s ease",
                display: "flex", 
                flexDirection: "column" 
              }}>
                {/* Phase header */}
                <div style={{ padding: "1.25rem 1.25rem 1rem", borderBottom: `1px solid ${C.border}` }}>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: service.accent, marginBottom: "0.5rem" }}>
                    Phase {service.phase}
                  </p>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", color: C.text, fontSize: "0.95rem", fontWeight: 700, lineHeight: 1.3 }}>
                    {service.title}
                  </h3>
                </div>
                {/* Phase body */}
                <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: C.textMuted, lineHeight: 1.5, marginBottom: "1rem" }}>
                    {service.description}
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: "1rem", flex: 1 }}>
                    {service.items.map(item => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.4rem", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.73rem", color: C.silver, lineHeight: 1.4 }}>
                        <span style={{ color: service.accent, flexShrink: 0, marginTop: "0.15rem", fontSize: "0.5rem" }}>●</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div style={{ background: C.goldMuted, borderRadius: 4, padding: "0.6rem 0.75rem", marginTop: "auto" }}>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.6rem", fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.15rem" }}>
                      Deliverable
                    </p>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.73rem", color: C.text, margin: 0 }}>
                      {service.deliverable}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Video Section */}
          <div style={{ padding: "2rem", background: C.goldMuted, borderRadius: 8, border: `1px solid rgba(201,168,76,0.2)`, marginBottom: "2.5rem", textAlign: "center" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: C.text, marginBottom: "1rem", fontSize: "0.95rem" }}>
              Learn About Our Discovery & Assessment Process
            </p>
            <VideoModal
              phaseNumber={1}
              phaseName="Discovery & Executive Assessments"
              description="Understand how we conduct executive assessments and opportunity modeling to create your recovery roadmap."
              videoUrl="https://youtu.be/1rpOJFl52nQ"
              isYouTube={true}
            />
          </div>

          {/* Additional Video Placeholders */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2.5rem" }}>
            <div style={{ padding: "1.5rem", background: "rgba(26, 34, 48, 0.8)", borderRadius: 8, border: `1px solid ${C.border}`, textAlign: "center", backdropFilter: "blur(4px)" }}>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 500, color: C.silver, marginBottom: "0.75rem", fontSize: "0.85rem" }}>
                Physical Asset Accountability
              </p>
              <VideoModal
                phaseNumber={2}
                phaseName="Physical Asset Accountability"
                description="Discover our wall-to-wall inventory process and floor-to-book reconciliation approach."
              />
            </div>
            <div style={{ padding: "1.5rem", background: "rgba(26, 34, 48, 0.8)", borderRadius: 8, border: `1px solid ${C.border}`, textAlign: "center", backdropFilter: "blur(4px)" }}>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 500, color: C.silver, marginBottom: "0.75rem", fontSize: "0.85rem" }}>
                Technology Platform Integration
              </p>
              <VideoModal
                phaseNumber={3}
                phaseName="Technology Platform Integration"
                description="Learn how we select, configure, and integrate asset management platforms."
              />
            </div>
          </div>
        </Section>

        {/* SECTION 4: COMPETITIVE LANDSCAPE */}
        <Section id="competitive">
          <SectionHeader label="Competitive Position" title="How LAI Stands Apart" subtitle="Comprehensive capabilities across breadth, specialization, technology, and governance." />

          <div style={{ background: "rgba(26, 34, 48, 0.8)", borderRadius: 8, border: `1px solid ${C.border}`, padding: "2rem", marginBottom: "2.5rem", backdropFilter: "blur(4px)" }}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={competitorData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis type="number" tick={{ fill: C.textMuted, fontFamily: "'Source Sans 3', sans-serif", fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: C.silver, fontFamily: "'Source Sans 3', sans-serif", fontSize: 12 }} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="breadth" fill={C.silver} name="Service Breadth" />
                <Bar dataKey="specialization" fill={C.gold} name="Specialization" />
                <Bar dataKey="techPlatform" fill={C.teal} name="Tech Platform" />
                <Bar dataKey="governance" fill={C.tealLight} name="Governance" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem" }}>
            {[
              { name: "Kroll", desc: "Broad service offerings but lower specialization in ghost asset recovery. Limited technology platform integration.", highlight: false },
              { name: "Verasset", desc: "Highly specialized but lacks breadth and governance framework. Point-in-time audit focus.", highlight: false },
              { name: "TagMyAssets", desc: "Software-only approach. Limited consulting services or governance design capabilities.", highlight: false },
              { name: "LAI (Us)", desc: "Balanced across all dimensions: consulting breadth, ghost asset specialization, technology enablement, and governance frameworks.", highlight: true },
            ].map(comp => (
              <div key={comp.name} style={{ 
                background: "rgba(26, 34, 48, 0.8)", 
                backdropFilter: "blur(4px)",
                borderRadius: 8, 
                border: comp.highlight ? `1px solid ${C.gold}` : `1px solid ${C.border}`, 
                padding: "1.5rem" 
              }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: comp.highlight ? C.gold : C.text, marginBottom: "0.75rem" }}>
                  {comp.name}
                </h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.85rem", lineHeight: 1.6 }}>
                  {comp.desc}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* SECTION 5: CASE STUDIES */}
        <Section id="case-studies">
          <SectionHeader label="Client Results" title="Real-World Recovery Examples" subtitle="See how organizations across industries have recovered significant capital through our methodology." />
          <CaseStudies />
        </Section>

        {/* SECTION 6: ROI CALCULATOR */}
        <Section id="calculator">
          <SectionHeader label="Capital Recovery" title="Recoverable Capital Calculator" subtitle="Estimate your organization's ghost asset recovery potential in minutes." />
          <ROICalculator />
        </Section>

      </main>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}
