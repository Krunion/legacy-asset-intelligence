import PageLayout from "@/components/PageLayout";
import { COLORS } from "@shared/colors";

const C = COLORS;

interface TeamMember {
  name: string;
  title: string;
  bio: string[];
  photo?: string;
}

const team: TeamMember[] = [
  {
    name: "Kevin Runion",
    title: "Founder & Chief Executive Officer",
    photo: "/manus-storage/Kevin_d3238512.webp",
    bio: [
      "Kevin Runion is a U.S. Army veteran, experienced operations leader, and the Founder and Chief Executive Officer of Legacy Asset Intelligence. His professional background combines military logistics, asset accountability, healthcare operations, process improvement, organizational leadership, and business management.",
      "During his 12 years of service in the United States Army, Kevin served as an M1A1 Armor Crewman and an Automated Logistics Supervisor. His military career provided extensive experience in equipment readiness, inventory control, supply-chain coordination, maintenance accountability, personnel leadership, and mission-focused operations. Working in environments where resources and equipment had to remain continuously prepared shaped his disciplined approach to accountability and operational performance.",
      "Following his military service, Kevin transitioned into healthcare operations management, where he has led teams and supported the improvement of complex clinical and administrative functions. His work has helped strengthen departmental productivity, expand service capabilities, improve financial processes, and create greater accountability across daily operations. This experience reinforced his ability to identify operational gaps, develop practical solutions, and guide organizations through measurable growth and improvement.",
      "Kevin holds a Bachelor of Science in Psychology and a Master of Science in Organizational Leadership and Applied Business Management, which he completed with a 4.0 GPA. He is currently pursuing a Doctor of Business Administration to further advance his expertise in executive leadership, organizational strategy, operational performance, and sustainable business growth.",
      "Kevin founded Legacy Asset Intelligence to help organizations close the gap between their financial records, physical assets, operational processes, and accountability systems. Drawing from his military logistics background, healthcare leadership experience, and advanced business education, he developed LAI's structured methodology to help clients uncover hidden capital, eliminate waste, strengthen governance, and transform asset data into actionable business intelligence.",
    ],
  },
  {
    name: "Chris Haynes",
    title: "Co-Founder & Chief Operating Officer",
    photo: "/manus-storage/Chris_17ef5e4d.png",
    bio: [
      "Chris Haynes brings more than 20 years of experience spanning operations management, industrial services, transportation, logistics, and safety-focused environments. He began his career in the offshore oil and gas drilling industry, where he gained firsthand experience working within complex, production-driven operations that demand reliability, precision, and strict adherence to safety standards.",
      "For the past five years, Chris has served as an Operations Manager overseeing fire and life-safety services, including the sale, servicing, inspection, and operational readiness of critical safety equipment. His responsibilities include coordinating daily operations, supporting employees and customers, maintaining service quality, and ensuring work is completed efficiently and in accordance with applicable requirements.",
      "Chris also brings more than two decades of transportation and logistics experience through his work with UPS. In this role, he supports the movement of shipped goods by loading and unloading aircraft, operating specialized ground equipment, and contributing to time-sensitive distribution operations.",
      "As Co-Founder and Chief Operating Officer of Legacy Asset Intelligence, Chris applies his extensive operational background to guide service delivery, workforce coordination, quality assurance, logistics planning, and the development of scalable processes. His practical leadership and deep understanding of equipment-intensive operations help ensure that LAI delivers reliable, accountable, and results-driven solutions for every client.",
    ],
  },
  {
    name: "Darryl Fedric",
    title: "Chief Experience Officer",
    bio: [
      "Darryl Fedric brings more than 14 years of experience in emergency services, safety compliance, project management, operational risk assessment, and investigations. His career includes service as a firefighter and paramedic lieutenant, flight paramedic, critical care paramedic, and emergency room technician. These demanding roles required sound judgment, effective communication, attention to detail, and the ability to make critical decisions in highly regulated and rapidly changing environments.",
      "Darryl later served as a Chief Safety Officer and Project Manager, providing safety and operational oversight for more than 400 personnel across multiple worksites. His responsibilities included conducting safety inspections and job hazard analyses, leading safety briefings, enforcing OSHA- and CDC-aligned standards, supporting workforce accountability, and identifying risks before they disrupted operations. He holds an OSHA 30 certification, a Construction Project Management Certificate from Columbia University, and multiple advanced emergency medical credentials.",
      "His background as a private investigator further strengthens his ability to evaluate information, identify inconsistencies, document findings, and handle sensitive matters with professionalism and discretion. As Chief Experience Officer for Legacy Asset Intelligence, Darryl applies his investigative mindset, operational leadership, and commitment to accountability to strengthen client relationships, maintain service quality, and ensure clients receive a professional and consistent experience throughout every phase of engagement.",
    ],
  },
  {
    name: "Andrea Haynes",
    title: "Chief Revenue Officer",
    photo: "/manus-storage/Andrea_5d7d2a37.png",
    bio: [
      "Andrea Haynes brings more than 25 years of experience in client service, team leadership, business operations, and revenue-focused environments. She began her career as a professional hairstylist, where she developed a strong foundation in customer relationships, service excellence, and business development. Her leadership abilities quickly led her into management, first as an Assistant Manager and later as a Manager responsible for supporting employees, maintaining service standards, and overseeing day-to-day operations.",
      "For the past decade, Andrea has worked within the healthcare revenue cycle management industry, gaining valuable experience in the processes that support financial performance, reimbursement, account resolution, and the overall patient financial experience. She is a Certified Revenue Cycle Representative (CRCR) through the Healthcare Financial Management Association (HFMA), demonstrating her knowledge of healthcare revenue cycle practices and financial operations.",
      "As Chief Revenue Officer of Legacy Asset Intelligence, Andrea helps guide revenue strategy, client relationship development, market growth, and customer retention. Her combination of frontline service experience, operational leadership, and healthcare revenue cycle knowledge allows her to approach growth with both financial discipline and a strong understanding of the client experience.",
    ],
  },
  {
    name: "Christine Smith",
    title: "Chief Projects Officer",
    bio: [
      "Bio coming soon.",
    ],
  },
  {
    name: "Jimmy Smith",
    title: "Chief Strategy Officer",
    bio: [
      "Bio coming soon.",
    ],
  },
  {
    name: "Jessica Runion",
    title: "Chief Training Officer",
    photo: "/manus-storage/Jess_771c8cf2.png",
    bio: [
      "Jessica Runion brings nearly two decades of experience in education, instructional development, student engagement, and academic leadership. Throughout her career, she has taught in early childhood and K\u20138 educational settings and holds English as a Second Language certifications for grades K\u201312. Her broad classroom experience has strengthened her ability to communicate complex information clearly, adapt instruction for different learning needs, and create structured learning environments that support measurable development.",
      "Jessica holds a Master of Education and is completing the final two courses of her Education Specialist (Ed.S.) degree in Educational Leadership. She also has several years of leadership experience serving as an administrative designee, where she has supported school operations, staff coordination, instructional oversight, and administrative decision-making.",
      "As Chief Training Officer of Legacy Asset Intelligence, Jessica leads the development and continuous improvement of the company's training programs. She oversees instructional design, employee onboarding, methodology training, competency development, and learning-quality standards to ensure LAI professionals are prepared to deliver consistent, accurate, and high-quality services. Her educational expertise helps transform LAI's specialized processes into practical, engaging, and scalable learning experiences.",
    ],
  },
];

function InitialsCircle({ name }: { name: string }) {
  const initials = name.split(" ").map(n => n[0]).join("");
  return (
    <div style={{
      width: 120,
      height: 120,
      background: C.goldMuted,
      border: `2px solid rgba(201,168,76,0.4)`,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: C.gold,
      fontSize: "2rem",
      fontWeight: "bold",
      fontFamily: "'Playfair Display', serif",
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

export default function Team() {
  return (
    <PageLayout
      heroTitle="Leadership"
      heroSubtitle="Experienced professionals dedicated to helping organizations identify and address asset record challenges"
      ctaTitle="Ready to Meet Our Team?"
      ctaDescription="Schedule a consultation with our experts to discuss your asset intelligence needs."
      ctaButtonText="Schedule a Consultation"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "3rem", marginBottom: "4rem" }}>
        {team.map((member, i) => (
          <article key={i} style={{
            padding: "2.5rem",
            background: C.slate,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
          }}>
            {/* Header: Photo + Name/Title */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.name}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `2px solid rgba(201,168,76,0.4)`,
                    flexShrink: 0,
                  }}
                />
              ) : (
                <InitialsCircle name={member.name} />
              )}
              <div>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: "0.3rem",
                }}>
                  {member.name}
                </h2>
                <p style={{
                  color: C.gold,
                  fontWeight: 600,
                  fontSize: "1rem",
                  fontFamily: "'Source Sans 3', sans-serif",
                }}>
                  {member.title}
                </p>
              </div>
            </div>

            {/* Bio paragraphs */}
            <div>
              {member.bio.map((paragraph, j) => (
                <p key={j} style={{
                  color: C.silver,
                  fontSize: "0.95rem",
                  lineHeight: 1.8,
                  marginBottom: j < member.bio.length - 1 ? "1rem" : 0,
                  fontFamily: "'Source Sans 3', sans-serif",
                }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
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
