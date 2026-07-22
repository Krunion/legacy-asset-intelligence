/**
 * LAI Investigative Questionnaire - Interactive Employee Portal Form
 * Replicates the Word document questionnaire with printable results
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

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: "4rem",
  resize: "vertical" as const,
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

interface QuestionnaireData {
  // Client Info
  clientName: string;
  contactName: string;
  contactTitle: string;
  date: string;
  // CFO Questions
  cfoAssetValue: string;
  cfoConfidence: string;
  cfoFinancialImpact: string;
  cfoLastAudit: string;
  // COO Questions
  cooLocations: string;
  cooDepartments: string;
  cooTotalAssets: string;
  cooFrequentlyMoved: string;
  cooDifficultToLocate: string;
  // Facilities Questions
  facilitiesTagged: string;
  facilitiesTagPercentage: string;
  facilitiesRecordCondition: string;
  facilitiesLocationsAccurate: string;
  // IT Questions
  itCurrentSystem: string;
  itSystemMaintained: string;
  itRealTimeAccess: string;
  // Governance Questions
  govPoliciesInPlace: string;
  govCustodiansAssigned: string;
  govRoutineAudits: string;
  // Recovery Questions
  recoveryMissingAssets: string;
  recoveryUnneededAssets: string;
  // Final Questions
  finalLeadershipSupport: string;
  finalTimeline: string;
  finalBudget: string;
  finalApprover: string;
}

export default function InvestigativeQuestionnaire({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<QuestionnaireData>({
    clientName: "",
    contactName: "",
    contactTitle: "",
    date: new Date().toISOString().split("T")[0],
    cfoAssetValue: "",
    cfoConfidence: "",
    cfoFinancialImpact: "",
    cfoLastAudit: "",
    cooLocations: "",
    cooDepartments: "",
    cooTotalAssets: "",
    cooFrequentlyMoved: "",
    cooDifficultToLocate: "",
    facilitiesTagged: "",
    facilitiesTagPercentage: "",
    facilitiesRecordCondition: "",
    facilitiesLocationsAccurate: "",
    itCurrentSystem: "",
    itSystemMaintained: "",
    itRealTimeAccess: "",
    govPoliciesInPlace: "",
    govCustodiansAssigned: "",
    govRoutineAudits: "",
    recoveryMissingAssets: "",
    recoveryUnneededAssets: "",
    finalLeadershipSupport: "",
    finalTimeline: "",
    finalBudget: "",
    finalApprover: "",
  });

  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const update = (key: keyof QuestionnaireData, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handlePrint = () => {
    if (!resultsRef.current) return;

    // Logo is already embedded as base64 data URL in the img src - no replacement needed
    const htmlContent = resultsRef.current.innerHTML;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>LAI Investigative Questionnaire - ${data.clientName}</title>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Source Sans 3', sans-serif; color: #1E293B; padding: 40px; }
              img { max-height: 50px; }
              @media print { body { padding: 20px; } .no-print { display: none; } }
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
          <button onClick={() => setShowResults(false)} style={{ padding: "0.6rem 1.2rem", background: "#E2E8F0", color: C.text, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
            ← Edit Responses
          </button>
          <button onClick={handlePrint} style={{ padding: "0.6rem 1.2rem", background: C.gold, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
            🖨️ Print Document
          </button>
          <button onClick={onBack} style={{ padding: "0.6rem 1.2rem", background: C.slate, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
            ← Back to Portal
          </button>
        </div>

        <div ref={resultsRef} style={{ background: "white", color: "#1E293B", padding: "2.5rem", borderRadius: 8, border: `1px solid ${C.border}`, maxWidth: 850, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: `3px solid ${C.gold}` }}>
            <div>
              <img src={LOGO_BASE64} alt="Legacy Asset Intelligence" style={{ height: 50, marginBottom: "0.5rem" }} />
              <p style={{ fontSize: "0.8rem", color: C.muted }}>Asset Intelligence & Capital Recovery</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.slate, marginBottom: "0.25rem" }}>Investigative Questionnaire</h1>
              <p style={{ fontSize: "0.85rem", color: C.muted }}>Date: {data.date}</p>
              <p style={{ fontSize: "0.85rem", color: C.muted }}>CONFIDENTIAL</p>
            </div>
          </div>

          {/* Client Info */}
          <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#F8FAFC", borderRadius: 8 }}>
            <p><strong>Client:</strong> {data.clientName || "—"}</p>
            <p><strong>Contact:</strong> {data.contactName || "—"} {data.contactTitle ? `(${data.contactTitle})` : ""}</p>
          </div>

          {/* Sections */}
          {[
            { title: "CFO / Finance Questions", items: [
              { q: "What is the estimated total value of physical assets?", a: data.cfoAssetValue },
              { q: "How confident are you in the accuracy of asset records?", a: data.cfoConfidence },
              { q: "What financial impact have asset discrepancies caused?", a: data.cfoFinancialImpact },
              { q: "When was the last comprehensive asset audit?", a: data.cfoLastAudit },
            ]},
            { title: "COO / Operations Questions", items: [
              { q: "How many total physical locations does the organization operate?", a: data.cooLocations },
              { q: "How many departments manage assets independently?", a: data.cooDepartments },
              { q: "How many physical assets exist within the organization?", a: data.cooTotalAssets },
              { q: "Are assets frequently moved between locations or departments?", a: data.cooFrequentlyMoved },
              { q: "How difficult is it to locate equipment when needed?", a: data.cooDifficultToLocate },
            ]},
            { title: "Facilities / Asset Owner Questions", items: [
              { q: "Are assets currently tagged?", a: data.facilitiesTagged },
              { q: "What percentage of assets currently have tags?", a: data.facilitiesTagPercentage },
              { q: "What condition are most asset records in?", a: data.facilitiesRecordCondition },
              { q: "Are asset locations maintained accurately in your system?", a: data.facilitiesLocationsAccurate },
            ]},
            { title: "IT Questions", items: [
              { q: "What system currently tracks assets?", a: data.itCurrentSystem },
              { q: "Is the asset management system actively maintained?", a: data.itSystemMaintained },
              { q: "Can asset information be accessed in real time?", a: data.itRealTimeAccess },
            ]},
            { title: "Governance Questions", items: [
              { q: "Are documented asset management policies currently in place?", a: data.govPoliciesInPlace },
              { q: "Are asset custodians assigned?", a: data.govCustodiansAssigned },
              { q: "Are routine audits conducted?", a: data.govRoutineAudits },
            ]},
            { title: "Recovery Opportunity Questions", items: [
              { q: "Do you believe assets are currently missing?", a: data.recoveryMissingAssets },
              { q: "Are there assets no longer needed but remain on the books?", a: data.recoveryUnneededAssets },
            ]},
            { title: "Final Qualification Questions", items: [
              { q: "Would leadership support corrective action if significant recoverable capital is identified?", a: data.finalLeadershipSupport },
              { q: "What timeline would you prefer for beginning this initiative?", a: data.finalTimeline },
              { q: "What budget range has been considered?", a: data.finalBudget },
              { q: "Who ultimately approves projects of this type?", a: data.finalApprover },
            ]},
          ].map((section, si) => (
            <div key={si} style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem", paddingBottom: "0.25rem", borderBottom: `1px solid ${C.border}` }}>{section.title}</h3>
              {section.items.map((item, qi) => (
                <div key={qi} style={{ marginBottom: "0.75rem" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.15rem" }}>{item.q}</p>
                  <p style={{ fontSize: "0.9rem", color: item.a ? C.text : C.muted, paddingLeft: "1rem", borderLeft: `2px solid ${item.a ? C.teal : C.border}` }}>{item.a || "No response provided"}</p>
                </div>
              ))}
            </div>
          ))}

          {/* Footer */}
          <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
            <p style={{ fontSize: "0.75rem", color: C.muted }}>Legacy Asset Intelligence | Johnson City, TN | legacyassetintelligence.com</p>
            <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.25rem" }}>This document is confidential and intended solely for the named recipient.</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Input Form ───
  return (
    <div style={{ padding: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.slate }}>Investigative Questionnaire</h2>
        <button onClick={onBack} style={{ padding: "0.5rem 1rem", background: "#E2E8F0", color: C.text, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
          ← Back to Portal
        </button>
      </div>

      {/* Client Info */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Client Information</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div><label style={labelStyle}>Client / Organization Name</label><input style={inputStyle} value={data.clientName} onChange={e => update("clientName", e.target.value)} placeholder="Enter client name" /></div>
          <div><label style={labelStyle}>Contact Name</label><input style={inputStyle} value={data.contactName} onChange={e => update("contactName", e.target.value)} placeholder="Primary contact" /></div>
          <div><label style={labelStyle}>Contact Title</label><input style={inputStyle} value={data.contactTitle} onChange={e => update("contactTitle", e.target.value)} placeholder="Title / Role" /></div>
          <div><label style={labelStyle}>Date</label><input style={inputStyle} type="date" value={data.date} onChange={e => update("date", e.target.value)} /></div>
        </div>
      </div>

      {/* CFO Questions */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>CFO / Finance Questions</h3>
        <div style={{ display: "grid", gap: "1rem" }}>
          <div><label style={labelStyle}>What is the estimated total value of physical assets?</label><input style={inputStyle} value={data.cfoAssetValue} onChange={e => update("cfoAssetValue", e.target.value)} placeholder="e.g., $5M - $10M" /></div>
          <div><label style={labelStyle}>How confident are you in the accuracy of asset records?</label><input style={inputStyle} value={data.cfoConfidence} onChange={e => update("cfoConfidence", e.target.value)} placeholder="e.g., Low / Moderate / High" /></div>
          <div><label style={labelStyle}>What financial impact have asset discrepancies caused?</label><textarea style={textareaStyle} value={data.cfoFinancialImpact} onChange={e => update("cfoFinancialImpact", e.target.value)} placeholder="Describe any known impacts..." /></div>
          <div><label style={labelStyle}>When was the last comprehensive asset audit?</label><input style={inputStyle} value={data.cfoLastAudit} onChange={e => update("cfoLastAudit", e.target.value)} placeholder="e.g., 3 years ago / Never" /></div>
        </div>
      </div>

      {/* COO Questions */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>COO / Operations Questions</h3>
        <div style={{ display: "grid", gap: "1rem" }}>
          <div><label style={labelStyle}>How many total physical locations?</label><input style={inputStyle} value={data.cooLocations} onChange={e => update("cooLocations", e.target.value)} placeholder="Number of locations" /></div>
          <div><label style={labelStyle}>How many departments manage assets independently?</label><input style={inputStyle} value={data.cooDepartments} onChange={e => update("cooDepartments", e.target.value)} placeholder="Number of departments" /></div>
          <div><label style={labelStyle}>Approximately how many physical assets exist?</label><input style={inputStyle} value={data.cooTotalAssets} onChange={e => update("cooTotalAssets", e.target.value)} placeholder="Estimated asset count" /></div>
          <div><label style={labelStyle}>Are assets frequently moved between locations or departments?</label><input style={inputStyle} value={data.cooFrequentlyMoved} onChange={e => update("cooFrequentlyMoved", e.target.value)} placeholder="Yes / No / Sometimes" /></div>
          <div><label style={labelStyle}>How difficult is it to locate equipment when needed?</label><input style={inputStyle} value={data.cooDifficultToLocate} onChange={e => update("cooDifficultToLocate", e.target.value)} placeholder="Easy / Moderate / Very Difficult" /></div>
        </div>
      </div>

      {/* Facilities Questions */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Facilities / Asset Owner Questions</h3>
        <div style={{ display: "grid", gap: "1rem" }}>
          <div><label style={labelStyle}>Are assets currently tagged?</label><input style={inputStyle} value={data.facilitiesTagged} onChange={e => update("facilitiesTagged", e.target.value)} placeholder="Yes / No / Partially" /></div>
          <div><label style={labelStyle}>What percentage of assets currently have tags?</label><input style={inputStyle} value={data.facilitiesTagPercentage} onChange={e => update("facilitiesTagPercentage", e.target.value)} placeholder="e.g., ~40%" /></div>
          <div><label style={labelStyle}>What condition are most asset records in?</label><input style={inputStyle} value={data.facilitiesRecordCondition} onChange={e => update("facilitiesRecordCondition", e.target.value)} placeholder="Excellent / Good / Fair / Poor" /></div>
          <div><label style={labelStyle}>Are asset locations maintained accurately in your system?</label><input style={inputStyle} value={data.facilitiesLocationsAccurate} onChange={e => update("facilitiesLocationsAccurate", e.target.value)} placeholder="Yes / No / Partially" /></div>
        </div>
      </div>

      {/* IT Questions */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>IT Questions</h3>
        <div style={{ display: "grid", gap: "1rem" }}>
          <div><label style={labelStyle}>What system currently tracks assets?</label><input style={inputStyle} value={data.itCurrentSystem} onChange={e => update("itCurrentSystem", e.target.value)} placeholder="e.g., Spreadsheets, ERP, CMMS" /></div>
          <div><label style={labelStyle}>Is the asset management system actively maintained?</label><input style={inputStyle} value={data.itSystemMaintained} onChange={e => update("itSystemMaintained", e.target.value)} placeholder="Yes / No / Partially" /></div>
          <div><label style={labelStyle}>Can asset information be accessed in real time?</label><input style={inputStyle} value={data.itRealTimeAccess} onChange={e => update("itRealTimeAccess", e.target.value)} placeholder="Yes / No" /></div>
        </div>
      </div>

      {/* Governance Questions */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Governance Questions</h3>
        <div style={{ display: "grid", gap: "1rem" }}>
          <div><label style={labelStyle}>Are documented asset management policies currently in place?</label><input style={inputStyle} value={data.govPoliciesInPlace} onChange={e => update("govPoliciesInPlace", e.target.value)} placeholder="Yes / No / Partially" /></div>
          <div><label style={labelStyle}>Are asset custodians assigned?</label><input style={inputStyle} value={data.govCustodiansAssigned} onChange={e => update("govCustodiansAssigned", e.target.value)} placeholder="Yes / No / Some departments" /></div>
          <div><label style={labelStyle}>Are routine audits conducted?</label><input style={inputStyle} value={data.govRoutineAudits} onChange={e => update("govRoutineAudits", e.target.value)} placeholder="Yes / No / Irregularly" /></div>
        </div>
      </div>

      {/* Recovery Questions */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Recovery Opportunity Questions</h3>
        <div style={{ display: "grid", gap: "1rem" }}>
          <div><label style={labelStyle}>Do you believe assets are currently missing?</label><textarea style={textareaStyle} value={data.recoveryMissingAssets} onChange={e => update("recoveryMissingAssets", e.target.value)} placeholder="Describe any known missing assets..." /></div>
          <div><label style={labelStyle}>Are there assets no longer needed but remain on the books?</label><textarea style={textareaStyle} value={data.recoveryUnneededAssets} onChange={e => update("recoveryUnneededAssets", e.target.value)} placeholder="Describe any known surplus assets..." /></div>
        </div>
      </div>

      {/* Final Questions */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Final Qualification Questions</h3>
        <div style={{ display: "grid", gap: "1rem" }}>
          <div><label style={labelStyle}>Would leadership support corrective action if significant recoverable capital is identified?</label><input style={inputStyle} value={data.finalLeadershipSupport} onChange={e => update("finalLeadershipSupport", e.target.value)} placeholder="Yes / Likely / Uncertain" /></div>
          <div><label style={labelStyle}>What timeline would you prefer?</label><input style={inputStyle} value={data.finalTimeline} onChange={e => update("finalTimeline", e.target.value)} placeholder="e.g., Within 30 days, Next quarter" /></div>
          <div><label style={labelStyle}>What budget range has been considered?</label><input style={inputStyle} value={data.finalBudget} onChange={e => update("finalBudget", e.target.value)} placeholder="e.g., $25K - $50K" /></div>
          <div><label style={labelStyle}>Who ultimately approves projects of this type?</label><input style={inputStyle} value={data.finalApprover} onChange={e => update("finalApprover", e.target.value)} placeholder="Name and title" /></div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={() => setShowResults(true)}
        style={{
          width: "100%",
          padding: "1rem",
          background: C.gold,
          color: "white",
          border: "none",
          borderRadius: 8,
          fontFamily: "'Source Sans 3', sans-serif",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Generate Printable Document
      </button>
    </div>
  );
}
