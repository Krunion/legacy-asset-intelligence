/**
 * LAI Proposal Calculator - Interactive Employee Portal Form
 * Replicates the exact pricing model from the Excel spreadsheet
 * Generates professional branded proposals with signature line
 */

import { useState, useRef, useMemo } from "react";
import { LOGO_BASE64 } from "./logoBase64";
import NumericInput from "./NumericInput";
import {
  calculatePublicEstimate,
  type PublicEstimatorInput,
  type PublicEstimatorOutput,
} from "@/lib/laiEstimationModels";

// ─── Data Tables (from spreadsheet) ─────────────────────────────────────────

const INDUSTRIES = [
  { label: "Healthcare / Hospital", multiplier: 1.1 },
  { label: "Physician Group / Ambulatory", multiplier: 1.0 },
  { label: "Senior Care / Long-Term Care", multiplier: 1.05 },
  { label: "Manufacturing", multiplier: 1.05 },
  { label: "Distribution / Warehouse", multiplier: 1.0 },
  { label: "Logistics / Transportation", multiplier: 1.05 },
  { label: "Government / Public Sector", multiplier: 1.1 },
  { label: "Education / University", multiplier: 1.05 },
  { label: "Hospitality", multiplier: 0.95 },
  { label: "Professional Services", multiplier: 0.9 },
  { label: "Technology / SaaS", multiplier: 0.95 },
  { label: "Retail / Multi-Location", multiplier: 1.0 },
  { label: "Construction / Contractor", multiplier: 1.05 },
  { label: "Utilities / Energy", multiplier: 1.15 },
  { label: "Aviation", multiplier: 1.2 },
  { label: "Financial Services", multiplier: 1.0 },
  { label: "Nonprofit", multiplier: 0.95 },
  { label: "Real Estate / Property Management", multiplier: 1.0 },
  { label: "Food Service / Restaurant Group", multiplier: 0.95 },
  { label: "Other", multiplier: 1.0 },
];

const COMPLEXITY_LEVELS = [
  { label: "Low", multiplier: 0.9 },
  { label: "Moderate", multiplier: 1.1 },
  { label: "High", multiplier: 1.25 },
  { label: "Critical", multiplier: 1.4 },
];

const RECORD_QUALITY = [
  { label: "Excellent", multiplier: 0.85 },
  { label: "Good", multiplier: 1.0 },
  { label: "Fair", multiplier: 1.15 },
  { label: "Poor", multiplier: 1.35 },
  { label: "Critical / No Reliable Records", multiplier: 1.55 },
];

const LAST_INVENTORY = [
  { label: "Within 12 Months", multiplier: 0.85 },
  { label: "1-3 Years", multiplier: 1.25 },
  { label: "3-5 Years", multiplier: 1.5 },
  { label: "More Than 5 Years", multiplier: 1.75 },
  { label: "Never / Unknown", multiplier: 2.0 },
];

const PRICE_POSITIONS = [
  { label: "Competitive", multiplier: 0.9 },
  { label: "Standard", multiplier: 1.0 },
  { label: "Premium", multiplier: 1.05 },
];

const GEO_FOOTPRINTS = [
  { label: "Single Location", multiplier: 1.0 },
  { label: "Local Multi-Site", multiplier: 1.25 },
  { label: "Regional", multiplier: 1.75 },
  { label: "Multi-State", multiplier: 2.5 },
  { label: "National", multiplier: 3.5 },
];

const DISTANCE_BANDS = [
  { label: "Local / <100 Miles", costPerMember: 250 },
  { label: "Regional / 100-400 Miles", costPerMember: 500 },
  { label: "Cross-State / 400-900 Miles", costPerMember: 850 },
  { label: "National / 900+ Miles", costPerMember: 1500 },
];

const VERIFICATION_DEPTHS = [
  { label: "Basic Sampling", multiplier: 0.9 },
  { label: "Standard Verification", multiplier: 1.0 },
  { label: "Comprehensive Verification", multiplier: 1.05 },
  { label: "Audit-Ready Verification", multiplier: 1.1 },
];

const BASELINE_ID_METHODS = [
  { label: "Existing Tags Only", perAsset: 0 },
  { label: "Temporary LAI Labels", perAsset: 1 },
  { label: "QR Baseline Labels", perAsset: 2 },
  { label: "Barcode Baseline Labels", perAsset: 2.5 },
  { label: "RFID Pilot Tags", perAsset: 5 },
];

const BARCODE_PROCUREMENT_COSTS = [
  { label: "Temporary Labels", perAsset: 0.75 },
  { label: "QR Labels", perAsset: 1.50 },
  { label: "Barcode Labels", perAsset: 2.00 },
  { label: "RFID Tags", perAsset: 5.00 },
];

const RECOVERY_ANALYSIS = [
  { label: "None", addOn: 0 },
  { label: "Basic", addOn: 3500 },
  { label: "Standard", addOn: 6500 },
  { label: "Enhanced", addOn: 12000 },
];

const GOVERNANCE_LEVELS = [
  { label: "Basic Governance", modifier: 1.0 },
  { label: "Standard Governance", modifier: 1.1 },
  { label: "Advanced Governance", modifier: 1.2 },
  { label: "Enterprise Governance", modifier: 1.35 },
];

const TECH_ENABLEMENT = [
  { label: "Advisory Only", addOn: 3500 },
  { label: "Vendor Selection Support", addOn: 7500 },
  { label: "QR / Barcode Roadmap", addOn: 10000 },
  { label: "RFID Readiness Roadmap", addOn: 15000 },
  { label: "Implementation Management", addOn: 22500 },
];

const TRAINING_DEPTHS = [
  { label: "None", addOn: 0 },
  { label: "Basic Leadership Briefing", addOn: 2000 },
  { label: "Manager Training", addOn: 3500 },
  { label: "Train-the-Trainer", addOn: 5000 },
  { label: "Organization-Wide Training", addOn: 7500 },
];

const ASSESSMENT_LEVELS = [
  { label: "Lean Assessment", addOn: 0, minPrice: 7500 },
  { label: "Standard Assessment", addOn: 5000, minPrice: 15500 },
  { label: "Comprehensive Assessment", addOn: 12000, minPrice: 25000 },
  { label: "Board-Ready Assessment", addOn: 22000, minPrice: 38500 },
];

const RECURRING_TIERS = [
  { label: "Bronze", baseFee: 10000 },
  { label: "Silver", baseFee: 20000 },
  { label: "Gold", baseFee: 36000 },
  { label: "Platinum", baseFee: 60000 },
];

const AUDIT_FREQUENCIES = [
  { label: "Annual", multiplier: 1.0 },
  { label: "Semi-Annual", multiplier: 1.35 },
  { label: "Quarterly", multiplier: 2.0 },
  { label: "Monthly", multiplier: 4.0 },
];

const SCALE_TIERS = [
  { label: "Micro / Pilot", minAssets: 0, maxAssets: 300, phase1Min: 7500, phase2Min: 12500, phase3Min: 10000, recurringScaleFactor: 0.45, baseDiscoveryFee: 6500 },
  { label: "Small", minAssets: 301, maxAssets: 500, phase1Min: 12500, phase2Min: 18000, phase3Min: 15000, recurringScaleFactor: 0.65, baseDiscoveryFee: 9500 },
  { label: "Mid-Market", minAssets: 501, maxAssets: 25000, phase1Min: 17500, phase2Min: 35000, phase3Min: 20000, recurringScaleFactor: 0.9, baseDiscoveryFee: 15000 },
  { label: "Large", minAssets: 25001, maxAssets: 100000, phase1Min: 25000, phase2Min: 65000, phase3Min: 35000, recurringScaleFactor: 1.2, baseDiscoveryFee: 25000 },
  { label: "Enterprise", minAssets: 100001, maxAssets: 999999, phase1Min: 35000, phase2Min: 95000, phase3Min: 70000, recurringScaleFactor: 1.6, baseDiscoveryFee: 40000 },
];

const PER_ASSET_TIERS = [
  { minAssets: 0, maxAssets: 500, phase2: 6, phase3: 0.75, bronze: 2, silver: 3.5, gold: 5, platinum: 7 },
  { minAssets: 501, maxAssets: 2500, phase2: 3.5, phase3: 0.6, bronze: 1.75, silver: 3, gold: 4.5, platinum: 6 },
  { minAssets: 2501, maxAssets: 10000, phase2: 1.75, phase3: 0.45, bronze: 1.5, silver: 2.5, gold: 3.75, platinum: 5 },
  { minAssets: 10001, maxAssets: 25000, phase2: 1, phase3: 0.3, bronze: 1.1, silver: 2, gold: 3, platinum: 4 },
  { minAssets: 25001, maxAssets: 50000, phase2: 0.6, phase3: 0.2, bronze: 0.85, silver: 1.5, gold: 2.25, platinum: 3.25 },
  { minAssets: 50001, maxAssets: 999999, phase2: 0.35, phase3: 0.15, bronze: 0.65, silver: 1.2, gold: 2, platinum: 3 },
];

// ─── Calculation Engine ─────────────────────────────────────────────────────

function getScaleTier(assets: number) {
  return SCALE_TIERS.find(t => assets >= t.minAssets && assets <= t.maxAssets) || SCALE_TIERS[0];
}

function getPerAssetTier(assets: number) {
  return PER_ASSET_TIERS.find(t => assets >= t.minAssets && assets <= t.maxAssets) || PER_ASSET_TIERS[0];
}

function getRecurringPerAssetRate(assets: number, tier: string) {
  const t = getPerAssetTier(assets);
  const key = tier.toLowerCase() as "bronze" | "silver" | "gold" | "platinum";
  return t[key] || t.bronze;
}

// ─── Mapping from Proposal inputs → Estimation Model inputs ──────────────────
const INDUSTRY_INDEX_TO_KEY: Record<number, string> = {
  0: "healthcare", 1: "healthcare", 2: "healthcare",
  3: "manufacturing", 4: "distribution", 5: "logistics",
  6: "government", 7: "education", 8: "other",
  9: "other", 10: "other", 11: "other",
  12: "construction", 13: "utilities", 14: "logistics",
  15: "other", 16: "education", 17: "realestate",
  18: "other", 19: "other",
};

const RECORD_QUALITY_TO_SYSTEM: Record<number, string> = {
  0: "dedicated_eam", 1: "erp_module", 2: "basic_system",
  3: "spreadsheets", 4: "none",
};

const LAST_INVENTORY_TO_RECENCY: Record<number, string> = {
  0: "within_12m", 1: "1_3_years", 2: "3_5_years",
  3: "5_plus_years", 4: "never",
};

interface CalcInputs {
  clientName: string;
  industry: number;
  assets: number;
  locations: number; // informational only
  departments: number; // informational only
  geoFootprint: number;
  distance: number;
  complexity: number;
  recordQuality: number;
  lastInventory: number;
  pricePosition: number;
  includePhase1: boolean;
  assessmentLevel: number;
  // Phase 1 per-phase travel/location
  p1Locations: number;
  p1Departments: number;
  p1TravelVisits: number;
  p1TravelTeamMembers: number;
  includePhase2: boolean;
  verificationDepth: number;
  recoveryAnalysis: number;
  // Phase 2 per-phase travel/location
  p2Locations: number;
  p2Departments: number;
  p2TravelVisits: number;
  p2TravelTeamMembers: number;
  includePhase3: boolean;
  governanceLevel: number;
  techEnablement: number;
  trainingDepth: number;
  // Phase 3 per-phase travel/location
  p3Locations: number;
  p3Departments: number;
  p3TravelVisits: number;
  p3TravelTeamMembers: number;
  // Phase 3 Deployment Decisions
  tagDeployment: "lai" | "client";
  tagType: number;
  barcodeProcurement: "lai" | "client";
  barcodeType: number;
  offHours: boolean;
  accelerated: boolean;
  includeRecurring: boolean;
  recurringTier: number;
  auditFrequency: number;
  // Recurring per-phase travel/location
  recLocations: number;
  recDepartments: number;
  recTravelVisits: number;
  recTravelTeamMembers: number;
  // ROI Mode
  roiMode: "estimated" | "verified";
  // Verified overrides (only used when roiMode === "verified")
  verifiedGhostAssetValue: number;
  verifiedUnrecordedValue: number;
  verifiedMaintenanceWaste: number;
  verifiedInsuranceOptimization: number;
  verifiedPropertyTaxReduction: number;
  verifiedProcurementWaste: number;
}

function calculatePhaseTravel(distance: number, travelVisits: number, travelTeamMembers: number, locations: number) {
  const costPerMember = DISTANCE_BANDS[distance].costPerMember;
  const travelCostPerVisit = costPerMember * travelTeamMembers;
  const siteTravelComplexityFactor = Math.min(3, 1 + Math.max(0, locations - 1) * 0.12);
  return travelCostPerVisit * travelVisits * siteTravelComplexityFactor;
}

function calculateProposal(inputs: CalcInputs) {
  const scaleTier = getScaleTier(inputs.assets);
  const perAssetTier = getPerAssetTier(inputs.assets);

  // Multipliers
  const industryMult = INDUSTRIES[inputs.industry].multiplier;
  const geoMult = GEO_FOOTPRINTS[inputs.geoFootprint].multiplier;
  const complexityMult = COMPLEXITY_LEVELS[inputs.complexity].multiplier;
  const recordQualityMult = RECORD_QUALITY[inputs.recordQuality].multiplier;
  const lastInventoryMult = LAST_INVENTORY[inputs.lastInventory].multiplier;
  const pricePositionMult = PRICE_POSITIONS[inputs.pricePosition].multiplier;

  // Controlled Risk Modifier
  const controlledRiskModifier = 1 + Math.min(0.5, Math.max(-0.15,
    (industryMult - 1) * 0.25 +
    (geoMult - 1) * 0.15 +
    (complexityMult - 1) * 0.25 +
    (recordQualityMult - 1) * 0.2 +
    (lastInventoryMult - 1) * 0.15
  ));
  const marketPositionModifier = pricePositionMult;

  // Off-hours and accelerated premiums
  const offHoursPremium = inputs.offHours ? 0.1 : 0;
  const acceleratedPremium = inputs.accelerated ? 0.15 : 0;

  // ─── Phase 1 ───
  let phase1Price = 0;
  if (inputs.includePhase1) {
    const assessmentConfig = ASSESSMENT_LEVELS[inputs.assessmentLevel];
    const p1Travel = calculatePhaseTravel(inputs.distance, inputs.p1TravelVisits, inputs.p1TravelTeamMembers, inputs.p1Locations);
    const baseEffort = 6000 + (inputs.p1Locations * 500) + (inputs.p1Departments * 250);
    const assessmentAddOn = assessmentConfig.addOn;
    const subtotal = (baseEffort + assessmentAddOn) * controlledRiskModifier * marketPositionModifier + p1Travel;
    phase1Price = Math.max(subtotal, scaleTier.phase1Min, assessmentConfig.minPrice);
  }

  // ─── Phase 2 ───
  let phase2Price = 0;
  if (inputs.includePhase2) {
    const p2Travel = calculatePhaseTravel(inputs.distance, inputs.p2TravelVisits, inputs.p2TravelTeamMembers, inputs.p2Locations);
    const baseDiscoveryFee = scaleTier.baseDiscoveryFee;
    const perAssetRate = perAssetTier.phase2;
    const assetComponent = inputs.assets * perAssetRate;
    const locationComponent = inputs.p2Locations * 500;
    const deptComponent = inputs.p2Departments * 150;
    const verificationDepthMod = VERIFICATION_DEPTHS[inputs.verificationDepth].multiplier;
    const recoveryAddOn = RECOVERY_ANALYSIS[inputs.recoveryAnalysis].addOn;
    const subtotal = (((baseDiscoveryFee + assetComponent + locationComponent + deptComponent) * verificationDepthMod + recoveryAddOn) * controlledRiskModifier * marketPositionModifier * (1 + offHoursPremium + acceleratedPremium)) + p2Travel;
    phase2Price = Math.max(subtotal, scaleTier.phase2Min);
  }

  // ─── Phase 3 ───
  let phase3Price = 0;
  let taggingLaborCost = 0;
  let barcodeProcurementCost = 0;
  if (inputs.includePhase3) {
    const p3Travel = calculatePhaseTravel(inputs.distance, inputs.p3TravelVisits, inputs.p3TravelTeamMembers, inputs.p3Locations);
    const baseEffort = 6500 + (inputs.p3Locations * 500) + (inputs.p3Departments * 150);
    const perAssetFee = perAssetTier.phase3;
    const assetComponent = inputs.assets * perAssetFee;
    const locationComponent = inputs.p3Locations * 500;
    const deptComponent = inputs.p3Departments * 150;
    const governanceMod = GOVERNANCE_LEVELS[inputs.governanceLevel].modifier;
    const techAddOn = TECH_ENABLEMENT[inputs.techEnablement].addOn;
    const trainingAddOn = TRAINING_DEPTHS[inputs.trainingDepth].addOn;
    taggingLaborCost = inputs.tagDeployment === "lai" ? inputs.assets * BASELINE_ID_METHODS[inputs.tagType].perAsset : 0;
    barcodeProcurementCost = inputs.barcodeProcurement === "lai" ? inputs.assets * BARCODE_PROCUREMENT_COSTS[inputs.barcodeType].perAsset : 0;
    const subtotal = (((baseEffort + assetComponent + locationComponent + deptComponent) * governanceMod) * controlledRiskModifier + techAddOn + trainingAddOn + taggingLaborCost + barcodeProcurementCost) * marketPositionModifier * (1 + offHoursPremium + acceleratedPremium) + p3Travel;
    phase3Price = Math.max(subtotal, scaleTier.phase3Min);
  }

  // ─── Recurring Governance ───
  let recurringPrice = 0;
  if (inputs.includeRecurring) {
    const recTravel = calculatePhaseTravel(inputs.distance, inputs.recTravelVisits, inputs.recTravelTeamMembers, inputs.recLocations);
    const tierBaseFee = RECURRING_TIERS[inputs.recurringTier].baseFee;
    const perAssetAnnualRate = getRecurringPerAssetRate(inputs.assets, RECURRING_TIERS[inputs.recurringTier].label);
    const assetComponent = inputs.assets * perAssetAnnualRate;
    const locationComponent = inputs.recLocations * 500;
    const deptComponent = inputs.recDepartments * 150;
    const auditFreqMod = AUDIT_FREQUENCIES[inputs.auditFrequency].multiplier;
    const scaleFactor = scaleTier.recurringScaleFactor;
    const subtotal = ((tierBaseFee + assetComponent + locationComponent + deptComponent) * auditFreqMod * scaleFactor * controlledRiskModifier) * marketPositionModifier + recTravel;
    const minimum = tierBaseFee * 0.65;
    recurringPrice = Math.max(subtotal, minimum);
  }

  const totalInitialInvestment = phase1Price + phase2Price + phase3Price;

  return {
    scaleTier: scaleTier.label,
    phase1Price,
    phase2Price,
    phase3Price,
    recurringPrice,
    totalInitialInvestment,
    controlledRiskModifier,
  };
}

// ─── Styles ─────────────────────────────────────────────────────────────────

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

// ─── Component ──────────────────────────────────────────────────────────────


export default function ProposalCalculator({ onBack }: { onBack: () => void }) {
  const [inputs, setInputs] = useState<CalcInputs>({
    clientName: "",
    industry: 0,
    assets: 1000,
    locations: 3,
    departments: 10,
    geoFootprint: 1,
    distance: 0,
    complexity: 0,
    recordQuality: 2,
    lastInventory: 2,
    pricePosition: 1,
    includePhase1: true,
    assessmentLevel: 1,
    p1Locations: 3,
    p1Departments: 5,
    p1TravelVisits: 3,
    p1TravelTeamMembers: 2,
    includePhase2: true,
    verificationDepth: 1,
    recoveryAnalysis: 1,
    p2Locations: 3,
    p2Departments: 10,
    p2TravelVisits: 8,
    p2TravelTeamMembers: 2,
    includePhase3: true,
    governanceLevel: 0,
    techEnablement: 1,
    trainingDepth: 0,
    p3Locations: 3,
    p3Departments: 10,
    p3TravelVisits: 4,
    p3TravelTeamMembers: 2,
    // Phase 3 Deployment Decisions
    tagDeployment: "lai",
    tagType: 2, // QR Baseline Labels
    barcodeProcurement: "lai",
    barcodeType: 1, // QR Labels
    offHours: false,
    accelerated: false,
    includeRecurring: true,
    recurringTier: 0,
    auditFrequency: 1,
    recLocations: 3,
    recDepartments: 10,
    recTravelVisits: 4,
    recTravelTeamMembers: 2,
    // ROI Mode
    roiMode: "estimated",
    verifiedGhostAssetValue: 0,
    verifiedUnrecordedValue: 0,
    verifiedMaintenanceWaste: 0,
    verifiedInsuranceOptimization: 0,
    verifiedPropertyTaxReduction: 0,
    verifiedProcurementWaste: 0,
  });

  const [showProposal, setShowProposal] = useState(false);
  const proposalRef = useRef<HTMLDivElement>(null);

  const result = calculateProposal(inputs);

  // ─── ROI Estimation Engine ─────────────────────────────────────────────────
  const roiEstimate = useMemo((): PublicEstimatorOutput | null => {
    const estimatorInput: PublicEstimatorInput = {
      industry: INDUSTRY_INDEX_TO_KEY[inputs.industry] || "other",
      facilityCount: inputs.locations,
      estimatedAssetCount: inputs.assets,
      approximateReplacementValue: 0, // Let model estimate from asset count
      annualCapex: 0,
      annualMaintenanceBudget: 0,
      annualInsurancePremiums: 0,
      assetManagementSystem: RECORD_QUALITY_TO_SYSTEM[inputs.recordQuality] || "basic_system",
      lastPhysicalInventoryDate: LAST_INVENTORY_TO_RECENCY[inputs.lastInventory] || "3_5_years",
    };
    return calculatePublicEstimate(estimatorInput);
  }, [inputs.industry, inputs.locations, inputs.assets, inputs.recordQuality, inputs.lastInventory]);

  // Resolve final ROI values based on mode
  const roiValues = useMemo(() => {
    if (inputs.roiMode === "verified") {
      const totalRecovery = inputs.verifiedGhostAssetValue + inputs.verifiedUnrecordedValue;
      const annualSavings = inputs.verifiedMaintenanceWaste + inputs.verifiedInsuranceOptimization + inputs.verifiedPropertyTaxReduction + inputs.verifiedProcurementWaste;
      const totalOpportunity = totalRecovery + annualSavings;
      const fiveYear = totalRecovery + (annualSavings * 5);
      const avgFee = result.totalInitialInvestment;
      const netROI = avgFee > 0 ? Math.round(((totalOpportunity - avgFee) / avgFee) * 100) : 0;
      const payback = annualSavings > 0 ? Math.round((avgFee / (annualSavings / 12)) * 10) / 10 : 12;
      return {
        ghostAssetValue: inputs.verifiedGhostAssetValue,
        unrecordedValue: inputs.verifiedUnrecordedValue,
        maintenanceWaste: inputs.verifiedMaintenanceWaste,
        insuranceOptimization: inputs.verifiedInsuranceOptimization,
        propertyTaxReduction: inputs.verifiedPropertyTaxReduction,
        procurementWaste: inputs.verifiedProcurementWaste,
        totalOpportunity,
        firstYearBenefit: totalOpportunity,
        fiveYearBenefit: fiveYear,
        netROI,
        paybackMonths: payback,
        mode: "verified" as const,
      };
    }
    // Estimated mode
    if (!roiEstimate) return null;
    return {
      ghostAssetValue: roiEstimate.estimatedGhostAssetValue,
      unrecordedValue: roiEstimate.estimatedUnrecordedValue,
      maintenanceWaste: roiEstimate.maintenanceWaste,
      insuranceOptimization: roiEstimate.insuranceOptimization,
      propertyTaxReduction: roiEstimate.propertyTaxReduction,
      procurementWaste: roiEstimate.procurementWaste,
      totalOpportunity: roiEstimate.totalFinancialOpportunity,
      firstYearBenefit: roiEstimate.firstYearBenefit,
      fiveYearBenefit: roiEstimate.fiveYearBenefit,
      netROI: roiEstimate.netROI,
      paybackMonths: roiEstimate.estimatedPaybackPeriodMonths,
      mode: "estimated" as const,
    };
  }, [inputs.roiMode, inputs.verifiedGhostAssetValue, inputs.verifiedUnrecordedValue, inputs.verifiedMaintenanceWaste, inputs.verifiedInsuranceOptimization, inputs.verifiedPropertyTaxReduction, inputs.verifiedProcurementWaste, roiEstimate, result.totalInitialInvestment]);

  const handlePrint = () => {
    if (!proposalRef.current) return;

    // Logo is already embedded as base64 data URL in the img src - no replacement needed
    const htmlContent = proposalRef.current.innerHTML;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>LAI Proposal - ${inputs.clientName}</title>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Source Sans 3', sans-serif; color: #1E293B; padding: 40px; }
              img { max-height: 50px; }
              @media print { body { padding: 20px; } }
            </style>
          </head>
          <body>${htmlContent}</body>
        </html>
      `);
      printWindow.document.close();
      // Base64 images don't need loading - just wait for fonts
      setTimeout(() => printWindow.print(), 800);
    }
  };

  const update = (key: keyof CalcInputs, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  if (showProposal) {
    return (
      <div style={{ padding: "1.5rem" }}>
        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <button onClick={() => setShowProposal(false)} style={{ padding: "0.6rem 1.2rem", background: "#E2E8F0", color: C.text, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
            ← Edit Inputs
          </button>
          <button onClick={handlePrint} style={{ padding: "0.6rem 1.2rem", background: C.gold, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
            🖨️ Print Proposal
          </button>
          <button onClick={onBack} style={{ padding: "0.6rem 1.2rem", background: C.slate, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
            ← Back to Portal
          </button>
        </div>

        {/* Printable Proposal */}
        <div ref={proposalRef} style={{ background: "white", color: "#1E293B", padding: "2.5rem", borderRadius: 8, border: `1px solid ${C.border}`, maxWidth: 850, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: `3px solid ${C.gold}` }}>
            <div>
              <img src={LOGO_BASE64} alt="Legacy Asset Intelligence" style={{ height: 50, marginBottom: "0.5rem" }} />
              <p style={{ fontSize: "0.8rem", color: C.muted }}>Asset Intelligence & Capital Recovery</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: C.slate, marginBottom: "0.25rem" }}>Engagement Proposal</h1>
              <p style={{ fontSize: "0.85rem", color: C.muted }}>Date: {new Date().toLocaleDateString()}</p>
              <p style={{ fontSize: "0.85rem", color: C.muted }}>Valid for 30 days</p>
            </div>
          </div>

          {/* Client Info */}
          <div style={{ marginBottom: "2rem", padding: "1.25rem", background: "#F8FAFC", borderRadius: 8, border: `1px solid ${C.border}` }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem" }}>Prepared For</h3>
            <table style={{ width: "100%", fontSize: "0.9rem" }}>
              <tbody>
                <tr><td style={{ padding: "0.25rem 0", fontWeight: 600, width: "40%" }}>Client:</td><td>{inputs.clientName || "—"}</td></tr>
                <tr><td style={{ padding: "0.25rem 0", fontWeight: 600 }}>Industry:</td><td>{INDUSTRIES[inputs.industry].label}</td></tr>
                <tr><td style={{ padding: "0.25rem 0", fontWeight: 600 }}>Scale Tier:</td><td>{result.scaleTier}</td></tr>
                <tr><td style={{ padding: "0.25rem 0", fontWeight: 600 }}>Physical Assets:</td><td>{inputs.assets.toLocaleString()}</td></tr>
                <tr><td style={{ padding: "0.25rem 0", fontWeight: 600 }}>Locations:</td><td>{inputs.locations.toLocaleString()}</td></tr>
                <tr><td style={{ padding: "0.25rem 0", fontWeight: 600 }}>Departments:</td><td>{inputs.departments.toLocaleString()}</td></tr>
              </tbody>
            </table>
          </div>

          {/* Investment Summary */}
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: C.slate, marginBottom: "1rem" }}>Investment Summary</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: C.slate, color: "white" }}>
                <th style={{ padding: "0.75rem", textAlign: "left", borderRadius: "6px 0 0 0" }}>Phase</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Description</th>
                <th style={{ padding: "0.75rem", textAlign: "center" }}>Included</th>
                <th style={{ padding: "0.75rem", textAlign: "right", borderRadius: "0 6px 0 0" }}>Investment</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "0.75rem", fontWeight: 600 }}>Phase 1</td>
                <td style={{ padding: "0.75rem" }}>Executive Assessment & Opportunity Analysis</td>
                <td style={{ padding: "0.75rem", textAlign: "center" }}>{inputs.includePhase1 ? "✓" : "—"}</td>
                <td style={{ padding: "0.75rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{inputs.includePhase1 ? `$${Math.round(result.phase1Price).toLocaleString()}` : "—"}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "0.75rem", fontWeight: 600 }}>Phase 2</td>
                <td style={{ padding: "0.75rem" }}>Physical Verification & Recovery Analysis</td>
                <td style={{ padding: "0.75rem", textAlign: "center" }}>{inputs.includePhase2 ? "✓" : "—"}</td>
                <td style={{ padding: "0.75rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{inputs.includePhase2 ? `$${Math.round(result.phase2Price).toLocaleString()}` : "—"}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "0.75rem", fontWeight: 600 }}>Phase 3</td>
                <td style={{ padding: "0.75rem" }}>Governance, Technology & Implementation</td>
                <td style={{ padding: "0.75rem", textAlign: "center" }}>{inputs.includePhase3 ? "✓" : "—"}</td>
                <td style={{ padding: "0.75rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{inputs.includePhase3 ? `$${Math.round(result.phase3Price).toLocaleString()}` : "—"}</td>
              </tr>
              <tr style={{ background: "#F8FAFC", fontWeight: 700 }}>
                <td colSpan={3} style={{ padding: "0.75rem" }}>Total Initial Investment</td>
                <td style={{ padding: "0.75rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", color: C.slate }}>${Math.round(result.totalInitialInvestment).toLocaleString()}</td>
              </tr>
              {inputs.includeRecurring && (
                <tr style={{ borderTop: `2px solid ${C.border}` }}>
                  <td style={{ padding: "0.75rem", fontWeight: 600 }}>Recurring</td>
                  <td style={{ padding: "0.75rem" }}>Annual Governance Program ({RECURRING_TIERS[inputs.recurringTier].label})</td>
                  <td style={{ padding: "0.75rem", textAlign: "center" }}>✓</td>
                  <td style={{ padding: "0.75rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>${Math.round(result.recurringPrice).toLocaleString()}/yr</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ROI Projection */}
          {roiValues && roiValues.totalOpportunity > 0 && (
            <div style={{ marginBottom: "2rem", padding: "1.25rem", background: "rgba(13, 148, 136, 0.05)", borderRadius: 8, border: `1px solid rgba(13, 148, 136, 0.2)` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.teal }}>Projected Return on Investment</h3>
                <span style={{ fontSize: "0.7rem", color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", background: "#F0FDF4", padding: "0.25rem 0.5rem", borderRadius: 4 }}>{roiValues.mode === "estimated" ? "Model-Based Estimate" : "Verified Field Data"}</span>
              </div>
              <table style={{ width: "100%", fontSize: "0.9rem" }}>
                <tbody>
                  <tr><td style={{ padding: "0.4rem 0", fontWeight: 600, width: "50%" }}>Ghost Asset Exposure:</td><td style={{ fontFamily: "'JetBrains Mono', monospace" }}>${roiValues.ghostAssetValue.toLocaleString()}</td></tr>
                  <tr><td style={{ padding: "0.4rem 0", fontWeight: 600 }}>Unrecorded Asset Value:</td><td style={{ fontFamily: "'JetBrains Mono', monospace" }}>${roiValues.unrecordedValue.toLocaleString()}</td></tr>
                  <tr><td style={{ padding: "0.4rem 0", fontWeight: 600 }}>Maintenance Waste (Annual):</td><td style={{ fontFamily: "'JetBrains Mono', monospace" }}>${roiValues.maintenanceWaste.toLocaleString()}</td></tr>
                  <tr><td style={{ padding: "0.4rem 0", fontWeight: 600 }}>Insurance Optimization (Annual):</td><td style={{ fontFamily: "'JetBrains Mono', monospace" }}>${roiValues.insuranceOptimization.toLocaleString()}</td></tr>
                  <tr><td style={{ padding: "0.4rem 0", fontWeight: 600 }}>Property Tax Reduction (Annual):</td><td style={{ fontFamily: "'JetBrains Mono', monospace" }}>${roiValues.propertyTaxReduction.toLocaleString()}</td></tr>
                  <tr><td style={{ padding: "0.4rem 0", fontWeight: 600 }}>Procurement Waste (Annual):</td><td style={{ fontFamily: "'JetBrains Mono', monospace" }}>${roiValues.procurementWaste.toLocaleString()}</td></tr>
                  <tr style={{ borderTop: "2px solid rgba(13,148,136,0.3)" }}><td style={{ padding: "0.6rem 0", fontWeight: 700, color: C.teal }}>Total Financial Opportunity:</td><td style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: C.teal }}>${roiValues.totalOpportunity.toLocaleString()}</td></tr>
                  <tr><td style={{ padding: "0.4rem 0", fontWeight: 600 }}>Total Engagement Investment:</td><td style={{ fontFamily: "'JetBrains Mono', monospace" }}>${Math.round(result.totalInitialInvestment).toLocaleString()}</td></tr>
                  <tr><td style={{ padding: "0.4rem 0", fontWeight: 700, color: C.gold }}>Net ROI:</td><td style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: C.gold }}>{roiValues.netROI}%</td></tr>
                  <tr><td style={{ padding: "0.4rem 0", fontWeight: 600 }}>Estimated Payback Period:</td><td style={{ fontFamily: "'JetBrains Mono', monospace" }}>{roiValues.paybackMonths < 1 ? "< 1 month" : `${roiValues.paybackMonths.toFixed(1)} months`}</td></tr>
                </tbody>
              </table>
              {roiValues.mode === "estimated" && (
                <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.75rem", fontStyle: "italic" }}>
                  * Projections based on LAI proprietary estimation model using industry benchmarks, asset management maturity, and inventory recency. Actual values will be confirmed during Phase 2 field verification.
                </p>
              )}
            </div>
          )}

          {/* Phase Descriptions */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem" }}>Scope of Work</h3>
            {inputs.includePhase1 && (
              <div style={{ marginBottom: "0.75rem", paddingLeft: "1rem", borderLeft: `3px solid ${C.gold}` }}>
                <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Phase 1 – Executive Assessment</p>
                <p style={{ fontSize: "0.85rem", color: C.muted }}>Executive interviews, asset accountability maturity review, opportunity modeling, risk findings, and a practical roadmap for next-step engagement.</p>
              </div>
            )}
            {inputs.includePhase2 && (
              <div style={{ marginBottom: "0.75rem", paddingLeft: "1rem", borderLeft: `3px solid ${C.teal}` }}>
                <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Phase 2 – Physical Verification & Recovery Analysis</p>
                <p style={{ fontSize: "0.85rem", color: C.muted }}>Physical asset verification, inventory validation, FAR reconciliation, existence/condition verification, recovery analysis, and executive reporting.</p>
              </div>
            )}
            {inputs.includePhase3 && (
              <div style={{ marginBottom: "0.75rem", paddingLeft: "1rem", borderLeft: `3px solid ${C.slate}` }}>
                <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Phase 3 – Governance, Technology & Implementation</p>
                <p style={{ fontSize: "0.85rem", color: C.muted }}>Governance design, technology advisory, {inputs.tagDeployment === "lai" ? "tag deployment (LAI-managed), " : ""}barcode procurement{inputs.barcodeProcurement === "lai" ? " (LAI-managed)" : " (client-managed)"}, training, implementation support, and ongoing accountability structure.</p>
              </div>
            )}
            {inputs.includeRecurring && (
              <div style={{ marginBottom: "0.75rem", paddingLeft: "1rem", borderLeft: `3px solid #94A3B8` }}>
                <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Recurring Governance – Annual Program</p>
                <p style={{ fontSize: "0.85rem", color: C.muted }}>Recurring audits, executive reporting, scorecards, maturity updates, and ongoing accountability assurance.</p>
              </div>
            )}
          </div>

          {/* Signature Section */}
          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: `2px solid ${C.border}` }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "1.5rem" }}>Authorization & Acknowledgement</h3>
            <p style={{ fontSize: "0.85rem", color: C.muted, marginBottom: "2rem", lineHeight: 1.6 }}>
              By signing below, the authorized representative acknowledges the scope of work, investment amounts, and projected timeline described in this proposal. This document serves as authorization to proceed with the engagement phases selected above.
            </p>
            <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 250 }}>
                <div style={{ borderBottom: `1px solid ${C.text}`, marginBottom: "0.5rem", height: "2rem" }}></div>
                <p style={{ fontSize: "0.8rem", color: C.muted }}>Client Authorized Signature</p>
                <div style={{ borderBottom: `1px solid ${C.text}`, marginBottom: "0.5rem", height: "2rem", marginTop: "1.5rem" }}></div>
                <p style={{ fontSize: "0.8rem", color: C.muted }}>Printed Name & Title</p>
                <div style={{ borderBottom: `1px solid ${C.text}`, marginBottom: "0.5rem", height: "2rem", marginTop: "1.5rem" }}></div>
                <p style={{ fontSize: "0.8rem", color: C.muted }}>Date</p>
              </div>
              <div style={{ flex: 1, minWidth: 250 }}>
                <div style={{ borderBottom: `1px solid ${C.text}`, marginBottom: "0.5rem", height: "2rem" }}></div>
                <p style={{ fontSize: "0.8rem", color: C.muted }}>LAI Authorized Signature</p>
                <div style={{ borderBottom: `1px solid ${C.text}`, marginBottom: "0.5rem", height: "2rem", marginTop: "1.5rem" }}></div>
                <p style={{ fontSize: "0.8rem", color: C.muted }}>Printed Name & Title</p>
                <div style={{ borderBottom: `1px solid ${C.text}`, marginBottom: "0.5rem", height: "2rem", marginTop: "1.5rem" }}></div>
                <p style={{ fontSize: "0.8rem", color: C.muted }}>Date</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
            <p style={{ fontSize: "0.75rem", color: C.muted }}>Legacy Asset Intelligence | Johnson City, TN | legacyassetintelligence.com</p>
            <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.25rem" }}>This proposal is confidential and intended solely for the named recipient.</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Input Form ───────────────────────────────────────────────────────────
  return (
    <div style={{ padding: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.slate }}>Proposal Calculator</h2>
        <button onClick={onBack} style={{ padding: "0.5rem 1rem", background: "#E2E8F0", color: C.text, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>
          ← Back to Portal
        </button>
      </div>

      {/* Client Info */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Client Information</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Client / Prospect Name</label>
            <input style={inputStyle} value={inputs.clientName} onChange={e => update("clientName", e.target.value)} placeholder="Enter client name" />
          </div>
          <div>
            <label style={labelStyle}>Industry</label>
            <select style={selectStyle} value={inputs.industry} onChange={e => update("industry", Number(e.target.value))}>
              {INDUSTRIES.map((ind, i) => <option key={i} value={i}>{ind.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Estimated Trackable Physical Assets</label>
            <NumericInput style={inputStyle} value={inputs.assets} onChange={v => update("assets", v)} currency min={1} validationMessage="Must be at least 1 asset" />
          </div>
          <div>
            <label style={labelStyle}>Number of Locations / Sites</label>
            <NumericInput style={inputStyle} value={inputs.locations} onChange={v => update("locations", v)} min={1} validationMessage="Must be at least 1 location" />
          </div>
          <div>
            <label style={labelStyle}>Number of Departments</label>
            <NumericInput style={inputStyle} value={inputs.departments} onChange={v => update("departments", v)} min={1} validationMessage="Must be at least 1 department" />
          </div>
          <div>
            <label style={labelStyle}>Geographic Footprint</label>
            <select style={selectStyle} value={inputs.geoFootprint} onChange={e => update("geoFootprint", Number(e.target.value))}>
              {GEO_FOOTPRINTS.map((g, i) => <option key={i} value={i}>{g.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Distance from Johnson City, TN</label>
            <select style={selectStyle} value={inputs.distance} onChange={e => update("distance", Number(e.target.value))}>
              {DISTANCE_BANDS.map((d, i) => <option key={i} value={i}>{d.label}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Complexity Level</label>
            <select style={selectStyle} value={inputs.complexity} onChange={e => update("complexity", Number(e.target.value))}>
              {COMPLEXITY_LEVELS.map((c, i) => <option key={i} value={i}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Asset Record Quality</label>
            <select style={selectStyle} value={inputs.recordQuality} onChange={e => update("recordQuality", Number(e.target.value))}>
              {RECORD_QUALITY.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Last Physical Verification</label>
            <select style={selectStyle} value={inputs.lastInventory} onChange={e => update("lastInventory", Number(e.target.value))}>
              {LAST_INVENTORY.map((l, i) => <option key={i} value={i}>{l.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Price Position</label>
            <select style={selectStyle} value={inputs.pricePosition} onChange={e => update("pricePosition", Number(e.target.value))}>
              {PRICE_POSITIONS.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Phase 1 */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Phase 1 – Executive Assessment</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Include Phase 1?</label>
            <select style={selectStyle} value={inputs.includePhase1 ? "1" : "0"} onChange={e => update("includePhase1", e.target.value === "1")}>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
          {inputs.includePhase1 && (
            <>
              <div>
                <label style={labelStyle}>Assessment Level</label>
                <select style={selectStyle} value={inputs.assessmentLevel} onChange={e => update("assessmentLevel", Number(e.target.value))}>
                  {ASSESSMENT_LEVELS.map((a, i) => <option key={i} value={i}>{a.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Locations / Sites</label>
                <NumericInput style={inputStyle} value={inputs.p1Locations} onChange={v => update("p1Locations", v)} min={1} max={100} validationMessage="1-100 locations" />
              </div>
              <div>
                <label style={labelStyle}>Departments</label>
                <NumericInput style={inputStyle} value={inputs.p1Departments} onChange={v => update("p1Departments", v)} min={1} max={100} validationMessage="1-100 departments" />
              </div>
              <div>
                <label style={labelStyle}>Traveling Team Members</label>
                <NumericInput style={inputStyle} value={inputs.p1TravelTeamMembers} onChange={v => update("p1TravelTeamMembers", v)} min={1} max={20} validationMessage="1-20 members" />
              </div>
              <div>
                <label style={labelStyle}>Expected Travel Visits</label>
                <NumericInput style={inputStyle} value={inputs.p1TravelVisits} onChange={v => update("p1TravelVisits", v)} min={0} max={50} validationMessage="0-50 visits" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Phase 2 */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Phase 2 – Physical Verification & Recovery Analysis</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Include Phase 2?</label>
            <select style={selectStyle} value={inputs.includePhase2 ? "1" : "0"} onChange={e => update("includePhase2", e.target.value === "1")}>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
          {inputs.includePhase2 && (
            <>
              <div>
                <label style={labelStyle}>Verification Depth</label>
                <select style={selectStyle} value={inputs.verificationDepth} onChange={e => update("verificationDepth", Number(e.target.value))}>
                  {VERIFICATION_DEPTHS.map((v, i) => <option key={i} value={i}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Recovery Analysis Depth</label>
                <select style={selectStyle} value={inputs.recoveryAnalysis} onChange={e => update("recoveryAnalysis", Number(e.target.value))}>
                  {RECOVERY_ANALYSIS.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Locations / Sites</label>
                <NumericInput style={inputStyle} value={inputs.p2Locations} onChange={v => update("p2Locations", v)} min={1} max={200} validationMessage="1-200 locations" />
              </div>
              <div>
                <label style={labelStyle}>Departments</label>
                <NumericInput style={inputStyle} value={inputs.p2Departments} onChange={v => update("p2Departments", v)} min={1} max={200} validationMessage="1-200 departments" />
              </div>
              <div>
                <label style={labelStyle}>Traveling Team Members</label>
                <NumericInput style={inputStyle} value={inputs.p2TravelTeamMembers} onChange={v => update("p2TravelTeamMembers", v)} min={1} max={20} validationMessage="1-20 members" />
              </div>
              <div>
                <label style={labelStyle}>Expected Travel Visits</label>
                <NumericInput style={inputStyle} value={inputs.p2TravelVisits} onChange={v => update("p2TravelVisits", v)} min={0} max={100} validationMessage="0-100 visits" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Phase 3 */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Phase 3 – Governance, Technology & Implementation</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Include Phase 3?</label>
            <select style={selectStyle} value={inputs.includePhase3 ? "1" : "0"} onChange={e => update("includePhase3", e.target.value === "1")}>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
          {inputs.includePhase3 && (
            <>
              <div>
                <label style={labelStyle}>Governance Level</label>
                <select style={selectStyle} value={inputs.governanceLevel} onChange={e => update("governanceLevel", Number(e.target.value))}>
                  {GOVERNANCE_LEVELS.map((g, i) => <option key={i} value={i}>{g.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{...labelStyle, color: C.teal}}>Technology Advisory (Mandatory)</label>
                <select style={selectStyle} value={inputs.techEnablement} onChange={e => update("techEnablement", Number(e.target.value))}>
                  {TECH_ENABLEMENT.map((t, i) => <option key={i} value={i}>{t.label} (${t.addOn.toLocaleString()})</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Training Depth</label>
                <select style={selectStyle} value={inputs.trainingDepth} onChange={e => update("trainingDepth", Number(e.target.value))}>
                  {TRAINING_DEPTHS.map((t, i) => <option key={i} value={i}>{t.label}{t.addOn > 0 ? ` ($${t.addOn.toLocaleString()})` : " ($0)"}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tag/Barcode Deployment</label>
                <select style={selectStyle} value={inputs.tagDeployment} onChange={e => update("tagDeployment", e.target.value)}>
                  <option value="lai">LAI Deploys Tags</option>
                  <option value="client">Client Deploys Tags</option>
                </select>
              </div>
              {inputs.tagDeployment === "lai" && (
                <div>
                  <label style={labelStyle}>Tag Type (LAI Labor)</label>
                  <select style={selectStyle} value={inputs.tagType} onChange={e => update("tagType", Number(e.target.value))}>
                    {BASELINE_ID_METHODS.map((b, i) => <option key={i} value={i}>{b.label} (${b.perAsset}/asset)</option>)}
                  </select>
                </div>
              )}
              <div>
                <label style={labelStyle}>Barcode Procurement</label>
                <select style={selectStyle} value={inputs.barcodeProcurement} onChange={e => update("barcodeProcurement", e.target.value)}>
                  <option value="lai">LAI Purchases Barcodes</option>
                  <option value="client">Client Purchases Barcodes</option>
                </select>
              </div>
              {inputs.barcodeProcurement === "lai" && (
                <div>
                  <label style={labelStyle}>Barcode Type (LAI Procurement)</label>
                  <select style={selectStyle} value={inputs.barcodeType} onChange={e => update("barcodeType", Number(e.target.value))}>
                    {BARCODE_PROCUREMENT_COSTS.map((b, i) => <option key={i} value={i}>{b.label} (${b.perAsset}/asset)</option>)}
                  </select>
                </div>
              )}
              <div>
                <label style={labelStyle}>Locations / Sites</label>
                <NumericInput style={inputStyle} value={inputs.p3Locations} onChange={v => update("p3Locations", v)} min={1} max={200} validationMessage="1-200 locations" />
              </div>
              <div>
                <label style={labelStyle}>Departments</label>
                <NumericInput style={inputStyle} value={inputs.p3Departments} onChange={v => update("p3Departments", v)} min={1} max={200} validationMessage="1-200 departments" />
              </div>
              <div>
                <label style={labelStyle}>Traveling Team Members</label>
                <NumericInput style={inputStyle} value={inputs.p3TravelTeamMembers} onChange={v => update("p3TravelTeamMembers", v)} min={1} max={20} validationMessage="1-20 members" />
              </div>
              <div>
                <label style={labelStyle}>Expected Travel Visits</label>
                <NumericInput style={inputStyle} value={inputs.p3TravelVisits} onChange={v => update("p3TravelVisits", v)} min={0} max={50} validationMessage="0-50 visits" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Premiums */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Premiums & Adjustments</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Off-Hours / Weekend Work</label>
            <select style={selectStyle} value={inputs.offHours ? "1" : "0"} onChange={e => update("offHours", e.target.value === "1")}>
              <option value="0">No</option>
              <option value="1">Yes (+10%)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Accelerated Timeline</label>
            <select style={selectStyle} value={inputs.accelerated ? "1" : "0"} onChange={e => update("accelerated", e.target.value === "1")}>
              <option value="0">No</option>
              <option value="1">Yes (+15%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recurring Governance */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Recurring Governance</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Include Recurring Governance?</label>
            <select style={selectStyle} value={inputs.includeRecurring ? "1" : "0"} onChange={e => update("includeRecurring", e.target.value === "1")}>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
          {inputs.includeRecurring && (
            <>
              <div>
                <label style={labelStyle}>Recurring Tier</label>
                <select style={selectStyle} value={inputs.recurringTier} onChange={e => update("recurringTier", Number(e.target.value))}>
                  {RECURRING_TIERS.map((t, i) => <option key={i} value={i}>{t.label} (${t.baseFee.toLocaleString()} base)</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Audit Frequency</label>
                <select style={selectStyle} value={inputs.auditFrequency} onChange={e => update("auditFrequency", Number(e.target.value))}>
                  {AUDIT_FREQUENCIES.map((a, i) => <option key={i} value={i}>{a.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Locations / Sites</label>
                <NumericInput style={inputStyle} value={inputs.recLocations} onChange={v => update("recLocations", v)} min={1} max={200} validationMessage="1-200 locations" />
              </div>
              <div>
                <label style={labelStyle}>Departments</label>
                <NumericInput style={inputStyle} value={inputs.recDepartments} onChange={v => update("recDepartments", v)} min={1} max={200} validationMessage="1-200 departments" />
              </div>
              <div>
                <label style={labelStyle}>Traveling Team Members</label>
                <NumericInput style={inputStyle} value={inputs.recTravelTeamMembers} onChange={v => update("recTravelTeamMembers", v)} min={1} max={20} validationMessage="1-20 members" />
              </div>
              <div>
                <label style={labelStyle}>Expected Travel Visits</label>
                <NumericInput style={inputStyle} value={inputs.recTravelVisits} onChange={v => update("recTravelVisits", v)} min={0} max={50} validationMessage="0-50 visits" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ROI Projection Mode */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Financial Recovery & ROI Projection</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <label style={labelStyle}>Data Mode</label>
            <select style={selectStyle} value={inputs.roiMode} onChange={e => update("roiMode", e.target.value)}>
              <option value="estimated">Phase 1 — Estimated (Model-Based)</option>
              <option value="verified">Phase 2 — Verified (Field Data)</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "0.25rem" }}>
            <span style={{ fontSize: "0.8rem", color: inputs.roiMode === "estimated" ? C.teal : C.gold, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif", background: inputs.roiMode === "estimated" ? "rgba(13,148,136,0.1)" : "rgba(201,168,76,0.1)", padding: "0.4rem 0.75rem", borderRadius: 4 }}>
              {inputs.roiMode === "estimated" ? "⚡ Using LAI Proprietary Estimation Model" : "✓ Using Verified Field Data"}
            </span>
          </div>
        </div>

        {inputs.roiMode === "verified" && (
          <div style={{ padding: "1.25rem", background: "rgba(201,168,76,0.05)", border: `1px solid rgba(201,168,76,0.2)`, borderRadius: 8, marginBottom: "1rem" }}>
            <p style={{ fontSize: "0.85rem", color: C.muted, marginBottom: "1rem", fontStyle: "italic" }}>Enter verified values from Phase 2 field discovery. These override the estimation model.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Ghost Asset Value (Verified)</label>
                <NumericInput style={inputStyle} value={inputs.verifiedGhostAssetValue} onChange={v => update("verifiedGhostAssetValue", v)} currency showDollarSign />
              </div>
              <div>
                <label style={labelStyle}>Unrecorded Asset Value (Verified)</label>
                <NumericInput style={inputStyle} value={inputs.verifiedUnrecordedValue} onChange={v => update("verifiedUnrecordedValue", v)} currency showDollarSign />
              </div>
              <div>
                <label style={labelStyle}>Maintenance Waste (Annual)</label>
                <NumericInput style={inputStyle} value={inputs.verifiedMaintenanceWaste} onChange={v => update("verifiedMaintenanceWaste", v)} currency showDollarSign />
              </div>
              <div>
                <label style={labelStyle}>Insurance Optimization (Annual)</label>
                <NumericInput style={inputStyle} value={inputs.verifiedInsuranceOptimization} onChange={v => update("verifiedInsuranceOptimization", v)} currency showDollarSign />
              </div>
              <div>
                <label style={labelStyle}>Property Tax Reduction (Annual)</label>
                <NumericInput style={inputStyle} value={inputs.verifiedPropertyTaxReduction} onChange={v => update("verifiedPropertyTaxReduction", v)} currency showDollarSign />
              </div>
              <div>
                <label style={labelStyle}>Procurement Waste (Annual)</label>
                <NumericInput style={inputStyle} value={inputs.verifiedProcurementWaste} onChange={v => update("verifiedProcurementWaste", v)} currency showDollarSign />
              </div>
            </div>
          </div>
        )}

        {/* ROI Summary Preview */}
        {roiValues && (
          <div style={{ padding: "1.25rem", background: "rgba(13,148,136,0.05)", border: `1px solid rgba(13,148,136,0.2)`, borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <h4 style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700, color: C.teal, fontSize: "0.9rem" }}>ROI Projection Summary</h4>
              <span style={{ fontSize: "0.7rem", color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>{roiValues.mode === "estimated" ? "Model-Based Estimate" : "Verified Data"}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
              <div><span style={{ fontSize: "0.75rem", color: C.muted }}>Total Opportunity</span><br/><span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: C.teal }}>${roiValues.totalOpportunity.toLocaleString()}</span></div>
              <div><span style={{ fontSize: "0.75rem", color: C.muted }}>First-Year Benefit</span><br/><span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>${roiValues.firstYearBenefit.toLocaleString()}</span></div>
              <div><span style={{ fontSize: "0.75rem", color: C.muted }}>5-Year Benefit</span><br/><span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>${roiValues.fiveYearBenefit.toLocaleString()}</span></div>
              <div><span style={{ fontSize: "0.75rem", color: C.muted }}>Net ROI</span><br/><span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: C.gold }}>{roiValues.netROI}%</span></div>
              <div><span style={{ fontSize: "0.75rem", color: C.muted }}>Payback Period</span><br/><span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{roiValues.paybackMonths < 1 ? "< 1 mo" : `${roiValues.paybackMonths.toFixed(1)} mo`}</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Live Preview */}
      <div style={{ padding: "1.5rem", background: "#F0FDF4", borderRadius: 8, border: "1px solid #BBF7D0", marginBottom: "1.5rem" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.teal, marginBottom: "0.75rem" }}>Live Pricing Preview</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
          {inputs.includePhase1 && <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Phase 1:</span><br/><span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>${Math.round(result.phase1Price).toLocaleString()}</span></div>}
          {inputs.includePhase2 && <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Phase 2:</span><br/><span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>${Math.round(result.phase2Price).toLocaleString()}</span></div>}
          {inputs.includePhase3 && <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Phase 3:</span><br/><span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>${Math.round(result.phase3Price).toLocaleString()}</span></div>}
          {inputs.includeRecurring && <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Recurring/yr:</span><br/><span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>${Math.round(result.recurringPrice).toLocaleString()}</span></div>}
          <div><span style={{ fontSize: "0.8rem", color: C.muted }}>Total Initial:</span><br/><span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: C.slate, fontSize: "1.1rem" }}>${Math.round(result.totalInitialInvestment).toLocaleString()}</span></div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={() => setShowProposal(true)}
        style={{
          width: "100%",
          padding: "1rem",
          background: C.gold,
          color: "white",
          border: "none",
          borderRadius: 8,
          fontFamily: "'Source Sans 3', sans-serif",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        Generate Professional Proposal
      </button>
    </div>
  );
}
