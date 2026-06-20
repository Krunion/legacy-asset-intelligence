import { useLocation } from "wouter";

const C = {
  slate: "#1E3A5F",
  teal: "#0D9488",
  border: "#E2E8F0",
  muted: "#64748B",
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

  return (
    <nav style={{ background: "white", borderBottom: `1px solid ${C.border}`, padding: "1rem 2rem", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button 
          onClick={() => navigate("/")} 
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", fontWeight: 700, color: C.slate }}
        >
          LAI
        </button>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: location === link.path ? C.teal : C.muted,
                fontWeight: location === link.path ? 600 : 400,
                fontSize: "0.9rem",
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
