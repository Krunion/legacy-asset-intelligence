/**
 * LAI Proprietary Estimation Models
 * Used by both the Public Executive ROI Estimator and the Employee Financial Recovery Engine
 * 
 * These models predict financial recovery opportunities based on organizational profile data
 * that executives would reasonably know before engaging LAI.
 */

// ─── Industry Benchmarks ────────────────────────────────────────────────────────
export const INDUSTRY_BENCHMARKS: Record<string, {
  label: string;
  avgAssetValue: number;        // Average per-asset replacement value
  ghostAssetRate: number;       // Typical ghost asset percentage (15-30%)
  unrecordedRate: number;       // Typical unrecorded asset percentage (5-15%)
  maintenanceWasteRate: number; // % of maintenance budget wasted on ghost assets
  insuranceOverpayRate: number; // % insurance overpayment due to ghost assets
  propertyTaxOverpayRate: number; // % property tax overpayment
  procurementWasteRate: number; // % duplicate/unnecessary purchases
  depreciationErrorRate: number; // % depreciation schedule inaccuracy
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
    depreciationErrorRate: 0.20,
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
    depreciationErrorRate: 0.18,
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
    depreciationErrorRate: 0.15,
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
    depreciationErrorRate: 0.22,
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
    depreciationErrorRate: 0.25,
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
    depreciationErrorRate: 0.20,
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
    depreciationErrorRate: 0.16,
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
    depreciationErrorRate: 0.24,
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
    depreciationErrorRate: 0.18,
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
    depreciationErrorRate: 0.18,
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
  { id: "discovery", label: "Discovery Assessment", minOpportunity: 0, maxOpportunity: 250000, feeRange: [15000, 35000], description: "Executive assessment and opportunity modeling" },
  { id: "standard", label: "Standard Engagement", minOpportunity: 250001, maxOpportunity: 1000000, feeRange: [35000, 85000], description: "Full Phase 1-3 with verification and reconciliation" },
  { id: "enterprise", label: "Enterprise Program", minOpportunity: 1000001, maxOpportunity: 5000000, feeRange: [85000, 200000], description: "Multi-site comprehensive asset intelligence" },
  { id: "strategic", label: "Strategic Partnership", minOpportunity: 5000001, maxOpportunity: Infinity, feeRange: [200000, 500000], description: "Ongoing governance with dedicated team" },
];

// ─── Public Executive ROI Estimator Input ───────────────────────────────────────
export interface PublicEstimatorInput {
  industry: string;
  facilityCount: number;
  estimatedAssetCount: number;
  approximateReplacementValue: number; // Total approximate replacement value
  annualCapex: number;
  annualMaintenanceBudget: number;
  annualInsurancePremiums: number;     // Optional - 0 if unknown
  assetManagementSystem: string;
  lastPhysicalInventoryDate: string;   // Recency key
}

// ─── Public Executive ROI Estimator Output ──────────────────────────────────────
export interface PublicEstimatorOutput {
  // Predicted exposure
  estimatedGhostAssets: number;
  estimatedGhostAssetValue: number;
  estimatedUnrecordedAssets: number;
  estimatedUnrecordedValue: number;
  recoverableCapital: number;
  maintenanceWaste: number;
  insuranceOptimization: number;
  propertyTaxReduction: number;
  procurementWaste: number;
  totalFinancialOpportunity: number;

  // Engagement recommendation
  recommendedEngagementLevel: string;
  projectedConsultingInvestment: [number, number]; // [low, high]
  firstYearBenefit: number;
  fiveYearBenefit: number;
  netROI: number;               // percentage
  estimatedPaybackPeriodMonths: number;
}

// ─── Calculation Engine ─────────────────────────────────────────────────────────
export function calculatePublicEstimate(input: PublicEstimatorInput): PublicEstimatorOutput {
  const industry = INDUSTRY_BENCHMARKS[input.industry] || INDUSTRY_BENCHMARKS.other;
  const systemMod = ASSET_MGMT_SYSTEMS[input.assetManagementSystem]?.riskModifier || 1.0;
  const recencyMod = INVENTORY_RECENCY[input.lastPhysicalInventoryDate]?.riskModifier || 1.0;

  // Combined risk modifier
  const riskModifier = systemMod * recencyMod;

  // Use provided replacement value or estimate from asset count
  const totalAssetValue = input.approximateReplacementValue > 0
    ? input.approximateReplacementValue
    : input.estimatedAssetCount * industry.avgAssetValue;

  // Ghost asset predictions
  const ghostAssetRate = Math.min(industry.ghostAssetRate * riskModifier, 0.45);
  const estimatedGhostAssets = Math.round(input.estimatedAssetCount * ghostAssetRate);
  const estimatedGhostAssetValue = Math.round(totalAssetValue * ghostAssetRate);

  // Unrecorded asset predictions
  const unrecordedRate = Math.min(industry.unrecordedRate * riskModifier, 0.25);
  const estimatedUnrecordedAssets = Math.round(input.estimatedAssetCount * unrecordedRate);
  const estimatedUnrecordedValue = Math.round(totalAssetValue * unrecordedRate * 0.6); // 60% of replacement value

  // Recoverable capital (ghost assets that can be written off + unrecorded value)
  const recoverableCapital = estimatedGhostAssetValue + estimatedUnrecordedValue;

  // Annual savings calculations
  const maintenanceWaste = Math.round(
    input.annualMaintenanceBudget * industry.maintenanceWasteRate * riskModifier
  );

  const insuranceOptimization = input.annualInsurancePremiums > 0
    ? Math.round(input.annualInsurancePremiums * industry.insuranceOverpayRate * riskModifier)
    : Math.round(totalAssetValue * 0.003 * industry.insuranceOverpayRate * riskModifier); // Estimate 0.3% of asset value as premium

  const propertyTaxReduction = Math.round(
    totalAssetValue * 0.015 * industry.propertyTaxOverpayRate * riskModifier // Estimate 1.5% property tax rate
  );

  const procurementWaste = Math.round(
    input.annualCapex * industry.procurementWasteRate * riskModifier
  );

  // Total financial opportunity
  const annualSavings = maintenanceWaste + insuranceOptimization + propertyTaxReduction + procurementWaste;
  const totalFinancialOpportunity = recoverableCapital + annualSavings;

  // Engagement recommendation
  const engagementLevel = ENGAGEMENT_LEVELS.find(
    e => totalFinancialOpportunity >= e.minOpportunity && totalFinancialOpportunity <= e.maxOpportunity
  ) || ENGAGEMENT_LEVELS[1];

  // Fee estimation based on complexity
  const complexityFactor = Math.min(
    (input.facilityCount / 5) * 0.3 + (input.estimatedAssetCount / 5000) * 0.4 + (riskModifier - 0.7) * 0.3,
    1.0
  );
  const feeRange: [number, number] = [
    Math.round(engagementLevel.feeRange[0] + (engagementLevel.feeRange[1] - engagementLevel.feeRange[0]) * complexityFactor * 0.3),
    Math.round(engagementLevel.feeRange[0] + (engagementLevel.feeRange[1] - engagementLevel.feeRange[0]) * complexityFactor * 0.8),
  ];
  const avgFee = (feeRange[0] + feeRange[1]) / 2;

  // Benefits
  const firstYearBenefit = recoverableCapital + annualSavings;
  const fiveYearBenefit = recoverableCapital + (annualSavings * 5);

  // ROI and payback
  const netROI = Math.round(((firstYearBenefit - avgFee) / avgFee) * 100);
  const estimatedPaybackPeriodMonths = annualSavings > 0
    ? Math.round((avgFee / (annualSavings / 12)) * 10) / 10
    : 12;

  return {
    estimatedGhostAssets,
    estimatedGhostAssetValue,
    estimatedUnrecordedAssets,
    estimatedUnrecordedValue,
    recoverableCapital,
    maintenanceWaste,
    insuranceOptimization,
    propertyTaxReduction,
    procurementWaste,
    totalFinancialOpportunity,
    recommendedEngagementLevel: engagementLevel.label,
    projectedConsultingInvestment: feeRange,
    firstYearBenefit,
    fiveYearBenefit,
    netROI,
    estimatedPaybackPeriodMonths,
  };
}
