import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { COLORS, HERO_IMG } from "@shared/colors";

const C = COLORS;

interface PageLayoutProps {
  heroTitle: string;
  heroSubtitle: string;
  children: React.ReactNode;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
}

export default function PageLayout({
  heroTitle,
  heroSubtitle,
  children,
  ctaTitle = "Ready to Transform Your Asset Management?",
  ctaDescription = "Let's discuss how we can help your organization recover hidden capital.",
  ctaButtonText = "Schedule Consultation",
}: PageLayoutProps) {
  const [, navigate] = useLocation();
  
  const handleCTA = () => {
    navigate("/contact");
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: `url(${HERO_IMG})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    }}>
      {/* Hero Section */}
      <section style={{ 
        background: "rgba(11, 15, 19, 0.82)",
        padding: "6rem 2rem 4rem", 
        textAlign: "center",
        borderBottom: `1px solid ${C.border}`
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: "clamp(2rem, 5vw, 3.2rem)", 
            fontWeight: 700, 
            color: C.text,
            marginBottom: "1rem",
            lineHeight: 1.2,
            textShadow: "0 2px 8px rgba(0,0,0,0.5)"
          }}>
            {heroTitle}
          </h1>
          <p style={{ 
            fontSize: "1.1rem", 
            color: C.textMuted,
            lineHeight: 1.7,
            maxWidth: 600,
            margin: "0 auto",
            textShadow: "0 1px 4px rgba(0,0,0,0.4)"
          }}>
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "4rem 2rem",
        background: "rgba(11, 15, 19, 0.75)",
        backdropFilter: "blur(2px)",
      }}>
        {children}
      </section>

      {/* CTA Section */}
      <section style={{
        background: "rgba(17, 24, 32, 0.9)",
        borderTop: `1px solid ${C.border}`,
        padding: "5rem 2rem",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: "1.8rem", 
            fontWeight: 700, 
            color: C.text,
            marginBottom: "1rem",
            textShadow: "0 2px 6px rgba(0,0,0,0.4)"
          }}>
            {ctaTitle}
          </h2>
          <p style={{ 
            fontSize: "1rem", 
            color: C.textMuted, 
            marginBottom: "2rem",
            lineHeight: 1.7,
            textShadow: "0 1px 3px rgba(0,0,0,0.3)"
          }}>
            {ctaDescription}
          </p>
          <Button 
            onClick={handleCTA}
            style={{ 
              background: C.gold, 
              color: C.charcoal, 
              padding: "0.85rem 2.5rem", 
              fontSize: "0.95rem",
              fontWeight: 600,
              border: "none",
              borderRadius: "4px",
              letterSpacing: "0.02em"
            }}
          >
            {ctaButtonText}
          </Button>
        </div>
      </section>
    </div>
  );
}
