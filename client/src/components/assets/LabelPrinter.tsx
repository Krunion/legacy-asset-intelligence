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

type LabelSize = "dymo_30252" | "dymo_30336" | "zebra_2x1" | "avery_5160" | "custom";

const LABEL_SIZES: Record<string, { width: number; height: number; name: string; description: string }> = {
  dymo_30252: { width: 252, height: 79, name: "DYMO 30252", description: "1-1/8\" x 3-1/2\" Address" },
  dymo_30336: { width: 180, height: 36, name: "DYMO 30336", description: "1\" x 2-1/8\" Small" },
  zebra_2x1: { width: 192, height: 96, name: "Zebra 2x1", description: "2\" x 1\" Standard" },
  avery_5160: { width: 189, height: 72, name: "Avery 5160", description: "1\" x 2-5/8\" Labels" },
  custom: { width: 200, height: 80, name: "Custom", description: "Custom size" },
};

export default function LabelPrinter({ assets, onClose }: LabelPrinterProps) {
  const [labelSize, setLabelSize] = useState<LabelSize>("dymo_30252");
  const [showName, setShowName] = useState(true);
  const [showSerial, setShowSerial] = useState(true);
  const [showLocation, setShowLocation] = useState(false);
  const [copies, setCopies] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);

  const currentSize = LABEL_SIZES[labelSize];

  const handlePrint = () => {
    const printContent = previewRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Asset Labels - LAI</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Arial', sans-serif; }
            @media print {
              @page { 
                size: ${currentSize.width * 0.75}pt ${currentSize.height * 0.75}pt;
                margin: 0;
              }
              .label { 
                page-break-after: always;
                width: ${currentSize.width}px;
                height: ${currentSize.height}px;
              }
              .label:last-child { page-break-after: avoid; }
            }
            .label {
              width: ${currentSize.width}px;
              height: ${currentSize.height}px;
              border: 1px dashed #ccc;
              padding: 4px;
              display: flex;
              align-items: center;
              gap: 6px;
              margin-bottom: 4px;
              overflow: hidden;
            }
            .barcode-area { flex-shrink: 0; }
            .barcode-area img, .barcode-area canvas, .barcode-area svg { max-height: ${currentSize.height - 12}px; }
            .info { flex: 1; min-width: 0; }
            .info .tag { font-weight: bold; font-size: 9px; letter-spacing: 0.5px; }
            .info .name { font-size: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .info .detail { font-size: 7px; color: #555; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
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
    }, 500);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: "#1a2332", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, maxWidth: 800, width: "100%", maxHeight: "90vh", overflow: "auto", padding: "1.5rem" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#F5F7FA" }}>
            Print Labels ({assets.length} asset{assets.length !== 1 ? "s" : ""})
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94A3B8", fontSize: "1.5rem", cursor: "pointer" }}>×</button>
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

        {/* Options */}
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
            Show Location
          </label>
        </div>

        {/* Preview */}
        <div style={{ background: "white", borderRadius: 8, padding: "1rem", marginBottom: "1.5rem", maxHeight: 400, overflow: "auto" }}>
          <div ref={previewRef}>
            {assets.flatMap((asset) =>
              Array.from({ length: copies }, (_, copyIdx) => (
                <LabelPreview
                  key={`${asset.id}-${copyIdx}`}
                  asset={asset}
                  size={currentSize}
                  showName={showName}
                  showSerial={showSerial}
                  showLocation={showLocation}
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
            🖨️ Print Labels
          </button>
        </div>
      </div>
    </div>
  );
}

function LabelPreview({ asset, size, showName, showSerial, showLocation }: {
  asset: Asset;
  size: { width: number; height: number };
  showName: boolean;
  showSerial: boolean;
  showLocation: boolean;
}) {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const barcodeValue = asset.barcodeValue || asset.assetTag;
  const barcodeType = asset.barcodeType || "code128";

  useEffect(() => {
    if (barcodeType === "qr") {
      QRCode.toDataURL(barcodeValue, { width: size.height - 12, margin: 1 })
        .then(setQrDataUrl)
        .catch(() => {});
    } else if (barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, barcodeValue, {
          format: barcodeType === "code39" ? "CODE39" : "CODE128",
          width: 1.2,
          height: size.height - 30,
          displayValue: true,
          fontSize: 8,
          margin: 2,
        });
      } catch (e) {
        // fallback
      }
    }
  }, [barcodeValue, barcodeType, size.height]);

  return (
    <div className="label" style={{ width: size.width, height: size.height, border: "1px dashed #ccc", padding: 4, display: "flex", alignItems: "center", gap: 6, marginBottom: 4, overflow: "hidden" }}>
      <div className="barcode-area">
        {barcodeType === "qr" ? (
          qrDataUrl ? <img src={qrDataUrl} alt="QR" style={{ height: size.height - 12 }} /> : null
        ) : (
          <svg ref={barcodeRef} />
        )}
      </div>
      <div className="info" style={{ flex: 1, minWidth: 0 }}>
        <div className="tag" style={{ fontWeight: "bold", fontSize: 9, letterSpacing: "0.5px" }}>{asset.assetTag}</div>
        {showName && <div className="name" style={{ fontSize: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{asset.name}</div>}
        {showSerial && asset.serialNumber && <div className="detail" style={{ fontSize: 7, color: "#555" }}>SN: {asset.serialNumber}</div>}
        {showLocation && asset.location && <div className="detail" style={{ fontSize: 7, color: "#555" }}>{asset.location}</div>}
      </div>
    </div>
  );
}
