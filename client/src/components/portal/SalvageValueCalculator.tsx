/**
 * LAI Item Salvage Value Calculator
 * Full-capacity salvage value estimation supporting:
 * - Percentage of Cost method
 * - Straight-Line Residual method
 * - Market/Appraisal Comparison method
 * - IRS Table-Based method
 * - Condition-Adjusted method
 * - Industry Benchmark method
 * Includes estimated Useful Life (Years), condition factor, and printable report.
 */

import { useState, useRef } from "react";
import { LOGO_BASE64 } from "./logoBase64";

// ─── IRS Recovery Period Tables (common asset classes) ──────────────────────

const IRS_ASSET_CLASSES = [
  { label: "Office Furniture & Equipment", recoveryYears: 7, residualPct: 10 },
  { label: "Computers & Peripherals", recoveryYears: 5, residualPct: 5 },
  { label: "Automobiles & Light Trucks", recoveryYears: 5, residualPct: 15 },
  { label: "Heavy Trucks & Trailers", recoveryYears: 5, residualPct: 20 },
  { label: "Manufacturing Equipment", recoveryYears: 7, residualPct: 10 },
  { label: "Industrial Machinery", recoveryYears: 10, residualPct: 12 },
  { label: "Telecommunications Equipment", recoveryYears: 5, residualPct: 8 },
  { label: "Medical Equipment", recoveryYears: 5, residualPct: 10 },
  { label: "Laboratory Equipment", recoveryYears: 7, residualPct: 8 },
  { label: "HVAC Systems", recoveryYears: 15, residualPct: 10 },
  { label: "Electrical Distribution", recoveryYears: 15, residualPct: 12 },
  { label: "Land Improvements", recoveryYears: 15, residualPct: 15 },
  { label: "Nonresidential Real Property", recoveryYears: 39, residualPct: 20 },
  { label: "Residential Rental Property", recoveryYears: 27.5, residualPct: 25 },
  { label: "Farm Equipment", recoveryYears: 7, residualPct: 15 },
  { label: "Construction Equipment", recoveryYears: 5, residualPct: 20 },
  { label: "Aircraft (Non-Commercial)", recoveryYears: 7, residualPct: 25 },
  { label: "Vessels & Water Transport", recoveryYears: 10, residualPct: 15 },
  { label: "Railroad Equipment", recoveryYears: 7, residualPct: 10 },
  { label: "Other (Custom)", recoveryYears: 7, residualPct: 10 },
];

// ─── Industry Benchmarks ────────────────────────────────────────────────────

const INDUSTRY_BENCHMARKS: Record<string, { label: string; typicalSalvagePct: number; typicalLife: number; notes: string }> = {
  healthcare: { label: "Healthcare / Hospital", typicalSalvagePct: 8, typicalLife: 7, notes: "Medical equipment depreciates quickly due to technology advances" },
  manufacturing: { label: "Manufacturing", typicalSalvagePct: 12, typicalLife: 10, notes: "Heavy machinery retains moderate value; specialized tooling less so" },
  construction: { label: "Construction", typicalSalvagePct: 18, typicalLife: 7, notes: "Heavy equipment holds value well; small tools depreciate fast" },
  technology: { label: "Technology / IT", typicalSalvagePct: 5, typicalLife: 4, notes: "Rapid obsolescence drives low salvage values" },
  transportation: { label: "Transportation / Fleet", typicalSalvagePct: 20, typicalLife: 8, notes: "Vehicles maintain resale value with proper maintenance" },
  education: { label: "Education", typicalSalvagePct: 8, typicalLife: 7, notes: "Furniture and AV equipment have moderate residual value" },
  government: { label: "Government / Public Sector", typicalSalvagePct: 10, typicalLife: 10, notes: "Standardized equipment with established surplus markets" },
  utilities: { label: "Utilities / Energy", typicalSalvagePct: 12, typicalLife: 15, notes: "Long-lived infrastructure with moderate scrap value" },
  hospitality: { label: "Hospitality / Hotels", typicalSalvagePct: 10, typicalLife: 7, notes: "FF&E refreshed frequently; limited secondary market" },
  retail: { label: "Retail / Commercial", typicalSalvagePct: 8, typicalLife: 7, notes: "Display fixtures and POS equipment depreciate quickly" },
  aviation: { label: "Aviation", typicalSalvagePct: 25, typicalLife: 15, notes: "Aircraft maintain significant residual value" },
  agriculture: { label: "Agriculture", typicalSalvagePct: 18, typicalLife: 10, notes: "Farm equipment has strong secondary market" },
};

// ─── Condition Factors ──────────────────────────────────────────────────────

const CONDITION_FACTORS = [
  { label: "Excellent — Like new, minimal wear", factor: 1.0 },
  { label: "Good — Normal wear, fully functional", factor: 0.85 },
  { label: "Fair — Moderate wear, some repairs needed", factor: 0.65 },
  { label: "Poor — Heavy wear, major repairs needed", factor: 0.40 },
  { label: "Salvage Only — Non-functional, scrap value", factor: 0.15 },
];

// ─── Types ──────────────────────────────────────────────────────────────────

type SalvageMethod = "percentage" | "straight_line" | "market" | "irs_table" | "condition" | "benchmark";

interface SalvageInputs {
  assetName: string;
  originalCost: number;
  currentAge: number;
  usefulLife: number;
  method: SalvageMethod;
  percentageRate: number;
  marketComparable: number;
  irsClassIndex: number;
  conditionIndex: number;
  industryKey: string;
  maintenanceHistory: "excellent" | "average" | "poor";
  utilizationRate: number; // percentage 0-100
  technologyObsolescence: "none" | "moderate" | "high";
}

interface SalvageResult {
  method: string;
  estimatedSalvage: number;
  percentOfCost: number;
  remainingLife: number;
  annualDepreciation: number;
  notes: string;
}

// ─── Calculation Functions ──────────────────────────────────────────────────

function calcPercentage(cost: number, rate: number): number {
  return cost * (rate / 100);
}

function calcStraightLineResidual(cost: number, age: number, life: number): number {
  if (life <= 0) return 0;
  const annualDep = cost / life;
  const accumulated = annualDep * Math.min(age, life);
  return Math.max(cost - accumulated, 0);
}

function calcMarket(comparable: number, conditionFactor: number): number {
  return comparable * conditionFactor;
}

function calcIRSTable(cost: number, age: number, irsClass: typeof IRS_ASSET_CLASSES[number]): number {
  const { recoveryYears, residualPct } = irsClass;
  if (age >= recoveryYears) return cost * (residualPct / 100);
  const depreciatedPortion = (age / recoveryYears) * (1 - residualPct / 100);
  return cost * (1 - depreciatedPortion);
}

function calcConditionAdjusted(cost: number, age: number, life: number, conditionFactor: number): number {
  const baseResidual = calcStraightLineResidual(cost, age, life);
  return baseResidual * conditionFactor;
}

function calcBenchmark(cost: number, age: number, industryData: { typicalSalvagePct: number; typicalLife: number }): number {
  const { typicalSalvagePct, typicalLife } = industryData;
  const floorValue = cost * (typicalSalvagePct / 100);
  if (age >= typicalLife) return floorValue;
  const depreciable = cost - floorValue;
  const annualDep = depreciable / typicalLife;
  return cost - (annualDep * age);
}

function calculateAllMethods(inputs: SalvageInputs): SalvageResult[] {
  const { originalCost, currentAge, usefulLife, percentageRate, marketComparable, irsClassIndex, conditionIndex, industryKey } = inputs;
  const conditionFactor = CONDITION_FACTORS[conditionIndex].factor;
  const irsClass = IRS_ASSET_CLASSES[irsClassIndex];
  const industry = INDUSTRY_BENCHMARKS[industryKey] || INDUSTRY_BENCHMARKS.manufacturing;

  const results: SalvageResult[] = [];

  // 1. Percentage of Cost
  const pctVal = calcPercentage(originalCost, percentageRate);
  results.push({
    method: "Percentage of Cost",
    estimatedSalvage: pctVal,
    percentOfCost: (pctVal / originalCost) * 100,
    remainingLife: Math.max(usefulLife - currentAge, 0),
    annualDepreciation: usefulLife > 0 ? (originalCost - pctVal) / usefulLife : 0,
    notes: `Fixed ${percentageRate}% of original cost retained as salvage value.`,
  });

  // 2. Straight-Line Residual
  const slVal = calcStraightLineResidual(originalCost, currentAge, usefulLife);
  results.push({
    method: "Straight-Line Residual",
    estimatedSalvage: slVal,
    percentOfCost: (slVal / originalCost) * 100,
    remainingLife: Math.max(usefulLife - currentAge, 0),
    annualDepreciation: usefulLife > 0 ? originalCost / usefulLife : 0,
    notes: `Current book value after ${currentAge} years of straight-line depreciation.`,
  });

  // 3. Market/Appraisal
  const mktVal = calcMarket(marketComparable, conditionFactor);
  results.push({
    method: "Market/Appraisal Comparison",
    estimatedSalvage: mktVal,
    percentOfCost: (mktVal / originalCost) * 100,
    remainingLife: Math.max(usefulLife - currentAge, 0),
    annualDepreciation: currentAge > 0 ? (originalCost - mktVal) / currentAge : 0,
    notes: `Based on comparable market value (${fmt(marketComparable)}) adjusted for ${CONDITION_FACTORS[conditionIndex].label.split(" — ")[0]} condition (×${conditionFactor}).`,
  });

  // 4. IRS Table-Based
  const irsVal = calcIRSTable(originalCost, currentAge, irsClass);
  results.push({
    method: "IRS Table-Based",
    estimatedSalvage: irsVal,
    percentOfCost: (irsVal / originalCost) * 100,
    remainingLife: Math.max(irsClass.recoveryYears - currentAge, 0),
    annualDepreciation: irsClass.recoveryYears > 0 ? (originalCost - originalCost * (irsClass.residualPct / 100)) / irsClass.recoveryYears : 0,
    notes: `${irsClass.label}: ${irsClass.recoveryYears}-year recovery, ${irsClass.residualPct}% floor residual.`,
  });

  // 5. Condition-Adjusted
  const condVal = calcConditionAdjusted(originalCost, currentAge, usefulLife, conditionFactor);
  results.push({
    method: "Condition-Adjusted",
    estimatedSalvage: condVal,
    percentOfCost: (condVal / originalCost) * 100,
    remainingLife: Math.max(usefulLife - currentAge, 0),
    annualDepreciation: usefulLife > 0 ? (originalCost - condVal) / usefulLife : 0,
    notes: `Straight-line residual adjusted by physical condition factor (${conditionFactor}).`,
  });

  // 6. Industry Benchmark
  const benchVal = calcBenchmark(originalCost, currentAge, industry);
  results.push({
    method: "Industry Benchmark",
    estimatedSalvage: benchVal,
    percentOfCost: (benchVal / originalCost) * 100,
    remainingLife: Math.max(industry.typicalLife - currentAge, 0),
    annualDepreciation: industry.typicalLife > 0 ? (originalCost - originalCost * (industry.typicalSalvagePct / 100)) / industry.typicalLife : 0,
    notes: `${industry.label}: typical ${industry.typicalSalvagePct}% salvage over ${industry.typicalLife}-year life. ${industry.notes}`,
  });

  return results;
}

function getRecommendedValue(results: SalvageResult[], inputs: SalvageInputs): { value: number; method: string; reasoning: string } {
  // Weight methods based on data quality
  let weights: number[] = [0.15, 0.20, 0.25, 0.15, 0.15, 0.10]; // pct, sl, market, irs, condition, benchmark

  // If market comparable is 0, reduce its weight
  if (inputs.marketComparable <= 0) {
    weights[2] = 0;
    weights[1] += 0.10;
    weights[4] += 0.10;
    weights[5] += 0.05;
  }

  // Adjust for maintenance
  let maintenanceAdj = 1.0;
  if (inputs.maintenanceHistory === "excellent") maintenanceAdj = 1.05;
  if (inputs.maintenanceHistory === "poor") maintenanceAdj = 0.90;

  // Adjust for technology obsolescence
  let techAdj = 1.0;
  if (inputs.technologyObsolescence === "moderate") techAdj = 0.90;
  if (inputs.technologyObsolescence === "high") techAdj = 0.75;

  // Adjust for utilization
  let utilAdj = 1.0;
  if (inputs.utilizationRate > 80) utilAdj = 0.92;
  if (inputs.utilizationRate < 40) utilAdj = 1.05;

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let weightedAvg = 0;
  for (let i = 0; i < results.length; i++) {
    weightedAvg += results[i].estimatedSalvage * (weights[i] / totalWeight);
  }

  const adjusted = weightedAvg * maintenanceAdj * techAdj * utilAdj;

  return {
    value: Math.max(adjusted, 0),
    method: "Weighted Composite",
    reasoning: `Weighted average of all methods, adjusted for maintenance (×${maintenanceAdj.toFixed(2)}), technology obsolescence (×${techAdj.toFixed(2)}), and utilization (×${utilAdj.toFixed(2)}).`,
  };
}

// ─── Formatting ─────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

const labelStyle: React.CSSProperties = { fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: C.text, marginBottom: "0.25rem", display: "block" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.5rem 0.75rem", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: "0.9rem", fontFamily: "'Source Sans 3', sans-serif", background: "white", color: C.text, outline: "none" };
const selectStyle: React.CSSProperties = { ...inputStyle, appearance: "auto" as const };
const sectionTitleStyle: React.CSSProperties = { fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: C.slate, marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: `2px solid ${C.gold}` };

// ─── Component ──────────────────────────────────────────────────────────────

export default function SalvageValueCalculator({ onBack }: { onBack: () => void }) {
  const [inputs, setInputs] = useState<SalvageInputs>({
    assetName: "",
    originalCost: 50000,
    currentAge: 3,
    usefulLife: 7,
    method: "percentage",
    percentageRate: 10,
    marketComparable: 20000,
    irsClassIndex: 0,
    conditionIndex: 1,
    industryKey: "manufacturing",
    maintenanceHistory: "average",
    utilizationRate: 60,
    technologyObsolescence: "none",
  });

  const [showReport, setShowReport] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const update = (key: keyof SalvageInputs, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const results = calculateAllMethods(inputs);
  const recommended = getRecommendedValue(results, inputs);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !reportRef.current) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Salvage Value Report - ${inputs.assetName || "Asset"}</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Source Sans 3', sans-serif; color: #1E293B; padding: 40px; }
            img { max-height: 50px; }
            table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
            th, td { padding: 0.4rem 0.5rem; text-align: left; border-bottom: 1px solid #E2E8F0; font-size: 0.8rem; }
            th { background: #F8FAFC; font-weight: 600; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>${reportRef.current.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 800);
  };

  // ─── Input Form ─────────────────────────────────────────────────────────────

  if (!showReport) {
    return (
      <div style={{ padding: "1.5rem", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: C.slate }}>←</button>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.slate }}>Item Salvage Value Calculator</h1>
            <p style={{ color: C.muted, fontSize: "0.85rem" }}>Multi-method salvage estimation with condition analysis</p>
          </div>
        </div>

        {/* Asset Information */}
        <div style={sectionTitleStyle}>Asset Information</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <label style={labelStyle}>Asset Name / Description</label>
            <input style={inputStyle} value={inputs.assetName} onChange={e => update("assetName", e.target.value)} placeholder="e.g., Forklift - Toyota 8FBE15" />
          </div>
          <div>
            <label style={labelStyle}>Original Acquisition Cost ($)</label>
            <input style={inputStyle} type="number" value={inputs.originalCost} onChange={e => update("originalCost", Number(e.target.value))} min={0} />
          </div>
          <div>
            <label style={labelStyle}>Current Age (Years)</label>
            <input style={inputStyle} type="number" value={inputs.currentAge} onChange={e => update("currentAge", Number(e.target.value))} min={0} />
          </div>
          <div>
            <label style={labelStyle}>Estimated Useful Life (Years)</label>
            <input style={inputStyle} type="number" value={inputs.usefulLife} onChange={e => update("usefulLife", Number(e.target.value))} min={1} max={50} />
          </div>
        </div>

        {/* Condition & Usage */}
        <div style={sectionTitleStyle}>Condition & Usage Factors</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <label style={labelStyle}>Physical Condition</label>
            <select style={selectStyle} value={inputs.conditionIndex} onChange={e => update("conditionIndex", Number(e.target.value))}>
              {CONDITION_FACTORS.map((c, i) => <option key={i} value={i}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Maintenance History</label>
            <select style={selectStyle} value={inputs.maintenanceHistory} onChange={e => update("maintenanceHistory", e.target.value)}>
              <option value="excellent">Excellent — All scheduled maintenance performed</option>
              <option value="average">Average — Most maintenance performed</option>
              <option value="poor">Poor — Deferred or missed maintenance</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Utilization Rate (%)</label>
            <input style={inputStyle} type="number" value={inputs.utilizationRate} onChange={e => update("utilizationRate", Number(e.target.value))} min={0} max={100} />
            <p style={{ fontSize: "0.7rem", color: C.muted, marginTop: "0.2rem" }}>How heavily the asset is used vs. capacity</p>
          </div>
          <div>
            <label style={labelStyle}>Technology Obsolescence Risk</label>
            <select style={selectStyle} value={inputs.technologyObsolescence} onChange={e => update("technologyObsolescence", e.target.value)}>
              <option value="none">None — Technology is stable</option>
              <option value="moderate">Moderate — Newer models available</option>
              <option value="high">High — Technology rapidly evolving</option>
            </select>
          </div>
        </div>

        {/* Method-Specific Inputs */}
        <div style={sectionTitleStyle}>Valuation Parameters</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <label style={labelStyle}>Salvage Percentage (% of Cost)</label>
            <input style={inputStyle} type="number" value={inputs.percentageRate} onChange={e => update("percentageRate", Number(e.target.value))} min={0} max={100} />
          </div>
          <div>
            <label style={labelStyle}>Market Comparable Value ($)</label>
            <input style={inputStyle} type="number" value={inputs.marketComparable} onChange={e => update("marketComparable", Number(e.target.value))} min={0} />
            <p style={{ fontSize: "0.7rem", color: C.muted, marginTop: "0.2rem" }}>Similar asset selling price in current market</p>
          </div>
          <div>
            <label style={labelStyle}>IRS Asset Class</label>
            <select style={selectStyle} value={inputs.irsClassIndex} onChange={e => update("irsClassIndex", Number(e.target.value))}>
              {IRS_ASSET_CLASSES.map((c, i) => <option key={i} value={i}>{c.label} ({c.recoveryYears}yr)</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Industry Sector</label>
            <select style={selectStyle} value={inputs.industryKey} onChange={e => update("industryKey", e.target.value)}>
              {Object.entries(INDUSTRY_BENCHMARKS).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
            </select>
          </div>
        </div>

        {/* Quick Preview */}
        <div style={{ background: C.cardBg, borderRadius: 8, padding: "1.5rem", border: `1px solid ${C.border}`, marginBottom: "2rem" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "1rem" }}>Recommended Salvage Value</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", color: C.muted }}>Estimated Salvage</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.2rem", fontWeight: 700, color: C.teal }}>{fmt(recommended.value)}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", color: C.muted }}>% of Original Cost</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.2rem", fontWeight: 700, color: C.gold }}>{fmtPct(inputs.originalCost > 0 ? (recommended.value / inputs.originalCost) * 100 : 0)}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", color: C.muted }}>Remaining Life</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.2rem", fontWeight: 700, color: C.slate }}>{Math.max(inputs.usefulLife - inputs.currentAge, 0)} yrs</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowReport(true)}
          style={{ width: "100%", padding: "0.85rem", background: C.gold, color: "white", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "1rem", cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif" }}
        >
          Generate Full Salvage Value Report
        </button>
      </div>
    );
  }

  // ─── Report Output ──────────────────────────────────────────────────────────

  return (
    <div style={{ padding: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button onClick={() => setShowReport(false)} style={{ padding: "0.6rem 1.2rem", background: "#E2E8F0", color: C.text, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
          ← Edit Inputs
        </button>
        <button onClick={handlePrint} style={{ padding: "0.6rem 1.2rem", background: C.gold, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
          🖨️ Print Report
        </button>
        <button onClick={onBack} style={{ padding: "0.6rem 1.2rem", background: C.slate, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem", marginLeft: "auto" }}>
          ← Back to Portal
        </button>
      </div>

      <div ref={reportRef} style={{ background: "white", padding: "2rem", borderRadius: 8, border: `1px solid ${C.border}` }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: `3px solid ${C.gold}` }}>
          <div>
            <img src={LOGO_BASE64} alt="LAI" style={{ height: 40, marginBottom: "0.5rem" }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.slate }}>Salvage Value Analysis Report</h2>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.8rem", color: C.muted }}>
            <p>Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Asset Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "1.5rem", padding: "1rem", background: C.cardBg, borderRadius: 6 }}>
          <div><span style={{ fontSize: "0.75rem", color: C.muted }}>Asset</span><p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{inputs.assetName || "—"}</p></div>
          <div><span style={{ fontSize: "0.75rem", color: C.muted }}>Original Cost</span><p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{fmt(inputs.originalCost)}</p></div>
          <div><span style={{ fontSize: "0.75rem", color: C.muted }}>Current Age</span><p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{inputs.currentAge} years</p></div>
          <div><span style={{ fontSize: "0.75rem", color: C.muted }}>Useful Life</span><p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{inputs.usefulLife} years</p></div>
          <div><span style={{ fontSize: "0.75rem", color: C.muted }}>Condition</span><p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{CONDITION_FACTORS[inputs.conditionIndex].label.split(" — ")[0]}</p></div>
          <div><span style={{ fontSize: "0.75rem", color: C.muted }}>Industry</span><p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{INDUSTRY_BENCHMARKS[inputs.industryKey]?.label || "—"}</p></div>
        </div>

        {/* Recommended Value */}
        <div style={{ textAlign: "center", padding: "1.5rem", background: `linear-gradient(135deg, ${C.slate}, ${C.charcoal})`, borderRadius: 8, marginBottom: "2rem" }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>Recommended Salvage Value (Weighted Composite)</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 700, color: C.gold }}>{fmt(recommended.value)}</p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", marginTop: "0.5rem" }}>{fmtPct(inputs.originalCost > 0 ? (recommended.value / inputs.originalCost) * 100 : 0)} of original cost</p>
        </div>

        {/* All Methods Comparison */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: C.slate, marginBottom: "0.75rem" }}>Multi-Method Comparison</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead>
            <tr style={{ background: C.cardBg }}>
              <th style={{ padding: "0.5rem", textAlign: "left", fontSize: "0.8rem", borderBottom: `2px solid ${C.border}` }}>Method</th>
              <th style={{ padding: "0.5rem", textAlign: "right", fontSize: "0.8rem", borderBottom: `2px solid ${C.border}` }}>Salvage Value</th>
              <th style={{ padding: "0.5rem", textAlign: "right", fontSize: "0.8rem", borderBottom: `2px solid ${C.border}` }}>% of Cost</th>
              <th style={{ padding: "0.5rem", textAlign: "right", fontSize: "0.8rem", borderBottom: `2px solid ${C.border}` }}>Annual Dep.</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={r.method} style={{ background: i % 2 === 0 ? "white" : C.cardBg }}>
                <td style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem", fontWeight: 600 }}>{r.method}</td>
                <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(r.estimatedSalvage)}</td>
                <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmtPct(r.percentOfCost)}</td>
                <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#EF4444" }}>({fmt(r.annualDepreciation)})</td>
              </tr>
            ))}
            <tr style={{ borderTop: `2px solid ${C.gold}`, fontWeight: 700 }}>
              <td style={{ padding: "0.6rem 0.5rem", fontSize: "0.9rem", color: C.teal }}>Recommended (Weighted)</td>
              <td style={{ padding: "0.6rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", color: C.teal }}>{fmt(recommended.value)}</td>
              <td style={{ padding: "0.6rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: C.teal }}>{fmtPct(inputs.originalCost > 0 ? (recommended.value / inputs.originalCost) * 100 : 0)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        {/* Method Notes */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem" }}>Method Details</h3>
        <div style={{ marginBottom: "1.5rem" }}>
          {results.map(r => (
            <div key={r.method} style={{ padding: "0.5rem 0.75rem", borderLeft: `3px solid ${C.gold}`, marginBottom: "0.5rem", background: C.cardBg, borderRadius: "0 4px 4px 0" }}>
              <p style={{ fontSize: "0.8rem", fontWeight: 600, color: C.slate }}>{r.method}</p>
              <p style={{ fontSize: "0.75rem", color: C.muted }}>{r.notes}</p>
            </div>
          ))}
        </div>

        {/* Adjustment Factors */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem" }}>Applied Adjustment Factors</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <div style={{ padding: "0.75rem", background: C.cardBg, borderRadius: 6, textAlign: "center" }}>
            <p style={{ fontSize: "0.7rem", color: C.muted }}>Condition</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", fontWeight: 700, color: C.slate }}>×{CONDITION_FACTORS[inputs.conditionIndex].factor}</p>
          </div>
          <div style={{ padding: "0.75rem", background: C.cardBg, borderRadius: 6, textAlign: "center" }}>
            <p style={{ fontSize: "0.7rem", color: C.muted }}>Maintenance</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", fontWeight: 700, color: C.slate }}>×{inputs.maintenanceHistory === "excellent" ? "1.05" : inputs.maintenanceHistory === "poor" ? "0.90" : "1.00"}</p>
          </div>
          <div style={{ padding: "0.75rem", background: C.cardBg, borderRadius: 6, textAlign: "center" }}>
            <p style={{ fontSize: "0.7rem", color: C.muted }}>Technology</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", fontWeight: 700, color: C.slate }}>×{inputs.technologyObsolescence === "high" ? "0.75" : inputs.technologyObsolescence === "moderate" ? "0.90" : "1.00"}</p>
          </div>
          <div style={{ padding: "0.75rem", background: C.cardBg, borderRadius: 6, textAlign: "center" }}>
            <p style={{ fontSize: "0.7rem", color: C.muted }}>Utilization</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", fontWeight: 700, color: C.slate }}>×{inputs.utilizationRate > 80 ? "0.92" : inputs.utilizationRate < 40 ? "1.05" : "1.00"}</p>
          </div>
        </div>

        {/* Recommendation Box */}
        <div style={{ padding: "1rem", background: C.cardBg, borderRadius: 6, borderLeft: `4px solid ${C.teal}`, marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.8rem", fontWeight: 600, color: C.slate, marginBottom: "0.25rem" }}>Methodology</p>
          <p style={{ fontSize: "0.8rem", color: C.muted }}>{recommended.reasoning}</p>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", paddingTop: "1.5rem", borderTop: `2px solid ${C.border}` }}>
          <p style={{ fontSize: "0.75rem", color: C.muted }}>Legacy Asset Intelligence | legacyassetintelligence.com</p>
          <p style={{ fontSize: "0.7rem", color: C.muted, marginTop: "0.25rem" }}>This analysis is for estimation purposes. Actual salvage values may vary based on market conditions.</p>
        </div>
      </div>
    </div>
  );
}
