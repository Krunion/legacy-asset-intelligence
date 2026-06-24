import PageLayout from "@/components/PageLayout";
import { COLORS } from "@shared/colors";

const C = COLORS;

export default function Team() {
  const team = [
    {
      name: "Kevin Runion",
      title: "Founder & Chief Executive Officer (CEO)",
      bio: "Visionary leader with extensive expertise in enterprise asset management and capital recovery. Kevin founded Legacy Asset Intelligence to help organizations unlock millions in hidden capital through intelligent asset verification and governance.",
      expertise: ["Asset Strategy", "Enterprise Operations", "Capital Recovery"]
    },
    {
      name: "Chris Haynes",
      title: "Co-Founder & Chief Operations Officer (COO)",
      bio: "Operational excellence expert responsible for scaling LAI's delivery capabilities and ensuring consistent quality across all engagements. Chris brings deep expertise in process optimization and team leadership.",
      expertise: ["Operations Management", "Process Optimization", "Team Leadership"]
    },
    {
      name: "Andrea Haynes",
      title: "Chief Revenue Officer (CRO)",
      bio: "Strategic business development leader driving LAI's market expansion and client acquisition. Andrea's expertise in enterprise sales and relationship management has been instrumental in LAI's growth trajectory.",
      expertise: ["Business Development", "Enterprise Sales", "Strategic Partnerships"]
    },
    {
      name: "Jessica Runion",
      title: "Chief Experience Officer (CXO)",
      bio: "Customer-focused leader ensuring exceptional client experiences and satisfaction. Jessica oversees client success initiatives, implementation strategies, and long-term relationship management.",
      expertise: ["Client Relations", "Implementation", "Change Management"]
    }
  ];

  return (
    <PageLayout
      heroTitle="Our Leadership Team"
      heroSubtitle="Experienced professionals dedicated to helping organizations recover millions in hidden capital"
      ctaTitle="Ready to Meet Our Team?"
      ctaDescription="Schedule a consultation with our experts to discuss your asset intelligence needs."
      ctaButtonText="Schedule a Consultation"
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
        {team.map((member, i) => (
          <div key={i} style={{ padding: "2rem", background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 2px 8px rgba(15,20,25,0.05)", textAlign: "center" }}>
            <div style={{ width: "80px", height: "80px", background: C.gold, borderRadius: "50%", margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center", color: C.charcoal, fontSize: "2rem", fontWeight: "bold" }}>
              {member.name.split(" ").map(n => n[0]).join("")}
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: C.charcoal, marginBottom: "0.3rem" }}>
              {member.name}
            </h3>
            <p style={{ color: C.gold, fontWeight: 600, fontSize: "0.9rem", marginBottom: "1rem" }}>
              {member.title}
            </p>
            <p style={{ color: C.textDark, fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1rem" }}>
              {member.bio}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
              {member.expertise.map((skill, j) => (
                <span key={j} style={{ padding: "0.3rem 0.8rem", background: "rgba(212,175,55,0.1)", color: C.gold, borderRadius: 4, fontSize: "0.75rem", fontWeight: 600 }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(212,175,55,0.15)", padding: "2rem", borderRadius: 8, marginTop: "3rem", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1rem", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
          Our Commitment
        </h2>
        <p style={{ color: "#E8E9EB", fontSize: "0.95rem", lineHeight: 1.8, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
          Every member of the Legacy Asset Intelligence team is committed to delivering exceptional results. We combine deep industry expertise with cutting-edge technology to help organizations discover and recover millions in hidden capital. Our success is measured by your success—when you recover capital and establish sustainable asset governance, we've done our job.
        </p>
      </div>
    </PageLayout>
  );
}
