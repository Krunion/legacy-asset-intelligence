import PageLayout from "@/components/PageLayout";
import { COLORS } from "@shared/colors";

const C = COLORS;

export default function Team() {
  const team = [
    {
      name: "Kevin Runion",
      title: "Founder & Chief Executive Officer (CEO)",
      bio: "Visionary leader with extensive expertise in enterprise asset management and operational performance. Kevin founded Legacy Asset Intelligence after witnessing how executives are forced to make critical business decisions based on inaccurate or outdated asset information. His methodology integrates executive assessment, physical verification, technology enablement, and sustainable governance into a single comprehensive framework.",
      expertise: ["Asset Strategy", "Enterprise Operations", "Organizational Performance"]
    },
    {
      name: "Chris Haynes",
      title: "Co-Founder & Chief Operations Officer (COO)",
      bio: "Operational excellence expert responsible for scaling LAI's delivery capabilities and ensuring consistent quality across all engagements. Chris brings deep expertise in process optimization, field team management, and measurable accountability.",
      expertise: ["Operations Management", "Process Optimization", "Team Leadership"]
    },
    {
      name: "Jimmy Smith",
      title: "Chief Strategy Officer (CSO)",
      bio: "Strategic planning leader guiding LAI's long-term business direction, market positioning, and growth initiatives. Jimmy brings analytical rigor and forward-thinking vision to ensure the organization remains ahead of industry trends and client needs.",
      expertise: ["Strategic Planning", "Market Analysis", "Business Development"]
    },
    {
      name: "Andrea Haynes",
      title: "Chief Revenue Officer (CRO)",
      bio: "Strategic business development leader driving LAI's market expansion and client acquisition. Andrea's expertise in enterprise sales and relationship management ensures that every prospective engagement is approached with professionalism and transparency.",
      expertise: ["Business Development", "Enterprise Sales", "Strategic Partnerships"]
    },
    {
      name: "Darryl Fedric",
      title: "Chief Experience Officer (CXO)",
      bio: "Client experience leader ensuring exceptional engagement quality from initial contact through long-term partnership. Darryl oversees client success initiatives and ensures every interaction reflects the professionalism and attention to detail that defines Legacy Asset Intelligence.",
      expertise: ["Client Experience", "Engagement Quality", "Relationship Management"]
    },
    {
      name: "Jessica Runion",
      title: "Chief Training Officer (CTO)",
      bio: "Training leader responsible for developing LAI's training programs, certification curricula, and team capability development. Jessica ensures that both internal teams and client organizations are equipped with the knowledge and skills needed for sustainable asset governance.",
      expertise: ["Training Development", "Technology Implementation", "Capability Building"]
    },
    {
      name: "Christine Smith",
      title: "Chief Projects Officer (CPO)",
      bio: "Project delivery leader overseeing the execution and coordination of all client engagements. Christine ensures that every project is delivered on time, within scope, and with the quality standards that LAI's methodology demands.",
      expertise: ["Project Management", "Delivery Coordination", "Quality Assurance"]
    }
  ];

  return (
    <PageLayout
      heroTitle="Leadership"
      heroSubtitle="Experienced professionals dedicated to helping organizations identify and address asset record challenges"
      ctaTitle="Ready to Meet Our Team?"
      ctaDescription="Schedule a consultation with our experts to discuss your asset intelligence needs."
      ctaButtonText="Schedule a Consultation"
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
        {team.map((member, i) => (
          <div key={i} style={{ 
            padding: "2rem", 
            background: C.slate, 
            border: `1px solid ${C.border}`, 
            borderRadius: 8,
            transition: "border-color 0.3s ease"
          }}>
            {/* Initials circle */}
            <div style={{ 
              width: "64px", 
              height: "64px", 
              background: C.goldMuted, 
              border: `1px solid rgba(201,168,76,0.3)`,
              borderRadius: "50%", 
              margin: "0 auto 1.25rem", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              color: C.gold, 
              fontSize: "1.25rem", 
              fontWeight: "bold",
              fontFamily: "'Playfair Display', serif"
            }}>
              {member.name.split(" ").map(n => n[0]).join("")}
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: C.text, marginBottom: "0.3rem", textAlign: "center" }}>
              {member.name}
            </h3>
            <p style={{ color: C.gold, fontWeight: 600, fontSize: "0.8rem", marginBottom: "1rem", textAlign: "center", fontFamily: "'Source Sans 3', sans-serif" }}>
              {member.title}
            </p>
            <p style={{ color: C.textMuted, fontSize: "0.88rem", lineHeight: 1.65, marginBottom: "1.25rem", fontFamily: "'Source Sans 3', sans-serif" }}>
              {member.bio}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", justifyContent: "center" }}>
              {member.expertise.map((skill, j) => (
                <span key={j} style={{ 
                  padding: "0.25rem 0.7rem", 
                  background: C.goldMuted, 
                  color: C.gold, 
                  borderRadius: 3, 
                  fontSize: "0.7rem", 
                  fontWeight: 600,
                  fontFamily: "'Source Sans 3', sans-serif"
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Commitment Section */}
      <div style={{ 
        background: C.goldMuted, 
        padding: "2.5rem", 
        borderRadius: 8, 
        border: `1px solid rgba(201,168,76,0.2)` 
      }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>
          Our Commitment
        </h2>
        <p style={{ color: C.silver, fontSize: "0.95rem", lineHeight: 1.8, fontFamily: "'Source Sans 3', sans-serif" }}>
          Every member of the Legacy Asset Intelligence team brings a commitment to thoroughness, accountability, and measurable outcomes. We combine deep industry expertise with enterprise-grade technology to help organizations identify ghost assets, recover hidden capital, and establish sustainable governance. Our success is measured by yours — when your organization achieves lasting financial visibility and asset accountability, we have fulfilled our purpose.
        </p>
      </div>
    </PageLayout>
  );
}
