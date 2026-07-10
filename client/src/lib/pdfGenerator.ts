/**
 * PDF Generator for LAI ROI Calculator Results
 * Creates branded PDF matching business plan design
 */

export interface CalculatorResult {
  email: string;
  industry: string;
  assetCount: number;
  locations: number;
  departments: number;
  maturityLevel: string;
  assetVerificationPractice: string;
  portfolioValue: number;
  recoveryLow: number;
  recoveryHigh: number;
  recoveryMid: number;
  recoveryBreakdown: {
    ghostAssets: number;
    unrecordedAssets: number;
    redeployableAssets: number;
    avoidedPurchases: number;
    deferredReplacement: number;
  };
  roiScenario: {
    recovery: number;
    engagementCost: number;
    netBenefit: number;
    roiMultiple: number;
  };
}

export function generatePDF(result: CalculatorResult): void {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Set canvas size (8.5" x 11" at 96 DPI)
  canvas.width = 816;
  canvas.height = 1056;

  // Colors matching LAI brand
  const colors = {
    slate: "#1E3A5F",
    teal: "#0D9488",
    amber: "#F59E0B",
    slateLight: "#2D5282",
    bg: "#F8FAFC",
    text: "#1E293B",
    muted: "#64748B",
    white: "#FFFFFF",
    border: "#E2E8F0",
  };

  // Fill background
  ctx.fillStyle = colors.white;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Helper functions
  const drawText = (
    text: string,
    x: number,
    y: number,
    font: string,
    color: string,
    align: CanvasTextAlign = "left"
  ) => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
  };

  const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, width: number = 1) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  const drawRect = (x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };

  let yPos = 40;

  // Header
  drawRect(0, 0, canvas.width, 80, colors.slate);
  drawText("LEGACY ASSET INTELLIGENCE", 40, 35, "bold 24px 'Playfair Display', serif", colors.white);
  drawText("ROI Calculator Results", 40, 60, "14px 'Source Sans 3', sans-serif", "rgba(255,255,255,0.8)");

  yPos = 120;

  // Section 1: Your Profile
  drawText("YOUR ORGANIZATION PROFILE", 40, yPos, "bold 14px 'Source Sans 3', sans-serif", colors.slate);
  yPos += 25;

  const profileData = [
    { label: "Industry", value: result.industry },
    { label: "Total Assets", value: result.assetCount.toLocaleString() },
    { label: "Locations", value: result.locations.toString() },
    { label: "Departments", value: result.departments.toString() },
    { label: "Asset Intelligence Maturity", value: result.maturityLevel },
  ];

  profileData.forEach((item, i) => {
    const row = i % 2;
    const col = Math.floor(i / 2);
    const x = 40 + col * 380;
    const y = yPos + row * 30;

    drawText(item.label, x, y, "12px 'Source Sans 3', sans-serif", colors.muted);
    drawText(item.value, x, y + 18, "bold 13px 'JetBrains Mono', monospace", colors.text);
  });

  yPos += 100;

  // Section 2: Key Results
  drawRect(40, yPos - 5, canvas.width - 80, 2, colors.teal);
  drawText("ESTIMATED RECOVERABLE CAPITAL", 40, yPos + 20, "bold 14px 'Source Sans 3', sans-serif", colors.slate);
  yPos += 45;

  // Portfolio value
  drawText("Portfolio Value", 40, yPos, "12px 'Source Sans 3', sans-serif", colors.muted);
  drawText(`$${(result.portfolioValue / 1000).toFixed(0)}K`, 40, yPos + 18, "bold 18px 'JetBrains Mono', monospace", colors.slate);

  // Recovery range
  drawText("Recovery Range", 280, yPos, "12px 'Source Sans 3', sans-serif", colors.muted);
  drawText(
    `$${(result.recoveryLow / 1000).toFixed(0)}K - $${(result.recoveryHigh / 1000).toFixed(0)}K`,
    280,
    yPos + 18,
    "bold 18px 'JetBrains Mono', monospace",
    colors.teal
  );

  // Mid-point estimate
  drawRect(520, yPos - 5, 256, 35, "rgba(245,158,11,0.1)");
  drawText("Mid-Point Estimate", 530, yPos, "12px 'Source Sans 3', sans-serif", colors.muted);
  drawText(
    `$${(result.recoveryMid / 1000).toFixed(0)}K`,
    530,
    yPos + 18,
    "bold 18px 'JetBrains Mono', monospace",
    colors.amber
  );

  yPos += 60;

  // Section 3: Recovery Breakdown
  drawText("RECOVERY BREAKDOWN", 40, yPos, "bold 14px 'Source Sans 3', sans-serif", colors.slate);
  yPos += 25;

  const breakdown = [
    { label: "Ghost Assets", value: result.recoveryBreakdown.ghostAssets, color: colors.slate },
    { label: "Unrecorded Assets", value: result.recoveryBreakdown.unrecordedAssets, color: colors.teal },
    { label: "Redeployable Assets", value: result.recoveryBreakdown.redeployableAssets, color: colors.amber },
    { label: "Avoided Purchases", value: result.recoveryBreakdown.avoidedPurchases, color: colors.slateLight },
    { label: "Deferred Replacement", value: result.recoveryBreakdown.deferredReplacement, color: colors.muted },
  ];

  breakdown.forEach((item) => {
    const percentage = ((item.value / result.recoveryMid) * 100).toFixed(0);
    const barWidth = (item.value / result.recoveryMid) * 150;

    drawText(item.label, 40, yPos, "11px 'Source Sans 3', sans-serif", colors.text);
    drawText(`$${(item.value / 1000).toFixed(0)}K`, 200, yPos, "bold 11px 'JetBrains Mono', monospace", item.color);
    drawText(`(${percentage}%)`, 280, yPos, "11px 'Source Sans 3', sans-serif", colors.muted);

    // Bar
    drawRect(330, yPos - 8, barWidth, 12, item.color);

    yPos += 20;
  });

  yPos += 15;

  // Section 4: ROI Scenario
  drawRect(40, yPos - 5, canvas.width - 80, 2, colors.teal);
  drawText("INVESTMENT & ROI SCENARIO", 40, yPos + 20, "bold 14px 'Source Sans 3', sans-serif", colors.slate);
  yPos += 45;

  const roiData = [
    { label: "Estimated Capital Recovery", value: `$${(result.roiScenario.recovery / 1000).toFixed(0)}K`, color: colors.amber },
    { label: "Typical LAI Engagement Cost", value: `$${(result.roiScenario.engagementCost / 1000).toFixed(0)}K`, color: colors.muted },
    { label: "Net Benefit", value: `$${(result.roiScenario.netBenefit / 1000).toFixed(0)}K`, color: colors.teal },
    { label: "ROI Multiple", value: `${result.roiScenario.roiMultiple}x`, color: colors.slate },
  ];

  roiData.forEach((item) => {
    drawText(item.label, 40, yPos, "12px 'Source Sans 3', sans-serif", colors.text);
    drawText(item.value, 500, yPos, "bold 14px 'JetBrains Mono', monospace", item.color);
    yPos += 25;
  });

  yPos += 20;

  // Section 5: Disclaimer & Next Steps
  drawRect(40, yPos - 5, canvas.width - 80, 2, colors.slate);
  drawText("NEXT STEPS", 40, yPos + 20, "bold 14px 'Source Sans 3', sans-serif", colors.slate);
  yPos += 45;

  const disclaimerText =
    "This assessment is based on information provided and industry benchmarks. Actual recoverable capital will be validated through physical asset verification and reconciliation.";
  const words = disclaimerText.split(" ");
  let line = "";
  const maxWidth = canvas.width - 80;

  words.forEach((word) => {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth - 80) {
      drawText(line, 40, yPos, "11px 'Source Sans 3', sans-serif", colors.muted);
      line = word + " ";
      yPos += 16;
    } else {
      line = testLine;
    }
  });
  drawText(line, 40, yPos, "11px 'Source Sans 3', sans-serif", colors.muted);

  yPos += 35;

  drawText("Questions? Contact us:", 40, yPos, "bold 12px 'Source Sans 3', sans-serif", colors.slate);
  drawText("info@legacyassetintelligence.com", 40, yPos + 18, "12px 'JetBrains Mono', monospace", colors.teal);

  yPos = canvas.height - 50;

  // Footer
  drawLine(40, yPos - 10, canvas.width - 40, yPos - 10, colors.border);
  drawText("Legacy Asset Intelligence | Recover Capital. Govern with Confidence.", 40, yPos + 15, "10px 'Source Sans 3', sans-serif", colors.muted, "left");
  drawText("© 2026 Legacy Asset Intelligence", canvas.width - 40, yPos + 15, "10px 'Source Sans 3', sans-serif", colors.muted, "right");

  // Convert canvas to image and download
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `LAI-ROI-Calculator-${new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}
