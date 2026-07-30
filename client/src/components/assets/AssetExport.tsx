import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Papa from "papaparse";

interface AssetExportProps {
  projectId: number;
  onClose: () => void;
}

type ExportFormat = "csv" | "asset_panda" | "json";

export default function AssetExport({ projectId, onClose }: AssetExportProps) {
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [includePhotos, setIncludePhotos] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);

  // Fetch all assets (no pagination for export)
  const { data } = trpc.assets.list.useQuery({
    projectId,
    page: 1,
    pageSize: 100,
    status: statusFilter !== "all" ? statusFilter as any : undefined,
  });

  const handleExport = async () => {
    if (!data?.items?.length) return;
    setIsExporting(true);

    try {
      const assets = data.items;

      if (format === "json") {
        // Full JSON export for backup
        const jsonContent = JSON.stringify(assets, null, 2);
        downloadFile(jsonContent, "lai-assets-export.json", "application/json");
      } else if (format === "asset_panda") {
        // Asset Panda compatible CSV format
        const rows = assets.map((asset) => ({
          "Asset Name": asset.name || "",
          "Asset Tag": asset.assetTag || "",
          "Serial Number": asset.serialNumber || "",
          "Manufacturer": asset.manufacturer || "",
          "Model": asset.model || "",
          "Status": asset.status || "",
          "Condition": asset.condition || "",
          "Location": asset.location || "",
          "Building": asset.building || "",
          "Floor": asset.floor || "",
          "Room": asset.room || "",
          "Department": asset.department || "",
          "Assigned To": asset.assignedTo || "",
          "Custodian": asset.custodian || "",
          "Purchase Date": asset.acquisitionDate ? new Date(asset.acquisitionDate).toLocaleDateString() : "",
          "Purchase Price": asset.acquisitionCost || "",
          "Current Value": asset.currentValue || "",
          "Salvage Value": asset.salvageValue || "",
          "Useful Life (Years)": asset.usefulLifeYears || "",
          "Warranty Expiration": asset.warrantyExpiration ? new Date(asset.warrantyExpiration).toLocaleDateString() : "",
          "Quantity": asset.quantity || 1,
          "Unit of Measure": asset.unitOfMeasure || "each",
          "Barcode Type": asset.barcodeType || "code128",
          "Barcode Value": asset.barcodeValue || asset.assetTag || "",
          "Notes": asset.notes || "",
          "Description": asset.description || "",
        }));

        const csv = Papa.unparse(rows);
        downloadFile(csv, "lai-assets-asset-panda-format.csv", "text/csv");
      } else {
        // Standard CSV
        const rows = assets.map((asset) => ({
          "ID": asset.id,
          "Asset Tag": asset.assetTag,
          "Name": asset.name,
          "Description": asset.description || "",
          "Status": asset.status,
          "Condition": asset.condition,
          "Manufacturer": asset.manufacturer || "",
          "Model": asset.model || "",
          "Serial Number": asset.serialNumber || "",
          "Location": asset.location || "",
          "Building": asset.building || "",
          "Floor": asset.floor || "",
          "Room": asset.room || "",
          "Department": asset.department || "",
          "Assigned To": asset.assignedTo || "",
          "Custodian": asset.custodian || "",
          "Acquisition Date": asset.acquisitionDate ? new Date(asset.acquisitionDate).toISOString().split("T")[0] : "",
          "Acquisition Cost": asset.acquisitionCost || "",
          "Current Value": asset.currentValue || "",
          "Salvage Value": asset.salvageValue || "",
          "Useful Life Years": asset.usefulLifeYears || "",
          "Warranty Expiration": asset.warrantyExpiration ? new Date(asset.warrantyExpiration).toISOString().split("T")[0] : "",
          "Quantity": asset.quantity,
          "Unit of Measure": asset.unitOfMeasure || "each",
          "Barcode Type": asset.barcodeType || "code128",
          "Barcode Value": asset.barcodeValue || "",
          "Notes": asset.notes || "",
          "Created At": asset.createdAt ? new Date(asset.createdAt).toISOString() : "",
          "Updated At": asset.updatedAt ? new Date(asset.updatedAt).toISOString() : "",
        }));

        const csv = Papa.unparse(rows);
        downloadFile(csv, "lai-assets-export.csv", "text/csv");
      }
    } finally {
      setIsExporting(false);
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: "#1a2332", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, maxWidth: 500, width: "100%", padding: "1.5rem" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#F5F7FA" }}>Export Assets</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94A3B8", fontSize: "1.5rem", cursor: "pointer" }}>×</button>
        </div>

        {/* Format Selection */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", marginBottom: "0.5rem" }}>Export Format</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { value: "csv" as ExportFormat, label: "Standard CSV", desc: "Full data export for spreadsheets" },
              { value: "asset_panda" as ExportFormat, label: "Asset Panda Format", desc: "Compatible with Asset Panda bulk import" },
              { value: "json" as ExportFormat, label: "JSON Backup", desc: "Complete data backup for external storage" },
            ].map((opt) => (
              <label
                key={opt.value}
                style={{
                  display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem",
                  background: format === opt.value ? "rgba(13,148,136,0.15)" : "rgba(15,25,35,0.5)",
                  border: `1px solid ${format === opt.value ? "rgba(13,148,136,0.4)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 8, cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="format"
                  value={opt.value}
                  checked={format === opt.value}
                  onChange={(e) => setFormat(e.target.value as ExportFormat)}
                  style={{ accentColor: "#0D9488" }}
                />
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#F5F7FA" }}>{opt.label}</div>
                  <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", marginBottom: "0.3rem" }}>Status Filter</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", background: "#0f1923", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, color: "#F5F7FA", fontSize: "0.85rem" }}
          >
            <option value="all">All Assets</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive</option>
            <option value="disposed">Disposed</option>
            <option value="in_repair">In Repair</option>
          </select>
        </div>

        {/* Options */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "#C8D0D8", cursor: "pointer" }}>
            <input type="checkbox" checked={includePhotos} onChange={(e) => setIncludePhotos(e.target.checked)} />
            Include photo URLs (adds column with storage links)
          </label>
        </div>

        {/* Summary */}
        <div style={{ background: "rgba(15,25,35,0.5)", borderRadius: 8, padding: "0.75rem", marginBottom: "1.5rem", fontSize: "0.85rem", color: "#C8D0D8" }}>
          <strong style={{ color: "#F5F7FA" }}>{data?.total ?? 0}</strong> assets will be exported
          {statusFilter !== "all" && <span> (filtered by: {statusFilter})</span>}
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
            onClick={handleExport}
            disabled={isExporting || !data?.items?.length}
            style={{
              padding: "0.6rem 1.2rem",
              background: isExporting ? "rgba(13,148,136,0.5)" : "#0D9488",
              color: "white", border: "none", borderRadius: 6,
              cursor: isExporting ? "wait" : "pointer",
              fontSize: "0.85rem", fontWeight: 600,
              opacity: !data?.items?.length ? 0.5 : 1,
            }}
          >
            {isExporting ? "Exporting..." : "⬇️ Download Export"}
          </button>
        </div>
      </div>
    </div>
  );
}
