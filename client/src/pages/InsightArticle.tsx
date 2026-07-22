/**
 * Legacy Asset Intelligence — Insight Article Page
 * Renders individual insight articles with professional executive design
 */

import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { COLORS, HERO_IMG } from "@shared/colors";
import { insightArticles } from "@/data/insightArticles";
import { usePageMeta } from "@/hooks/usePageMeta";

const C = {
  ...COLORS,
  glass: "rgba(26, 34, 48, 0.75)",
  glassBorder: "rgba(168,178,189,0.08)",
  goldBorder: "rgba(201,168,76,0.25)",
};

export default function InsightArticle() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const slug = params.slug;

  const article = insightArticles.find((a) => a.slug === slug);

  usePageMeta({
    title: article ? `${article.title} | Legacy Asset Intelligence` : "Article Not Found | Legacy Asset Intelligence",
    description: article ? `${article.category} — ${article.title}` : "The requested insight article could not be found.",
    canonical: `/insights/${slug}`,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div style={{ minHeight: "100vh", background: C.charcoal, color: C.text, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1.5rem" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: C.gold }}>Article Not Found</h1>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted }}>The requested insight article could not be found.</p>
        <button onClick={() => navigate("/insights")} style={{ padding: "0.75rem 2rem", background: C.gold, color: C.charcoal, border: "none", borderRadius: 4, fontWeight: 600, cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif" }}>
          Back to Insights
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(to bottom, rgba(11,15,19,0.94), rgba(11,15,19,0.98)), url('${HERO_IMG}') center/cover fixed`, color: C.text }}>

      {/* ═══ ARTICLE HEADER ═══ */}
      <header style={{ padding: "8rem 2rem 3rem", maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
        <button
          onClick={() => navigate("/insights")}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.gold, background: "none", border: "none", cursor: "pointer", marginBottom: "2rem", letterSpacing: "0.05em" }}
        >
          ← Back to Insights
        </button>

        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: "1rem" }}>
          {article.category}
        </p>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1.5rem" }}>
          {article.title}
        </h1>

        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.textMuted }}>
          {article.readTime && <span>{article.readTime}</span>}
          {article.pages && <span>{article.pages}</span>}
          <span>Legacy Asset Intelligence</span>
        </div>

        <div style={{ width: 60, height: 2, background: C.gold, margin: "2rem auto 0" }} />
      </header>

      {/* ═══ ARTICLE BODY ═══ */}
      <article style={{ maxWidth: 780, margin: "0 auto", padding: "0 2rem 4rem" }}>
        <div
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "1.05rem",
            lineHeight: 1.85,
            color: C.text,
          }}
        >
          {article.sections.map((section, idx) => (
            <section key={idx} style={{ marginBottom: "2.5rem" }}>
              {section.heading && (
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: "1rem",
                  marginTop: idx === 0 ? 0 : "3rem",
                  borderLeft: `3px solid ${C.gold}`,
                  paddingLeft: "1rem",
                }}>
                  {section.heading}
                </h2>
              )}
              {section.subheading && (
                <h3 style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: C.goldLight,
                  marginBottom: "0.75rem",
                  marginTop: "1.5rem",
                }}>
                  {section.subheading}
                </h3>
              )}
              {section.paragraphs.map((para, pIdx) => (
                <p key={pIdx} style={{ marginBottom: "1.2rem", color: C.text, opacity: 0.92 }}>
                  {para}
                </p>
              ))}
              {section.table && (
                <div style={{ overflowX: "auto", margin: "1.5rem 0" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem" }}>
                    <thead>
                      <tr>
                        {section.table.headers.map((h, hIdx) => (
                          <th key={hIdx} style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: `2px solid ${C.gold}`, color: C.gold, fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} style={{ borderBottom: `1px solid ${C.border}` }}>
                          {row.map((cell: string, cIdx: number) => (
                            <td key={cIdx} style={{ padding: "0.75rem 1rem", color: C.text, opacity: 0.9 }}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {section.callout && (
                <blockquote style={{
                  borderLeft: `3px solid ${C.gold}`,
                  padding: "1rem 1.5rem",
                  margin: "1.5rem 0",
                  background: "rgba(201,168,76,0.06)",
                  borderRadius: "0 6px 6px 0",
                  fontStyle: "italic",
                  color: C.textMuted,
                }}>
                  {section.callout}
                </blockquote>
              )}
            </section>
          ))}

          {/* ═══ REFERENCES ═══ */}
          {article.references && article.references.length > 0 && (
            <section style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: `1px solid ${C.border}` }}>
              <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>References</h3>
              <ol style={{ paddingLeft: "1.5rem", color: C.textMuted, fontSize: "0.85rem", lineHeight: 1.8 }}>
                {article.references.map((ref: string, rIdx: number) => (
                  <li key={rIdx} style={{ marginBottom: "0.3rem" }}>{ref}</li>
                ))}
              </ol>
            </section>
          )}
        </div>

        {/* ═══ CTA SECTION ═══ */}
        <div style={{
          marginTop: "3rem",
          padding: "2.5rem",
          background: C.glass,
          border: `1px solid ${C.goldBorder}`,
          borderRadius: 8,
          textAlign: "center",
        }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.text, marginBottom: "0.75rem" }}>
            Ready to Take Action?
          </h3>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, marginBottom: "1.5rem", maxWidth: 500, margin: "0 auto 1.5rem" }}>
            Schedule a complimentary Executive Discovery Call to discuss how Legacy Asset Intelligence can help your organization recover hidden capital and strengthen asset governance.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/contact")}
              style={{ padding: "0.85rem 2rem", background: C.gold, color: C.charcoal, border: "none", borderRadius: 4, fontWeight: 600, cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem" }}
            >
              Schedule Consultation
            </button>
            <button
              onClick={() => navigate("/resources")}
              style={{ padding: "0.85rem 2rem", background: "transparent", color: C.gold, border: `1px solid ${C.gold}`, borderRadius: 4, fontWeight: 600, cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem" }}
            >
              Explore More Resources
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
