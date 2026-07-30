/**
 * LAI Item Depreciation Calculator
 * Full-capacity depreciation calculator supporting:
 * - Straight-Line
 * - Double Declining Balance (DDB)
 * - 150% Declining Balance
 * - Sum-of-Years-Digits (SYD)
 * - Units of Production
 * - MACRS (3, 5, 7, 10, 15, 20 year)
 * - Section 179 immediate expensing
 * - Bonus Depreciation
 * Includes full year-by-year schedule, comparison mode, and printable report.
 */

import { useState, useRef } from "react";
import { LOGO_BASE64 } from "./logoBase64";

// ─── MACRS Tables ───────────────────────────────────────────────────────────

const MACRS_RATES: Record<number, number[]> = {
  3: [0.3333, 0.4445, 0.1481, 0.0741],
  5: [0.2000, 0.3200, 0.1920, 0.1152, 0.1152, 0.0576],
  7: [0.1429, 0.2449, 0.1749, 0.1249, 0.0893, 0.0892, 0.0893, 0.0446],
  10: [0.1000, 0.1800, 0.1440, 0.1152, 0.0922, 0.0737, 0.0655, 0.0655, 0.0656, 0.0655, 0.0328],
  15: [0.0500, 0.0950, 0.0855, 0.0770, 0.0693, 0.0623, 0.0590, 0.0590, 0.0591, 0.0590, 0.0591, 0.0590, 0.0591, 0.0590, 0.0591, 0.0295],
  20: [0.0375, 0.0722, 0.0668, 0.0618, 0.0571, 0.0528, 0.0489, 0.0452, 0.0447, 0.0447, 0.0446, 0.0446, 0.0446, 0.0446, 0.0446, 0.0446, 0.0446, 0.0446, 0.0446, 0.0446, 0.0223],
};

// ─── Types ──────────────────────────────────────────────────────────────────

type DepMethod = "straight_line" | "ddb" | "db150" | "syd" | "units" | "macrs" | "section179" | "bonus";

interface DepInputs {
  assetName: string;
  acquisitionCost: number;
  salvageValue: number;
  usefulLife: number;
  macrsClass: number;
  method: DepMethod;
  unitsTotal: number;
  unitsPerYear: number;
  section179Amount: number;
  bonusPercent: number;
  placedInServiceDate: string;
}

interface DepScheduleRow {
  year: number;
  beginningValue: number;
  depreciation: number;
  accumulatedDep: number;
  endingValue: number;
}

// ─── Calculation Functions ──────────────────────────────────────────────────

function calcStraightLine(cost: number, salvage: number, life: number): DepScheduleRow[] {
  const depreciable = cost - salvage;
  const annual = depreciable / life;
  const rows: DepScheduleRow[] = [];
  let accumulated = 0;

  for (let y = 1; y <= life; y++) {
    const bv = cost - accumulated;
    const dep = Math.min(annual, bv - salvage);
    accumulated += dep;
    rows.push({ year: y, beginningValue: bv, depreciation: dep, accumulatedDep: accumulated, endingValue: cost - accumulated });
  }
  return rows;
}

function calcDDB(cost: number, salvage: number, life: number): DepScheduleRow[] {
  const rate = 2 / life;
  const rows: DepScheduleRow[] = [];
  let bookValue = cost;
  let accumulated = 0;

  for (let y = 1; y <= life; y++) {
    const dep = Math.min(bookValue * rate, bookValue - salvage);
    accumulated += dep;
    rows.push({ year: y, beginningValue: bookValue, depreciation: dep, accumulatedDep: accumulated, endingValue: bookValue - dep });
    bookValue -= dep;
  }
  return rows;
}

function calcDB150(cost: number, salvage: number, life: number): DepScheduleRow[] {
  const rate = 1.5 / life;
  const rows: DepScheduleRow[] = [];
  let bookValue = cost;
  let accumulated = 0;

  for (let y = 1; y <= life; y++) {
    const dep = Math.min(bookValue * rate, bookValue - salvage);
    accumulated += dep;
    rows.push({ year: y, beginningValue: bookValue, depreciation: dep, accumulatedDep: accumulated, endingValue: bookValue - dep });
    bookValue -= dep;
  }
  return rows;
}

function calcSYD(cost: number, salvage: number, life: number): DepScheduleRow[] {
  const depreciable = cost - salvage;
  const sumYears = (life * (life + 1)) / 2;
  const rows: DepScheduleRow[] = [];
  let accumulated = 0;

  for (let y = 1; y <= life; y++) {
    const factor = (life - y + 1) / sumYears;
    const dep = depreciable * factor;
    accumulated += dep;
    rows.push({ year: y, beginningValue: cost - (accumulated - dep), depreciation: dep, accumulatedDep: accumulated, endingValue: cost - accumulated });
  }
  return rows;
}

function calcUnits(cost: number, salvage: number, totalUnits: number, unitsPerYear: number, life: number): DepScheduleRow[] {
  const depreciable = cost - salvage;
  const ratePerUnit = depreciable / totalUnits;
  const rows: DepScheduleRow[] = [];
  let accumulated = 0;

  for (let y = 1; y <= life; y++) {
    const dep = Math.min(ratePerUnit * unitsPerYear, cost - salvage - accumulated);
    accumulated += dep;
    rows.push({ year: y, beginningValue: cost - (accumulated - dep), depreciation: dep, accumulatedDep: accumulated, endingValue: cost - accumulated });
    if (accumulated >= depreciable) break;
  }
  return rows;
}

function calcMACRS(cost: number, macrsClass: number): DepScheduleRow[] {
  const rates = MACRS_RATES[macrsClass] || MACRS_RATES[7];
  const rows: DepScheduleRow[] = [];
  let accumulated = 0;

  for (let y = 0; y < rates.length; y++) {
    const dep = cost * rates[y];
    const bv = cost - accumulated;
    accumulated += dep;
    rows.push({ year: y + 1, beginningValue: bv, depreciation: dep, accumulatedDep: accumulated, endingValue: cost - accumulated });
  }
  return rows;
}

function calcSection179(cost: number, amount: number): DepScheduleRow[] {
  const dep = Math.min(amount, cost);
  return [{ year: 1, beginningValue: cost, depreciation: dep, accumulatedDep: dep, endingValue: cost - dep }];
}

function calcBonus(cost: number, salvage: number, life: number, bonusPct: number): DepScheduleRow[] {
  const bonusDep = cost * (bonusPct / 100);
  const remaining = cost - bonusDep - salvage;
  const annualAfter = remaining / (life - 1);
  const rows: DepScheduleRow[] = [];
  let accumulated = bonusDep;

  rows.push({ year: 1, beginningValue: cost, depreciation: bonusDep, accumulatedDep: accumulated, endingValue: cost - accumulated });

  for (let y = 2; y <= life; y++) {
    const bv = cost - accumulated;
    const dep = Math.min(annualAfter, bv - salvage);
    accumulated += dep;
    rows.push({ year: y, beginningValue: bv, depreciation: dep, accumulatedDep: accumulated, endingValue: cost - accumulated });
  }
  return rows;
}

function calculateSchedule(inputs: DepInputs): DepScheduleRow[] {
  const { acquisitionCost, salvageValue, usefulLife, method, unitsTotal, unitsPerYear, macrsClass, section179Amount, bonusPercent } = inputs;
  switch (method) {
    case "straight_line": return calcStraightLine(acquisitionCost, salvageValue, usefulLife);
    case "ddb": return calcDDB(acquisitionCost, salvageValue, usefulLife);
    case "db150": return calcDB150(acquisitionCost, salvageValue, usefulLife);
    case "syd": return calcSYD(acquisitionCost, salvageValue, usefulLife);
    case "units": return calcUnits(acquisitionCost, salvageValue, unitsTotal, unitsPerYear, usefulLife);
    case "macrs": return calcMACRS(acquisitionCost, macrsClass);
    case "section179": return calcSection179(acquisitionCost, section179Amount);
    case "bonus": return calcBonus(acquisitionCost, salvageValue, usefulLife, bonusPercent);
    default: return calcStraightLine(acquisitionCost, salvageValue, usefulLife);
  }
}

// ─── Formatting ─────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtNum(n: number): string {
  return n.toLocaleString("en-US");
}

// ─── Colors ─────────────────────────────────────────────────────────────────

const C = {
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

const METHOD_LABELS: Record<DepMethod, string> = {
  straight_line: "Straight-Line",
  ddb: "Double Declining Balance (200%)",
  db150: "150% Declining Balance",
  syd: "Sum-of-Years-Digits",
  units: "Units of Production",
  macrs: "MACRS (Modified Accelerated Cost Recovery)",
  section179: "Section 179 Immediate Expensing",
  bonus: "Bonus Depreciation",
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function DepreciationCalculator({ onBack }: { onBack: () => void }) {
  const [inputs, setInputs] = useState<DepInputs>({
    assetName: "",
    acquisitionCost: 50000,
    salvageValue: 5000,
    usefulLife: 7,
    macrsClass: 7,
    method: "straight_line",
    unitsTotal: 100000,
    unitsPerYear: 15000,
    section179Amount: 50000,
    bonusPercent: 80,
    placedInServiceDate: new Date().toISOString().split("T")[0],
  });

  const [showSchedule, setShowSchedule] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const update = (key: keyof DepInputs, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const schedule = calculateSchedule(inputs);
  const totalDep = schedule.reduce((sum, r) => sum + r.depreciation, 0);
  const avgAnnual = schedule.length > 0 ? totalDep / schedule.length : 0;
  const depRate = inputs.acquisitionCost > 0 ? (totalDep / inputs.acquisitionCost) * 100 : 0;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !reportRef.current) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Depreciation Schedule - ${inputs.assetName || "Asset"}</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Source Sans 3', sans-serif; color: #1E293B; padding: 40px; }
            img { max-height: 50px; }
            table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
            th, td { padding: 0.4rem 0.5rem; text-align: right; border-bottom: 1px solid #E2E8F0; font-size: 0.8rem; }
            th { background: #F8FAFC; font-weight: 600; text-align: right; }
            th:first-child, td:first-child { text-align: center; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>${reportRef.current.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 800);
  };

  if (!showSchedule) {
    return (
      <div style={{ padding: "1.5rem", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: C.slate }}>←</button>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.slate }}>Item Depreciation Calculator</h1>
            <p style={{ color: C.muted, fontSize: "0.85rem" }}>Full depreciation schedule with 8 methods</p>
          </div>
        </div>

        {/* Asset Info */}
        <div style={sectionTitleStyle}>Asset Information</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <label style={labelStyle}>Asset Name / Description</label>
            <input style={inputStyle} value={inputs.assetName} onChange={e => update("assetName", e.target.value)} placeholder="e.g., CNC Milling Machine" />
          </div>
          <div>
            <label style={labelStyle}>Placed in Service Date</label>
            <input style={inputStyle} type="date" value={inputs.placedInServiceDate} onChange={e => update("placedInServiceDate", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Acquisition Cost ($)</label>
            <input style={inputStyle} type="number" value={inputs.acquisitionCost} onChange={e => update("acquisitionCost", Number(e.target.value))} min={0} />
          </div>
          <div>
            <label style={labelStyle}>Salvage / Residual Value ($)</label>
            <input style={inputStyle} type="number" value={inputs.salvageValue} onChange={e => update("salvageValue", Number(e.target.value))} min={0} />
          </div>
          <div>
            <label style={labelStyle}>Useful Life (Years)</label>
            <input style={inputStyle} type="number" value={inputs.usefulLife} onChange={e => update("usefulLife", Number(e.target.value))} min={1} max={50} />
          </div>
          <div>
            <label style={labelStyle}>Depreciation Method</label>
            <select style={selectStyle} value={inputs.method} onChange={e => update("method", e.target.value)}>
              {Object.entries(METHOD_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Method-specific fields */}
        {inputs.method === "macrs" && (
          <div style={{ marginBottom: "2rem" }}>
            <div style={sectionTitleStyle}>MACRS Settings</div>
            <div style={{ maxWidth: 300 }}>
              <label style={labelStyle}>MACRS Property Class</label>
              <select style={selectStyle} value={inputs.macrsClass} onChange={e => update("macrsClass", Number(e.target.value))}>
                <option value={3}>3-Year Property</option>
                <option value={5}>5-Year Property</option>
                <option value={7}>7-Year Property (Most Equipment)</option>
                <option value={10}>10-Year Property</option>
                <option value={15}>15-Year Property</option>
                <option value={20}>20-Year Property</option>
              </select>
            </div>
          </div>
        )}

        {inputs.method === "units" && (
          <div style={{ marginBottom: "2rem" }}>
            <div style={sectionTitleStyle}>Units of Production</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Total Estimated Units (Lifetime)</label>
                <input style={inputStyle} type="number" value={inputs.unitsTotal} onChange={e => update("unitsTotal", Number(e.target.value))} min={1} />
              </div>
              <div>
                <label style={labelStyle}>Units Produced Per Year</label>
                <input style={inputStyle} type="number" value={inputs.unitsPerYear} onChange={e => update("unitsPerYear", Number(e.target.value))} min={1} />
              </div>
            </div>
          </div>
        )}

        {inputs.method === "section179" && (
          <div style={{ marginBottom: "2rem" }}>
            <div style={sectionTitleStyle}>Section 179 Settings</div>
            <div style={{ maxWidth: 300 }}>
              <label style={labelStyle}>Section 179 Deduction Amount ($)</label>
              <input style={inputStyle} type="number" value={inputs.section179Amount} onChange={e => update("section179Amount", Number(e.target.value))} min={0} />
              <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.25rem" }}>2024 limit: $1,220,000</p>
            </div>
          </div>
        )}

        {inputs.method === "bonus" && (
          <div style={{ marginBottom: "2rem" }}>
            <div style={sectionTitleStyle}>Bonus Depreciation</div>
            <div style={{ maxWidth: 300 }}>
              <label style={labelStyle}>Bonus Depreciation Percentage (%)</label>
              <input style={inputStyle} type="number" value={inputs.bonusPercent} onChange={e => update("bonusPercent", Number(e.target.value))} min={0} max={100} />
              <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.25rem" }}>2024: 60% | 2025: 40% | 2026: 20%</p>
            </div>
          </div>
        )}

        {/* Summary Preview */}
        <div style={{ background: C.cardBg, borderRadius: 8, padding: "1.5rem", border: `1px solid ${C.border}`, marginBottom: "2rem" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "1rem" }}>Quick Summary</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", color: C.muted }}>Total Depreciation</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", fontWeight: 700, color: C.slate }}>{fmt(totalDep)}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", color: C.muted }}>Avg Annual</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", fontWeight: 700, color: C.teal }}>{fmt(avgAnnual)}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", color: C.muted }}>Dep Rate</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", fontWeight: 700, color: C.gold }}>{depRate.toFixed(1)}%</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", color: C.muted }}>Schedule Years</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", fontWeight: 700, color: C.slate }}>{schedule.length}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowSchedule(true)}
          style={{ width: "100%", padding: "0.85rem", background: C.gold, color: "white", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "1rem", cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif" }}
        >
          Generate Full Depreciation Schedule
        </button>
      </div>
    );
  }

  // ─── Schedule Output ────────────────────────────────────────────────────────

  return (
    <div style={{ padding: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button onClick={() => setShowSchedule(false)} style={{ padding: "0.6rem 1.2rem", background: "#E2E8F0", color: C.text, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
          ← Edit Inputs
        </button>
        <button onClick={handlePrint} style={{ padding: "0.6rem 1.2rem", background: C.gold, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
          🖨️ Print Schedule
        </button>
        <button onClick={onBack} style={{ padding: "0.6rem 1.2rem", background: C.slate, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem", marginLeft: "auto" }}>
          ← Back to Portal
        </button>
      </div>

      <div ref={reportRef} style={{ background: "white", padding: "2rem", borderRadius: 8, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: `3px solid ${C.gold}` }}>
          <div>
            <img src={LOGO_BASE64} alt="LAI" style={{ height: 40, marginBottom: "0.5rem" }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.slate }}>Depreciation Schedule</h2>
            <p style={{ fontSize: "0.85rem", color: C.muted }}>{METHOD_LABELS[inputs.method]}</p>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.8rem", color: C.muted }}>
            <p>Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Asset Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "1.5rem", padding: "1rem", background: C.cardBg, borderRadius: 6 }}>
          <div><span style={{ fontSize: "0.75rem", color: C.muted }}>Asset</span><p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{inputs.assetName || "—"}</p></div>
          <div><span style={{ fontSize: "0.75rem", color: C.muted }}>Acquisition Cost</span><p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{fmt(inputs.acquisitionCost)}</p></div>
          <div><span style={{ fontSize: "0.75rem", color: C.muted }}>Salvage Value</span><p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{fmt(inputs.salvageValue)}</p></div>
          <div><span style={{ fontSize: "0.75rem", color: C.muted }}>Useful Life</span><p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{inputs.usefulLife} years</p></div>
          <div><span style={{ fontSize: "0.75rem", color: C.muted }}>Depreciable Base</span><p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{fmt(inputs.acquisitionCost - inputs.salvageValue)}</p></div>
          <div><span style={{ fontSize: "0.75rem", color: C.muted }}>Placed in Service</span><p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{inputs.placedInServiceDate}</p></div>
        </div>

        {/* Schedule Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead>
            <tr style={{ background: C.cardBg }}>
              <th style={{ padding: "0.5rem", textAlign: "center", fontSize: "0.8rem", borderBottom: `2px solid ${C.border}` }}>Year</th>
              <th style={{ padding: "0.5rem", textAlign: "right", fontSize: "0.8rem", borderBottom: `2px solid ${C.border}` }}>Beginning Value</th>
              <th style={{ padding: "0.5rem", textAlign: "right", fontSize: "0.8rem", borderBottom: `2px solid ${C.border}` }}>Depreciation</th>
              <th style={{ padding: "0.5rem", textAlign: "right", fontSize: "0.8rem", borderBottom: `2px solid ${C.border}` }}>Accumulated</th>
              <th style={{ padding: "0.5rem", textAlign: "right", fontSize: "0.8rem", borderBottom: `2px solid ${C.border}` }}>Ending Book Value</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, i) => (
              <tr key={row.year} style={{ background: i % 2 === 0 ? "white" : C.cardBg }}>
                <td style={{ padding: "0.4rem 0.5rem", textAlign: "center", fontSize: "0.85rem", fontWeight: 600 }}>{row.year}</td>
                <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(row.beginningValue)}</td>
                <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#EF4444" }}>({fmt(row.depreciation)})</td>
                <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>{fmt(row.accumulatedDep)}</td>
                <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", fontWeight: 600 }}>{fmt(row.endingValue)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: `2px solid ${C.gold}`, fontWeight: 700 }}>
              <td style={{ padding: "0.6rem 0.5rem", textAlign: "center", fontSize: "0.9rem" }}>Total</td>
              <td></td>
              <td style={{ padding: "0.6rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: "#EF4444" }}>({fmt(totalDep)})</td>
              <td></td>
              <td style={{ padding: "0.6rem 0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: C.slate }}>{fmt(schedule.length > 0 ? schedule[schedule.length - 1].endingValue : inputs.acquisitionCost)}</td>
            </tr>
          </tfoot>
        </table>

        {/* Method Explanation */}
        <div style={{ padding: "1rem", background: C.cardBg, borderRadius: 6, borderLeft: `4px solid ${C.gold}` }}>
          <p style={{ fontSize: "0.8rem", fontWeight: 600, color: C.slate, marginBottom: "0.25rem" }}>Method: {METHOD_LABELS[inputs.method]}</p>
          <p style={{ fontSize: "0.8rem", color: C.muted }}>
            {inputs.method === "straight_line" && "Equal annual depreciation over the useful life. Formula: (Cost - Salvage) ÷ Life."}
            {inputs.method === "ddb" && "Accelerated method applying 2× the straight-line rate to the declining book value each year."}
            {inputs.method === "db150" && "Accelerated method applying 1.5× the straight-line rate to the declining book value each year."}
            {inputs.method === "syd" && "Accelerated method using a fraction based on remaining years ÷ sum of all years."}
            {inputs.method === "units" && `Production-based depreciation. Rate: ${fmt((inputs.acquisitionCost - inputs.salvageValue) / inputs.unitsTotal)} per unit × ${fmtNum(inputs.unitsPerYear)} units/year.`}
            {inputs.method === "macrs" && `IRS Modified Accelerated Cost Recovery System using ${inputs.macrsClass}-year property class with half-year convention.`}
            {inputs.method === "section179" && "Immediate full expensing in the year placed in service (subject to annual limits)."}
            {inputs.method === "bonus" && `First-year bonus of ${inputs.bonusPercent}%, remainder straight-lined over remaining years.`}
          </p>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", paddingTop: "1.5rem", marginTop: "1.5rem", borderTop: `2px solid ${C.border}` }}>
          <p style={{ fontSize: "0.75rem", color: C.muted }}>Legacy Asset Intelligence | legacyassetintelligence.com</p>
        </div>
      </div>
    </div>
  );
}
