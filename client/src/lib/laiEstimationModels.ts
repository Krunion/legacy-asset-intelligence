/**
 * LAI Estimation Models — Rebuilt per ROI Estimator Specification
 * 
 * KEY PRINCIPLES:
 * - Ghost asset gross value = exposure only, NOT cash recovery
 * - Do not treat gross asset value, replacement value, book value, or unrecorded asset value as realized financial benefit
 * - Do not count the same benefit in more than one category
 */

// ─── Industry Benchmarks ────────────────────────────────────────────────────────
export const INDUSTRY_BENCHMARKS: Record<string, {
  label: string;
  avgAssetValue: number;
  ghostAssetRate: number;
  unrecordedRate: number;
  maintenanceWasteRate: number;
  insuranceOverpayRate: number;
  propertyTaxOverpayRate: number;
  procurementWasteRate: number;
  surplusDispositionRate: number; // % of ghost assets that may yield net sale proceeds
  contractCorrectionRate: number; // % of maintenance contracts that may yield refunds
}> = {
  healthcare: {
    label: "Healthcare",
    avgAssetValue: 2500,
    ghostAssetRate: 0.25,
    unrecordedRate: 0.12,
    maintenanceWasteRate: 0.18,
    insuranceOverpayRate: 0.15,
    propertyTaxOverpayRate: 0.12,
    procurementWasteRate: 0.08,
    surplusDispositionRate: 0.05,
    contractCorrectionRate: 0.08,
  },
  manufacturing: {
    label: "Manufacturing",
    avgAssetValue: 3200,
    ghostAssetRate: 0.22,
    unrecordedRate: 0.10,
    maintenanceWasteRate: 0.15,
    insuranceOverpayRate: 0.12,
    propertyTaxOverpayRate: 0.14,
    procurementWasteRate: 0.06,
    surplusDispositionRate: 0.08,
    contractCorrectionRate: 0.06,
  },
  distribution: {
    label: "Distribution / Warehouse",
    avgAssetValue: 1800,
    ghostAssetRate: 0.20,
    unrecordedRate: 0.08,
    maintenanceWasteRate: 0.12,
    insuranceOverpayRate: 0.10,
    propertyTaxOverpayRate: 0.10,
    procurementWasteRate: 0.07,
    surplusDispositionRate: 0.06,
    contractCorrectionRate: 0.05,
  },
  utilities: {
    label: "Utilities / Energy",
    avgAssetValue: 4500,
    ghostAssetRate: 0.18,
    unrecordedRate: 0.14,
    maintenanceWasteRate: 0.20,
    insuranceOverpayRate: 0.14,
    propertyTaxOverpayRate: 0.16,
    procurementWasteRate: 0.05,
    surplusDispositionRate: 0.04,
    contractCorrectionRate: 0.10,
  },
  education: {
    label: "Education / University",
    avgAssetValue: 1200,
    ghostAssetRate: 0.30,
    unrecordedRate: 0.15,
    maintenanceWasteRate: 0.22,
    insuranceOverpayRate: 0.18,
    propertyTaxOverpayRate: 0.12,
    procurementWasteRate: 0.10,
    surplusDispositionRate: 0.03,
    contractCorrectionRate: 0.07,
  },
  construction: {
    label: "Construction / Contractor",
    avgAssetValue: 2800,
    ghostAssetRate: 0.24,
    unrecordedRate: 0.12,
    maintenanceWasteRate: 0.16,
    insuranceOverpayRate: 0.14,
    propertyTaxOverpayRate: 0.10,
    procurementWasteRate: 0.09,
    surplusDispositionRate: 0.10,
    contractCorrectionRate: 0.06,
  },
  logistics: {
    label: "Logistics / Transportation",
    avgAssetValue: 2100,
    ghostAssetRate: 0.20,
    unrecordedRate: 0.10,
    maintenanceWasteRate: 0.14,
    insuranceOverpayRate: 0.12,
    propertyTaxOverpayRate: 0.08,
    procurementWasteRate: 0.07,
    surplusDispositionRate: 0.07,
    contractCorrectionRate: 0.05,
  },
  government: {
    label: "Government / Public Sector",
    avgAssetValue: 2000,
    ghostAssetRate: 0.28,
    unrecordedRate: 0.14,
    maintenanceWasteRate: 0.20,
    insuranceOverpayRate: 0.16,
    propertyTaxOverpayRate: 0.14,
    procurementWasteRate: 0.10,
    surplusDispositionRate: 0.04,
    contractCorrectionRate: 0.08,
  },
  realestate: {
    label: "Real Estate / Property Management",
    avgAssetValue: 3500,
    ghostAssetRate: 0.20,
    unrecordedRate: 0.10,
    maintenanceWasteRate: 0.16,
    insuranceOverpayRate: 0.14,
    propertyTaxOverpayRate: 0.18,
    procurementWasteRate: 0.06,
    surplusDispositionRate: 0.06,
    contractCorrectionRate: 0.07,
  },
  other: {
    label: "Other",
    avgAssetValue: 1500,
    ghostAssetRate: 0.22,
    unrecordedRate: 0.10,
    maintenanceWasteRate: 0.15,
    insuranceOverpayRate: 0.12,
    propertyTaxOverpayRate: 0.12,
    procurementWasteRate: 0.07,
    surplusDispositionRate: 0.05,
    contractCorrectionRate: 0.06,
  },
};

// ─── Asset Management System Modifiers ──────────────────────────────────────────
export const ASSET_MGMT_SYSTEMS: Record<string, { label: string; riskModifier: number }> = {
  none: { label: "No Formal System", riskModifier: 1.30 },
  spreadsheets: { label: "Spreadsheets / Manual Tracking", riskModifier: 1.20 },
  basic_system: { label: "Basic Asset Management Software", riskModifier: 1.05 },
  erp_module: { label: "ERP Asset Module (SAP, Oracle, etc.)", riskModifier: 0.90 },
  dedicated_eam: { label: "Dedicated EAM Platform", riskModifier: 0.80 },
  iot_enabled: { label: "IoT/RFID-Enabled Tracking", riskModifier: 0.70 },
};

// ─── Inventory Recency Modifiers ────────────────────────────────────────────────
export const INVENTORY_RECENCY: Record<string, { label: string; riskModifier: number }> = {
  within_12m: { label: "Within 12 Months", riskModifier: 0.75 },
  "1_3_years": { label: "1-3 Years Ago", riskModifier: 1.00 },
  "3_5_years": { label: "3-5 Years Ago", riskModifier: 1.20 },
  "5_plus_years": { label: "5+ Years Ago", riskModifier: 1.40 },
  never: { label: "Never / Unknown", riskModifier: 1.50 },
};

// ─── Engagement Level Thresholds ────────────────────────────────────────────────
export const ENGAGEMENT_LEVELS = [
  { id: "discovery", label: "Discovery Assessment", minExposure: 0, maxExposure: 500000, feeRange: [15000, 35000] as [number, number], description: "Executive assessment and opportunity modeling" },
  { id: "standard", label: "Standard Engagement", minExposure: 500001, maxExposure: 2000000, feeRange: [35000, 85000] as [number, number], description: "Full Phase 1-3 with verification and reconciliation" },
  { id: "enterprise", label: "Enterprise Program", minExposure: 2000001, maxExposure: 10000000, feeRange: [85000, 200000] as [number, number], description: "Multi-site comprehensive asset intelligence" },
  { id: "strategic", label: "Strategic Partnership", minExposure: 10000001, maxExposure: Infinity, feeRange: [200000, 500000] as [number, number], description: "Ongoing governance with dedicated team" },
];

// ─── Public Executive ROI Estimator Input ───────────────────────────────────────
export interface PublicEstimatorInput {
  industry: string;
  facilityCount: number;
  estimatedAssetCount: number;
  approximateAssetValue: number;
  valueType: "replacement" | "net_book"; // User must confirm which type
  annualCapex: number;
  annualMaintenanceBudget: number;
  annualInsurancePremiums: number;
  assetManagementSystem: string;
  lastPhysicalInventoryDate: string;
  // Property tax questions
  subjectToPropertyTax: "yes" | "no" | "partial" | "unknown";
  orgType: "for_profit" | "government" | "nonprofit" | "education" | "other";
  knownPropertyTaxRate: number | null; // null = unknown
  recentTaxFiling: boolean;
  // Investment range selector
  investmentEstimate: "low" | "mid" | "high";
}

// ─── Revised Output — Separates Exposure from Recovery ──────────────────────────
export interface PublicEstimatorOutput {
  // Category 1: Asset-Record Exposure (NOT cash recovery, NOT in ROI)
  estimatedGhostAssets: number;
  estimatedGhostAssetExposure: number;
  estimatedUnrecordedAssets: number;
  estimatedUnrecordedAssetValue: number;
  totalAssetRecordExposure: number;

  // Category 2: Potential One-Time Financial Recovery
  surplusDispositionProceeds: number;
  propertyTaxRefund: number;
  contractCorrections: number;
  totalOneTimeRecovery: number;

  // Category 3: Potential Annual Recurring Savings
  maintenanceSavings: number;
  insurancePremiumReduction: number;
  prospectivePropertyTaxReduction: number;
  duplicatePurchaseAvoidance: number;
  totalAnnualRecurringSavings: number;

  // Category 4: Engagement Investment
  investmentRange: [number, number];
  modeledInvestment: number;
  investmentEstimateUsed: "low" | "mid" | "high";

  // Category 5: Financial Results
  firstYearBenefit: number;
  firstYearNetROI: number;
  fiveYearBenefit: number;
  fiveYearTotalCost: number;
  fiveYearNetROI: number;
  benefitCostRatioYear1: number;
  benefitCostRatio5Year: number;

  // Category 6: Payback
  paybackPeriodMonths: number | null; // null = "Not Achievable"

  // Metadata
  recommendedEngagementLevel: string;
  propertyTaxApplied: boolean;
  propertyTaxConfidence: "low" | "moderate" | "higher";
  overallConfidence: "low" | "moderate" | "higher";

  // Assumption details for "How This Was Calculated"
  assumptions: AssumptionDetail[];
}

export interface AssumptionDetail {
  category: string;
  rateUsed: number;
  appliedTo: string;
  source: string;
  userProvided: boolean;
  confidence: "low" | "moderate" | "higher";
}

// ─── Calculation Engine ─────────────────────────────────────────────────────────
export function calculatePublicEstimate(input: PublicEstimatorInput): PublicEstimatorOutput | null {
  // VALIDATION: Block if zero assets
  if (input.estimatedAssetCount <= 0) return null;
  if (input.facilityCount < 1) return null;

  const industry = INDUSTRY_BENCHMARKS[input.industry] || INDUSTRY_BENCHMARKS.other;
  const systemMod = ASSET_MGMT_SYSTEMS[input.assetManagementSystem]?.riskModifier || 1.0;
  const recencyMod = INVENTORY_RECENCY[input.lastPhysicalInventoryDate]?.riskModifier || 1.0;
  const riskModifier = systemMod * recencyMod;

  const assumptions: AssumptionDetail[] = [];

  // Determine total asset value
  const totalAssetValue = input.approximateAssetValue > 0
    ? input.approximateAssetValue
    : input.estimatedAssetCount * industry.avgAssetValue;

  const valueIsUserProvided = input.approximateAssetValue > 0;

  // ═══════════════════════════════════════════════════════════════════════════════
  // CATEGORY 1: ASSET-RECORD EXPOSURE (NOT cash recovery, NOT in ROI)
  // ═══════════════════════════════════════════════════════════════════════════════
  const ghostAssetRate = Math.min(industry.ghostAssetRate * riskModifier, 0.45);
  const estimatedGhostAssets = Math.round(input.estimatedAssetCount * ghostAssetRate);
  const estimatedGhostAssetExposure = Math.round(totalAssetValue * ghostAssetRate);

  const unrecordedRate = Math.min(industry.unrecordedRate * riskModifier, 0.25);
  const estimatedUnrecordedAssets = Math.round(input.estimatedAssetCount * unrecordedRate);
  const estimatedUnrecordedAssetValue = Math.round(totalAssetValue * unrecordedRate * 0.6);

  const totalAssetRecordExposure = estimatedGhostAssetExposure + estimatedUnrecordedAssetValue;

  assumptions.push({
    category: "Ghost Asset Rate",
    rateUsed: ghostAssetRate,
    appliedTo: `${input.estimatedAssetCount.toLocaleString()} assets`,
    source: `Industry benchmark (${industry.label}) adjusted for system and recency risk`,
    userProvided: false,
    confidence: "low",
  });

  assumptions.push({
    category: "Unrecorded Asset Rate",
    rateUsed: unrecordedRate,
    appliedTo: `${input.estimatedAssetCount.toLocaleString()} assets`,
    source: `Industry benchmark (${industry.label}) adjusted for system and recency risk`,
    userProvided: false,
    confidence: "low",
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // CATEGORY 2: POTENTIAL ONE-TIME FINANCIAL RECOVERY
  // Only net cash proceeds — NOT gross asset value
  // ═══════════════════════════════════════════════════════════════════════════════

  // Surplus disposition: only a small % of ghost assets may yield net sale proceeds
  // Net proceeds estimated at 10-15% of gross value for those that can be sold
  const surplusDispositionProceeds = Math.round(
    estimatedGhostAssetExposure * industry.surplusDispositionRate * 0.12
  );

  assumptions.push({
    category: "Surplus Disposition",
    rateUsed: industry.surplusDispositionRate,
    appliedTo: "Estimated ghost asset exposure (net proceeds at ~12% of qualifying assets)",
    source: "Industry benchmark — conservative net liquidation estimate",
    userProvided: false,
    confidence: "low",
  });

  // Property tax refund (one-time, for prior overpayment)
  let propertyTaxRefund = 0;
  let propertyTaxApplied = false;
  let propertyTaxConfidence: "low" | "moderate" | "higher" = "low";

  if (input.subjectToPropertyTax === "yes" || input.subjectToPropertyTax === "partial") {
    propertyTaxApplied = true;
    const effectiveRate = input.knownPropertyTaxRate !== null
      ? input.knownPropertyTaxRate
      : 0.015; // Default 1.5% if unknown

    propertyTaxConfidence = input.knownPropertyTaxRate !== null ? "moderate" : "low";
    if (input.recentTaxFiling) propertyTaxConfidence = "higher";

    // Refund for 1 year of overpayment on ghost assets
    const partialFactor = input.subjectToPropertyTax === "partial" ? 0.5 : 1.0;
    propertyTaxRefund = Math.round(
      estimatedGhostAssetExposure * effectiveRate * industry.propertyTaxOverpayRate * partialFactor
    );

    assumptions.push({
      category: "Property Tax Refund",
      rateUsed: effectiveRate,
      appliedTo: "Ghost asset exposure (1 year estimated overpayment)",
      source: input.knownPropertyTaxRate !== null ? "User-provided rate" : "Estimated default rate (1.5%)",
      userProvided: input.knownPropertyTaxRate !== null,
      confidence: propertyTaxConfidence,
    });
  } else if (input.subjectToPropertyTax === "no") {
    propertyTaxApplied = false;
  } else {
    // Unknown — don't apply, note it
    propertyTaxApplied = false;
  }

  // Contract corrections (maintenance contract refunds/credits)
  const contractCorrections = Math.round(
    input.annualMaintenanceBudget * industry.contractCorrectionRate * riskModifier
  );

  assumptions.push({
    category: "Contract Corrections",
    rateUsed: industry.contractCorrectionRate,
    appliedTo: `Annual maintenance budget ($${input.annualMaintenanceBudget.toLocaleString()})`,
    source: "Industry benchmark for recoverable contract overpayments",
    userProvided: false,
    confidence: input.annualMaintenanceBudget > 0 ? "moderate" : "low",
  });

  const totalOneTimeRecovery = surplusDispositionProceeds + propertyTaxRefund + contractCorrections;

  // ═══════════════════════════════════════════════════════════════════════════════
  // CATEGORY 3: POTENTIAL ANNUAL RECURRING SAVINGS
  // ═══════════════════════════════════════════════════════════════════════════════

  // Maintenance savings (contracts that may be terminated)
  const maintenanceSavings = Math.round(
    input.annualMaintenanceBudget * industry.maintenanceWasteRate * riskModifier
  );

  assumptions.push({
    category: "Maintenance Savings",
    rateUsed: industry.maintenanceWasteRate,
    appliedTo: `Annual maintenance budget ($${input.annualMaintenanceBudget.toLocaleString()})`,
    source: `Industry benchmark (${industry.label}) adjusted for risk`,
    userProvided: false,
    confidence: input.annualMaintenanceBudget > 0 ? "moderate" : "low",
  });

  // Insurance premium reduction
  const insurancePremiumReduction = input.annualInsurancePremiums > 0
    ? Math.round(input.annualInsurancePremiums * industry.insuranceOverpayRate * riskModifier)
    : 0;

  if (input.annualInsurancePremiums > 0) {
    assumptions.push({
      category: "Insurance Premium Reduction",
      rateUsed: industry.insuranceOverpayRate,
      appliedTo: `Annual insurance premiums ($${input.annualInsurancePremiums.toLocaleString()})`,
      source: `Industry benchmark (${industry.label})`,
      userProvided: true,
      confidence: "moderate",
    });
  }

  // Prospective property tax reduction (annual going forward — separate from one-time refund)
  let prospectivePropertyTaxReduction = 0;
  if (propertyTaxApplied) {
    const effectiveRate = input.knownPropertyTaxRate !== null ? input.knownPropertyTaxRate : 0.015;
    const partialFactor = input.subjectToPropertyTax === "partial" ? 0.5 : 1.0;
    prospectivePropertyTaxReduction = Math.round(
      estimatedGhostAssetExposure * effectiveRate * partialFactor * 0.8
    );

    assumptions.push({
      category: "Prospective Property Tax Reduction",
      rateUsed: effectiveRate,
      appliedTo: "Ghost asset exposure (annual prospective reduction)",
      source: input.knownPropertyTaxRate !== null ? "User-provided rate" : "Estimated default rate",
      userProvided: input.knownPropertyTaxRate !== null,
      confidence: propertyTaxConfidence,
    });
  }

  // Duplicate purchase avoidance
  const duplicatePurchaseAvoidance = Math.round(
    input.annualCapex * industry.procurementWasteRate * riskModifier
  );

  assumptions.push({
    category: "Duplicate Purchase Avoidance",
    rateUsed: industry.procurementWasteRate,
    appliedTo: `Annual CapEx ($${input.annualCapex.toLocaleString()})`,
    source: `Industry benchmark (${industry.label})`,
    userProvided: false,
    confidence: input.annualCapex > 0 ? "moderate" : "low",
  });

  const totalAnnualRecurringSavings = maintenanceSavings + insurancePremiumReduction +
    prospectivePropertyTaxReduction + duplicatePurchaseAvoidance;

  // ═══════════════════════════════════════════════════════════════════════════════
  // CATEGORY 4: ENGAGEMENT INVESTMENT
  // ═══════════════════════════════════════════════════════════════════════════════

  const engagementLevel = ENGAGEMENT_LEVELS.find(
    e => totalAssetRecordExposure >= e.minExposure && totalAssetRecordExposure <= e.maxExposure
  ) || ENGAGEMENT_LEVELS[1];

  // Complexity factor for fee estimation
  const complexityFactor = Math.min(
    (input.facilityCount / 5) * 0.3 + (input.estimatedAssetCount / 5000) * 0.4 + (riskModifier - 0.7) * 0.3,
    1.0
  );

  const investmentRange: [number, number] = [
    Math.round(engagementLevel.feeRange[0] + (engagementLevel.feeRange[1] - engagementLevel.feeRange[0]) * complexityFactor * 0.3),
    Math.round(engagementLevel.feeRange[0] + (engagementLevel.feeRange[1] - engagementLevel.feeRange[0]) * complexityFactor * 0.9),
  ];

  let modeledInvestment: number;
  if (input.investmentEstimate === "low") {
    modeledInvestment = investmentRange[0];
  } else if (input.investmentEstimate === "high") {
    modeledInvestment = investmentRange[1];
  } else {
    modeledInvestment = Math.round((investmentRange[0] + investmentRange[1]) / 2);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CATEGORY 5: FINANCIAL RESULTS
  // ═══════════════════════════════════════════════════════════════════════════════

  // First-Year Financial Benefit = One-Time Recovery + First-Year Recurring Savings
  const firstYearBenefit = totalOneTimeRecovery + totalAnnualRecurringSavings;

  // First-Year Net ROI
  const firstYearNetROI = modeledInvestment > 0
    ? Math.round(((firstYearBenefit - modeledInvestment) / modeledInvestment) * 100)
    : 0;

  // Five-Year Financial Benefit = One-Time Recovery + (Annual Recurring × 5)
  const fiveYearBenefit = totalOneTimeRecovery + (totalAnnualRecurringSavings * 5);

  // Five-Year Total Cost (simplified — no technology or governance costs in public estimator)
  const fiveYearTotalCost = modeledInvestment;

  // Five-Year Net ROI
  const fiveYearNetROI = fiveYearTotalCost > 0
    ? Math.round(((fiveYearBenefit - fiveYearTotalCost) / fiveYearTotalCost) * 100)
    : 0;

  // Benefit-Cost Ratios
  const benefitCostRatioYear1 = modeledInvestment > 0
    ? Math.round((firstYearBenefit / modeledInvestment) * 100) / 100
    : 0;

  const benefitCostRatio5Year = fiveYearTotalCost > 0
    ? Math.round((fiveYearBenefit / fiveYearTotalCost) * 100) / 100
    : 0;

  // ═══════════════════════════════════════════════════════════════════════════════
  // CATEGORY 6: PAYBACK PERIOD
  // ═══════════════════════════════════════════════════════════════════════════════

  let paybackPeriodMonths: number | null = null;
  const monthlyBenefit = totalAnnualRecurringSavings / 12;

  if (firstYearBenefit <= 0) {
    paybackPeriodMonths = null; // "Not Achievable Based on Current Inputs"
  } else if (totalOneTimeRecovery >= modeledInvestment) {
    // One-time recovery covers investment — assume 3-6 month realization
    paybackPeriodMonths = Math.round((modeledInvestment / totalOneTimeRecovery) * 6);
  } else if (monthlyBenefit > 0) {
    // Remaining after one-time recovery, paid back monthly
    const remaining = modeledInvestment - totalOneTimeRecovery;
    const monthsFromRecurring = remaining / monthlyBenefit;
    // Add 3 months for one-time recovery realization timing
    paybackPeriodMonths = Math.round(
      (totalOneTimeRecovery > 0 ? 3 : 0) + monthsFromRecurring
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // OVERALL CONFIDENCE
  // ═══════════════════════════════════════════════════════════════════════════════
  const userProvidedCount = [
    valueIsUserProvided,
    input.annualMaintenanceBudget > 0,
    input.annualInsurancePremiums > 0,
    input.annualCapex > 0,
    input.knownPropertyTaxRate !== null,
  ].filter(Boolean).length;

  let overallConfidence: "low" | "moderate" | "higher" = "low";
  if (userProvidedCount >= 4) overallConfidence = "higher";
  else if (userProvidedCount >= 2) overallConfidence = "moderate";

  return {
    estimatedGhostAssets,
    estimatedGhostAssetExposure,
    estimatedUnrecordedAssets,
    estimatedUnrecordedAssetValue,
    totalAssetRecordExposure,
    surplusDispositionProceeds,
    propertyTaxRefund,
    contractCorrections,
    totalOneTimeRecovery,
    maintenanceSavings,
    insurancePremiumReduction,
    prospectivePropertyTaxReduction,
    duplicatePurchaseAvoidance,
    totalAnnualRecurringSavings,
    investmentRange,
    modeledInvestment,
    investmentEstimateUsed: input.investmentEstimate,
    firstYearBenefit,
    firstYearNetROI,
    fiveYearBenefit,
    fiveYearTotalCost,
    fiveYearNetROI,
    benefitCostRatioYear1,
    benefitCostRatio5Year,
    paybackPeriodMonths,
    recommendedEngagementLevel: engagementLevel.label,
    propertyTaxApplied,
    propertyTaxConfidence,
    overallConfidence,
    assumptions,
  };
}
