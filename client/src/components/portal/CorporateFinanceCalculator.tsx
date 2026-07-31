import { useState } from 'react';
import { ChevronLeft, Info } from 'lucide-react';

interface CorporateFinanceCalculatorProps {
  onBack: () => void;
}

// ─── Utility: True IRR via bisection ──────────────────────────────────────────
function calculateIRR(cashFlows: number[]): number | null {
  // Validate: must have at least one negative and one positive
  const hasNeg = cashFlows.some(cf => cf < 0);
  const hasPos = cashFlows.some(cf => cf > 0);
  if (!hasNeg || !hasPos) return null;

  // Check if Year 0 net is already positive (no sign change after combining)
  // In that case, all subsequent flows are positive too → no valid IRR
  let cumulative = 0;
  let signChanged = false;
  for (let i = 0; i < cashFlows.length; i++) {
    cumulative += cashFlows[i];
    if (i > 0 && cumulative > 0 && cashFlows[0] >= 0) {
      // Already positive from start
    }
    if (i === 0 && cashFlows[0] >= 0) {
      // Year 0 is non-negative, check if any subsequent flow is negative
      const hasSubsequentNeg = cashFlows.slice(1).some(cf => cf < 0);
      if (!hasSubsequentNeg) return null; // all positive, no IRR
    }
  }

  // NPV function
  const npv = (rate: number): number => {
    let result = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      result += cashFlows[t] / Math.pow(1 + rate, t);
    }
    return result;
  };

  // Bisection method
  let low = -0.99;
  let high = 100.0; // 10000%
  const maxIter = 1000;
  const tolerance = 1e-8;

  // Ensure brackets
  let npvLow = npv(low);
  let npvHigh = npv(high);

  // If both same sign, try expanding
  if (npvLow * npvHigh > 0) {
    high = 1000;
    npvHigh = npv(high);
    if (npvLow * npvHigh > 0) return null;
  }

  for (let i = 0; i < maxIter; i++) {
    const mid = (low + high) / 2;
    const npvMid = npv(mid);

    if (Math.abs(npvMid) < tolerance) return mid;

    if (npvMid * npvLow < 0) {
      high = mid;
      npvHigh = npvMid;
    } else {
      low = mid;
      npvLow = npvMid;
    }

    if (Math.abs(high - low) < tolerance) return (low + high) / 2;
  }

  return (low + high) / 2;
}

// ─── InputField ───────────────────────────────────────────────────────────────
const InputField = ({ label, value, onChange, placeholder = "0", isCurrency = false, isPercent = false, min, max, validationMsg, tooltip }: any) => {
  const [focused, setFocused] = useState(false);
  const numVal = parseFloat(value) || 0;
  const outOfRange = (min !== undefined && numVal < min) || (max !== undefined && numVal > max);

  const formatWithCommas = (val: string): string => {
    const num = parseFloat(val);
    if (isNaN(num) || val === "" || val === "0") return val;
    if (isCurrency) {
      return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    const parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  let displayVal = value;
  if (!focused && value && value !== "0" && value !== "") {
    if (isCurrency) {
      displayVal = "$" + formatWithCommas(value);
    } else if (isPercent) {
      displayVal = value + "%";
    } else {
      displayVal = formatWithCommas(value);
    }
  }

  const handleInputChange = (inputValue: string) => {
    // Strip currency symbols, commas, percent signs
    const cleaned = inputValue.replace(/[$,%]/g, "").replace(/,/g, "");
    if (cleaned === '' || /^\d*\.?\d*$/.test(cleaned)) {
      return cleaned;
    }
    return value;
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", fontWeight: 600, color: "#1E293B", marginBottom: "0.4rem" }}>
        {label}
        {tooltip && (
          <span title={tooltip} style={{ cursor: "help", display: "inline-flex" }}>
            <Info size={14} color="#64748B" />
          </span>
        )}
      </label>
      <input
        type="text"
        inputMode="decimal"
        value={focused ? value : displayVal}
        onFocus={(e) => {
          setFocused(true);
          const raw = e.target.value.replace(/[$,%]/g, "").replace(/,/g, "");
          if (raw === "0" || raw === "") onChange("");
          else onChange(raw);
        }}
        onBlur={(e) => {
          setFocused(false);
          if (e.target.value === "") onChange("0");
        }}
        onChange={(e) => onChange(handleInputChange(e.target.value))}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "0.6rem",
          border: `1px solid ${outOfRange ? "#EF4444" : "#CBD5E1"}`,
          borderRadius: "6px",
          fontSize: "0.95rem",
          fontFamily: "'Source Sans 3', sans-serif",
          boxSizing: "border-box" as const,
          backgroundColor: "#FFFFFF",
          color: "#1E293B",
          ...(outOfRange ? { boxShadow: "0 0 0 1px #EF4444" } : {}),
        }}
      />
      {outOfRange && validationMsg && (
        <span style={{ display: "block", fontSize: "0.75rem", color: "#EF4444", marginTop: "0.25rem", fontWeight: 500 }}>
          {validationMsg}
        </span>
      )}
    </div>
  );
};

// ─── OutputField ──────────────────────────────────────────────────────────────
const OutputField = ({ label, value, tooltip }: { label: string; value: string; tooltip?: string }) => (
  <div style={{ marginBottom: "1rem", padding: "1rem", background: "#F1F5F9", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
    <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 600, color: "#64748B", marginBottom: "0.4rem" }}>
      {label}
      {tooltip && (
        <span title={tooltip} style={{ cursor: "help", display: "inline-flex" }}>
          <Info size={12} color="#94A3B8" />
        </span>
      )}
    </label>
    <p style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E3A5F", margin: 0 }}>
      {value}
    </p>
  </div>
);

// ─── Format Helpers ───────────────────────────────────────────────────────────
function fmtCurrency(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtPercent(n: number): string {
  return n.toFixed(2) + "%";
}

function fmtMultiple(n: number): string {
  return n.toFixed(2) + "x";
}

function fmtMonths(n: number): string {
  if (Number.isInteger(n)) return `${n} months`;
  return `${Math.round(n)} months`;
}

// ─── Main Component ───────────────────────────────────────────────────────────
const CorporateFinanceCalculator: React.FC<CorporateFinanceCalculatorProps> = ({ onBack }) => {
  const [ghostAssets, setGhostAssets] = useState<string>('');
  const [nbvGhostAssets, setNbvGhostAssets] = useState<string>('');
  const [unrecordedAssets, setUnrecordedAssets] = useState<string>('');
  const [replacementValueUnrecorded, setReplacementValueUnrecorded] = useState<string>('');
  const [propertyTaxSavings, setPropertyTaxSavings] = useState<string>('');
  const [insurancePremiumSavings, setInsurancePremiumSavings] = useState<string>('');
  const [maintenanceCostReductions, setMaintenanceCostReductions] = useState<string>('');
  const [engagementFee, setEngagementFee] = useState<string>('');
  const [discountRate, setDiscountRate] = useState<string>('10');
  const [projectionYears, setProjectionYears] = useState<string>('5');
  const [realizationTiming, setRealizationTiming] = useState<string>('1'); // "0", "1", "2", "3"

  const calculateFinancials = () => {
    const numGhostAssets = parseFloat(ghostAssets) || 0;
    const nbvGhost = parseFloat(nbvGhostAssets) || 0;
    const numUnrecorded = parseFloat(unrecordedAssets) || 0;
    const replacementUnrecorded = parseFloat(replacementValueUnrecorded) || 0;
    const propTax = parseFloat(propertyTaxSavings) || 0;
    const insurance = parseFloat(insurancePremiumSavings) || 0;
    const maintenance = parseFloat(maintenanceCostReductions) || 0;
    const fee = parseFloat(engagementFee) || 0;
    const discount = (parseFloat(discountRate) || 10) / 100;
    const years = Math.max(1, Math.round(parseFloat(projectionYears) || 5));
    const realizationYear = parseInt(realizationTiming) || 0;

    // Core values
    const ghostNBVExposure = nbvGhost;
    const unrecordedReplacementValue = replacementUnrecorded;
    const totalIdentifiedCapitalValue = ghostNBVExposure + unrecordedReplacementValue;
    const totalAnnualSavings = propTax + insurance + maintenance;

    // Projection-Period Recurring Savings
    const projectionPeriodSavings = totalAnnualSavings * years;

    // Total Gross Financial Benefit
    const totalGrossBenefit = totalIdentifiedCapitalValue + projectionPeriodSavings;

    // Net Financial Benefit
    const netBenefit = totalGrossBenefit - fee;

    // ROI
    const roi = fee > 0 ? (netBenefit / fee) * 100 : null;

    // Gross Benefit-Cost Ratio
    const grossBCR = fee > 0 ? totalGrossBenefit / fee : null;

    // Net Return Multiple
    const netReturnMultiple = fee > 0 ? netBenefit / fee : null;

    // Payback from Recurring Savings Only
    let paybackMonths: number | null = null;
    if (totalAnnualSavings > 0) {
      paybackMonths = (fee / totalAnnualSavings) * 12;
    }

    // Build cash-flow array for NPV and IRR
    const cashFlows: number[] = new Array(years + 1).fill(0);
    // Year 0: negative engagement fee
    cashFlows[0] = -fee;
    // Add one-time capital value at realization year
    if (realizationYear <= years) {
      cashFlows[realizationYear] += totalIdentifiedCapitalValue;
    }
    // Add annual savings to each year 1 through projection years
    for (let t = 1; t <= years; t++) {
      cashFlows[t] += totalAnnualSavings;
    }

    // NPV
    let npv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + discount, t);
    }

    // True IRR
    const irrResult = calculateIRR(cashFlows);

    // Per-asset metrics
    const totalAffectedAssets = numGhostAssets + numUnrecorded;
    const avgNBVPerGhost = numGhostAssets > 0 ? ghostNBVExposure / numGhostAssets : null;
    const avgReplacementPerUnrecorded = numUnrecorded > 0 ? unrecordedReplacementValue / numUnrecorded : null;
    const capitalPerAffectedAsset = totalAffectedAssets > 0 ? totalIdentifiedCapitalValue / totalAffectedAssets : null;

    return {
      ghostNBVExposure,
      unrecordedReplacementValue,
      totalIdentifiedCapitalValue,
      totalAnnualSavings,
      projectionPeriodSavings,
      totalGrossBenefit,
      netBenefit,
      roi,
      grossBCR,
      netReturnMultiple,
      paybackMonths,
      npv,
      irr: irrResult,
      totalAffectedAssets,
      avgNBVPerGhost,
      avgReplacementPerUnrecorded,
      capitalPerAffectedAsset,
      years,
      fee,
      discount,
      realizationYear,
    };
  };

  const f = calculateFinancials();
  const yearsNum = Math.max(1, Math.round(parseFloat(projectionYears) || 5));

  // Realization timing options (cannot exceed projection years)
  const realizationOptions = [
    { value: "0", label: "Immediate — Year 0" },
    { value: "1", label: "End of Year 1" },
    { value: "2", label: "End of Year 2" },
    { value: "3", label: "End of Year 3" },
  ].filter(opt => parseInt(opt.value) <= yearsNum);

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", color: "#1E293B", padding: "2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header with Back Button */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem", gap: "1rem" }}>
          <button
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1rem",
              background: "#1E3A5F",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            <ChevronLeft size={18} />
            Back to Portal
          </button>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#1E3A5F", margin: 0 }}>
            Corporate Finance Calculator
          </h1>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
          {/* Input Section */}
          <div style={{ background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#1E3A5F", marginBottom: "1.5rem" }}>
              Input Parameters
            </h2>

            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0D9488", marginBottom: "1rem" }}>Ghost Assets</h3>
              <InputField label="Number of Ghost Assets" value={ghostAssets} onChange={setGhostAssets} min={0} />
              <InputField label="NBV of Ghost Assets ($)" value={nbvGhostAssets} onChange={setNbvGhostAssets} isCurrency tooltip="Total net book value of all ghost assets identified. Do not multiply by asset count — enter the total dollar value." />
            </div>

            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0D9488", marginBottom: "1rem" }}>Unrecorded Assets</h3>
              <InputField label="Number of Unrecorded Assets" value={unrecordedAssets} onChange={setUnrecordedAssets} min={0} />
              <InputField label="Replacement Value of Unrecorded Assets ($)" value={replacementValueUnrecorded} onChange={setReplacementValueUnrecorded} isCurrency tooltip="Total replacement value of all unrecorded assets. Do not multiply by asset count — enter the total dollar value." />
            </div>

            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0D9488", marginBottom: "1rem" }}>Annual Recurring Savings</h3>
              <InputField label="Property Tax Savings ($)" value={propertyTaxSavings} onChange={setPropertyTaxSavings} isCurrency />
              <InputField label="Insurance Premium Savings ($)" value={insurancePremiumSavings} onChange={setInsurancePremiumSavings} isCurrency />
              <InputField label="Maintenance Cost Reductions ($)" value={maintenanceCostReductions} onChange={setMaintenanceCostReductions} isCurrency />
            </div>

            <div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0D9488", marginBottom: "1rem" }}>Financial Assumptions</h3>
              <InputField label="Total Engagement Fee ($)" value={engagementFee} onChange={setEngagementFee} isCurrency />
              <InputField label="Discount Rate (%)" value={discountRate} onChange={setDiscountRate} isPercent min={0} max={100} validationMsg="Must be 0-100%" />
              <InputField label="Projection Years" value={projectionYears} onChange={setProjectionYears} min={1} max={30} validationMsg="Must be 1-30 years" />

              {/* Realization Timing Dropdown */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", fontWeight: 600, color: "#1E293B", marginBottom: "0.4rem" }}>
                  One-Time Capital Value Realization
                  <span title="Determines when the identified one-time capital value is realized in the cash-flow projection for NPV and IRR calculations." style={{ cursor: "help", display: "inline-flex" }}>
                    <Info size={14} color="#64748B" />
                  </span>
                </label>
                <select
                  value={realizationTiming}
                  onChange={(e) => setRealizationTiming(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    border: "1px solid #CBD5E1",
                    borderRadius: "6px",
                    fontSize: "0.95rem",
                    fontFamily: "'Source Sans 3', sans-serif",
                    backgroundColor: "#FFFFFF",
                    color: "#1E293B",
                  }}
                >
                  {realizationOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div style={{ background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#1E3A5F", marginBottom: "1.5rem" }}>
              Financial Summary
            </h2>

            {/* One-Time Capital Value */}
            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0D9488", marginBottom: "0.75rem" }}>
                Identified Capital Value
                <span title="Identified capital value includes accounting exposure, assets discovered, and avoided replacement value. It does not necessarily represent cash recovered." style={{ cursor: "help", display: "inline-flex", marginLeft: "0.4rem" }}>
                  <Info size={14} color="#64748B" />
                </span>
              </h3>
              <OutputField label="Ghost-Asset NBV Exposure" value={fmtCurrency(f.ghostNBVExposure)} />
              <OutputField label="Unrecorded Asset Replacement Value" value={fmtCurrency(f.unrecordedReplacementValue)} />
              <OutputField label="Total Identified One-Time Capital Value" value={fmtCurrency(f.totalIdentifiedCapitalValue)} tooltip="Identified capital value includes accounting exposure, assets discovered, and avoided replacement value. It does not necessarily represent cash recovered." />
            </div>

            {/* Recurring Savings */}
            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0D9488", marginBottom: "0.75rem" }}>Recurring Savings</h3>
              <OutputField label="Total Annual Savings" value={fmtCurrency(f.totalAnnualSavings)} />
              <OutputField label={`${yearsNum === 1 ? "One" : yearsNum === 2 ? "Two" : yearsNum === 3 ? "Three" : yearsNum === 4 ? "Four" : yearsNum === 5 ? "Five" : yearsNum === 6 ? "Six" : yearsNum === 7 ? "Seven" : yearsNum === 8 ? "Eight" : yearsNum === 9 ? "Nine" : yearsNum === 10 ? "Ten" : String(yearsNum)}-Year Recurring Savings`} value={fmtCurrency(f.projectionPeriodSavings)} />
            </div>

            {/* Executive Financial Metrics */}
            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0D9488", marginBottom: "0.75rem" }}>Executive Financial Metrics</h3>
              <OutputField label="Total Gross Financial Benefit" value={fmtCurrency(f.totalGrossBenefit)} />
              <OutputField label="Net Financial Benefit" value={fmtCurrency(f.netBenefit)} />
              <OutputField label="ROI" value={f.roi !== null ? fmtPercent(f.roi) : "N/A"} />
              <OutputField label="Gross Benefit-Cost Ratio" value={f.grossBCR !== null ? fmtMultiple(f.grossBCR) : "N/A"} />
              <OutputField label="Net Return Multiple" value={f.netReturnMultiple !== null ? fmtMultiple(f.netReturnMultiple) : "N/A"} />
            </div>

            {/* Time-Value Metrics */}
            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0D9488", marginBottom: "0.75rem" }}>Time-Value Metrics</h3>
              <OutputField
                label="Payback from Recurring Savings Only"
                value={f.paybackMonths !== null ? fmtMonths(f.paybackMonths) : "N/A"}
                tooltip="This measure shows how long annual recurring savings alone would take to recover the engagement fee. Identified one-time capital value is excluded."
              />
              <OutputField label="Net Present Value (NPV)" value={fmtCurrency(f.npv)} />
              <OutputField
                label="Internal Rate of Return (IRR)"
                value={f.irr !== null ? fmtPercent(f.irr * 100) : "Not Meaningful"}
                tooltip="IRR is the discount rate at which the net present value of the projected cash flows equals zero."
              />
            </div>

            {/* Per-Asset Metrics */}
            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0D9488", marginBottom: "0.75rem" }}>Per-Asset Supporting Metrics</h3>
              <OutputField label="Total Affected Assets" value={f.totalAffectedAssets > 0 ? f.totalAffectedAssets.toLocaleString() : "0"} />
              <OutputField label="Average NBV per Ghost Asset" value={f.avgNBVPerGhost !== null ? fmtCurrency(f.avgNBVPerGhost) : "N/A"} />
              <OutputField label="Average Replacement Value per Unrecorded Asset" value={f.avgReplacementPerUnrecorded !== null ? fmtCurrency(f.avgReplacementPerUnrecorded) : "N/A"} />
              <OutputField label="Identified Capital Value per Affected Asset" value={f.capitalPerAffectedAsset !== null ? fmtCurrency(f.capitalPerAffectedAsset) : "N/A"} />
            </div>

            {/* Proposal Copy Section */}
            <div style={{ padding: "1.25rem", background: "#F1F5F9", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1E3A5F", margin: 0 }}>
                  📋 Professional Summary for Proposal
                </p>
                <button
                  onClick={() => {
                    const text = buildProposalCopy(f, yearsNum);
                    navigator.clipboard.writeText(text);
                  }}
                  style={{ padding: "0.4rem 0.8rem", background: "#1E3A5F", color: "white", border: "none", borderRadius: 4, fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                >
                  Copy to Clipboard
                </button>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#475569", lineHeight: 1.8, fontFamily: "'Source Sans 3', sans-serif" }}>
                <div><strong>Ghost-Asset NBV Exposure:</strong> {fmtCurrency(f.ghostNBVExposure)}</div>
                <div><strong>Unrecorded Asset Replacement Value:</strong> {fmtCurrency(f.unrecordedReplacementValue)}</div>
                <div><strong>Total Identified One-Time Capital Value:</strong> {fmtCurrency(f.totalIdentifiedCapitalValue)}</div>
                <div><strong>Annual Recurring Savings:</strong> {fmtCurrency(f.totalAnnualSavings)}</div>
                <div><strong>{yearsNum}-Year Recurring Savings:</strong> {fmtCurrency(f.projectionPeriodSavings)}</div>
                <div><strong>Total Gross Financial Benefit:</strong> {fmtCurrency(f.totalGrossBenefit)}</div>
                <div><strong>Engagement Fee:</strong> {fmtCurrency(f.fee)}</div>
                <div><strong>Net Financial Benefit:</strong> {fmtCurrency(f.netBenefit)}</div>
                <div><strong>ROI:</strong> {f.roi !== null ? fmtPercent(f.roi) : "N/A"}</div>
                <div><strong>Gross Benefit-Cost Ratio:</strong> {f.grossBCR !== null ? fmtMultiple(f.grossBCR) : "N/A"}</div>
                <div><strong>Net Return Multiple:</strong> {f.netReturnMultiple !== null ? fmtMultiple(f.netReturnMultiple) : "N/A"}</div>
                <div><strong>Payback from Recurring Savings Only:</strong> {f.paybackMonths !== null ? fmtMonths(f.paybackMonths) : "N/A"}</div>
                <div><strong>Net Present Value (NPV):</strong> {fmtCurrency(f.npv)}</div>
                <div><strong>Internal Rate of Return (IRR):</strong> {f.irr !== null ? fmtPercent(f.irr * 100) : "Not Meaningful"}</div>
                <div><strong>Discount Rate:</strong> {fmtPercent(f.discount * 100)}</div>
                <div><strong>Projection Period:</strong> {yearsNum} years</div>
                <div><strong>One-Time Value Realization Timing:</strong> {realizationOptions.find(o => o.value === realizationTiming)?.label || "End of Year 1"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div style={{ background: "#EFF6FF", padding: "1.5rem", borderRadius: "12px", border: "1px solid #BFDBFE", marginTop: "2rem" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#1E3A5F", marginBottom: "0.75rem" }}>
            💡 How to Use This Calculator
          </h3>
          <p style={{ fontSize: "0.9rem", color: "#1E3A5F", lineHeight: 1.6, margin: 0 }}>
            Enter the client's financial data in the <strong>Input Parameters</strong> section on the left. The calculator will automatically compute key financial metrics on the right. Dollar inputs represent <strong>total values</strong> — do not multiply by asset counts. Asset counts are used only for per-asset supporting metrics. NPV and IRR use the same discounted cash-flow schedule based on the selected realization timing. Use the Professional Summary section to copy formatted results directly into your Executive Investment Proposal.
          </p>
        </div>
      </div>
    </div>
  );
};

function buildProposalCopy(f: any, years: number): string {
  const lines = [
    `Ghost-Asset NBV Exposure: ${fmtCurrency(f.ghostNBVExposure)}`,
    `Unrecorded Asset Replacement Value: ${fmtCurrency(f.unrecordedReplacementValue)}`,
    `Total Identified One-Time Capital Value: ${fmtCurrency(f.totalIdentifiedCapitalValue)}`,
    `Annual Recurring Savings: ${fmtCurrency(f.totalAnnualSavings)}`,
    `${years}-Year Recurring Savings: ${fmtCurrency(f.projectionPeriodSavings)}`,
    `Total Gross Financial Benefit: ${fmtCurrency(f.totalGrossBenefit)}`,
    `Engagement Fee: ${fmtCurrency(f.fee)}`,
    `Net Financial Benefit: ${fmtCurrency(f.netBenefit)}`,
    `ROI: ${f.roi !== null ? fmtPercent(f.roi) : "N/A"}`,
    `Gross Benefit-Cost Ratio: ${f.grossBCR !== null ? fmtMultiple(f.grossBCR) : "N/A"}`,
    `Net Return Multiple: ${f.netReturnMultiple !== null ? fmtMultiple(f.netReturnMultiple) : "N/A"}`,
    `Payback from Recurring Savings Only: ${f.paybackMonths !== null ? fmtMonths(f.paybackMonths) : "N/A"}`,
    `Net Present Value (NPV): ${fmtCurrency(f.npv)}`,
    `Internal Rate of Return (IRR): ${f.irr !== null ? fmtPercent(f.irr * 100) : "Not Meaningful"}`,
    `Discount Rate: ${fmtPercent(f.discount * 100)}`,
    `Projection Period: ${years} years`,
  ];
  return lines.join("\n");
}

export default CorporateFinanceCalculator;
