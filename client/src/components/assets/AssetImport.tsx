import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { COLORS } from "@shared/colors";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const C = COLORS;

interface Props {
  projectId: number;
  onComplete: () => void;
}

interface ParsedRow {
  name: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  location?: string;
  department?: string;
  quantity?: number;
  condition?: string;
  acquisitionDate?: string;
  acquisitionCost?: string;
  notes?: string;
}

const EXPECTED_COLUMNS = [
  "name", "manufacturer", "model", "serialNumber", "location",
  "department", "quantity", "condition", "acquisitionDate", "acquisitionCost", "notes",
];

const ACCEPTED_FORMATS = ".csv,.txt,.xlsx,.xls,.tsv,.ods";
const FORMAT_LABELS = "CSV, Excel (.xlsx, .xls), TSV, ODS";

export default function AssetImport({ projectId, onComplete }: Props) {
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [parseError, setParseError] = useState("");
  const [importing, setImporting] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ name: string; type: string } | null>(null);
  const [result, setResult] = useState<{ imported: number; errors: string[]; total: number } | null>(null);

  const utils = trpc.useUtils();
  const bulkImportMutation = trpc.assets.bulkImport.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setImporting(false);
      utils.assets.list.invalidate();
      utils.assets.stats.invalidate();
    },
    onError: (err) => {
      setParseError(err.message);
      setImporting(false);
    },
  });

  // Map row data to ParsedRow using flexible column name matching
  const mapRow = (row: Record<string, string>): ParsedRow => {
    const get = (keys: string[]) => {
      for (const k of keys) {
        // Try exact match
        if (row[k] !== undefined && row[k] !== "") return row[k].toString().trim();
        // Try case-insensitive
        const lower = k.toLowerCase();
        for (const rk of Object.keys(row)) {
          if (rk.toLowerCase() === lower && row[rk] !== undefined && row[rk] !== "") {
            return row[rk].toString().trim();
          }
        }
        // Try with spaces instead of camelCase
        const spaced = k.replace(/([A-Z])/g, " $1").trim().toLowerCase();
        for (const rk of Object.keys(row)) {
          if (rk.toLowerCase() === spaced && row[rk] !== undefined && row[rk] !== "") {
            return row[rk].toString().trim();
          }
        }
      }
      return undefined;
    };

    return {
      name: get(["name", "Name", "Asset Name", "asset_name", "Item", "item", "Asset", "Description"]) || "Unnamed Asset",
      manufacturer: get(["manufacturer", "Manufacturer", "Make", "make", "Brand", "brand", "Vendor", "vendor"]),
      model: get(["model", "Model", "model_number", "Model Number", "Model #"]),
      serialNumber: get(["serialNumber", "Serial Number", "serial_number", "Serial", "serial", "SN", "S/N", "Tag", "Asset Tag"]),
      location: get(["location", "Location", "Site", "site", "Building", "Facility"]),
      department: get(["department", "Department", "Dept", "dept", "Division", "division"]),
      quantity: parseInt(get(["quantity", "Quantity", "Qty", "qty", "Count", "count"]) || "1") || 1,
      condition: get(["condition", "Condition", "Status", "Asset Status"]),
      acquisitionDate: get(["acquisitionDate", "Acquisition Date", "Purchase Date", "purchase_date", "Date", "Date Acquired", "Install Date"]),
      acquisitionCost: get(["acquisitionCost", "Acquisition Cost", "Cost", "cost", "Price", "price", "Purchase Price", "Value", "Original Cost"]),
      notes: get(["notes", "Notes", "Comments", "comments", "Description", "description", "Remarks"]),
    };
  };

  // Parse Excel files (.xlsx, .xls, .ods)
  const parseExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        // Use the first sheet
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          setParseError("Excel file has no sheets.");
          return;
        }

        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" });

        if (jsonData.length === 0) {
          setParseError("Excel file is empty or has no data rows.");
          return;
        }

        const mapped = jsonData.map(mapRow);
        setParsedData(mapped);
      } catch (err: any) {
        setParseError(`Excel parse error: ${err.message || "Unknown error"}`);
      }
    };
    reader.onerror = () => setParseError("Failed to read file.");
    reader.readAsArrayBuffer(file);
  };

  // Parse CSV/TSV files
  const parseCsvFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setParseError(`CSV parse error: ${results.errors[0].message}`);
          return;
        }

        const rows = results.data as Record<string, string>[];
        if (rows.length === 0) {
          setParseError("File is empty.");
          return;
        }

        const mapped = rows.map(mapRow);
        setParsedData(mapped);
      },
      error: (err) => {
        setParseError(`Parse error: ${err.message}`);
      },
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseError("");
    setResult(null);
    setParsedData([]);

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    setFileInfo({ name: file.name, type: ext.toUpperCase() });

    if (ext === "xlsx" || ext === "xls" || ext === "ods") {
      parseExcelFile(file);
    } else {
      // CSV, TSV, TXT — all handled by PapaParse
      parseCsvFile(file);
    }
  };

  const handleImport = () => {
    if (parsedData.length === 0) return;
    setImporting(true);
    bulkImportMutation.mutate({ projectId, assets: parsedData });
  };

  const handleDownloadTemplate = () => {
    const headers = EXPECTED_COLUMNS.join(",");
    const sample = "Dell OptiPlex 7090,Dell,OptiPlex 7090,SN123456,Main Office,IT,1,good,2024-01-15,1200.00,Desktop workstation";
    const csv = `${headers}\n${sample}\n`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lai-asset-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadExcelTemplate = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      EXPECTED_COLUMNS,
      ["Dell OptiPlex 7090", "Dell", "OptiPlex 7090", "SN123456", "Main Office", "IT", "1", "good", "2024-01-15", "1200.00", "Desktop workstation"],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Assets");
    XLSX.writeFile(wb, "lai-asset-import-template.xlsx");
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.text, marginBottom: "0.5rem" }}>
        Bulk Import Assets
      </h2>
      <p style={{ color: C.textMuted, fontSize: "0.9rem", marginBottom: "1.5rem" }}>
        Upload a file to import multiple assets at once. Supports <strong style={{ color: C.silver }}>{FORMAT_LABELS}</strong>. Compatible with Asset Panda exports.
      </p>

      {/* Template Download */}
      <div style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <h3 style={{ color: C.silver, fontSize: "0.9rem", fontWeight: 600, margin: "0 0 0.25rem" }}>Import Templates</h3>
            <p style={{ color: C.textMuted, fontSize: "0.8rem", margin: 0 }}>
              Download a template or use any file with columns: name, manufacturer, model, serialNumber, location, department, quantity, condition, acquisitionDate, acquisitionCost, notes
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button onClick={handleDownloadTemplate} style={{ padding: "0.5rem 1rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.silver, cursor: "pointer", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
              ↓ CSV Template
            </button>
            <button onClick={handleDownloadExcelTemplate} style={{ padding: "0.5rem 1rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.silver, cursor: "pointer", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
              ↓ Excel Template
            </button>
          </div>
        </div>
      </div>

      {/* File Upload */}
      {!result && (
        <div style={{ background: C.slate, borderRadius: 10, border: `2px dashed ${C.border}`, padding: "2rem", textAlign: "center", marginBottom: "1.5rem" }}>
          <label style={{ cursor: "pointer" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📄</div>
            <p style={{ color: C.text, fontWeight: 600, marginBottom: "0.25rem" }}>Click to select file</p>
            <p style={{ color: C.textMuted, fontSize: "0.8rem", marginBottom: "0.5rem" }}>Accepts: {FORMAT_LABELS}</p>
            {fileInfo && (
              <p style={{ color: C.gold, fontSize: "0.8rem", fontWeight: 600 }}>
                Selected: {fileInfo.name} ({fileInfo.type})
              </p>
            )}
            <input type="file" accept={ACCEPTED_FORMATS} onChange={handleFileSelect} style={{ display: "none" }} />
          </label>
        </div>
      )}

      {parseError && <p style={{ color: "#EF4444", fontSize: "0.85rem", marginBottom: "1rem" }}>{parseError}</p>}

      {/* Preview */}
      {parsedData.length > 0 && !result && (
        <div style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: "1.5rem" }}>
          <div style={{ padding: "1rem", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: C.text, fontWeight: 600 }}>Preview: {parsedData.length} assets to import</span>
            <button
              onClick={handleImport}
              disabled={importing}
              style={{ padding: "0.5rem 1.25rem", background: importing ? C.textMuted : C.gold, border: "none", borderRadius: 6, color: C.charcoal, cursor: importing ? "not-allowed" : "pointer", fontWeight: 600, fontSize: "0.85rem" }}
            >
              {importing ? "Importing..." : `Import ${parsedData.length} Assets`}
            </button>
          </div>
          <div style={{ overflowX: "auto", maxHeight: 300 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", color: C.textMuted }}>#</th>
                  <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", color: C.textMuted }}>Name</th>
                  <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", color: C.textMuted }}>Manufacturer</th>
                  <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", color: C.textMuted }}>Serial</th>
                  <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", color: C.textMuted }}>Location</th>
                  <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", color: C.textMuted }}>Qty</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.slice(0, 20).map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "0.4rem 0.75rem", color: C.textMuted }}>{i + 1}</td>
                    <td style={{ padding: "0.4rem 0.75rem", color: C.text }}>{row.name}</td>
                    <td style={{ padding: "0.4rem 0.75rem", color: C.textMuted }}>{row.manufacturer || "—"}</td>
                    <td style={{ padding: "0.4rem 0.75rem", color: C.textMuted }}>{row.serialNumber || "—"}</td>
                    <td style={{ padding: "0.4rem 0.75rem", color: C.textMuted }}>{row.location || "—"}</td>
                    <td style={{ padding: "0.4rem 0.75rem", color: C.text }}>{row.quantity}</td>
                  </tr>
                ))}
                {parsedData.length > 20 && (
                  <tr><td colSpan={6} style={{ padding: "0.5rem 0.75rem", color: C.textMuted, textAlign: "center" }}>... and {parsedData.length - 20} more rows</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ background: C.slate, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✓</div>
          <h3 style={{ color: C.text, marginBottom: "0.5rem" }}>Import Complete</h3>
          <p style={{ color: C.textMuted, fontSize: "0.9rem", marginBottom: "1rem" }}>
            Successfully imported <strong style={{ color: "#10B981" }}>{result.imported}</strong> of {result.total} assets.
          </p>
          {result.errors.length > 0 && (
            <div style={{ textAlign: "left", marginBottom: "1rem" }}>
              <p style={{ color: "#F59E0B", fontSize: "0.85rem", fontWeight: 600 }}>{result.errors.length} errors:</p>
              <ul style={{ color: C.textMuted, fontSize: "0.8rem", maxHeight: 150, overflow: "auto" }}>
                {result.errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}
          <button onClick={onComplete} style={{ padding: "0.6rem 1.5rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, cursor: "pointer", fontWeight: 600 }}>
            View Assets
          </button>
        </div>
      )}
    </div>
  );
}
