/**
 * LAI Total Engagement Billing Calculator
 * EXACT replica of LAI_Total_Engagement_Billing_Calculator.xlsx
 * 
 * Fixed data tables (NOT user-editable):
 *   - Asset Pricing Tiers (rows 4-9)
 *   - Recoverable Capital Brackets (rows 13-17)
 *   - Geographic Multipliers (rows 21-24)
 *   - Phase 4 Governance Tiers (rows 33-36)
 *   - Optional Fees (rows 28-29)
 *   - Workdays per week = 5, Specialists per FAM = 20 (rows 56-57)
 *
 * User-editable inputs:
 *   - Client Tab: rows 4-14
 *   - Assumptions Tab: rows 40-54 & 58
 */

import { useState, useRef } from "react";
import { LOGO_BASE64 } from "./logoBase64";

// ═══════════════════════════════════════════════════════════════════════════════
// FIXED DATA TABLES — These match the Excel EXACTLY and are NOT editable
// ═══════════════════════════════════════════════════════════════════════════════

// Assumptions rows 4-9: Asset Pricing (Progressive)
const ASSET_TIERS: { lower: number; upper: number; rate: number }[] = [
  { lower: 1, upper: 10000, rate: 7.00 },
  { lower: 10001, upper: 25000, rate: 6.75 },
  { lower: 25001, upper: 50000, rate: 6.00 },
  { lower: 50001, upper: 100000, rate: 5.25 },
  { lower: 100001, upper: 250000, rate: 4.75 },
  { lower: 250001, upper: 999999999, rate: 4.00 },
];

// Assumptions rows 13-17: Recoverable Capital Fee (Progressive)
const RECOVERABLE_BRACKETS: { lower: number; upper: number; rate: number }[] = [
  { lower: 0, upper: 500000, rate: 0.0 },
  { lower: 500000, upper: 2000000, rate: 0.05 },
  { lower: 2000000, upper: 5000000, rate: 0.025 },
  { lower: 5000000, upper: 10000000, rate: 0.015 },
  { lower: 10000000, upper: 999999999, rate: 0.01 },
];

// Assumptions rows 21-24: Geographic Multipliers
const GEO_OPTIONS: { label: string; multiplier: number }[] = [
  { label: "Local", multiplier: 1.00 },
  { label: "Regional", multiplier: 1.05 },
  { label: "Multi-State", multiplier: 1.10 },
  { label: "National", multiplier: 1.15 },
];

// Assumptions rows 33-36: Phase 4 Annual Governance
const PHASE4_TIERS: { upper: number; fee: number }[] = [
  { upper: 25000, fee: 30000 },
  { upper: 100000, fee: 60000 },
  { upper: 250000, fee: 90000 },
  { upper: 999999999, fee: 120000 },
];

// Assumptions rows 28-29: Optional Fees
const ASSET_PANDA_FEE = 5000;
const MINIMUM_ENGAGEMENT_FEE = 40000;

// Assumptions rows 56-57: Fixed constants
const WORKDAYS_PER_WEEK = 5;
const SPECIALISTS_PER_FAM = 20;

// Industry list for dropdown
const INDUSTRIES = [
  "Healthcare / Hospital", "Manufacturing", "Distribution / Warehouse",
  "Logistics / Transportation", "Government / Public Sector", "Education / University",
  "Utilities / Energy", "Construction / Contractor", "Hospitality",
  "Retail / Multi-Location", "Financial Services", "Technology / SaaS",
  "Aviation", "Real Estate / Property Management", "Nonprofit", "Other",
];

// ═══════════════════════════════════════════════════════════════════════════════
// CALCULATION FUNCTIONS — Exact formulas from Excel
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Pricing Summary C4:
 * =MIN(B6,10000)*D4 + MAX(MIN(B6,25000)-10000,0)*D5 + MAX(MIN(B6,50000)-25000,0)*D6
 *  + MAX(MIN(B6,100000)-50000,0)*D7 + MAX(MIN(B6,250000)-100000,0)*D8 + MAX(B6-250000,0)*D9
 */
function calcProgressiveAssetFee(assetCount: number): number {
  const a = assetCount;
  return (
    Math.min(a, 10000) * 7.00 +
    Math.max(Math.min(a, 25000) - 10000, 0) * 6.75 +
    Math.max(Math.min(a, 50000) - 25000, 0) * 6.00 +
    Math.max(Math.min(a, 100000) - 50000, 0) * 5.25 +
    Math.max(Math.min(a, 250000) - 100000, 0) * 4.75 +
    Math.max(a - 250000, 0) * 4.00
  );
}

/**
 * Pricing Summary C6:
 * =MAX(MIN(B9,2000000)-500000,0)*0.05 + MAX(MIN(B9,5000000)-2000000,0)*0.025
 *  + MAX(MIN(B9,10000000)-5000000,0)*0.015 + MAX(B9-10000000,0)*0.01
 */
function calcRecoverableCapitalFee(capital: number): number {
  return (
    Math.max(Math.min(capital, 2000000) - 500000, 0) * 0.05 +
    Math.max(Math.min(capital, 5000000) - 2000000, 0) * 0.025 +
    Math.max(Math.min(capital, 10000000) - 5000000, 0) * 0.015 +
    Math.max(capital - 10000000, 0) * 0.01
  );
}

/**
 * Pricing Summary C7:
 * =IF(B6<=25000,30000,IF(B6<=100000,60000,IF(B6<=250000,90000,120000)))
 */
function calcPhase4Fee(assetCount: number): number {
  for (const tier of PHASE4_TIERS) {
    if (assetCount <= tier.upper) return tier.fee;
  }
  return 120000;
}

/**
 * Pricing Summary G5 (geographic multiplier lookup):
 * =IF(B8="Local",1.00,IF(B8="Regional",1.05,IF(B8="Multi-State",1.10,1.15)))
 */
function getGeoMultiplier(geoScope: string): number {
  const found = GEO_OPTIONS.find(g => g.label === geoScope);
  return found ? found.multiplier : 1.00;
}

/**
 * Assumptions B61 (Required Field Production Staff):
 * =MAX(1, ROUNDUP(
 *   (Assets * IF(Geo="National",1.1,IF(Geo="Multi-State",1.05,1))
 *    * (1+MIN(MAX(Locations-1,0)*0.005, 0.1)))
 *   / (B40 * B56 * B14)
 * , 0))
 */
function calcRequiredFieldStaff(
  assets: number, geoScope: string, locations: number,
  fieldProductivity: number, timeframe: number
): number {
  const geoFactor = geoScope === "National" ? 1.1 : geoScope === "Multi-State" ? 1.05 : 1.0;
  const locFactor = 1 + Math.min(Math.max(locations - 1, 0) * 0.005, 0.1);
  const numerator = assets * geoFactor * locFactor;
  const denominator = fieldProductivity * WORKDAYS_PER_WEEK * timeframe;
  return Math.max(1, Math.ceil(numerator / denominator));
}

// ═══════════════════════════════════════════════════════════════════════════════
// FORMATTING HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

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
  return (n * 100).toFixed(1) + "%";
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const C = { charcoal: "#0F1419", slate: "#1E3A5F", teal: "#0D9488", gold: "#D4AF37", bg: "#FFFFFF", cardBg: "#F8FAFC", border: "#E2E8F0", text: "#1E293B", muted: "#64748B" };
const labelStyle: React.CSSProperties = { fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: C.text, marginBottom: "0.25rem", display: "block" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.5rem 0.75rem", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: "0.9rem", fontFamily: "'Source Sans 3', sans-serif", background: "white", color: C.text, outline: "none" };
const selectStyle: React.CSSProperties = { ...inputStyle, appearance: "auto" as const };
const sectionTitle: React.CSSProperties = { fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: C.slate, marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: `2px solid ${C.gold}` };

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ProposalCalculator({ onBack }: { onBack: () => void }) {
  // Client Tab state (rows 4-14)
  const [clientName, setClientName] = useState("");
  const [industry, setIndustry] = useState("Manufacturing");
  const [assetCount, setAssetCount] = useState(200000);
  const [locations, setLocations] = useState(15);
  const [geoScope, setGeoScope] = useState("National");
  const [recoverableCapital, setRecoverableCapital] = useState(2500000);
  const [includeRecoverableFee, setIncludeRecoverableFee] = useState("Yes");
  const [includePhase4, setIncludePhase4] = useState("Yes");
  const [includeAssetPanda, setIncludeAssetPanda] = useState("Yes");
  const [waiveAssetPanda, setWaiveAssetPanda] = useState("Yes");
  const [timeframe, setTimeframe] = useState(13); // Row 14: Timeframe (weeks for staffing calc)
  const [notes, setNotes] = useState("");

  // Assumptions Tab state (rows 40-54 & 58) — EDITABLE
  const [fieldProductivity, setFieldProductivity] = useState(200);
  const [fieldContractorPay, setFieldContractorPay] = useState(30);
  const [reconciliationPay, setReconciliationPay] = useState(30);
  const [qaPay, setQaPay] = useState(30);
  const [pmPay, setPmPay] = useState(60);
  const [workdayHours, setWorkdayHours] = useState(8);
  const [reconciliationPct, setReconciliationPct] = useState(0.30);
  const [qaPct, setQaPct] = useState(0.08);
  const [pmPct, setPmPct] = useState(0.06);
  const [travelingLeaders, setTravelingLeaders] = useState(2);
  const [avgProjectWeeks, setAvgProjectWeeks] = useState(12);
  const [weeklyLodging, setWeeklyLodging] = useState(1050);
  const [weeklyPerDiem, setWeeklyPerDiem] = useState(490);
  const [weeklyTransport, setWeeklyTransport] = useState(450);
  const [overheadAllocation, setOverheadAllocation] = useState(0.15);
  const [annualOngoingSavings, setAnnualOngoingSavings] = useState(0.10);

  const [activeTab, setActiveTab] = useState<"client" | "assumptions">("client");
  const [showOutput, setShowOutput] = useState(false);
  const feasibilityRef = useRef<HTMLDivElement>(null);
  const proposalRef = useRef<HTMLDivElement>(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // PRICING SUMMARY CALCULATIONS (exact Excel formulas)
  // ═══════════════════════════════════════════════════════════════════════════

  // C4: Progressive Asset Fee
  const progressiveAssetFee = calcProgressiveAssetFee(assetCount);

  // G5: Geographic multiplier
  const geoMult = getGeoMultiplier(geoScope);

  // C5: Geographic Adjustment = C4 * (G5 - 1)
  const geoAdjustment = progressiveAssetFee * (geoMult - 1);

  // E4: Billable asset fee (always included)
  const billableAssetFee = progressiveAssetFee;

  // E5: Billable geo adjustment (always included)
  const billableGeoAdj = geoAdjustment;

  // C6: Recoverable Capital Fee (gross)
  const recoverableFeeGross = calcRecoverableCapitalFee(recoverableCapital);

  // D6: Included? = Client Inputs B10
  // E6: IF(D6="Yes", C6, 0)
  const billableRecoverableFee = includeRecoverableFee === "Yes" ? recoverableFeeGross : 0;

  // C7: Phase 4 Governance (gross)
  const phase4FeeGross = calcPhase4Fee(assetCount);

  // D7: Included? = Client Inputs B11
  // E7: IF(D7="Yes", C7, 0)
  const billablePhase4 = includePhase4 === "Yes" ? phase4FeeGross : 0;

  // C8: Asset Panda = $5,000
  // D8: IF(B12="No","No", IF(B13="Yes","Waived","Yes"))
  const pandaStatus = includeAssetPanda === "No" ? "No" : (waiveAssetPanda === "Yes" ? "Waived" : "Yes");
  // E8: IF(D8="Yes", C8, 0)
  const billablePanda = pandaStatus === "Yes" ? ASSET_PANDA_FEE : 0;

  // E10: TOTAL = MAX(SUM(E4:E8), MinimumFee)
  const totalInvestment = Math.max(
    billableAssetFee + billableGeoAdj + billableRecoverableFee + billablePhase4 + billablePanda,
    MINIMUM_ENGAGEMENT_FEE
  );

  // Effective rate per asset
  const effectiveRate = assetCount > 0 ? totalInvestment / assetCount : 0;

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNAL FEASIBILITY CALCULATIONS (exact Excel formulas)
  // ═══════════════════════════════════════════════════════════════════════════

  // C4: Field hours = Assets / B40 * B45
  const fieldHours = (assetCount / fieldProductivity) * workdayHours;

  // C5: Field payroll = C4 * B41
  const fieldPayroll = fieldHours * fieldContractorPay;

  // C6: Reconciliation payroll = C4 * B46 * B42
  const reconPayroll = fieldHours * reconciliationPct * reconciliationPay;

  // C7: QA payroll = C4 * B47 * B43
  const qaPayroll = fieldHours * qaPct * qaPay;

  // C8: PM payroll = C4 * B48 * B44
  const pmPayroll = fieldHours * pmPct * pmPay;

  // C9: Leadership travel = B49 * B50 * (B51 + B52 + B53)
  const weeklyTravelPackage = weeklyLodging + weeklyPerDiem + weeklyTransport;
  const leadershipTravel = travelingLeaders * avgProjectWeeks * weeklyTravelPackage;

  // C10: Overhead = E10 * B54
  const overhead = totalInvestment * overheadAllocation;

  // C11: Total delivery cost = SUM(C5:C10)
  const totalDeliveryCost = fieldPayroll + reconPayroll + qaPayroll + pmPayroll + leadershipTravel + overhead;

  // C13: Profit = C12 - C11
  const estimatedProfit = totalInvestment - totalDeliveryCost;

  // C14: Margin = IF(C12=0, 0, C13/C12)
  const profitMargin = totalInvestment > 0 ? estimatedProfit / totalInvestment : 0;

  // ═══════════════════════════════════════════════════════════════════════════
  // PROJECT STAFFING ASSUMPTIONS (exact Excel formulas from rows 61-70)
  // ═══════════════════════════════════════════════════════════════════════════

  // B61: Required Field Production Staff (complex formula)
  const requiredFieldStaff = calcRequiredFieldStaff(assetCount, geoScope, locations, fieldProductivity, timeframe);

  // B63: Field Asset Manager = MAX(1, ROUNDUP(B61/B57, 0))  where B57=20
  const fieldAssetManagers = Math.max(1, Math.ceil(requiredFieldStaff / SPECIALISTS_PER_FAM));

  // B64: Asset Intelligence Specialist = B61
  const assetIntelSpecialists = requiredFieldStaff;

  // B65: Data Reconciliation Specialist = MAX(1, ROUNDUP(B61/4, 0))
  const dataReconSpecialists = Math.max(1, Math.ceil(requiredFieldStaff / 4));

  // B66: Asset Recovery Specialist = MAX(1, ROUNDUP(Assets/75000, 0))
  const assetRecoverySpecialists = Math.max(1, Math.ceil(assetCount / 75000));

  // B67: Quality Assurance Specialist = MAX(1, ROUNDUP(B61/6, 0))
  const qaSpecialists = Math.max(1, Math.ceil(requiredFieldStaff / 6));

  // B68: Project Manager = MAX(1, ROUNDUP(B61/12, 0))
  const projectManagers = Math.max(1, Math.ceil(requiredFieldStaff / 12));

  // B70: Total = SUM(B63:B68)  NOTE: does NOT include B61
  const totalStaff = fieldAssetManagers + assetIntelSpecialists + dataReconSpecialists + assetRecoverySpecialists + qaSpecialists + projectManagers;

  // ═══════════════════════════════════════════════════════════════════════════
  // PROPOSAL SUMMARY ROI CALCULATIONS (exact Excel formulas)
  // ═══════════════════════════════════════════════════════════════════════════

  // B11: First-Year ROI = IFERROR((RecoverableCapital - TotalInvestment) / TotalInvestment, 0)
  const firstYearROI = totalInvestment > 0 ? (recoverableCapital - totalInvestment) / totalInvestment : 0;

  // B12: Net Financial Benefit = MAX(RecoverableCapital - TotalInvestment, 0)
  const netBenefit = Math.max(recoverableCapital - totalInvestment, 0);

  // B13: Return Multiple = IFERROR(RecoverableCapital / TotalInvestment, 0)
  const returnMultiple = totalInvestment > 0 ? recoverableCapital / totalInvestment : 0;

  // B15: 3-Year ROI = IFERROR(((RC + RC*B58*2) - Investment) / Investment, 0)
  const threeYearTotal = recoverableCapital + (recoverableCapital * annualOngoingSavings * 2);
  const threeYearROI = totalInvestment > 0 ? (threeYearTotal - totalInvestment) / totalInvestment : 0;

  // B16: 3-Year Net Benefit = (RC + RC*B58*2) - Investment
  const threeYearBenefit = threeYearTotal - totalInvestment;

  // B17: 3-Year Multiple = IFERROR((RC + RC*B58*2) / Investment, 0)
  const threeYearMultiple = totalInvestment > 0 ? threeYearTotal / totalInvestment : 0;

  // ═══════════════════════════════════════════════════════════════════════════
  // PRINT HANDLER
  // ═══════════════════════════════════════════════════════════════════════════

  const handlePrint = (section: "feasibility" | "proposal" | "both") => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    let content = "";
    if (section === "feasibility" || section === "both") content += feasibilityRef.current?.innerHTML || "";
    if (section === "both") content += '<div style="page-break-before: always;"></div>';
    if (section === "proposal" || section === "both") content += proposalRef.current?.innerHTML || "";
    printWindow.document.write(`<html><head><title>LAI ${section === "feasibility" ? "Internal Feasibility" : section === "proposal" ? "Proposal Summary" : "Full Report"} - ${clientName || "Client"}</title><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Source Sans 3',sans-serif;color:#1E293B;padding:40px}img{max-height:50px}table{width:100%;border-collapse:collapse;margin:1rem 0}th,td{padding:0.5rem 0.75rem;text-align:left;border-bottom:1px solid #E2E8F0;font-size:0.85rem}th{background:#F8FAFC;font-weight:600}.page-break{page-break-before:always}@media print{body{padding:20px}.page-break{page-break-before:always}}</style></head><body>${content}</body></html>`);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 800);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // INPUT FORM
  // ═══════════════════════════════════════════════════════════════════════════

  if (!showOutput) {
    return (
      <div style={{ padding: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: C.slate }}>←</button>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.slate }}>Total Engagement Billing Calculator</h1>
            <p style={{ color: C.muted, fontSize: "0.85rem" }}>LAI Progressive Pricing Model</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "0", marginBottom: "1.5rem", borderBottom: `2px solid ${C.border}` }}>
          {(["client", "assumptions"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "0.6rem 1.5rem", background: activeTab === tab ? C.slate : "transparent", color: activeTab === tab ? "white" : C.muted, border: "none", borderRadius: "6px 6px 0 0", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif" }}>
              {tab === "client" ? "Client Inputs" : "Assumptions"}
            </button>
          ))}
        </div>

        {/* CLIENT TAB (rows 4-14) */}
        {activeTab === "client" && (
          <div>
            <div style={sectionTitle}>Client Information (Rows 4–14)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
              <div><label style={labelStyle}>Client Name</label><input style={inputStyle} value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g., Johnson & Johnson" /></div>
              <div><label style={labelStyle}>Industry</label><select style={selectStyle} value={industry} onChange={e => setIndustry(e.target.value)}>{INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}</select></div>
              <div><label style={labelStyle}>Estimated Asset Count</label><input style={inputStyle} type="number" value={assetCount || ""} onChange={e => setAssetCount(e.target.value === "" ? 0 : Number(e.target.value))} min={1} /></div>
              <div><label style={labelStyle}>Number of Locations</label><input style={inputStyle} type="number" value={locations || ""} onChange={e => setLocations(e.target.value === "" ? 0 : Number(e.target.value))} min={1} /></div>
              <div><label style={labelStyle}>Geographic Scope</label><select style={selectStyle} value={geoScope} onChange={e => setGeoScope(e.target.value)}>{GEO_OPTIONS.map(g => <option key={g.label} value={g.label}>{g.label} ({g.multiplier}x)</option>)}</select></div>
              <div><label style={labelStyle}>Estimated Recoverable Capital ($)</label><input style={inputStyle} type="number" value={recoverableCapital || ""} onChange={e => setRecoverableCapital(e.target.value === "" ? 0 : Number(e.target.value))} min={0} /></div>
              <div><label style={labelStyle}>Include Recoverable Capital Fee?</label><select style={selectStyle} value={includeRecoverableFee} onChange={e => setIncludeRecoverableFee(e.target.value)}><option value="Yes">Yes</option><option value="No">No</option></select></div>
              <div><label style={labelStyle}>Include Phase 4 Governance?</label><select style={selectStyle} value={includePhase4} onChange={e => setIncludePhase4(e.target.value)}><option value="Yes">Yes</option><option value="No">No</option></select></div>
              <div><label style={labelStyle}>Include Asset Panda Coordination Fee?</label><select style={selectStyle} value={includeAssetPanda} onChange={e => setIncludeAssetPanda(e.target.value)}><option value="Yes">Yes</option><option value="No">No</option></select></div>
              <div><label style={labelStyle}>Waive Asset Panda Fee? (1-yr governance)</label><select style={selectStyle} value={waiveAssetPanda} onChange={e => setWaiveAssetPanda(e.target.value)}><option value="Yes">Yes</option><option value="No">No</option></select></div>
              <div><label style={labelStyle}>Timeframe (weeks)</label><input style={inputStyle} type="number" value={timeframe || ""} onChange={e => setTimeframe(e.target.value === "" ? 0 : Number(e.target.value))} min={1} /></div>
              <div><label style={labelStyle}>Notes</label><input style={inputStyle} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes" /></div>
            </div>
          </div>
        )}

        {/* ASSUMPTIONS TAB (rows 40-54 & 58) */}
        {activeTab === "assumptions" && (
          <div>
            <div style={sectionTitle}>Cost & Staffing Assumptions (Rows 40–54, 58)</div>
            <p style={{ fontSize: "0.8rem", color: C.muted, marginBottom: "1.5rem" }}>These values drive the Internal Feasibility calculations. Adjust per engagement scenario.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
              <div><label style={labelStyle}>Row 40: Field Productivity (assets/person/day)</label><input style={inputStyle} type="number" value={fieldProductivity || ""} onChange={e => setFieldProductivity(e.target.value === "" ? 0 : Number(e.target.value))} min={1} /></div>
              <div><label style={labelStyle}>Row 41: Field Contractor Pay ($/hr)</label><input style={inputStyle} type="number" value={fieldContractorPay || ""} onChange={e => setFieldContractorPay(e.target.value === "" ? 0 : Number(e.target.value))} min={0} /></div>
              <div><label style={labelStyle}>Row 42: Reconciliation Pay ($/hr)</label><input style={inputStyle} type="number" value={reconciliationPay || ""} onChange={e => setReconciliationPay(e.target.value === "" ? 0 : Number(e.target.value))} min={0} /></div>
              <div><label style={labelStyle}>Row 43: QA Pay ($/hr)</label><input style={inputStyle} type="number" value={qaPay || ""} onChange={e => setQaPay(e.target.value === "" ? 0 : Number(e.target.value))} min={0} /></div>
              <div><label style={labelStyle}>Row 44: PM Pay ($/hr)</label><input style={inputStyle} type="number" value={pmPay || ""} onChange={e => setPmPay(e.target.value === "" ? 0 : Number(e.target.value))} min={0} /></div>
              <div><label style={labelStyle}>Row 45: Workday Hours (hrs/day)</label><input style={inputStyle} type="number" value={workdayHours || ""} onChange={e => setWorkdayHours(e.target.value === "" ? 0 : Number(e.target.value))} min={1} /></div>
              <div><label style={labelStyle}>Row 46: Reconciliation % of Field Hrs</label><input style={inputStyle} type="number" step="0.01" value={reconciliationPct || ""} onChange={e => setReconciliationPct(e.target.value === "" ? 0 : Number(e.target.value))} min={0} max={1} /><span style={{ fontSize: "0.7rem", color: C.muted }}>0.30 = 30%</span></div>
              <div><label style={labelStyle}>Row 47: QA % of Field Hrs</label><input style={inputStyle} type="number" step="0.01" value={qaPct || ""} onChange={e => setQaPct(e.target.value === "" ? 0 : Number(e.target.value))} min={0} max={1} /><span style={{ fontSize: "0.7rem", color: C.muted }}>0.08 = 8%</span></div>
              <div><label style={labelStyle}>Row 48: PM % of Field Hrs</label><input style={inputStyle} type="number" step="0.01" value={pmPct || ""} onChange={e => setPmPct(e.target.value === "" ? 0 : Number(e.target.value))} min={0} max={1} /><span style={{ fontSize: "0.7rem", color: C.muted }}>0.06 = 6%</span></div>
              <div><label style={labelStyle}>Row 49: Traveling LAI Leaders</label><input style={inputStyle} type="number" value={travelingLeaders || ""} onChange={e => setTravelingLeaders(e.target.value === "" ? 0 : Number(e.target.value))} min={0} /></div>
              <div><label style={labelStyle}>Row 50: Average Project Weeks</label><input style={inputStyle} type="number" value={avgProjectWeeks || ""} onChange={e => setAvgProjectWeeks(e.target.value === "" ? 0 : Number(e.target.value))} min={1} /></div>
              <div><label style={labelStyle}>Row 51: Weekly Lodging/Traveler ($/wk)</label><input style={inputStyle} type="number" value={weeklyLodging || ""} onChange={e => setWeeklyLodging(e.target.value === "" ? 0 : Number(e.target.value))} min={0} /><span style={{ fontSize: "0.7rem", color: C.muted }}>$150/night × 7</span></div>
              <div><label style={labelStyle}>Row 52: Weekly Per Diem/Traveler ($/wk)</label><input style={inputStyle} type="number" value={weeklyPerDiem || ""} onChange={e => setWeeklyPerDiem(e.target.value === "" ? 0 : Number(e.target.value))} min={0} /><span style={{ fontSize: "0.7rem", color: C.muted }}>$70/day × 7</span></div>
              <div><label style={labelStyle}>Row 53: Weekly Transport/Traveler ($/wk)</label><input style={inputStyle} type="number" value={weeklyTransport || ""} onChange={e => setWeeklyTransport(e.target.value === "" ? 0 : Number(e.target.value))} min={0} /><span style={{ fontSize: "0.7rem", color: C.muted }}>Flights/rental/mileage</span></div>
              <div><label style={labelStyle}>Row 54: Overhead Allocation (% of revenue)</label><input style={inputStyle} type="number" step="0.01" value={overheadAllocation || ""} onChange={e => setOverheadAllocation(e.target.value === "" ? 0 : Number(e.target.value))} min={0} max={1} /><span style={{ fontSize: "0.7rem", color: C.muted }}>0.15 = 15%</span></div>
              <div><label style={labelStyle}>Row 58: Annual Ongoing Savings (%)</label><input style={inputStyle} type="number" step="0.01" value={annualOngoingSavings || ""} onChange={e => setAnnualOngoingSavings(e.target.value === "" ? 0 : Number(e.target.value))} min={0} max={1} /><span style={{ fontSize: "0.7rem", color: C.muted }}>0.10 = 10% (for 3-yr ROI)</span></div>
            </div>
          </div>
        )}

        {/* LIVE PRICING PREVIEW */}
        <div style={{ background: C.cardBg, borderRadius: 8, padding: "1.5rem", border: `1px solid ${C.border}`, marginBottom: "2rem" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "1rem" }}>Live Pricing Preview</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "0.4rem 0" }}>Progressive Asset Fee ({fmtNum(assetCount)} assets)</td><td style={{ padding: "0.4rem 0", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{fmt(progressiveAssetFee)}</td></tr>
              {geoAdjustment > 0 && <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "0.4rem 0" }}>Geographic Adjustment ({geoScope} {geoMult}x)</td><td style={{ padding: "0.4rem 0", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{fmt(geoAdjustment)}</td></tr>}
              {includeRecoverableFee === "Yes" && recoverableFeeGross > 0 && <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "0.4rem 0" }}>Recoverable Capital Fee ({recoverableCapital > 0 ? fmtPct(recoverableFeeGross / recoverableCapital) : "0%"} effective)</td><td style={{ padding: "0.4rem 0", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{fmt(billableRecoverableFee)}</td></tr>}
              {includePhase4 === "Yes" && <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "0.4rem 0" }}>Phase 4 Governance (Annual)</td><td style={{ padding: "0.4rem 0", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{fmt(billablePhase4)}</td></tr>}
              {includeAssetPanda === "Yes" && <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "0.4rem 0" }}>Asset Panda Coordination</td><td style={{ padding: "0.4rem 0", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, textDecoration: pandaStatus === "Waived" ? "line-through" : "none", color: pandaStatus === "Waived" ? C.muted : C.text }}>{pandaStatus === "Waived" ? `${fmt(ASSET_PANDA_FEE)} (Waived)` : fmt(ASSET_PANDA_FEE)}</td></tr>}
              <tr style={{ borderTop: `2px solid ${C.gold}` }}><td style={{ padding: "0.6rem 0", fontWeight: 700, color: C.slate, fontSize: "1rem" }}>Total Client Investment</td><td style={{ padding: "0.6rem 0", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "1.1rem", color: C.slate }}>{fmtFull(totalInvestment)}</td></tr>
              <tr><td style={{ padding: "0.3rem 0", color: C.muted, fontSize: "0.8rem" }}>Effective Rate Per Asset</td><td style={{ padding: "0.3rem 0", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: C.muted, fontSize: "0.8rem" }}>${effectiveRate.toFixed(2)}</td></tr>
            </tbody>
          </table>
        </div>

        <button onClick={() => setShowOutput(true)} style={{ width: "100%", padding: "0.85rem", background: C.gold, color: "white", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "1rem", cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif" }}>
          Generate Proposal & Feasibility Report
        </button>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUT VIEW
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div style={{ padding: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button onClick={() => setShowOutput(false)} style={{ padding: "0.6rem 1.2rem", background: "#E2E8F0", color: C.text, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>← Edit Inputs</button>
        <button onClick={() => handlePrint("feasibility")} style={{ padding: "0.6rem 1.2rem", background: C.slate, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>Print Internal Feasibility</button>
        <button onClick={() => handlePrint("proposal")} style={{ padding: "0.6rem 1.2rem", background: C.gold, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>Print Proposal Summary</button>
        <button onClick={() => handlePrint("both")} style={{ padding: "0.6rem 1.2rem", background: C.teal, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>Print Both (Separate Pages)</button>
        <button onClick={onBack} style={{ padding: "0.6rem 1.2rem", background: C.charcoal, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem", marginLeft: "auto" }}>← Back to Portal</button>
      </div>

      {/* ═══ INTERNAL FEASIBILITY (NOT client-facing) ═══ */}
      <div ref={feasibilityRef} style={{ background: "white", padding: "2rem", borderRadius: 8, border: `1px solid ${C.border}`, marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: `3px solid ${C.slate}` }}>
          <div>
            <img src={LOGO_BASE64} alt="LAI" style={{ height: 40, marginBottom: "0.5rem" }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.slate }}>Internal Feasibility Analysis</h2>
            <p style={{ color: "#EF4444", fontWeight: 700, fontSize: "0.85rem", marginTop: "0.25rem" }}>CONFIDENTIAL — NOT FOR CLIENT DISTRIBUTION</p>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.8rem", color: C.muted }}><p>Client: {clientName || "—"}</p><p>Date: {new Date().toLocaleDateString()}</p></div>
        </div>

        {/* Pricing Breakdown Table */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem" }}>Pricing Breakdown</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead><tr style={{ background: C.cardBg }}><th style={{ padding: "0.5rem", textAlign: "left", fontSize: "0.8rem", borderBottom: `1px solid ${C.border}` }}>Component</th><th style={{ padding: "0.5rem", textAlign: "right", fontSize: "0.8rem", borderBottom: `1px solid ${C.border}` }}>Gross</th><th style={{ padding: "0.5rem", textAlign: "center", fontSize: "0.8rem", borderBottom: `1px solid ${C.border}` }}>Included?</th><th style={{ padding: "0.5rem", textAlign: "right", fontSize: "0.8rem", borderBottom: `1px solid ${C.border}` }}>Billable</th></tr></thead>
          <tbody>
            <tr><td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Progressive Asset Fee ({fmtNum(assetCount)} assets)</td><td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(progressiveAssetFee)}</td><td style={{ textAlign: "center" }}>Yes</td><td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(billableAssetFee)}</td></tr>
            <tr style={{ background: C.cardBg }}><td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Geographic Adjustment ({geoScope} {geoMult}x)</td><td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(geoAdjustment)}</td><td style={{ textAlign: "center" }}>Yes</td><td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(billableGeoAdj)}</td></tr>
            <tr><td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Recoverable Capital Fee</td><td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(recoverableFeeGross)}</td><td style={{ textAlign: "center" }}>{includeRecoverableFee}</td><td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(billableRecoverableFee)}</td></tr>
            <tr style={{ background: C.cardBg }}><td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Phase 4 Governance</td><td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(phase4FeeGross)}</td><td style={{ textAlign: "center" }}>{includePhase4}</td><td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(billablePhase4)}</td></tr>
            <tr><td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Asset Panda Coordination</td><td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(ASSET_PANDA_FEE)}</td><td style={{ textAlign: "center" }}>{pandaStatus}</td><td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(billablePanda)}</td></tr>
            <tr style={{ borderTop: `2px solid ${C.slate}`, fontWeight: 700 }}><td style={{ padding: "0.6rem 0.5rem", fontSize: "0.9rem" }}>TOTAL CLIENT INVESTMENT</td><td colSpan={2}></td><td style={{ padding: "0.6rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", color: C.slate }}>{fmtFull(totalInvestment)}</td></tr>
          </tbody>
        </table>

        {/* Delivery Cost Table */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem" }}>Delivery Cost Estimate</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead><tr style={{ background: C.cardBg }}><th style={{ padding: "0.5rem", textAlign: "left", fontSize: "0.8rem", borderBottom: `1px solid ${C.border}` }}>Metric</th><th style={{ padding: "0.5rem", textAlign: "right", fontSize: "0.8rem", borderBottom: `1px solid ${C.border}` }}>Value</th><th style={{ padding: "0.5rem", textAlign: "right", fontSize: "0.8rem", borderBottom: `1px solid ${C.border}` }}>Margin Impact</th></tr></thead>
          <tbody>
            <tr><td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Field hours ({fmtNum(assetCount)} ÷ {fieldProductivity} × {workdayHours}h)</td><td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmtNum(Math.round(fieldHours))} hrs</td><td></td></tr>
            <tr style={{ background: C.cardBg }}><td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Field payroll (@ ${fieldContractorPay}/hr)</td><td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(fieldPayroll)}</td><td style={{ textAlign: "right", color: "#EF4444" }}>-{fmtPct(fieldPayroll / totalInvestment)}</td></tr>
            <tr><td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Reconciliation payroll ({(reconciliationPct * 100).toFixed(0)}% × ${reconciliationPay}/hr)</td><td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(reconPayroll)}</td><td style={{ textAlign: "right", color: "#EF4444" }}>-{fmtPct(reconPayroll / totalInvestment)}</td></tr>
            <tr style={{ background: C.cardBg }}><td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>QA payroll ({(qaPct * 100).toFixed(0)}% × ${qaPay}/hr)</td><td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(qaPayroll)}</td><td style={{ textAlign: "right", color: "#EF4444" }}>-{fmtPct(qaPayroll / totalInvestment)}</td></tr>
            <tr><td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>PM payroll ({(pmPct * 100).toFixed(0)}% × ${pmPay}/hr)</td><td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(pmPayroll)}</td><td style={{ textAlign: "right", color: "#EF4444" }}>-{fmtPct(pmPayroll / totalInvestment)}</td></tr>
            <tr style={{ background: C.cardBg }}><td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Leadership travel ({travelingLeaders} × {avgProjectWeeks}wks × ${fmtNum(weeklyTravelPackage)}/wk)</td><td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(leadershipTravel)}</td><td style={{ textAlign: "right", color: "#EF4444" }}>-{fmtPct(leadershipTravel / totalInvestment)}</td></tr>
            <tr><td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Allocated overhead ({(overheadAllocation * 100).toFixed(0)}% of revenue)</td><td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(overhead)}</td><td style={{ textAlign: "right", color: "#EF4444" }}>-{fmtPct(overhead / totalInvestment)}</td></tr>
            <tr style={{ borderTop: `2px solid ${C.border}`, fontWeight: 600 }}><td style={{ padding: "0.5rem 0.5rem" }}>Total Delivery Cost</td><td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: "#EF4444" }}>{fmt(totalDeliveryCost)}</td><td style={{ textAlign: "right", color: "#EF4444" }}>-{fmtPct(totalDeliveryCost / totalInvestment)}</td></tr>
            <tr style={{ borderTop: `2px solid ${C.gold}`, fontWeight: 700 }}><td style={{ padding: "0.6rem 0.5rem", color: C.teal }}>Estimated Profit</td><td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", color: C.teal }}>{fmt(estimatedProfit)}</td><td style={{ textAlign: "right", color: C.teal, fontWeight: 700 }}>{fmtPct(profitMargin)} margin</td></tr>
          </tbody>
        </table>

        {/* PROJECT STAFFING ASSUMPTIONS — Feasibility ONLY, NOT on proposal */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem" }}>Project Staffing Assumptions</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead><tr style={{ background: C.charcoal }}><th style={{ padding: "0.5rem", textAlign: "left", fontSize: "0.8rem", color: "white" }}>Position</th><th style={{ padding: "0.5rem", textAlign: "center", fontSize: "0.8rem", color: "white" }}># Per Position</th><th style={{ padding: "0.5rem", textAlign: "right", fontSize: "0.8rem", color: "white" }}>Purpose</th></tr></thead>
          <tbody>
            <tr><td style={{ padding: "0.4rem 0.5rem" }}>Required Field Production Staff</td><td style={{ textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, background: "#FFFDE7" }}>{requiredFieldStaff}</td><td style={{ textAlign: "right", color: C.muted }}>1099</td></tr>
            <tr style={{ background: C.cardBg }}><td style={{ padding: "0.4rem 0.5rem" }}>Field Asset Manager</td><td style={{ textAlign: "center", fontFamily: "'JetBrains Mono', monospace" }}>{fieldAssetManagers}</td><td style={{ textAlign: "right", color: C.muted }}>1099</td></tr>
            <tr><td style={{ padding: "0.4rem 0.5rem" }}>Asset Intelligence Specialist</td><td style={{ textAlign: "center", fontFamily: "'JetBrains Mono', monospace" }}>{assetIntelSpecialists}</td><td style={{ textAlign: "right", color: C.muted }}>1099</td></tr>
            <tr style={{ background: C.cardBg }}><td style={{ padding: "0.4rem 0.5rem" }}>Data Reconciliation Specialist</td><td style={{ textAlign: "center", fontFamily: "'JetBrains Mono', monospace" }}>{dataReconSpecialists}</td><td style={{ textAlign: "right", color: C.muted }}>Executive/1099</td></tr>
            <tr><td style={{ padding: "0.4rem 0.5rem" }}>Asset Recovery Specialist</td><td style={{ textAlign: "center", fontFamily: "'JetBrains Mono', monospace" }}>{assetRecoverySpecialists}</td><td style={{ textAlign: "right", color: C.muted }}>Executive/1099</td></tr>
            <tr style={{ background: C.cardBg }}><td style={{ padding: "0.4rem 0.5rem" }}>Quality Assurance Specialist</td><td style={{ textAlign: "center", fontFamily: "'JetBrains Mono', monospace" }}>{qaSpecialists}</td><td style={{ textAlign: "right", color: C.muted }}>Executive/1099</td></tr>
            <tr><td style={{ padding: "0.4rem 0.5rem" }}>Project Manager</td><td style={{ textAlign: "center", fontFamily: "'JetBrains Mono', monospace" }}>{projectManagers}</td><td></td></tr>
            <tr style={{ borderTop: `2px solid ${C.slate}`, fontWeight: 700 }}><td style={{ padding: "0.6rem 0.5rem" }}>Total:</td><td style={{ textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", color: C.slate, background: "#FFFDE7" }}>{totalStaff}</td><td></td></tr>
          </tbody>
        </table>

        {/* Travel Breakdown */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem" }}>Travel Cost Breakdown</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
          <tbody>
            <tr style={{ background: C.cardBg }}><td style={{ padding: "0.4rem 0.5rem" }}>Weekly Lodging per Traveler</td><td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(weeklyLodging)}</td></tr>
            <tr><td style={{ padding: "0.4rem 0.5rem" }}>Weekly Per Diem per Traveler</td><td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(weeklyPerDiem)}</td></tr>
            <tr style={{ background: C.cardBg }}><td style={{ padding: "0.4rem 0.5rem" }}>Weekly Transportation per Traveler</td><td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(weeklyTransport)}</td></tr>
            <tr style={{ borderTop: `1px solid ${C.border}`, fontWeight: 600 }}><td style={{ padding: "0.4rem 0.5rem" }}>Total Weekly per Traveler</td><td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(weeklyTravelPackage)}</td></tr>
            <tr style={{ fontWeight: 700 }}><td style={{ padding: "0.4rem 0.5rem" }}>Total Travel ({travelingLeaders} travelers × {avgProjectWeeks} weeks)</td><td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(leadershipTravel)}</td></tr>
          </tbody>
        </table>
      </div>

      {/* ═══ PROPOSAL SUMMARY (Client-Facing) ═══ */}
      <div ref={proposalRef} style={{ background: "white", padding: "2rem", borderRadius: 8, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: `3px solid ${C.gold}` }}>
          <div>
            <img src={LOGO_BASE64} alt="LAI" style={{ height: 45, marginBottom: "0.5rem" }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.slate }}>Engagement Investment Summary</h2>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.8rem", color: C.muted }}><p>Prepared: {new Date().toLocaleDateString()}</p></div>
        </div>

        {/* Client Details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "2rem", padding: "1rem", background: C.cardBg, borderRadius: 6 }}>
          <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Client</span><p style={{ fontWeight: 600, color: C.text }}>{clientName || "—"}</p></div>
          <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Industry</span><p style={{ fontWeight: 600, color: C.text }}>{industry}</p></div>
          <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Estimated Assets</span><p style={{ fontWeight: 600, color: C.text }}>{fmtNum(assetCount)}</p></div>
          <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Locations</span><p style={{ fontWeight: 600, color: C.text }}>{locations}</p></div>
          <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Geographic Scope</span><p style={{ fontWeight: 600, color: C.text }}>{geoScope}</p></div>
          <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Estimated Recoverable Capital</span><p style={{ fontWeight: 600, color: C.text }}>{fmt(recoverableCapital)}</p></div>
        </div>

        {/* Total Investment */}
        <div style={{ textAlign: "center", padding: "1.5rem", background: `linear-gradient(135deg, ${C.slate}, ${C.charcoal})`, borderRadius: 8, marginBottom: "2rem" }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>Total Engagement Investment</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 700, color: C.gold }}>{fmtFull(totalInvestment)}</p>
          {includePhase4 === "Yes" && <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", marginTop: "0.25rem" }}>Phase 4 Governance Included</p>}
        </div>

        {/* ROI Analysis */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: C.slate, marginBottom: "1rem" }}>Return on Investment Analysis</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ textAlign: "center", padding: "1rem", border: `1px solid ${C.border}`, borderRadius: 6 }}><p style={{ fontSize: "0.75rem", color: C.muted, marginBottom: "0.25rem" }}>First-Year ROI</p><p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.3rem", fontWeight: 700, color: C.teal }}>{fmtPct(firstYearROI)}</p></div>
          <div style={{ textAlign: "center", padding: "1rem", border: `1px solid ${C.border}`, borderRadius: 6 }}><p style={{ fontSize: "0.75rem", color: C.muted, marginBottom: "0.25rem" }}>Net Financial Benefit</p><p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.3rem", fontWeight: 700, color: C.teal }}>{fmt(netBenefit)}</p></div>
          <div style={{ textAlign: "center", padding: "1rem", border: `1px solid ${C.border}`, borderRadius: 6 }}><p style={{ fontSize: "0.75rem", color: C.muted, marginBottom: "0.25rem" }}>Return Multiple</p><p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.3rem", fontWeight: 700, color: C.teal }}>{returnMultiple.toFixed(2)}x</p></div>
        </div>

        {/* 3-Year Analysis */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem" }}>3-Year Analysis</h3>
        <p style={{ fontSize: "0.8rem", color: C.muted, marginBottom: "0.75rem" }}>Assumes {(annualOngoingSavings * 100).toFixed(0)}% annual ongoing savings from recovered capital in years 2–3.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ textAlign: "center", padding: "0.75rem", background: C.cardBg, borderRadius: 6 }}><p style={{ fontSize: "0.75rem", color: C.muted }}>3-Year ROI</p><p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 700, color: C.slate }}>{fmtPct(threeYearROI)}</p></div>
          <div style={{ textAlign: "center", padding: "0.75rem", background: C.cardBg, borderRadius: 6 }}><p style={{ fontSize: "0.75rem", color: C.muted }}>3-Year Net Benefit</p><p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 700, color: C.slate }}>{fmt(threeYearBenefit)}</p></div>
          <div style={{ textAlign: "center", padding: "0.75rem", background: C.cardBg, borderRadius: 6 }}><p style={{ fontSize: "0.75rem", color: C.muted }}>3-Year Multiple</p><p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 700, color: C.slate }}>{threeYearMultiple.toFixed(2)}x</p></div>
        </div>

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
            {includeAssetPanda === "Yes" && <li>• Asset Panda introduction/coordination{pandaStatus === "Waived" ? " (fee waived)" : ""}</li>}
            {includePhase4 === "Yes" && <li>• Recurring governance program</li>}
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
        {notes && (
          <div style={{ padding: "1rem", background: C.cardBg, borderRadius: 6, marginBottom: "2rem" }}>
            <p style={{ fontSize: "0.8rem", color: C.muted, fontWeight: 600, marginBottom: "0.25rem" }}>Notes</p>
            <p style={{ fontSize: "0.85rem", color: C.text }}>{notes}</p>
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
