/**
 * LAI Client Interview Questionnaire - Interactive Employee Portal Form
 * Updated version matching LAI_Client_Interview_Questionnaire_Updated.docx
 * 8 sections, each with: Interview Notes, Key Details to Capture, Supporting Documents/Evidence
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
  cardBg: "#F8FAFC",
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
  minHeight: "6rem",
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

const subheadingStyle: React.CSSProperties = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: "0.9rem",
  fontWeight: 700,
  color: C.teal,
  marginTop: "1.25rem",
  marginBottom: "0.75rem",
};

// ─── Section Definitions ──────────────────────────────────────────────────────

interface DocRequest {
  label: string;
  requested: string;
  received: string;
  date: string;
}

interface Section {
  number: number;
  category: string;
  question: string;
  keyDetails: string[];
  documents: string[];
}

const SECTIONS: Section[] = [
  {
    number: 1,
    category: "Executive Priorities",
    question: "What are the organization's biggest challenges involving asset visibility, accountability, utilization, or financial accuracy?",
    keyDetails: [
      "Primary asset-related challenge",
      "Departments, locations, or services affected",
      "Specific example discussed",
      "Operational or service-delivery impact",
      "Known or suspected financial impact",
      "Audit, compliance, safety, or reputational impact",
      "Event or leadership priority creating urgency",
      "Executive owner or sponsor",
    ],
    documents: [
      "Recent asset-related audit findings or corrective-action plans",
      "Incident, loss, exception, or operational issue reports",
      "Existing executive reports or performance dashboards",
    ],
  },
  {
    number: 2,
    category: "Current Asset Lifecycle",
    question: "How are assets currently purchased, received, recorded, tagged, assigned, transferred, maintained, and disposed of?",
    keyDetails: [
      "Purchasing and approval owner",
      "Receiving and initial-recording process",
      "Current tagging point and responsible party",
      "Assignment and custodian process",
      "Transfer or relocation process",
      "Maintenance and condition-tracking process",
      "Inventory check before new purchases",
      "Disposition, retirement, and write-off process",
    ],
    documents: [
      "Asset lifecycle policies, procedures, or workflow diagrams",
      "Receiving, assignment, transfer, and disposal forms",
      "Relevant procurement, maintenance, and disposition records",
    ],
  },
  {
    number: 3,
    category: "Fixed Asset Register Accuracy",
    question: "How confident are you that the Fixed Asset Register accurately reflects the assets the organization currently owns and uses?",
    keyDetails: [
      "FAR owner and responsible department",
      "Financial or ERP system of record",
      "Approximate FAR record count",
      "Approximate gross and net book value",
      "Date of last FAR update or reconciliation",
      "Confidence rating (1–5) and reason",
      "Known missing, incomplete, or unreliable fields",
      "Primary identifiers used to match records to assets",
    ],
    documents: [
      "Current FAR in native Excel or CSV format",
      "Fixed-asset general-ledger detail and depreciation schedule",
      "Most recent FAR reconciliation or related audit results",
    ],
  },
  {
    number: 4,
    category: "Known Exceptions / Recovery Opportunities",
    question: "What problems have you experienced with missing assets, ghost assets, duplicate purchases, inaccurate locations, obsolete equipment, or incomplete records?",
    keyDetails: [
      "Missing or unlocated assets",
      "Ghost assets remaining on the books",
      "Unrecorded or newly discovered assets",
      "Duplicate or emergency purchases",
      "Idle or underutilized assets",
      "Obsolete, damaged, or cannibalized assets",
      "Known or suspected financial exposure",
      "Recent write-offs, losses, or unresolved exceptions",
    ],
    documents: [
      "Known asset exception, loss, or discrepancy lists",
      "Recent write-off, disposal, and impairment records",
      "Duplicate, emergency, or replacement purchase reports",
    ],
  },
  {
    number: 5,
    category: "Physical Inventory / FAR Reconciliation",
    question: "How are physical inventories and FAR reconciliations currently performed, and what typically prevents discrepancies from being resolved?",
    keyDetails: [
      "Date and scope of last physical inventory",
      "Inventory method, tools, and personnel used",
      "FAR reconciliation owner",
      "Common exception types",
      "Approximate unresolved exception volume",
      "Investigation and resolution process",
      "Evidence and approvals required for FAR changes",
      "Main obstacles to timely resolution",
    ],
    documents: [
      "Most recent physical-inventory results",
      "Reconciliation workbook, matching rules, or methodology",
      "Open exception, adjustment, and approval logs",
    ],
  },
  {
    number: 6,
    category: "Systems / Roles / Governance",
    question: "What systems, departments, and individuals currently share responsibility for managing asset information?",
    keyDetails: [
      "Systems containing relevant asset information",
      "Authoritative system of record after reconciliation",
      "Departments responsible for asset data",
      "FAR owner, data steward, and system administrator",
      "Asset custodians and local department owners",
      "Required user roles and access permissions",
      "Available exports, integrations, APIs, or data dictionaries",
      "Cybersecurity, privacy, retention, or regulatory requirements",
    ],
    documents: [
      "Asset-management policies and responsibility assignments",
      "Relevant system exports, field lists, and data dictionaries",
      "User-role, access-control, and security requirements",
    ],
  },
  {
    number: 7,
    category: "Desired Outcomes / Success Measures",
    question: "What operational, financial, audit, compliance, or governance improvements would leadership expect from this engagement?",
    keyDetails: [
      "Highest-priority engagement outcome",
      "Desired FAR accuracy or asset-visibility target",
      "Expected recovery or cost-avoidance outcome",
      "Required operational improvement",
      "Audit, compliance, or governance objective",
      "Required dashboards and executive reports",
      "Success measures or key performance indicators",
      "Decision-maker who will accept the results",
    ],
    documents: [
      "Relevant strategic goals, audit commitments, or improvement plans",
      "Current KPI definitions, dashboards, or reporting templates",
      "Required deliverable, acceptance, or reporting standards",
    ],
  },
  {
    number: 8,
    category: "Engagement Scope / Tagging / Delivery",
    question: "What locations, asset categories, access limitations, technology requirements, and completion deadlines should LAI consider when defining the engagement?",
    keyDetails: [
      "Estimated asset count and primary asset classes",
      "Locations, departments, and geographic scope",
      "Included and excluded assets or ownership types",
      "Requested start date, completion date, and blackout periods",
      "Percentage currently tagged and existing tag type",
      "Required new, replacement, secondary, or virtual tags",
      "Tag environment, surface, durability, and placement requirements",
      "Site access, escorts, safety, PPE, and operating restrictions",
      "LAI asset-management users, permissions, and security needs",
    ],
    documents: [
      "Location lists, floor plans, room lists, and site contacts",
      "Existing tag specifications, numbering standards, and photographs",
      "Operating calendars, safety rules, and access requirements",
      "Source-system exports needed for Phase 2 implementation",
    ],
  },
];

// ─── State Type ───────────────────────────────────────────────────────────────

interface SectionState {
  interviewNotes: string;
  keyDetails: Record<string, string>;
  documents: DocRequest[];
}

function createInitialState(): Record<number, SectionState> {
  const state: Record<number, SectionState> = {};
  for (const section of SECTIONS) {
    const keyDetails: Record<string, string> = {};
    for (const detail of section.keyDetails) {
      keyDetails[detail] = "";
    }
    const documents: DocRequest[] = section.documents.map(label => ({
      label,
      requested: "",
      received: "",
      date: "",
    }));
    state[section.number] = { interviewNotes: "", keyDetails, documents };
  }
  return state;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function InvestigativeQuestionnaire({ onBack }: { onBack: () => void }) {
  const [clientName, setClientName] = useState("");
  const [interviewerName, setInterviewerName] = useState("");
  const [interviewDate, setInterviewDate] = useState(new Date().toISOString().split("T")[0]);
  const [sections, setSections] = useState<Record<number, SectionState>>(createInitialState);
  const [activeSection, setActiveSection] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const updateNotes = (sectionNum: number, value: string) => {
    setSections(prev => ({
      ...prev,
      [sectionNum]: { ...prev[sectionNum], interviewNotes: value },
    }));
  };

  const updateDetail = (sectionNum: number, key: string, value: string) => {
    setSections(prev => ({
      ...prev,
      [sectionNum]: {
        ...prev[sectionNum],
        keyDetails: { ...prev[sectionNum].keyDetails, [key]: value },
      },
    }));
  };

  const updateDoc = (sectionNum: number, docIndex: number, field: keyof DocRequest, value: string) => {
    setSections(prev => {
      const newDocs = [...prev[sectionNum].documents];
      newDocs[docIndex] = { ...newDocs[docIndex], [field]: value };
      return { ...prev, [sectionNum]: { ...prev[sectionNum], documents: newDocs } };
    });
  };

  const handlePrint = () => {
    if (!resultsRef.current) return;
    const htmlContent = resultsRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>LAI Client Interview Questionnaire - ${clientName}</title>
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
      setTimeout(() => printWindow.print(), 800);
    }
  };

  // ─── Results View ───────────────────────────────────────────────────────────
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

        <div ref={resultsRef} style={{ background: "white", color: "#1E293B", padding: "2.5rem", borderRadius: 8, border: `1px solid ${C.border}`, maxWidth: 900, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: `3px solid ${C.gold}` }}>
            <div>
              <img src={LOGO_BASE64} alt="Legacy Asset Intelligence" style={{ height: 50, marginBottom: "0.5rem" }} />
              <p style={{ fontSize: "0.8rem", color: C.muted }}>Asset Intelligence & Capital Recovery</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.slate, marginBottom: "0.25rem" }}>Client Interview Questionnaire</h1>
              <p style={{ fontSize: "0.85rem", color: C.muted }}>Date: {interviewDate}</p>
              <p style={{ fontSize: "0.85rem", color: C.muted }}>CONFIDENTIAL</p>
            </div>
          </div>

          {/* Client Info */}
          <div style={{ marginBottom: "1.5rem", padding: "1rem", background: C.cardBg, borderRadius: 8 }}>
            <p><strong>Client:</strong> {clientName || "—"}</p>
            <p><strong>Interviewer:</strong> {interviewerName || "—"}</p>
            <p><strong>Date:</strong> {interviewDate}</p>
          </div>

          {/* Each Section */}
          {SECTIONS.map(section => {
            const state = sections[section.number];
            return (
              <div key={section.number} style={{ marginBottom: "2rem", pageBreakInside: "avoid" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.5rem", paddingBottom: "0.25rem", borderBottom: `1px solid ${C.border}` }}>
                  {section.number}. {section.category}
                </h3>
                <p style={{ fontSize: "0.85rem", fontWeight: 600, fontStyle: "italic", color: C.muted, marginBottom: "0.75rem" }}>
                  {section.question}
                </p>

                {/* Interview Notes */}
                {state.interviewNotes && (
                  <div style={{ marginBottom: "0.75rem" }}>
                    <p style={{ fontSize: "0.8rem", fontWeight: 700, color: C.teal, marginBottom: "0.25rem" }}>Interview Notes:</p>
                    <p style={{ fontSize: "0.85rem", whiteSpace: "pre-wrap", paddingLeft: "0.75rem", borderLeft: `2px solid ${C.teal}` }}>{state.interviewNotes}</p>
                  </div>
                )}

                {/* Key Details */}
                <div style={{ marginBottom: "0.75rem" }}>
                  <p style={{ fontSize: "0.8rem", fontWeight: 700, color: C.teal, marginBottom: "0.25rem" }}>Key Details:</p>
                  {section.keyDetails.map((detail, i) => {
                    const val = state.keyDetails[detail];
                    return (
                      <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.2rem", fontSize: "0.85rem" }}>
                        <span style={{ fontWeight: 600, minWidth: "40%" }}>{detail}:</span>
                        <span style={{ color: val ? C.text : C.muted }}>{val || "—"}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Supporting Documents */}
                <div>
                  <p style={{ fontSize: "0.8rem", fontWeight: 700, color: C.teal, marginBottom: "0.25rem" }}>Supporting Documents / Evidence:</p>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                    <thead>
                      <tr style={{ background: C.cardBg }}>
                        <th style={{ textAlign: "left", padding: "0.3rem 0.5rem", borderBottom: `1px solid ${C.border}` }}>Document</th>
                        <th style={{ textAlign: "center", padding: "0.3rem 0.5rem", borderBottom: `1px solid ${C.border}`, width: 70 }}>Requested</th>
                        <th style={{ textAlign: "center", padding: "0.3rem 0.5rem", borderBottom: `1px solid ${C.border}`, width: 70 }}>Received</th>
                        <th style={{ textAlign: "center", padding: "0.3rem 0.5rem", borderBottom: `1px solid ${C.border}`, width: 90 }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.documents.map((doc, di) => (
                        <tr key={di}>
                          <td style={{ padding: "0.3rem 0.5rem", borderBottom: `1px solid ${C.border}` }}>{doc.label}</td>
                          <td style={{ textAlign: "center", padding: "0.3rem 0.5rem", borderBottom: `1px solid ${C.border}` }}>{doc.requested || "—"}</td>
                          <td style={{ textAlign: "center", padding: "0.3rem 0.5rem", borderBottom: `1px solid ${C.border}` }}>{doc.received || "—"}</td>
                          <td style={{ textAlign: "center", padding: "0.3rem 0.5rem", borderBottom: `1px solid ${C.border}` }}>{doc.date || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* Footer */}
          <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
            <p style={{ fontSize: "0.75rem", color: C.muted }}>Legacy Asset Intelligence | Johnson City, TN | legacyassetintelligence.com</p>
            <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.25rem" }}>This document is confidential and intended solely for the named recipient.</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Input Form ─────────────────────────────────────────────────────────────
  const currentSection = SECTIONS.find(s => s.number === activeSection)!;
  const currentState = sections[activeSection];

  return (
    <div style={{ padding: "1.5rem", maxWidth: 950, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.slate }}>Client Interview Questionnaire</h2>
        <button onClick={onBack} style={{ padding: "0.5rem 1rem", background: "#E2E8F0", color: C.text, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
          ← Back to Portal
        </button>
      </div>

      {/* Client Info Header */}
      <div style={{ marginBottom: "1.5rem", padding: "1rem", background: C.cardBg, borderRadius: 8, border: `1px solid ${C.border}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          <div><label style={labelStyle}>Client / Organization</label><input style={inputStyle} value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Enter client name" /></div>
          <div><label style={labelStyle}>Interviewer Name</label><input style={inputStyle} value={interviewerName} onChange={e => setInterviewerName(e.target.value)} placeholder="LAI interviewer" /></div>
          <div><label style={labelStyle}>Date</label><input style={inputStyle} type="date" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} /></div>
        </div>
      </div>

      {/* Section Navigation */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
        {SECTIONS.map(s => (
          <button
            key={s.number}
            onClick={() => setActiveSection(s.number)}
            style={{
              padding: "0.4rem 0.75rem",
              background: activeSection === s.number ? C.slate : "white",
              color: activeSection === s.number ? "white" : C.text,
              border: `1px solid ${activeSection === s.number ? C.slate : C.border}`,
              borderRadius: 6,
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          >
            {s.number}. {s.category}
          </button>
        ))}
      </div>

      {/* Active Section */}
      <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.5rem" }}>
        <h3 style={sectionTitleStyle}>{currentSection.number}. {currentSection.category}</h3>
        <p style={{ fontSize: "0.9rem", fontWeight: 600, color: C.slate, marginBottom: "1.5rem", fontStyle: "italic" }}>
          {currentSection.question}
        </p>

        {/* Interview Notes */}
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={subheadingStyle}>Interview Notes</p>
          <textarea
            style={{ ...textareaStyle, minHeight: "8rem" }}
            value={currentState.interviewNotes}
            onChange={e => updateNotes(activeSection, e.target.value)}
            placeholder="Capture free-form interview notes here..."
          />
        </div>

        {/* Key Details to Capture */}
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={subheadingStyle}>Key Details to Capture</p>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {currentSection.keyDetails.map((detail, i) => (
              <div key={i}>
                <label style={labelStyle}>{detail}</label>
                <input
                  style={inputStyle}
                  value={currentState.keyDetails[detail]}
                  onChange={e => updateDetail(activeSection, detail, e.target.value)}
                  placeholder={`Enter ${detail.toLowerCase()}...`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Supporting Documents / Evidence to Request */}
        <div>
          <p style={subheadingStyle}>Supporting Documents / Evidence to Request</p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ background: C.cardBg }}>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: `1px solid ${C.border}` }}>Document</th>
                <th style={{ textAlign: "center", padding: "0.5rem", borderBottom: `1px solid ${C.border}`, width: 90 }}>Requested</th>
                <th style={{ textAlign: "center", padding: "0.5rem", borderBottom: `1px solid ${C.border}`, width: 90 }}>Received</th>
                <th style={{ textAlign: "center", padding: "0.5rem", borderBottom: `1px solid ${C.border}`, width: 110 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {currentState.documents.map((doc, di) => (
                <tr key={di}>
                  <td style={{ padding: "0.5rem", borderBottom: `1px solid ${C.border}`, fontSize: "0.85rem" }}>{doc.label}</td>
                  <td style={{ padding: "0.25rem", borderBottom: `1px solid ${C.border}` }}>
                    <select
                      style={{ ...inputStyle, padding: "0.25rem", fontSize: "0.8rem", textAlign: "center" }}
                      value={doc.requested}
                      onChange={e => updateDoc(activeSection, di, "requested", e.target.value)}
                    >
                      <option value="">—</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td style={{ padding: "0.25rem", borderBottom: `1px solid ${C.border}` }}>
                    <select
                      style={{ ...inputStyle, padding: "0.25rem", fontSize: "0.8rem", textAlign: "center" }}
                      value={doc.received}
                      onChange={e => updateDoc(activeSection, di, "received", e.target.value)}
                    >
                      <option value="">—</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td style={{ padding: "0.25rem", borderBottom: `1px solid ${C.border}` }}>
                    <input
                      type="date"
                      style={{ ...inputStyle, padding: "0.25rem", fontSize: "0.8rem" }}
                      value={doc.date}
                      onChange={e => updateDoc(activeSection, di, "date", e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation & Generate */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
        <button
          onClick={() => setActiveSection(Math.max(1, activeSection - 1))}
          disabled={activeSection === 1}
          style={{
            padding: "0.6rem 1.2rem",
            background: activeSection === 1 ? "#E2E8F0" : C.slate,
            color: activeSection === 1 ? C.muted : "white",
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
            cursor: activeSection === 1 ? "default" : "pointer",
            fontSize: "0.85rem",
            opacity: activeSection === 1 ? 0.5 : 1,
          }}
        >
          ← Previous Section
        </button>

        {activeSection === 8 ? (
          <button
            onClick={() => setShowResults(true)}
            style={{
              padding: "0.6rem 1.5rem",
              background: C.gold,
              color: "white",
              border: "none",
              borderRadius: 6,
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Generate Printable Document
          </button>
        ) : (
          <button
            onClick={() => setActiveSection(Math.min(8, activeSection + 1))}
            style={{
              padding: "0.6rem 1.2rem",
              background: C.teal,
              color: "white",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Next Section →
          </button>
        )}
      </div>
    </div>
  );
}
