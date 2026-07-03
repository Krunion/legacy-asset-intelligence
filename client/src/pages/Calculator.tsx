import React, { useState } from 'react';

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

    // Calculate NPV and IRR (simplified for now, will need more robust implementation)
    // For a simple calculator, we can assume a constant annual saving after year 1
    let npv = -engagementFee;
    for (let i = 1; i <= projectionYears; i++) {
      npv += totalAnnualSavings / Math.pow(1 + discountRate / 100, i);
    }

    // IRR is complex to calculate iteratively, will leave as placeholder or use a library
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

  return (
    <div className="container mx-auto p-8 bg-gray-900 text-gray-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-10 text-amber-400">Corporate Finance Calculator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-teal-400">Input Parameters</h2>

          <div className="mb-4">
            <label htmlFor="ghostAssets" className="block text-sm font-medium text-gray-300">Number of Ghost Assets:</label>
            <input
              type="number"
              id="ghostAssets"
              value={ghostAssets}
              onChange={(e) => setGhostAssets(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="nbvGhostAssets" className="block text-sm font-medium text-gray-300">NBV of Ghost Assets ($):</label>
            <input
              type="number"
              id="nbvGhostAssets"
              value={nbvGhostAssets}
              onChange={(e) => setNbvGhostAssets(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="unrecordedAssets" className="block text-sm font-medium text-gray-300">Number of Unrecorded Assets:</label>
            <input
              type="number"
              id="unrecordedAssets"
              value={unrecordedAssets}
              onChange={(e) => setUnrecordedAssets(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="replacementValueUnrecorded" className="block text-sm font-medium text-gray-300">Replacement Value of Unrecorded Assets ($):</label>
            <input
              type="number"
              id="replacementValueUnrecorded"
              value={replacementValueUnrecorded}
              onChange={(e) => setReplacementValueUnrecorded(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="propertyTaxSavings" className="block text-sm font-medium text-gray-300">Annual Property Tax Savings ($):</label>
            <input
              type="number"
              id="propertyTaxSavings"
              value={propertyTaxSavings}
              onChange={(e) => setPropertyTaxSavings(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="insurancePremiumSavings" className="block text-sm font-medium text-gray-300">Annual Insurance Premium Savings ($):</label>
            <input
              type="number"
              id="insurancePremiumSavings"
              value={insurancePremiumSavings}
              onChange={(e) => setInsurancePremiumSavings(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="maintenanceCostReductions" className="block text-sm font-medium text-gray-300">Annual Maintenance Cost Reductions ($):</label>
            <input
              type="number"
              id="maintenanceCostReductions"
              value={maintenanceCostReductions}
              onChange={(e) => setMaintenanceCostReductions(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="engagementFee" className="block text-sm font-medium text-gray-300">Total Engagement Fee ($):</label>
            <input
              type="number"
              id="engagementFee"
              value={engagementFee}
              onChange={(e) => setEngagementFee(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="discountRate" className="block text-sm font-medium text-gray-300">Discount Rate (%):</label>
            <input
              type="number"
              id="discountRate"
              value={discountRate}
              onChange={(e) => setDiscountRate(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="projectionYears" className="block text-sm font-medium text-gray-300">Projection Years:</label>
            <input
              type="number"
              id="projectionYears"
              value={projectionYears}
              onChange={(e) => setProjectionYears(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-amber-500 focus:border-amber-500"
            />
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
