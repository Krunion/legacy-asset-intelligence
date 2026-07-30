/**
 * LAI Total Engagement Billing Calculator
 * Rebuilt to match Excel spreadsheet exactly:
 * - Client Tab: rows 4-14 (input fields)
 * - Assumptions Tab: rows 40-54 & 58 (editable assumptions)
 * - Pricing Summary (calculated)
 * - Internal Feasibility with Project Staffing Assumptions (internal only)
 * - Proposal Summary (client-facing)
 */

import { useState, useRef } from "react";
import { LOGO_BASE64 } from "./logoBase64";

// ─── Data Tables (from spreadsheet Assumptions Tab rows 3-36) ───────────────

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

// Fixed constants (not editable, rows 56-57)
const WORKDAYS_PER_WEEK = 5;
const SPECIALISTS_PER_FAM = 20;

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

// Client Tab: rows 4-14
interface ClientInputs {
  clientName: string;           // Row 4
  industry: string;             // Row 5
  estimatedAssetCount: number;  // Row 6
  numberOfLocations: number;    // Row 7
  geoScope: number;             // Row 8 (index into GEO_MULTIPLIERS)
  estimatedRecoverableCapital: number; // Row 9
  includeRecoverableFee: string;      // Row 10 (Yes/No)
  includePhase4: string;              // Row 11 (Yes/No)
  includeAssetPanda: string;          // Row 12 (Yes/No)
  waiveAssetPanda: string;            // Row 13 (Yes/No)
  timeframeMonths: number;            // Row 14
  notes: string;                      // Extra field for notes
}

// Assumptions Tab: rows 40-54 & 58
interface Assumptions {
  fieldProductivity: number;          // Row 40: assets/person/day
  fieldContractorPay: number;         // Row 41: $/hour
  reconciliationPay: number;          // Row 42: $/hour
  qaPay: number;                      // Row 43: $/hour
  pmPay: number;                      // Row 44: $/hour
  workdayHours: number;               // Row 45: hours/day
  reconciliationPct: number;          // Row 46: decimal (0.30 = 30%)
  qaPct: number;                      // Row 47: decimal (0.08 = 8%)
  pmPct: number;                      // Row 48: decimal (0.06 = 6%)
  travelingLeaders: number;           // Row 49: people
  averageProjectWeeks: number;        // Row 50: weeks
  weeklyLodgingPerTraveler: number;   // Row 51: $/week
  weeklyPerDiemPerTraveler: number;   // Row 52: $/week
  weeklyTransportPerTraveler: number; // Row 53: $/week
  overheadAllocation: number;         // Row 54: decimal (0.15 = 15%)
  annualOngoingSavings: number;       // Row 58: decimal (0.10 = 10%)
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ProposalCalculator({ onBack }: { onBack: () => void }) {
  // Client Tab state (rows 4-14)
  const [clientInputs, setClientInputs] = useState<ClientInputs>({
    clientName: "",
    industry: "Manufacturing",
    estimatedAssetCount: 10000,
    numberOfLocations: 1,
    geoScope: 0,
    estimatedRecoverableCapital: 500000,
    includeRecoverableFee: "Yes",
    includePhase4: "Yes",
    includeAssetPanda: "Yes",
    waiveAssetPanda: "Yes",
    timeframeMonths: 3,
    notes: "",
  });

  // Assumptions Tab state (rows 40-54 & 58)
  const [assumptions, setAssumptions] = useState<Assumptions>({
    fieldProductivity: 200,
    fieldContractorPay: 30,
    reconciliationPay: 30,
    qaPay: 30,
    pmPay: 60,
    workdayHours: 8,
    reconciliationPct: 0.30,
    qaPct: 0.08,
    pmPct: 0.06,
    travelingLeaders: 2,
    averageProjectWeeks: 12,
    weeklyLodgingPerTraveler: 1050,
    weeklyPerDiemPerTraveler: 490,
    weeklyTransportPerTraveler: 450,
    overheadAllocation: 0.15,
    annualOngoingSavings: 0.10,
  });

  const [activeTab, setActiveTab] = useState<"client" | "assumptions">("client");
  const [showOutput, setShowOutput] = useState(false);
  const feasibilityRef = useRef<HTMLDivElement>(null);
  const proposalRef = useRef<HTMLDivElement>(null);

  const updateClient = (key: keyof ClientInputs, value: any) => {
    setClientInputs(prev => ({ ...prev, [key]: value }));
  };

  const updateAssumptions = (key: keyof Assumptions, value: any) => {
    setAssumptions(prev => ({ ...prev, [key]: value }));
  };

  // ─── Calculations ───────────────────────────────────────────────────────────

  const includeRecoverableFee = clientInputs.includeRecoverableFee === "Yes";
  const includePhase4 = clientInputs.includePhase4 === "Yes";
  const includeAssetPanda = clientInputs.includeAssetPanda === "Yes";
  const waiveAssetPanda = clientInputs.waiveAssetPanda === "Yes";

  const assetFee = calculateProgressiveAssetFee(clientInputs.estimatedAssetCount);
  const geoMultiplier = GEO_MULTIPLIERS[clientInputs.geoScope];
  const geoAdjustment = assetFee.total * (geoMultiplier.multiplier - 1);
  const baseWithGeo = assetFee.total + geoAdjustment;

  const recoverableFee = includeRecoverableFee
    ? calculateRecoverableCapitalFee(clientInputs.estimatedRecoverableCapital)
    : { total: 0, effectiveRate: 0 };

  const phase4Fee = includePhase4 ? getPhase4Fee(clientInputs.estimatedAssetCount) : 0;
  const assetPandaFee = includeAssetPanda && !waiveAssetPanda ? ASSET_PANDA_FEE : 0;

  const totalBeforeMinimum = baseWithGeo + recoverableFee.total + phase4Fee + assetPandaFee;
  const totalInvestment = Math.max(totalBeforeMinimum, MINIMUM_ENGAGEMENT_FEE);

  const effectiveRate = clientInputs.estimatedAssetCount > 0 ? totalInvestment / clientInputs.estimatedAssetCount : 0;

  // Internal Feasibility calculations using Assumptions Tab
  const projectWeeks = assumptions.averageProjectWeeks;
  const weeklyTravelPerLeader = assumptions.weeklyLodgingPerTraveler + assumptions.weeklyPerDiemPerTraveler + assumptions.weeklyTransportPerTraveler;

  const fieldHours = (clientInputs.estimatedAssetCount / assumptions.fieldProductivity) * assumptions.workdayHours;
  const fieldPayroll = fieldHours * assumptions.fieldContractorPay;
  const reconciliationPayroll = fieldHours * assumptions.reconciliationPct * assumptions.reconciliationPay;
  const qaPayroll = fieldHours * assumptions.qaPct * assumptions.qaPay;
  const pmPayroll = fieldHours * assumptions.pmPct * assumptions.pmPay;
  const leadershipTravel = assumptions.travelingLeaders * projectWeeks * weeklyTravelPerLeader;
  const overhead = totalInvestment * assumptions.overheadAllocation;
  const totalDeliveryCost = fieldPayroll + reconciliationPayroll + qaPayroll + pmPayroll + leadershipTravel + overhead;
  const estimatedProfit = totalInvestment - totalDeliveryCost;
  const profitMargin = totalInvestment > 0 ? (estimatedProfit / totalInvestment) * 100 : 0;

  // Project Staffing Assumptions (from spreadsheet image)
  const requiredFieldStaff = Math.ceil(clientInputs.estimatedAssetCount / assumptions.fieldProductivity / WORKDAYS_PER_WEEK / projectWeeks);
  const fieldAssetManagers = Math.ceil(requiredFieldStaff / SPECIALISTS_PER_FAM);
  const assetIntelligenceSpecialists = requiredFieldStaff; // same as field staff
  const dataReconciliationSpecialists = Math.ceil(requiredFieldStaff * assumptions.reconciliationPct);
  const assetRecoverySpecialists = Math.ceil(requiredFieldStaff * 0.15); // ~15% of field staff
  const qaSpecialists = Math.ceil(requiredFieldStaff * assumptions.qaPct / 0.08 * 0.2); // scaled from QA %
  const projectManagers = Math.max(2, Math.ceil(requiredFieldStaff / 10));
  const totalStaff = requiredFieldStaff + fieldAssetManagers + assetIntelligenceSpecialists + dataReconciliationSpecialists + assetRecoverySpecialists + qaSpecialists + projectManagers;

  // ROI calculations
  const firstYearROI = clientInputs.estimatedRecoverableCapital > 0
    ? ((clientInputs.estimatedRecoverableCapital - totalInvestment) / totalInvestment) * 100
    : 0;
  const netBenefit = clientInputs.estimatedRecoverableCapital - totalInvestment;
  const returnMultiple = totalInvestment > 0 ? clientInputs.estimatedRecoverableCapital / totalInvestment : 0;

  // 3-Year: uses Annual Ongoing Savings from Assumptions row 58
  const annualSavings = clientInputs.estimatedRecoverableCapital * assumptions.annualOngoingSavings;
  const year2_3Savings = includePhase4 ? annualSavings * 2 : 0;
  const threeYearBenefit = netBenefit + year2_3Savings;
  const threeYearROI = totalInvestment > 0 ? (threeYearBenefit / totalInvestment) * 100 : 0;
  const threeYearMultiple = totalInvestment > 0 ? (clientInputs.estimatedRecoverableCapital + year2_3Savings) / totalInvestment : 0;

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
          <title>LAI ${section === "feasibility" ? "Internal Feasibility" : section === "proposal" ? "Proposal Summary" : "Full Report"} - ${clientInputs.clientName || "Client"}</title>
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
      <div style={{ padding: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: C.slate }}>←</button>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.slate }}>
              Total Engagement Billing Calculator
            </h1>
            <p style={{ color: C.muted, fontSize: "0.85rem" }}>LAI Progressive Pricing Model</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "0", marginBottom: "1.5rem", borderBottom: `2px solid ${C.border}` }}>
          <button
            onClick={() => setActiveTab("client")}
            style={{
              padding: "0.6rem 1.5rem",
              background: activeTab === "client" ? C.slate : "transparent",
              color: activeTab === "client" ? "white" : C.muted,
              border: "none",
              borderRadius: "6px 6px 0 0",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          >
            Client Inputs
          </button>
          <button
            onClick={() => setActiveTab("assumptions")}
            style={{
              padding: "0.6rem 1.5rem",
              background: activeTab === "assumptions" ? C.slate : "transparent",
              color: activeTab === "assumptions" ? "white" : C.muted,
              border: "none",
              borderRadius: "6px 6px 0 0",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          >
            Assumptions
          </button>
        </div>

        {/* ─── Client Tab (rows 4-14) ──────────────────────────────────────────── */}
        {activeTab === "client" && (
          <div>
            <div style={{ ...sectionTitleStyle }}>Client Information (Rows 4–14)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
              {/* Row 4: Client Name */}
              <div>
                <label style={labelStyle}>Client Name</label>
                <input style={inputStyle} value={clientInputs.clientName} onChange={e => updateClient("clientName", e.target.value)} placeholder="e.g., Johnson & Johnson" />
              </div>
              {/* Row 5: Industry */}
              <div>
                <label style={labelStyle}>Industry</label>
                <select style={selectStyle} value={clientInputs.industry} onChange={e => updateClient("industry", e.target.value)}>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              {/* Row 6: Estimated Asset Count */}
              <div>
                <label style={labelStyle}>Estimated Asset Count</label>
                <input style={inputStyle} type="number" value={clientInputs.estimatedAssetCount} onChange={e => updateClient("estimatedAssetCount", Number(e.target.value))} min={1} />
              </div>
              {/* Row 7: Number of Locations */}
              <div>
                <label style={labelStyle}>Number of Locations</label>
                <input style={inputStyle} type="number" value={clientInputs.numberOfLocations} onChange={e => updateClient("numberOfLocations", Number(e.target.value))} min={1} />
              </div>
              {/* Row 8: Geographic Scope */}
              <div>
                <label style={labelStyle}>Geographic Scope</label>
                <select style={selectStyle} value={clientInputs.geoScope} onChange={e => updateClient("geoScope", Number(e.target.value))}>
                  {GEO_MULTIPLIERS.map((g, i) => <option key={g.label} value={i}>{g.label} ({g.multiplier}x)</option>)}
                </select>
              </div>
              {/* Row 9: Estimated Recoverable Capital */}
              <div>
                <label style={labelStyle}>Estimated Recoverable Capital</label>
                <input style={inputStyle} type="number" value={clientInputs.estimatedRecoverableCapital} onChange={e => updateClient("estimatedRecoverableCapital", Number(e.target.value))} min={0} />
              </div>
              {/* Row 10: Include Recoverable Capital Fee? */}
              <div>
                <label style={labelStyle}>Include Recoverable Capital Fee?</label>
                <select style={selectStyle} value={clientInputs.includeRecoverableFee} onChange={e => updateClient("includeRecoverableFee", e.target.value)}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              {/* Row 11: Include Phase 4 Governance? */}
              <div>
                <label style={labelStyle}>Include Phase 4 Governance?</label>
                <select style={selectStyle} value={clientInputs.includePhase4} onChange={e => updateClient("includePhase4", e.target.value)}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              {/* Row 12: Include Asset Panda Coordination Fee? */}
              <div>
                <label style={labelStyle}>Include Asset Panda Coordination Fee?</label>
                <select style={selectStyle} value={clientInputs.includeAssetPanda} onChange={e => updateClient("includeAssetPanda", e.target.value)}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              {/* Row 13: Waive Asset Panda Fee? */}
              <div>
                <label style={labelStyle}>Waive Asset Panda Fee? (1-yr governance)</label>
                <select style={selectStyle} value={clientInputs.waiveAssetPanda} onChange={e => updateClient("waiveAssetPanda", e.target.value)}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              {/* Row 14: Timeframe */}
              <div>
                <label style={labelStyle}>Timeframe (months)</label>
                <input style={inputStyle} type="number" value={clientInputs.timeframeMonths} onChange={e => updateClient("timeframeMonths", Number(e.target.value))} min={1} />
              </div>
              {/* Notes (extra) */}
              <div>
                <label style={labelStyle}>Notes</label>
                <input style={inputStyle} value={clientInputs.notes} onChange={e => updateClient("notes", e.target.value)} placeholder="Optional notes" />
              </div>
            </div>
          </div>
        )}

        {/* ─── Assumptions Tab (rows 40-54 & 58) ───────────────────────────────── */}
        {activeTab === "assumptions" && (
          <div>
            <div style={{ ...sectionTitleStyle }}>Cost & Staffing Assumptions (Rows 40–54, 58)</div>
            <p style={{ fontSize: "0.8rem", color: C.muted, marginBottom: "1.5rem" }}>
              These values drive the Internal Feasibility calculations. Adjust per engagement scenario.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
              {/* Row 40 */}
              <div>
                <label style={labelStyle}>Field Productivity (assets/person/day)</label>
                <input style={inputStyle} type="number" value={assumptions.fieldProductivity} onChange={e => updateAssumptions("fieldProductivity", Number(e.target.value))} min={1} />
              </div>
              {/* Row 41 */}
              <div>
                <label style={labelStyle}>Field Contractor Pay ($/hr)</label>
                <input style={inputStyle} type="number" value={assumptions.fieldContractorPay} onChange={e => updateAssumptions("fieldContractorPay", Number(e.target.value))} min={0} />
              </div>
              {/* Row 42 */}
              <div>
                <label style={labelStyle}>Reconciliation Pay ($/hr)</label>
                <input style={inputStyle} type="number" value={assumptions.reconciliationPay} onChange={e => updateAssumptions("reconciliationPay", Number(e.target.value))} min={0} />
              </div>
              {/* Row 43 */}
              <div>
                <label style={labelStyle}>QA Pay ($/hr)</label>
                <input style={inputStyle} type="number" value={assumptions.qaPay} onChange={e => updateAssumptions("qaPay", Number(e.target.value))} min={0} />
              </div>
              {/* Row 44 */}
              <div>
                <label style={labelStyle}>Project Management Pay ($/hr)</label>
                <input style={inputStyle} type="number" value={assumptions.pmPay} onChange={e => updateAssumptions("pmPay", Number(e.target.value))} min={0} />
              </div>
              {/* Row 45 */}
              <div>
                <label style={labelStyle}>Workday Hours (hrs/day)</label>
                <input style={inputStyle} type="number" value={assumptions.workdayHours} onChange={e => updateAssumptions("workdayHours", Number(e.target.value))} min={1} />
              </div>
              {/* Row 46 */}
              <div>
                <label style={labelStyle}>Reconciliation % of Field Hours</label>
                <input style={inputStyle} type="number" step="0.01" value={assumptions.reconciliationPct} onChange={e => updateAssumptions("reconciliationPct", Number(e.target.value))} min={0} max={1} />
                <span style={{ fontSize: "0.7rem", color: C.muted }}>e.g., 0.30 = 30%</span>
              </div>
              {/* Row 47 */}
              <div>
                <label style={labelStyle}>QA % of Field Hours</label>
                <input style={inputStyle} type="number" step="0.01" value={assumptions.qaPct} onChange={e => updateAssumptions("qaPct", Number(e.target.value))} min={0} max={1} />
                <span style={{ fontSize: "0.7rem", color: C.muted }}>e.g., 0.08 = 8%</span>
              </div>
              {/* Row 48 */}
              <div>
                <label style={labelStyle}>PM % of Field Hours</label>
                <input style={inputStyle} type="number" step="0.01" value={assumptions.pmPct} onChange={e => updateAssumptions("pmPct", Number(e.target.value))} min={0} max={1} />
                <span style={{ fontSize: "0.7rem", color: C.muted }}>e.g., 0.06 = 6%</span>
              </div>
              {/* Row 49 */}
              <div>
                <label style={labelStyle}>Traveling LAI Leaders</label>
                <input style={inputStyle} type="number" value={assumptions.travelingLeaders} onChange={e => updateAssumptions("travelingLeaders", Number(e.target.value))} min={0} />
              </div>
              {/* Row 50 */}
              <div>
                <label style={labelStyle}>Average Project Weeks</label>
                <input style={inputStyle} type="number" value={assumptions.averageProjectWeeks} onChange={e => updateAssumptions("averageProjectWeeks", Number(e.target.value))} min={1} />
              </div>
              {/* Row 51 */}
              <div>
                <label style={labelStyle}>Weekly Lodging / Traveler ($/wk)</label>
                <input style={inputStyle} type="number" value={assumptions.weeklyLodgingPerTraveler} onChange={e => updateAssumptions("weeklyLodgingPerTraveler", Number(e.target.value))} min={0} />
                <span style={{ fontSize: "0.7rem", color: C.muted }}>$150/night × 7</span>
              </div>
              {/* Row 52 */}
              <div>
                <label style={labelStyle}>Weekly Per Diem / Traveler ($/wk)</label>
                <input style={inputStyle} type="number" value={assumptions.weeklyPerDiemPerTraveler} onChange={e => updateAssumptions("weeklyPerDiemPerTraveler", Number(e.target.value))} min={0} />
                <span style={{ fontSize: "0.7rem", color: C.muted }}>$70/day × 7</span>
              </div>
              {/* Row 53 */}
              <div>
                <label style={labelStyle}>Weekly Transport / Traveler ($/wk)</label>
                <input style={inputStyle} type="number" value={assumptions.weeklyTransportPerTraveler} onChange={e => updateAssumptions("weeklyTransportPerTraveler", Number(e.target.value))} min={0} />
                <span style={{ fontSize: "0.7rem", color: C.muted }}>Flights/rental/mileage</span>
              </div>
              {/* Row 54 */}
              <div>
                <label style={labelStyle}>Overhead Allocation (% of revenue)</label>
                <input style={inputStyle} type="number" step="0.01" value={assumptions.overheadAllocation} onChange={e => updateAssumptions("overheadAllocation", Number(e.target.value))} min={0} max={1} />
                <span style={{ fontSize: "0.7rem", color: C.muted }}>e.g., 0.15 = 15%</span>
              </div>
              {/* Row 58 */}
              <div>
                <label style={labelStyle}>Annual Ongoing Savings (% of Recoverable)</label>
                <input style={inputStyle} type="number" step="0.01" value={assumptions.annualOngoingSavings} onChange={e => updateAssumptions("annualOngoingSavings", Number(e.target.value))} min={0} max={1} />
                <span style={{ fontSize: "0.7rem", color: C.muted }}>e.g., 0.10 = 10% (for 3-year ROI)</span>
              </div>
            </div>
          </div>
        )}

        {/* Live Preview (always visible) */}
        <div style={{ background: C.cardBg, borderRadius: 8, padding: "1.5rem", border: `1px solid ${C.border}`, marginBottom: "2rem" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "1rem" }}>Live Pricing Preview</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "0.4rem 0", color: C.text }}>Progressive Asset Fee ({fmtNum(clientInputs.estimatedAssetCount)} assets)</td>
                <td style={{ padding: "0.4rem 0", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{fmt(assetFee.total)}</td>
              </tr>
              {geoAdjustment > 0 && (
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "0.4rem 0", color: C.text }}>Geographic Adjustment ({geoMultiplier.label} {geoMultiplier.multiplier}x)</td>
                  <td style={{ padding: "0.4rem 0", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{fmt(geoAdjustment)}</td>
                </tr>
              )}
              {includeRecoverableFee && recoverableFee.total > 0 && (
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "0.4rem 0", color: C.text }}>Recoverable Capital Fee ({fmtPct(recoverableFee.effectiveRate)} effective)</td>
                  <td style={{ padding: "0.4rem 0", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{fmt(recoverableFee.total)}</td>
                </tr>
              )}
              {includePhase4 && (
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "0.4rem 0", color: C.text }}>Phase 4 Governance (Annual)</td>
                  <td style={{ padding: "0.4rem 0", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{fmt(phase4Fee)}</td>
                </tr>
              )}
              {includeAssetPanda && (
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "0.4rem 0", color: C.text }}>Asset Panda Coordination</td>
                  <td style={{ padding: "0.4rem 0", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, textDecoration: waiveAssetPanda ? "line-through" : "none", color: waiveAssetPanda ? C.muted : C.text }}>
                    {waiveAssetPanda ? `${fmt(ASSET_PANDA_FEE)} (Waived)` : fmt(ASSET_PANDA_FEE)}
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
          Print Internal Feasibility
        </button>
        <button onClick={() => handlePrint("proposal")} style={{ padding: "0.6rem 1.2rem", background: C.gold, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
          Print Proposal Summary
        </button>
        <button onClick={() => handlePrint("both")} style={{ padding: "0.6rem 1.2rem", background: C.teal, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
          Print Both (Separate Pages)
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
            <p style={{ color: "#EF4444", fontWeight: 700, fontSize: "0.85rem", marginTop: "0.25rem" }}>CONFIDENTIAL — NOT FOR CLIENT DISTRIBUTION</p>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.8rem", color: C.muted }}>
            <p>Client: {clientInputs.clientName || "—"}</p>
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
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Progressive Asset Fee ({fmtNum(clientInputs.estimatedAssetCount)} assets)</td>
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
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "center", fontSize: "0.85rem" }}>{includeRecoverableFee ? "Yes" : "No"}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{includeRecoverableFee ? fmt(recoverableFee.total) : "$0"}</td>
            </tr>
            <tr style={{ background: C.cardBg }}>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Phase 4 Governance</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(phase4Fee)}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "center", fontSize: "0.85rem" }}>{includePhase4 ? "Yes" : "No"}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{includePhase4 ? fmt(phase4Fee) : "$0"}</td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Asset Panda Coordination</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(ASSET_PANDA_FEE)}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "center", fontSize: "0.85rem" }}>{includeAssetPanda ? (waiveAssetPanda ? "Waived" : "Yes") : "No"}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(assetPandaFee)}</td>
            </tr>
            <tr style={{ borderTop: `2px solid ${C.slate}`, fontWeight: 700 }}>
              <td style={{ padding: "0.6rem 0.5rem", fontSize: "0.9rem" }}>TOTAL CLIENT INVESTMENT</td>
              <td colSpan={2}></td>
              <td style={{ padding: "0.6rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", color: C.slate }}>{fmtFull(totalInvestment)}</td>
            </tr>
          </tbody>
        </table>

        {/* Delivery Cost Analysis */}
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
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Field Hours ({fmtNum(clientInputs.estimatedAssetCount)} assets ÷ {assumptions.fieldProductivity}/day × {assumptions.workdayHours}h)</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmtNum(Math.round(fieldHours))} hrs</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem" }}>—</td>
            </tr>
            <tr style={{ background: C.cardBg }}>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Field Payroll (@ ${assumptions.fieldContractorPay}/hr)</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(fieldPayroll)}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: "#EF4444" }}>-{fmtPct((fieldPayroll / totalInvestment) * 100)}</td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Reconciliation Payroll ({fmtPct(assumptions.reconciliationPct * 100)} of field hrs @ ${assumptions.reconciliationPay}/hr)</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(reconciliationPayroll)}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: "#EF4444" }}>-{fmtPct((reconciliationPayroll / totalInvestment) * 100)}</td>
            </tr>
            <tr style={{ background: C.cardBg }}>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>QA Payroll ({fmtPct(assumptions.qaPct * 100)} of field hrs @ ${assumptions.qaPay}/hr)</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(qaPayroll)}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: "#EF4444" }}>-{fmtPct((qaPayroll / totalInvestment) * 100)}</td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Project Management ({fmtPct(assumptions.pmPct * 100)} of field hrs @ ${assumptions.pmPay}/hr)</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(pmPayroll)}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: "#EF4444" }}>-{fmtPct((pmPayroll / totalInvestment) * 100)}</td>
            </tr>
            <tr style={{ background: C.cardBg }}>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Leadership Travel ({assumptions.travelingLeaders} leaders × {projectWeeks} wks × ${fmtNum(weeklyTravelPerLeader)}/wk)</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(leadershipTravel)}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: "#EF4444" }}>-{fmtPct((leadershipTravel / totalInvestment) * 100)}</td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Allocated Overhead ({fmtPct(assumptions.overheadAllocation * 100)} of revenue)</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(overhead)}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: "#EF4444" }}>-{fmtPct((overhead / totalInvestment) * 100)}</td>
            </tr>
            <tr style={{ borderTop: `2px solid ${C.border}`, fontWeight: 600 }}>
              <td style={{ padding: "0.5rem 0.5rem", fontSize: "0.85rem" }}>Total Delivery Cost</td>
              <td style={{ padding: "0.5rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#EF4444" }}>{fmt(totalDeliveryCost)}</td>
              <td style={{ padding: "0.5rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: "#EF4444" }}>-{fmtPct((totalDeliveryCost / totalInvestment) * 100)}</td>
            </tr>
            <tr style={{ borderTop: `2px solid ${C.gold}`, fontWeight: 700 }}>
              <td style={{ padding: "0.6rem 0.5rem", fontSize: "0.9rem", color: C.teal }}>Estimated Profit</td>
              <td style={{ padding: "0.6rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", color: C.teal }}>{fmt(estimatedProfit)}</td>
              <td style={{ padding: "0.6rem 0.5rem", textAlign: "right", fontSize: "0.9rem", color: C.teal, fontWeight: 700 }}>{fmtPct(profitMargin)} margin</td>
            </tr>
          </tbody>
        </table>

        {/* ─── Project Staffing Assumptions (Feasibility ONLY) ─────────────────── */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem" }}>Project Staffing Assumptions</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead>
            <tr style={{ background: C.charcoal }}>
              <th style={{ padding: "0.5rem", textAlign: "left", fontSize: "0.8rem", color: "white", borderBottom: `1px solid ${C.border}` }}>Position</th>
              <th style={{ padding: "0.5rem", textAlign: "center", fontSize: "0.8rem", color: "white", borderBottom: `1px solid ${C.border}` }}># Per Position</th>
              <th style={{ padding: "0.5rem", textAlign: "right", fontSize: "0.8rem", color: "white", borderBottom: `1px solid ${C.border}` }}>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Required Field Production Staff</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", fontWeight: 700, background: "#FFFDE7" }}>{requiredFieldStaff}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: C.muted }}>1099</td>
            </tr>
            <tr style={{ background: C.cardBg }}>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Field Asset Manager</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fieldAssetManagers}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: C.muted }}>1099</td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Asset Intelligence Specialist</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{assetIntelligenceSpecialists}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: C.muted }}>1099</td>
            </tr>
            <tr style={{ background: C.cardBg }}>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Data Reconciliation Specialist</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{dataReconciliationSpecialists}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: C.muted }}>Executive/1099</td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Asset Recovery Specialist</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{assetRecoverySpecialists}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: C.muted }}>Executive/1099</td>
            </tr>
            <tr style={{ background: C.cardBg }}>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Quality Assurance Specialist</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{qaSpecialists}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: C.muted }}>Executive/1099</td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Project Manager</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{projectManagers}</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontSize: "0.85rem", color: C.muted }}></td>
            </tr>
            <tr style={{ borderTop: `2px solid ${C.slate}`, fontWeight: 700 }}>
              <td style={{ padding: "0.6rem 0.5rem", fontSize: "0.9rem" }}>Total:</td>
              <td style={{ padding: "0.6rem 0.5rem", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", color: C.slate, background: "#FFFDE7" }}>{totalStaff}</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        {/* Travel Breakdown */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem" }}>Travel Cost Breakdown</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
          <tbody>
            <tr style={{ background: C.cardBg }}>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Weekly Lodging per Traveler</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(assumptions.weeklyLodgingPerTraveler)}</td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Weekly Per Diem per Traveler</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(assumptions.weeklyPerDiemPerTraveler)}</td>
            </tr>
            <tr style={{ background: C.cardBg }}>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Weekly Transportation per Traveler</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(assumptions.weeklyTransportPerTraveler)}</td>
            </tr>
            <tr style={{ borderTop: `1px solid ${C.border}`, fontWeight: 600 }}>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Total Weekly per Traveler</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(weeklyTravelPerLeader)}</td>
            </tr>
            <tr style={{ fontWeight: 700 }}>
              <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem" }}>Total Travel ({assumptions.travelingLeaders} travelers × {projectWeeks} weeks)</td>
              <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(leadershipTravel)}</td>
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
          <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Client</span><p style={{ fontWeight: 600, color: C.text }}>{clientInputs.clientName || "—"}</p></div>
          <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Industry</span><p style={{ fontWeight: 600, color: C.text }}>{clientInputs.industry}</p></div>
          <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Estimated Assets</span><p style={{ fontWeight: 600, color: C.text }}>{fmtNum(clientInputs.estimatedAssetCount)}</p></div>
          <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Locations</span><p style={{ fontWeight: 600, color: C.text }}>{clientInputs.numberOfLocations}</p></div>
          <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Geographic Scope</span><p style={{ fontWeight: 600, color: C.text }}>{geoMultiplier.label}</p></div>
          <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Estimated Recoverable Capital</span><p style={{ fontWeight: 600, color: C.text }}>{fmt(clientInputs.estimatedRecoverableCapital)}</p></div>
        </div>

        {/* Investment */}
        <div style={{ textAlign: "center", padding: "1.5rem", background: `linear-gradient(135deg, ${C.slate}, ${C.charcoal})`, borderRadius: 8, marginBottom: "2rem" }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>Total Engagement Investment</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 700, color: C.gold }}>{fmtFull(totalInvestment)}</p>
          {includePhase4 && <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", marginTop: "0.25rem" }}>Phase 4 Governance Included</p>}
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
        {includePhase4 && (
          <>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem" }}>3-Year Analysis (with Governance)</h3>
            <p style={{ fontSize: "0.8rem", color: C.muted, marginBottom: "0.75rem" }}>
              Assumes {fmtPct(assumptions.annualOngoingSavings * 100)} annual ongoing savings from recovered capital in years 2–3.
            </p>
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
            {includeAssetPanda && <li>• Asset Panda introduction/coordination{waiveAssetPanda ? " (fee waived)" : ""}</li>}
            {includePhase4 && <li>• Recurring governance program</li>}
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
        {clientInputs.notes && (
          <div style={{ padding: "1rem", background: C.cardBg, borderRadius: 6, marginBottom: "2rem" }}>
            <p style={{ fontSize: "0.8rem", color: C.muted, fontWeight: 600, marginBottom: "0.25rem" }}>Notes</p>
            <p style={{ fontSize: "0.85rem", color: C.text }}>{clientInputs.notes}</p>
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
