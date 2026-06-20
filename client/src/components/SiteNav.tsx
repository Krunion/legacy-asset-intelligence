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
    <nav style={{ background: "#D9D9D9", borderBottom: `1px solid ${C.border}`, padding: "1rem 2rem", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button 
          onClick={() => navigate("/")} 
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0", fontWeight: 700, color: C.charcoal, display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <div style={{ background: "white", borderRadius: "0.375rem", padding: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663776896878/TfZTrDNPnnG2dF7hgZeTPt/lai-logo-5QXNLUsEDRp3nBVBAMiXK4.webp" alt="LAI Logo" style={{ height: 36, width: 36, objectFit: "contain" }} />
          </div>
          <span style={{ fontSize: "1.2rem", fontWeight: 700, color: C.charcoal, fontFamily: "'Playfair Display', serif", letterSpacing: "0.5px" }}>Legacy Asset Intelligence</span>
        </button>
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
          }}
          title={navOpen ? "Collapse menu" : "Expand menu"}
        >
          {navOpen ? "−" : "+"}
        </button>
        {navOpen && (
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
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
      </div>
    </nav>
  );
}
