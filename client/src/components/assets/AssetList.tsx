import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { COLORS } from "@shared/colors";

const C = COLORS;

interface Props {
  projectId: number;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onAdd: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  active: "#10B981",
  inactive: "#6B7280",
  disposed: "#EF4444",
  in_repair: "#F59E0B",
  lost: "#DC2626",
  transferred: "#8B5CF6",
  dam_op: "#F97316",
  dam_inop: "#B91C1C",
};

const CONDITION_LABELS: Record<string, string> = {
  new: "New",
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
  salvage: "Salvage",
};

export default function AssetList({ projectId, onView, onEdit, onAdd, searchQuery, onSearchChange }: Props) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"createdAt" | "name" | "assetTag" | "manufacturer" | "location">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const utils = trpc.useUtils();

  const deleteMutation = trpc.assets.delete.useMutation({
    onSuccess: () => { utils.assets.list.invalidate(); utils.assets.stats.invalidate(); },
  });

  const { data, isLoading } = trpc.assets.list.useQuery({
    projectId,
    page,
    pageSize: 25,
    search: searchQuery || undefined,
    status: (statusFilter || undefined) as any,
    sortBy,
    sortOrder,
  });

  const handleExportCSV = () => {
    if (!data?.items) return;
    const headers = ["Asset Tag", "Name", "Manufacturer", "Model", "Serial Number", "Status", "Condition", "Location", "Department", "Quantity", "Acquisition Cost"];
    const rows = data.items.map((a) => [
      a.assetTag, a.name, a.manufacturer || "", a.model || "", a.serialNumber || "",
      a.status, a.condition, a.location || "", a.department || "", a.quantity, a.acquisitionCost || "",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lai-assets-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.text, margin: 0 }}>
          Asset Register
        </h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={handleExportCSV} style={{ padding: "0.5rem 1rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.silver, cursor: "pointer", fontSize: "0.85rem" }}>
            ↓ Export CSV
          </button>
          <button onClick={onAdd} style={{ padding: "0.5rem 1rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>
            + Add Asset
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search by name, tag, serial, manufacturer, location..."
          value={searchQuery}
          onChange={(e) => { onSearchChange(e.target.value); setPage(1); }}
          style={{ flex: 1, minWidth: 200, padding: "0.6rem 1rem", background: C.navy, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.9rem", outline: "none" }}
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          style={{ padding: "0.6rem 1rem", background: C.navy, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.9rem" }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="in_repair">In Repair</option>
          <option value="disposed">Disposed</option>
          <option value="lost">Lost</option>
          <option value="transferred">Transferred</option>
          <option value="dam_op">Dam Op</option>
          <option value="dam_inop">Dam Inop</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {[
                  { key: "assetTag", label: "Tag" },
                  { key: "name", label: "Name" },
                  { key: "manufacturer", label: "Manufacturer" },
                  { key: "location", label: "Location" },
                  { key: "status", label: "Status" },
                  { key: "condition", label: "Condition" },
                  { key: "qty", label: "Qty" },
                  { key: "actions", label: "" },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => {
                      if (["assetTag", "name", "manufacturer", "location"].includes(col.key)) {
                        if (sortBy === col.key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        else { setSortBy(col.key as any); setSortOrder("asc"); }
                      }
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "left",
                      color: C.textMuted,
                      fontWeight: 600,
                      fontFamily: "'Source Sans 3', sans-serif",
                      cursor: ["assetTag", "name", "manufacturer", "location"].includes(col.key) ? "pointer" : "default",
                      whiteSpace: "nowrap",
                      userSelect: "none",
                    }}
                  >
                    {col.label}
                    {sortBy === col.key && <span style={{ marginLeft: 4 }}>{sortOrder === "asc" ? "↑" : "↓"}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: C.textMuted }}>Loading assets...</td></tr>
              ) : !data?.items?.length ? (
                <tr><td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: C.textMuted }}>No assets found. Click "Add Asset" to get started.</td></tr>
              ) : (
                data.items.map((asset) => (
                  <tr
                    key={asset.id}
                    onClick={() => onView(asset.id)}
                    style={{ borderBottom: `1px solid ${C.border}`, cursor: "pointer", transition: "background 0.1s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = `${C.gold}08`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={{ padding: "0.65rem 1rem", color: C.gold, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}>{asset.assetTag}</td>
                    <td style={{ padding: "0.65rem 1rem", color: C.text, fontWeight: 500 }}>{asset.name}</td>
                    <td style={{ padding: "0.65rem 1rem", color: C.textMuted }}>{asset.manufacturer || "—"}</td>
                    <td style={{ padding: "0.65rem 1rem", color: C.textMuted }}>{asset.location || "—"}</td>
                    <td style={{ padding: "0.65rem 1rem" }}>
                      <span style={{ display: "inline-block", padding: "0.2rem 0.5rem", borderRadius: 4, fontSize: "0.75rem", fontWeight: 600, background: `${STATUS_COLORS[asset.status]}20`, color: STATUS_COLORS[asset.status] }}>
                        {asset.status.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ padding: "0.65rem 1rem", color: C.textMuted }}>{CONDITION_LABELS[asset.condition] || asset.condition}</td>
                    <td style={{ padding: "0.65rem 1rem", color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>{asset.quantity}</td>
                    <td style={{ padding: "0.65rem 1rem" }}>
                      <div style={{ display: "flex", gap: "0.3rem" }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); onEdit(asset.id); }}
                          style={{ padding: "0.3rem 0.6rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 4, color: C.silver, cursor: "pointer", fontSize: "0.75rem" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); if (confirm(`Delete "${asset.name}"?`)) deleteMutation.mutate({ id: asset.id }); }}
                          style={{ padding: "0.3rem 0.6rem", background: "#DC262615", border: `1px solid #DC262640`, borderRadius: 4, color: "#EF4444", cursor: "pointer", fontSize: "0.75rem" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", borderTop: `1px solid ${C.border}` }}>
            <span style={{ color: C.textMuted, fontSize: "0.8rem" }}>
              Showing {((page - 1) * 25) + 1}–{Math.min(page * 25, data.total)} of {data.total}
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                style={{ padding: "0.4rem 0.8rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 4, color: page <= 1 ? C.textMuted : C.text, cursor: page <= 1 ? "not-allowed" : "pointer", fontSize: "0.8rem" }}
              >
                ← Prev
              </button>
              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage(page + 1)}
                style={{ padding: "0.4rem 0.8rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 4, color: page >= data.totalPages ? C.textMuted : C.text, cursor: page >= data.totalPages ? "not-allowed" : "pointer", fontSize: "0.8rem" }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
