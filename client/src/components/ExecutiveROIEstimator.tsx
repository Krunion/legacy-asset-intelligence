/**
 * Executive ROI Estimator — Public-facing calculator
 * Only asks information executives would reasonably know before engaging LAI.
 * Uses LAI proprietary estimation models to predict financial recovery opportunity.
 */

import { useState } from "react";
import {
  calculatePublicEstimate,
  INDUSTRY_BENCHMARKS,
  ASSET_MGMT_SYSTEMS,
  INVENTORY_RECENCY,
  type PublicEstimatorInput,
  type PublicEstimatorOutput,
} from "@/lib/laiEstimationModels";
import NumericInput from "@/components/portal/NumericInput";
import { trpc } from "@/lib/trpc";

// ─── Colors (matching site dark theme) ──────────────────────────────────────────
const C = {
  bg: "#0B0F13",
  navy: "#111820",
  slate: "#1A2230",
  gold: "#C9A84C",
  goldMuted: "rgba(201,168,76,0.12)",
  goldBorder: "rgba(201,168,76,0.25)",
  silver: "#C8D0D8",
  text: "#F5F7FA",
  textMuted: "#B0BAC5",
  teal: "#0D9488",
  tealLight: "#14B8A6",
  border: "rgba(168,178,189,0.12)",
  borderLight: "rgba(168,178,189,0.25)",
  glass: "rgba(26, 34, 48, 0.75)",
};

// ─── Styles ─────────────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "'Source Sans 3', sans-serif",
  fontWeight: 600,
  fontSize: "0.9rem",
  color: C.text,
  marginBottom: "0.5rem",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 1rem",
  border: `1px solid ${C.borderLight}`,
  borderRadius: 6,
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: "0.95rem",
  background: C.slate,
  color: C.text,
  cursor: "pointer",
  appearance: "none" as const,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 1rem",
  border: `1px solid ${C.borderLight}`,
  borderRadius: 6,
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.95rem",
  background: C.slate,
  color: C.text,
};

const btnPrimary: React.CSSProperties = {
  width: "100%",
  padding: "1rem",
  background: C.gold,
  color: "#0B0F13",
  border: "none",
  borderRadius: 6,
  fontFamily: "'Source Sans 3', sans-serif",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
  transition: "all 0.16s cubic-bezier(0.23,1,0.32,1)",
  letterSpacing: "0.02em",
};

const btnSecondary: React.CSSProperties = {
  width: "100%",
  padding: "0.8rem",
  background: "transparent",
  color: C.gold,
  border: `1px solid ${C.goldBorder}`,
  borderRadius: 6,
  fontFamily: "'Source Sans 3', sans-serif",
  fontWeight: 600,
  fontSize: "0.95rem",
  cursor: "pointer",
  transition: "all 0.16s cubic-bezier(0.23,1,0.32,1)",
};

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

export default function ExecutiveROIEstimator() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [results, setResults] = useState<PublicEstimatorOutput | null>(null);

  const [input, setInput] = useState<PublicEstimatorInput>({
    industry: "manufacturing",
    facilityCount: 3,
    estimatedAssetCount: 2000,
    approximateReplacementValue: 0,
    annualCapex: 0,
    annualMaintenanceBudget: 0,
    annualInsurancePremiums: 0,
    assetManagementSystem: "spreadsheets",
    lastPhysicalInventoryDate: "3_5_years",
  });

  const notifyMutation = trpc.leads.notifyCalculatorUsage.useMutation({
    onSuccess: () => {
      setSubmitSuccess(true);
      setSubmitError(null);
      setTimeout(() => setSubmitSuccess(false), 4000);
    },
    onError: (error) => {
      setSubmitError(error.message || "Failed to submit. Please try again.");
    },
  });

  const handleCalculate = () => {
    const result = calculatePublicEstimate(input);
    setResults(result);
    setStep(3);
  };

  // ─── Step 1: Organization Profile ─────────────────────────────────────────────
  const renderStep1 = () => (
    <div style={{ maxWidth: 640 }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: C.text, marginBottom: "0.5rem" }}>
        Step 1: Organization Profile
      </h3>
      <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.9rem", marginBottom: "2rem" }}>
        Tell us about your organization. We only ask what you already know.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>
        <div>
          <label style={labelStyle}>Industry</label>
          <select
            value={input.industry}
            onChange={(e) => setInput({ ...input, industry: e.target.value })}
            style={selectStyle}
          >
            {Object.entries(INDUSTRY_BENCHMARKS).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Number of Facilities</label>
          <NumericInput
            value={input.facilityCount}
            onChange={(v) => setInput({ ...input, facilityCount: Number(v) || 1 })}
            defaultValue={1}
            min={1}
            max={200}
            validationMessage="Must be 1-200"
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>
        <div>
          <label style={labelStyle}>Estimated Number of Fixed Assets</label>
          <NumericInput
            value={input.estimatedAssetCount}
            onChange={(v) => setInput({ ...input, estimatedAssetCount: Number(v) || 0 })}
            defaultValue={1000}
            currency
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Approximate Total Replacement Value</label>
          <NumericInput
            value={input.approximateReplacementValue}
            onChange={(v) => setInput({ ...input, approximateReplacementValue: Number(v) || 0 })}
            currency
            showDollarSign
            style={inputStyle}
            placeholder="Optional — we can estimate"
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>
        <div>
          <label style={labelStyle}>Current Asset Management System</label>
          <select
            value={input.assetManagementSystem}
            onChange={(e) => setInput({ ...input, assetManagementSystem: e.target.value })}
            style={selectStyle}
          >
            {Object.entries(ASSET_MGMT_SYSTEMS).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Last Physical Inventory</label>
          <select
            value={input.lastPhysicalInventoryDate}
            onChange={(e) => setInput({ ...input, lastPhysicalInventoryDate: e.target.value })}
            style={selectStyle}
          >
            {Object.entries(INVENTORY_RECENCY).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        style={btnPrimary}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(0.98)"; e.currentTarget.style.opacity = "0.9"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.opacity = "1"; }}
      >
        Next: Financial Information →
      </button>
    </div>
  );

  // ─── Step 2: Financial Information ────────────────────────────────────────────
  const renderStep2 = () => (
    <div style={{ maxWidth: 640 }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: C.text, marginBottom: "0.5rem" }}>
        Step 2: Financial Information
      </h3>
      <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.9rem", marginBottom: "2rem" }}>
        Provide what you know — leave fields at $0 if unavailable. Our models will estimate from industry benchmarks.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>
        <div>
          <label style={labelStyle}>Annual Capital Expenditures</label>
          <NumericInput
            value={input.annualCapex}
            onChange={(v) => setInput({ ...input, annualCapex: Number(v) || 0 })}
            currency
            showDollarSign
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Annual Maintenance Budget</label>
          <NumericInput
            value={input.annualMaintenanceBudget}
            onChange={(v) => setInput({ ...input, annualMaintenanceBudget: Number(v) || 0 })}
            currency
            showDollarSign
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <label style={labelStyle}>Annual Insurance Premiums <span style={{ color: C.textMuted, fontWeight: 400 }}>(if known)</span></label>
        <NumericInput
          value={input.annualInsurancePremiums}
          onChange={(v) => setInput({ ...input, annualInsurancePremiums: Number(v) || 0 })}
          currency
          showDollarSign
          style={inputStyle}
          placeholder="$0 if unknown — we'll estimate"
        />
      </div>

      <div style={{ padding: "1.25rem", background: C.goldMuted, border: `1px solid ${C.goldBorder}`, borderRadius: 8, marginBottom: "2rem" }}>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.gold, fontWeight: 600, marginBottom: "0.25rem" }}>
          Why we ask this
        </p>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.6 }}>
          Your maintenance, insurance, and capital expenditure data allows our models to predict specific savings in each category.
          If you leave a field at $0, we estimate from industry benchmarks for {INDUSTRY_BENCHMARKS[input.industry]?.label || "your industry"}.
        </p>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={() => setStep(1)}
          style={btnSecondary}
          onMouseEnter={(e) => { e.currentTarget.style.background = C.goldMuted; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          ← Back
        </button>
        <button
          onClick={handleCalculate}
          style={btnPrimary}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(0.98)"; e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.opacity = "1"; }}
        >
          Calculate My ROI →
        </button>
      </div>
    </div>
  );

  // ─── Step 3: Results ──────────────────────────────────────────────────────────
  const renderResults = () => {
    if (!results) return null;

    return (
      <div style={{ maxWidth: 900 }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: C.text, marginBottom: "0.5rem" }}>
          Your Executive ROI Estimate
        </h3>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.9rem", marginBottom: "2rem" }}>
          Based on {input.estimatedAssetCount.toLocaleString()} assets across {input.facilityCount} facilit{input.facilityCount === 1 ? "y" : "ies"} in {INDUSTRY_BENCHMARKS[input.industry]?.label || "your industry"}
        </p>

        {/* Key Metrics Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <MetricCard label="Total Financial Opportunity" value={formatCurrency(results.totalFinancialOpportunity)} accent={C.gold} highlight />
          <MetricCard label="Recoverable Capital" value={formatCurrency(results.recoverableCapital)} accent={C.teal} />
          <MetricCard label="Annual Savings Identified" value={formatCurrency(results.maintenanceWaste + results.insuranceOptimization + results.propertyTaxReduction + results.procurementWaste)} accent={C.tealLight} />
          <MetricCard label="Net ROI" value={`${results.netROI}%`} accent={C.gold} />
        </div>

        {/* Detailed Breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
          {/* Recovery Categories */}
          <div style={{ padding: "1.5rem", background: C.slate, border: `1px solid ${C.borderLight}`, borderRadius: 8 }}>
            <h4 style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700, color: C.text, marginBottom: "1.25rem", fontSize: "0.95rem" }}>
              Predicted Asset Exposure
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <BreakdownRow label="Ghost Assets (estimated)" value={formatCurrency(results.estimatedGhostAssetValue)} count={`~${results.estimatedGhostAssets.toLocaleString()} assets`} color={C.gold} />
              <BreakdownRow label="Unrecorded Assets (estimated)" value={formatCurrency(results.estimatedUnrecordedValue)} count={`~${results.estimatedUnrecordedAssets.toLocaleString()} assets`} color={C.teal} />
              <BreakdownRow label="Maintenance Waste" value={formatCurrency(results.maintenanceWaste)} count="annual" color="#C8D0D8" />
              <BreakdownRow label="Insurance Optimization" value={formatCurrency(results.insuranceOptimization)} count="annual" color="#C8D0D8" />
              <BreakdownRow label="Property Tax Reduction" value={formatCurrency(results.propertyTaxReduction)} count="annual" color="#C8D0D8" />
              <BreakdownRow label="Procurement Waste" value={formatCurrency(results.procurementWaste)} count="annual" color="#C8D0D8" />
            </div>
          </div>

          {/* Engagement Recommendation */}
          <div style={{ padding: "1.5rem", background: C.slate, border: `1px solid ${C.borderLight}`, borderRadius: 8 }}>
            <h4 style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700, color: C.text, marginBottom: "1.25rem", fontSize: "0.95rem" }}>
              Engagement Recommendation
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <p style={{ fontSize: "0.8rem", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>Recommended Level</p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: C.gold }}>{results.recommendedEngagementLevel}</p>
              </div>
              <div>
                <p style={{ fontSize: "0.8rem", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>Projected Investment</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 600, color: C.text }}>
                  {formatCurrency(results.projectedConsultingInvestment[0])} – {formatCurrency(results.projectedConsultingInvestment[1])}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "0.8rem", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>First-Year Financial Benefit</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 600, color: C.teal }}>{formatCurrency(results.firstYearBenefit)}</p>
              </div>
              <div>
                <p style={{ fontSize: "0.8rem", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>Five-Year Financial Benefit</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 600, color: C.teal }}>{formatCurrency(results.fiveYearBenefit)}</p>
              </div>
              <div>
                <p style={{ fontSize: "0.8rem", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>Estimated Payback Period</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 600, color: C.gold }}>
                  {results.estimatedPaybackPeriodMonths < 1 ? "< 1 month" : `${results.estimatedPaybackPeriodMonths.toFixed(1)} months`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Capture */}
        <div style={{ padding: "2rem", background: C.goldMuted, border: `1px solid ${C.goldBorder}`, borderRadius: 8, marginBottom: "2rem" }}>
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: C.gold, marginBottom: "0.5rem" }}>
            Request a Detailed Executive Assessment
          </h4>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.9rem", marginBottom: "1rem", lineHeight: 1.6 }}>
            Enter your email to receive a personalized executive briefing with detailed methodology, verified case studies, and next steps for your organization.
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <input
              type="email"
              placeholder="your@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                padding: "0.8rem 1rem",
                border: `1px solid ${C.borderLight}`,
                borderRadius: 6,
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.95rem",
                background: C.slate,
                color: C.text,
              }}
            />
            <button
              onClick={async () => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email) { setSubmitError("Please enter your email address"); return; }
                if (!emailRegex.test(email)) { setSubmitError("Please enter a valid email address"); return; }
                try {
                  await notifyMutation.mutateAsync({
                    email,
                    industry: input.industry,
                    assetCount: input.estimatedAssetCount,
                    locations: input.facilityCount,
                    departments: 1,
                    estimatedRecovery: results.totalFinancialOpportunity,
                    message: `Executive ROI Estimator — Replacement Value: $${input.approximateReplacementValue.toLocaleString()}, CapEx: $${input.annualCapex.toLocaleString()}, Maintenance: $${input.annualMaintenanceBudget.toLocaleString()}, Insurance: $${input.annualInsurancePremiums.toLocaleString()}, System: ${input.assetManagementSystem}, Last Inventory: ${input.lastPhysicalInventoryDate}, Recommended: ${results.recommendedEngagementLevel}, Net ROI: ${results.netROI}%`,
                  });
                } catch (err) {
                  console.error("Lead submission failed:", err);
                }
              }}
              disabled={notifyMutation.isPending}
              style={{
                ...btnPrimary,
                width: "auto",
                padding: "0.8rem 1.5rem",
                opacity: notifyMutation.isPending ? 0.7 : 1,
                cursor: notifyMutation.isPending ? "not-allowed" : "pointer",
              }}
            >
              {notifyMutation.isPending ? "Submitting..." : "Request Briefing"}
            </button>
          </div>
          {submitError && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, color: "#EF4444", fontSize: "0.85rem" }}>
              {submitError}
            </div>
          )}
          {submitSuccess && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "rgba(13,148,136,0.1)", border: "1px solid rgba(13,148,136,0.3)", borderRadius: 6, color: C.teal, fontSize: "0.85rem" }}>
              ✓ Request submitted — our team will contact you within 24 hours.
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "1rem 1.5rem", background: C.navy, border: `1px solid ${C.border}`, borderRadius: 6, marginBottom: "1.5rem" }}>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: C.textMuted, lineHeight: 1.6, fontStyle: "italic" }}>
            These estimates are generated by LAI's proprietary modeling algorithms based on industry benchmarks and organizational profile data.
            Actual recovery values are determined during Phase 2 physical verification and financial reconciliation.
            Results are not guarantees and should be considered directional estimates for planning purposes.
          </p>
        </div>

        {/* Back / Contact CTA */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => { setStep(1); setResults(null); }}
            style={btnSecondary}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.goldMuted; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            ← Recalculate
          </button>
          <button
            onClick={() => {
              const subject = `Executive ROI Estimate - ${INDUSTRY_BENCHMARKS[input.industry]?.label || input.industry}`;
              const body = `I completed your Executive ROI Estimator and would like to discuss my results.\n\nTotal Financial Opportunity: ${formatCurrency(results.totalFinancialOpportunity)}\nRecommended Engagement: ${results.recommendedEngagementLevel}\nNet ROI: ${results.netROI}%`;
              window.location.href = `mailto:info@legacyassetintelligence.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }}
            style={{ ...btnPrimary, flex: 1 }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(0.98)"; e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.opacity = "1"; }}
          >
            Contact LAI to Discuss Results
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "2rem", background: C.glass, borderRadius: 12, border: `1px solid ${C.borderLight}`, backdropFilter: "blur(10px)" }}>
      {/* Progress indicator */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: step >= s ? C.gold : C.borderLight,
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderResults()}
    </div>
  );
}

// ─── Helper Components ──────────────────────────────────────────────────────────
function MetricCard({ label, value, accent, highlight }: { label: string; value: string; accent: string; highlight?: boolean }) {
  return (
    <div style={{
      padding: "1.25rem",
      background: highlight ? C.goldMuted : C.slate,
      border: `1px solid ${highlight ? C.goldBorder : C.borderLight}`,
      borderRadius: 8,
      textAlign: "center",
    }}>
      <div style={{ fontSize: "0.75rem", color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
        {label}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.6rem", fontWeight: 700, color: accent }}>
        {value}
      </div>
    </div>
  );
}

function BreakdownRow({ label, value, count, color }: { label: string; value: string; count: string; color: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
          <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: C.text }}>{label}</span>
        </div>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: C.textMuted, marginLeft: "1.25rem" }}>{count}</span>
      </div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.95rem", fontWeight: 600, color: C.text }}>{value}</span>
    </div>
  );
}
