import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { COLORS } from "@shared/colors";

const C = COLORS;

interface Props {
  assetId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AssetForm({ assetId, onSuccess, onCancel }: Props) {
  const isEdit = !!assetId;
  const utils = trpc.useUtils();

  const { data: existingAsset } = trpc.assets.getById.useQuery(
    { id: assetId! },
    { enabled: isEdit }
  );

  const { data: categories } = trpc.assets.listCategories.useQuery();

  const createMutation = trpc.assets.create.useMutation({
    onSuccess: () => { utils.assets.list.invalidate(); utils.assets.stats.invalidate(); onSuccess(); },
  });

  const updateMutation = trpc.assets.update.useMutation({
    onSuccess: () => { utils.assets.list.invalidate(); utils.assets.getById.invalidate(); onSuccess(); },
  });

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    status: "active",
    condition: "good",
    manufacturer: "",
    model: "",
    serialNumber: "",
    location: "",
    building: "",
    floor: "",
    room: "",
    department: "",
    assignedTo: "",
    custodian: "",
    acquisitionDate: "",
    acquisitionCost: "",
    currentValue: "",
    salvageValue: "",
    usefulLifeYears: "",
    warrantyExpiration: "",
    quantity: "1",
    unitOfMeasure: "each",
    barcodeType: "code128",
    notes: "",
  });

  useEffect(() => {
    if (existingAsset && isEdit) {
      setForm({
        name: existingAsset.name || "",
        description: existingAsset.description || "",
        categoryId: existingAsset.categoryId?.toString() || "",
        status: existingAsset.status || "active",
        condition: existingAsset.condition || "good",
        manufacturer: existingAsset.manufacturer || "",
        model: existingAsset.model || "",
        serialNumber: existingAsset.serialNumber || "",
        location: existingAsset.location || "",
        building: existingAsset.building || "",
        floor: existingAsset.floor || "",
        room: existingAsset.room || "",
        department: existingAsset.department || "",
        assignedTo: existingAsset.assignedTo || "",
        custodian: existingAsset.custodian || "",
        acquisitionDate: existingAsset.acquisitionDate ? new Date(existingAsset.acquisitionDate).toISOString().slice(0, 10) : "",
        acquisitionCost: existingAsset.acquisitionCost || "",
        currentValue: existingAsset.currentValue || "",
        salvageValue: existingAsset.salvageValue || "",
        usefulLifeYears: existingAsset.usefulLifeYears?.toString() || "",
        warrantyExpiration: existingAsset.warrantyExpiration ? new Date(existingAsset.warrantyExpiration).toISOString().slice(0, 10) : "",
        quantity: existingAsset.quantity?.toString() || "1",
        unitOfMeasure: existingAsset.unitOfMeasure || "each",
        barcodeType: existingAsset.barcodeType || "code128",
        notes: existingAsset.notes || "",
      });
    }
  }, [existingAsset, isEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description || undefined,
      categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
      status: form.status as any,
      condition: form.condition as any,
      manufacturer: form.manufacturer || undefined,
      model: form.model || undefined,
      serialNumber: form.serialNumber || undefined,
      location: form.location || undefined,
      building: form.building || undefined,
      floor: form.floor || undefined,
      room: form.room || undefined,
      department: form.department || undefined,
      assignedTo: form.assignedTo || undefined,
      custodian: form.custodian || undefined,
      acquisitionDate: form.acquisitionDate || undefined,
      acquisitionCost: form.acquisitionCost || undefined,
      currentValue: form.currentValue || undefined,
      salvageValue: form.salvageValue || undefined,
      usefulLifeYears: form.usefulLifeYears ? parseInt(form.usefulLifeYears) : undefined,
      warrantyExpiration: form.warrantyExpiration || undefined,
      quantity: parseInt(form.quantity) || 1,
      unitOfMeasure: form.unitOfMeasure,
      barcodeType: form.barcodeType as any,
      notes: form.notes || undefined,
    };

    if (isEdit) {
      updateMutation.mutate({ id: assetId!, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.6rem 0.75rem",
    background: C.navy,
    border: `1px solid ${C.border}`,
    borderRadius: 6,
    color: C.text,
    fontSize: "0.9rem",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    color: C.textMuted,
    fontSize: "0.8rem",
    fontWeight: 600 as const,
    marginBottom: "0.3rem",
    fontFamily: "'Source Sans 3', sans-serif",
  };

  const sectionStyle = {
    marginBottom: "1.5rem",
    padding: "1.25rem",
    background: C.slate,
    borderRadius: 10,
    border: `1px solid ${C.border}`,
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.text, margin: 0 }}>
          {isEdit ? "Edit Asset" : "Add New Asset"}
        </h2>
        <button onClick={onCancel} style={{ padding: "0.5rem 1rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.silver, cursor: "pointer", fontSize: "0.85rem" }}>
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Core Info */}
        <div style={sectionStyle}>
          <h3 style={{ color: C.gold, fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem", fontFamily: "'Source Sans 3', sans-serif" }}>Core Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Asset Name *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="e.g., Dell OptiPlex 7090" />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} style={inputStyle}>
                <option value="">— Select Category —</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="in_repair">In Repair</option>
                <option value="disposed">Disposed</option>
                <option value="lost">Lost</option>
                <option value="transferred">Transferred</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Condition</label>
              <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} style={inputStyle}>
                <option value="new">New</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="salvage">Salvage</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="Optional description..." />
          </div>
        </div>

        {/* Manufacturer & Identification */}
        <div style={sectionStyle}>
          <h3 style={{ color: C.gold, fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem", fontFamily: "'Source Sans 3', sans-serif" }}>Manufacturer & Identification</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Manufacturer</label>
              <input type="text" value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} style={inputStyle} placeholder="e.g., Dell, HP, Cisco" />
            </div>
            <div>
              <label style={labelStyle}>Model</label>
              <input type="text" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} style={inputStyle} placeholder="e.g., OptiPlex 7090" />
            </div>
            <div>
              <label style={labelStyle}>Serial Number</label>
              <input type="text" value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} style={inputStyle} placeholder="Manufacturer serial number" />
            </div>
            <div>
              <label style={labelStyle}>Barcode Type</label>
              <select value={form.barcodeType} onChange={(e) => setForm({ ...form, barcodeType: e.target.value })} style={inputStyle}>
                <option value="code128">Code 128</option>
                <option value="code39">Code 39</option>
                <option value="qr">QR Code</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div style={sectionStyle}>
          <h3 style={{ color: C.gold, fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem", fontFamily: "'Source Sans 3', sans-serif" }}>Location & Assignment</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Location</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={inputStyle} placeholder="Site or campus" />
            </div>
            <div>
              <label style={labelStyle}>Building</label>
              <input type="text" value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Floor</label>
              <input type="text" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Room</label>
              <input type="text" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Department</label>
              <input type="text" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Assigned To</label>
              <input type="text" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} style={inputStyle} placeholder="Person or team" />
            </div>
            <div>
              <label style={labelStyle}>Custodian</label>
              <input type="text" value={form.custodian} onChange={(e) => setForm({ ...form, custodian: e.target.value })} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Financial */}
        <div style={sectionStyle}>
          <h3 style={{ color: C.gold, fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem", fontFamily: "'Source Sans 3', sans-serif" }}>Financial & Quantity</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Acquisition Date</label>
              <input type="date" value={form.acquisitionDate} onChange={(e) => setForm({ ...form, acquisitionDate: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Acquisition Cost ($)</label>
              <input type="number" step="0.01" value={form.acquisitionCost} onChange={(e) => setForm({ ...form, acquisitionCost: e.target.value })} style={inputStyle} placeholder="0.00" />
            </div>
            <div>
              <label style={labelStyle}>Current Value ($)</label>
              <input type="number" step="0.01" value={form.currentValue} onChange={(e) => setForm({ ...form, currentValue: e.target.value })} style={inputStyle} placeholder="0.00" />
            </div>
            <div>
              <label style={labelStyle}>Salvage Value ($)</label>
              <input type="number" step="0.01" value={form.salvageValue} onChange={(e) => setForm({ ...form, salvageValue: e.target.value })} style={inputStyle} placeholder="0.00" />
            </div>
            <div>
              <label style={labelStyle}>Useful Life (Years)</label>
              <input type="number" value={form.usefulLifeYears} onChange={(e) => setForm({ ...form, usefulLifeYears: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Warranty Expiration</label>
              <input type="date" value={form.warrantyExpiration} onChange={(e) => setForm({ ...form, warrantyExpiration: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Quantity</label>
              <input type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Unit of Measure</label>
              <input type="text" value={form.unitOfMeasure} onChange={(e) => setForm({ ...form, unitOfMeasure: e.target.value })} style={inputStyle} placeholder="each, box, pallet" />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div style={sectionStyle}>
          <h3 style={{ color: C.gold, fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem", fontFamily: "'Source Sans 3', sans-serif" }}>Notes</h3>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, minHeight: 100, resize: "vertical" }} placeholder="Additional notes..." />
        </div>

        {/* Submit */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button type="button" onClick={onCancel} style={{ padding: "0.75rem 1.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 8, color: C.silver, cursor: "pointer", fontSize: "0.9rem" }}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !form.name}
            style={{ padding: "0.75rem 2rem", background: isSubmitting ? C.textMuted : C.gold, border: "none", borderRadius: 8, color: C.charcoal, cursor: isSubmitting ? "not-allowed" : "pointer", fontWeight: 600, fontSize: "0.9rem" }}
          >
            {isSubmitting ? "Saving..." : isEdit ? "Update Asset" : "Create Asset"}
          </button>
        </div>

        {(createMutation.error || updateMutation.error) && (
          <p style={{ color: "#EF4444", marginTop: "1rem", fontSize: "0.85rem" }}>
            Error: {createMutation.error?.message || updateMutation.error?.message}
          </p>
        )}
      </form>
    </div>
  );
}
