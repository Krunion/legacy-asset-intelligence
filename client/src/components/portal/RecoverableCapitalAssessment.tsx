/**
 * LAI Recoverable Capital Assessment - Interactive Employee Portal Form
 * Quick assessment to estimate recoverable capital with printable results
 */

import { useState, useRef } from "react";

const LOGO_URL = "/manus-storage/pasted_file_yudYZ7_image_transparent_32d3d4e2.png";

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

interface FormData {
  clientName: string;
  contactName: string;
  industry: string;
  totalAssetValue: string;
  totalAssetCount: string;
  locations: string;
  lastAuditYears: string;
  recordAccuracy: string;
  ghostAssetEstimate: string;
  duplicatePurchases: string;
  insuranceOverpay: string;
  maintenanceWaste: string;
  taxOverpay: string;
}

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

export default function RecoverableCapitalAssessment({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<FormData>({
    clientName: "",
    contactName: "",
    industry: "",
    totalAssetValue: "",
    totalAssetCount: "",
    locations: "",
    lastAuditYears: "3",
    recordAccuracy: "moderate",
    ghostAssetEstimate: "15",
    duplicatePurchases: "5",
    insuranceOverpay: "10",
    maintenanceWaste: "8",
    taxOverpay: "12",
  });

  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const update = (key: keyof FormData, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  // Calculations
  const assetValue = parseFloat(data.totalAssetValue) || 0;
  const ghostPct = parseFloat(data.ghostAssetEstimate) / 100;
  const dupPct = parseFloat(data.duplicatePurchases) / 100;
  const insPct = parseFloat(data.insuranceOverpay) / 100;
  const maintPct = parseFloat(data.maintenanceWaste) / 100;
  const taxPct = parseFloat(data.taxOverpay) / 100;

  const ghostRecovery = assetValue * ghostPct;
  const dupRecovery = assetValue * dupPct;
  const insRecovery = assetValue * insPct * 0.02; // insurance is ~2% of value
  const maintRecovery = assetValue * maintPct * 0.05; // maintenance ~5% of value
  const taxRecovery = assetValue * taxPct * 0.015; // property tax ~1.5% of value
  const totalRecovery = ghostRecovery + dupRecovery + insRecovery + maintRecovery + taxRecovery;

  const handlePrint = () => {
    if (resultsRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>LAI Recoverable Capital Assessment - ${data.clientName}</title>
              <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Source Sans 3', sans-serif; color: #1E293B; padding: 40px; }
                @media print { body { padding: 20px; } }
              </style>
            </head>
            <body>${resultsRef.current.innerHTML}</body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
      }
    }
  };

  if (showResults) {
    return (
      <div style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <button onClick={() => setShowResults(false)} style={{ padding: "0.6rem 1.2rem", background: "#E2E8F0", color: C.text, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>← Edit Inputs</button>
          <button onClick={handlePrint} style={{ padding: "0.6rem 1.2rem", background: C.gold, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>🖨️ Print Report</button>
          <button onClick={onBack} style={{ padding: "0.6rem 1.2rem", background: C.slate, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>← Back to Portal</button>
        </div>

        <div ref={resultsRef} style={{ background: "white", padding: "2.5rem", borderRadius: 8, border: `1px solid ${C.border}`, maxWidth: 850, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: `3px solid ${C.gold}` }}>
            <div>
              <img src={LOGO_URL} alt="Legacy Asset Intelligence" style={{ height: 50, marginBottom: "0.5rem" }} />
              <p style={{ fontSize: "0.8rem", color: C.muted }}>Asset Intelligence & Capital Recovery</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.slate }}>Recoverable Capital Assessment</h1>
              <p style={{ fontSize: "0.85rem", color: C.muted }}>Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Client Info */}
          <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#F8FAFC", borderRadius: 8 }}>
            <p><strong>Client:</strong> {data.clientName || "—"}</p>
            <p><strong>Contact:</strong> {data.contactName || "—"}</p>
            <p><strong>Industry:</strong> {data.industry || "—"}</p>
            <p><strong>Total Asset Value:</strong> {formatCurrency(assetValue)}</p>
            <p><strong>Asset Count:</strong> {data.totalAssetCount || "—"}</p>
            <p><strong>Locations:</strong> {data.locations || "—"}</p>
          </div>

          {/* Total Recovery */}
          <div style={{ marginBottom: "2rem", padding: "1.5rem", background: "rgba(13, 148, 136, 0.05)", borderRadius: 8, border: `2px solid ${C.teal}`, textAlign: "center" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: C.muted, marginBottom: "0.25rem" }}>ESTIMATED TOTAL RECOVERABLE CAPITAL</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2.5rem", fontWeight: 700, color: C.teal }}>{formatCurrency(totalRecovery)}</p>
            <p style={{ fontSize: "0.85rem", color: C.muted, marginTop: "0.5rem" }}>Based on {formatCurrency(assetValue)} total asset value</p>
          </div>

          {/* Breakdown Table */}
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "1rem" }}>Recovery Breakdown</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: C.slate, color: "white" }}>
                <th style={{ padding: "0.7rem", textAlign: "left" }}>Recovery Category</th>
                <th style={{ padding: "0.7rem", textAlign: "center" }}>Rate</th>
                <th style={{ padding: "0.7rem", textAlign: "right" }}>Estimated Recovery</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "0.7rem", fontWeight: 600 }}>Ghost Asset Elimination</td>
                <td style={{ padding: "0.7rem", textAlign: "center" }}>{data.ghostAssetEstimate}%</td>
                <td style={{ padding: "0.7rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(ghostRecovery)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "0.7rem", fontWeight: 600 }}>Duplicate Purchase Prevention</td>
                <td style={{ padding: "0.7rem", textAlign: "center" }}>{data.duplicatePurchases}%</td>
                <td style={{ padding: "0.7rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(dupRecovery)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "0.7rem", fontWeight: 600 }}>Insurance Premium Reduction</td>
                <td style={{ padding: "0.7rem", textAlign: "center" }}>{data.insuranceOverpay}%</td>
                <td style={{ padding: "0.7rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(insRecovery)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "0.7rem", fontWeight: 600 }}>Maintenance Contract Optimization</td>
                <td style={{ padding: "0.7rem", textAlign: "center" }}>{data.maintenanceWaste}%</td>
                <td style={{ padding: "0.7rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(maintRecovery)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "0.7rem", fontWeight: 600 }}>Property Tax Correction</td>
                <td style={{ padding: "0.7rem", textAlign: "center" }}>{data.taxOverpay}%</td>
                <td style={{ padding: "0.7rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(taxRecovery)}</td>
              </tr>
              <tr style={{ background: "#F8FAFC" }}>
                <td style={{ padding: "0.7rem", fontWeight: 700, fontSize: "1rem" }} colSpan={2}>TOTAL ESTIMATED RECOVERY</td>
                <td style={{ padding: "0.7rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "1.1rem", color: C.teal }}>{formatCurrency(totalRecovery)}</td>
              </tr>
            </tbody>
          </table>

          {/* Assumptions */}
          <div style={{ padding: "1rem", background: "#FFFBEB", borderRadius: 8, border: "1px solid #FDE68A", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.25rem" }}>Assumptions & Notes:</p>
            <ul style={{ fontSize: "0.8rem", color: C.muted, paddingLeft: "1.2rem", lineHeight: 1.6 }}>
              <li>Ghost asset estimates based on industry averages for organizations with {data.lastAuditYears}+ years since last audit</li>
              <li>Insurance savings calculated at 2% of insured asset value</li>
              <li>Maintenance savings calculated at 5% of total asset value</li>
              <li>Property tax savings calculated at 1.5% of taxable asset value</li>
              <li>Actual recovery amounts will be determined during Phase 1 Assessment</li>
            </ul>
          </div>

          {/* Next Steps */}
          <div style={{ padding: "1.25rem", background: "rgba(13, 148, 136, 0.05)", borderRadius: 8, border: `1px solid rgba(13, 148, 136, 0.2)` }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.teal, marginBottom: "0.5rem" }}>Recommended Next Steps</h3>
            <ol style={{ fontSize: "0.9rem", paddingLeft: "1.2rem", lineHeight: 1.8 }}>
              <li>Schedule a Phase 1 Executive Assessment to validate these estimates</li>
              <li>Identify priority recovery areas based on organizational goals</li>
              <li>Develop a phased implementation roadmap</li>
            </ol>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
            <p style={{ fontSize: "0.75rem", color: C.muted }}>Legacy Asset Intelligence | Johnson City, TN | legacyassetintelligence.com</p>
            <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.25rem" }}>This assessment provides estimates only. Actual recovery amounts determined during engagement.</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Input Form ───
  return (
    <div style={{ padding: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.slate }}>Recoverable Capital Assessment</h2>
        <button onClick={onBack} style={{ padding: "0.5rem 1rem", background: "#E2E8F0", color: C.text, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>← Back to Portal</button>
      </div>

      {/* Client Info */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Client Information</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div><label style={labelStyle}>Client / Organization Name</label><input style={inputStyle} value={data.clientName} onChange={e => update("clientName", e.target.value)} placeholder="Enter client name" /></div>
          <div><label style={labelStyle}>Contact Name</label><input style={inputStyle} value={data.contactName} onChange={e => update("contactName", e.target.value)} placeholder="Primary contact" /></div>
          <div><label style={labelStyle}>Industry</label>
            <select style={selectStyle} value={data.industry} onChange={e => update("industry", e.target.value)}>
              <option value="">— Select Industry —</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Healthcare">Healthcare</option>
              <option value="IT / Data Centers">IT / Data Centers</option>
              <option value="Government">Government</option>
              <option value="Education">Education</option>
              <option value="Energy / Utilities">Energy / Utilities</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div><label style={labelStyle}>Number of Locations</label><input style={inputStyle} value={data.locations} onChange={e => update("locations", e.target.value)} placeholder="e.g., 5" /></div>
        </div>
      </div>

      {/* Asset Information */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Asset Information</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div><label style={labelStyle}>Total Asset Value ($)</label><input style={inputStyle} type="number" value={data.totalAssetValue} onChange={e => update("totalAssetValue", e.target.value)} placeholder="e.g., 5000000" /></div>
          <div><label style={labelStyle}>Total Asset Count</label><input style={inputStyle} value={data.totalAssetCount} onChange={e => update("totalAssetCount", e.target.value)} placeholder="e.g., 2500" /></div>
          <div><label style={labelStyle}>Years Since Last Comprehensive Audit</label>
            <select style={selectStyle} value={data.lastAuditYears} onChange={e => update("lastAuditYears", e.target.value)}>
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="5">5+ years</option>
              <option value="10">Never conducted</option>
            </select>
          </div>
          <div><label style={labelStyle}>Record Accuracy Level</label>
            <select style={selectStyle} value={data.recordAccuracy} onChange={e => update("recordAccuracy", e.target.value)}>
              <option value="poor">Poor (less than 50% accurate)</option>
              <option value="low">Low (50-70% accurate)</option>
              <option value="moderate">Moderate (70-85% accurate)</option>
              <option value="good">Good (85-95% accurate)</option>
              <option value="excellent">Excellent (95%+ accurate)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recovery Estimates */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Recovery Estimates (Adjust as needed)</h3>
        <p style={{ fontSize: "0.85rem", color: C.muted, marginBottom: "1rem" }}>These percentages represent the estimated portion of assets affected in each category. Adjust based on your assessment of the client's situation.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div><label style={labelStyle}>Ghost Asset Estimate (%)</label><input style={inputStyle} type="number" min="0" max="50" value={data.ghostAssetEstimate} onChange={e => update("ghostAssetEstimate", e.target.value)} /></div>
          <div><label style={labelStyle}>Duplicate Purchase Rate (%)</label><input style={inputStyle} type="number" min="0" max="30" value={data.duplicatePurchases} onChange={e => update("duplicatePurchases", e.target.value)} /></div>
          <div><label style={labelStyle}>Insurance Overpayment (%)</label><input style={inputStyle} type="number" min="0" max="30" value={data.insuranceOverpay} onChange={e => update("insuranceOverpay", e.target.value)} /></div>
          <div><label style={labelStyle}>Maintenance Waste (%)</label><input style={inputStyle} type="number" min="0" max="30" value={data.maintenanceWaste} onChange={e => update("maintenanceWaste", e.target.value)} /></div>
          <div><label style={labelStyle}>Property Tax Overpayment (%)</label><input style={inputStyle} type="number" min="0" max="30" value={data.taxOverpay} onChange={e => update("taxOverpay", e.target.value)} /></div>
        </div>
      </div>

      {/* Live Preview */}
      {assetValue > 0 && (
        <div style={{ marginBottom: "2rem", padding: "1.25rem", background: "rgba(13, 148, 136, 0.05)", borderRadius: 8, border: `1px solid rgba(13, 148, 136, 0.2)` }}>
          <p style={{ fontSize: "0.85rem", fontWeight: 600, color: C.teal, marginBottom: "0.5rem" }}>Live Estimate Preview</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.5rem", fontWeight: 700, color: C.teal }}>Total Recovery: {formatCurrency(totalRecovery)}</p>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={() => setShowResults(true)}
        disabled={!assetValue}
        style={{
          width: "100%",
          padding: "1rem",
          background: !assetValue ? "#CBD5E1" : C.gold,
          color: "white",
          border: "none",
          borderRadius: 8,
          fontFamily: "'Source Sans 3', sans-serif",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: !assetValue ? "not-allowed" : "pointer",
        }}
      >
        Generate Capital Assessment Report
      </button>
    </div>
  );
}
