/**
 * Legacy Asset Intelligence — About Page
 * Section 3: Company Story, Mission, Vision, Founder, Values, Differentiators
 * Executive consulting narrative — not a traditional company biography
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

export default function About() {
  const [, navigate] = useLocation();

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(to bottom, rgba(11,15,19,0.92), rgba(11,15,19,0.96)), url('${HERO_IMG}') center/cover fixed`, color: C.text }}>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO — Company Introduction Narrative
          ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "8rem 2rem 5rem", textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "1.5rem" }}>
          About Legacy Asset Intelligence
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, color: C.text, lineHeight: 1.15, marginBottom: "2rem" }}>
          Transforming Physical Asset Information Into<br />
          <span style={{ color: C.gold }}>Strategic Business Intelligence</span>
        </h1>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.1rem", color: C.textMuted, lineHeight: 1.8, maxWidth: 800, margin: "0 auto" }}>
          Organizations invest millions of dollars in physical assets while often relying on incomplete, outdated, or inaccurate information to manage those investments. This disconnect creates unnecessary financial exposure, poor capital planning, operational inefficiencies, and governance risks that remain hidden for years. Legacy Asset Intelligence was established to help executive leadership eliminate these blind spots by transforming physical asset information into accurate, reliable business intelligence that supports better organizational decision-making.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          MISSION
          ═══════════════════════════════════════════════════════════════════════ */}
      <Section id="mission">
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", alignItems: "start" }}>
            <div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>Our Mission</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: C.text, lineHeight: 1.2 }}>
                Creating Measurable Business Value Through Better Information
              </h2>
            </div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1rem", lineHeight: 1.85 }}>
              <p style={{ marginBottom: "1.5rem" }}>
                Legacy Asset Intelligence is committed to helping organizations recover hidden capital, improve financial reporting accuracy, strengthen governance, reduce unnecessary spending, and establish sustainable systems for long-term asset accountability.
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                Every engagement is focused on creating measurable business value through better information, stronger processes, and executive-level decision support. We believe that organizations deserve complete visibility into their physical assets — not as an operational exercise, but as a strategic imperative that directly impacts financial performance, capital planning, and organizational accountability.
              </p>
              <p>
                Our mission extends beyond individual projects. We exist to improve the financial health and operational performance of the organizations we serve by establishing systems and governance frameworks that continue delivering value for years after the initial engagement has been completed.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          VISION
          ═══════════════════════════════════════════════════════════════════════ */}
      <Section id="vision">
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ background: C.glass, backdropFilter: "blur(12px)", border: `1px solid ${C.glassBorder}`, borderRadius: 12, padding: "3.5rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "1rem", textAlign: "center" }}>Our Vision</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: C.text, lineHeight: 1.3, textAlign: "center", marginBottom: "2rem" }}>
              A Future Where Organizations Operate With Complete Asset Visibility
            </h2>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1rem", lineHeight: 1.85, maxWidth: 800, margin: "0 auto" }}>
              <p style={{ marginBottom: "1.5rem" }}>
                Legacy Asset Intelligence is working toward a future where organizations no longer rely on incomplete records, outdated inventories, or reactive decision-making. We envision organizations operating with complete visibility into their physical assets, allowing leadership to make informed capital decisions, improve financial accountability, and maintain governance programs that continuously support operational excellence.
              </p>
              <p>
                Our vision extends beyond individual engagements. We are building long-term partnerships that continue delivering value for years, helping organizations adapt their asset intelligence programs as they grow, evolve, and face new operational challenges. The ultimate measure of our success is not the completion of a project, but the lasting improvement in how organizations understand, manage, and leverage their physical assets as strategic financial resources.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOUNDER SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <Section id="founder">
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "5rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>Leadership</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: C.text, lineHeight: 1.2 }}>
              Founded on Experience, Driven by Purpose
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
            {/* Founder Story */}
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.95rem", lineHeight: 1.85 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: C.text, marginBottom: "1.25rem" }}>
                Kevin Runion — Founder & Chief Executive Officer
              </h3>
              <p style={{ marginBottom: "1.25rem" }}>
                Legacy Asset Intelligence was founded by Kevin Runion after a career built around operational leadership, process improvement, accountability, and organizational performance. Having witnessed firsthand how executives are forced to make critical business decisions based on inaccurate, incomplete, or outdated asset information, Kevin recognized that organizations needed a fundamentally different approach to physical asset intelligence.
              </p>
              <p style={{ marginBottom: "1.25rem" }}>
                Rather than simply counting assets or implementing software, Kevin envisioned a consulting methodology that integrates executive assessment, physical verification, technology enablement, and sustainable governance into a single comprehensive framework — one that delivers lasting organizational value rather than temporary project outcomes.
              </p>
              <p>
                His background in healthcare operations, process improvement, and organizational accountability provides a unique perspective on the challenges executives face when managing complex physical asset portfolios across multiple facilities and departments.
              </p>
            </div>

            {/* Executive Team */}
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: C.text, marginBottom: "1.5rem" }}>
                Executive Leadership Team
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {[
                  { name: "Chris Haynes", title: "Co-Founder & Chief Operations Officer", desc: "Brings deep expertise in operational execution, field team management, and process optimization. Chris ensures that every engagement is delivered with precision, consistency, and measurable accountability." },
                  { name: "Andrea Haynes", title: "Chief Revenue Officer", desc: "Leads business development and client relationship strategy, ensuring that every prospective engagement is approached with professionalism, transparency, and a genuine commitment to understanding organizational challenges." },
                  { name: "Jessica Runion", title: "Chief Experience Officer", desc: "Oversees the client experience from initial engagement through long-term partnership, ensuring that every interaction reflects the professionalism and attention to detail that defines Legacy Asset Intelligence." },
                ].map((leader, i) => (
                  <div key={i} style={{ background: C.glass, backdropFilter: "blur(8px)", border: `1px solid ${C.glassBorder}`, borderRadius: 8, padding: "1.5rem" }}>
                    <h4 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", fontWeight: 600, color: C.text, marginBottom: "0.25rem" }}>{leader.name}</h4>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: C.gold, letterSpacing: "0.05em", marginBottom: "0.75rem" }}>{leader.title}</p>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{leader.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          DIFFERENTIATORS
          ═══════════════════════════════════════════════════════════════════════ */}
      <Section id="differentiators">
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>What Sets Us Apart</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1rem" }}>
              An Integrated Approach to Asset Intelligence
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1rem", maxWidth: 750, margin: "0 auto", lineHeight: 1.7 }}>
              While many organizations address only one portion of the asset management challenge, Legacy Asset Intelligence combines executive consulting, physical verification, governance development, technology enablement, and long-term accountability into a single integrated methodology.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
            {[
              { label: "Traditional Inventory Firms", desc: "Focus primarily on counting assets and producing inventory reports. Limited strategic insight for executive decision-making.", vs: "We deliver executive intelligence that transforms asset data into strategic business decisions." },
              { label: "Accounting & Audit Firms", desc: "Address financial reporting compliance but rarely verify physical existence or operational condition of assets.", vs: "We reconcile physical reality with financial records, identifying hidden capital recovery opportunities." },
              { label: "Software Vendors", desc: "Provide technology platforms but leave organizations responsible for data accuracy, governance, and ongoing accountability.", vs: "We implement technology as part of a comprehensive governance framework with verified, accurate data." },
              { label: "General Management Consultants", desc: "Offer strategic advisory but typically lack the operational capability to execute physical verification and technology implementation.", vs: "We combine executive strategy with hands-on operational execution across every phase of the engagement." },
            ].map((item, i) => (
              <div key={i} style={{ background: C.glass, backdropFilter: "blur(8px)", border: `1px solid ${C.glassBorder}`, borderRadius: 8, padding: "2rem" }}>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.silver, marginBottom: "0.75rem" }}>{item.label}</p>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: C.textMuted, lineHeight: 1.7, marginBottom: "1.25rem" }}>{item.desc}</p>
                <div style={{ borderTop: `1px solid ${C.glassBorder}`, paddingTop: "1rem" }}>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: C.text, lineHeight: 1.7, margin: 0 }}>
                    <span style={{ color: C.gold, fontWeight: 600 }}>LAI Difference:</span> {item.vs}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CORE VALUES
          ═══════════════════════════════════════════════════════════════════════ */}
      <Section id="values">
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>Our Principles</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: C.text, lineHeight: 1.2 }}>
              Values That Shape Every Engagement
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
            {[
              { title: "Integrity", desc: "We communicate honestly about findings, challenges, and recommendations — even when the truth is uncomfortable. Our clients trust us because we prioritize accuracy over convenience." },
              { title: "Accountability", desc: "We hold ourselves to the same standards of accountability we help organizations achieve. Every deliverable, timeline, and commitment is treated as a professional obligation." },
              { title: "Transparency", desc: "We maintain open communication throughout every engagement, ensuring leadership always understands project status, findings, and next steps without ambiguity." },
              { title: "Professionalism", desc: "Every interaction, document, and deliverable reflects the standards expected from a premium executive consulting organization. We represent our clients' interests with discipline and care." },
              { title: "Continuous Improvement", desc: "We refine our methodology, expand our knowledge, and improve our capabilities with every engagement — ensuring clients always receive the benefit of our most current expertise." },
              { title: "Client Partnership", desc: "We view every engagement as the beginning of a long-term relationship. Our success is measured not by project completion, but by the lasting organizational value we help create." },
            ].map((value, i) => (
              <div key={i} style={{ background: C.glass, backdropFilter: "blur(8px)", border: `1px solid ${C.glassBorder}`, borderRadius: 8, padding: "1.75rem" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: C.gold, marginBottom: "0.75rem" }}>{value.title}</h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: C.textMuted, lineHeight: 1.75, margin: 0 }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TRUST & CREDENTIALS
          ═══════════════════════════════════════════════════════════════════════ */}
      <Section id="trust">
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ background: C.glass, backdropFilter: "blur(12px)", border: `1px solid ${C.glassBorder}`, borderRadius: 12, padding: "3rem" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>Professional Standards</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: C.text, lineHeight: 1.2 }}>
                Trust Through Transparency
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
              {[
                { title: "Veteran-Owned Business", desc: "Founded and led by a United States military veteran, bringing discipline, accountability, and service-oriented leadership to every client engagement." },
                { title: "Professional Insurance", desc: "Maintains Professional Liability (E&O), General Liability, and Cyber Liability coverage appropriate for executive consulting engagements — protecting client interests at every stage." },
                { title: "Confidentiality & Ethics", desc: "We routinely handle sensitive operational, financial, and asset-related information with strict confidentiality protocols and responsible data management practices." },
              ].map((item, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", fontWeight: 600, color: C.text, marginBottom: "0.75rem" }}>{item.title}</h3>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          INDUSTRIES SERVED (Brief)
          ═══════════════════════════════════════════════════════════════════════ */}
      <Section id="industries-brief">
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>Industries We Serve</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1rem" }}>
              Universal Principles, Customized Execution
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1rem", maxWidth: 700, margin: "0 auto", lineHeight: 1.7 }}>
              The underlying principles of Executive Asset Intelligence apply across every asset-intensive industry. Every engagement is customized to the client's operational environment, regulatory requirements, and organizational priorities.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem" }}>
            {["Healthcare", "Manufacturing", "Education", "Utilities & Energy", "Logistics & Distribution", "Construction", "Government & Public Sector"].map((industry, i) => (
              <span key={i} onClick={() => navigate("/industries")} style={{ background: C.glass, backdropFilter: "blur(6px)", border: `1px solid ${C.glassBorder}`, borderRadius: 20, padding: "0.6rem 1.25rem", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.silver, cursor: "pointer", transition: "border-color 0.3s" }}>
                {industry}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FUTURE: EXECUTIVE DASHBOARD
          ═══════════════════════════════════════════════════════════════════════ */}
      <Section id="dashboard-preview">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ background: "rgba(26,34,48,0.5)", border: `1px solid ${C.glassBorder}`, borderRadius: 8, padding: "3rem", textAlign: "center" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "1rem" }}>Coming Soon</p>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>Executive Intelligence Dashboard</h3>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.95rem", lineHeight: 1.8, maxWidth: 600, margin: "0 auto 1.5rem" }}>A dedicated executive dashboard providing real-time visibility into asset verification progress, recoverable capital identification, governance maturity scoring, and strategic recommendations — accessible to authorized leadership at any time.</p>
            <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
              {["Live Progress Tracking", "Capital Recovery Metrics", "Governance Scoring", "Board-Ready Reports"].map((item, i) => (
                <span key={i} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: C.gold, fontWeight: 500 }}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CLOSING CTA
          ═══════════════════════════════════════════════════════════════════════ */}
      <Section id="about-cta">
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "5rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1.5rem" }}>
            Begin the Conversation
          </h2>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 650, margin: "0 auto 2.5rem" }}>
            We invite you to explore how Legacy Asset Intelligence can help your organization strengthen governance, improve financial visibility, and create lasting accountability for physical assets. Every partnership begins with a conversation about the challenges within your organization.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/contact")}
              style={{ background: C.gold, color: "#0B0F13", border: "none", padding: "0.9rem 2.25rem", borderRadius: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", transition: "transform 0.16s ease-out" }}
            >
              Schedule Executive Assessment
            </button>
            <button
              onClick={() => navigate("/services")}
              style={{ background: "transparent", color: C.gold, border: `1px solid ${C.goldBorder}`, padding: "0.9rem 2.25rem", borderRadius: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 500, cursor: "pointer" }}
            >
              Explore Our Methodology
            </button>
          </div>
        </div>
      </Section>

      {/* Footer spacer */}
      <div style={{ height: "4rem" }} />
    </div>
  );
}
