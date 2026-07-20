import PageLayout from "@/components/PageLayout";
import { COLORS } from "@shared/colors";

const C = COLORS;

export default function Privacy() {
  const sectionStyle = {
    marginBottom: "2.5rem",
  };

  const headingStyle = {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.2rem",
    fontWeight: 700 as const,
    color: C.text,
    marginBottom: "1rem",
  };

  const textStyle = {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: "0.9rem",
    color: C.textMuted,
    lineHeight: 1.8,
    marginBottom: "1rem",
  };

  return (
    <PageLayout
      heroTitle="Privacy Policy"
      heroSubtitle="How Legacy Asset Intelligence collects, uses, and protects your information"
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <p style={{ ...textStyle, fontStyle: "italic" }}>
          Last updated: July 2025
        </p>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>1. Information We Collect</h2>
          <p style={textStyle}>
            Legacy Asset Intelligence ("LAI," "we," "us," or "our") collects information you voluntarily provide when you:
          </p>
          <ul style={{ ...textStyle, paddingLeft: "1.5rem" }}>
            <li>Submit a contact form or inquiry</li>
            <li>Request an executive briefing or consultation</li>
            <li>Use our ROI Estimator tool</li>
            <li>Subscribe to communications</li>
            <li>Apply for employment opportunities</li>
          </ul>
          <p style={textStyle}>
            This information may include your name, email address, phone number, company name, job title, and the content of your message or inquiry.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>2. Automatically Collected Information</h2>
          <p style={textStyle}>
            When you visit our website, we may automatically collect certain technical information, including:
          </p>
          <ul style={{ ...textStyle, paddingLeft: "1.5rem" }}>
            <li>IP address and approximate geographic location</li>
            <li>Browser type and version</li>
            <li>Device type and operating system</li>
            <li>Pages visited, time spent, and navigation patterns</li>
            <li>Referring website or source</li>
          </ul>
          <p style={textStyle}>
            This information is collected through cookies, analytics tools, and similar technologies as described in our Cookie and Tracking Notice below.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>3. How We Use Your Information</h2>
          <p style={textStyle}>
            We use the information we collect to:
          </p>
          <ul style={{ ...textStyle, paddingLeft: "1.5rem" }}>
            <li>Respond to your inquiries and provide requested information</li>
            <li>Deliver services you have engaged us to provide</li>
            <li>Improve our website, services, and user experience</li>
            <li>Send relevant communications (with your consent)</li>
            <li>Comply with legal obligations</li>
            <li>Protect against fraud and unauthorized access</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>4. Service Providers and Third Parties</h2>
          <p style={textStyle}>
            Your information may be processed by service providers acting on LAI's behalf. These service providers include:
          </p>
          <ul style={{ ...textStyle, paddingLeft: "1.5rem" }}>
            <li><strong>Analytics providers</strong> — for website traffic analysis and user behavior insights</li>
            <li><strong>CRM platforms</strong> — for managing client relationships and communications</li>
            <li><strong>Hosting and infrastructure providers</strong> — for website hosting and data storage</li>
            <li><strong>Authentication services</strong> — for secure access to protected areas</li>
            <li><strong>Email service providers</strong> — for delivering communications</li>
          </ul>
          <p style={textStyle}>
            We do not sell your personal information to third parties. Service providers are contractually obligated to use your information only for the purposes of providing services to LAI.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>5. Data Retention</h2>
          <p style={textStyle}>
            We retain your information for as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, resolve disputes, and enforce our agreements. Contact form submissions and inquiry data are typically retained for up to 3 years unless you request earlier deletion.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>6. Your Rights</h2>
          <p style={textStyle}>
            Depending on your jurisdiction, you may have the right to:
          </p>
          <ul style={{ ...textStyle, paddingLeft: "1.5rem" }}>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Object to or restrict certain processing activities</li>
            <li>Withdraw consent where processing is based on consent</li>
          </ul>
          <p style={textStyle}>
            To exercise any of these rights, please contact us at{" "}
            <a href="mailto:privacy@legacyassetintelligence.com" style={{ color: C.gold }}>privacy@legacyassetintelligence.com</a>.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>7. Data Security</h2>
          <p style={textStyle}>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>8. Cookie and Tracking Notice</h2>
          <p style={textStyle}>
            Our website uses cookies and similar tracking technologies to improve your experience and analyze website usage. These include:
          </p>
          <ul style={{ ...textStyle, paddingLeft: "1.5rem" }}>
            <li><strong>Essential cookies</strong> — required for basic website functionality</li>
            <li><strong>Analytics cookies</strong> — help us understand how visitors interact with our website</li>
            <li><strong>Marketing cookies</strong> — used to deliver relevant content and measure campaign effectiveness</li>
          </ul>
          <p style={textStyle}>
            You can manage your cookie preferences through your browser settings. Disabling certain cookies may affect website functionality.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>9. Changes to This Policy</h2>
          <p style={textStyle}>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>10. Contact Us</h2>
          <p style={textStyle}>
            If you have questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <p style={textStyle}>
            Legacy Asset Intelligence<br />
            Email:{" "}
            <a href="mailto:privacy@legacyassetintelligence.com" style={{ color: C.gold }}>privacy@legacyassetintelligence.com</a><br />
            Website:{" "}
            <a href="/contact" style={{ color: C.gold }}>legacyassetintelligence.com/contact</a>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
