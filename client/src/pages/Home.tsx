/**
 * Legacy Asset Intelligence — Business Plan
 * Design: Corporate Clarity
 * Colors: Deep Slate Blue (#1E3A5F), Emerald Teal (#0D9488), Warm Amber (#F59E0B)
 * Fonts: Playfair Display (headings), Source Sans 3 (body), JetBrains Mono (numbers)
 * Layout: Sticky left-rail nav + main content with full-width data sections
 */

import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import ROICalculator from "@/components/ROICalculator";
import CaseStudies from "@/components/CaseStudies";
import { ChatbotWidget } from "@/components/ChatbotWidget";

// ─── Asset URLs ───────────────────────────────────────────────────────────────
const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663776896878/TfZTrDNPnnG2dF7hgZeTPt/lai-hero-2oLJZvt3jJ23DVAW3Npj4G.webp";
const AUDIT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663776896878/TfZTrDNPnnG2dF7hgZeTPt/lai-audit-eD6BPKVD5ibTfjcC5zXw6B.webp";
const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663776896878/TfZTrDNPnnG2dF7hgZeTPt/lai-logo-5QXNLUsEDRp3nBVBAMiXK4.webp";

// ─── Brand Colors ─────────────────────────────────────────────────────────────
const C = {
  slate: "#1E3A5F",
  teal: "#0D9488",
  amber: "#F59E0B",
  slateLight: "#2D5282",
  tealLight: "#14B8A6",
  tealPale: "#CCFBF1",
  amberPale: "#FEF3C7",
  bg: "#F8FAFC",
  text: "#1E293B",
  muted: "#64748B",
  border: "#E2E8F0",
};

// ─── Chart Data ───────────────────────────────────────────────────────────────
const revenueData = [
  { year: "Year 1", revenue: 480, expenses: 380, ebitda: 100 },
  { year: "Year 2", revenue: 920, expenses: 620, ebitda: 300 },
  { year: "Year 3", revenue: 1650, expenses: 950, ebitda: 700 },
  { year: "Year 4", revenue: 2400, expenses: 1300, ebitda: 1100 },
  { year: "Year 5", revenue: 3200, expenses: 1700, ebitda: 1500 },
];

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

const startupCostData = [
  { name: "Office & Workspace", value: 45000, color: C.slate },
  { name: "IT Hardware & Software", value: 25000, color: C.teal },
  { name: "Analytics Platform", value: 20000, color: C.amber },
  { name: "Website & Branding", value: 18000, color: C.slateLight },
  { name: "CRM & PM Setup", value: 15000, color: C.tealLight },
  { name: "Legal & Insurance", value: 10000, color: "#94A3B8" },
  { name: "Working Capital", value: 13000, color: "#CBD5E1" },
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
  { id: "financial", label: "Financial Projections" },
  { id: "startup-costs", label: "Startup Investment" },
  { id: "strategy", label: "Go-to-Market Strategy" },
  { id: "risk", label: "Risk & Mitigation" },
  { id: "case-studies", label: "Case Studies" },
  { id: "calculator", label: "ROI Calculator" },
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
      <p style={{ color: C.teal, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
        {label}
      </p>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: C.slate, lineHeight: 1.2 }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ color: C.muted, marginTop: "0.5rem", fontSize: "1rem", fontFamily: "'Source Sans 3', sans-serif" }}>
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
        <p key={i} style={{ color: p.color, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}>
          {p.name}: {prefix}{Number(p.value).toLocaleString()}{suffix}
        </p>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Home() {
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
    <div style={{ background: C.bg, minHeight: "100vh" }}>

      {/* ── TOP NAV BAR ── */}
      <header style={{ background: C.slate, position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(30,58,95,0.3)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <img src={LOGO_IMG} alt="LAI Logo" style={{ height: 40, width: 40, objectFit: "contain" }} />
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "white", fontSize: "1.05rem", lineHeight: 1.1 }}>
                Legacy Asset Intelligence
              </div>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: "rgba(255,255,255,0.6)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Business Plan 2026
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ background: C.teal, color: "white", padding: "0.3rem 0.8rem", borderRadius: 20, fontSize: "0.75rem", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600 }}>
              Confidential
            </span>
            {/* Mobile nav toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              style={{ display: "none", background: "transparent", border: "none", color: "white", padding: "0.5rem" }}
              className="mobile-nav-toggle"
              aria-label="Toggle navigation"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 0 }}>

        {/* ── LEFT SIDEBAR NAV ── */}
        <aside style={{
          width: 240, flexShrink: 0, position: "sticky", top: 64, height: "calc(100vh - 64px)",
          background: C.slate, overflowY: "auto", padding: "1.5rem 0"
        }}>
          <div style={{ padding: "0 1rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "0.5rem" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600 }}>
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
                background: activeSection === s.id ? "rgba(13,148,136,0.2)" : "transparent",
                borderTop: "none",
                borderRight: "none",
                borderBottom: "none",
                borderLeft: activeSection === s.id ? `3px solid ${C.teal}` : "3px solid transparent",
                color: activeSection === s.id ? "white" : "rgba(255,255,255,0.65)",
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.82rem", fontWeight: activeSection === s.id ? 600 : 400,
                cursor: "pointer", transition: "all 0.2s",
              }}
            >
              {s.label}
            </button>
          ))}
          <div style={{ margin: "1.5rem 1rem 0", padding: "1rem", background: "rgba(13,148,136,0.15)", borderRadius: 8, border: "1px solid rgba(13,148,136,0.3)" }}>
            <p style={{ color: C.tealLight, fontSize: "0.7rem", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, marginBottom: "0.3rem" }}>
              MARKET SIZE
            </p>
            <p style={{ color: "white", fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 500 }}>$264.7B</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.65rem", fontFamily: "'Source Sans 3', sans-serif", marginTop: "0.2rem" }}>
              Fixed Asset Mgmt (2023)
            </p>
            <p style={{ color: C.amber, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, marginTop: "0.4rem" }}>
              28.3% CAGR through 2030
            </p>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex: 1, minWidth: 0, padding: "2.5rem 2.5rem 4rem" }}>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 1: EXECUTIVE SUMMARY
          ═══════════════════════════════════════════════════════════════ */}
          <Section id="executive-summary">
            {/* Hero */}
            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: "2.5rem", height: 340 }}>
              <img src={HERO_IMG} alt="Legacy Asset Intelligence" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(30,58,95,0.92) 0%, rgba(30,58,95,0.6) 60%, transparent 100%)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "2.5rem 3rem" }}>
                <p style={{ color: C.tealLight, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  Confidential Business Plan · 2026
                </p>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", fontWeight: 900, color: "white", lineHeight: 1.15, maxWidth: 480, marginBottom: "1rem" }}>
                  Recover Capital.<br />Govern with Confidence.
                </h1>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "rgba(255,255,255,0.85)", fontSize: "1rem", maxWidth: 420, lineHeight: 1.6 }}>
                  15–30% of your fixed assets don't exist. Legacy Asset Intelligence finds them, tags them, and ensures they never disappear again.
                </p>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
                  {["Ghost Asset Recovery", "Inventory Tagging", "Tech Platform", "Recurring Governance"].map(tag => (
                    <span key={tag} style={{ background: "rgba(13,148,136,0.25)", border: "1px solid rgba(13,148,136,0.5)", color: C.tealLight, padding: "0.3rem 0.75rem", borderRadius: 20, fontSize: "0.75rem", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <SectionHeader label="01 · Executive Summary" title="The Ghost Asset Problem" subtitle="A pervasive, costly, and largely invisible drain on enterprise capital." />

            <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.text, lineHeight: 1.8, fontSize: "0.97rem", marginBottom: "2rem" }}>
              <p style={{ marginBottom: "1rem" }}>
                <strong>Legacy Asset Intelligence</strong> is a specialized consulting firm built to solve one of the most overlooked financial problems in enterprise operations: ghost assets. These are items that appear on a company's Fixed Asset Register (FAR) but are physically missing, fully depreciated, or otherwise non-existent in reality. Industry research consistently shows that <strong>15% to 30%</strong> of a typical organization's fixed assets are ghosts, silently consuming up to <strong>25% of IT and operational budgets</strong> through unnecessary maintenance contracts, inflated insurance premiums, and overpaid property taxes.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                Our firm addresses this problem through a proprietary three-phase methodology: a comprehensive physical inventory and tagging engagement, integration with a modern asset tracking technology platform, and a recurring governance framework that prevents ghost assets from re-accumulating. This end-to-end approach differentiates Legacy Asset Intelligence from competitors who offer only one-time audits without the technology infrastructure or ongoing accountability to sustain results.
              </p>
              <p>
                The global fixed asset management market was valued at <strong>$264.68 billion in 2023</strong> and is projected to grow at a <strong>28.3% CAGR through 2030</strong>, reaching over $1.5 trillion. This growth is driven by increasing regulatory scrutiny, digital transformation initiatives, and the growing complexity of enterprise asset portfolios. Legacy Asset Intelligence is positioned to capture a meaningful share of this expanding market by serving mid-market and enterprise clients in manufacturing, healthcare, information technology, and government sectors.
              </p>
            </div>

            {/* Key Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              <MetricCard value={30} suffix="%" label="Max Ghost Asset Rate" sub="% of fixed assets that are ghosts" accent={C.slate} />
              <MetricCard value={25} suffix="%" label="Budget Drain" sub="Of IT budget wasted on ghost assets" accent={C.teal} />
              <MetricCard value={264} prefix="$" suffix="B" label="Market Size (2023)" sub="Global fixed asset management market" accent={C.amber} />
              <MetricCard value={28} suffix="%" label="Market CAGR" sub="Projected growth rate through 2030" accent={C.slateLight} />
            </div>

            {/* Mission Box */}
            <div style={{ background: `linear-gradient(135deg, ${C.slate} 0%, ${C.slateLight} 100%)`, borderRadius: 12, padding: "2rem", color: "white" }}>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.tealLight, marginBottom: "0.5rem" }}>
                Our Mission
              </p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 600, lineHeight: 1.4, marginBottom: "1rem" }}>
                "To eliminate the financial and operational burden of ghost assets by delivering precision inventory intelligence, technology-enabled visibility, and sustainable governance frameworks."
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "1rem" }}>
                {[
                  { icon: "🔍", title: "Investigate", desc: "Wall-to-wall physical audits using RFID and barcode technology" },
                  { icon: "🏷️", title: "Tag & Track", desc: "Modern asset tagging integrated with cloud-based tracking platforms" },
                  { icon: "📊", title: "Govern", desc: "Recurring audits and governance frameworks to prevent recurrence" },
                ].map(item => (
                  <div key={item.title} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "1rem" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{item.icon}</div>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.3rem" }}>{item.title}</p>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <div style={{ height: 48 }} />

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 2: MARKET ANALYSIS
          ═══════════════════════════════════════════════════════════════ */}
          <Section id="market-analysis">
            <SectionHeader label="02 · Market Analysis" title="A $264B Market Growing at 28.3% CAGR" subtitle="The fixed asset management industry is undergoing rapid expansion driven by digital transformation and regulatory pressure." />

            <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.text, lineHeight: 1.8, fontSize: "0.97rem", marginBottom: "2rem" }}>
              <p style={{ marginBottom: "1rem" }}>
                Ghost assets accumulate in organizations for predictable reasons: informal disposals where equipment is discarded without updating the asset register, undocumented transfers between departments or facilities, and poor offboarding processes when employees leave with assigned equipment. The consequences extend far beyond inaccurate records. Organizations routinely pay property taxes on assets that no longer exist, maintain insurance coverage for equipment long since scrapped, and fund maintenance contracts for systems that have been replaced.
              </p>
              <p>
                The addressable market for Legacy Asset Intelligence spans multiple high-value verticals. Manufacturing and construction firms face the highest asset mobility challenges, with tools and heavy equipment frequently moving between job sites. Healthcare organizations contend with expensive medical devices that migrate between departments, creating both financial and compliance risks. IT-intensive businesses face rapid hardware refresh cycles that generate ghost assets at scale, while government and educational institutions operate under strict compliance mandates (GASB, SOX) that require audit-ready asset records.
              </p>
            </div>

            {/* Market Growth Chart */}
            <div style={{ background: "white", borderRadius: 12, padding: "1.5rem", border: `1px solid ${C.border}`, marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(30,58,95,0.06)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: C.slate, fontSize: "1.1rem", marginBottom: "1.25rem" }}>
                Fixed Asset Management Market Size (USD Billions)
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={marketGrowthData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="marketGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.teal} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={C.teal} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="year" tick={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, fill: C.muted }} />
                  <YAxis tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fill: C.muted }} tickFormatter={v => `$${v}B`} />
                  <Tooltip content={<CustomTooltip prefix="$" suffix="B" />} />
                  <Area type="monotone" dataKey="size" name="Market Size" stroke={C.teal} strokeWidth={2.5} fill="url(#marketGrad)" dot={{ fill: C.teal, r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: C.muted, textAlign: "center", marginTop: "0.75rem" }}>
                Source: Grand View Research · 28.3% CAGR 2024–2030
              </p>
            </div>

            {/* Industry Breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div style={{ background: "white", borderRadius: 12, padding: "1.5rem", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(30,58,95,0.06)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: C.slate, fontSize: "1.1rem", marginBottom: "1.25rem" }}>
                  Target Market by Industry
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={marketData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                      {marketData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => [`${v}%`, "Share"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {marketData.map(d => (
                    <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.78rem", color: C.text, flex: 1 }}>{d.name}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: C.muted }}>{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "white", borderRadius: 12, padding: "1.5rem", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(30,58,95,0.06)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: C.slate, fontSize: "1.1rem", marginBottom: "1.25rem" }}>
                  Client ROI Breakdown
                </h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.82rem", color: C.muted, marginBottom: "1rem", lineHeight: 1.5 }}>
                  Average capital recovery distribution across client engagements
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={ghostAssetImpactData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                    <XAxis type="number" tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fill: C.muted }} tickFormatter={v => `${v}%`} />
                    <YAxis type="category" dataKey="category" width={160} tick={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 10, fill: C.text }} />
                    <Tooltip formatter={(v: any) => [`${v}%`, "Share of Savings"]} />
                    <Bar dataKey="savings" name="Savings Share" fill={C.teal} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Section>

          <div style={{ height: 48 }} />

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 3: SERVICES & METHODOLOGY
          ═══════════════════════════════════════════════════════════════ */}
          <Section id="services">
            <SectionHeader label="03 · Services & Methodology" title="The LAI Three-Phase Framework" subtitle="A systematic, technology-backed approach to permanent ghost asset elimination." />

            <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.text, lineHeight: 1.8, fontSize: "0.97rem", marginBottom: "2rem" }}>
              <p>
                Legacy Asset Intelligence employs a proprietary three-phase methodology that distinguishes us from competitors who offer only point-in-time audits. Our approach is designed to deliver immediate capital recovery while establishing the governance infrastructure needed to prevent ghost assets from re-accumulating. Each phase builds on the previous, creating a compounding value proposition for clients who engage us for recurring governance services.
              </p>
            </div>

            {/* Service Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem", marginBottom: "2rem" }}>
              {[
                {
                  phase: "Phase 01", icon: "🔍", title: "Investigation & Inventory Tagging",
                  color: C.slate, lightColor: "#EEF2F7",
                  items: [
                    "Wall-to-wall physical audit of all facilities",
                    "RFID and barcode tagging of every asset",
                    "Floor-to-book and book-to-floor reconciliation",
                    "Ghost asset identification and documentation",
                    "Condition assessment and valuation support",
                    "Fixed Asset Register (FAR) cleansing",
                  ],
                  deliverable: "Reconciled FAR + Ghost Asset Report"
                },
                {
                  phase: "Phase 02", icon: "💻", title: "Technology Platform Integration",
                  color: C.teal, lightColor: "#F0FDFA",
                  items: [
                    "Cloud-based CMMS/ITAM platform deployment",
                    "Custom asset tracking dashboard configuration",
                    "Automated disposal and transfer workflows",
                    "ERP/accounting system integration",
                    "Real-time visibility and reporting setup",
                    "Staff training and change management",
                  ],
                  deliverable: "Live Asset Tracking Platform"
                },
                {
                  phase: "Phase 03", icon: "📊", title: "Recurring Governance & Audits",
                  color: C.amber, lightColor: "#FFFBEB",
                  items: [
                    "Quarterly rolling audit program",
                    "Offboarding checklist integration",
                    "Continuous FAR reconciliation",
                    "Annual compliance reporting (SOX, GASB)",
                    "KPI dashboards and executive reporting",
                    "Governance policy development",
                  ],
                  deliverable: "Ongoing Governance Retainer"
                },
              ].map(service => (
                <div key={service.phase} style={{ background: "white", borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 2px 8px rgba(30,58,95,0.06)", transition: "transform 0.2s, box-shadow 0.2s" }}
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
                  <div style={{ padding: "1.25rem 1.5rem" }}>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {service.items.map(item => (
                        <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.5rem", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.82rem", color: C.text, lineHeight: 1.4 }}>
                          <span style={{ color: service.color, fontWeight: 700, marginTop: "0.1rem", flexShrink: 0 }}>✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div style={{ marginTop: "1rem", background: service.lightColor, borderRadius: 6, padding: "0.6rem 0.75rem" }}>
                      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.72rem", fontWeight: 700, color: service.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Deliverable
                      </p>
                      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.82rem", color: C.text, marginTop: "0.2rem" }}>
                        {service.deliverable}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Audit Image */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "center" }}>
              <div>
                <img src={AUDIT_IMG} alt="Asset audit in progress" style={{ width: "100%", borderRadius: 12, objectFit: "cover", height: 280 }} />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: C.slate, fontSize: "1.3rem", marginBottom: "1rem" }}>
                  Technology-Backed Field Operations
                </h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.text, lineHeight: 1.8, fontSize: "0.95rem", marginBottom: "1rem" }}>
                  Our field consultants combine deep asset management expertise with enterprise-grade technology. Each engagement deploys RFID scanners, barcode printers, and tablet-based data capture tools that sync in real-time to our cloud platform.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[
                    { label: "Assets Tagged Per Day", value: "500–2,000", icon: "🏷️" },
                    { label: "Reconciliation Accuracy", value: "99.2%", icon: "✅" },
                    { label: "Avg. Ghost Asset Discovery Rate", value: "18–24%", icon: "👻" },
                    { label: "Avg. Client ROI (Year 1)", value: "3.2×", icon: "💰" },
                  ].map(stat => (
                    <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "white", borderRadius: 8, padding: "0.75rem 1rem", border: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: "1.1rem" }}>{stat.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.78rem", color: C.muted }}>{stat.label}</p>
                      </div>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, color: C.teal, fontSize: "0.95rem" }}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <div style={{ height: 48 }} />

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 4: COMPETITIVE LANDSCAPE
          ═══════════════════════════════════════════════════════════════ */}
          <Section id="competitive">
            <SectionHeader label="04 · Competitive Landscape" title="Differentiated by End-to-End Delivery" subtitle="Competitors offer fragments. LAI delivers the complete solution." />

            <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.text, lineHeight: 1.8, fontSize: "0.97rem", marginBottom: "2rem" }}>
              <p style={{ marginBottom: "1rem" }}>
                The fixed asset management consulting market is fragmented between large generalist advisory firms and small specialized boutiques. <strong>Kroll</strong> offers comprehensive valuation and fixed asset advisory services but is primarily positioned for large-cap enterprises and does not provide a proprietary technology platform. <strong>Verasset</strong> and <strong>TagMyAssets</strong> specialize in physical inventory and tagging services but lack the recurring governance and technology integration capabilities that drive long-term client retention.
              </p>
              <p>
                Legacy Asset Intelligence occupies a distinct position: the only firm that combines best-in-class physical inventory execution with a modern SaaS platform and a structured governance retainer model. This combination creates a durable competitive moat through data network effects — the longer a client uses our platform, the more valuable their asset intelligence becomes.
              </p>
            </div>

            {/* Competitor Comparison Table */}
            <div style={{ background: "white", borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(30,58,95,0.06)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.slate }}>
                    <th style={{ padding: "0.9rem 1.25rem", textAlign: "left", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "rgba(255,255,255,0.8)", letterSpacing: "0.05em" }}>Firm</th>
                    {["Physical Audit", "Asset Tagging", "Tech Platform", "Recurring Governance", "Mid-Market Focus", "Value-Based Pricing"].map(h => (
                      <th key={h} style={{ padding: "0.9rem 0.75rem", textAlign: "center", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "0.75rem", color: "rgba(255,255,255,0.8)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Kroll", isUs: false, vals: [true, true, false, true, false, false] },
                    { name: "Verasset", isUs: false, vals: [true, true, true, false, true, false] },
                    { name: "TagMyAssets", isUs: false, vals: [true, true, false, false, true, false] },
                    { name: "Forvis Mazars", isUs: false, vals: [false, false, false, true, false, false] },
                    { name: "Legacy Asset Intelligence", isUs: true, vals: [true, true, true, true, true, true] },
                  ].map((row, i) => (
                    <tr key={row.name} style={{ background: row.isUs ? `${C.teal}15` : i % 2 === 0 ? "white" : "#F8FAFC", borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "0.85rem 1.25rem", fontFamily: "'Source Sans 3', sans-serif", fontWeight: row.isUs ? 700 : 500, fontSize: "0.88rem", color: row.isUs ? C.teal : C.text }}>
                        {row.isUs ? "★ " : ""}{row.name}
                      </td>
                      {row.vals.map((v, j) => (
                        <td key={j} style={{ padding: "0.85rem 0.75rem", textAlign: "center", fontSize: "1rem" }}>
                          {v ? <span style={{ color: C.teal }}>✓</span> : <span style={{ color: "#CBD5E1" }}>–</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Competitive Positioning Chart */}
            <div style={{ background: "white", borderRadius: 12, padding: "1.5rem", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(30,58,95,0.06)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: C.slate, fontSize: "1.1rem", marginBottom: "1.25rem" }}>
                Competitive Capability Comparison (Score out of 100)
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={competitorData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="name" tick={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, fill: C.text }} />
                  <YAxis tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fill: C.muted }} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.78rem" }} />
                  <Bar dataKey="specialization" name="Specialization" fill={C.slate} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="techPlatform" name="Tech Platform" fill={C.teal} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="governance" name="Governance" fill={C.amber} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <div style={{ height: 48 }} />

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 5: FINANCIAL PROJECTIONS
          ═══════════════════════════════════════════════════════════════ */}
          <Section id="financial">
            <SectionHeader label="05 · Financial Projections" title="5-Year Revenue & Profitability Forecast" subtitle="Conservative base-case projections with a clear path to profitability by Month 7." />

            <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.text, lineHeight: 1.8, fontSize: "0.97rem", marginBottom: "2rem" }}>
              <p style={{ marginBottom: "1rem" }}>
                Legacy Asset Intelligence employs a hybrid revenue model combining project-based fees for initial engagements with recurring retainer revenue from ongoing governance services. This structure provides predictable cash flow while enabling significant revenue growth as the client base expands. Year 1 focuses on client acquisition and establishing operational processes, with profitability achieved by Month 7 as recurring revenue begins to offset fixed costs.
              </p>
              <p>
                Revenue projections are based on a conservative client acquisition model: 8–10 project clients in Year 1 growing to 35–40 by Year 3, with 60% converting to recurring governance retainers. Average project fees range from $45,000 to $120,000 depending on asset volume and facility complexity, while annual governance retainers average $28,000 per client.
              </p>
            </div>

            {/* Revenue Chart */}
            <div style={{ background: "white", borderRadius: 12, padding: "1.5rem", border: `1px solid ${C.border}`, marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(30,58,95,0.06)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: C.slate, fontSize: "1.1rem", marginBottom: "1.25rem" }}>
                Revenue, Expenses & EBITDA (USD Thousands)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.slate} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={C.slate} stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.muted} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={C.muted} stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="ebitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.teal} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={C.teal} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="year" tick={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, fill: C.muted }} />
                  <YAxis tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fill: C.muted }} tickFormatter={v => `$${v}K`} />
                  <Tooltip content={<CustomTooltip prefix="$" suffix="K" />} />
                  <Legend wrapperStyle={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.78rem" }} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke={C.slate} strokeWidth={2.5} fill="url(#revGrad)" />
                  <Area type="monotone" dataKey="expenses" name="Expenses" stroke={C.muted} strokeWidth={2} fill="url(#expGrad)" strokeDasharray="5 3" />
                  <Area type="monotone" dataKey="ebitda" name="EBITDA" stroke={C.teal} strokeWidth={2.5} fill="url(#ebitGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Financial Summary Table */}
            <div style={{ background: "white", borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(30,58,95,0.06)" }}>
              <div style={{ background: C.slate, padding: "0.9rem 1.25rem" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: "white", fontSize: "1rem" }}>5-Year Financial Summary (USD Thousands)</h3>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: `2px solid ${C.border}` }}>
                    {["Metric", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"].map(h => (
                      <th key={h} style={{ padding: "0.75rem 1rem", textAlign: h === "Metric" ? "left" : "right", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "0.8rem", color: C.muted, letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Revenue", vals: ["$480K", "$920K", "$1,650K", "$2,400K", "$3,200K"], highlight: false },
                    { label: "Total Expenses", vals: ["$380K", "$620K", "$950K", "$1,300K", "$1,700K"], highlight: false },
                    { label: "EBITDA", vals: ["$100K", "$300K", "$700K", "$1,100K", "$1,500K"], highlight: true },
                    { label: "EBITDA Margin", vals: ["20.8%", "32.6%", "42.4%", "45.8%", "46.9%"], highlight: false },
                    { label: "Project Clients", vals: ["8–10", "18–22", "30–35", "42–48", "55–65"], highlight: false },
                    { label: "Governance Retainers", vals: ["3–4", "10–12", "20–24", "30–35", "40–48"], highlight: false },
                  ].map((row, i) => (
                    <tr key={row.label} style={{ background: row.highlight ? `${C.teal}10` : i % 2 === 0 ? "white" : "#F8FAFC", borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "0.8rem 1rem", fontFamily: "'Source Sans 3', sans-serif", fontWeight: row.highlight ? 700 : 500, fontSize: "0.88rem", color: row.highlight ? C.teal : C.text }}>
                        {row.label}
                      </td>
                      {row.vals.map((v, j) => (
                        <td key={j} style={{ padding: "0.8rem 1rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: row.highlight ? C.teal : C.text, fontWeight: row.highlight ? 600 : 400 }}>
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Revenue Model Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
              {[
                { title: "Project-Based Fees", icon: "📋", range: "$45K – $120K", desc: "Per engagement, scaled by asset volume and facility count. Includes physical audit, tagging, and FAR reconciliation.", color: C.slate },
                { title: "Governance Retainer", icon: "🔄", range: "$24K – $36K/yr", desc: "Annual recurring revenue for ongoing audits, compliance reporting, and platform management.", color: C.teal },
                { title: "Value-Based Pricing", icon: "💎", range: "5–10% of Recovery", desc: "Optional performance-based component tied to documented capital recovery from ghost asset elimination.", color: C.amber },
              ].map(model => (
                <div key={model.title} style={{ background: "white", borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.25rem", borderTop: `3px solid ${model.color}`, boxShadow: "0 2px 8px rgba(30,58,95,0.06)" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{model.icon}</div>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", color: C.slate, fontSize: "0.95rem", marginBottom: "0.4rem" }}>{model.title}</h4>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", color: model.color, fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.5rem" }}>{model.range}</p>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.muted, fontSize: "0.8rem", lineHeight: 1.5 }}>{model.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <div style={{ height: 48 }} />

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 6: STARTUP INVESTMENT
          ═══════════════════════════════════════════════════════════════ */}
          <Section id="startup-costs">
            <SectionHeader label="06 · Startup Investment" title="Initial Capital Requirements" subtitle="A lean, focused investment to launch a high-margin consulting practice." />

            <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.text, lineHeight: 1.8, fontSize: "0.97rem", marginBottom: "2rem" }}>
              <p>
                Starting Legacy Asset Intelligence requires an estimated initial capital investment of <strong>$146,000</strong> for an office-based launch, with a total funding target of approximately <strong>$300,000–$400,000</strong> to cover working capital through the Month 7 break-even point. A lean remote-first launch can reduce initial CAPEX to <strong>$81,000</strong>, though this limits the firm's ability to host client meetings and maintain the professional presence expected by enterprise clients.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div style={{ background: "white", borderRadius: 12, padding: "1.5rem", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(30,58,95,0.06)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: C.slate, fontSize: "1.1rem", marginBottom: "1.25rem" }}>
                  Startup Cost Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={startupCostData} cx="50%" cy="50%" outerRadius={95} paddingAngle={2} dataKey="value">
                      {startupCostData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, "Amount"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {startupCostData.map(d => (
                    <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.78rem", color: C.text, flex: 1 }}>{d.name}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: C.muted }}>${d.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { label: "Lean Remote Launch", amount: "$81,000", desc: "No office, minimal equipment, remote-first operations", color: C.muted },
                  { label: "Standard Launch", amount: "$101,000", desc: "Adds advanced analytics platform integration", color: C.teal },
                  { label: "Full Office Launch", amount: "$146,000", desc: "Includes office setup, furnishings, and full tech stack", color: C.slate },
                  { label: "Total Funding Target", amount: "$300K–$400K", desc: "Includes working capital through Month 7 break-even", color: C.amber },
                ].map(item => (
                  <div key={item.label} style={{ background: "white", borderRadius: 10, padding: "1rem 1.25rem", borderTop: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, borderLeft: `4px solid ${item.color}`, boxShadow: "0 1px 4px rgba(30,58,95,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: C.text, fontSize: "0.88rem" }}>{item.label}</p>
                        <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.muted, fontSize: "0.78rem", marginTop: "0.2rem" }}>{item.desc}</p>
                      </div>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: item.color, fontSize: "1rem", whiteSpace: "nowrap", marginLeft: "1rem" }}>{item.amount}</span>
                    </div>
                  </div>
                ))}
                <div style={{ background: `${C.slate}10`, borderRadius: 10, padding: "1rem 1.25rem", border: `1px solid ${C.slate}30` }}>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700, color: C.slate, fontSize: "0.85rem", marginBottom: "0.4rem" }}>Key Payroll Assumptions</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
                    {[
                      ["Founder/Principal", "$180K/yr"],
                      ["Senior Consultant", "$95K/yr"],
                      ["Field Analyst", "$70K/yr"],
                      ["Admin/Operations", "$50K/yr"],
                    ].map(([role, salary]) => (
                      <div key={role} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.78rem", color: C.muted }}>{role}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: C.text }}>{salary}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <div style={{ height: 48 }} />

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 7: GO-TO-MARKET STRATEGY
          ═══════════════════════════════════════════════════════════════ */}
          <Section id="strategy">
            <SectionHeader label="07 · Go-to-Market Strategy" title="Building a Durable Client Pipeline" subtitle="A targeted, relationship-driven approach to enterprise client acquisition." />

            <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.text, lineHeight: 1.8, fontSize: "0.97rem", marginBottom: "2rem" }}>
              <p style={{ marginBottom: "1rem" }}>
                Legacy Asset Intelligence will pursue a focused go-to-market strategy targeting mid-market enterprises ($50M–$500M revenue) in manufacturing, healthcare, and IT-intensive sectors. These organizations have sufficient asset complexity to generate meaningful ghost asset problems but often lack the internal resources to address them systematically. Our initial client acquisition will leverage the founding team's existing professional networks, supplemented by targeted content marketing and strategic partnerships with accounting firms and ERP implementation consultants.
              </p>
              <p>
                The client acquisition funnel is designed to convert awareness into long-term retainer relationships. Initial project engagements serve as proof-of-concept demonstrations, with the goal of converting 60% of project clients to annual governance retainers within 12 months of engagement completion. This conversion rate is the single most important driver of long-term revenue growth and profitability.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              {/* GTM Channels */}
              <div style={{ background: "white", borderRadius: 12, padding: "1.5rem", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(30,58,95,0.06)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: C.slate, fontSize: "1.05rem", marginBottom: "1.25rem" }}>
                  Client Acquisition Channels
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[
                    { channel: "Professional Network & Referrals", weight: 40, color: C.slate },
                    { channel: "Accounting Firm Partnerships", weight: 25, color: C.teal },
                    { channel: "Content Marketing & SEO", weight: 15, color: C.amber },
                    { channel: "Industry Conferences & Events", weight: 12, color: C.slateLight },
                    { channel: "Direct Outbound Sales", weight: 8, color: C.tealLight },
                  ].map(item => (
                    <div key={item.channel}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.82rem", color: C.text }}>{item.channel}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: C.muted }}>{item.weight}%</span>
                      </div>
                      <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${item.weight}%`, background: item.color, borderRadius: 3, transition: "width 1s cubic-bezier(0.23, 1, 0.32, 1)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Journey */}
              <div style={{ background: "white", borderRadius: 12, padding: "1.5rem", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(30,58,95,0.06)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: C.slate, fontSize: "1.05rem", marginBottom: "1.25rem" }}>
                  Client Lifecycle Journey
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                  {[
                    { step: "1", title: "Awareness", desc: "Content, referrals, and conference presence", color: C.muted },
                    { step: "2", title: "Discovery Call", desc: "Ghost asset assessment and ROI estimation", color: C.slateLight },
                    { step: "3", title: "Proposal", desc: "Scoped project with clear deliverables and pricing", color: C.slate },
                    { step: "4", title: "Phase 1 Engagement", desc: "Physical audit, tagging, and FAR reconciliation", color: C.teal },
                    { step: "5", title: "Platform Onboarding", desc: "Technology integration and staff training", color: C.tealLight },
                    { step: "6", title: "Governance Retainer", desc: "Recurring audits and continuous compliance", color: C.amber },
                  ].map((item, i) => (
                    <div key={item.step} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", paddingBottom: i < 5 ? "0.75rem" : 0 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: item.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 600, flexShrink: 0 }}>
                          {item.step}
                        </div>
                        {i < 5 && <div style={{ width: 2, flex: 1, background: C.border, marginTop: "0.25rem", minHeight: 16 }} />}
                      </div>
                      <div style={{ paddingBottom: i < 5 ? "0.5rem" : 0 }}>
                        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: C.text, fontSize: "0.85rem" }}>{item.title}</p>
                        <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.muted, fontSize: "0.78rem" }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Strategic Partnerships */}
            <div style={{ background: `linear-gradient(135deg, ${C.teal}15 0%, ${C.teal}05 100%)`, borderRadius: 12, padding: "1.5rem", border: `1px solid ${C.teal}30` }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: C.slate, fontSize: "1.05rem", marginBottom: "1rem" }}>
                Strategic Partnership Targets
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                {[
                  { type: "Accounting Firms", desc: "CPA firms that identify ghost asset issues during audits and refer clients for remediation", icon: "🏦" },
                  { type: "ERP Consultants", desc: "SAP, Oracle, and NetSuite implementation partners who need asset data clean-up services", icon: "💻" },
                  { type: "Insurance Brokers", desc: "Commercial property insurance brokers who can demonstrate premium savings from accurate asset records", icon: "🛡️" },
                ].map(p => (
                  <div key={p.type} style={{ background: "white", borderRadius: 8, padding: "1rem", border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>{p.icon}</div>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700, color: C.slate, fontSize: "0.88rem", marginBottom: "0.4rem" }}>{p.type}</p>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.muted, fontSize: "0.78rem", lineHeight: 1.5 }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <div style={{ height: 48 }} />

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 8: RISK & MITIGATION
          ═══════════════════════════════════════════════════════════════ */}
          <Section id="risk">
            <SectionHeader label="08 · Risk & Mitigation" title="Risk Assessment & Contingency Planning" subtitle="Proactive identification and mitigation of key business risks." />

            <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.text, lineHeight: 1.8, fontSize: "0.97rem", marginBottom: "2rem" }}>
              <p>
                Every consulting firm startup faces a predictable set of risks. Legacy Asset Intelligence has identified and developed mitigation strategies for the most significant threats to the business, ranging from client acquisition challenges to competitive responses from established players. Our risk management framework is designed to preserve capital and maintain operational continuity through the critical first 18 months of operation.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {[
                {
                  risk: "Slow Client Acquisition", level: "High", impact: "High",
                  mitigation: "Leverage founder's existing network for first 3–5 clients. Offer a pilot engagement at reduced fee to establish proof-of-concept and generate case studies.",
                  color: "#EF4444"
                },
                {
                  risk: "Competition from Established Firms", level: "Medium", impact: "Medium",
                  mitigation: "Focus on mid-market segment underserved by Kroll. Differentiate through end-to-end delivery, faster turnaround, and proprietary governance framework.",
                  color: C.amber
                },
                {
                  risk: "Key Person Dependency", level: "Medium", impact: "High",
                  mitigation: "Document all methodologies and processes from Day 1. Hire second senior consultant by Month 9 to distribute client relationships and institutional knowledge.",
                  color: C.amber
                },
                {
                  risk: "Technology Platform Selection", level: "Low", impact: "Medium",
                  mitigation: "Evaluate and partner with 2–3 established ITAM/CMMS vendors (e.g., ServiceNow, Ivanti, Snipe-IT) rather than building proprietary software in Year 1.",
                  color: C.teal
                },
                {
                  risk: "Cash Flow in Early Months", level: "High", impact: "High",
                  mitigation: "Maintain 6-month operating reserve. Structure project payment terms as 50% upfront, 50% on delivery. Prioritize retainer conversion to build recurring revenue base.",
                  color: "#EF4444"
                },
                {
                  risk: "Regulatory / Compliance Changes", level: "Low", impact: "Low",
                  mitigation: "Monitor GASB, SOX, and IFRS 16 updates. Maintain relationships with accounting firm partners who provide early warning of regulatory changes affecting clients.",
                  color: C.tealLight
                },
              ].map(item => (
                <div key={item.risk} style={{ background: "white", borderRadius: 10, padding: "1.25rem", borderTop: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, borderLeft: `4px solid ${item.color}`, boxShadow: "0 1px 4px rgba(30,58,95,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", color: C.slate, fontSize: "0.95rem" }}>{item.risk}</h4>
                    <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0, marginLeft: "0.5rem" }}>
                      <span style={{ background: `${item.color}20`, color: item.color, padding: "0.15rem 0.5rem", borderRadius: 4, fontSize: "0.65rem", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700 }}>
                        {item.level} Risk
                      </span>
                    </div>
                  </div>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.muted, fontSize: "0.8rem", lineHeight: 1.6 }}>
                    <strong style={{ color: C.teal }}>Mitigation:</strong> {item.mitigation}
                  </p>
                </div>
              ))}
            </div>

            {/* SWOT */}
            <div style={{ marginTop: "1.5rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: C.slate, fontSize: "1.1rem", marginBottom: "1rem" }}>SWOT Analysis</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  {
                    type: "Strengths", color: C.teal, bg: "#F0FDFA",
                    items: ["End-to-end service model (unique in market)", "Technology platform differentiator", "Recurring governance revenue stream", "High ROI visibility for clients"]
                  },
                  {
                    type: "Weaknesses", color: "#EF4444", bg: "#FEF2F2",
                    items: ["New brand with no established track record", "Key person dependency in early stage", "High initial capital requirement", "Long sales cycles for enterprise clients"]
                  },
                  {
                    type: "Opportunities", color: C.amber, bg: "#FFFBEB",
                    items: ["$264B+ market growing at 28.3% CAGR", "Increasing regulatory compliance pressure", "Digital transformation driving asset complexity", "Accounting firm partnership channel"]
                  },
                  {
                    type: "Threats", color: C.slate, bg: "#EEF2F7",
                    items: ["Established firms expanding into mid-market", "Economic downturn reducing consulting spend", "DIY asset management software adoption", "Talent competition for field consultants"]
                  },
                ].map(quadrant => (
                  <div key={quadrant.type} style={{ background: quadrant.bg, borderRadius: 10, padding: "1.25rem", border: `1px solid ${quadrant.color}30` }}>
                    <h4 style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700, color: quadrant.color, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                      {quadrant.type}
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {quadrant.items.map(item => (
                        <li key={item} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.4rem", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.82rem", color: C.text, lineHeight: 1.4 }}>
                          <span style={{ color: quadrant.color, fontWeight: 700, flexShrink: 0 }}>•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          {/* SECTION 8: CASE STUDIES */}
          <Section id="case-studies">
            <SectionHeader label="08 · CLIENT RESULTS" title="Real-World Recovery Examples" subtitle="See how organizations across industries have recovered significant capital through LAI's methodology." />
            <div style={{ marginBottom: "2rem" }}>
              <CaseStudies />
            </div>
          </Section>

          {/* SECTION 9: ROI CALCULATOR */}
          <Section id="calculator">
            <SectionHeader label="09 · INTERACTIVE TOOL" title="Estimate Your Recoverable Capital" subtitle="Use our ROI calculator to see how much capital your organization could recover." />
            <div style={{ marginBottom: "2rem" }}>
              <ROICalculator />
            </div>
          </Section>

            {/* Footer CTA */}
            <div style={{ marginTop: "2.5rem", background: `linear-gradient(135deg, ${C.slate} 0%, ${C.slateLight} 100%)`, borderRadius: 12, padding: "2rem", textAlign: "center", color: "white" }}>
              <img src={LOGO_IMG} alt="LAI" style={{ height: 48, width: 48, objectFit: "contain", margin: "0 auto 1rem" }} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
                Legacy Asset Intelligence
              </h3>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "rgba(255,255,255,0.75)", fontSize: "0.9rem", maxWidth: 480, margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
                Recover capital. Govern with confidence. For enterprises that can't afford invisible losses.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
                {[
                  { label: "Prepared", value: "June 2026" },
                  { label: "Classification", value: "Confidential" },
                  { label: "Version", value: "1.0" },
                ].map(item => (
                  <div key={item.label} style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{item.label}</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: C.tealLight, fontWeight: 500 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>

        </main>
      </div>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}
