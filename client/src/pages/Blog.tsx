import PageLayout from "@/components/PageLayout";
import { COLORS } from "@shared/colors";
import { useState } from "react";

const C = COLORS;

export default function Blog() {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const articles = [
    {
      title: "The Hidden Cost of Ghost Assets in Enterprise Operations",
      date: "June 15, 2026",
      category: "Asset Management",
      excerpt: "Ghost assets silently drain enterprise budgets through unnecessary maintenance contracts, inflated insurance premiums, and wasted IT resources. This analysis reveals the true financial impact.",
      readTime: "8 min read"
    },
    {
      title: "5 Warning Signs Your Organization Has a Ghost Asset Problem",
      date: "June 8, 2026",
      category: "Operations",
      excerpt: "Learn to identify the telltale indicators that your fixed asset register is out of sync with reality. Early detection can save millions in unnecessary spending.",
      readTime: "6 min read"
    },
    {
      title: "Implementing Asset Accountability: A Step-by-Step Framework",
      date: "May 30, 2026",
      category: "Strategy",
      excerpt: "Moving from reactive asset management to proactive governance requires more than technology. Discover the organizational framework that drives sustainable results.",
      readTime: "12 min read"
    },
    {
      title: "Technology Integration: Choosing the Right Asset Tracking Platform",
      date: "May 22, 2026",
      category: "Technology",
      excerpt: "Not all asset management systems are created equal. We break down the key capabilities to evaluate when selecting a platform for enterprise-scale deployments.",
      readTime: "10 min read"
    },
    {
      title: "Case Study: How a Healthcare System Recovered $4.2M in Hidden Capital",
      date: "May 15, 2026",
      category: "Case Studies",
      excerpt: "A 15-hospital network discovered that 18% of its fixed assets were ghosts—items on the books but physically missing. Here's how they recovered the capital.",
      readTime: "7 min read"
    },
    {
      title: "The ROI of Asset Governance: Beyond Capital Recovery",
      date: "May 8, 2026",
      category: "Finance",
      excerpt: "While capital recovery is immediate and measurable, the long-term benefits of asset governance extend far beyond the initial audit. Learn the full ROI picture.",
      readTime: "9 min read"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Asset Management": C.gold,
      "Operations": C.gold,
      "Strategy": C.gold,
      "Technology": C.gold,
      "Case Studies": C.gold,
      "Finance": C.gold
    };
    return colors[category] || C.gold;
  };

  return (
    <PageLayout
      heroTitle="Executive Insights"
      heroSubtitle="In-depth analysis and thought leadership on asset intelligence, capital recovery, and enterprise operations"
      ctaTitle="Subscribe to Our Insights"
      ctaDescription="Get the latest research and case studies delivered to your inbox monthly."
      ctaButtonText="Subscribe Now"
    >
      {/* Toast notification */}
      {toastMsg && (
        <div style={{
          position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 9999,
          background: C.charcoal, color: "#fff", padding: "1rem 1.5rem",
          borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem",
          border: `1px solid ${C.gold}`, maxWidth: 320,
          animation: "fadeIn 0.2s ease"
        }}>
          {toastMsg}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
        {articles.map((article, i) => (
          <div key={i} style={{ padding: "1.5rem", background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 2px 8px rgba(15,20,25,0.05)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <span style={{ padding: "0.4rem 0.8rem", background: `${getCategoryColor(article.category)}20`, color: getCategoryColor(article.category), borderRadius: 4, fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase" }}>
                {article.category}
              </span>
              <span style={{ color: C.textMuted, fontSize: "0.8rem" }}>
                {article.readTime}
              </span>
            </div>
            
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: C.charcoal, marginBottom: "0.75rem", lineHeight: 1.4 }}>
              {article.title}
            </h3>
            
            <p style={{ color: C.textDark, fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1rem", flex: 1 }}>
              {article.excerpt}
            </p>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: `1px solid ${C.border}` }}>
              <span style={{ color: C.textMuted, fontSize: "0.8rem" }}>
                {article.date}
              </span>
              <button
                onClick={() => showToast("Full articles coming soon. Contact us for early access.")}
                style={{ background: "none", border: "none", color: C.gold, fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", padding: 0 }}
              >
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
