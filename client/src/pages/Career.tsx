import PageLayout from "@/components/PageLayout";
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
    { title: "Competitive Compensation", description: "Industry-leading salaries with performance bonuses" },
    { title: "Health Benefits", description: "Comprehensive medical, dental, and vision coverage" },
    { title: "Professional Development", description: "Tuition reimbursement and certification programs" },
    { title: "Flexible Work", description: "Remote options and flexible schedules" },
    { title: "Career Growth", description: "Clear advancement paths and mentorship programs" },
    { title: "Meaningful Impact", description: "Help enterprises recover millions in hidden capital" }
  ];

  const handleApply = (jobTitle: string) => {
    const subject = encodeURIComponent(`Application for ${jobTitle}`);
    const body = encodeURIComponent(`Dear Hiring Team,\n\nI am writing to express my interest in the ${jobTitle} position at Legacy Asset Intelligence.\n\n[Please attach your resume and cover letter]\n\nBest regards,`);
    window.location.href = `mailto:careers@legacyassetintelligence.com?subject=${subject}&body=${body}`;
  };

  return (
    <PageLayout
      heroTitle="Join Our Team"
      heroSubtitle="Help enterprises recover millions in hidden capital and build sustainable asset governance"
      ctaTitle="Ready to Make an Impact?"
      ctaDescription="Send your resume to careers@legacyassetintelligence.com"
      ctaButtonText="Contact Us"
    >
      {/* Why Join LAI */}
      <div style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: C.text, marginBottom: "1rem", borderLeft: `3px solid ${C.gold}`, paddingLeft: "1rem" }}>
          Why Legacy Asset Intelligence?
        </h2>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: C.textMuted, lineHeight: 1.8, marginBottom: "2rem", maxWidth: 800 }}>
          We're solving one of the most overlooked financial problems in enterprise operations. Our team works on high-impact projects that directly affect client bottom lines. We value expertise, innovation, and a commitment to excellence.
        </p>

        {/* Benefits Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
          {benefits.map((benefit, i) => (
            <div key={i} style={{ padding: "1.25rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6 }}>
              <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: C.text, marginBottom: "0.4rem" }}>
                {benefit.title}
              </h3>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.textMuted, margin: 0, lineHeight: 1.5 }}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Open Positions */}
      <div style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: C.text, marginBottom: "2rem", borderLeft: `3px solid ${C.gold}`, paddingLeft: "1rem" }}>
          Open Positions
        </h2>

        <div style={{ display: "grid", gap: "1rem" }}>
          {openings.map((job, i) => (
            <div key={i} style={{ 
              padding: "1.5rem", 
              background: C.slate, 
              border: `1px solid ${C.border}`, 
              borderRadius: 8, 
              transition: "border-color 0.3s ease" 
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.75rem" }}>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: C.text, margin: 0, marginBottom: "0.25rem" }}>
                    {job.title}
                  </h3>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: C.textMuted, margin: 0 }}>
                    {job.department} · {job.level}
                  </p>
                </div>
                <button
                  onClick={() => handleApply(job.title)}
                  style={{ background: C.gold, color: C.charcoal, padding: "0.4rem 0.8rem", borderRadius: 4, fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap", border: "none" }}
                >
                  Apply Now
                </button>
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: C.silver, lineHeight: 1.6, marginBottom: "1rem" }}>
                {job.description}
              </p>
              <div>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: C.textMuted, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Key Requirements
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {job.requirements.map((req, j) => (
                    <li key={j} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.silver, marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ color: C.gold, fontSize: "0.6rem" }}>●</span> {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Culture Section */}
      <div style={{ padding: "2.5rem", background: C.goldMuted, borderRadius: 8, border: `1px solid rgba(201,168,76,0.2)` }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>
          Our Culture
        </h2>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: C.silver, lineHeight: 1.8, marginBottom: "1rem" }}>
          We believe in building a team of experts who are passionate about solving complex problems. Our culture emphasizes continuous learning, collaboration, and delivering exceptional results for our clients. We're committed to diversity, inclusion, and creating an environment where every team member can thrive.
        </p>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: C.silver, lineHeight: 1.8, margin: 0 }}>
          Whether you're a seasoned consultant, a technical expert, or someone looking to grow your career in enterprise asset management, we'd love to hear from you.
        </p>
      </div>
    </PageLayout>
  );
}
