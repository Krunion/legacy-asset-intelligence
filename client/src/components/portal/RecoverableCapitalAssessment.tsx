/**
 * LAI Preliminary Capital Opportunity Assessment
 * Formerly "Recoverable Capital Assessment" — renamed per methodology correction.
 * Identifies potential financial opportunities before LAI's Phase 1 validation.
 */

import { useState, useRef } from "react";
import { LOGO_BASE64 } from "./logoBase64";
import NumericInput from "./NumericInput";
import { Info } from "lucide-react";

const C = {
  slate: "#1E3A5F",
  teal: "#0D9488",
  gold: "#D4AF37",
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
  display: "flex",
  alignItems: "center",
  gap: "0.3rem",
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

type CalcMode = "actual" | "benchmark";

interface FormData {
  clientName: string;
  contactName: string;
  industry: string;
  locations: string;
  totalAssetCount: string;
  totalGrossAssetValue: string;
  totalNetBookValue: string;
  annualPurchasingSpend: string;
  annualInsurancePremiums: string;
  annualMaintenanceExpense: string;
  annualPropertyTaxExpense: string;
  lastAuditYears: string;
  recordAccuracy: string;
  ghostAssetEstimate: string;
  duplicatePurchaseRate: string;
  insuranceOverpayPct: string;
  maintenanceWastePct: string;
  propertyTaxOverpayPct: string;
  insuranceMode: CalcMode;
  maintenanceMode: CalcMode;
  propertyTaxMode: CalcMode;
  benchmarkInsuranceRate: string;
  benchmarkMaintenanceRate: string;
  benchmarkPropertyTaxRate: string;
  projectionYears: string;
}

function fmtCurrency(value: number): string {
  return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtCurrencyAbbrev(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return fmtCurrency(value);
}

function Tooltip({ text }: { text: string }) {
  return (
    <span title={text} style={{ cursor: "help", display: "inline-flex" }}>
      <Info size={14} color="#64748B" />
    </span>
  );
}

const DISCLAIMER = "This preliminary assessment estimates potential accounting exposure, avoided costs, and operating savings using client-provided information and, where identified, benchmark assumptions. Results are not guaranteed cash recovery and require validation through LAI's Phase 1 Executive Assessment.";

export default function RecoverableCapitalAssessment({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<FormData>({
    clientName: "",
    contactName: "",
    industry: "",
    locations: "",
    totalAssetCount: "",
    totalGrossAssetValue: "",
    totalNetBookValue: "",
    annualPurchasingSpend: "",
    annualInsurancePremiums: "",
    annualMaintenanceExpense: "",
    annualPropertyTaxExpense: "",
    lastAuditYears: "3",
    recordAccuracy: "moderate",
    ghostAssetEstimate: "15",
    duplicatePurchaseRate: "5",
    insuranceOverpayPct: "10",
    maintenanceWastePct: "8",
    propertyTaxOverpayPct: "12",
    insuranceMode: "actual",
    maintenanceMode: "actual",
    propertyTaxMode: "actual",
    benchmarkInsuranceRate: "2.00",
    benchmarkMaintenanceRate: "5.00",
    benchmarkPropertyTaxRate: "1.50",
    projectionYears: "5",
  });

  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const update = (key: keyof FormData, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  // ─── Parse inputs ───────────────────────────────────────────────────────────
  const grossAssetValue = parseFloat(data.totalGrossAssetValue) || 0;
  const netBookValue = parseFloat(data.totalNetBookValue) || 0;
  const assetCount = Math.round(parseFloat(data.totalAssetCount) || 0);
  const purchasingSpend = parseFloat(data.annualPurchasingSpend) || 0;
  const actualInsurance = parseFloat(data.annualInsurancePremiums) || 0;
  const actualMaintenance = parseFloat(data.annualMaintenanceExpense) || 0;
  const actualPropertyTax = parseFloat(data.annualPropertyTaxExpense) || 0;

  const ghostPct = (parseFloat(data.ghostAssetEstimate) || 0) / 100;
  const dupPct = (parseFloat(data.duplicatePurchaseRate) || 0) / 100;
  const insOverpayPct = (parseFloat(data.insuranceOverpayPct) || 0) / 100;
  const maintWastePct = (parseFloat(data.maintenanceWastePct) || 0) / 100;
  const taxOverpayPct = (parseFloat(data.propertyTaxOverpayPct) || 0) / 100;

  const benchInsRate = (parseFloat(data.benchmarkInsuranceRate) || 0) / 100;
  const benchMaintRate = (parseFloat(data.benchmarkMaintenanceRate) || 0) / 100;
  const benchTaxRate = (parseFloat(data.benchmarkPropertyTaxRate) || 0) / 100;

  const projYears = parseInt(data.projectionYears) || 5;

  // ─── Calculations ──────────────────────────────────────────────────────────
  // Ghost-Asset Accounting Exposure
  const hasNBV = netBookValue > 0;
  const ghostAssetExposure = hasNBV ? netBookValue * ghostPct : null;
  const estimatedGhostRecords = assetCount > 0 ? Math.round(assetCount * ghostPct) : null;

  // Duplicate Purchases
  const hasPurchasingSpend = purchasingSpend > 0;
  const avoidedDuplicatePurchases = hasPurchasingSpend ? purchasingSpend * dupPct : null;

  // Insurance Savings
  let insuranceBase: number;
  let insuranceBasis: "actual" | "benchmark";
  if (data.insuranceMode === "actual" && actualInsurance > 0) {
    insuranceBase = actualInsurance;
    insuranceBasis = "actual";
  } else if (data.insuranceMode === "benchmark" && grossAssetValue > 0) {
    insuranceBase = grossAssetValue * benchInsRate;
    insuranceBasis = "benchmark";
  } else if (data.insuranceMode === "actual" && actualInsurance === 0) {
    insuranceBase = 0;
    insuranceBasis = "actual";
  } else {
    insuranceBase = 0;
    insuranceBasis = "benchmark";
  }
  const insuranceSavings = insuranceBase > 0 ? insuranceBase * insOverpayPct : null;

  // Maintenance Savings
  let maintenanceBase: number;
  let maintenanceBasis: "actual" | "benchmark";
  if (data.maintenanceMode === "actual" && actualMaintenance > 0) {
    maintenanceBase = actualMaintenance;
    maintenanceBasis = "actual";
  } else if (data.maintenanceMode === "benchmark" && grossAssetValue > 0) {
    maintenanceBase = grossAssetValue * benchMaintRate;
    maintenanceBasis = "benchmark";
  } else if (data.maintenanceMode === "actual" && actualMaintenance === 0) {
    maintenanceBase = 0;
    maintenanceBasis = "actual";
  } else {
    maintenanceBase = 0;
    maintenanceBasis = "benchmark";
  }
  const maintenanceSavings = maintenanceBase > 0 ? maintenanceBase * maintWastePct : null;

  // Property Tax Savings
  let propertyTaxBase: number;
  let propertyTaxBasis: "actual" | "benchmark";
  if (data.propertyTaxMode === "actual" && actualPropertyTax > 0) {
    propertyTaxBase = actualPropertyTax;
    propertyTaxBasis = "actual";
  } else if (data.propertyTaxMode === "benchmark" && grossAssetValue > 0) {
    propertyTaxBase = grossAssetValue * benchTaxRate;
    propertyTaxBasis = "benchmark";
  } else if (data.propertyTaxMode === "actual" && actualPropertyTax === 0) {
    propertyTaxBase = 0;
    propertyTaxBasis = "actual";
  } else {
    propertyTaxBase = 0;
    propertyTaxBasis = "benchmark";
  }
  const propertyTaxSavings = propertyTaxBase > 0 ? propertyTaxBase * taxOverpayPct : null;

  // Total Annual Recurring Operating Savings
  const totalAnnualRecurringSavings = (insuranceSavings || 0) + (maintenanceSavings || 0) + (propertyTaxSavings || 0);

  // Total Estimated Annual Financial Opportunity (avoided costs + recurring savings, NOT ghost exposure)
  const totalAnnualOpportunity = (avoidedDuplicatePurchases || 0) + totalAnnualRecurringSavings;

  // Projection-Period Undiscounted Financial Opportunity
  const projectionOpportunity = totalAnnualOpportunity * projYears;

  // Confidence Level
  const getConfidence = (): string => {
    const modes = [data.insuranceMode, data.maintenanceMode, data.propertyTaxMode];
    const actualCount = modes.filter(m => m === "actual").length;
    // Check if actual data fields have values
    const actualDataProvided = [
      data.insuranceMode === "actual" && actualInsurance > 0,
      data.maintenanceMode === "actual" && actualMaintenance > 0,
      data.propertyTaxMode === "actual" && actualPropertyTax > 0,
    ];
    const providedCount = actualDataProvided.filter(Boolean).length;

    if (actualCount === 3 && providedCount === 3) return "Higher Confidence";
    if (actualCount === 0) return "Preliminary Benchmark Estimate";
    return "Moderate Confidence";
  };

  const confidence = getConfidence();

  // ─── "Use Results in Corporate Finance Calculator" handler ──────────────────
  const handleTransferToFinanceCalc = () => {
    // Store values in sessionStorage for the Corporate Finance Calculator to pick up
    const transferData = {
      ghostAssetExposure: ghostAssetExposure || 0,
      totalAnnualOpportunity,
      projectionYears: projYears,
      insuranceSavings: insuranceSavings || 0,
      maintenanceSavings: maintenanceSavings || 0,
      propertyTaxSavings: propertyTaxSavings || 0,
      avoidedDuplicatePurchases: avoidedDuplicatePurchases || 0,
    };
    sessionStorage.setItem("lai_assessment_transfer", JSON.stringify(transferData));
    alert("Assessment results saved. Open the Corporate Finance Calculator to use these values.\n\nNote: Ghost-asset accounting exposure is transferred as an informational field only — it is not treated as realized cash recovery.");
  };

  // ─── Print handler ─────────────────────────────────────────────────────────
  const handlePrint = () => {
    if (!resultsRef.current) return;
    const htmlContent = resultsRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>LAI Preliminary Capital Opportunity Assessment - ${data.clientName}</title>
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
      setTimeout(() => printWindow.print(), 800);
    }
  };

  // ─── Can generate? ─────────────────────────────────────────────────────────
  const canGenerate = grossAssetValue > 0 || netBookValue > 0;

  // ═══════════════════════════════════════════════════════════════════════════════
  // RESULTS VIEW
  // ═══════════════════════════════════════════════════════════════════════════════
  if (showResults) {
    return (
      <div style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <button onClick={() => setShowResults(false)} style={{ padding: "0.6rem 1.2rem", background: "#E2E8F0", color: C.text, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>← Edit Inputs</button>
          <button onClick={handlePrint} style={{ padding: "0.6rem 1.2rem", background: C.gold, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>🖨️ Print Report</button>
          <button onClick={handleTransferToFinanceCalc} style={{ padding: "0.6rem 1.2rem", background: C.teal, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>📊 Use Results in Corporate Finance Calculator</button>
          <button onClick={onBack} style={{ padding: "0.6rem 1.2rem", background: C.slate, color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>← Back to Portal</button>
        </div>

        <div ref={resultsRef} style={{ background: "white", color: "#1E293B", padding: "2.5rem", borderRadius: 8, border: `1px solid ${C.border}`, maxWidth: 900, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: `3px solid ${C.gold}` }}>
            <div>
              <img src={LOGO_BASE64} alt="Legacy Asset Intelligence" style={{ height: 50, marginBottom: "0.5rem" }} />
              <p style={{ fontSize: "0.8rem", color: C.muted }}>Executive Asset Intelligence</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: C.slate }}>Preliminary Capital Opportunity Assessment</h1>
              <p style={{ fontSize: "0.8rem", color: C.muted, fontStyle: "italic" }}>Preliminary Asset Exposure and Savings Analysis</p>
              <p style={{ fontSize: "0.85rem", color: C.muted, marginTop: "0.25rem" }}>Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* ─── Three Headline Cards ─── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
            {/* Card 1: Ghost-Asset Accounting Exposure */}
            <div style={{ padding: "1.25rem", background: "rgba(30,58,95,0.04)", borderRadius: 8, border: `2px solid ${C.slate}`, textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, color: C.muted, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Potential Ghost-Asset Accounting Exposure</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.6rem", fontWeight: 700, color: C.slate }}>
                {ghostAssetExposure !== null ? fmtCurrencyAbbrev(ghostAssetExposure) : "Not Estimated"}
              </p>
              {ghostAssetExposure !== null && (
                <p style={{ fontSize: "0.7rem", color: C.muted, marginTop: "0.25rem" }}>{fmtCurrency(ghostAssetExposure)}</p>
              )}
              <p style={{ fontSize: "0.7rem", color: "#B45309", marginTop: "0.4rem", fontStyle: "italic" }}>Accounting exposure—not guaranteed cash recovery.</p>
            </div>

            {/* Card 2: Total Annual Financial Opportunity */}
            <div style={{ padding: "1.25rem", background: "rgba(13,148,136,0.04)", borderRadius: 8, border: `2px solid ${C.teal}`, textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, color: C.muted, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Estimated Annual Financial Opportunity</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.6rem", fontWeight: 700, color: C.teal }}>
                {totalAnnualOpportunity > 0 ? fmtCurrencyAbbrev(totalAnnualOpportunity) : "Not Estimated"}
              </p>
              {totalAnnualOpportunity > 0 && (
                <p style={{ fontSize: "0.7rem", color: C.muted, marginTop: "0.25rem" }}>{fmtCurrency(totalAnnualOpportunity)}</p>
              )}
              <p style={{ fontSize: "0.7rem", color: C.teal, marginTop: "0.4rem", fontStyle: "italic" }}>Estimated annual avoided costs and operating savings.</p>
            </div>

            {/* Card 3: Projection-Period Opportunity */}
            <div style={{ padding: "1.25rem", background: "rgba(212,175,55,0.04)", borderRadius: 8, border: `2px solid ${C.gold}`, textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, color: C.muted, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{projYears}-Year Undiscounted Financial Opportunity</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.6rem", fontWeight: 700, color: "#92400E" }}>
                {projectionOpportunity > 0 ? fmtCurrencyAbbrev(projectionOpportunity) : "Not Estimated"}
              </p>
              {projectionOpportunity > 0 && (
                <p style={{ fontSize: "0.7rem", color: C.muted, marginTop: "0.25rem" }}>{fmtCurrency(projectionOpportunity)}</p>
              )}
              <p style={{ fontSize: "0.7rem", color: C.muted, marginTop: "0.4rem", fontStyle: "italic" }}>Undiscounted. Does not include ghost-asset exposure.</p>
            </div>
          </div>

          {/* Confidence Indicator */}
          <div style={{ marginBottom: "1.5rem", padding: "0.75rem 1rem", background: confidence === "Higher Confidence" ? "#ECFDF5" : confidence === "Moderate Confidence" ? "#FEF3C7" : "#FEE2E2", borderRadius: 6, border: `1px solid ${confidence === "Higher Confidence" ? "#6EE7B7" : confidence === "Moderate Confidence" ? "#FDE68A" : "#FECACA"}` }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              Estimate Confidence: <span style={{ color: confidence === "Higher Confidence" ? "#059669" : confidence === "Moderate Confidence" ? "#D97706" : "#DC2626" }}>{confidence}</span>
            </p>
            <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.2rem" }}>
              {confidence === "Higher Confidence" && "All financial bases use actual client data."}
              {confidence === "Moderate Confidence" && "Mixture of actual and benchmark data."}
              {confidence === "Preliminary Benchmark Estimate" && "Most or all bases use benchmark estimates."}
            </p>
          </div>

          {/* ─── Client Profile ─── */}
          <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#F8FAFC", borderRadius: 8 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem" }}>Client Profile</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.3rem 2rem", fontSize: "0.85rem" }}>
              <p><strong>Client:</strong> {data.clientName || "—"}</p>
              <p><strong>Contact:</strong> {data.contactName || "—"}</p>
              <p><strong>Industry:</strong> {data.industry || "—"}</p>
              <p><strong>Locations:</strong> {data.locations || "—"}</p>
              <p><strong>Asset Count:</strong> {assetCount > 0 ? assetCount.toLocaleString() : "—"}</p>
              <p><strong>Gross Asset Value:</strong> {grossAssetValue > 0 ? fmtCurrency(grossAssetValue) : "—"}</p>
              <p><strong>Net Book Value:</strong> {netBookValue > 0 ? fmtCurrency(netBookValue) : "—"}</p>
              <p><strong>Years Since Last Audit:</strong> {data.lastAuditYears} years</p>
              <p><strong>Record Accuracy:</strong> {data.recordAccuracy}</p>
            </div>
          </div>

          {/* ─── Potential Accounting Exposure ─── */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem", paddingBottom: "0.4rem", borderBottom: `2px solid ${C.gold}` }}>Potential Accounting Exposure</h3>
            {ghostAssetExposure !== null ? (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "0.5rem" }}>Estimated Ghost Asset Records</td>
                    <td style={{ padding: "0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{estimatedGhostRecords !== null ? estimatedGhostRecords.toLocaleString() : "—"}</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "0.5rem" }}>Ghost Asset Estimate Percentage</td>
                    <td style={{ padding: "0.5rem", textAlign: "right" }}>{data.ghostAssetEstimate}%</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "0.5rem" }}>Total Net Book Value Used</td>
                    <td style={{ padding: "0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmtCurrency(netBookValue)}</td>
                  </tr>
                  <tr style={{ background: "#F8FAFC" }}>
                    <td style={{ padding: "0.5rem", fontWeight: 700 }}>Potential Ghost-Asset Accounting Exposure</td>
                    <td style={{ padding: "0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: C.slate }}>{fmtCurrency(ghostAssetExposure)}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p style={{ fontSize: "0.85rem", color: "#B45309", fontStyle: "italic", padding: "0.75rem", background: "#FFFBEB", borderRadius: 6 }}>Unable to estimate without total net book value.</p>
            )}
          </div>

          {/* ─── Annual Avoided Costs ─── */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem", paddingBottom: "0.4rem", borderBottom: `2px solid ${C.gold}` }}>Estimated Annual Avoided Costs</h3>
            {avoidedDuplicatePurchases !== null ? (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "0.5rem" }}>Annual Purchasing Spend</td>
                    <td style={{ padding: "0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmtCurrency(purchasingSpend)}</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "0.5rem" }}>Duplicate Purchase Rate</td>
                    <td style={{ padding: "0.5rem", textAlign: "right" }}>{data.duplicatePurchaseRate}%</td>
                  </tr>
                  <tr style={{ background: "#F8FAFC" }}>
                    <td style={{ padding: "0.5rem", fontWeight: 700 }}>Estimated Annual Avoided Duplicate Purchases</td>
                    <td style={{ padding: "0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: C.teal }}>{fmtCurrency(avoidedDuplicatePurchases)}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p style={{ fontSize: "0.85rem", color: C.muted, fontStyle: "italic", padding: "0.75rem", background: "#F8FAFC", borderRadius: 6 }}>Not Estimated — annual purchasing spend not provided.</p>
            )}
          </div>

          {/* ─── Annual Recurring Operating Savings ─── */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem", paddingBottom: "0.4rem", borderBottom: `2px solid ${C.gold}` }}>Estimated Annual Recurring Operating Savings</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: C.slate, color: "white" }}>
                  <th style={{ padding: "0.6rem", textAlign: "left" }}>Category</th>
                  <th style={{ padding: "0.6rem", textAlign: "center" }}>Expense Base</th>
                  <th style={{ padding: "0.6rem", textAlign: "center" }}>Data Basis</th>
                  <th style={{ padding: "0.6rem", textAlign: "center" }}>Applied Rate</th>
                  <th style={{ padding: "0.6rem", textAlign: "right" }}>Estimated Savings</th>
                </tr>
              </thead>
              <tbody>
                {/* Insurance */}
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "0.5rem", fontWeight: 600 }}>Insurance Premium Savings</td>
                  <td style={{ padding: "0.5rem", textAlign: "center", fontFamily: "'JetBrains Mono', monospace" }}>{insuranceBase > 0 ? fmtCurrency(insuranceBase) : "—"}</td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>
                    <span style={{ fontSize: "0.75rem", padding: "0.15rem 0.4rem", borderRadius: 4, background: insuranceBasis === "actual" ? "#ECFDF5" : "#FEF3C7", color: insuranceBasis === "actual" ? "#059669" : "#D97706" }}>
                      {insuranceBasis === "actual" ? "Actual" : "Benchmark"}
                    </span>
                  </td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>{data.insuranceOverpayPct}%</td>
                  <td style={{ padding: "0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{insuranceSavings !== null ? fmtCurrency(insuranceSavings) : "Not Estimated"}</td>
                </tr>
                {/* Maintenance */}
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "0.5rem", fontWeight: 600 }}>Maintenance Savings</td>
                  <td style={{ padding: "0.5rem", textAlign: "center", fontFamily: "'JetBrains Mono', monospace" }}>{maintenanceBase > 0 ? fmtCurrency(maintenanceBase) : "—"}</td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>
                    <span style={{ fontSize: "0.75rem", padding: "0.15rem 0.4rem", borderRadius: 4, background: maintenanceBasis === "actual" ? "#ECFDF5" : "#FEF3C7", color: maintenanceBasis === "actual" ? "#059669" : "#D97706" }}>
                      {maintenanceBasis === "actual" ? "Actual" : "Benchmark"}
                    </span>
                  </td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>{data.maintenanceWastePct}%</td>
                  <td style={{ padding: "0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{maintenanceSavings !== null ? fmtCurrency(maintenanceSavings) : "Not Estimated"}</td>
                </tr>
                {/* Property Tax */}
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "0.5rem", fontWeight: 600 }}>Property-Tax Savings</td>
                  <td style={{ padding: "0.5rem", textAlign: "center", fontFamily: "'JetBrains Mono', monospace" }}>{propertyTaxBase > 0 ? fmtCurrency(propertyTaxBase) : "—"}</td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>
                    <span style={{ fontSize: "0.75rem", padding: "0.15rem 0.4rem", borderRadius: 4, background: propertyTaxBasis === "actual" ? "#ECFDF5" : "#FEF3C7", color: propertyTaxBasis === "actual" ? "#059669" : "#D97706" }}>
                      {propertyTaxBasis === "actual" ? "Actual" : "Benchmark"}
                    </span>
                  </td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>{data.propertyTaxOverpayPct}%</td>
                  <td style={{ padding: "0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{propertyTaxSavings !== null ? fmtCurrency(propertyTaxSavings) : "Not Estimated"}</td>
                </tr>
                {/* Total */}
                <tr style={{ background: "#F8FAFC" }}>
                  <td style={{ padding: "0.5rem", fontWeight: 700 }} colSpan={4}>Total Annual Recurring Operating Savings</td>
                  <td style={{ padding: "0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: C.teal }}>{fmtCurrency(totalAnnualRecurringSavings)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ─── Financial Summary ─── */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.slate, marginBottom: "0.75rem", paddingBottom: "0.4rem", borderBottom: `2px solid ${C.gold}` }}>Financial Summary</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "0.5rem" }}>Potential Ghost-Asset Accounting Exposure</td>
                  <td style={{ padding: "0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{ghostAssetExposure !== null ? fmtCurrency(ghostAssetExposure) : "Not Estimated"}</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "0.5rem" }}>Estimated Annual Avoided Duplicate Purchases</td>
                  <td style={{ padding: "0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{avoidedDuplicatePurchases !== null ? fmtCurrency(avoidedDuplicatePurchases) : "Not Estimated"}</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "0.5rem" }}>Estimated Annual Recurring Operating Savings</td>
                  <td style={{ padding: "0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmtCurrency(totalAnnualRecurringSavings)}</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${C.border}`, background: "rgba(13,148,136,0.04)" }}>
                  <td style={{ padding: "0.5rem", fontWeight: 700 }}>Total Estimated Annual Financial Opportunity</td>
                  <td style={{ padding: "0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: C.teal }}>{fmtCurrency(totalAnnualOpportunity)}</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "0.5rem" }}>Projection Period</td>
                  <td style={{ padding: "0.5rem", textAlign: "right" }}>{projYears} years</td>
                </tr>
                <tr style={{ background: "rgba(212,175,55,0.06)" }}>
                  <td style={{ padding: "0.5rem", fontWeight: 700 }}>Projection-Period Undiscounted Financial Opportunity</td>
                  <td style={{ padding: "0.5rem", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#92400E" }}>{fmtCurrency(projectionOpportunity)}</td>
                </tr>
              </tbody>
            </table>
            <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.5rem", fontStyle: "italic" }}>
              Estimate Confidence: {confidence}
            </p>
          </div>

          {/* ─── Disclaimer ─── */}
          <div style={{ padding: "1rem", background: "#FFFBEB", borderRadius: 8, border: "1px solid #FDE68A", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.8rem", color: "#92400E", lineHeight: 1.6 }}>{DISCLAIMER}</p>
          </div>

          {/* ─── Recommended Next Steps ─── */}
          <div style={{ padding: "1.25rem", background: "rgba(13, 148, 136, 0.05)", borderRadius: 8, border: `1px solid rgba(13, 148, 136, 0.2)` }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.teal, marginBottom: "0.5rem" }}>Recommended Next Steps</h3>
            <ol style={{ fontSize: "0.9rem", paddingLeft: "1.2rem", lineHeight: 1.8 }}>
              <li>Schedule an LAI Phase 1 Executive Assessment to validate these estimates.</li>
              <li>Confirm asset-register value, annual purchasing, insurance, maintenance, and property-tax data.</li>
              <li>Identify priority recovery and savings areas based on organizational goals.</li>
              <li>Develop a phased validation, reconciliation, and governance roadmap.</li>
            </ol>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
            <p style={{ fontSize: "0.75rem", color: C.muted }}>Legacy Asset Intelligence | Johnson City, TN | legacyassetintelligence.com</p>
            <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.25rem" }}>{DISCLAIMER}</p>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // INPUT FORM VIEW
  // ═══════════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ padding: "1.5rem", maxWidth: 950, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.slate }}>Preliminary Capital Opportunity Assessment</h2>
          <p style={{ fontSize: "0.85rem", color: C.muted, fontStyle: "italic" }}>Preliminary Asset Exposure and Savings Analysis</p>
        </div>
        <button onClick={onBack} style={{ padding: "0.5rem 1rem", background: "#E2E8F0", color: C.text, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>← Back to Portal</button>
      </div>

      {/* Disclaimer */}
      <div style={{ marginBottom: "1.5rem", padding: "0.75rem 1rem", background: "#FFFBEB", borderRadius: 6, border: "1px solid #FDE68A" }}>
        <p style={{ fontSize: "0.8rem", color: "#92400E", lineHeight: 1.5 }}>{DISCLAIMER}</p>
      </div>

      {/* Client Info */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Client Information</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div><label style={labelStyle}>Client / Organization Name</label><input style={inputStyle} value={data.clientName} onChange={e => update("clientName", e.target.value)} placeholder="Enter client name" /></div>
          <div><label style={labelStyle}>Contact Name</label><input style={inputStyle} value={data.contactName} onChange={e => update("contactName", e.target.value)} placeholder="Primary contact" /></div>
          <div><label style={labelStyle}>Industry</label>
            <select style={selectStyle} value={data.industry} onChange={e => update("industry", e.target.value)}>
              <option value="">— Select Industry —</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Healthcare">Healthcare</option>
              <option value="IT / Data Centers">IT / Data Centers</option>
              <option value="Government">Government</option>
              <option value="Education">Education</option>
              <option value="Energy / Utilities">Energy / Utilities</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div><label style={labelStyle}>Number of Locations</label><input style={inputStyle} type="number" min={0} value={data.locations} onChange={e => update("locations", e.target.value)} placeholder="e.g., 5" /></div>
        </div>
      </div>

      {/* Asset Information */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Asset Information</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div><label style={labelStyle}>Total Asset Count</label><input style={inputStyle} type="number" min={0} value={data.totalAssetCount} onChange={e => update("totalAssetCount", e.target.value)} placeholder="e.g., 2500" /></div>
          <div><label style={labelStyle}>Years Since Last Comprehensive Audit</label>
            <select style={selectStyle} value={data.lastAuditYears} onChange={e => update("lastAuditYears", e.target.value)}>
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="5">5+ years</option>
              <option value="10">Never conducted</option>
            </select>
          </div>
          <div><label style={labelStyle}>Record Accuracy Level</label>
            <select style={selectStyle} value={data.recordAccuracy} onChange={e => update("recordAccuracy", e.target.value)}>
              <option value="poor">Poor (less than 50% accurate)</option>
              <option value="low">Low (50-70% accurate)</option>
              <option value="moderate">Moderate (70-85% accurate)</option>
              <option value="good">Good (85-95% accurate)</option>
              <option value="excellent">Excellent (95%+ accurate)</option>
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
          <div>
            <label style={labelStyle}>Total Gross Asset Value ($) <Tooltip text="The total original cost or current replacement value of all assets on the register." /></label>
            <NumericInput style={inputStyle} value={data.totalGrossAssetValue} onChange={v => update("totalGrossAssetValue", String(v))} stringMode placeholder="e.g., 10,000,000" currency showDollarSign />
          </div>
          <div>
            <label style={labelStyle}>Total Net Book Value ($) <Tooltip text="Recorded asset cost less accumulated depreciation. Used for ghost-asset exposure calculation." /></label>
            <NumericInput style={inputStyle} value={data.totalNetBookValue} onChange={v => update("totalNetBookValue", String(v))} stringMode placeholder="e.g., 6,000,000" currency showDollarSign />
          </div>
          <div>
            <label style={labelStyle}>Annual Asset & Equipment Purchasing Spend ($) <Tooltip text="Total annual capital expenditure on new asset and equipment purchases." /></label>
            <NumericInput style={inputStyle} value={data.annualPurchasingSpend} onChange={v => update("annualPurchasingSpend", String(v))} stringMode placeholder="e.g., 2,000,000" currency showDollarSign />
          </div>
        </div>
      </div>

      {/* Operating Expense Section with Mode Toggles */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Annual Operating Expenses</h3>
        <p style={{ fontSize: "0.85rem", color: C.muted, marginBottom: "1rem" }}>For each category, select whether to use actual client data (recommended) or estimated benchmark rates.</p>

        {/* Insurance */}
        <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#F8FAFC", borderRadius: 8, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Insurance Premiums <Tooltip text="Annual insurance premiums attributable to insured assets." /></label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => update("insuranceMode", "actual")} style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem", fontWeight: 600, border: "none", borderRadius: 4, cursor: "pointer", background: data.insuranceMode === "actual" ? C.teal : "#E2E8F0", color: data.insuranceMode === "actual" ? "white" : C.text }}>Actual Client Data</button>
              <button onClick={() => update("insuranceMode", "benchmark")} style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem", fontWeight: 600, border: "none", borderRadius: 4, cursor: "pointer", background: data.insuranceMode === "benchmark" ? "#D97706" : "#E2E8F0", color: data.insuranceMode === "benchmark" ? "white" : C.text }}>Estimated Benchmark</button>
            </div>
          </div>
          {data.insuranceMode === "actual" ? (
            <NumericInput style={inputStyle} value={data.annualInsurancePremiums} onChange={v => update("annualInsurancePremiums", String(v))} stringMode placeholder="e.g., 200,000" currency showDollarSign />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", color: C.muted }}>Estimated at</span>
              <NumericInput style={{ ...inputStyle, width: "80px" }} value={data.benchmarkInsuranceRate} onChange={v => update("benchmarkInsuranceRate", String(v))} stringMode />
              <span style={{ fontSize: "0.85rem", color: C.muted }}>% of gross asset value</span>
              {grossAssetValue > 0 && <span style={{ fontSize: "0.85rem", fontFamily: "'JetBrains Mono', monospace", color: C.teal }}>= {fmtCurrency(grossAssetValue * benchInsRate)}</span>}
            </div>
          )}
        </div>

        {/* Maintenance */}
        <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#F8FAFC", borderRadius: 8, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Asset Maintenance Expense <Tooltip text="Annual expenditure on asset maintenance, repairs, and upkeep." /></label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => update("maintenanceMode", "actual")} style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem", fontWeight: 600, border: "none", borderRadius: 4, cursor: "pointer", background: data.maintenanceMode === "actual" ? C.teal : "#E2E8F0", color: data.maintenanceMode === "actual" ? "white" : C.text }}>Actual Client Data</button>
              <button onClick={() => update("maintenanceMode", "benchmark")} style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem", fontWeight: 600, border: "none", borderRadius: 4, cursor: "pointer", background: data.maintenanceMode === "benchmark" ? "#D97706" : "#E2E8F0", color: data.maintenanceMode === "benchmark" ? "white" : C.text }}>Estimated Benchmark</button>
            </div>
          </div>
          {data.maintenanceMode === "actual" ? (
            <NumericInput style={inputStyle} value={data.annualMaintenanceExpense} onChange={v => update("annualMaintenanceExpense", String(v))} stringMode placeholder="e.g., 500,000" currency showDollarSign />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", color: C.muted }}>Estimated at</span>
              <NumericInput style={{ ...inputStyle, width: "80px" }} value={data.benchmarkMaintenanceRate} onChange={v => update("benchmarkMaintenanceRate", String(v))} stringMode />
              <span style={{ fontSize: "0.85rem", color: C.muted }}>% of gross asset value</span>
              {grossAssetValue > 0 && <span style={{ fontSize: "0.85rem", fontFamily: "'JetBrains Mono', monospace", color: C.teal }}>= {fmtCurrency(grossAssetValue * benchMaintRate)}</span>}
            </div>
          )}
        </div>

        {/* Property Tax */}
        <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#F8FAFC", borderRadius: 8, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Personal Property Tax Expense <Tooltip text="Annual personal property tax expense attributable to assets." /></label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => update("propertyTaxMode", "actual")} style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem", fontWeight: 600, border: "none", borderRadius: 4, cursor: "pointer", background: data.propertyTaxMode === "actual" ? C.teal : "#E2E8F0", color: data.propertyTaxMode === "actual" ? "white" : C.text }}>Actual Client Data</button>
              <button onClick={() => update("propertyTaxMode", "benchmark")} style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem", fontWeight: 600, border: "none", borderRadius: 4, cursor: "pointer", background: data.propertyTaxMode === "benchmark" ? "#D97706" : "#E2E8F0", color: data.propertyTaxMode === "benchmark" ? "white" : C.text }}>Estimated Benchmark</button>
            </div>
          </div>
          {data.propertyTaxMode === "actual" ? (
            <NumericInput style={inputStyle} value={data.annualPropertyTaxExpense} onChange={v => update("annualPropertyTaxExpense", String(v))} stringMode placeholder="e.g., 150,000" currency showDollarSign />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", color: C.muted }}>Estimated at</span>
              <NumericInput style={{ ...inputStyle, width: "80px" }} value={data.benchmarkPropertyTaxRate} onChange={v => update("benchmarkPropertyTaxRate", String(v))} stringMode />
              <span style={{ fontSize: "0.85rem", color: C.muted }}>% of gross asset value</span>
              {grossAssetValue > 0 && <span style={{ fontSize: "0.85rem", fontFamily: "'JetBrains Mono', monospace", color: C.teal }}>= {fmtCurrency(grossAssetValue * benchTaxRate)}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Estimate Rates */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Estimate Rates (Adjust as needed)</h3>
        <p style={{ fontSize: "0.85rem", color: C.muted, marginBottom: "1rem" }}>These percentages represent the estimated portion affected in each category. Adjust based on your assessment of the client's situation.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div><label style={labelStyle}>Ghost Asset Estimate (%) <Tooltip text="Percentage of total assets estimated to be ghost assets (no longer in use or missing)." /></label><NumericInput style={inputStyle} value={data.ghostAssetEstimate} onChange={v => update("ghostAssetEstimate", String(v))} stringMode defaultValue="15" min={0} max={100} validationMessage="Must be 0-100%" /></div>
          <div><label style={labelStyle}>Duplicate Purchase Rate (%) <Tooltip text="Percentage of annual purchasing spend estimated to be duplicate or unnecessary purchases." /></label><NumericInput style={inputStyle} value={data.duplicatePurchaseRate} onChange={v => update("duplicatePurchaseRate", String(v))} stringMode defaultValue="5" min={0} max={100} validationMessage="Must be 0-100%" /></div>
          <div><label style={labelStyle}>Insurance Overpayment (%) <Tooltip text="Percentage of insurance premiums estimated to be overpaid due to ghost assets on the register." /></label><NumericInput style={inputStyle} value={data.insuranceOverpayPct} onChange={v => update("insuranceOverpayPct", String(v))} stringMode defaultValue="10" min={0} max={100} validationMessage="Must be 0-100%" /></div>
          <div><label style={labelStyle}>Maintenance Waste (%) <Tooltip text="Percentage of maintenance expense estimated to be wasted on assets no longer in service." /></label><NumericInput style={inputStyle} value={data.maintenanceWastePct} onChange={v => update("maintenanceWastePct", String(v))} stringMode defaultValue="8" min={0} max={100} validationMessage="Must be 0-100%" /></div>
          <div><label style={labelStyle}>Property Tax Overpayment (%) <Tooltip text="Percentage of property tax expense estimated to be overpaid due to inaccurate asset records." /></label><NumericInput style={inputStyle} value={data.propertyTaxOverpayPct} onChange={v => update("propertyTaxOverpayPct", String(v))} stringMode defaultValue="12" min={0} max={100} validationMessage="Must be 0-100%" /></div>
        </div>
      </div>

      {/* Projection Period */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={sectionTitleStyle}>Projection Period</h3>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          {["1", "3", "5"].map(yr => (
            <button
              key={yr}
              onClick={() => update("projectionYears", yr)}
              style={{
                padding: "0.6rem 1.5rem",
                border: `2px solid ${data.projectionYears === yr ? C.teal : C.border}`,
                borderRadius: 6,
                background: data.projectionYears === yr ? "rgba(13,148,136,0.08)" : "white",
                color: data.projectionYears === yr ? C.teal : C.text,
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              {yr} {parseInt(yr) === 1 ? "Year" : "Years"}
            </button>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      {canGenerate && (
        <div style={{ marginBottom: "2rem", padding: "1.25rem", background: "rgba(13, 148, 136, 0.05)", borderRadius: 8, border: `1px solid rgba(13, 148, 136, 0.2)` }}>
          <p style={{ fontSize: "0.85rem", fontWeight: 600, color: C.teal, marginBottom: "0.75rem" }}>Live Estimate Preview</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div>
              <p style={{ fontSize: "0.75rem", color: C.muted }}>Ghost-Asset Exposure</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 700, color: C.slate }}>{ghostAssetExposure !== null ? fmtCurrencyAbbrev(ghostAssetExposure) : "—"}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", color: C.muted }}>Annual Opportunity</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 700, color: C.teal }}>{totalAnnualOpportunity > 0 ? fmtCurrencyAbbrev(totalAnnualOpportunity) : "—"}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", color: C.muted }}>{projYears}-Year Opportunity</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 700, color: "#92400E" }}>{projectionOpportunity > 0 ? fmtCurrencyAbbrev(projectionOpportunity) : "—"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={() => setShowResults(true)}
        disabled={!canGenerate}
        style={{
          width: "100%",
          padding: "1rem",
          background: !canGenerate ? "#CBD5E1" : C.gold,
          color: "white",
          border: "none",
          borderRadius: 8,
          fontFamily: "'Source Sans 3', sans-serif",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: !canGenerate ? "not-allowed" : "pointer",
        }}
      >
        Generate Preliminary Capital Opportunity Assessment
      </button>
    </div>
  );
}
