/**
 * ROI Calculator Component for Legacy Asset Intelligence
 * Interactive 4-step wizard to estimate recoverable capital
 * Features: Industry-specific asset values, maturity-based recovery rates, asset verification practices, email capture, PDF download
 */

import { useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { generatePDF, type CalculatorResult } from "@/lib/pdfGenerator";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

// ─── Industry Data ────────────────────────────────────────────────────────────
const INDUSTRY_DATA: Record<string, { multiplier: number; avgAssetValue: number }> = {
  healthcare: { multiplier: 1.1, avgAssetValue: 2500 },
  manufacturing: { multiplier: 1.05, avgAssetValue: 3200 },
  distribution: { multiplier: 1.0, avgAssetValue: 1800 },
  utilities: { multiplier: 1.15, avgAssetValue: 4500 },
  education: { multiplier: 1.05, avgAssetValue: 1200 },
  construction: { multiplier: 1.05, avgAssetValue: 2800 },
  logistics: { multiplier: 1.05, avgAssetValue: 2100 },
  government: { multiplier: 1.1, avgAssetValue: 2000 },
  other: { multiplier: 1.0, avgAssetValue: 1500 },
};

// ─── Maturity Levels ──────────────────────────────────────────────────────────
const MATURITY_LEVELS = [
  { id: 1, label: "Level 1: No Formal Process", description: "No centralized records, weak controls", lowRate: 0.15, highRate: 0.3 },
  { id: 2, label: "Level 2: Spreadsheet Management", description: "Spreadsheet-driven tracking, inconsistent updates", lowRate: 0.1, highRate: 0.2 },
  { id: 3, label: "Level 3: Basic Asset System", description: "Asset system exists but controls are inconsistent", lowRate: 0.05, highRate: 0.15 },
  { id: 4, label: "Level 4: Good Controls", description: "Documented controls with periodic reconciliation", lowRate: 0.02, highRate: 0.1 },
  { id: 5, label: "Level 5: Best-in-Class", description: "Strong controls, technology-enabled visibility", lowRate: 0.0, highRate: 0.02 },
];

// ─── Asset Verification Practices ─────────────────────────────────────────────
const VERIFICATION_PRACTICES = [
  { id: "no-verification", label: "No Formal Verification", desc: "Assets not systematically verified or reconciled", riskModifier: 1.15 },
  { id: "periodic-manual", label: "Periodic Manual Counts", desc: "Physical counts conducted annually or less frequently", riskModifier: 1.0 },
  { id: "continuous-system", label: "Continuous System Tracking", desc: "Real-time asset tracking with regular reconciliation", riskModifier: 0.85 },
  { id: "iot-enabled", label: "IoT/RFID Enabled Tracking", desc: "Automated asset tracking with IoT/RFID technology", riskModifier: 0.7 },
];

// ─── Recovery Categories ──────────────────────────────────────────────────────
const RECOVERY_CATEGORIES = [
  { name: "Ghost Assets", color: "#1E3A5F", share: 0.35 },
  { name: "Unrecorded Assets", color: "#0D9488", share: 0.20 },
  { name: "Redeployable Assets", color: "#F59E0B", share: 0.18 },
  { name: "Avoided Purchases", color: "#2D5282", share: 0.18 },
  { name: "Deferred Replacement", color: "#14B8A6", share: 0.09 },
];

interface CalculatorState {
  step: number;
  assetCount: number;
  locations: number;
  departments: number;
  industry: string;
  lastVerification: string;
  maturityLevel: number;
  assetVerificationPractice: string;
  customRecoveryRate: boolean;
  recoveryRate: number;
  email: string;
  showResults: boolean;
}

export default function ROICalculator() {
  const [state, setState] = useState<CalculatorState>({
    step: 1,
    assetCount: 1500,
    locations: 2,
    departments: 6,
    industry: "manufacturing",
    lastVerification: "3-5 years",
    maturityLevel: 2,
    assetVerificationPractice: "periodic-manual",
    customRecoveryRate: false,
    recoveryRate: 0.15,
    email: "",
    showResults: false,
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const submitLeadMutation = trpc.leads.submitLead.useMutation({
    onSuccess: () => {
      setSubmitSuccess(true);
      setSubmitError(null);
      setTimeout(() => setSubmitSuccess(false), 3000);
    },
    onError: (error) => {
      setSubmitError(error.message || "Failed to submit lead. Please try again.");
      setSubmitSuccess(false);
    },
  });

  const colors = {
    slate: "#0F1419",
    teal: "#0D9488",
    amber: "#F59E0B",
    bg: "#F8FAFC",
    border: "#E2E8F0",
    text: "#FFFFFF",
    muted: "#E8E9EB",
  };

  // ─── Calculations ─────────────────────────────────────────────────────────
  const industryData = INDUSTRY_DATA[state.industry] || INDUSTRY_DATA.other;
  const maturityData = MATURITY_LEVELS.find(m => m.id === state.maturityLevel) || MATURITY_LEVELS[1];
  const verificationData = VERIFICATION_PRACTICES.find(v => v.id === state.assetVerificationPractice) || VERIFICATION_PRACTICES[1];
  
  const portfolioValue = state.assetCount * industryData.avgAssetValue;
  const recoveryRateLow = maturityData.lowRate * verificationData.riskModifier;
  const recoveryRateHigh = maturityData.highRate * verificationData.riskModifier;
  const recoveryRateUsed = state.customRecoveryRate ? state.recoveryRate : (recoveryRateLow + recoveryRateHigh) / 2;
  
  const capitalRecoveryLow = portfolioValue * recoveryRateLow;
  const capitalRecoveryHigh = portfolioValue * recoveryRateHigh;
  const capitalRecoveryMid = portfolioValue * recoveryRateUsed;
  
  const roiMultiple = capitalRecoveryMid / 25000; // Assuming ~$25K avg LAI engagement

  // ─── Recovery breakdown for pie chart ─────────────────────────────────────
  const recoveryBreakdown = RECOVERY_CATEGORIES.map(cat => ({
    name: cat.name,
    value: Math.round(capitalRecoveryMid * cat.share),
    color: cat.color,
  }));

  // ─── ROI Scenario data ─────────────────────────────────────────────────────
  const roiScenarioData = [
    { scenario: "Low Recovery", capital: Math.round(capitalRecoveryLow), roiMultiple: (capitalRecoveryLow / 25000).toFixed(1) },
    { scenario: "Mid-Point", capital: Math.round(capitalRecoveryMid), roiMultiple: roiMultiple.toFixed(1) },
    { scenario: "High Recovery", capital: Math.round(capitalRecoveryHigh), roiMultiple: (capitalRecoveryHigh / 25000).toFixed(1) },
  ];

  // ─── Step 1: Company Profile ───────────────────────────────────────────────
  const renderStep1 = () => (
    <div style={{ maxWidth: 600 }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: colors.text, marginBottom: "1.5rem" }}>
        Step 1: Company Profile
      </h3>
      
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontWeight: 600, color: colors.text, marginBottom: "0.5rem", fontSize: "0.9rem", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
          Total Trackable Physical Assets: <span style={{ color: colors.text, fontWeight: 700 }}>{state.assetCount.toLocaleString()}</span>
        </label>
        <input
          type="range"
          min="100"
          max="10000"
          step="100"
          value={state.assetCount}
          onChange={(e) => setState({ ...state, assetCount: parseInt(e.target.value) })}
          style={{ width: "100%", height: 6, borderRadius: 3, background: colors.border, outline: "none", accentColor: colors.teal }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#FFFFFF", marginTop: "0.3rem", fontWeight: 600, textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
          <span>100</span>
          <span>10,000+</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <label style={{ display: "block", fontWeight: 600, color: colors.text, marginBottom: "0.5rem", fontSize: "0.9rem", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
            Number of Locations
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={state.locations}
            onChange={(e) => setState({ ...state, locations: parseInt(e.target.value) || 1 })}
            style={{ width: "100%", padding: "0.6rem", border: `1px solid ${colors.border}`, borderRadius: 6, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: colors.text, fontWeight: 600, textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontWeight: 600, color: colors.text, marginBottom: "0.5rem", fontSize: "0.9rem", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
            Number of Departments
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={state.departments}
            onChange={(e) => setState({ ...state, departments: parseInt(e.target.value) || 1 })}
            style={{ width: "100%", padding: "0.6rem", border: `1px solid ${colors.border}`, borderRadius: 6, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: colors.text, fontWeight: 600, textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          />
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontWeight: 600, color: colors.text, marginBottom: "0.5rem", fontSize: "0.9rem", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
          Industry
        </label>
        <select
          value={state.industry}
          onChange={(e) => setState({ ...state, industry: e.target.value })}
          style={{ width: "100%", padding: "0.6rem", border: `1px solid ${colors.border}`, borderRadius: 6, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", background: "white" }}
        >
          <option value="healthcare">Healthcare</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="distribution">Distribution / Warehouse</option>
          <option value="utilities">Utilities / Energy</option>
          <option value="education">Education / University</option>
          <option value="construction">Construction / Contractor</option>
          <option value="logistics">Logistics / Transportation</option>
          <option value="government">Government / Public Sector</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontWeight: 600, color: colors.text, marginBottom: "0.5rem", fontSize: "0.9rem", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
          Last Physical Verification
        </label>
        <select
          value={state.lastVerification}
          onChange={(e) => setState({ ...state, lastVerification: e.target.value })}
          style={{ width: "100%", padding: "0.6rem", border: `1px solid ${colors.border}`, borderRadius: 6, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", background: "white" }}
        >
          <option value="within-12m">Within 12 Months</option>
          <option value="1-3y">1-3 Years</option>
          <option value="3-5y">3-5 Years</option>
          <option value="5y-plus">5+ Years</option>
          <option value="never">Never / Unknown</option>
        </select>
      </div>

      <button
        onClick={() => setState({ ...state, step: 2 })}
        style={{
          width: "100%",
          padding: "0.8rem",
          background: colors.teal,
          color: "white",
          border: "none",
          borderRadius: 6,
          fontFamily: "'Source Sans 3', sans-serif",
          fontWeight: 600,
          fontSize: "0.95rem",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#0F766E")}
        onMouseLeave={(e) => (e.currentTarget.style.background = colors.teal)}
      >
        Next: Recovery Assumptions →
      </button>
    </div>
  );

  // ─── Step 2: Recovery Assumptions ──────────────────────────────────────────
  const renderStep2 = () => (
    <div style={{ maxWidth: 600 }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: colors.text, marginBottom: "1.5rem" }}>
        Step 2: Recovery Assumptions
      </h3>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontWeight: 600, color: colors.slate, marginBottom: "1rem", fontSize: "0.9rem" }}>
          Asset Intelligence Maturity
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {MATURITY_LEVELS.map(level => (
            <button
              key={level.id}
              onClick={() => setState({ ...state, maturityLevel: level.id, customRecoveryRate: false })}
              style={{
                padding: "1rem",
                border: state.maturityLevel === level.id ? `2px solid ${colors.teal}` : `1px solid ${colors.border}`,
                borderRadius: 6,
                background: state.maturityLevel === level.id ? "rgba(13,148,136,0.08)" : "white",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontWeight: 600, color: colors.slate, marginBottom: "0.25rem" }}>{level.label}</div>
              <div style={{ fontSize: "0.85rem", color: colors.muted }}>{level.description}</div>
              <div style={{ fontSize: "0.8rem", color: colors.teal, fontWeight: 600, marginTop: "0.3rem" }}>
                Recovery Range: {(level.lowRate * 100).toFixed(0)}% – {(level.highRate * 100).toFixed(0)}%
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "rgba(13,148,136,0.08)", borderRadius: 6, border: `1px solid rgba(13,148,136,0.2)` }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontWeight: 600, color: colors.slate }}>
          <input
            type="checkbox"
            checked={state.customRecoveryRate}
            onChange={(e) => setState({ ...state, customRecoveryRate: e.target.checked })}
            style={{ width: 18, height: 18, cursor: "pointer", accentColor: colors.teal }}
          />
          Customize Recovery Rate
        </label>
        {state.customRecoveryRate && (
          <div style={{ marginTop: "1rem" }}>
            <label style={{ display: "block", fontWeight: 600, color: colors.slate, marginBottom: "0.5rem", fontSize: "0.9rem" }}>
              Recovery Rate: <span style={{ color: colors.teal }}>{(state.recoveryRate * 100).toFixed(1)}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="0.3"
              step="0.01"
              value={state.recoveryRate}
              onChange={(e) => setState({ ...state, recoveryRate: parseFloat(e.target.value) })}
              style={{ width: "100%", height: 6, borderRadius: 3, background: colors.border, outline: "none", accentColor: colors.teal }}
            />
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={() => setState({ ...state, step: 1 })}
          style={{
            flex: 1,
            padding: "0.8rem",
            background: "white",
            color: colors.teal,
            border: `1px solid ${colors.teal}`,
            borderRadius: 6,
            fontFamily: "'Source Sans 3', sans-serif",
            fontWeight: 600,
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(13,148,136,0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
        >
          ← Back
        </button>
        <button
          onClick={() => setState({ ...state, step: 3 })}
          style={{
            flex: 1,
            padding: "0.8rem",
            background: colors.teal,
            color: "white",
            border: "none",
            borderRadius: 6,
            fontFamily: "'Source Sans 3', sans-serif",
            fontWeight: 600,
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#0F766E")}
          onMouseLeave={(e) => (e.currentTarget.style.background = colors.teal)}
        >
          Next: Verification Practices →
        </button>
      </div>
    </div>
  );

  // ─── Step 3: Asset Verification Practices ──────────────────────────────────
  const renderStep3 = () => (
    <div style={{ maxWidth: 600 }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: colors.text, marginBottom: "1.5rem" }}>
        Step 3: Asset Verification Practices
      </h3>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontWeight: 600, color: colors.slate, marginBottom: "1rem", fontSize: "0.9rem" }}>
          Current Asset Verification Approach
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {VERIFICATION_PRACTICES.map(option => (
            <button
              key={option.id}
              onClick={() => setState({ ...state, assetVerificationPractice: option.id, customRecoveryRate: false })}
              style={{
                padding: "1rem",
                border: state.assetVerificationPractice === option.id ? `2px solid ${colors.teal}` : `1px solid ${colors.border}`,
                borderRadius: 6,
                background: state.assetVerificationPractice === option.id ? "rgba(13,148,136,0.08)" : "white",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontWeight: 600, color: colors.slate, marginBottom: "0.25rem" }}>{option.label}</div>
              <div style={{ fontSize: "0.85rem", color: colors.muted }}>{option.desc}</div>
              <div style={{ fontSize: "0.8rem", color: colors.amber, fontWeight: 600, marginTop: "0.3rem" }}>
                → Risk Modifier: {(option.riskModifier * 100).toFixed(0)}%
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={() => setState({ ...state, step: 2 })}
          style={{
            flex: 1,
            padding: "0.8rem",
            background: "white",
            color: colors.teal,
            border: `1px solid ${colors.teal}`,
            borderRadius: 6,
            fontFamily: "'Source Sans 3', sans-serif",
            fontWeight: 600,
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(13,148,136,0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
        >
          ← Back
        </button>
        <button
          onClick={() => setState({ ...state, step: 4 })}
          style={{
            flex: 1,
            padding: "0.8rem",
            background: colors.teal,
            color: "white",
            border: "none",
            borderRadius: 6,
            fontFamily: "'Source Sans 3', sans-serif",
            fontWeight: 600,
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#0F766E")}
          onMouseLeave={(e) => (e.currentTarget.style.background = colors.teal)}
        >
          View Results →
        </button>
      </div>
    </div>
  );

  // ─── Step 4: Results ───────────────────────────────────────────────────────
  const renderStep4 = () => (
    <div style={{ maxWidth: 900 }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: colors.text, marginBottom: "0.5rem" }}>
        Your Recoverable Capital Estimate
      </h3>
      <p style={{ color: colors.muted, marginBottom: "2rem", fontSize: "0.9rem" }}>
        Based on {state.assetCount.toLocaleString()} assets across {state.locations} location(s) in {INDUSTRY_DATA[state.industry] ? Object.keys(INDUSTRY_DATA).find(k => INDUSTRY_DATA[k] === industryData) : 'your industry'}
      </p>

      {/* Key Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ padding: "1.5rem", background: "white", border: `1px solid ${colors.border}`, borderRadius: 8, textAlign: "center" }}>
          <div style={{ fontSize: "0.8rem", color: colors.slate, fontWeight: 600, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Portfolio Value
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.8rem", fontWeight: 700, color: colors.slate }}>
            ${(portfolioValue / 1000000).toFixed(1)}M
          </div>
        </div>
        <div style={{ padding: "1.5rem", background: "white", border: `1px solid ${colors.border}`, borderRadius: 8, textAlign: "center" }}>
          <div style={{ fontSize: "0.8rem", color: colors.slate, fontWeight: 600, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Recovery Range
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.2rem", fontWeight: 700, color: colors.teal }}>
            ${(capitalRecoveryLow / 1000).toFixed(0)}K – ${(capitalRecoveryHigh / 1000).toFixed(0)}K
          </div>
        </div>
        <div style={{ padding: "1.5rem", background: "rgba(245,158,11,0.08)", border: `2px solid ${colors.amber}`, borderRadius: 8, textAlign: "center" }}>
          <div style={{ fontSize: "0.8rem", color: colors.slate, fontWeight: 600, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Mid-Point Estimate
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.8rem", fontWeight: 700, color: colors.amber }}>
            ${(capitalRecoveryMid / 1000).toFixed(0)}K
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
        {/* Recovery Breakdown Pie */}
        <div style={{ padding: "1.5rem", background: "white", border: `1px solid ${colors.border}`, borderRadius: 8 }}>
          <h4 style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: colors.slate, marginBottom: "1rem", fontSize: "0.95rem" }}>
            Recovery by Category
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={recoveryBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                {recoveryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ fontSize: "0.8rem", color: colors.slate, marginTop: "1rem" }}>
            {recoveryBreakdown.map((cat, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                <span style={{ color: cat.color, fontWeight: 600 }}>● {cat.name}</span>
                <span style={{ color: colors.slate }}>${(cat.value / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Scenarios Bar */}
        <div style={{ padding: "1.5rem", background: "white", border: `1px solid ${colors.border}`, borderRadius: 8 }}>
          <h4 style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: colors.slate, marginBottom: "1rem", fontSize: "0.95rem" }}>
            ROI Scenarios vs. LAI Engagement (~$25K)
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={roiScenarioData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis dataKey="scenario" tick={{ fontSize: 12, fill: colors.muted }} />
              <YAxis tick={{ fontSize: 12, fill: colors.muted }} />
              <Tooltip
                contentStyle={{ background: "white", border: `1px solid ${colors.border}`, borderRadius: 6 }}
                formatter={(value: any) => [`${value}x ROI`, "Multiple"]}
              />
              <Bar dataKey="roiMultiple" fill={colors.teal} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: "0.8rem", color: colors.slate, marginTop: "1rem" }}>
            {roiScenarioData.map((scenario, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                <span style={{ color: colors.slate }}>{scenario.scenario}</span>
                <span style={{ fontWeight: 600, color: colors.teal }}>{scenario.roiMultiple}x ROI</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email Capture */}
      {!state.showResults && (
        <div style={{ padding: "2rem", background: "rgba(13,148,136,0.08)", border: `2px solid ${colors.teal}`, borderRadius: 8, marginBottom: "2rem" }}>
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: colors.slate, marginBottom: "0.5rem" }}>
            Get Your Detailed Assessment Report
          </h4>
          <p style={{ color: colors.slate, marginBottom: "1rem", fontSize: "0.9rem" }}>
            Enter your email to download a PDF with your full assessment, recovery scenarios, and next steps.
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <input
              type="email"
              placeholder="your@company.com"
              value={state.email}
              onChange={(e) => setState({ ...state, email: e.target.value })}
              style={{
                flex: 1,
                padding: "0.8rem",
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.95rem",
              }}
            />
            <button
              onClick={async () => {
                if (state.email) {
                  try {
                    // Submit lead to HubSpot
                    await submitLeadMutation.mutateAsync({
                      email: state.email,
                      company: state.industry,
                      message: `Assets: ${state.assetCount}, Locations: ${state.locations}, Departments: ${state.departments}, Verification: ${state.assetVerificationPractice}, Estimated Recovery: $${Math.round(capitalRecoveryMid).toLocaleString()}`,
                    });
                    
                    // Generate PDF
                    const result: CalculatorResult = {
                    email: state.email,
                    industry: state.industry,
                    assetCount: state.assetCount,
                    locations: state.locations,
                    departments: state.departments,
                    maturityLevel: MATURITY_LEVELS.find(m => m.id === state.maturityLevel)?.label || "Unknown",
                    assetVerificationPractice: state.assetVerificationPractice,
                    portfolioValue,
                    recoveryLow: capitalRecoveryLow,
                    recoveryHigh: capitalRecoveryHigh,
                    recoveryMid: capitalRecoveryMid,
                    recoveryBreakdown: {
                      ghostAssets: Math.round(capitalRecoveryMid * 0.35),
                      unrecordedAssets: Math.round(capitalRecoveryMid * 0.20),
                      redeployableAssets: Math.round(capitalRecoveryMid * 0.18),
                      avoidedPurchases: Math.round(capitalRecoveryMid * 0.18),
                      deferredReplacement: Math.round(capitalRecoveryMid * 0.09),
                    },
                    roiScenario: {
                      recovery: capitalRecoveryMid,
                      engagementCost: Math.round(capitalRecoveryMid / 15),
                      netBenefit: Math.round(capitalRecoveryMid - capitalRecoveryMid / 15),
                      roiMultiple: Math.round((capitalRecoveryMid - capitalRecoveryMid / 15) / (capitalRecoveryMid / 15) * 10) / 10,
                    },
                  };
                    generatePDF(result);
                    setState({ ...state, showResults: true });
                  } catch (err) {
                    // Error is already handled in mutation onError
                    console.error("Lead submission failed:", err);
                  }
                }
              }}
              style={{
                padding: "0.8rem 1.5rem",
                background: submitLeadMutation.isPending ? "#999" : colors.teal,
                color: "white",
                border: "none",
                borderRadius: 6,
                fontFamily: "'Source Sans 3', sans-serif",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: submitLeadMutation.isPending ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                opacity: submitLeadMutation.isPending ? 0.7 : 1,
              }}
              onMouseEnter={(e) => !submitLeadMutation.isPending && (e.currentTarget.style.background = "#0F766E")}
              onMouseLeave={(e) => !submitLeadMutation.isPending && (e.currentTarget.style.background = colors.teal)}
              disabled={submitLeadMutation.isPending}
            >
              {submitLeadMutation.isPending ? "Submitting..." : "Download PDF"}
            </button>
          </div>
          {submitError && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 6, color: "#DC2626", fontSize: "0.9rem", fontFamily: "'Source Sans 3', sans-serif" }}>
              {submitError}
            </div>
          )}
          {submitSuccess && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "#DCFCE7", border: "1px solid #86EFAC", borderRadius: 6, color: "#16A34A", fontSize: "0.9rem", fontFamily: "'Source Sans 3', sans-serif" }}>
              ✓ Lead submitted successfully!
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <div style={{ padding: "1.5rem", background: colors.slate, borderRadius: 8, color: "white", textAlign: "center" }}>
        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Have Questions About Your Assessment?
        </h4>
        <p style={{ fontSize: "0.9rem", marginBottom: "1rem", opacity: 0.9 }}>
          Send us an email and our team will respond within 24 business hours to discuss your specific situation.
        </p>
        <button
          onClick={() => {
            const subject = `ROI Calculator Assessment - ${state.industry}`;
            const body = `I completed your ROI calculator and would like to discuss my results. My estimated recoverable capital is $${(capitalRecoveryMid / 1000).toFixed(0)}K.`;
            window.location.href = `mailto:hello@legacyassetintelligence.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          }}
          style={{
            padding: "0.8rem 2rem",
            background: colors.amber,
            color: colors.slate,
            border: "none",
            borderRadius: 6,
            fontFamily: "'Source Sans 3', sans-serif",
            fontWeight: 600,
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Send Email to LAI
        </button>
      </div>

      <button
        onClick={() => setState({ ...state, step: 3 })}
        style={{
          marginTop: "1.5rem",
          width: "100%",
          padding: "0.8rem",
          background: "white",
          color: colors.teal,
          border: `1px solid ${colors.teal}`,
          borderRadius: 6,
          fontFamily: "'Source Sans 3', sans-serif",
          fontWeight: 600,
          fontSize: "0.95rem",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(13,148,136,0.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
      >
        ← Adjust Assumptions
      </button>
    </div>
  );

  return (
    <div style={{ padding: "2rem", background: "rgba(255, 255, 255, 0.15)", borderRadius: 12, border: `1px solid rgba(229, 231, 235, 0.3)`, boxShadow: "0 4px 16px rgba(30,58,95,0.05)", backdropFilter: "blur(10px)" }}>
      {state.step === 1 && renderStep1()}
      {state.step === 2 && renderStep2()}
      {state.step === 3 && renderStep3()}
      {state.step === 4 && renderStep4()}
    </div>
  );
}
