import { useLocation } from "wouter";
import { useState } from "react";

const C = {
  charcoal: "#0F1419",
  emerald: "#1B4D3E",
  gold: "#D4AF37",
  border: "#E5E7EB",
  muted: "#6B7280",
};

interface NavLink {
  label: string;
  path: string;
}

const navLinks: NavLink[] = [
  { label: "Services", path: "/services" },
  { label: "Industries", path: "/industries" },
  { label: "Solutions", path: "/solutions" },
  { label: "Case Studies", path: "/case-studies" },
  { label: "Team", path: "/team" },
  { label: "Blog", path: "/blog" },
  { label: "Resources", path: "/resources" },
  { label: "FAQ", path: "/faq" },
  { label: "Career", path: "/career" },
  { label: "Employee Portal", path: "/employee-portal" },
];

export default function SiteNav() {
  const [location, navigate] = useLocation();
  const [navOpen, setNavOpen] = useState(true);

  return (
    <nav style={{ background: "#D9D9D9", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100 }}>
      {/* Top row: Logo + Name + Toggle */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
        <button 
          onClick={() => navigate("/")} 
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0", fontWeight: 700, color: C.charcoal, display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}
        >
          <div style={{ background: "white", borderRadius: "0.375rem", padding: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663776896878/TfZTrDNPnnG2dF7hgZeTPt/lai-logo-5QXNLUsEDRp3nBVBAMiXK4.webp" alt="LAI Logo" style={{ height: 40, width: 40, objectFit: "contain" }} />
          </div>
        </button>

        {/* Centered Name */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <button 
            onClick={() => navigate("/")} 
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0", fontWeight: 700, color: C.charcoal }}
          >
            <span style={{ fontSize: "1.8rem", fontWeight: 700, color: C.charcoal, fontFamily: "'Playfair Display', serif", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>Legacy Asset Intelligence</span>
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setNavOpen(!navOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.5rem",
            color: C.gold,
            padding: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
          title={navOpen ? "Collapse menu" : "Expand menu"}
        >
          {navOpen ? "−" : "+"}
        </button>
      </div>

      {/* Bottom row: Navigation tabs */}
      {navOpen && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: "0.75rem 2rem", display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", maxWidth: 1400, margin: "0 auto" }}>
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: location === link.path ? C.gold : C.gold,
                fontWeight: location === link.path ? 600 : 500,
                fontSize: "0.9rem",
                transition: "all 0.2s",
                opacity: location === link.path ? 1 : 0.7,
                borderBottom: location === link.path ? `2px solid ${C.gold}` : "2px solid transparent",
                paddingBottom: "0.25rem",
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
