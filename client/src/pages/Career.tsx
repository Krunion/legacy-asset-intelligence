import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { COLORS } from "@shared/colors";

const C = COLORS;

export default function Career() {
  const openings = [
    {
      title: "Senior Asset Management Consultant",
      department: "Consulting",
      level: "Senior",
      description: "Lead enterprise asset recovery engagements for Fortune 500 clients. Design governance frameworks and oversee multi-million dollar capital recovery initiatives.",
      requirements: [
        "10+ years in asset management, fixed assets, or enterprise consulting",
        "Experience with SAP, Oracle, or similar ERP systems",
        "Track record of successful large-scale implementations",
        "MBA or equivalent experience preferred"
      ]
    },
    {
      title: "Asset Verification Specialist",
      department: "Operations",
      level: "Mid-Level",
      description: "Conduct wall-to-wall physical asset inventories across client facilities. Lead tagging, reconciliation, and data validation activities.",
      requirements: [
        "5+ years in asset verification, inventory management, or audit",
        "Experience with RFID, barcode, or QR code systems",
        "Strong attention to detail and project management skills",
        "Ability to travel to client sites (25-30% travel)"
      ]
    },
    {
      title: "Technology Integration Engineer",
      department: "Technology",
      level: "Mid-Level",
      description: "Design and implement asset management platforms. Integrate client ERP systems with modern asset tracking solutions.",
      requirements: [
        "5+ years in systems integration or enterprise software implementation",
        "Experience with asset management platforms (SAP, Oracle, Infor, etc.)",
        "Strong SQL and data migration experience",
        "Experience with API integrations and ETL processes"
      ]
    },
    {
      title: "Business Development Manager",
      department: "Sales & Marketing",
      level: "Mid-Level",
      description: "Identify and pursue new enterprise client opportunities. Build relationships with C-suite executives in target industries.",
      requirements: [
        "7+ years in enterprise software sales or consulting sales",
        "Proven track record of closing 6-7 figure deals",
        "Experience selling to healthcare, manufacturing, or government sectors",
        "Strong executive presence and communication skills"
      ]
    },
    {
      title: "Data Analyst",
      department: "Analytics",
      level: "Entry-Level",
      description: "Analyze asset portfolio data and create executive dashboards. Support capital recovery opportunity modeling and ROI calculations.",
      requirements: [
        "3+ years in data analysis or business intelligence",
        "Proficiency in SQL, Python, and Tableau or Power BI",
        "Strong analytical and problem-solving skills",
        "Bachelor's degree in data science, analytics, or related field"
      ]
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      level: "Mid-Level",
      description: "Manage ongoing relationships with enterprise clients. Ensure successful adoption of asset management platforms and governance frameworks.",
      requirements: [
        "5+ years in customer success or account management",
        "Experience managing enterprise software implementations",
        "Strong communication and stakeholder management skills",
        "Experience with SaaS or enterprise software preferred"
      ]
    }
  ];

  const benefits = [
    { icon: "💰", title: "Competitive Compensation", description: "Industry-leading salaries with performance bonuses" },
    { icon: "🏥", title: "Health Benefits", description: "Comprehensive medical, dental, and vision coverage" },
    { icon: "🎓", title: "Professional Development", description: "Tuition reimbursement and certification programs" },
    { icon: "🏢", title: "Flexible Work", description: "Remote options and flexible schedules" },
    { icon: "🎯", title: "Career Growth", description: "Clear advancement paths and mentorship programs" },
    { icon: "🌍", title: "Meaningful Impact", description: "Help enterprises recover millions in hidden capital" }
  ];

  return (
    <PageLayout
      heroTitle="Join Our Team"
      heroSubtitle="Help enterprises recover millions in hidden capital and build sustainable asset governance"
      ctaTitle="Ready to Make an Impact?"
      ctaDescription="Apply now or send your resume to careers@legacyassetintelligence.com"
      ctaButtonText="View All Openings"
    >
      {/* Why Join LAI */}
      <div style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: C.charcoal, marginBottom: "1.5rem", textAlign: "center" }}>
          Why Join Legacy Asset Intelligence?
        </h2>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: C.textDark, lineHeight: 1.8, marginBottom: "2rem", textAlign: "center", maxWidth: "800px", margin: "0 auto 2rem" }}>
          At LAI, we're solving one of the most overlooked financial problems in enterprise operations. Our team members work on high-impact projects that directly affect client bottom lines. We value expertise, innovation, and a commitment to excellence.
        </p>

        {/* Benefits Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          {benefits.map((benefit, i) => (
            <div key={i} style={{ padding: "1.5rem", background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{benefit.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: C.charcoal, marginBottom: "0.5rem" }}>
                {benefit.title}
              </h3>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: C.textMuted, margin: 0 }}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Open Positions */}
      <div style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: C.charcoal, marginBottom: "2rem", textAlign: "center" }}>
          Open Positions
        </h2>

        <div style={{ display: "grid", gap: "1rem" }}>
          {openings.map((job, i) => (
            <div key={i} style={{ padding: "1.5rem", background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(15,20,25,0.12)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.75rem" }}>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: C.charcoal, margin: 0, marginBottom: "0.25rem" }}>
                    {job.title}
                  </h3>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.textMuted, margin: 0 }}>
                    {job.department} • {job.level}
                  </p>
                </div>
                <span style={{ background: C.gold, color: C.charcoal, padding: "0.4rem 0.8rem", borderRadius: 4, fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                  Apply Now
                </span>
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: C.textDark, lineHeight: 1.6, marginBottom: "1rem" }}>
                {job.description}
              </p>
              <div>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: C.charcoal, marginBottom: "0.5rem" }}>
                  Key Requirements:
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {job.requirements.map((req, j) => (
                    <li key={j} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.textDark, marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ color: C.gold, fontWeight: 700 }}>✓</span> {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Culture Section */}
      <div style={{ padding: "2rem", background: "rgba(212, 175, 55, 0.08)", borderRadius: 12, border: `1px solid ${C.border}` }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: C.charcoal, marginBottom: "1rem" }}>
          Our Culture
        </h2>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: C.textDark, lineHeight: 1.8, marginBottom: "1rem" }}>
          We believe in building a team of experts who are passionate about solving complex problems. Our culture emphasizes continuous learning, collaboration, and delivering exceptional results for our clients. We're committed to diversity, inclusion, and creating an environment where every team member can thrive.
        </p>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: C.textDark, lineHeight: 1.8, margin: 0 }}>
          Whether you're a seasoned consultant, a technical expert, or someone looking to grow your career in enterprise asset management, we'd love to hear from you.
        </p>
      </div>
    </PageLayout>
  );
}
