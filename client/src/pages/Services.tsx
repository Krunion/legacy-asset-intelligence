import { usePageMeta } from "@/hooks/usePageMeta";
/**
 * Legacy Asset Intelligence — Services & Methodology Page
 * Section 4: Consulting methodology journey, phases, deliverables, engagement expectations
 * Positions LAI as strategic consulting organization, not individual service provider
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

export default function Services() {
  usePageMeta({ title: "Services & Methodology | Legacy Asset Intelligence", description: "Explore our four-phase methodology: Discovery & Executive Assessment, Physical Verification, Technology Enablement, and Recurring Governance.", canonical: "/services" });
  const [, navigate] = useLocation();

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(to bottom, rgba(11,15,19,0.92), rgba(11,15,19,0.96)), url('${HERO_IMG}') center/cover fixed`, color: C.text }}>

      {/* ═══ HERO — Methodology Introduction ═══ */}
      <section style={{ padding: "8rem 2rem 4rem", textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "1.5rem" }}>
          Consulting Methodology
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 700, color: C.text, lineHeight: 1.15, marginBottom: "2rem" }}>
          A Structured Approach to<br />
          <span style={{ color: C.gold }}>Enterprise Asset Intelligence</span>
        </h1>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.05rem", color: C.textMuted, lineHeight: 1.8, maxWidth: 780, margin: "0 auto" }}>
          Organizations often address asset-related problems through disconnected solutions — inventory counts, software purchases, financial audits, or isolated consulting engagements. Legacy Asset Intelligence integrates these disciplines into a unified consulting methodology capable of improving both operational execution and executive decision-making.
        </p>
      </section>

      {/* ═══ PHASE 1 — Discovery & Executive Assessment ═══ */}
      <Section id="phase-1">
        <div style={{ maxWidth: 1050, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.goldMuted, border: `2px solid ${C.gold}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: C.gold }}>01</span>
              </div>
              <div style={{ width: 2, height: 80, background: `linear-gradient(to bottom, ${C.gold}, transparent)`, marginTop: "0.75rem" }} />
            </div>
            <div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.5rem" }}>Phase One</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1.25rem" }}>
                Discovery & Executive Assessment
              </h2>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1rem", lineHeight: 1.85, marginBottom: "1.5rem" }}>
                Every engagement begins by working directly with executive leadership to understand how physical assets are currently managed, how financial information is maintained, and where opportunities for improvement exist. This phase provides strategic intelligence that supports informed executive decision-making before additional investments are made.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                {["Executive stakeholder interviews", "Asset management practice evaluation", "Governance maturity assessment", "Fixed Asset Register analysis", "Recoverable capital opportunity identification", "Organizational risk assessment", "Strategic roadmap development", "Preliminary ROI modeling"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.silver }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: C.goldMuted, borderRadius: 6, padding: "1rem 1.25rem", borderLeft: `3px solid ${C.gold}` }}>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: C.gold, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.3rem" }}>Executive Deliverable</p>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: C.text, margin: 0 }}>Executive Assessment Report with Governance Maturity Evaluation, Preliminary Recovery Analysis, and Strategic Recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ PHASE 2 — Physical Verification & Recovery Analysis ═══ */}
      <Section id="phase-2">
        <div style={{ maxWidth: 1050, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(13,148,136,0.15)", border: `2px solid ${C.teal}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: C.teal }}>02</span>
              </div>
              <div style={{ width: 2, height: 80, background: `linear-gradient(to bottom, ${C.teal}, transparent)`, marginTop: "0.75rem" }} />
            </div>
            <div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.teal, marginBottom: "0.5rem" }}>Phase Two</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1.25rem" }}>
                Physical Verification & Recovery Analysis
              </h2>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1rem", lineHeight: 1.85, marginBottom: "1.5rem" }}>
                Physical verification validates organizational records, identifies discrepancies, confirms asset existence and condition, and establishes accurate information for financial reporting and future governance. Field teams verify assets, reconcile discrepancies, identify ghost assets, evaluate equipment utilization, and support capital recovery opportunities while maintaining minimal disruption to ongoing operations.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                {["Wall-to-wall physical inventory", "Condition assessment & documentation", "Floor-to-book reconciliation", "Book-to-floor reconciliation", "Ghost asset identification", "Equipment utilization evaluation", "Capital recovery analysis", "Photographic documentation"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.teal, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.silver }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(13,148,136,0.1)", borderRadius: 6, padding: "1rem 1.25rem", borderLeft: `3px solid ${C.teal}` }}>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: C.teal, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.3rem" }}>Executive Deliverable</p>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: C.text, margin: 0 }}>Complete Asset Inventory, Reconciled Fixed Asset Register, Recoverable Capital Analysis, and Asset Accountability Score</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ PHASE 3 — Technology Enablement & Governance ═══ */}
      <Section id="phase-3">
        <div style={{ maxWidth: 1050, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(27,77,62,0.3)", border: `2px solid ${C.emerald}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#2DD4A0" }}>03</span>
              </div>
              <div style={{ width: 2, height: 80, background: `linear-gradient(to bottom, ${C.emerald}, transparent)`, marginTop: "0.75rem" }} />
            </div>
            <div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#2DD4A0", marginBottom: "0.5rem" }}>Phase Three</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1.25rem" }}>
                Technology Enablement & Governance Implementation
              </h2>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1rem", lineHeight: 1.85, marginBottom: "1.5rem" }}>
                Technology serves as the foundation for long-term accountability. This phase transforms verified information into sustainable business processes through platform configuration, data validation, governance policy establishment, workflow development, reporting dashboard creation, and significant improvement in executive visibility.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                {["Optional barcode/QR tagging & identification", "Platform selection & configuration", "Data migration & validation", "Governance policy development", "Automated workflow creation", "Executive dashboard configuration", "ERP/financial system integration", "Staff training & certification"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2DD4A0", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.silver }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(27,77,62,0.2)", borderRadius: 6, padding: "1rem 1.25rem", borderLeft: "3px solid #2DD4A0" }}>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "#2DD4A0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.3rem" }}>Executive Deliverable</p>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: C.text, margin: 0 }}>Configured Asset Management Platform (depending on the selected Phase 3 scope), Governance Framework Documentation, Executive Dashboard, and Implementation Roadmap</p>
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: C.textMuted, marginTop: "1rem", fontStyle: "italic" }}>
                Phase 3 scope is customizable. Organizations may select full platform implementation, advisory-only, vendor-selection support, or roadmap-only engagements based on their specific needs and internal capabilities.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ RECURRING GOVERNANCE ═══ */}
      <Section id="recurring">
        <div style={{ maxWidth: 1050, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ background: C.glass, backdropFilter: "blur(12px)", border: `1px solid ${C.glassBorder}`, borderRadius: 12, padding: "3rem" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>Phase Four</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1rem" }}>
                Recurring Governance & Executive Advisory
              </h2>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1rem", maxWidth: 700, margin: "0 auto", lineHeight: 1.75 }}>
                Organizations require ongoing monitoring, periodic verification, governance assessments, executive reporting, and continuous improvement to maintain the accuracy of their asset information. Our recurring programs are executive advisory partnerships that help organizations preserve accountability while adapting to operational growth and change.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
              {[
                { tier: "Bronze", desc: "Annual governance review, executive reporting, and compliance verification" },
                { tier: "Silver", desc: "Semi-annual audits, dashboard monitoring, and governance refinement" },
                { tier: "Gold", desc: "Quarterly rolling audits, continuous reconciliation, and executive KPI dashboards" },
                { tier: "Platinum", desc: "Dedicated advisory partnership with monthly executive reporting and continuous governance" },
              ].map((program, i) => (
                <div key={i} style={{ textAlign: "center", padding: "1.5rem 1rem", borderRadius: 8, border: `1px solid ${C.glassBorder}` }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: C.gold, marginBottom: "0.75rem" }}>{program.tier}</h3>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.82rem", color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{program.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ EXECUTIVE DELIVERABLES ═══ */}
      <Section id="deliverables">
        <div style={{ maxWidth: 1050, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>What You Receive</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1rem" }}>
              Executive Deliverables & Strategic Intelligence
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1rem", maxWidth: 700, margin: "0 auto", lineHeight: 1.7 }}>
              Every engagement produces comprehensive reporting and strategic recommendations designed to support executive decision-making, budgeting, capital planning, governance improvements, and organizational accountability.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {[
              { title: "Executive Assessment Report", desc: "Comprehensive evaluation of current asset management practices, governance maturity, and strategic recommendations for improvement." },
              { title: "Potential Recovery Analysis", desc: "Identification of record exceptions, potential duplicate expenditures, and areas where insurance and property tax exposure may be reduced." },
              { title: "Asset Accountability Score", desc: "Structured scoring framework that evaluates organizational asset management maturity across multiple governance dimensions." },
              { title: "Governance Maturity Evaluation", desc: "Assessment of current governance practices against industry best practices with a structured improvement roadmap." },
              { title: "Strategic Roadmap", desc: "Multi-year implementation plan with prioritized recommendations, resource requirements, and projected return on investment." },
              { title: "Executive Dashboard", desc: "Real-time visibility into asset accountability metrics, governance KPIs, and organizational performance indicators." },
              { title: "Risk Assessment", desc: "Identification of financial, operational, and compliance risks associated with current asset management practices." },
              { title: "Board Presentation Materials", desc: "Professionally prepared executive summaries and visual presentations suitable for board-level communication." },
              { title: "Implementation Recommendations", desc: "Detailed technical and operational guidance for technology selection, process improvement, and governance establishment." },
            ].map((item, i) => (
              <div key={i} style={{ background: C.glass, backdropFilter: "blur(8px)", border: `1px solid ${C.glassBorder}`, borderRadius: 8, padding: "1.5rem" }}>
                <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: C.text, marginBottom: "0.6rem" }}>{item.title}</h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.82rem", color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ ENGAGEMENT EXPECTATIONS ═══ */}
      <Section id="expectations">
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>The Consulting Experience</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1rem" }}>
              What to Expect Throughout Your Engagement
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[
              { title: "Structured Communication", desc: "Regular executive briefings, progress reports, and milestone updates ensure leadership always understands project status without ambiguity." },
              { title: "Collaborative Planning", desc: "Every engagement begins with detailed project planning that establishes timelines, responsibilities, and expected outcomes before fieldwork begins." },
              { title: "Minimal Operational Disruption", desc: "Field verification is conducted with careful attention to ongoing operations, ensuring that business activities continue without unnecessary interruption." },
              { title: "Transparent Methodology", desc: "Our structured consulting process is fully documented and explained, allowing leadership to understand exactly how findings are developed and validated." },
              { title: "Executive Stakeholder Involvement", desc: "Key leadership is engaged at critical milestones to review findings, validate recommendations, and provide strategic direction for implementation." },
              { title: "Comprehensive Final Deliverables", desc: "Every engagement concludes with professionally prepared reports, presentations, and strategic recommendations ready for executive and board-level review." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "start" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold, marginTop: "0.5rem", flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", fontWeight: 600, color: C.text, marginBottom: "0.4rem" }}>{item.title}</h3>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ PROFESSIONAL STANDARDS ═══ */}
      <Section id="standards">
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>Professional Standards</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: C.text }}>Methodology Built on Professional Rigor</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {[
              { title: "Audit-Supportive Documentation", desc: "Findings are documented with supporting detail designed to assist organizations and their auditors. LAI does not perform audits or provide assurance opinions; our work product supports client-directed reporting." },
              { title: "Veteran-Owned Leadership", desc: "Founded by a United States military veteran, our organization brings discipline, accountability, and service-oriented leadership to every engagement." },
              { title: "Professional Insurance Coverage", desc: "Professional Liability (E&O), General Liability, and Cyber Liability coverage is maintained for all client engagements. Certificate of Insurance is available upon request." },
              { title: "Technology-Enabled Verification", desc: "Enterprise-grade platforms including Asset Panda provide real-time tracking, photographic documentation, and governance automation." },
              { title: "Structured Quality Assurance", desc: "Multi-level review processes ensure every deliverable meets executive presentation standards before client delivery." },
              { title: "Continuous Methodology Refinement", desc: "Our approach evolves with every engagement, incorporating lessons learned and emerging best practices into our consulting framework." },
            ].map((item, i) => (
              <div key={i} style={{ background: "rgba(26,34,48,0.6)", border: `1px solid rgba(168,178,189,0.08)`, borderRadius: 8, padding: "1.5rem" }}>
                <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: C.text, marginBottom: "0.5rem" }}>{item.title}</h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.82rem", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ CLOSING CTA ═══ */}
      <Section id="services-cta">
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "5rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1.5rem" }}>
            Begin With an Executive Assessment
          </h2>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 650, margin: "0 auto 2.5rem" }}>
            Every consulting engagement begins with an Executive Asset Intelligence Assessment — a structured evaluation that helps leadership understand the current state of asset management, identify opportunities for improvement, and develop a strategic roadmap for stronger governance and financial accountability.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/contact")} style={{ background: C.gold, color: "#0B0F13", border: "none", padding: "0.9rem 2.25rem", borderRadius: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}>
              Schedule Executive Assessment
            </button>
            <button onClick={() => navigate("/resources")} style={{ background: "transparent", color: C.gold, border: `1px solid ${C.goldBorder}`, padding: "0.9rem 2.25rem", borderRadius: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 500, cursor: "pointer" }}>
              View Resources
            </button>
          </div>
        </div>
      </Section>

      <div style={{ height: "4rem" }} />
    </div>
  );
}
