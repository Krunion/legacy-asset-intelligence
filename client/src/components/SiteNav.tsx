import { useLocation } from "wouter";
import { useState } from "react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Industries", path: "/industries" },
  { label: "Team", path: "/team" },
  { label: "Insights", path: "/insights" },
  { label: "Resources", path: "/resources" },
  { label: "FAQ", path: "/faq" },
  { label: "Careers", path: "/career" },
  { label: "Employee Portal", path: "/employee-portal" },
  { label: "Contact", path: "/contact" },
];

export default function SiteNav() {
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={{ 
      background: "rgba(11, 15, 19, 0.9)",
      backdropFilter: "blur(8px)", 
      borderBottom: "1px solid rgba(168,178,189,0.08)", 
      position: "sticky", 
      top: 0, 
      zIndex: 100 
    }}>
      {/* Main row: Logo + Nav */}
      <div style={{ 
        maxWidth: 1200, 
        margin: "0 auto", 
        padding: "0.75rem 2rem", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" 
      }}>
        {/* Logo */}
        <button 
          onClick={() => navigate("/")} 
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}
        >
          <img 
            src="/manus-storage/pasted_file_yudYZ7_image_transparent_32d3d4e2.png" 
            alt="Legacy Asset Intelligence" 
            style={{ height: 48, width: "auto", objectFit: "contain" }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </button>

        {/* Desktop Nav */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="desktop-nav">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                background: "none",
                border: "none",
                color: location === link.path ? "#C9A84C" : "#A8B2BD",
                fontFamily: "'Source Sans 3', sans-serif",
                fontWeight: location === link.path ? 600 : 400,
                fontSize: "0.85rem",
                letterSpacing: "0.02em",
                transition: "color 0.2s",
                padding: "0.25rem 0",
                borderBottom: location === link.path ? "1px solid #C9A84C" : "1px solid transparent",
              }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-nav-toggle"
          style={{ 
            background: "none", 
            border: "none", 
            color: "#A8B2BD", 
            fontSize: "1.5rem",
            display: "none"
          }}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div style={{ 
          background: "#111820", 
          borderTop: "1px solid rgba(168,178,189,0.08)", 
          padding: "1rem 2rem",
          display: "none"
        }} className="mobile-nav-panel">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => { navigate(link.path); setMobileOpen(false); }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                color: location === link.path ? "#C9A84C" : "#A8B2BD",
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.9rem",
                padding: "0.75rem 0",
                borderBottom: "1px solid rgba(168,178,189,0.06)",
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: block !important; }
          .mobile-nav-panel { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
