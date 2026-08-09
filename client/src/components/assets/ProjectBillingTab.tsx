import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { COLORS } from "@shared/colors";

const C = COLORS;
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.85rem" };
const selectStyle: React.CSSProperties = { width: "100%", padding: "0.5rem 0.75rem", background: "#0B0F13", border: `1px solid ${C.border}`, borderRadius: 6, color: "#FFFFFF", fontSize: "0.85rem" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.75rem", color: C.silver, marginBottom: "0.3rem", fontWeight: 500 };
const btnStyle: React.CSSProperties = { padding: "0.5rem 1rem", background: C.gold, color: "#0B0F13", border: "none", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" };
const cardStyle: React.CSSProperties = { background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.25rem", marginBottom: "1rem" };

export default function ProjectBillingTab({ projectId }: { projectId: number }) {
  const { data, refetch } = trpc.clientPortal.getBillingSummary.useQuery({ projectId });
  const createBilling = trpc.clientPortal.createBillingItem.useMutation({ onSuccess: () => { refetch(); setShowAdd(false); setForm({}); } });
  const updateBilling = trpc.clientPortal.updateBillingItem.useMutation({ onSuccess: () => { refetch(); setEditId(null); } });
  const deleteBilling = trpc.clientPortal.deleteBillingItem.useMutation({ onSuccess: () => refetch() });
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState<"invoice" | "payment">("invoice");
  const [form, setForm] = useState<any>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [filter, setFilter] = useState("all");

  const summary = data?.summary;
  const items = data?.items || [];
  const filteredItems = filter === "all" ? items : items.filter((i: any) => i.status === filter);

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const handleCreate = () => {
    if (addType === "invoice") {
      createBilling.mutate({
        projectId,
        itemType: "invoice",
        description: form.description || "Invoice",
        amount: form.amount || "0",
        invoiceNumber: form.invoiceNumber,
        billingPeriod: form.billingPeriod,
        invoiceDate: form.invoiceDate,
        dueDate: form.dueDate,
        status: form.status || "draft",
        isClientVisible: form.isClientVisible ?? 1,
        notes: form.notes,
      });
    } else {
      createBilling.mutate({
        projectId,
        itemType: "payment",
        description: form.description || "Payment",
        amount: form.amount || "0",
        status: "paid",
        isClientVisible: form.isClientVisible ?? 1,
        notes: form.notes,
      });
    }
  };

  const handleUpdate = () => {
    if (!editId) return;
    updateBilling.mutate({ id: editId, ...editForm });
    setEditId(null);
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.text, margin: "0 0 1.5rem" }}>
        Project Billing
      </h2>

      {/* Summary Cards */}
      {summary && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <SummaryCard label="Total Invoiced" value={fmt(summary.totalInvoiced)} />
          <SummaryCard label="Amount Paid" value={fmt(summary.totalPaid)} color="#10B981" />
          <SummaryCard label="Current Due" value={fmt(summary.currentDue)} color={C.gold} />
          <SummaryCard label="Outstanding Balance" value={fmt(summary.outstandingBalance)} color="#F59E0B" />
          <SummaryCard label="Past Due" value={fmt(summary.pastDue)} color={summary.pastDue > 0 ? "#EF4444" : C.silver} />
          <SummaryCard label="Next Payment" value={summary.nextPaymentAmount > 0 ? fmt(summary.nextPaymentAmount) : "—"} sub={summary.nextPaymentDueDate ? `Due: ${new Date(summary.nextPaymentDueDate).toLocaleDateString()}` : ""} />
          <SummaryCard label="Billing Status" value={summary.billingStatus} color={summary.billingStatus === "Past Due" ? "#EF4444" : summary.billingStatus === "Paid in Full" ? "#10B981" : C.gold} />
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <button style={btnStyle} onClick={() => { setShowAdd(true); setAddType("invoice"); }}>+ Add Invoice</button>
        <button style={{ ...btnStyle, background: "#10B981" }} onClick={() => { setShowAdd(true); setAddType("payment"); }}>+ Record Payment</button>
        <select style={{ ...selectStyle, width: "auto" }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="sent">Issued</option>
          <option value="partially_paid">Partially Paid</option>
          <option value="paid">Paid</option>
          <option value="past_due">Past Due</option>
          <option value="cancelled">Void</option>
        </select>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div style={{ ...cardStyle, border: `1px solid ${C.gold}40`, marginBottom: "1.5rem" }}>
          <h3 style={{ color: C.gold, fontSize: "0.9rem", marginBottom: "1rem" }}>{addType === "invoice" ? "New Invoice" : "Record Payment"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div><label style={labelStyle}>{addType === "invoice" ? "Invoice #" : "Reference"}</label><input style={inputStyle} value={form.invoiceNumber || ""} onChange={e => setForm({ ...form, invoiceNumber: e.target.value })} /></div>
            <div><label style={labelStyle}>Description *</label><input style={inputStyle} value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div><label style={labelStyle}>Amount ($) *</label><input style={inputStyle} type="number" step="0.01" value={form.amount || ""} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
          </div>
          {addType === "invoice" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div><label style={labelStyle}>Invoice Date</label><input style={inputStyle} type="date" value={form.invoiceDate || ""} onChange={e => setForm({ ...form, invoiceDate: e.target.value })} /></div>
              <div><label style={labelStyle}>Due Date</label><input style={inputStyle} type="date" value={form.dueDate || ""} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></div>
              <div><label style={labelStyle}>Status</label><select style={selectStyle} value={form.status || "draft"} onChange={e => setForm({ ...form, status: e.target.value })}><option value="draft">Draft</option><option value="sent">Issued</option><option value="partially_paid">Partially Paid</option><option value="paid">Paid</option><option value="past_due">Past Due</option><option value="cancelled">Void</option></select></div>
              <div><label style={labelStyle}>Client Can View</label><select style={selectStyle} value={form.isClientVisible ?? 1} onChange={e => setForm({ ...form, isClientVisible: parseInt(e.target.value) })}><option value={1}>Yes</option><option value={0}>No</option></select></div>
            </div>
          )}
          <div style={{ marginBottom: "0.75rem" }}><label style={labelStyle}>Internal Notes</label><textarea style={{ ...inputStyle, minHeight: 40 }} value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button style={btnStyle} onClick={handleCreate}>{addType === "invoice" ? "Create Invoice" : "Record Payment"}</button>
            <button style={{ ...btnStyle, background: "transparent", color: C.silver, border: `1px solid ${C.border}` }} onClick={() => { setShowAdd(false); setForm({}); }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Invoice/Payment List */}
      {filteredItems.length === 0 && <p style={{ color: C.textMuted, fontSize: "0.85rem" }}>No billing records yet. Add an invoice to get started.</p>}
      {filteredItems.map((item: any) => (
        <div key={item.id} style={{ ...cardStyle, borderLeft: `3px solid ${item.itemType === "payment" ? "#10B981" : item.status === "paid" ? "#10B981" : item.status === "past_due" ? "#EF4444" : C.gold}` }}>
          {editId === item.id ? (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div><label style={labelStyle}>Description</label><input style={inputStyle} value={editForm.description ?? item.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} /></div>
                <div><label style={labelStyle}>Amount</label><input style={inputStyle} type="number" step="0.01" value={editForm.amount ?? item.amount} onChange={e => setEditForm({ ...editForm, amount: e.target.value })} /></div>
                <div><label style={labelStyle}>Status</label><select style={selectStyle} value={editForm.status ?? item.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}><option value="draft">Draft</option><option value="sent">Issued</option><option value="partially_paid">Partially Paid</option><option value="paid">Paid</option><option value="past_due">Past Due</option><option value="cancelled">Void</option></select></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div><label style={labelStyle}>Due Date</label><input style={inputStyle} type="date" value={editForm.dueDate ?? (item.dueDate ? new Date(item.dueDate).toISOString().split("T")[0] : "")} onChange={e => setEditForm({ ...editForm, dueDate: e.target.value })} /></div>
                <div><label style={labelStyle}>Amount Paid</label><input style={inputStyle} type="number" step="0.01" value={editForm.amountPaid ?? item.amountPaid} onChange={e => setEditForm({ ...editForm, amountPaid: e.target.value })} /></div>
                <div><label style={labelStyle}>Client Can View</label><select style={selectStyle} value={editForm.isClientVisible ?? item.isClientVisible} onChange={e => setEditForm({ ...editForm, isClientVisible: parseInt(e.target.value) })}><option value={1}>Yes</option><option value={0}>No</option></select></div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button style={btnStyle} onClick={handleUpdate}>Save</button>
                <button style={{ ...btnStyle, background: "transparent", color: C.silver, border: `1px solid ${C.border}` }} onClick={() => setEditId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: item.itemType === "payment" ? "#10B981" : C.gold, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase" }}>{item.itemType}</span>
                  <span style={{ color: C.text, fontSize: "0.9rem", fontWeight: 500 }}>{item.description}</span>
                  {item.invoiceNumber && <span style={{ color: C.textMuted, fontSize: "0.75rem" }}>#{item.invoiceNumber}</span>}
                </div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "0.3rem", fontSize: "0.75rem", color: C.textMuted }}>
                  <span>Amount: <strong style={{ color: C.text }}>{fmt(parseFloat(item.amount || "0"))}</strong></span>
                  {item.amountPaid && parseFloat(item.amountPaid) > 0 && <span>Paid: <strong style={{ color: "#10B981" }}>{fmt(parseFloat(item.amountPaid))}</strong></span>}
                  {item.dueDate && <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>}
                  <span style={{ padding: "0.1rem 0.4rem", background: `${C.slate}80`, borderRadius: 4, fontSize: "0.65rem", textTransform: "capitalize" }}>{item.status?.replace(/_/g, " ")}</span>
                  {item.isClientVisible === 1 && <span style={{ color: "#27AE60" }}>● Client Visible</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button style={{ ...btnStyle, background: "transparent", color: C.silver, border: `1px solid ${C.border}`, fontSize: "0.7rem", padding: "0.3rem 0.6rem" }} onClick={() => { setEditId(item.id); setEditForm({}); }}>Edit</button>
                {item.status !== "cancelled" && <button style={{ ...btnStyle, background: "transparent", color: "#EF4444", border: `1px solid #EF444440`, fontSize: "0.7rem", padding: "0.3rem 0.6rem" }} onClick={() => { if (confirm("Void this invoice? History will be preserved.")) updateBilling.mutate({ id: item.id, status: "cancelled" }); }}>Void</button>}
                <button style={{ ...btnStyle, background: "transparent", color: "#EF4444", border: `1px solid ${C.border}`, fontSize: "0.7rem", padding: "0.3rem 0.6rem" }} onClick={() => { if (confirm("Delete this billing record?")) deleteBilling.mutate({ id: item.id }); }}>Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SummaryCard({ label, value, color, sub }: { label: string; value: string; color?: string; sub?: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "1rem" }}>
      <p style={{ color: C.textMuted, fontSize: "0.7rem", margin: "0 0 0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
      <p style={{ color: color || C.text, fontSize: "1.1rem", fontWeight: 700, margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>{value}</p>
      {sub && <p style={{ color: C.textMuted, fontSize: "0.7rem", margin: "0.25rem 0 0" }}>{sub}</p>}
    </div>
  );
}
