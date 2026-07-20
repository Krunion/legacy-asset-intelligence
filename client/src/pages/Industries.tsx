/**
 * Legacy Asset Intelligence — Industries Page
 * Section 5: Dedicated industry content for Healthcare, Manufacturing, Education,
 * Utilities, Logistics, Construction, Government + cross-industry solutions
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

const industries = [
  {
    id: "healthcare",
    name: "Healthcare",
    headline: "Strengthening Financial Accountability in Healthcare Asset Management",
    challenge: "Healthcare organizations manage thousands of high-value clinical, diagnostic, and support assets across multiple facilities. Equipment moves between departments, gets retired without proper documentation, and accumulates on financial records long after it has been disposed of. The result is inflated insurance premiums, inaccurate depreciation schedules, compliance exposure, and potential capital recovery opportunities that remain unidentified.",
    impacts: ["Ghost assets inflating property tax and insurance costs", "Untracked equipment creating compliance and audit exposure", "Capital budget decisions based on inaccurate asset data", "Duplicate purchases due to poor visibility into existing inventory", "Maintenance contracts on equipment no longer in service"],
    approach: "Our healthcare engagements are designed around the unique operational requirements of clinical environments — working around patient care schedules, maintaining infection control protocols, and coordinating with department leadership to minimize disruption while delivering comprehensive asset intelligence.",
    outcomes: ["Ghost asset identification and documentation for financial review", "Accurate fixed asset register for financial reporting", "Documentation supporting insurance and property tax review by qualified professionals", "Capital planning intelligence for equipment lifecycle management", "Governance framework for ongoing asset accountability"],
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    headline: "Operational Intelligence for Complex Manufacturing Environments",
    challenge: "Manufacturing facilities contain dense concentrations of production equipment, tooling, support systems, and infrastructure assets that change constantly through upgrades, replacements, and retooling. Financial records often lag behind physical reality by years, creating significant discrepancies between what the organization believes it owns and what actually exists on the production floor.",
    impacts: ["Production equipment on books that was scrapped or replaced years ago", "Tooling and fixtures never properly capitalized or tracked", "Insurance coverage based on inaccurate asset valuations", "Capital expenditure decisions without accurate baseline data", "Maintenance spending on equipment that no longer exists"],
    approach: "Manufacturing engagements require deep understanding of production environments, equipment classifications, and the relationship between asset condition and operational capability. Our field teams are experienced in navigating complex production floors while maintaining safety protocols and minimizing operational disruption.",
    outcomes: ["Complete production asset inventory with condition assessments", "Floor-to-book reconciliation identifying financial discrepancies", "Equipment utilization analysis for capital planning", "Governance framework for tracking asset changes in real-time", "Insurance and tax documentation supporting potential cost adjustments"],
  },
  {
    id: "education",
    name: "Education",
    headline: "Asset Accountability Across Multi-Campus Educational Institutions",
    challenge: "Educational institutions — from K-12 districts to major universities — manage vast portfolios of technology, furniture, laboratory equipment, athletic facilities, and infrastructure assets across multiple buildings and campuses. Decentralized purchasing, high staff turnover, and limited tracking systems create environments where assets disappear, duplicate purchases occur, and financial records become increasingly unreliable over time.",
    impacts: ["Technology assets purchased but never properly tracked or inventoried", "Furniture and equipment moved between buildings without documentation", "Grant-funded assets requiring specific tracking and reporting", "Bond-funded capital improvements with inadequate accountability", "Insurance premiums based on outdated or inflated asset schedules"],
    approach: "Educational engagements are structured around academic calendars, working during breaks and low-activity periods to minimize disruption to learning environments. We understand the unique challenges of grant compliance, bond accountability, and the decentralized nature of educational asset management.",
    outcomes: ["Complete campus-wide asset inventory across all facilities", "Grant and bond compliance documentation", "Technology refresh planning based on accurate lifecycle data", "Insurance and property tax review through ghost asset identification", "Sustainable governance framework for ongoing accountability"],
  },
  {
    id: "utilities",
    name: "Utilities & Energy",
    headline: "Critical Infrastructure Asset Intelligence for Utility Organizations",
    challenge: "Utility companies manage extensive networks of generation, transmission, distribution, and support assets that span geographic regions. The combination of long asset lifecycles, regulatory reporting requirements, and the critical nature of infrastructure creates environments where accurate asset information is essential for both financial performance and operational reliability.",
    impacts: ["Financial reporting based on inaccurate asset records", "Infrastructure assets retired but never removed from financial records", "Capital planning without accurate condition assessment data", "Maintenance programs based on incomplete asset inventories", "Documentation gaps that complicate regulatory and compliance reviews"],
    approach: "Utility engagements require understanding of regulatory frameworks, rate case implications, and the critical nature of infrastructure assets. Our methodology addresses both the financial reporting requirements and the operational intelligence needs of utility organizations.",
    outcomes: ["Structured documentation that may assist the client and its qualified advisers with regulatory and audit preparation", "Accurate asset inventory supporting capital planning decisions", "Infrastructure condition assessment for lifecycle management", "Ghost asset identification for potential financial benefit review", "Long-term governance framework for ongoing asset accountability"],
  },
  {
    id: "logistics",
    name: "Logistics & Distribution",
    headline: "Asset Visibility Across Complex Distribution Networks",
    challenge: "Logistics and distribution organizations manage fleets, warehouse equipment, material handling systems, and technology assets across multiple facilities and geographic regions. The high-velocity nature of distribution operations means assets are constantly moving, being replaced, and changing condition — creating significant challenges for maintaining accurate financial records.",
    impacts: ["Fleet and equipment assets on books after disposal or trade-in", "Warehouse equipment replaced without proper financial documentation", "Technology assets deployed across facilities without centralized tracking", "Insurance coverage based on inaccurate fleet and equipment valuations", "Capital planning without accurate condition and utilization data"],
    approach: "Distribution engagements are designed to work within the 24/7 operational demands of logistics environments, coordinating with facility management to conduct verification during optimal windows while maintaining complete coverage across all asset categories.",
    outcomes: ["Complete fleet and equipment inventory with condition data", "Multi-facility asset reconciliation and standardization", "Insurance and tax review support through accurate valuations", "Capital planning intelligence for equipment lifecycle management", "Governance framework for tracking assets across locations"],
  },
  {
    id: "construction",
    name: "Construction",
    headline: "Equipment Accountability for Construction and Heavy Industry",
    challenge: "Construction companies manage expensive heavy equipment, vehicles, tools, and technology assets that move between job sites, get transferred between divisions, and are subject to harsh operating conditions. The mobile nature of construction assets creates unique tracking challenges that traditional inventory methods cannot address effectively.",
    impacts: ["Equipment moving between job sites without documentation", "Tools and small equipment lost or unaccounted for across projects", "Insurance premiums based on inaccurate equipment valuations", "Equipment purchases duplicated due to poor visibility", "Maintenance costs on equipment that has been disposed of"],
    approach: "Construction engagements address the unique challenges of mobile assets, multi-site operations, and the harsh environments that accelerate equipment degradation. Our methodology includes both yard-based verification and job-site coordination to ensure complete coverage.",
    outcomes: ["Complete equipment inventory across all sites and yards", "Utilization analysis for fleet optimization decisions", "Insurance documentation for accurate premium calculations", "Job costing improvement through better equipment tracking", "Governance framework for mobile asset accountability"],
  },
  {
    id: "government",
    name: "Government & Public Sector",
    headline: "Public Accountability Through Comprehensive Asset Intelligence",
    challenge: "Government agencies and public sector organizations face unique accountability requirements — managing taxpayer-funded assets with transparency, compliance, and fiduciary responsibility. The combination of complex procurement processes, multiple funding sources, and public reporting requirements creates environments where accurate asset information is both a financial necessity and a public trust obligation.",
    impacts: ["Taxpayer-funded assets unaccounted for or improperly tracked", "GASB compliance challenges due to incomplete asset records", "Grant-funded assets requiring specific tracking and reporting", "Capital improvement bonds with inadequate asset accountability", "Public reporting based on inaccurate or outdated information"],
    approach: "Government engagements are structured around the unique requirements of public sector accountability — GASB compliance, grant reporting, bond accountability, and the transparency expectations of public stewardship. Our methodology addresses both the financial requirements and the public trust obligations of government asset management.",
    outcomes: ["Documentation designed to support the client's GASB-related reporting and review processes", "Grant and bond accountability documentation", "Public reporting support with accurate asset data", "Capital planning intelligence for budget development", "Governance framework supporting public sector accountability standards"],
  },
];

export default function Industries() {
  const [, navigate] = useLocation();

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(to bottom, rgba(11,15,19,0.92), rgba(11,15,19,0.96)), url('${HERO_IMG}') center/cover fixed`, color: C.text }}>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: "8rem 2rem 4rem", textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "1.5rem" }}>Industries We Serve</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 700, color: C.text, lineHeight: 1.15, marginBottom: "2rem" }}>
          Universal Principles,<br /><span style={{ color: C.gold }}>Customized Execution</span>
        </h1>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.05rem", color: C.textMuted, lineHeight: 1.8, maxWidth: 780, margin: "0 auto" }}>
          The underlying principles of Executive Asset Intelligence apply across every asset-intensive industry. However, each sector presents unique operational environments, regulatory requirements, and organizational challenges that require customized approaches to assessment, verification, and governance.
        </p>
      </section>

      {/* ═══ INDUSTRY NAV ═══ */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem 3rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.6rem" }}>
          {industries.map((ind) => (
            <a key={ind.id} href={`#${ind.id}`} style={{ background: C.glass, backdropFilter: "blur(6px)", border: `1px solid ${C.glassBorder}`, borderRadius: 20, padding: "0.55rem 1.2rem", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.82rem", color: C.silver, cursor: "pointer", textDecoration: "none", transition: "all 0.3s" }}>
              {ind.name}
            </a>
          ))}
        </div>
      </div>

      {/* ═══ INDUSTRY SECTIONS ═══ */}
      {industries.map((ind, idx) => (
        <Section key={ind.id} id={ind.id}>
          <div style={{ maxWidth: 1050, margin: "0 auto", padding: "3rem 2rem", borderTop: idx > 0 ? `1px solid ${C.glassBorder}` : "none" }}>
            <div style={{ marginBottom: "2rem" }}>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.5rem" }}>{ind.name}</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: C.text, lineHeight: 1.25, marginBottom: "1.25rem" }}>{ind.headline}</h2>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.95rem", lineHeight: 1.85, marginBottom: "1.5rem" }}>{ind.challenge}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
              <div>
                <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.silver, marginBottom: "1rem" }}>Common Financial Impacts</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {ind.impacts.map((impact, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "start", gap: "0.6rem" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#E74C3C", marginTop: "0.45rem", flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.6 }}>{impact}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.silver, marginBottom: "1rem" }}>Engagement Outcomes</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {ind.outcomes.map((outcome, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "start", gap: "0.6rem" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, marginTop: "0.45rem", flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.6 }}>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: "1.75rem", background: C.goldMuted, borderRadius: 6, padding: "1.25rem 1.5rem", borderLeft: `3px solid ${C.gold}` }}>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: C.gold, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Our Approach</p>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: C.text, margin: 0, lineHeight: 1.75 }}>{ind.approach}</p>
            </div>
          </div>
        </Section>
      ))}

      {/* ═══ CROSS-INDUSTRY ═══ */}
      <Section id="cross-industry">
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ background: C.glass, backdropFilter: "blur(12px)", border: `1px solid ${C.glassBorder}`, borderRadius: 12, padding: "3rem" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>Cross-Industry Solutions</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1rem" }}>Universal Challenges, Proven Methodology</h2>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.95rem", maxWidth: 700, margin: "0 auto", lineHeight: 1.75 }}>
                Regardless of industry, organizations share common asset management challenges that our methodology is designed to address.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
              {[
                { title: "Ghost Asset Elimination", desc: "Identifying and removing assets from financial records that no longer physically exist — reducing tax, insurance, and maintenance costs." },
                { title: "Capital Recovery", desc: "Discovering hidden value in underutilized, surplus, or improperly classified assets that can be redeployed or liquidated." },
                { title: "Financial Accuracy", desc: "Reconciling physical reality with financial records to improve reporting accuracy, audit readiness, and compliance." },
                { title: "Governance Framework", desc: "Establishing sustainable processes, policies, and accountability structures that maintain accuracy over time." },
                { title: "Technology Enablement", desc: "Implementing modern tracking platforms with verified data, trained staff, and integrated workflows." },
                { title: "Executive Intelligence", desc: "Providing leadership with the accurate, timely information needed for strategic capital decisions." },
              ].map((item, i) => (
                <div key={i} style={{ textAlign: "center", padding: "1.25rem" }}>
                  <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: C.text, marginBottom: "0.6rem" }}>{item.title}</h3>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.82rem", color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>



      {/* ═══ CLOSING CTA ═══ */}
      <Section id="industries-cta">
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "4rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3.5vw, 2rem)", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1.5rem" }}>
            Discuss Your Industry-Specific Challenges
          </h2>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1rem", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 650, margin: "0 auto 2.5rem" }}>
            Every organization faces unique asset management challenges shaped by their industry, operational environment, and organizational structure. We welcome the opportunity to discuss how our methodology can be customized to address your specific needs.
          </p>
          <button onClick={() => navigate("/contact")} style={{ background: C.gold, color: "#0B0F13", border: "none", padding: "0.9rem 2.25rem", borderRadius: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}>
            Schedule Industry Consultation
          </button>
        </div>
      </Section>

      <div style={{ height: "4rem" }} />
    </div>
  );
}
