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
  { label: "Home", path: "/" },
  { label: "Team", path: "/team" },
  { label: "FAQ", path: "/faq" },
  { label: "Career", path: "/career" },
  { label: "Employee Portal", path: "/employee-portal" },
  { label: "Contact Us", path: "/contact" },
];

export default function SiteNav() {
  const [location, navigate] = useLocation();
  const [navOpen, setNavOpen] = useState(true);

  return (
    <nav style={{ background: "#0F1419", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100 }}>
      {/* Top row: Logo + Name + Toggle */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "1rem 2rem", display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
        {/* Logo and Name Container */}
        <button 
          onClick={() => navigate("/")} 
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}
        >
          <img 
            src="/manus-storage/pasted_file_yudYZ7_image_transparent_32d3d4e2.png" 
            alt="Legacy Asset Intelligence" 
            style={{ height: 60, width: "auto", objectFit: "contain", imageRendering: "crisp-edges" }}
            onError={(e) => {
              console.error('Logo failed to load:', e);
              e.currentTarget.style.display = 'none';
            }}
            onLoad={() => console.log('Logo loaded successfully')}
          />
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
            position: "absolute",
            right: "2rem",
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
