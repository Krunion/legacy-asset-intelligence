import { useState } from "react";
import NumericInput from "@/components/portal/NumericInput";

const inputClassName = "mt-1 block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-amber-500 focus:border-amber-500";

const Calculator: React.FC = () => {
  const [ghostAssets, setGhostAssets] = useState<number>(0);
  const [nbvGhostAssets, setNbvGhostAssets] = useState<number>(0);
  const [unrecordedAssets, setUnrecordedAssets] = useState<number>(0);
  const [replacementValueUnrecorded, setReplacementValueUnrecorded] = useState<number>(0);
  const [propertyTaxSavings, setPropertyTaxSavings] = useState<number>(0);
  const [insurancePremiumSavings, setInsurancePremiumSavings] = useState<number>(0);
  const [maintenanceCostReductions, setMaintenanceCostReductions] = useState<number>(0);
  const [engagementFee, setEngagementFee] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(0);
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

    // Calculate NPV
    let npv = -engagementFee;
    for (let i = 1; i <= projectionYears; i++) {
      npv += totalAnnualSavings / Math.pow(1 + discountRate / 100, i);
    }

    // IRR placeholder
    const irr = 'N/A'; 

    return {
      totalOneTimeCapitalRecovery,
      totalAnnualSavings,
      paybackPeriodMonths,
      npv: npv.toFixed(2),
      irr,
    };
  };

  const financials = calculateFinancials();

  const inputStyle: React.CSSProperties = {
    marginTop: "0.25rem",
    display: "block",
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #4B5563",
    borderRadius: "0.375rem",
    backgroundColor: "#374151",
    color: "#F3F4F6",
    fontSize: "0.95rem",
  };

  return (
    <div className="container mx-auto p-8 bg-gray-900 text-gray-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-10 text-amber-400">Corporate Finance Calculator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-teal-400">Input Parameters</h2>

          <div className="mb-4">
            <label htmlFor="ghostAssets" className="block text-sm font-medium text-gray-300">Number of Ghost Assets:</label>
            <NumericInput style={inputStyle} value={ghostAssets} onChange={v => setGhostAssets(Number(v))} />
          </div>

          <div className="mb-4">
            <label htmlFor="nbvGhostAssets" className="block text-sm font-medium text-gray-300">NBV of Ghost Assets ($):</label>
            <NumericInput style={inputStyle} value={nbvGhostAssets} onChange={v => setNbvGhostAssets(Number(v))} />
          </div>

          <div className="mb-4">
            <label htmlFor="unrecordedAssets" className="block text-sm font-medium text-gray-300">Number of Unrecorded Assets:</label>
            <NumericInput style={inputStyle} value={unrecordedAssets} onChange={v => setUnrecordedAssets(Number(v))} />
          </div>

          <div className="mb-4">
            <label htmlFor="replacementValueUnrecorded" className="block text-sm font-medium text-gray-300">Replacement Value of Unrecorded Assets ($):</label>
            <NumericInput style={inputStyle} value={replacementValueUnrecorded} onChange={v => setReplacementValueUnrecorded(Number(v))} />
          </div>

          <div className="mb-4">
            <label htmlFor="propertyTaxSavings" className="block text-sm font-medium text-gray-300">Annual Property Tax Savings ($):</label>
            <NumericInput style={inputStyle} value={propertyTaxSavings} onChange={v => setPropertyTaxSavings(Number(v))} />
          </div>

          <div className="mb-4">
            <label htmlFor="insurancePremiumSavings" className="block text-sm font-medium text-gray-300">Annual Insurance Premium Savings ($):</label>
            <NumericInput style={inputStyle} value={insurancePremiumSavings} onChange={v => setInsurancePremiumSavings(Number(v))} />
          </div>

          <div className="mb-4">
            <label htmlFor="maintenanceCostReductions" className="block text-sm font-medium text-gray-300">Annual Maintenance Cost Reductions ($):</label>
            <NumericInput style={inputStyle} value={maintenanceCostReductions} onChange={v => setMaintenanceCostReductions(Number(v))} />
          </div>

          <div className="mb-4">
            <label htmlFor="engagementFee" className="block text-sm font-medium text-gray-300">Total Engagement Fee ($):</label>
            <NumericInput style={inputStyle} value={engagementFee} onChange={v => setEngagementFee(Number(v))} />
          </div>

          <div className="mb-4">
            <label htmlFor="discountRate" className="block text-sm font-medium text-gray-300">Discount Rate (%):</label>
            <NumericInput style={inputStyle} value={discountRate} onChange={v => setDiscountRate(Number(v))} />
          </div>

          <div className="mb-4">
            <label htmlFor="projectionYears" className="block text-sm font-medium text-gray-300">Projection Years:</label>
            <NumericInput style={inputStyle} value={projectionYears} onChange={v => setProjectionYears(Number(v))} defaultValue={5} />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-teal-400">Calculated Financials</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Total One-Time Capital Recovery:</label>
            <p className="text-xl font-bold text-amber-300">${financials.totalOneTimeCapitalRecovery.toLocaleString()}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Total Annual Savings:</label>
            <p className="text-xl font-bold text-amber-300">${financials.totalAnnualSavings.toLocaleString()}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Payback Period (Months):</label>
            <p className="text-xl font-bold text-amber-300">{financials.paybackPeriodMonths}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Net Present Value (NPV):</label>
            <p className="text-xl font-bold text-amber-300">${financials.npv.toLocaleString()}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Internal Rate of Return (IRR):</label>
            <p className="text-xl font-bold text-amber-300">{financials.irr}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
