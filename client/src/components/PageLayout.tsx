import SiteNav from "./SiteNav";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { COLORS } from "@shared/colors";

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
  ctaDescription = "Let's discuss how we can help your organization.",
  ctaButtonText = "Schedule Consultation",
}: PageLayoutProps) {
  const [, navigate] = useLocation();
  
  const handleCTA = () => {
    // Scroll to FAQ page or show contact form
    navigate("/faq");
  };
  return (
    <div style={{ minHeight: "100vh", background: C.bgLight }}>
      {/* Navigation */}
      <SiteNav />

      {/* Hero Section */}
      <section style={{ background: C.charcoal, color: C.text, padding: "4rem 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3rem", fontWeight: 700, marginBottom: "1rem" }}>
            {heroTitle}
          </h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ maxWidth: 1200, margin: "4rem auto", padding: "0 2rem" }}>
        {children}
      </section>

      {/* CTA Section */}
      <section style={{ background: C.charcoal, color: C.text, padding: "4rem 2rem", marginTop: "4rem", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
            {ctaTitle}
          </h2>
          <p style={{ fontSize: "1rem", opacity: 0.9, marginBottom: "2rem" }}>
            {ctaDescription}
          </p>
          <Button 
            onClick={handleCTA}
            style={{ background: C.gold, color: C.charcoal, padding: "0.8rem 2rem", fontSize: "1rem", cursor: "pointer" }}
          >
            {ctaButtonText}
          </Button>
        </div>
      </section>
    </div>
  );
}
