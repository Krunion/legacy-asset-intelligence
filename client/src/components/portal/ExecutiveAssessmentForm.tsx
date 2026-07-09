import { useState } from "react";
import { COLORS } from "@shared/colors";
import { trpc } from "@/lib/trpc";

const C = COLORS;

interface AssessmentData {
  clientName: string;
  clientIndustry: string;
  clientRevenue: string;
  clientEmployees: string;
  assessmentDate: string;
  assessorName: string;
  
  // Current Asset Management State
  assetInventoryAccuracy: string;
  assetTrackingMethod: string;
  ghostAssetEstimate: string;
  
  // Financial Exposure
  propertyTaxExposure: string;
  insurancePremiumExposure: string;
  maintenanceContractExposure: string;
  duplicatePurchaseRisk: string;
  
  // Technology & Governance
  currentTechnology: string;
  governanceMaturity: string;
  financialReportingAccuracy: string;
  capitalPlanningProcess: string;
  
  // Engagement Readiness
  decisionMakerEngagement: string;
  budgetAvailability: string;
  timelineExpectation: string;
  
  // Additional Notes
  notes: string;
}

interface ExecutiveAssessmentFormProps {
  onBack: () => void;
}

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  border: `1px solid ${C.border}`,
  borderRadius: 4,
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: "0.9rem",
  boxSizing: "border-box" as const,
  color: "#1E293B",
  backgroundColor: "#FFFFFF",
};

export default function ExecutiveAssessmentForm({ onBack }: ExecutiveAssessmentFormProps) {
  const [formData, setFormData] = useState<AssessmentData>({
    clientName: "",
    clientIndustry: "",
    clientRevenue: "",
    clientEmployees: "",
    assessmentDate: new Date().toISOString().split("T")[0],
    assessorName: "",
    assetInventoryAccuracy: "",
    assetTrackingMethod: "",
    ghostAssetEstimate: "",
    propertyTaxExposure: "",
    insurancePremiumExposure: "",
    maintenanceContractExposure: "",
    duplicatePurchaseRisk: "",
    currentTechnology: "",
    governanceMaturity: "",
    financialReportingAccuracy: "",
    capitalPlanningProcess: "",
    decisionMakerEngagement: "",
    budgetAvailability: "",
    timelineExpectation: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.clientName.trim()) {
      setError("Client name is required");
      return;
    }
    if (!formData.assessorName.trim()) {
      setError("Assessor name is required");
      return;
    }

    // Mark as submitted
    setSubmitted(true);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=1000,height=800");
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Executive Assessment - ${formData.clientName}</title>
          <style>
            body { font-family: 'Source Sans 3', sans-serif; margin: 0; padding: 20px; background: white; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1E3A5F; padding-bottom: 20px; }
            .header h1 { margin: 0; color: #1E3A5F; font-size: 24px; }
            .header p { margin: 5px 0; color: #666; font-size: 12px; }
            .section { margin-bottom: 25px; page-break-inside: avoid; }
            .section-title { background: #1E3A5F; color: white; padding: 10px; margin-bottom: 15px; font-weight: 600; }
            .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
            .field-row.full { grid-template-columns: 1fr; }
            .field { }
            .field-label { font-weight: 600; color: #1E3A5F; font-size: 12px; margin-bottom: 5px; }
            .field-value { color: #333; font-size: 13px; padding: 8px; background: #f5f5f5; border-radius: 4px; }
            .notes { white-space: pre-wrap; }
            .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #ddd; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Executive Asset Intelligence Assessment</h1>
            <p>Phase 1: Discovery & Assessment</p>
            <p>Assessment Date: ${formData.assessmentDate} | Assessor: ${formData.assessorName}</p>
          </div>

          <div class="section">
            <div class="section-title">Client Information</div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Client Name</div>
                <div class="field-value">${formData.clientName}</div>
              </div>
              <div class="field">
                <div class="field-label">Industry</div>
                <div class="field-value">${formData.clientIndustry}</div>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Annual Revenue</div>
                <div class="field-value">${formData.clientRevenue}</div>
              </div>
              <div class="field">
                <div class="field-label">Number of Employees</div>
                <div class="field-value">${formData.clientEmployees}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Current Asset Management State</div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Asset Inventory Accuracy</div>
                <div class="field-value">${formData.assetInventoryAccuracy}</div>
              </div>
              <div class="field">
                <div class="field-label">Asset Tracking Method</div>
                <div class="field-value">${formData.assetTrackingMethod}</div>
              </div>
            </div>
            <div class="field-row full">
              <div class="field">
                <div class="field-label">Estimated Ghost Assets (%)</div>
                <div class="field-value">${formData.ghostAssetEstimate}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Financial Exposure Assessment</div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Property Tax Overpayment Risk</div>
                <div class="field-value">${formData.propertyTaxExposure}</div>
              </div>
              <div class="field">
                <div class="field-label">Insurance Premium Exposure</div>
                <div class="field-value">${formData.insurancePremiumExposure}</div>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Maintenance Contract Waste</div>
                <div class="field-value">${formData.maintenanceContractExposure}</div>
              </div>
              <div class="field">
                <div class="field-label">Duplicate Purchase Risk</div>
                <div class="field-value">${formData.duplicatePurchaseRisk}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Technology & Governance Maturity</div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Current Technology Platform</div>
                <div class="field-value">${formData.currentTechnology}</div>
              </div>
              <div class="field">
                <div class="field-label">Governance Maturity Level</div>
                <div class="field-value">${formData.governanceMaturity}</div>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Financial Reporting Accuracy</div>
                <div class="field-value">${formData.financialReportingAccuracy}</div>
              </div>
              <div class="field">
                <div class="field-label">Capital Planning Process</div>
                <div class="field-value">${formData.capitalPlanningProcess}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Engagement Readiness</div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Decision Maker Engagement</div>
                <div class="field-value">${formData.decisionMakerEngagement}</div>
              </div>
              <div class="field">
                <div class="field-label">Budget Availability</div>
                <div class="field-value">${formData.budgetAvailability}</div>
              </div>
            </div>
            <div class="field-row full">
              <div class="field">
                <div class="field-label">Timeline Expectation</div>
                <div class="field-value">${formData.timelineExpectation}</div>
              </div>
            </div>
          </div>

          ${formData.notes ? `
          <div class="section">
            <div class="section-title">Additional Notes</div>
            <div class="field-row full">
              <div class="field">
                <div class="field-value notes">${formData.notes}</div>
              </div>
            </div>
          </div>
          ` : ""}

          <div class="footer">
            <p>Legacy Asset Intelligence — Executive Assessment Report</p>
            <p>This assessment is confidential and prepared for the client organization only.</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  if (submitted) {
    return (
      <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: C.slate, margin: 0 }}>
            Assessment Recorded
          </h2>
          <p style={{ color: "#64748B", marginTop: "0.5rem" }}>
            Executive Assessment for {formData.clientName} has been saved.
          </p>
        </div>

        <div style={{ background: "rgba(13, 148, 136, 0.1)", border: `1px solid ${C.teal}`, borderRadius: 8, padding: "1.5rem", marginBottom: "2rem" }}>
          <h3 style={{ color: C.teal, margin: "0 0 1rem 0" }}>Next Steps</h3>
          <ul style={{ color: "#1E293B", lineHeight: 1.8, margin: 0, paddingLeft: "1.5rem" }}>
            <li>Review the assessment summary below</li>
            <li>Print or download the report for client presentation</li>
            <li>Schedule Phase 2 Physical Verification engagement</li>
            <li>Present recoverable capital estimates to decision makers</li>
          </ul>
        </div>

        <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 8, padding: "2rem", marginBottom: "2rem" }}>
          <h3 style={{ color: C.slate, marginTop: 0 }}>Assessment Summary</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "0 0 0.25rem 0" }}>Client</p>
              <p style={{ fontSize: "1rem", fontWeight: 600, color: "#1E293B", margin: 0 }}>{formData.clientName}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "0 0 0.25rem 0" }}>Industry</p>
              <p style={{ fontSize: "1rem", fontWeight: 600, color: "#1E293B", margin: 0 }}>{formData.clientIndustry}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "0 0 0.25rem 0" }}>Ghost Assets</p>
              <p style={{ fontSize: "1rem", fontWeight: 600, color: "#1E293B", margin: 0 }}>{formData.ghostAssetEstimate}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "0 0 0.25rem 0" }}>Assessment Date</p>
              <p style={{ fontSize: "1rem", fontWeight: 600, color: "#1E293B", margin: 0 }}>{formData.assessmentDate}</p>
            </div>
          </div>

          <button
            onClick={handlePrint}
            style={{
              padding: "0.75rem 1.5rem",
              background: C.teal,
              color: "white",
              border: "none",
              borderRadius: 6,
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9rem",
              marginRight: "1rem",
            }}
          >
            🖨️ Print Report
          </button>

          <button
            onClick={onBack}
            style={{
              padding: "0.75rem 1.5rem",
              background: C.slate,
              color: "white",
              border: "none",
              borderRadius: 6,
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            ← Back to Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: C.slate, margin: 0 }}>
            Executive Assessment Form
          </h1>
          <p style={{ color: "#64748B", margin: "0.5rem 0 0 0" }}>Phase 1: Discovery & Assessment</p>
        </div>
        <button
          onClick={onBack}
          style={{
            padding: "0.6rem 1rem",
            background: C.slate,
            color: "white",
            border: "none",
            borderRadius: 6,
            fontFamily: "'Source Sans 3', sans-serif",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          ← Back
        </button>
      </div>

      {error && (
        <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 6, padding: "1rem", marginBottom: "1.5rem", color: "#991B1B" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Client Information */}
        <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.slate, marginTop: 0 }}>Client Information</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Client Name *
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Industry
              </label>
              <select
                name="clientIndustry"
                value={formData.clientIndustry}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Industry</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Education">Education</option>
                <option value="Utilities">Utilities</option>
                <option value="Logistics">Logistics</option>
                <option value="Construction">Construction</option>
                <option value="Government">Government</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Annual Revenue
              </label>
              <input
                type="text"
                name="clientRevenue"
                value={formData.clientRevenue}
                onChange={handleChange}
                placeholder="e.g., $50M - $100M"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Number of Employees
              </label>
              <input
                type="text"
                name="clientEmployees"
                value={formData.clientEmployees}
                onChange={handleChange}
                placeholder="e.g., 500-1000"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Assessment Date
              </label>
              <input
                type="date"
                name="assessmentDate"
                value={formData.assessmentDate}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Assessor Name *
              </label>
              <input
                type="text"
                name="assessorName"
                value={formData.assessorName}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Current Asset Management State */}
        <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.slate, marginTop: 0 }}>
            Current Asset Management State
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Asset Inventory Accuracy
              </label>
              <select
                name="assetInventoryAccuracy"
                value={formData.assetInventoryAccuracy}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Level</option>
                <option value="< 50% (Highly Inaccurate)">Less than 50% (Highly Inaccurate)</option>
                <option value="50-75% (Partially Accurate)">50-75% (Partially Accurate)</option>
                <option value="75-90% (Mostly Accurate)">75-90% (Mostly Accurate)</option>
                <option value="> 90% (Highly Accurate)">Greater than 90% (Highly Accurate)</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Asset Tracking Method
              </label>
              <select
                name="assetTrackingMethod"
                value={formData.assetTrackingMethod}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Method</option>
                <option value="Manual Spreadsheets">Manual Spreadsheets</option>
                <option value="Legacy ERP System">Legacy ERP System</option>
                <option value="Specialized Asset Management">Specialized Asset Management</option>
                <option value="Cloud-Based Platform">Cloud-Based Platform</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
              Estimated Ghost Assets (%)
            </label>
            <input
              type="text"
              name="ghostAssetEstimate"
              value={formData.ghostAssetEstimate}
              onChange={handleChange}
              placeholder="e.g., 15-25%"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Financial Exposure */}
        <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.slate, marginTop: 0 }}>
            Financial Exposure Assessment
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Property Tax Overpayment Risk
              </label>
              <select
                name="propertyTaxExposure"
                value={formData.propertyTaxExposure}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Risk Level</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Insurance Premium Exposure
              </label>
              <select
                name="insurancePremiumExposure"
                value={formData.insurancePremiumExposure}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Risk Level</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Maintenance Contract Waste
              </label>
              <select
                name="maintenanceContractExposure"
                value={formData.maintenanceContractExposure}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Risk Level</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Duplicate Purchase Risk
              </label>
              <select
                name="duplicatePurchaseRisk"
                value={formData.duplicatePurchaseRisk}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Risk Level</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Technology & Governance */}
        <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.slate, marginTop: 0 }}>
            Technology & Governance Maturity
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Current Technology Platform
              </label>
              <select
                name="currentTechnology"
                value={formData.currentTechnology}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Platform</option>
                <option value="No Formal System">No Formal System</option>
                <option value="Manual Tracking">Manual Tracking</option>
                <option value="Legacy System">Legacy System</option>
                <option value="Modern Platform">Modern Platform</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Governance Maturity Level
              </label>
              <select
                name="governanceMaturity"
                value={formData.governanceMaturity}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Level</option>
                <option value="Ad-hoc">Ad-hoc</option>
                <option value="Developing">Developing</option>
                <option value="Mature">Mature</option>
                <option value="Optimized">Optimized</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Financial Reporting Accuracy
              </label>
              <select
                name="financialReportingAccuracy"
                value={formData.financialReportingAccuracy}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Level</option>
                <option value="Significant Discrepancies">Significant Discrepancies</option>
                <option value="Moderate Discrepancies">Moderate Discrepancies</option>
                <option value="Minor Discrepancies">Minor Discrepancies</option>
                <option value="Highly Accurate">Highly Accurate</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Capital Planning Process
              </label>
              <select
                name="capitalPlanningProcess"
                value={formData.capitalPlanningProcess}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Maturity</option>
                <option value="Informal/Reactive">Informal/Reactive</option>
                <option value="Semi-Structured">Semi-Structured</option>
                <option value="Structured">Structured</option>
                <option value="Strategic/Integrated">Strategic/Integrated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Engagement Readiness */}
        <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.slate, marginTop: 0 }}>
            Engagement Readiness
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Decision Maker Engagement
              </label>
              <select
                name="decisionMakerEngagement"
                value={formData.decisionMakerEngagement}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Level</option>
                <option value="Not Engaged">Not Engaged</option>
                <option value="Somewhat Engaged">Somewhat Engaged</option>
                <option value="Highly Engaged">Highly Engaged</option>
                <option value="Executive Champion">Executive Champion</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
                Budget Availability
              </label>
              <select
                name="budgetAvailability"
                value={formData.budgetAvailability}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Status</option>
                <option value="No Budget Allocated">No Budget Allocated</option>
                <option value="Limited Budget">Limited Budget</option>
                <option value="Adequate Budget">Adequate Budget</option>
                <option value="Approved & Available">Approved & Available</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
              Timeline Expectation
            </label>
            <select
              name="timelineExpectation"
              value={formData.timelineExpectation}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select Timeline</option>
              <option value="Exploratory (6+ months)">Exploratory (6+ months)</option>
              <option value="Medium-term (3-6 months)">Medium-term (3-6 months)</option>
              <option value="Near-term (1-3 months)">Near-term (1-3 months)</option>
              <option value="Immediate (< 1 month)">Immediate (Less than 1 month)</option>
            </select>
          </div>
        </div>

        {/* Additional Notes */}
        <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: C.slate, marginTop: 0 }}>
            Additional Notes
          </h2>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.slate, marginBottom: "0.5rem" }}>
            Any additional context or observations
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter any additional observations, concerns, or context about this assessment..."
            style={{
              ...inputStyle,
              minHeight: "120px",
              fontFamily: "'Source Sans 3', sans-serif",
              resize: "vertical",
            }}
          />
        </div>

        {/* Submit Button */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              padding: "0.75rem 1.5rem",
              background: C.slate,
              color: "white",
              border: "none",
              borderRadius: 6,
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            ← Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: "0.75rem 1.5rem",
              background: C.teal,
              color: "white",
              border: "none",
              borderRadius: 6,
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            ✓ Complete Assessment
          </button>
        </div>
      </form>
    </div>
  );
}
