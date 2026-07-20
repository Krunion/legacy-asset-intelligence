import { Link } from "wouter";
import { COLORS } from "@shared/colors";

const C = COLORS;

const footerLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Industries", path: "/industries" },
  { label: "Team", path: "/team" },
  { label: "Insights", path: "/insights" },
  { label: "Resources", path: "/resources" },
  { label: "FAQ", path: "/faq" },
  { label: "Careers", path: "/careers" },
  { label: "Contact", path: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms of Use", path: "/terms" },
];

export default function SiteFooter() {
  return (
    <footer
      aria-label="Site footer"
      style={{
        background: "#0B0F13",
        borderTop: `1px solid ${C.border}`,
        padding: "3rem 2rem 2rem",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Navigation Links */}
        <nav aria-label="Footer navigation" style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.25rem" }}>
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                style={{
                  color: C.silver,
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${C.border}`, marginBottom: "1.5rem" }} />

        {/* Bottom row */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: C.textMuted, margin: 0 }}>
            &copy; {new Date().getFullYear()} Legacy Asset Intelligence. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.25rem" }}>
            {legalLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                style={{
                  color: C.textMuted,
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.75rem",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        footer a:hover { color: #C9A84C !important; }
        footer a:focus-visible {
          outline: 2px solid #C9A84C;
          outline-offset: 2px;
          border-radius: 2px;
        }
      `}</style>
    </footer>
  );
}
