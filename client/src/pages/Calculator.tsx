import ExecutiveROIEstimator from "@/components/ExecutiveROIEstimator";

const Calculator: React.FC = () => {
  return (
    <div style={{ background: "#0B0F13", minHeight: "100vh", padding: "6rem 2rem 4rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "0.75rem" }}>
            Assess Your Opportunity
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, color: "#F5F7FA", lineHeight: 1.2, marginBottom: "1rem" }}>
            Executive ROI Estimator
          </h1>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#B0BAC5", fontSize: "1rem", maxWidth: 700, margin: "0 auto", lineHeight: 1.7 }}>
            Estimate your organization's total financial recovery opportunity in minutes. Our proprietary models predict ghost asset exposure, recoverable capital, and annual savings — using only information you already know.
          </p>
        </div>
        <ExecutiveROIEstimator />
      </div>
    </div>
  );
};

export default Calculator;
