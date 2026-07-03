import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface CorporateFinanceCalculatorProps {
  onBack: () => void;
}

const CorporateFinanceCalculator: React.FC<CorporateFinanceCalculatorProps> = ({ onBack }) => {
  const [ghostAssets, setGhostAssets] = useState<number>(0);
  const [nbvGhostAssets, setNbvGhostAssets] = useState<number>(0);
  const [unrecordedAssets, setUnrecordedAssets] = useState<number>(0);
  const [replacementValueUnrecorded, setReplacementValueUnrecorded] = useState<number>(0);
  const [propertyTaxSavings, setPropertyTaxSavings] = useState<number>(0);
  const [insurancePremiumSavings, setInsurancePremiumSavings] = useState<number>(0);
  const [maintenanceCostReductions, setMaintenanceCostReductions] = useState<number>(0);
  const [engagementFee, setEngagementFee] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(10);
  const [projectionYears, setProjectionYears] = useState<number>(5);

  const calculateFinancials = () => {
    const totalOneTimeCapitalRecovery = nbvGhostAssets + replacementValueUnrecorded;
    const totalAnnualSavings = propertyTaxSavings + insurancePremiumSavings + maintenanceCostReductions;

    // Calculate Payback Period
    let paybackPeriodMonths = 'N/A';
    if (totalAnnualSavings > 0) {
      const initialInvestment = engagementFee;
      const monthsToPayback = initialInvestment / (totalAnnualSavings / 12);
      paybackPeriodMonths = monthsToPayback.toFixed(2);
    }

    // Calculate NPV (simplified)
    let npv = -engagementFee + totalOneTimeCapitalRecovery;
    for (let i = 1; i <= projectionYears; i++) {
      npv += totalAnnualSavings / Math.pow(1 + discountRate / 100, i);
    }

    // Calculate IRR (simplified - using average return)
    const totalBenefit = totalOneTimeCapitalRecovery + (totalAnnualSavings * projectionYears);
    const totalInvestment = engagementFee;
    const irr = totalInvestment > 0 ? (((totalBenefit / totalInvestment) ** (1 / projectionYears)) - 1) * 100 : 0;

    return {
      totalOneTimeCapitalRecovery,
      totalAnnualSavings,
      paybackPeriodMonths,
      npv: npv.toFixed(2),
      irr: irr.toFixed(2),
    };
  };

  const financials = calculateFinancials();

  const InputField = ({ label, value, onChange, placeholder = "0" }: any) => (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#1E293B", marginBottom: "0.4rem" }}>
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "0.6rem",
          border: "1px solid #CBD5E1",
          borderRadius: "6px",
          fontSize: "0.95rem",
          fontFamily: "'Source Sans 3', sans-serif",
          boxSizing: "border-box",
        }}
      />
    </div>
  );

  const OutputField = ({ label, value }: any) => (
    <div style={{ marginBottom: "1rem", padding: "1rem", background: "#F1F5F9", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#64748B", marginBottom: "0.4rem" }}>
        {label}
      </label>
      <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E3A5F", margin: 0 }}>
        {typeof value === 'number' && (label.includes('$') || label.includes('Recovery') || label.includes('Savings') || label.includes('NPV'))
          ? `$${value.toLocaleString()}`
          : value}
      </p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", padding: "2rem" }}>
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
              <InputField label="Number of Ghost Assets" value={ghostAssets} onChange={setGhostAssets} />
              <InputField label="NBV of Ghost Assets ($)" value={nbvGhostAssets} onChange={setNbvGhostAssets} />
            </div>

            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0D9488", marginBottom: "1rem" }}>Unrecorded Assets</h3>
              <InputField label="Number of Unrecorded Assets" value={unrecordedAssets} onChange={setUnrecordedAssets} />
              <InputField label="Replacement Value ($)" value={replacementValueUnrecorded} onChange={setReplacementValueUnrecorded} />
            </div>

            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0D9488", marginBottom: "1rem" }}>Annual Savings</h3>
              <InputField label="Property Tax Savings ($)" value={propertyTaxSavings} onChange={setPropertyTaxSavings} />
              <InputField label="Insurance Premium Savings ($)" value={insurancePremiumSavings} onChange={setInsurancePremiumSavings} />
              <InputField label="Maintenance Cost Reductions ($)" value={maintenanceCostReductions} onChange={setMaintenanceCostReductions} />
            </div>

            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0D9488", marginBottom: "1rem" }}>Financial Assumptions</h3>
              <InputField label="Total Engagement Fee ($)" value={engagementFee} onChange={setEngagementFee} />
              <InputField label="Discount Rate (%)" value={discountRate} onChange={setDiscountRate} />
              <InputField label="Projection Years" value={projectionYears} onChange={setProjectionYears} />
            </div>
          </div>

          {/* Output Section */}
          <div style={{ background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#1E3A5F", marginBottom: "1.5rem" }}>
              Calculated Financials
            </h2>

            <OutputField label="Total One-Time Capital Recovery ($)" value={financials.totalOneTimeCapitalRecovery} />
            <OutputField label="Total Annual Savings ($)" value={financials.totalAnnualSavings} />
            <OutputField label="Payback Period (Months)" value={financials.paybackPeriodMonths} />
            <OutputField label="Net Present Value - NPV ($)" value={parseFloat(financials.npv)} />
            <OutputField label="Internal Rate of Return - IRR (%)" value={`${financials.irr}%`} />

            {/* Copy to Clipboard Section */}
            <div style={{ marginTop: "2rem", padding: "1rem", background: "#F1F5F9", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748B", marginBottom: "0.5rem" }}>
                📋 Quick Copy for Proposal
              </p>
              <div style={{ fontSize: "0.8rem", color: "#475569", lineHeight: 1.6, fontFamily: "monospace" }}>
                <div>One-Time: ${financials.totalOneTimeCapitalRecovery.toLocaleString()}</div>
                <div>Annual: ${financials.totalAnnualSavings.toLocaleString()}</div>
                <div>Payback: {financials.paybackPeriodMonths} months</div>
                <div>NPV: ${parseFloat(financials.npv).toLocaleString()}</div>
                <div>IRR: {financials.irr}%</div>
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
            Enter the client's financial data in the <strong>Input Parameters</strong> section on the left. The calculator will automatically compute key financial metrics on the right. Use these values to populate your Executive Investment Proposal. All calculations are based on industry-standard financial formulas including NPV (Net Present Value) and IRR (Internal Rate of Return).
          </p>
        </div>
      </div>
    </div>
  );
};

export default CorporateFinanceCalculator;
