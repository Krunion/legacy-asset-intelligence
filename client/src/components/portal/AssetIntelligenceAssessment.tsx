/**
 * LAI Asset Intelligence Assessment - Interactive Employee Portal Form
 * Scoring-based maturity assessment with printable results
 */

import { useState, useRef } from "react";
import { LOGO_BASE64 } from "./logoBase64";


const C = {
  slate: "#1E3A5F",
  teal: "#0D9488",
  gold: "#D4AF37",
  border: "#E2E8F0",
  text: "#1E293B",
  muted: "#64748B",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: C.text,
  marginBottom: "0.25rem",
  display: "block",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: `1px solid ${C.border}`,
  borderRadius: 6,
  fontSize: "0.9rem",
  fontFamily: "'Source Sans 3', sans-serif",
  background: "white",
  color: C.text,
  outline: "none",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "auto" as const,
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "1.1rem",
  fontWeight: 700,
  color: C.slate,
  marginBottom: "1rem",
  paddingBottom: "0.5rem",
  borderBottom: `2px solid ${C.gold}`,
};

interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  options: { label: string; score: number }[];
}

const QUESTIONS: AssessmentQuestion[] = [
  // Inventory Accuracy
  { id: "inv1", category: "Inventory Accuracy", question: "How accurate are your current asset records?", options: [
    { label: "No formal records exist", score: 1 },
    { label: "Records exist but are significantly outdated", score: 2 },
    { label: "Records are maintained but have known gaps", score: 3 },
    { label: "Records are mostly accurate with minor discrepancies", score: 4 },
    { label: "Records are highly accurate and regularly validated", score: 5 },
  ]},
  { id: "inv2", category: "Inventory Accuracy", question: "When was the last physical verification of assets?", options: [
    { label: "Never conducted", score: 1 },
    { label: "More than 5 years ago", score: 2 },
    { label: "3-5 years ago", score: 3 },
    { label: "1-3 years ago", score: 4 },
    { label: "Within the last 12 months", score: 5 },
  ]},
  { id: "inv3", category: "Inventory Accuracy", question: "What percentage of assets can be physically located on demand?", options: [
    { label: "Less than 50%", score: 1 },
    { label: "50-70%", score: 2 },
    { label: "70-85%", score: 3 },
    { label: "85-95%", score: 4 },
    { label: "95%+", score: 5 },
  ]},
  // Technology & Systems
  { id: "tech1", category: "Technology & Systems", question: "What system is used to track assets?", options: [
    { label: "No system / paper only", score: 1 },
    { label: "Spreadsheets", score: 2 },
    { label: "Basic database or shared drive", score: 3 },
    { label: "Dedicated asset management system", score: 4 },
    { label: "Integrated enterprise platform with automation", score: 5 },
  ]},
  { id: "tech2", category: "Technology & Systems", question: "Are assets physically tagged or labeled?", options: [
    { label: "No tagging system", score: 1 },
    { label: "Some assets tagged inconsistently", score: 2 },
    { label: "Most assets tagged but not standardized", score: 3 },
    { label: "Standardized tagging with barcode/QR", score: 4 },
    { label: "RFID or automated tracking deployed", score: 5 },
  ]},
  { id: "tech3", category: "Technology & Systems", question: "Can asset data be accessed in real time?", options: [
    { label: "No digital access", score: 1 },
    { label: "Requires manual lookup", score: 2 },
    { label: "Available but not real-time", score: 3 },
    { label: "Real-time access for key users", score: 4 },
    { label: "Real-time access organization-wide", score: 5 },
  ]},
  // Governance & Controls
  { id: "gov1", category: "Governance & Controls", question: "Are asset management policies documented?", options: [
    { label: "No policies exist", score: 1 },
    { label: "Informal / tribal knowledge only", score: 2 },
    { label: "Some documentation exists but not enforced", score: 3 },
    { label: "Documented and mostly followed", score: 4 },
    { label: "Comprehensive policies actively enforced", score: 5 },
  ]},
  { id: "gov2", category: "Governance & Controls", question: "Are asset custodians assigned and accountable?", options: [
    { label: "No custodian assignments", score: 1 },
    { label: "Informal ownership only", score: 2 },
    { label: "Some departments have custodians", score: 3 },
    { label: "Most assets have assigned custodians", score: 4 },
    { label: "All assets have accountable custodians", score: 5 },
  ]},
  { id: "gov3", category: "Governance & Controls", question: "Are routine asset audits conducted?", options: [
    { label: "Never", score: 1 },
    { label: "Only when problems arise", score: 2 },
    { label: "Irregularly / ad hoc", score: 3 },
    { label: "Annually", score: 4 },
    { label: "Semi-annually or more frequently", score: 5 },
  ]},
  // Financial Impact
  { id: "fin1", category: "Financial Impact", question: "Have ghost assets (recorded but not found) caused financial issues?", options: [
    { label: "Unknown / never checked", score: 1 },
    { label: "Suspected but not quantified", score: 2 },
    { label: "Known issues, minimal impact", score: 3 },
    { label: "Identified and partially addressed", score: 4 },
    { label: "Fully identified and resolved", score: 5 },
  ]},
  { id: "fin2", category: "Financial Impact", question: "Are duplicate purchases made due to inability to locate existing assets?", options: [
    { label: "Frequently / major issue", score: 1 },
    { label: "Regularly occurs", score: 2 },
    { label: "Occasionally happens", score: 3 },
    { label: "Rarely occurs", score: 4 },
    { label: "Never / strong controls prevent this", score: 5 },
  ]},
  { id: "fin3", category: "Financial Impact", question: "Is insurance and property tax exposure optimized based on actual assets?", options: [
    { label: "Never reviewed", score: 1 },
    { label: "Reviewed once, years ago", score: 2 },
    { label: "Periodically reviewed but gaps exist", score: 3 },
    { label: "Regularly reviewed and mostly accurate", score: 4 },
    { label: "Continuously optimized with verified data", score: 5 },
  ]},
];

function getMaturityLevel(avgScore: number): { level: string; description: string; color: string } {
  if (avgScore <= 1.5) return { level: "Level 1: No Formal Process", description: "No centralized inventory records, weak controls, no routine reconciliation. Highest recovery opportunity.", color: "#DC2626" };
  if (avgScore <= 2.5) return { level: "Level 2: Spreadsheet Management", description: "Spreadsheet-driven asset tracking, inconsistent updates, limited governance. Significant recovery potential.", color: "#EA580C" };
  if (avgScore <= 3.5) return { level: "Level 3: Basic Asset System", description: "Asset system exists but controls, tagging, and reconciliation are inconsistent. Moderate recovery opportunity.", color: "#D97706" };
  if (avgScore <= 4.5) return { level: "Level 4: Good Controls", description: "Documented controls with periodic reconciliation, but gaps may remain. Targeted recovery possible.", color: "#0D9488" };
  return { level: "Level 5: Best-in-Class", description: "Strong controls, technology-enabled visibility, routine governance. Minimal recovery opportunity.", color: "#059669" };
}

export default function AssetIntelligenceAssessment({ onBack }: { onBack: () => void }) {
  const [clientName, setClientName] = useState("");
  const [contactName, setContactName] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const totalQuestions = QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const totalScore = Object.values(answers).reduce((sum, s) => sum + s, 0);
  const avgScore = answeredCount > 0 ? totalScore / answeredCount : 0;
  const maturity = getMaturityLevel(avgScore);

  // Category scores
  const categories = Array.from(new Set(QUESTIONS.map(q => q.category)));
  const categoryScores = categories.map(cat => {
    const catQuestions = QUESTIONS.filter(q => q.category === cat);
    const catAnswered = catQuestions.filter(q => answers[q.id] !== undefined);
    const catTotal = catAnswered.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const catAvg = catAnswered.length > 0 ? catTotal / catAnswered.length : 0;
    return { category: cat, avg: catAvg, answered: catAnswered.length, total: catQuestions.length };
  });

  const handlePrint = () => {
    if (!resultsRef.current) return;

    // Logo is already embedded as base64 data URL in the img src - no replacement needed
    const htmlContent = resultsRef.current.innerHTML;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>LAI Asset Intelligence Assessment - ${clientName}</title>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Source Sans 3', sans-serif; color: #1E293B; padding: 40px; }
              img { max-height: 50px; }
              @media print { body { padding: 20px; } }
            </style>
          </head>
          <body>${htmlContent}</body>
        </html>
      `);
      printWindow.document.close();
      // Base64 images don't need loading - just wait for fonts
      setTimeout(() => printWindow.print(), 800);
    }
  };

  if (showResults) {
    return (
      <div style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <button onClick={() => setShowResults(false)} style={{ padding: "0.6rem 1.2rem", background: "#E2E8F0", color: C.text, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>← Edit Responses</button>
          <button onClick={handlePrint} style={{ padding: "0.6rem 1.2rem", background: C.gold, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>🖨️ Print Report</button>
          <button onClick={onBack} style={{ padding: "0.6rem 1.2rem", background: C.slate, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>← Back to Portal</button>
        </div>

        <div ref={resultsRef} style={{ background: "white", padding: "2.5rem", borderRadius: 8, border: `1px solid ${C.border}`, maxWidth: 850, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: `3px solid ${C.gold}` }}>
            <div>
              <img src={LOGO_BASE64} alt="Legacy Asset Intelligence" style={{ height: 50, marginBottom: "0.5rem" }} />
              <p style={{ fontSize: "0.8rem", color: C.muted }}>Asset Intelligence & Capital Recovery</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.slate }}>Asset Intelligence Assessment</h1>
              <p style={{ fontSize: "0.85rem", color: C.muted }}>Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Client */}
          <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#F8FAFC", borderRadius: 8 }}>
            <p><strong>Client:</strong> {clientName || "—"}</p>
            <p><strong>Contact:</strong> {contactName || "—"}</p>
          </div>

          {/* Overall Score */}
          <div style={{ marginBottom: "2rem", padding: "1.5rem", background: `${maturity.color}10`, borderRadius: 8, border: `2px solid ${maturity.color}` }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: maturity.color, marginBottom: "0.5rem" }}>Overall Maturity Score</h3>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 700, color: maturity.color }}>{avgScore.toFixed(1)} / 5.0</p>
            <p style={{ fontWeight: 700, marginTop: "0.5rem" }}>{maturity.level}</p>
            <p style={{ fontSize: "0.9rem", color: C.muted, marginTop: "0.25rem" }}>{maturity.description}</p>
          </div>

          {/* Category Breakdown */}
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "1rem" }}>Category Breakdown</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: C.slate, color: "white" }}>
                <th style={{ padding: "0.6rem", textAlign: "left" }}>Category</th>
                <th style={{ padding: "0.6rem", textAlign: "center" }}>Score</th>
                <th style={{ padding: "0.6rem", textAlign: "center" }}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {categoryScores.map((cs, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "0.6rem", fontWeight: 600 }}>{cs.category}</td>
                  <td style={{ padding: "0.6rem", textAlign: "center", fontFamily: "'JetBrains Mono', monospace" }}>{cs.avg.toFixed(1)} / 5.0</td>
                  <td style={{ padding: "0.6rem", textAlign: "center" }}>
                    <span style={{ padding: "0.2rem 0.6rem", borderRadius: 4, fontSize: "0.8rem", fontWeight: 600, background: cs.avg <= 2 ? "#FEE2E2" : cs.avg <= 3.5 ? "#FEF3C7" : "#D1FAE5", color: cs.avg <= 2 ? "#DC2626" : cs.avg <= 3.5 ? "#D97706" : "#059669" }}>
                      {cs.avg <= 2 ? "Critical" : cs.avg <= 3.5 ? "Needs Improvement" : "Good"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Detailed Responses */}
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "1rem" }}>Detailed Responses</h3>
          {categories.map((cat, ci) => (
            <div key={ci} style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.slate, marginBottom: "0.5rem" }}>{cat}</h4>
              {QUESTIONS.filter(q => q.category === cat).map((q, qi) => (
                <div key={qi} style={{ marginBottom: "0.5rem", paddingLeft: "1rem", borderLeft: `2px solid ${answers[q.id] ? C.teal : C.border}` }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>{q.question}</p>
                  <p style={{ fontSize: "0.85rem", color: C.muted }}>{answers[q.id] ? q.options.find(o => o.score === answers[q.id])?.label : "Not answered"} {answers[q.id] ? `(${answers[q.id]}/5)` : ""}</p>
                </div>
              ))}
            </div>
          ))}

          {/* Recommendations */}
          <div style={{ marginTop: "2rem", padding: "1.25rem", background: "rgba(13, 148, 136, 0.05)", borderRadius: 8, border: `1px solid rgba(13, 148, 136, 0.2)` }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.teal, marginBottom: "0.75rem" }}>LAI Recommendation</h3>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
              {avgScore <= 2.5
                ? "Based on this assessment, there is significant opportunity for capital recovery and operational improvement. We recommend a comprehensive Phase 1 Executive Assessment to quantify the recoverable capital opportunity and develop a prioritized roadmap."
                : avgScore <= 3.5
                ? "This assessment indicates moderate gaps in asset intelligence maturity. A targeted Phase 1 Assessment would help identify specific recovery opportunities and governance improvements that could yield meaningful ROI."
                : "Your organization demonstrates good asset management practices. A focused assessment could still identify optimization opportunities, particularly in areas scoring below 4.0."}
            </p>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
            <p style={{ fontSize: "0.75rem", color: C.muted }}>Legacy Asset Intelligence | Johnson City, TN | legacyassetintelligence.com</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Input Form ───
  return (
    <div style={{ padding: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.slate }}>Asset Intelligence Assessment</h2>
        <button onClick={onBack} style={{ padding: "0.5rem 1rem", background: "#E2E8F0", color: C.text, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>← Back to Portal</button>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: "1.5rem", padding: "0.75rem 1rem", background: "#F8FAFC", borderRadius: 8, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Progress: {answeredCount} / {totalQuestions} questions</span>
          <span style={{ fontSize: "0.85rem", color: C.muted }}>Current Score: {avgScore.toFixed(1)} / 5.0</span>
        </div>
        <div style={{ marginTop: "0.5rem", height: 6, background: "#E2E8F0", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(answeredCount / totalQuestions) * 100}%`, background: C.teal, borderRadius: 3, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* Client Info */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Client Information</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div><label style={labelStyle}>Client / Organization Name</label><input style={inputStyle} value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Enter client name" /></div>
          <div><label style={labelStyle}>Contact Name</label><input style={inputStyle} value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Primary contact" /></div>
        </div>
      </div>

      {/* Questions by Category */}
      {categories.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: "2rem" }}>
          <h3 style={sectionTitleStyle}>{cat}</h3>
          {QUESTIONS.filter(q => q.category === cat).map((q, qi) => (
            <div key={qi} style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>{q.question}</label>
              <select style={selectStyle} value={answers[q.id] || ""} onChange={e => setAnswers(prev => ({ ...prev, [q.id]: Number(e.target.value) }))}>
                <option value="">— Select —</option>
                {q.options.map((opt, oi) => (
                  <option key={oi} value={opt.score}>{opt.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ))}

      {/* Generate Button */}
      <button
        onClick={() => setShowResults(true)}
        disabled={answeredCount === 0}
        style={{
          width: "100%",
          padding: "1rem",
          background: answeredCount === 0 ? "#CBD5E1" : C.gold,
          color: "white",
          border: "none",
          borderRadius: 8,
          fontFamily: "'Source Sans 3', sans-serif",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: answeredCount === 0 ? "not-allowed" : "pointer",
        }}
      >
        Generate Assessment Report
      </button>
    </div>
  );
}
