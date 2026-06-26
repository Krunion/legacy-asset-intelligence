/**
 * Legacy Asset Intelligence — Business Plan
 * Design: Corporate Clarity
 * Colors: Deep Charcoal (#0F1419), Deep Emerald (#1B4D3E), Gold (#D4AF37)
 * Fonts: Playfair Display (headings), Source Sans 3 (body), JetBrains Mono (numbers)
 * Layout: Sticky left-rail nav + main content with full-width data sections
 */

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import ROICalculator from "@/components/ROICalculator";
import CaseStudies from "@/components/CaseStudies";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import VideoModal from "@/components/VideoModal";

// ─── Asset URLs ───────────────────────────────────────────────────────────────
const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663776896878/TfZTrDNPnnG2dF7hgZeTPt/lai-hero-2oLJZvt3jJ23DVAW3Npj4G.webp";
const AUDIT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663776896878/TfZTrDNPnnG2dF7hgZeTPt/lai-audit-eD6BPKVD5ibTfjcC5zXw6B.webp";
const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663776896878/TfZTrDNPnnG2dF7hgZeTPt/lai-logo-5QXNLUsEDRp3nBVBAMiXK4.webp";

// ─── Brand Colors - Premium Enterprise with Gold & Silver Accents ─────────────────────────────────────────
const C = {
  charcoal: "#0F1419",
  navy: "#1A2332",
  emerald: "#1B4D3E",
  gold: "#D4AF37",
  goldLight: "#E8C547",
  platinum: "#E8E9EB",
  platinumDark: "#D1D5DB",
  slate: "#2C3E50",
  slateLight: "#3D5A73",
  teal: "#0D9488",
  tealLight: "#14B8A6",
  tealPale: "#CCFBF1",
  amber: "#D4AF37",
  amberPale: "#FEF3C7",
  bg: "#FAFBFC",
  text: "#FFFFFF",
  textLight: "#E8E9EB",
  muted: "#B0B5BD",
  border: "#E5E7EB",
  cardBg: "#FFFFFF",
};

// ─── Chart Data ───────────────────────────────────────────────────────────────


const marketData = [
  { name: "Manufacturing", value: 28, color: C.slate },
  { name: "Healthcare", value: 24, color: C.teal },
  { name: "IT / Data Centers", value: 22, color: C.amber },
  { name: "Government / Education", value: 16, color: C.slateLight },
  { name: "Other Industries", value: 10, color: C.tealLight },
];

const ghostAssetImpactData = [
  { category: "Property Tax Overpayment", savings: 35 },
  { category: "Insurance Premium Reduction", savings: 25 },
  { category: "Maintenance Contract Elimination", savings: 20 },
  { category: "Duplicate Purchase Prevention", savings: 12 },
  { category: "Audit & Compliance Savings", savings: 8 },
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
  { id: "services", label: "Services & Methodology" },
  { id: "competitive", label: "Competitive Landscape" },
  { id: "case-studies", label: "Case Studies" },
  { id: "calculator", label: "Recoverable Capital Calculator" },
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
function Section({ id, children, className = "" }: {
  id: string; children: React.ReactNode; className?: string;
}) {
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
      className={`transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
      style={{ scrollMarginTop: "2rem" }}
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
    <div className="section-header mb-8">
      <p style={{ color: C.gold, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
        {label}
      </p>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2, textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ color: "#B0B5BD", marginTop: "0.5rem", fontSize: "1rem", fontFamily: "'Source Sans 3', sans-serif", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({ value, label, sub, prefix = "", suffix = "", accent = C.teal }: {
  value: number; label: string; sub: string; prefix?: string; suffix?: string; accent?: string;
}) {
  return (
    <div className="metric-card">
      <div className="stat-number" style={{ color: accent }}>
        <AnimatedCounter end={value} prefix={prefix} suffix={suffix} />
      </div>
      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: C.slate, marginTop: "0.5rem", fontSize: "0.95rem" }}>
        {label}
      </p>
      <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.muted, fontSize: "0.8rem", marginTop: "0.25rem" }}>
        {sub}
      </p>
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, prefix = "", suffix = "" }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 16px rgba(30,58,95,0.12)" }}>
      <p style={{ fontWeight: 600, color: C.slate, marginBottom: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem" }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", margin: 0 }}>
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

  // Scroll spy
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
    <div style={{ background: `linear-gradient(135deg, rgba(15,20,25,0.85) 0%, rgba(27,77,62,0.85) 100%), url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", minHeight: "100vh" }}>

      {/* ── TOP NAV BAR ── */}
      <header style={{ background: C.charcoal, position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(15,20,25,0.4)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }} className="header-container">
            <div></div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* Mobile nav toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              style={{ 
                display: "none", 
                background: "transparent", 
                border: "none", 
                color: "white", 
                padding: "0.5rem",
                fontSize: "1.5rem",
                cursor: "pointer"
              }}
              className="mobile-nav-toggle"
              aria-label="Toggle navigation"
            >
              {mobileNavOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 0 }}>

        {/* ── LEFT SIDEBAR NAV (Desktop) / Mobile Nav (Mobile) ── */}
        <aside style={{
          width: 240, flexShrink: 0, position: "sticky", top: 64, height: "calc(100vh - 64px)",
          background: C.charcoal, overflowY: "auto", padding: "1.5rem 0",
          display: "block"
        }} className={`sidebar-nav ${mobileNavOpen ? 'mobile-open' : ''}`}>
          <div style={{ padding: "0 1rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "0.5rem" }}>
            <p style={{ color: C.gold, fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600 }}>
              Contents
            </p>
          </div>
          {NAV_SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "0.65rem 1.25rem",
                background: activeSection === s.id ? "rgba(212,175,55,0.15)" : "transparent",
                borderTop: "none",
                borderRight: "none",
                borderBottom: "none",
                borderLeft: activeSection === s.id ? `3px solid ${C.gold}` : "3px solid transparent",
                color: activeSection === s.id ? C.gold : "rgba(255,255,255,0.65)",
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.82rem", fontWeight: activeSection === s.id ? 600 : 400,
                cursor: "pointer", transition: "all 0.2s",
              }}
            >
              {s.label}
            </button>
          ))}
          <div style={{ margin: "1.5rem 1rem 0", padding: "1rem", background: "rgba(212,175,55,0.1)", borderRadius: 8, border: `1px solid ${C.gold}` }}>
            <p style={{ color: C.tealLight, fontSize: "0.7rem", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, marginBottom: "0.3rem" }}>
              MARKET SIZE
            </p>
            <p style={{ color: "white", fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 500 }}>$264.7B</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.65rem", fontFamily: "'Source Sans 3', sans-serif", marginTop: "0.2rem" }}>Fixed Asset Mgmt (2023)</p>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex: 1, padding: "2rem", minWidth: 0 }} className="main-content">

          {/* SECTION 1: HERO */}
          <Section id="executive-summary">
            <div style={{ marginBottom: "3rem" }}>
              <div style={{ background: `linear-gradient(135deg, rgba(15,20,25,0.5) 0%, rgba(27,77,62,0.5) 100%), url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", borderRadius: 12, padding: "clamp(2rem, 5vw, 6rem) clamp(1.5rem, 4vw, 4rem)", color: "white", textAlign: "center", minHeight: "clamp(300px, 50vh, 500px)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 6vw, 3.5rem)", fontWeight: 700, lineHeight: 1.2, marginBottom: "1rem" }}>
                  Recover Millions in Hidden Capital.
                </h1>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "clamp(0.95rem, 2.5vw, 1.2rem)", maxWidth: 700, lineHeight: 1.6, opacity: 0.95 }}>
                  Legacy Asset Intelligence helps healthcare systems, manufacturers, utilities, and government organizations recover lost capital, establish complete asset accountability, and implement governance programs that protect investments for years to come.
                </p>
              </div>
            </div>

            {/* Key Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "3rem" }}>
              <MetricCard value={15} label="Ghost Asset Loss" sub="of typical portfolio" suffix="%" accent={C.amber} />
              <MetricCard value={264} label="Market Opportunity" sub="Fixed Asset Mgmt" suffix="B" prefix="$" accent={C.teal} />
              <MetricCard value={25} label="IT Budget Waste" sub="from ghost assets" suffix="%" accent={C.slate} />
              <MetricCard value={28} label="CAGR Growth" sub="through 2030" suffix="%" accent={C.tealLight} />
            </div>

            {/* Executive Summary Text */}
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#FFFFFF", lineHeight: 1.8, fontSize: "0.97rem" }}>
              <p style={{ marginBottom: "1rem" }}>
                <strong>Legacy Asset Intelligence</strong> is a specialized consulting firm built to solve one of the most overlooked financial problems in enterprise operations: <strong>ghost assets</strong>. These are items that appear on a company's Fixed Asset Register (FAR) but are physically missing, fully depreciated, or otherwise non-existent in reality. Industry research consistently shows that <strong>15% to 30%</strong> of a typical organization's fixed assets are ghosts, silently consuming up to <strong>25% of IT and operational budgets</strong> through unnecessary maintenance contracts, inflated insurance premiums, and overpaid property taxes.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                Our firm addresses this problem through a proprietary four-phase methodology: executive assessment and opportunity modeling, physical asset accountability and verification, technology platform integration and governance design, and optional recurring governance services. This end-to-end approach differentiates Legacy Asset Intelligence from competitors who offer only one-time audits without the technology infrastructure or ongoing accountability to sustain results.
              </p>
              <p>
                The global fixed asset management market was valued at <strong>$264.68 billion in 2023</strong> and is projected to grow at a <strong>28.3% CAGR through 2030</strong>, reaching over <strong>$1.5 trillion</strong>. This growth is driven by increasing regulatory scrutiny, digital transformation initiatives, and the growing complexity of enterprise asset portfolios. Legacy Asset Intelligence is positioned to capture a meaningful share of this expanding market by serving mid-market and enterprise clients who need more than audits—they need accountability systems that work.
              </p>
            </div>
          </Section>

          {/* SECTION 2: MARKET ANALYSIS */}
          <Section id="market-analysis">
            <SectionHeader label="02 · MARKET ANALYSIS" title="The Ghost Asset Crisis" subtitle="15-30% of enterprise fixed assets are invisible, costing billions annually." />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1rem" }}>
                  Industry Impact
                </h3>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#FFFFFF", lineHeight: 1.8, fontSize: "0.95rem" }}>
                  <p style={{ marginBottom: "1rem" }}>
                    Ghost assets represent a pervasive, yet largely unaddressed, financial drain across enterprise organizations. The phenomenon is driven by:
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: "1rem" }}>
                    <li style={{ marginBottom: "0.5rem" }}><span style={{ color: C.teal, fontWeight: 700 }}>✓</span> Inadequate physical inventory controls</li>
                    <li style={{ marginBottom: "0.5rem" }}><span style={{ color: C.teal, fontWeight: 700 }}>✓</span> Manual, infrequent asset reconciliation</li>
                    <li style={{ marginBottom: "0.5rem" }}><span style={{ color: C.teal, fontWeight: 700 }}>✓</span> Siloed asset management systems</li>
                    <li style={{ marginBottom: "0.5rem" }}><span style={{ color: C.teal, fontWeight: 700 }}>✓</span> Lack of governance accountability</li>
                    <li style={{ marginBottom: "0.5rem" }}><span style={{ color: C.teal, fontWeight: 700 }}>✓</span> Organizational complexity and M&A integration</li>
                  </ul>
                </div>
              </div>
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={marketData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} ${value}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                      {marketData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ghost Asset Impact */}
            <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 12, border: `1px solid ${C.border}`, padding: "2rem", marginBottom: "2rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#0F1419", marginBottom: "1.5rem" }}>
                Financial Impact of Ghost Assets
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ghostAssetImpactData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="category" tick={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12 }} />
                  <YAxis tick={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip suffix="%" />} />
                  <Bar dataKey="savings" fill={C.teal} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Market Growth */}
            <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 12, border: `1px solid ${C.border}`, padding: "2rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#0F1419", marginBottom: "1.5rem" }}>
                Fixed Asset Management Market Growth
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={marketGrowthData}>
                  <defs>
                    <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.teal} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={C.teal} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="year" tick={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12 }} />
                  <YAxis tick={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip prefix="$" suffix="B" />} />
                  <Area type="monotone" dataKey="size" stroke={C.teal} fillOpacity={1} fill="url(#colorSize)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Section>

          {/* SECTION 3: SERVICES & METHODOLOGY */}
          <Section id="services">
            <SectionHeader label="03 · Services & Methodology" title="The LAI Four-Phase Framework" subtitle="A systematic, technology-backed approach to permanent ghost asset elimination and ongoing governance." />

            <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#FFFFFF", lineHeight: 1.8, fontSize: "0.97rem", marginBottom: "2rem" }}>
              <p>
                Legacy Asset Intelligence employs a proprietary four-phase methodology that distinguishes us from competitors who offer only point-in-time audits. Our approach begins with discovery and executive assessment, moves through physical asset accountability, implements technology platforms, and concludes with optional recurring governance services. Each phase builds on the previous, creating a compounding value proposition for clients who engage us for long-term asset management excellence.
              </p>
            </div>

            {/* Service Cards - 4 Phases */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem", marginBottom: "2rem" }}>
              {[
                {
                  phase: "Phase 01",
                  icon: "🔍",
                  title: "Discovery & Executive Assessments",
                  color: C.charcoal,
                  lightColor: "rgba(15,20,25,0.1)",
                  description: "Executive assessment, asset accountability maturity review, opportunity modeling, risk findings, and a practical roadmap for next-step engagement.",
                  items: [
                    "Executive stakeholder interviews",
                    "Current asset management process review",
                    "Fixed Asset Register (FAR) analysis",
                    "Ghost asset risk assessment",
                    "Capital recovery opportunity modeling",
                    "Governance maturity evaluation",
                  ],
                  deliverable: "Discovery Report + Recovery Roadmap"
                },
                {
                  phase: "Phase 02",
                  icon: "🏷️",
                  title: "Physical Asset Accountability",
                  color: C.emerald,
                  lightColor: "rgba(27,77,62,0.1)",
                  description: "Discovery, physical verification, reconciliation, exception analysis, and capital recovery opportunity reporting.",
                  items: [
                    "Wall-to-wall physical inventory of all facilities",
                    "Asset tagging (RFID/barcode/QR codes)",
                    "Condition assessment and documentation",
                    "Floor-to-book reconciliation",
                    "Ghost asset identification and isolation",
                    "FAR cleansing and validation",
                  ],
                  deliverable: "Complete Asset Inventory + Reconciled FAR"
                },
                {
                  phase: "Phase 03",
                  icon: "💻",
                  title: "Technology Platform Integration",
                  color: C.gold,
                  lightColor: "rgba(212,175,55,0.1)",
                  description: "Governance design, technology enablement planning, training, implementation support, accountability structures, and operating controls.",
                  items: [
                    "Asset management platform selection",
                    "Data migration and system integration",
                    "Custom dashboard and reporting configuration",
                    "Automated workflow setup",
                    "ERP/accounting system integration",
                    "Staff training and change management",
                  ],
                  deliverable: "Live Asset Tracking Platform"
                },
                {
                  phase: "Phase 04",
                  icon: "📊",
                  title: "Recurring Governance & Audits",
                  color: C.emerald,
                  lightColor: "rgba(27,77,62,0.1)",
                  description: "Recurring audits, executive reporting, scorecards, maturity updates, and ongoing accountability assurance.",
                  items: [
                    "Quarterly rolling audit program",
                    "Continuous asset reconciliation",
                    "Offboarding and acquisition workflows",
                    "Annual compliance reporting",
                    "Executive KPI dashboards",
                    "Governance policy refinement",
                  ],
                  deliverable: "Ongoing Governance Retainer (Optional)"
                },
              ].map(service => (
                <div key={service.phase} style={{ background: "white", borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 2px 8px rgba(30,58,95,0.06)", transition: "transform 0.2s, box-shadow 0.2s", display: "flex", flexDirection: "column" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(30,58,95,0.12)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(30,58,95,0.06)"; }}
                >
                  <div style={{ background: service.color, padding: "1.25rem 1.5rem" }}>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: "0.4rem" }}>
                      {service.phase}
                    </p>
                    <div style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>{service.icon}</div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", color: "white", fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.3 }}>
                      {service.title}
                    </h3>
                  </div>
                  <div style={{ padding: "1.25rem 1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.82rem", color: "#0F1419", lineHeight: 1.5, marginBottom: "1rem" }}>
                      {service.description}
                    </p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: "1rem", flex: 1 }}>
                      {service.items.map(item => (
                        <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.5rem", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: "#0F1419", lineHeight: 1.4 }}>
                          <span style={{ color: service.color, fontWeight: 700, marginTop: "0.1rem", flexShrink: 0 }}>✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div style={{ background: service.lightColor, borderRadius: 6, padding: "0.6rem 0.75rem", marginTop: "auto" }}>
                      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 700, color: service.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.2rem" }}>
                        Deliverable
                      </p>
                      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: "#0F1419", margin: 0 }}>
                        {service.deliverable}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Video Placeholder - Between Phase 1-2 */}
            <div style={{ padding: "2rem", background: "rgba(13, 148, 136, 0.08)", borderRadius: 12, border: `2px dashed ${C.teal}`, marginBottom: "2rem", textAlign: "center" }}>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: "#FFFFFF", marginBottom: "1rem" }}>
                Learn more about the transition from Phase 1 to Phase 2
              </p>
              <VideoModal
                phaseNumber={1}
                phaseName="Discovery & Executive Assessments"
                description="Understand how we conduct executive assessments and opportunity modeling to create your recovery roadmap."
                videoUrl="https://youtu.be/1rpOJFl52nQ"
                isYouTube={true}
              />
            </div>

            {/* Video Placeholder - Between Phase 2-3 */}
            <div style={{ padding: "2rem", background: "rgba(245, 158, 11, 0.08)", borderRadius: 12, border: `2px dashed ${C.amber}`, marginBottom: "2rem", textAlign: "center" }}>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: "#FFFFFF", marginBottom: "1rem" }}>
                See how physical asset accountability leads to technology integration
              </p>
              <VideoModal
                phaseNumber={2}
                phaseName="Physical Asset Accountability"
                description="Discover our wall-to-wall inventory process, asset tagging methodology, and floor-to-book reconciliation approach."
              />
            </div>

            {/* Video Placeholder - Between Phase 3-4 */}
            <div style={{ padding: "2rem", background: "rgba(16, 185, 129, 0.08)", borderRadius: 12, border: `2px dashed #10B981`, marginBottom: "2rem", textAlign: "center" }}>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: "#FFFFFF", marginBottom: "1rem" }}>
                Implement technology platforms for ongoing governance
              </p>
              <VideoModal
                phaseNumber={3}
                phaseName="Technology Platform Integration"
                description="Learn how we select, configure, and integrate asset management platforms with your ERP systems."
              />
            </div>

            {/* Audit Image */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "center" }}>
              <div>
                <img src={AUDIT_IMG} alt="Asset audit in progress" style={{ width: "100%", borderRadius: 12, objectFit: "cover", height: 280 }} />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1rem" }}>
                  Why Four Phases Matter
                </h3>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#FFFFFF", lineHeight: 1.8, fontSize: "0.95rem" }}>
                  <p style={{ marginBottom: "1rem" }}>
                    Most consulting firms stop after Phase 2—they deliver a report and walk away. Legacy Asset Intelligence goes further. We design governance systems and implement technology platforms that prevent ghost assets from re-accumulating. The optional Phase 4 engagement ensures your organization maintains accountability indefinitely.
                  </p>
                  <p>
                    This end-to-end approach is why our clients achieve sustainable results. You're not just recovering capital today; you're building the infrastructure to protect it for years to come.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* SECTION 4: COMPETITIVE LANDSCAPE */}
          <Section id="competitive">
            <SectionHeader label="04 · COMPETITIVE LANDSCAPE" title="How LAI Stands Apart" subtitle="Comprehensive capabilities across breadth, specialization, technology, and governance." />

            <div style={{ background: "white", borderRadius: 12, border: `1px solid ${C.border}`, padding: "2rem", marginBottom: "2rem" }}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={competitorData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis type="number" tick={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontFamily: "'Source Sans 3', sans-serif" }} />
                  <Bar dataKey="breadth" fill={C.slate} name="Service Breadth" />
                  <Bar dataKey="specialization" fill={C.teal} name="Specialization" />
                  <Bar dataKey="techPlatform" fill={C.amber} name="Tech Platform" />
                  <Bar dataKey="governance" fill={C.tealLight} name="Governance" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
              <div style={{ background: "white", borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#0F1419", marginBottom: "1rem" }}>
                  Kroll
                </h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#0F1419", fontSize: "0.85rem", lineHeight: 1.6 }}>
                  Broad service offerings but lower specialization in ghost asset recovery. Limited technology platform integration.
                </p>
              </div>
              <div style={{ background: "white", borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#0F1419", marginBottom: "1rem" }}>
                  Verasset
                </h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#0F1419", fontSize: "0.85rem", lineHeight: 1.6 }}>
                  Highly specialized but lacks breadth and governance framework. Point-in-time audit focus.
                </p>
              </div>
              <div style={{ background: "white", borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#0F1419", marginBottom: "1rem" }}>
                  TagMyAssets
                </h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#0F1419", fontSize: "0.85rem", lineHeight: 1.6 }}>
                  Software-only approach. Limited consulting services or governance design capabilities.
                </p>
              </div>
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: `2px solid ${C.teal}`, padding: "1.5rem" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#0F1419", marginBottom: "1rem" }}>
                  LAI (Us)
                </h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#475569", fontSize: "0.85rem", lineHeight: 1.6 }}>
                  Balanced across all dimensions: consulting breadth, ghost asset specialization, technology enablement, and governance frameworks.
                </p>
              </div>
            </div>
          </Section>

          {/* SECTION 5: CASE STUDIES */}
          <Section id="case-studies">
            <SectionHeader label="05 · CLIENT RESULTS" title="Real-World Recovery Examples" subtitle="See how organizations across industries have recovered significant capital through LAI's methodology." />
            <div style={{ marginBottom: "2rem" }}>
              <CaseStudies />
            </div>
          </Section>

          {/* SECTION 6: ROI CALCULATOR */}
          <Section id="calculator">
            <SectionHeader label="06 · CAPITAL RECOVERY" title="Recoverable Capital Calculator" subtitle="Estimate your organization's ghost asset recovery potential in minutes." />
            <div style={{ marginBottom: "2rem" }}>
              <ROICalculator />
            </div>
          </Section>

        </main>
      </div>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}
