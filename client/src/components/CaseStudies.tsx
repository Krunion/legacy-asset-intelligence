/**
 * Case Studies Component for Legacy Asset Intelligence
 * Showcases 3 realistic anonymized client scenarios
 * Design: Corporate Clarity with expandable cards
 */

import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const colors = {
  slate: "#0F1419",
  teal: "#0D9488",
  amber: "#F59E0B",
  slateLight: "#1B4D3E",
  tealLight: "#14B8A6",
  bg: "#F8FAFC",
  text: "#FFFFFF",
  muted: "#E8E9EB",
  border: "#E2E8F0",
};

const caseStudies = [
  {
    id: 1,
    title: "Mid-Market Healthcare Network",
    industry: "Healthcare",
    subtitle: "Regional hospital system with 8 facilities",
    timeline: "8 weeks",
    metrics: {
      assetsAudited: 2500,
      ghostAssetsFound: 385,
      capitalRecovered: 450000,
      roiMultiple: "18x",
      taxSavings: 85000,
      maintenanceSavings: 120000,
      insuranceSavings: 95000,
      duplicatePrevention: 150000,
    },
    painPoints: [
      "Duplicate medical equipment purchases due to lost inventory",
      "Maintenance contracts on non-existent diagnostic devices",
      "Property tax liability on unused warehouse space",
      "Calibration fees for equipment no longer in use",
    ],
    recoveryBreakdown: [
      { name: "Ghost Assets", value: 180000, color: colors.slate },
      { name: "Avoided Purchases", value: 150000, color: colors.teal },
      { name: "Maintenance Elimination", value: 120000, color: colors.amber },
    ],
    quote:
      "We discovered we were paying maintenance contracts on equipment we didn't even own anymore. LAI's systematic approach gave us complete visibility and recovered significant capital.",
    quoteName: "Director of Operations, Regional Healthcare Network",
  },
  {
    id: 2,
    title: "Manufacturing Facility Consolidation",
    industry: "Manufacturing",
    subtitle: "Multi-plant equipment manufacturer",
    timeline: "9 weeks",
    metrics: {
      assetsAudited: 3200,
      ghostAssetsFound: 512,
      capitalRecovered: 680000,
      roiMultiple: "27x",
      taxSavings: 145000,
      maintenanceSavings: 210000,
      insuranceSavings: 165000,
      duplicatePrevention: 160000,
    },
    painPoints: [
      "Lost production equipment causing unnecessary re-purchases",
      "Maintenance contracts on machinery no longer in operation",
      "Inventory management chaos across multiple plants",
      "Duplicate equipment purchases across facilities",
    ],
    recoveryBreakdown: [
      { name: "Ghost Assets", value: 272000, color: colors.slate },
      { name: "Avoided Purchases", value: 160000, color: colors.teal },
      { name: "Maintenance Elimination", value: 210000, color: colors.amber },
      { name: "Redeployable Assets", value: 38000, color: colors.slateLight },
    ],
    quote:
      "The cross-plant visibility LAI provided was transformational. We eliminated redundant purchases and consolidated our asset base, improving both capital efficiency and operational control.",
    quoteName: "VP of Facilities, Manufacturing Operations",
  },
  {
    id: 3,
    title: "Distribution Center Optimization",
    industry: "Distribution & Logistics",
    subtitle: "Regional logistics hub with 3 locations",
    timeline: "6 weeks",
    metrics: {
      assetsAudited: 1800,
      ghostAssetsFound: 270,
      capitalRecovered: 320000,
      roiMultiple: "13x",
      taxSavings: 52000,
      maintenanceSavings: 68000,
      insuranceSavings: 85000,
      duplicatePrevention: 115000,
    },
    painPoints: [
      "Misplaced material handling equipment across locations",
      "Duplicate forklifts and racking systems purchased",
      "Unnecessary warehouse lease renewal for unused space",
      "Property tax on assets no longer in use",
    ],
    recoveryBreakdown: [
      { name: "Ghost Assets", value: 128000, color: colors.slate },
      { name: "Avoided Purchases", value: 115000, color: colors.teal },
      { name: "Maintenance Elimination", value: 68000, color: colors.amber },
      { name: "Redeployable Assets", value: 9000, color: colors.slateLight },
    ],
    quote:
      "LAI helped us right-size our asset portfolio and avoid a $200K+ warehouse lease renewal. The visibility we gained is now embedded in our operations.",
    quoteName: "Director of Logistics, Distribution Network",
  },
];

interface CaseStudyProps {
  study: (typeof caseStudies)[0];
  isExpanded: boolean;
  onToggle: () => void;
}

function CaseStudyCard({ study, isExpanded, onToggle }: CaseStudyProps) {
  return (
    <div
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        overflow: "hidden",
        background: "white",
        transition: "all 0.3s",
        boxShadow: isExpanded
          ? "0 12px 32px rgba(30,58,95,0.15)"
          : "0 2px 8px rgba(30,58,95,0.08)",
      }}
    >
      {/* Header */}
      <div
        onClick={onToggle}
        style={{
          padding: "1.5rem",
          background: `linear-gradient(135deg, ${colors.slate} 0%, ${colors.slateLight} 100%)`,
          color: "white",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.2s",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              opacity: 0.8,
              marginBottom: "0.3rem",
            }}
          >
            {study.industry}
          </div>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.3rem",
              fontWeight: 700,
              margin: 0,
              marginBottom: "0.25rem",
            }}
          >
            {study.title}
          </h3>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.9rem",
              margin: 0,
              opacity: 0.9,
            }}
          >
            {study.subtitle}
          </p>
        </div>
        <div style={{ fontSize: "1.5rem", transition: "transform 0.3s" }}>
          {isExpanded ? "−" : "+"}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{ padding: "2rem" }}>
          {/* Key Metrics */}
          <div style={{ marginBottom: "2rem" }}>
            <h4
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: colors.slate,
                marginBottom: "1rem",
              }}
            >
              Key Results
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  background: colors.bg,
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: colors.muted,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                  }}
                >
                  Assets Audited
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: colors.slate,
                  }}
                >
                  {study.metrics.assetsAudited.toLocaleString()}
                </div>
              </div>
              <div
                style={{
                  padding: "1rem",
                  background: colors.bg,
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: colors.muted,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                  }}
                >
                  Ghost Assets Found
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: colors.teal,
                  }}
                >
                  {study.metrics.ghostAssetsFound.toLocaleString()}
                </div>
              </div>
              <div
                style={{
                  padding: "1rem",
                  background: "rgba(245,158,11,0.1)",
                  borderRadius: 8,
                  textAlign: "center",
                  border: `2px solid ${colors.amber}`,
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: colors.muted,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                  }}
                >
                  Capital Recovered
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: colors.amber,
                  }}
                >
                  ${(study.metrics.capitalRecovered / 1000).toFixed(0)}K
                </div>
              </div>
              <div
                style={{
                  padding: "1rem",
                  background: colors.bg,
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: colors.muted,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                  }}
                >
                  ROI Multiple
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: colors.teal,
                  }}
                >
                  {study.metrics.roiMultiple}
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
              marginBottom: "2rem",
            }}
          >
            {/* Recovery Breakdown */}
            <div>
              <h5
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontWeight: 600,
                  color: colors.slate,
                  marginBottom: "1rem",
                  fontSize: "0.95rem",
                }}
              >
                Recovery Breakdown
              </h5>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={study.recoveryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {study.recoveryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: colors.muted,
                  marginTop: "1rem",
                }}
              >
                {study.recoveryBreakdown.map((cat, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.3rem",
                    }}
                  >
                    <span style={{ color: cat.color, fontWeight: 600 }}>
                      ● {cat.name}
                    </span>
                    <span>${(cat.value / 1000).toFixed(0)}K</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings Breakdown */}
            <div>
              <h5
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontWeight: 600,
                  color: colors.slate,
                  marginBottom: "1rem",
                  fontSize: "0.95rem",
                }}
              >
                Savings by Category
              </h5>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  {
                    label: "Tax Savings",
                    value: study.metrics.taxSavings,
                    color: colors.slate,
                  },
                  {
                    label: "Maintenance Elimination",
                    value: study.metrics.maintenanceSavings,
                    color: colors.teal,
                  },
                  {
                    label: "Insurance Reduction",
                    value: study.metrics.insuranceSavings,
                    color: colors.amber,
                  },
                  {
                    label: "Duplicate Prevention",
                    value: study.metrics.duplicatePrevention,
                    color: colors.slateLight,
                  },
                ].map((item, i) => (
                  <div key={i}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.3rem",
                      fontSize: "0.85rem",
                    }}
                  >
                    <span style={{ color: colors.slate, fontWeight: 600 }}>
                      {item.label}
                    </span>
                      <span style={{ color: item.color, fontWeight: 700 }}>
                        ${(item.value / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div
                      style={{
                        height: 8,
                        background: colors.border,
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          background: item.color,
                          width: `${(item.value / study.metrics.capitalRecovered) * 100}%`,
                          transition: "width 0.3s",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pain Points */}
          <div
            style={{
              marginBottom: "2rem",
              padding: "1.5rem",
              background: "rgba(30,58,95,0.05)",
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
            }}
          >
            <h5
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontWeight: 600,
                color: colors.slate,
                marginBottom: "1rem",
                fontSize: "0.95rem",
              }}
            >
              Key Pain Points Addressed
            </h5>
            <ul
              style={{
                margin: 0,
                paddingLeft: "1.5rem",
                color: colors.slate,
                fontSize: "0.9rem",
                lineHeight: 1.7,
              }}
            >
              {study.painPoints.map((point, i) => (
                <li key={i} style={{ marginBottom: "0.5rem" }}>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Quote */}
          <div
            style={{
              padding: "1.5rem",
              background: `linear-gradient(135deg, rgba(13,148,136,0.08) 0%, rgba(245,158,11,0.08) 100%)`,
              borderLeft: `4px solid ${colors.teal}`,
              borderRadius: 8,
            }}
          >
            <p
              style={{
                fontStyle: "italic",
                color: colors.slate,
                margin: "0 0 0.75rem 0",
                fontSize: "0.95rem",
                lineHeight: 1.7,
              }}
            >
              "{study.quote}"
            </p>
            <p
              style={{
                color: colors.muted,
                margin: 0,
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              — {study.quoteName}
            </p>
          </div>

          {/* Timeline */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              background: colors.bg,
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                color: colors.muted,
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: "0.3rem",
              }}
            >
              Engagement Timeline
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: colors.slate,
              }}
            >
              {study.timeline}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CaseStudies() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <p
          style={{
            color: colors.slate,
            fontSize: "0.95rem",
            lineHeight: 1.7,
          }}
        >
          Below are three realistic anonymized case studies showing typical recoverable capital opportunities across industries. Results are based on LAI's engagement methodology and industry benchmarks. Actual outcomes vary based on asset portfolio, condition, and organizational factors.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {caseStudies.map((study) => (
          <CaseStudyCard
            key={study.id}
            study={study}
            isExpanded={expandedId === study.id}
            onToggle={() =>
              setExpandedId(expandedId === study.id ? null : study.id)
            }
          />
        ))}
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          background: "rgba(13,148,136,0.08)",
          borderRadius: 8,
          border: `1px solid rgba(13,148,136,0.2)`,
        }}
      >
        <h4
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: colors.slate,
            marginBottom: "0.75rem",
          }}
        >
          Your Organization Could Be Next
        </h4>
        <p
          style={{
            color: colors.slate,
            fontSize: "0.9rem",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Every organization has hidden capital waiting to be recovered. Use our ROI calculator to estimate your potential savings, or contact us to discuss your specific situation.
        </p>
      </div>
    </div>
  );
}
