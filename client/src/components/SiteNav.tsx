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
    <nav style={{ background: "#F5F5F5", borderBottom: `1px solid ${C.border}`, padding: "1rem 2rem", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button 
          onClick={() => navigate("/")} 
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0", fontWeight: 700, color: C.charcoal, display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <defs>
              <linearGradient id="laiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#B8860B" />
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="32" height="32" rx="6" fill="url(#laiGradient)" opacity="0.95" />
            <circle cx="6" cy="6" r="1.2" fill="white" opacity="0.4" />
            <circle cx="30" cy="30" r="1.2" fill="white" opacity="0.4" />
            <text x="18" y="25" fontFamily="'Playfair Display', serif" fontSize="16" fontWeight="700" fill="white" textAnchor="middle" letterSpacing="1">LAI</text>
          </svg>
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
