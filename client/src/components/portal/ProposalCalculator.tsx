/**
 * LAI Total Engagement Billing Calculator
 * Replaces old proposal calculator with exact pricing model from Excel spreadsheet.
 * Features:
 * - Progressive asset pricing (6 tiers)
 * - Geographic multiplier
 * - Recoverable capital fee (progressive brackets)
 * - Phase 4 governance (by asset count)
 * - Asset Panda coordination fee (include/waive)
 * - Internal Feasibility (separate print page, not client-facing)
 * - Proposal Summary (separate print page, client-facing)
 */

import { useState, useRef } from "react";
import { LOGO_BASE64 } from "./logoBase64";

// ─── Data Tables (from spreadsheet) ─────────────────────────────────────────

const ASSET_TIERS = [
  { label: "Tier 1", lower: 1, upper: 10000, rate: 7.00 },
  { label: "Tier 2", lower: 10001, upper: 25000, rate: 6.75 },
  { label: "Tier 3", lower: 25001, upper: 50000, rate: 6.00 },
  { label: "Tier 4", lower: 50001, upper: 100000, rate: 5.25 },
  { label: "Tier 5", lower: 100001, upper: 250000, rate: 4.75 },
  { label: "Tier 6", lower: 250001, upper: 999999999, rate: 4.00 },
];

const RECOVERABLE_BRACKETS = [
  { label: "Included", lower: 0, upper: 500000, rate: 0.0 },
  { label: "Bracket 1", lower: 500000, upper: 2000000, rate: 0.05 },
  { label: "Bracket 2", lower: 2000000, upper: 5000000, rate: 0.025 },
  { label: "Bracket 3", lower: 5000000, upper: 10000000, rate: 0.015 },
  { label: "Bracket 4", lower: 10000000, upper: 999999999, rate: 0.01 },
];

const GEO_MULTIPLIERS = [
  { label: "Local", multiplier: 1.00 },
  { label: "Regional", multiplier: 1.05 },
  { label: "Multi-State", multiplier: 1.10 },
  { label: "National", multiplier: 1.15 },
];

const PHASE4_TIERS = [
  { label: "Small", lower: 1, upper: 25000, fee: 30000 },
  { label: "Mid", lower: 25001, upper: 100000, fee: 60000 },
  { label: "Large", lower: 100001, upper: 250000, fee: 90000 },
  { label: "Enterprise", lower: 250001, upper: 999999999, fee: 120000 },
];

const INDUSTRIES = [
  "Healthcare / Hospital",
  "Manufacturing",
  "Distribution / Warehouse",
  "Logistics / Transportation",
  "Government / Public Sector",
  "Education / University",
  "Utilities / Energy",
  "Construction / Contractor",
  "Hospitality",
  "Retail / Multi-Location",
  "Financial Services",
  "Technology / SaaS",
  "Aviation",
  "Real Estate / Property Management",
  "Nonprofit",
  "Other",
];

const MINIMUM_ENGAGEMENT_FEE = 40000;
const ASSET_PANDA_FEE = 5000;

// ─── Internal Cost Assumptions ──────────────────────────────────────────────

const COST_ASSUMPTIONS = {
  fieldProductivity: 200, // assets/person/day
  fieldContractorPay: 30, // $/hour
  reconciliationPay: 30, // $/hour
  qaPay: 30, // $/hour
  pmPay: 60, // $/hour
  workdayHours: 8, // hours/day
  reconciliationPct: 0.30,
  qaPct: 0.08,
  pmPct: 0.06,
  travelingLeaders: 2,
  weeklyTravelPackage: 1990, // $/week per leader
  overheadPct: 0.15,
};

// ─── Calculation Functions ──────────────────────────────────────────────────

function calculateProgressiveAssetFee(assetCount: number): { total: number; breakdown: { tier: string; assets: number; rate: number; charge: number }[] } {
  let remaining = assetCount;
  const breakdown: { tier: string; assets: number; rate: number; charge: number }[] = [];
  let total = 0;

  for (const tier of ASSET_TIERS) {
    if (remaining <= 0) break;
    const tierWidth = tier.upper - tier.lower + 1;
    const assetsInTier = Math.min(remaining, tierWidth);
    const charge = assetsInTier * tier.rate;
    breakdown.push({ tier: tier.label, assets: assetsInTier, rate: tier.rate, charge });
    total += charge;
    remaining -= assetsInTier;
  }

  return { total, breakdown };
}

function calculateRecoverableCapitalFee(capital: number): { total: number; effectiveRate: number } {
  let remaining = capital;
  let total = 0;

  for (const bracket of RECOVERABLE_BRACKETS) {
    if (remaining <= 0) break;
    const bracketWidth = bracket.upper - bracket.lower;
    const amountInBracket = Math.min(remaining, bracketWidth);
    total += amountInBracket * bracket.rate;
    remaining -= amountInBracket;
  }

  const effectiveRate = capital > 0 ? (total / capital) * 100 : 0;
  return { total, effectiveRate };
}

function getPhase4Fee(assetCount: number): number {
  for (const tier of PHASE4_TIERS) {
    if (assetCount >= tier.lower && assetCount <= tier.upper) return tier.fee;
  }
  return 120000;
}

function calculateInternalFeasibility(totalRevenue: number, assetCount: number, projectWeeks: number) {
  const { fieldProductivity, fieldContractorPay, reconciliationPay, qaPay, pmPay, workdayHours, reconciliationPct, qaPct, pmPct, travelingLeaders, weeklyTravelPackage, overheadPct } = COST_ASSUMPTIONS;

  const fieldHours = (assetCount / fieldProductivity) * workdayHours;
  const fieldPayroll = fieldHours * fieldContractorPay;
  const reconciliationPayroll = fieldHours * reconciliationPct * reconciliationPay;
  const qaPayroll = fieldHours * qaPct * qaPay;
  const pmPayroll = fieldHours * pmPct * pmPay;
  const leadershipTravel = travelingLeaders * projectWeeks * weeklyTravelPackage;
  const overhead = totalRevenue * overheadPct;
  const totalCost = fieldPayroll + reconciliationPayroll + qaPayroll + pmPayroll + leadershipTravel + overhead;
  const profit = totalRevenue - totalCost;
  const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  return {
    fieldHours,
    fieldPayroll,
    reconciliationPayroll,
    qaPayroll,
    pmPayroll,
    leadershipTravel,
    overhead,
    totalCost,
    profit,
    margin,
  };
}

// ─── Formatting Helpers ─────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtFull(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtNum(n: number): string {
  return n.toLocaleString("en-US");
}

function fmtPct(n: number): string {
  return n.toFixed(1) + "%";
}

// ─── Colors ─────────────────────────────────────────────────────────────────

const C = {
  charcoal: "#0F1419",
  slate: "#1E3A5F",
  teal: "#0D9488",
  gold: "#D4AF37",
  bg: "#FFFFFF",
  cardBg: "#F8FAFC",
  border: "#E2E8F0",
  text: "#1E293B",
  muted: "#64748B",
};

// ─── Styles ─────────────────────────────────────────────────────────────────

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

// ─── Interfaces ─────────────────────────────────────────────────────────────

interface CalcInputs {
  clientName: string;
  industry: string;
  estimatedAssetCount: number;
  numberOfLocations: number;
  geoScope: number;
  estimatedRecoverableCapital: number;
  includeRecoverableFee: boolean;
  includePhase4: boolean;
  includeAssetPanda: boolean;
  waiveAssetPanda: boolean;
  projectWeeks: number;
  notes: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ProposalCalculator({ onBack }: { onBack: () => void }) {
  const [inputs, setInputs] = useState<CalcInputs>({
    clientName: "",
    industry: "Manufacturing",
    estimatedAssetCount: 10000,
    numberOfLocations: 1,
    geoScope: 0,
    estimatedRecoverableCapital: 500000,
    includeRecoverableFee: true,
    includePhase4: true,
    includeAssetPanda: true,
    waiveAssetPanda: true,
    projectWeeks: 12,
    notes: "",
  });

  const [showOutput, setShowOutput] = useState(false);
  const feasibilityRef = useRef<HTMLDivElement>(null);
  const proposalRef = useRef<HTMLDivElement>(null);

  const update = (key: keyof CalcInputs, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  // ─── Calculations ───────────────────────────────────────────────────────────

  const assetFee = calculateProgressiveAssetFee(inputs.estimatedAssetCount);
  const geoMultiplier = GEO_MULTIPLIERS[inputs.geoScope];
  const geoAdjustment = assetFee.total * (geoMultiplier.multiplier - 1);
  const baseWithGeo = assetFee.total + geoAdjustment;

  const recoverableFee = inputs.includeRecoverableFee
    ? calculateRecoverableCapitalFee(inputs.estimatedRecoverableCapital)
    : { total: 0, effectiveRate: 0 };

  const phase4Fee = inputs.includePhase4 ? getPhase4Fee(inputs.estimatedAssetCount) : 0;

  const assetPandaFee = inputs.includeAssetPanda && !inputs.waiveAssetPanda ? ASSET_PANDA_FEE : 0;

  const totalBeforeMinimum = baseWithGeo + recoverableFee.total + phase4Fee + assetPandaFee;
  const totalInvestment = Math.max(totalBeforeMinimum, MINIMUM_ENGAGEMENT_FEE);

  const effectiveRate = inputs.estimatedAssetCount > 0 ? totalInvestment / inputs.estimatedAssetCount : 0;

  const feasibility = calculateInternalFeasibility(totalInvestment, inputs.estimatedAssetCount, inputs.projectWeeks);

  const firstYearROI = inputs.estimatedRecoverableCapital > 0
    ? ((inputs.estimatedRecoverableCapital - totalInvestment) / totalInvestment) * 100
    : 0;
  const netBenefit = inputs.estimatedRecoverableCapital - totalInvestment;
  const returnMultiple = totalInvestment > 0 ? inputs.estimatedRecoverableCapital / totalInvestment : 0;

  // 3-year: governance saves ~15% of recoverable capital annually years 2-3
  const year2_3Savings = inputs.includePhase4 ? inputs.estimatedRecoverableCapital * 0.15 * 2 : 0;
  const threeYearBenefit = netBenefit + year2_3Savings;
  const threeYearROI = totalInvestment > 0 ? (threeYearBenefit / totalInvestment) * 100 : 0;
  const threeYearMultiple = totalInvestment > 0 ? (inputs.estimatedRecoverableCapital + year2_3Savings) / totalInvestment : 0;

  // ─── Print Handler ──────────────────────────────────────────────────────────

  const handlePrint = (section: "feasibility" | "proposal" | "both") => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    let content = "";
    if (section === "feasibility" || section === "both") {
      content += feasibilityRef.current?.innerHTML || "";
    }
    if (section === "both") {
      content += '<div style="page-break-before: always;"></div>';
    }
    if (section === "proposal" || section === "both") {
      content += proposalRef.current?.innerHTML || "";
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>LAI ${section === "feasibility" ? "Internal Feasibility" : section === "proposal" ? "Proposal Summary" : "Full Report"} - ${inputs.clientName || "Client"}</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Source Sans 3', sans-serif; color: #1E293B; padding: 40px; }
            img { max-height: 50px; }
            table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
            th, td { padding: 0.5rem 0.75rem; text-align: left; border-bottom: 1px solid #E2E8F0; font-size: 0.85rem; }
            th { background: #F8FAFC; font-weight: 600; }
            .page-break { page-break-before: always; }
            @media print {
              body { padding: 20px; }
              .page-break { page-break-before: always; }
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 800);
  };

  // ─── Input Form ─────────────────────────────────────────────────────────────

  if (!showOutput) {
    return (
      <div style={{ padding: "1.5rem", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: C.slate }}>←</button>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.slate }}>
              Total Engagement Billing Calculator
            </h1>
            <p style={{ color: C.muted, fontSize: "0.85rem" }}>LAI Progressive Pricing Model</p>
          </div>
        </div>

        {/* Client Information */}
        <div style={{ ...sectionTitleStyle }}>Client Information</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <label style={labelStyle}>Client Name</label>
            <input style={inputStyle} value={inputs.clientName} onChange={e => update("clientName", e.target.value)} placeholder="e.g., Johnson & Johnson" />
          </div>
          <div>
            <label style={labelStyle}>Industry</label>
            <select style={selectStyle} value={inputs.industry} onChange={e => update("industry", e.target.value)}>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Estimated Asset Count</label>
            <input style={inputStyle} type="number" value={inputs.estimatedAssetCount} onChange={e => update("estimatedAssetCount", Number(e.target.value))} min={1} />
          </div>
          <div>
            <label style={labelStyle}>Number of Locations</label>
            <input style={inputStyle} type="number" value={inputs.numberOfLocations} onChange={e => update("numberOfLocations", Number(e.target.value))} min={1} />
          </div>
          <div>
            <label style={labelStyle}>Geographic Scope</label>
            <select style={selectStyle} value={inputs.geoScope} onChange={e => update("geoScope", Number(e.target.value))}>
              {GEO_MULTIPLIERS.map((g, i) => <option key={g.label} value={i}>{g.label} ({g.multiplier}x)</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Estimated Recoverable Capital</label>
            <input style={inputStyle} type="number" value={inputs.estimatedRecoverableCapital} onChange={e => update("estimatedRecoverableCapital", Number(e.target.value))} min={0} />
          </div>
        </div>

        {/* Engagement Options */}
        <div style={{ ...sectionTitleStyle }}>Engagement Options</div>
        <div style={{ display: "grid", gap: "0.75rem", marginBottom: "2rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
            <input type="checkbox" checked={inputs.includeRecoverableFee} onChange={e => update("includeRecoverableFee", e.target.checked)} />
            <span style={{ fontSize: "0.9rem", color: C.text }}>Include Recoverable Capital Fee</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
            <input type="checkbox" checked={inputs.includePhase4} onChange={e => update("includePhase4", e.target.checked)} />
            <span style={{ fontSize: "0.9rem", color: C.text }}>Include Phase 4 Governance (Annual)</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
            <input type="checkbox" checked={inputs.includeAssetPanda} onChange={e => update("includeAssetPanda", e.target.checked)} />
            <span style={{ fontSize: "0.9rem", color: C.text }}>Include Asset Panda Coordination Fee</span>
          </label>
          {inputs.includeAssetPanda && (
            <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", marginLeft: "1.5rem" }}>
              <input type="checkbox" checked={inputs.waiveAssetPanda} onChange={e => update("waiveAssetPanda", e.target.checked)} />
              <span style={{ fontSize: "0.9rem", color: C.muted, fontStyle: "italic" }}>Waive fee (1-year governance agreement)</span>
            </label>
          )}
        </div>

        {/* Internal Planning */}
        <div style={{ ...sectionTitleStyle }}>Internal Planning</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <label style={labelStyle}>Estimated Project Weeks</label>
            <input style={inputStyle} type="number" value={inputs.projectWeeks} onChange={e => update("projectWeeks", Number(e.target.value))} min={1} />
          </div>
          <div>
            <label style={labelStyle}>Notes</label>
            <input style={inputStyle} value={inputs.notes} onChange={e => update("notes", e.target.value)} placeholder="Optional notes" />
          </div>
        </div>

        {/* Live Preview */}
        <div style={{ background: C.cardBg, borderRadius: 8, padding: "1.5rem", border: `1px solid ${C.border}`, marginBottom: "2rem" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "1rem" }}>Live Pricing Preview</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "0.4rem 0", color: C.text }}>Progressive Asset Fee</td>
                <td style={{ padding: "0.4rem 0", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{fmt(assetFee.total)}</td>
              </tr>
              {geoAdjustment > 0 && (
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "0.4rem 0", color: C.text }}>Geographic Adjustment ({geoMultiplier.label} {geoMultiplier.multiplier}x)</td>
                  <td style={{ padding: "0.4rem 0", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{fmt(geoAdjustment)}</td>
                </tr>
              )}
              {inputs.includeRecoverableFee && recoverableFee.total > 0 && (
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "0.4rem 0", color: C.text }}>Recoverable Capital Fee ({fmtPct(recoverableFee.effectiveRate)} effective)</td>
                  <td style={{ padding: "0.4rem 0", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{fmt(recoverableFee.total)}</td>
                </tr>
              )}
              {inputs.includePhase4 && (
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "0.4rem 0", color: C.text }}>Phase 4 Governance (Annual)</td>
                  <td style={{ padding: "0.4rem 0", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{fmt(phase4Fee)}</td>
                </tr>
              )}
              {inputs.includeAssetPanda && (
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "0.4rem 0", color: C.text }}>Asset Panda Coordination</td>
                  <td style={{ padding: "0.4rem 0", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, textDecoration: inputs.waiveAssetPanda ? "line-through" : "none", color: inputs.waiveAssetPanda ? C.muted : C.text }}>
                    {inputs.waiveAssetPanda ? `${fmt(ASSET_PANDA_FEE)} (Waived)` : fmt(ASSET_PANDA_FEE)}
                  </td>
                </tr>
              )}
              <tr style={{ borderTop: `2px solid ${C.gold}` }}>
                <td style={{ padding: "0.6rem 0", fontWeight: 700, color: C.slate, fontSize: "1rem" }}>Total Client Investment</td>
                <td style={{ padding: "0.6rem 0", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "1.1rem", color: C.slate }}>{fmtFull(totalInvestment)}</td>
              </tr>
              <tr>
                <td style={{ padding: "0.3rem 0", color: C.muted, fontSize: "0.8rem" }}>Effective Rate Per Asset</td>
                <td style={{ padding: "0.3rem 0", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: C.muted, fontSize: "0.8rem" }}>${effectiveRate.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Generate Button */}
        <button
          onClick={() => setShowOutput(true)}
          style={{ width: "100%", padding: "0.85rem", background: C.gold, color: "white", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "1rem", cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif" }}
        >
          Generate Proposal & Feasibility Report
        </button>
      </div>
    );
  }

  // ─── Output View ────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button onClick={() => setShowOutput(false)} style={{ padding: "0.6rem 1.2rem", background: "#E2E8F0", color: C.text, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
          ← Edit Inputs
        </button>
        <button onClick={() => handlePrint("feasibility")} style={{ padding: "0.6rem 1.2rem", background: C.slate, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
          🖨️ Print Internal Feasibility
        </button>
        <button onClick={() => handlePrint("proposal")} style={{ padding: "0.6rem 1.2rem", background: C.gold, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
          🖨️ Print Proposal Summary
        </button>
        <button onClick={() => handlePrint("both")} style={{ padding: "0.6rem 1.2rem", background: C.teal, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
          🖨️ Print Both (Separate Pages)
        </button>
        <button onClick={onBack} style={{ padding: "0.6rem 1.2rem", background: C.charcoal, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem", marginLeft: "auto" }}>
          ← Back to Portal
        </button>
      </div>

      {/* ─── Internal Feasibility (NOT client-facing) ─────────────────────────── */}
      <div ref={feasibilityRef} style={{ background: "white", padding: "2rem", borderRadius: 8, border: `1px solid ${C.border}`, marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: `3px solid ${C.slate}` }}>
          <div>
            <img src={LOGO_BASE64} alt="LAI" style={{ height: 40, marginBottom: "0.5rem" }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.slate }}>Internal Feasibility Analysis</h2>
            <p style={{ color: "#EF4444", fontWeight: 700, fontSize: "0.85rem", marginTop: "0.25rem" }}>⚠️ CONFIDENTIAL — NOT FOR CLIENT DISTRIBUTION</p>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.8rem", color: C.muted }}>
            <p>Client: {inputs.clientName || "—"}</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem" }}>Pricing Breakdown</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead>
            <tr style={{ background: C.cardBg }}>
              <th style={{ padding: "0.5rem", textAlign: "left", fontSize: "0.8rem", borderBottom: `1px solid ${C.border}` }}>Component</th>
              <th style={{ padding: "0.5rem", textAlign: "right", fontSize: "0.8rem", borderBottom: `1px solid ${C.border}` }}>Amount</th>
              <th style={{ padding: "0.5rem", textAlign: "center", fontSize: "0.8rem", borderBottom: `1px solid ${C.border}` }}>Included?</th>
              <th style={{ padding: "0.5rem", textAlign: "right", fontSize: "0.8rem", borderBottom: `1px solid ${C.border}` }}>Billable</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Progressive Asset Fee ({fmtNum(inputs.estimatedAssetCount)} assets)</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(assetFee.total)}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "center", fontSize: "0.85rem" }}>Yes</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(assetFee.total)}</td>
            </tr>
            <tr style={{ background: C.cardBg }}>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Geographic Adjustment ({geoMultiplier.label} {geoMultiplier.multiplier}x)</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(geoAdjustment)}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "center", fontSize: "0.85rem" }}>{geoAdjustment > 0 ? "Yes" : "N/A"}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(geoAdjustment)}</td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Recoverable Capital Fee</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(recoverableFee.total)}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "center", fontSize: "0.85rem" }}>{inputs.includeRecoverableFee ? "Yes" : "No"}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{inputs.includeRecoverableFee ? fmt(recoverableFee.total) : "$0"}</td>
            </tr>
            <tr style={{ background: C.cardBg }}>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Phase 4 Governance</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(phase4Fee)}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "center", fontSize: "0.85rem" }}>{inputs.includePhase4 ? "Yes" : "No"}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{inputs.includePhase4 ? fmt(phase4Fee) : "$0"}</td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Asset Panda Coordination</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(ASSET_PANDA_FEE)}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "center", fontSize: "0.85rem" }}>{inputs.includeAssetPanda ? (inputs.waiveAssetPanda ? "Waived" : "Yes") : "No"}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(assetPandaFee)}</td>
            </tr>
            <tr style={{ borderTop: `2px solid ${C.slate}`, fontWeight: 700 }}>
              <td style={{ padding: "0.6rem 0.5rem", fontSize: "0.9rem" }}>TOTAL CLIENT INVESTMENT</td>
              <td colSpan={2}></td>
              <td style={{ padding: "0.6rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", color: C.slate }}>{fmtFull(totalInvestment)}</td>
            </tr>
          </tbody>
        </table>

        {/* Cost Analysis */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem" }}>Delivery Cost Estimate</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead>
            <tr style={{ background: C.cardBg }}>
              <th style={{ padding: "0.5rem", textAlign: "left", fontSize: "0.8rem", borderBottom: `1px solid ${C.border}` }}>Metric</th>
              <th style={{ padding: "0.5rem", textAlign: "right", fontSize: "0.8rem", borderBottom: `1px solid ${C.border}` }}>Value</th>
              <th style={{ padding: "0.5rem", textAlign: "right", fontSize: "0.8rem", borderBottom: `1px solid ${C.border}` }}>% of Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Field Hours ({fmtNum(inputs.estimatedAssetCount)} assets ÷ {COST_ASSUMPTIONS.fieldProductivity}/day × {COST_ASSUMPTIONS.workdayHours}h)</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmtNum(Math.round(feasibility.fieldHours))} hrs</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem" }}>—</td>
            </tr>
            <tr style={{ background: C.cardBg }}>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Field Payroll</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(feasibility.fieldPayroll)}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: "#EF4444" }}>-{fmtPct((feasibility.fieldPayroll / totalInvestment) * 100)}</td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Reconciliation Payroll</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(feasibility.reconciliationPayroll)}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: "#EF4444" }}>-{fmtPct((feasibility.reconciliationPayroll / totalInvestment) * 100)}</td>
            </tr>
            <tr style={{ background: C.cardBg }}>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>QA Payroll</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(feasibility.qaPayroll)}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: "#EF4444" }}>-{fmtPct((feasibility.qaPayroll / totalInvestment) * 100)}</td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Project Management</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(feasibility.pmPayroll)}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: "#EF4444" }}>-{fmtPct((feasibility.pmPayroll / totalInvestment) * 100)}</td>
            </tr>
            <tr style={{ background: C.cardBg }}>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Leadership Travel ({COST_ASSUMPTIONS.travelingLeaders} leaders × {inputs.projectWeeks} wks)</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(feasibility.leadershipTravel)}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: "#EF4444" }}>-{fmtPct((feasibility.leadershipTravel / totalInvestment) * 100)}</td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Allocated Overhead ({fmtPct(COST_ASSUMPTIONS.overheadPct * 100)})</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(feasibility.overhead)}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: "#EF4444" }}>-{fmtPct((feasibility.overhead / totalInvestment) * 100)}</td>
            </tr>
            <tr style={{ borderTop: `2px solid ${C.border}`, fontWeight: 600 }}>
              <td style={{ padding: "0.5rem 0.5rem", fontSize: "0.85rem" }}>Total Delivery Cost</td>
              <td style={{ padding: "0.5rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#EF4444" }}>{fmt(feasibility.totalCost)}</td>
              <td style={{ padding: "0.5rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: "#EF4444" }}>-{fmtPct((feasibility.totalCost / totalInvestment) * 100)}</td>
            </tr>
            <tr style={{ borderTop: `2px solid ${C.gold}`, fontWeight: 700 }}>
              <td style={{ padding: "0.6rem 0.5rem", fontSize: "0.9rem", color: C.teal }}>Estimated Profit</td>
              <td style={{ padding: "0.6rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", color: C.teal }}>{fmt(feasibility.profit)}</td>
              <td style={{ padding: "0.6rem 0.5rem", textAlign: "right", fontSize: "0.9rem", color: C.teal, fontWeight: 700 }}>{fmtPct(feasibility.margin)} margin</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ─── Proposal Summary (Client-Facing) ─────────────────────────────────── */}
      <div ref={proposalRef} style={{ background: "white", padding: "2rem", borderRadius: 8, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: `3px solid ${C.gold}` }}>
          <div>
            <img src={LOGO_BASE64} alt="LAI" style={{ height: 45, marginBottom: "0.5rem" }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.slate }}>Engagement Investment Summary</h2>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.8rem", color: C.muted }}>
            <p>Prepared: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Client Details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "2rem", padding: "1rem", background: C.cardBg, borderRadius: 6 }}>
          <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Client</span><p style={{ fontWeight: 600, color: C.text }}>{inputs.clientName || "—"}</p></div>
          <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Industry</span><p style={{ fontWeight: 600, color: C.text }}>{inputs.industry}</p></div>
          <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Estimated Assets</span><p style={{ fontWeight: 600, color: C.text }}>{fmtNum(inputs.estimatedAssetCount)}</p></div>
          <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Locations</span><p style={{ fontWeight: 600, color: C.text }}>{inputs.numberOfLocations}</p></div>
          <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Geographic Scope</span><p style={{ fontWeight: 600, color: C.text }}>{geoMultiplier.label}</p></div>
          <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Estimated Recoverable Capital</span><p style={{ fontWeight: 600, color: C.text }}>{fmt(inputs.estimatedRecoverableCapital)}</p></div>
        </div>

        {/* Investment */}
        <div style={{ textAlign: "center", padding: "1.5rem", background: `linear-gradient(135deg, ${C.slate}, ${C.charcoal})`, borderRadius: 8, marginBottom: "2rem" }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>Total Engagement Investment</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 700, color: C.gold }}>{fmtFull(totalInvestment)}</p>
          {inputs.includePhase4 && <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", marginTop: "0.25rem" }}>Phase 4 Governance Included</p>}
        </div>

        {/* ROI Analysis */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: C.slate, marginBottom: "1rem" }}>Return on Investment Analysis</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ textAlign: "center", padding: "1rem", border: `1px solid ${C.border}`, borderRadius: 6 }}>
            <p style={{ fontSize: "0.75rem", color: C.muted, marginBottom: "0.25rem" }}>First-Year ROI</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.3rem", fontWeight: 700, color: C.teal }}>{fmtPct(firstYearROI)}</p>
          </div>
          <div style={{ textAlign: "center", padding: "1rem", border: `1px solid ${C.border}`, borderRadius: 6 }}>
            <p style={{ fontSize: "0.75rem", color: C.muted, marginBottom: "0.25rem" }}>Net Financial Benefit</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.3rem", fontWeight: 700, color: C.teal }}>{fmt(netBenefit)}</p>
          </div>
          <div style={{ textAlign: "center", padding: "1rem", border: `1px solid ${C.border}`, borderRadius: 6 }}>
            <p style={{ fontSize: "0.75rem", color: C.muted, marginBottom: "0.25rem" }}>Return Multiple</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.3rem", fontWeight: 700, color: C.teal }}>{returnMultiple.toFixed(2)}x</p>
          </div>
        </div>

        {/* 3-Year Analysis */}
        {inputs.includePhase4 && (
          <>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem" }}>3-Year Analysis (with Governance)</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ textAlign: "center", padding: "0.75rem", background: C.cardBg, borderRadius: 6 }}>
                <p style={{ fontSize: "0.75rem", color: C.muted }}>3-Year ROI</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 700, color: C.slate }}>{fmtPct(threeYearROI)}</p>
              </div>
              <div style={{ textAlign: "center", padding: "0.75rem", background: C.cardBg, borderRadius: 6 }}>
                <p style={{ fontSize: "0.75rem", color: C.muted }}>3-Year Net Benefit</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 700, color: C.slate }}>{fmt(threeYearBenefit)}</p>
              </div>
              <div style={{ textAlign: "center", padding: "0.75rem", background: C.cardBg, borderRadius: 6 }}>
                <p style={{ fontSize: "0.75rem", color: C.muted }}>3-Year Multiple</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 700, color: C.slate }}>{threeYearMultiple.toFixed(2)}x</p>
              </div>
            </div>
          </>
        )}

        {/* Bundled Scope */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem" }}>Bundled Engagement Scope</h3>
        <div style={{ padding: "1rem", background: C.cardBg, borderRadius: 6, borderLeft: `4px solid ${C.gold}`, marginBottom: "2rem" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", color: C.text, lineHeight: 1.8 }}>
            <li>• Discovery and executive assessment</li>
            <li>• Physical asset verification</li>
            <li>• Asset tagging</li>
            <li>• FAR reconciliation</li>
            <li>• Recovery analysis and executive reporting</li>
            <li>• Standard travel and project delivery expenses</li>
            {inputs.includeAssetPanda && <li>• Asset Panda introduction/coordination{inputs.waiveAssetPanda ? " (fee waived)" : ""}</li>}
            {inputs.includePhase4 && <li>• Recurring governance program</li>}
          </ul>
        </div>

        {/* How Price Is Calculated */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem" }}>How the Price Is Calculated</h3>
        <div style={{ padding: "1rem", background: C.cardBg, borderRadius: 6, fontSize: "0.8rem", color: C.muted, lineHeight: 1.7, marginBottom: "2rem" }}>
          <p><strong>1. Progressive asset pricing</strong> — Each asset band is charged only at that band's rate.</p>
          <p><strong>2. Geographic multiplier</strong> — Only Multi-State and National receive a small multiplier.</p>
          <p><strong>3. Recoverable-capital fee</strong> — Progressively calculated above $500,000 when included.</p>
          <p><strong>4. Optional governance</strong> — Annual Phase 4 fee scales with client asset count.</p>
          <p><strong>5. Asset Panda coordination</strong> — Small fee can be included and visibly waived.</p>
        </div>

        {/* Notes */}
        {inputs.notes && (
          <div style={{ padding: "1rem", background: C.cardBg, borderRadius: 6, marginBottom: "2rem" }}>
            <p style={{ fontSize: "0.8rem", color: C.muted, fontWeight: 600, marginBottom: "0.25rem" }}>Notes</p>
            <p style={{ fontSize: "0.85rem", color: C.text }}>{inputs.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", paddingTop: "1.5rem", borderTop: `2px solid ${C.border}` }}>
          <p style={{ fontSize: "0.75rem", color: C.muted }}>Legacy Asset Intelligence | legacyassetintelligence.com</p>
          <p style={{ fontSize: "0.7rem", color: C.muted, marginTop: "0.25rem" }}>This proposal is valid for 30 days from the date of preparation.</p>
        </div>
      </div>
    </div>
  );
}
