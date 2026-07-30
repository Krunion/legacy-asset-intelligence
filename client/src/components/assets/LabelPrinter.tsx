import { useState, useRef, useEffect } from "react";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";

interface Asset {
  id: number;
  assetTag: string;
  name: string;
  serialNumber?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  location?: string | null;
  department?: string | null;
  barcodeType?: string | null;
  barcodeValue?: string | null;
}

interface LabelPrinterProps {
  assets: Asset[];
  onClose: () => void;
}

type LabelSize = "dymo_30252" | "dymo_30336" | "zebra_2x1" | "avery_5160" | "sheet_letter" | "custom";
type PrintMode = "individual" | "sheet";

const LABEL_SIZES: Record<string, { width: number; height: number; name: string; description: string }> = {
  dymo_30252: { width: 336, height: 108, name: "DYMO 30252", description: '1-1/8" x 3-1/2" Address' },
  dymo_30336: { width: 204, height: 96, name: "DYMO 30336", description: '1" x 2-1/8" Small' },
  zebra_2x1: { width: 192, height: 96, name: "Zebra 2x1", description: '2" x 1" Standard' },
  avery_5160: { width: 252, height: 96, name: "Avery 5160", description: '1" x 2-5/8" (30/sheet)' },
  sheet_letter: { width: 252, height: 96, name: "Letter Sheet", description: '8.5" x 11" (30 labels/page)' },
  custom: { width: 288, height: 108, name: "Custom", description: "Custom size" },
};

export default function LabelPrinter({ assets, onClose }: LabelPrinterProps) {
  const [labelSize, setLabelSize] = useState<LabelSize>("dymo_30252");
  const [showName, setShowName] = useState(true);
  const [showSerial, setShowSerial] = useState(true);
  const [showLocation, setShowLocation] = useState(true);
  const [copies, setCopies] = useState(1);
  const [printMode, setPrintMode] = useState<PrintMode>("individual");
  const previewRef = useRef<HTMLDivElement>(null);

  const currentSize = LABEL_SIZES[labelSize];

  const handlePrint = () => {
    const printContent = previewRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const isSheet = printMode === "sheet";
    const labelsPerRow = 3;
    const labelsPerPage = 30; // 10 rows x 3 cols for Avery 5160 / letter sheet

    printWindow.document.write(`
      <html>
        <head>
          <title>Asset Labels - LAI</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Arial', sans-serif; }
            @media print {
              ${isSheet ? `
              @page { 
                size: letter;
                margin: 0.5in 0.19in;
              }
              .sheet-grid {
                display: grid;
                grid-template-columns: repeat(${labelsPerRow}, 1fr);
                gap: 0;
                width: 100%;
              }
              .label {
                width: 2.625in;
                height: 1in;
                padding: 0.04in 0.1in;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 1px;
                overflow: hidden;
                border: none;
              }
              .page-break { page-break-after: always; }
              ` : `
              @page { 
                size: ${currentSize.width * 0.75}pt ${currentSize.height * 0.75}pt;
                margin: 0;
              }
              .label { 
                page-break-after: always;
                width: 100%;
                height: 100%;
                padding: 4px 8px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 1px;
                overflow: hidden;
              }
              .label:last-child { page-break-after: avoid; }
              `}
              .barcode-area { display: flex; align-items: center; justify-content: center; width: 100%; }
              .barcode-area img, .barcode-area svg { max-height: 100%; max-width: 100%; width: auto; }
              .tag { font-weight: bold; font-size: 10px; letter-spacing: 0.5px; text-align: center; }
              .detail { font-size: 7px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; text-align: center; }
            }
            /* Screen preview styles */
            .sheet-grid {
              display: grid;
              grid-template-columns: repeat(${labelsPerRow}, 1fr);
              gap: 2px;
              width: 100%;
            }
            .label {
              width: ${isSheet ? "2.625in" : currentSize.width + "px"};
              height: ${isSheet ? "1in" : currentSize.height + "px"};
              border: 1px dashed #ccc;
              padding: 4px 8px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 1px;
              overflow: hidden;
            }
            .barcode-area { display: flex; align-items: center; justify-content: center; width: 100%; }
            .barcode-area img, .barcode-area svg { max-height: ${isSheet ? "0.65in" : (currentSize.height - 40) + "px"}; max-width: 100%; width: auto; }
            .tag { font-weight: bold; font-size: 10px; letter-spacing: 0.5px; text-align: center; }
            .detail { font-size: 7px; color: #555; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 600);
  };

  // Build label list with copies
  const allLabels = assets.flatMap((asset) =>
    Array.from({ length: copies }, (_, i) => ({ ...asset, _copyIdx: i }))
  );

  // For sheet mode, chunk into pages
  const labelsPerPage = 30;
  const pages: typeof allLabels[] = [];
  if (printMode === "sheet") {
    for (let i = 0; i < allLabels.length; i += labelsPerPage) {
      pages.push(allLabels.slice(i, i + labelsPerPage));
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: "#1a2332", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, maxWidth: 900, width: "100%", maxHeight: "90vh", overflow: "auto", padding: "1.5rem" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#F5F7FA" }}>
            Print Labels ({assets.length} asset{assets.length !== 1 ? "s" : ""})
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94A3B8", fontSize: "1.5rem", cursor: "pointer" }}>×</button>
        </div>

        {/* Print Mode Toggle */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <button
            onClick={() => setPrintMode("individual")}
            style={{ padding: "0.5rem 1rem", background: printMode === "individual" ? "#0D9488" : "rgba(100,116,139,0.2)", color: printMode === "individual" ? "white" : "#94A3B8", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
          >
            Individual Labels
          </button>
          <button
            onClick={() => setPrintMode("sheet")}
            style={{ padding: "0.5rem 1rem", background: printMode === "sheet" ? "#0D9488" : "rgba(100,116,139,0.2)", color: printMode === "sheet" ? "white" : "#94A3B8", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
          >
            Full Sheet (All on One Page)
          </button>
        </div>

        {/* Settings */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", marginBottom: "0.3rem" }}>Label Size</label>
            <select
              value={labelSize}
              onChange={(e) => setLabelSize(e.target.value as LabelSize)}
              style={{ width: "100%", padding: "0.5rem", background: "#0f1923", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, color: "#F5F7FA", fontSize: "0.85rem" }}
            >
              {Object.entries(LABEL_SIZES).map(([key, val]) => (
                <option key={key} value={key}>{val.name} — {val.description}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", marginBottom: "0.3rem" }}>Copies per label</label>
            <input
              type="number"
              min={1}
              max={50}
              value={copies}
              onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
              style={{ width: "100%", padding: "0.5rem", background: "#0f1923", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, color: "#F5F7FA", fontSize: "0.85rem" }}
            />
          </div>
        </div>

        {/* Display Options */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "#C8D0D8", cursor: "pointer" }}>
            <input type="checkbox" checked={showName} onChange={(e) => setShowName(e.target.checked)} />
            Show Name
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "#C8D0D8", cursor: "pointer" }}>
            <input type="checkbox" checked={showSerial} onChange={(e) => setShowSerial(e.target.checked)} />
            Show Serial #
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "#C8D0D8", cursor: "pointer" }}>
            <input type="checkbox" checked={showLocation} onChange={(e) => setShowLocation(e.target.checked)} />
            Show Location / Dept
          </label>
        </div>

        {/* Preview */}
        <div style={{ background: "white", borderRadius: 8, padding: "1rem", marginBottom: "1.5rem", maxHeight: 450, overflow: "auto" }}>
          <div ref={previewRef}>
            {printMode === "sheet" ? (
              pages.map((page, pageIdx) => (
                <div key={pageIdx} className={pageIdx < pages.length - 1 ? "page-break" : ""}>
                  <div className="sheet-grid">
                    {page.map((asset, idx) => (
                      <LabelPreview
                        key={`${asset.id}-${asset._copyIdx}-${idx}`}
                        asset={asset}
                        size={currentSize}
                        showName={showName}
                        showSerial={showSerial}
                        showLocation={showLocation}
                        isSheet={true}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              allLabels.map((asset, idx) => (
                <LabelPreview
                  key={`${asset.id}-${asset._copyIdx}-${idx}`}
                  asset={asset}
                  size={currentSize}
                  showName={showName}
                  showSerial={showSerial}
                  showLocation={showLocation}
                  isSheet={false}
                />
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{ padding: "0.6rem 1.2rem", background: "rgba(100,116,139,0.2)", color: "#94A3B8", border: "1px solid rgba(100,116,139,0.3)", borderRadius: 6, cursor: "pointer", fontSize: "0.85rem" }}
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            style={{ padding: "0.6rem 1.2rem", background: "#0D9488", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}
          >
            Print Labels
          </button>
        </div>
      </div>
    </div>
  );
}

function LabelPreview({ asset, size, showName, showSerial, showLocation, isSheet }: {
  asset: Asset;
  size: { width: number; height: number };
  showName: boolean;
  showSerial: boolean;
  showLocation: boolean;
  isSheet: boolean;
}) {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const barcodeValue = asset.barcodeValue || asset.assetTag;
  const barcodeType = asset.barcodeType || "code128";

  // Calculate barcode height to fit within label while leaving room for text
  const barcodeHeight = isSheet ? 60 : Math.min(size.height - 20, 70);

  useEffect(() => {
    if (barcodeType === "qr" || barcodeType === "datamatrix") {
      QRCode.toDataURL(barcodeValue, { width: barcodeHeight, margin: 1 })
        .then(setQrDataUrl)
        .catch(() => {});
    } else if (barcodeRef.current && barcodeType !== "no_barcode" && barcodeType !== "barcode_damaged" && barcodeType !== "other_unknown") {
      try {
        // Auto-select JsBarcode format based on barcodeType
        let format = "CODE128";
        if (barcodeType === "code39") format = "CODE39";
        else if (barcodeType === "upca") format = "UPC";
        else if (barcodeType === "ean13") format = "EAN13";
        else if (barcodeType === "pdf417") format = "CODE128"; // PDF417 not supported by JsBarcode, fallback to Code128

        JsBarcode(barcodeRef.current, barcodeValue, {
          format,
          width: 1.2,
          height: barcodeHeight - 14,
          displayValue: false, // We show the value separately below
          margin: 1,
        });
      } catch (_e) {
        // Fallback to CODE128 if format fails
        try {
          JsBarcode(barcodeRef.current, barcodeValue, {
            format: "CODE128",
            width: 1.2,
            height: barcodeHeight - 14,
            displayValue: false,
            margin: 1,
          });
        } catch (_e2) { /* ignore */ }
      }
    }
  }, [barcodeValue, barcodeType, barcodeHeight]);

  const isNoBarcode = barcodeType === "no_barcode" || barcodeType === "barcode_damaged" || barcodeType === "other_unknown";

  // Build location/room line
  const locationLine = [asset.location, asset.department].filter(Boolean).join(" | ");

  return (
    <div className="label" style={{
      width: isSheet ? "100%" : size.width,
      height: isSheet ? "1in" : size.height,
      border: "1px dashed #ccc",
      padding: "4px 8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
      marginBottom: isSheet ? 0 : 4,
      overflow: "hidden",
    }}>
      {/* Asset Tag — centered above barcode */}
      <div className="tag" style={{ fontWeight: "bold", fontSize: 11, letterSpacing: "0.5px", lineHeight: 1.3, textAlign: "center" }}>
        {asset.assetTag}
      </div>

      {/* Barcode Area — centered */}
      {!isNoBarcode && (
        <div className="barcode-area" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
          {(barcodeType === "qr" || barcodeType === "datamatrix") ? (
            qrDataUrl ? <img src={qrDataUrl} alt="QR" style={{ height: barcodeHeight - 10, width: barcodeHeight - 10 }} /> : null
          ) : (
            <svg ref={barcodeRef} style={{ maxHeight: barcodeHeight - 16, maxWidth: "100%" }} />
          )}
        </div>
      )}

      {/* Location & Room/Bundle — directly under barcode */}
      {showLocation && locationLine && (
        <div className="detail" style={{ fontSize: 7, color: "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%", lineHeight: 1.2, textAlign: "center" }}>
          {locationLine}
        </div>
      )}

      {/* Serial Number — below location */}
      {showSerial && asset.serialNumber && (
        <div className="detail" style={{ fontSize: 7, color: "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%", lineHeight: 1.2, textAlign: "center" }}>
          SN: {asset.serialNumber}
        </div>
      )}
    </div>
  );
}
