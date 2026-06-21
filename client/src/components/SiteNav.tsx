import { useLocation } from "wouter";
import { useState } from "react";

const C = {
  charcoal: "#0F1419",
  emerald: "#1B4D3E",
  gold: "#D4C5B0",
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
    <nav style={{ background: "#0F1419", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100 }}>
      {/* Top row: Logo + Name + Toggle */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo and Name Container */}
        <button 
          onClick={() => navigate("/")} 
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0", fontWeight: 700, color: C.charcoal, display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0, flex: 1, justifyContent: "center" }}
        >
          <img src="/manus-storage/LegacyAssetIntelligenceLogo_Small_9879caa1.png" alt="LAI Logo" style={{ height: 60, width: "auto", objectFit: "contain", imageRendering: "crisp-edges" }} />
          <img src="/manus-storage/LegacyAssetIntelligenceLogo_Medium_8c0ade6d.png" alt="Legacy Asset Intelligence" style={{ height: 50, width: "auto", objectFit: "contain", imageRendering: "crisp-edges" }} />
        </button>

        {/* Toggle Button */}
        <button
          onClick={() => setNavOpen(!navOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.5rem",
            color: "#D4C5B0",
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
                  color: location === link.path ? "#D4C5B0" : "#D4C5B0",
                  fontWeight: location === link.path ? 600 : 500,
                  fontSize: "0.9rem",
                  transition: "all 0.2s",
                  opacity: location === link.path ? 1 : 0.8,
                  borderBottom: location === link.path ? `2px solid #D4C5B0` : "2px solid transparent",
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
