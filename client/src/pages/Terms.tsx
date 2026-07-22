import { usePageMeta } from "@/hooks/usePageMeta";
import PageLayout from "@/components/PageLayout";
import { COLORS } from "@shared/colors";

const C = COLORS;

export default function Terms() {
  usePageMeta({ title: "Terms of Use | Legacy Asset Intelligence", description: "Terms of Use governing your access to and use of the Legacy Asset Intelligence website and services.", canonical: "/terms" });
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
      heroTitle="Terms of Use"
      heroSubtitle="Terms and conditions governing the use of the Legacy Asset Intelligence website"
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <p style={{ ...textStyle, fontStyle: "italic" }}>
          Effective Date: January 15, 2026
        </p>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>1. Acceptance of Terms</h2>
          <p style={textStyle}>
            By accessing and using the Legacy Asset Intelligence ("LAI") website at legacyassetintelligence.com, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use this website.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>2. Use of Website</h2>
          <p style={textStyle}>
            This website is provided for informational purposes only. The content on this website does not constitute professional advice, an audit opinion, a tax opinion, a legal opinion, a financial guarantee, or an assurance of any specific outcome. Information presented is general in nature and should not be relied upon as a substitute for consultation with qualified professionals.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>3. ROI Estimator and Financial Tools</h2>
          <p style={textStyle}>
            The ROI Estimator and any other financial planning tools on this website provide preliminary planning scenarios based on user-provided information and disclosed assumptions. Results are directional estimates only and do not represent:
          </p>
          <ul style={{ ...textStyle, paddingLeft: "1.5rem" }}>
            <li>A quote or proposal for services</li>
            <li>An appraisal or valuation</li>
            <li>An audit opinion or assurance engagement</li>
            <li>A tax opinion or tax advice</li>
            <li>A financial guarantee or assurance of recovery</li>
            <li>A promise of specific results</li>
          </ul>
          <p style={textStyle}>
            Actual outcomes depend on organizational factors, asset conditions, jurisdictional requirements, and other variables that cannot be determined without a formal engagement.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>4. Intellectual Property</h2>
          <p style={textStyle}>
            All content on this website, including text, graphics, logos, methodologies, and software, is the property of Legacy Asset Intelligence or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from this content without prior written permission.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>5. Illustrative Scenarios</h2>
          <p style={textStyle}>
            Any case studies, financial scenarios, or examples presented on this website are illustrative in nature and are intended to demonstrate potential applications of our methodology. They do not represent actual client engagements or guaranteed outcomes unless explicitly stated otherwise with supporting documentation.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>6. Limitation of Liability</h2>
          <p style={textStyle}>
            LAI shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from your use of this website or reliance on any information provided herein. This website is provided "as is" without warranties of any kind, either express or implied.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>7. External Links</h2>
          <p style={textStyle}>
            This website may contain links to third-party websites. LAI is not responsible for the content, privacy practices, or availability of these external sites. Inclusion of a link does not imply endorsement.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>8. Modifications</h2>
          <p style={textStyle}>
            LAI reserves the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting to this page. Your continued use of the website after changes are posted constitutes acceptance of the modified terms.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>9. Governing Law</h2>
          <p style={textStyle}>
            These Terms of Use shall be governed by and construed in accordance with the laws of the State of Tennessee, United States, without regard to conflict of law principles.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>10. Contact</h2>
          <p style={textStyle}>
            For questions about these Terms of Use, please contact us at{" "}
            <a href="mailto:info@legacyassetintelligence.com" style={{ color: C.gold }}>info@legacyassetintelligence.com</a>.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
