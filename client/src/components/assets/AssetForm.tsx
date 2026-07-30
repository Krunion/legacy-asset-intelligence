import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { COLORS } from "@shared/colors";

const C = COLORS;

// ─── Predefined Categories (used for seeding if DB is empty) ────────────────
const PREDEFINED_CATEGORIES = [
  "Buildings & Real Estate",
  "Furniture & Fixtures",
  "Computers & IT Equipment",
  "Telecommunications Equipment",
  "Machinery & Production Equipment",
  "Tools & Portable Equipment",
  "Vehicles & Mobile Equipment",
  "Medical & Laboratory Equipment",
  "Electrical, HVAC & Utility Equipment",
  "Safety, Security & Emergency Equipment",
  "Office & Administrative Equipment",
  "Educational & Audio-Visual Equipment",
  "Warehouse & Material-Handling Equipment",
  "Specialized Operational Equipment",
  "Other — Describe",
];

// ─── Barcode Types ──────────────────────────────────────────────────────────
const BARCODE_TYPES = [
  { value: "code128", label: "Code 128 — Standard linear barcode" },
  { value: "code39", label: "Code 39 — Alphanumeric barcode" },
  { value: "qr", label: "QR Code — 2D square code" },
  { value: "datamatrix", label: "Data Matrix — Compact code for small equipment" },
  { value: "upca", label: "UPC-A — Common retail product barcode" },
  { value: "ean13", label: "EAN-13 — International retail product barcode" },
  { value: "pdf417", label: "PDF417 — High-capacity rectangular barcode" },
  { value: "other_unknown", label: "Other / Unknown" },
  { value: "no_barcode", label: "No Barcode Present" },
  { value: "barcode_damaged", label: "Barcode Damaged or Unreadable" },
];

// ─── Unit of Measure ────────────────────────────────────────────────────────
const UNITS_OF_MEASURE = [
  "Each", "Unit", "Item", "Piece", "Pair", "Set", "Kit", "Lot", "Batch",
  "Pack", "Box", "Case", "Carton", "Bundle", "Pallet", "Roll", "Spool",
  "Sheet", "Bag", "Bottle", "Can", "Container", "Bin", "Drum", "Barrel",
  "Cylinder", "Tank", "Room", "Other",
];

interface Props {
  projectId: number;
  assetId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AssetForm({ projectId, assetId, onSuccess, onCancel }: Props) {
  const isEdit = !!assetId;
  const utils = trpc.useUtils();

  const { data: existingAsset } = trpc.assets.getById.useQuery(
    { id: assetId! },
    { enabled: isEdit }
  );

  const createMutation = trpc.assets.create.useMutation({
    onSuccess: () => { utils.assets.list.invalidate(); utils.assets.stats.invalidate(); onSuccess(); },
  });

  const updateMutation = trpc.assets.update.useMutation({
    onSuccess: () => { utils.assets.list.invalidate(); utils.assets.getById.invalidate(); onSuccess(); },
  });

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    categoryOther: "",
    status: "active",
    condition: "good",
    manufacturer: "",
    model: "",
    serialNumber: "",
    barcodeType: "code128",
    location: "",
    building: "",
    floor: "",
    room: "",
    department: "",
    assignedTo: "",
    custodian: "",
    addressStreet: "",
    addressCity: "",
    addressState: "",
    addressZip: "",
    parentAssetTag: "",
    acquisitionDate: "",
    acquisitionCost: "",
    currentValue: "",
    salvageValue: "",
    usefulLifeYears: "",
    warrantyExpiration: "",
    quantity: "1",
    unitOfMeasure: "Each",
    unitOfMeasureOther: "",
    notes: "",
  });

  useEffect(() => {
    if (existingAsset && isEdit) {
      setForm({
        name: existingAsset.name || "",
        description: existingAsset.description || "",
        category: existingAsset.categoryId?.toString() || "",
        categoryOther: "",
        status: existingAsset.status || "active",
        condition: existingAsset.condition || "good",
        manufacturer: existingAsset.manufacturer || "",
        model: existingAsset.model || "",
        serialNumber: existingAsset.serialNumber || "",
        barcodeType: existingAsset.barcodeType || "code128",
        location: existingAsset.location || "",
        building: existingAsset.building || "",
        floor: existingAsset.floor || "",
        room: existingAsset.room || "",
        department: existingAsset.department || "",
        assignedTo: existingAsset.assignedTo || "",
        custodian: existingAsset.custodian || "",
        addressStreet: (existingAsset as any).addressStreet || "",
        addressCity: (existingAsset as any).addressCity || "",
        addressState: (existingAsset as any).addressState || "",
        addressZip: (existingAsset as any).addressZip || "",
        parentAssetTag: (existingAsset as any).parentAssetTag || "",
        acquisitionDate: existingAsset.acquisitionDate ? new Date(existingAsset.acquisitionDate).toISOString().slice(0, 10) : "",
        acquisitionCost: existingAsset.acquisitionCost || "",
        currentValue: existingAsset.currentValue || "",
        salvageValue: existingAsset.salvageValue || "",
        usefulLifeYears: existingAsset.usefulLifeYears?.toString() || "",
        warrantyExpiration: existingAsset.warrantyExpiration ? new Date(existingAsset.warrantyExpiration).toISOString().slice(0, 10) : "",
        quantity: existingAsset.quantity?.toString() || "1",
        unitOfMeasure: existingAsset.unitOfMeasure || "Each",
        unitOfMeasureOther: "",
        notes: existingAsset.notes || "",
      });
    }
  }, [existingAsset, isEdit]);

  // Fetch categories from the database
  const { data: dbCategories } = trpc.assets.listCategories.useQuery();

  // Seed categories if DB is empty
  const createCategoryMutation = trpc.assets.createCategory.useMutation({
    onSuccess: () => { utils.assets.listCategories.invalidate(); },
  });

  useEffect(() => {
    if (dbCategories && dbCategories.length === 0) {
      // Seed the predefined categories into the database
      PREDEFINED_CATEGORIES.forEach((catName) => {
        createCategoryMutation.mutate({ name: catName });
      });
    }
  }, [dbCategories]);

  const [formError, setFormError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validate categoryId
    let categoryId: number | undefined = undefined;
    if (form.category && form.category !== "") {
      const parsed = Number(form.category);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        setFormError("Please select a valid asset category.");
        return;
      }
      categoryId = parsed;
    }

    const resolvedUnit = form.unitOfMeasure === "Other" ? form.unitOfMeasureOther : form.unitOfMeasure;
    const payload = {
      name: form.name,
      description: form.description || undefined,
      categoryId,
      status: form.status as any,
      condition: form.condition as any,
      manufacturer: form.manufacturer || undefined,
      model: form.model || undefined,
      serialNumber: form.serialNumber || undefined,
      barcodeType: form.barcodeType,
      location: form.location || undefined,
      building: form.building || undefined,
      floor: form.floor || undefined,
      room: form.room || undefined,
      department: form.department || undefined,
      assignedTo: form.assignedTo || undefined,
      custodian: form.custodian || undefined,
      addressStreet: form.addressStreet || undefined,
      addressCity: form.addressCity || undefined,
      addressState: form.addressState || undefined,
      addressZip: form.addressZip || undefined,
      parentAssetTag: form.parentAssetTag || undefined,
      acquisitionDate: form.acquisitionDate || undefined,
      acquisitionCost: form.acquisitionCost || undefined,
      currentValue: form.currentValue || undefined,
      salvageValue: form.salvageValue || undefined,
      usefulLifeYears: form.usefulLifeYears ? parseInt(form.usefulLifeYears) : undefined,
      warrantyExpiration: form.warrantyExpiration || undefined,
      quantity: parseInt(form.quantity) || 1,
      unitOfMeasure: resolvedUnit || "Each",
      notes: form.notes || undefined,
    };

    if (isEdit) {
      updateMutation.mutate({ id: assetId!, ...payload });
    } else {
      createMutation.mutate({ ...payload, projectId });
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.6rem 0.75rem",
    background: C.navy,
    border: `1px solid ${C.border}`,
    borderRadius: 6,
    color: C.text,
    fontSize: "0.9rem",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    color: C.textMuted,
    fontSize: "0.8rem",
    fontWeight: 600,
    marginBottom: "0.3rem",
    fontFamily: "'Source Sans 3', sans-serif",
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: "1.5rem",
    padding: "1.25rem",
    background: C.slate,
    borderRadius: 10,
    border: `1px solid ${C.border}`,
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem",
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
        {/* ─── Core Information ─────────────────────────────────────────── */}
        <div style={sectionStyle}>
          <h3 style={{ color: C.gold, fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem", fontFamily: "'Source Sans 3', sans-serif" }}>Core Information</h3>
          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>Asset Name *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="e.g., Dell OptiPlex 7090" />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                <option value="">— Select Category —</option>
                {dbCategories && dbCategories.map((cat) => (
                  <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                ))}
              </select>
              {formError && <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.3rem" }}>{formError}</p>}
              {dbCategories && dbCategories.find(c => c.id === Number(form.category))?.name === "Other — Describe" && (
                <input
                  type="text"
                  value={form.categoryOther}
                  onChange={(e) => setForm({ ...form, categoryOther: e.target.value })}
                  style={{ ...inputStyle, marginTop: "0.5rem" }}
                  placeholder="Describe the category..."
                  autoFocus
                />
              )}
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
                <option value="dam_op">Dam Op</option>
                <option value="dam_inop">Dam Inop</option>
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

        {/* ─── Manufacturer & Identification ────────────────────────────── */}
        <div style={sectionStyle}>
          <h3 style={{ color: C.gold, fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem", fontFamily: "'Source Sans 3', sans-serif" }}>Manufacturer & Identification</h3>
          <div style={gridStyle}>
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
                {BARCODE_TYPES.map((bt) => (
                  <option key={bt.value} value={bt.value}>{bt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ─── Location & Assignment ───────────────────────────────────── */}
        <div style={sectionStyle}>
          <h3 style={{ color: C.gold, fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem", fontFamily: "'Source Sans 3', sans-serif" }}>Location & Assignment</h3>
          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>Location / Site</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={inputStyle} placeholder="Site or campus name" />
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

          {/* Address Block */}
          <div style={{ marginTop: "1.25rem", padding: "1rem", background: C.navy, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <h4 style={{ color: C.silver, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.75rem", fontFamily: "'Source Sans 3', sans-serif" }}>Physical Address</h4>
            <div style={gridStyle}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Street Address</label>
                <input type="text" value={form.addressStreet} onChange={(e) => setForm({ ...form, addressStreet: e.target.value })} style={inputStyle} placeholder="123 Main Street" />
              </div>
              <div>
                <label style={labelStyle}>City</label>
                <input type="text" value={form.addressCity} onChange={(e) => setForm({ ...form, addressCity: e.target.value })} style={inputStyle} placeholder="City" />
              </div>
              <div>
                <label style={labelStyle}>State</label>
                <input type="text" value={form.addressState} onChange={(e) => setForm({ ...form, addressState: e.target.value })} style={inputStyle} placeholder="State" />
              </div>
              <div>
                <label style={labelStyle}>ZIP Code</label>
                <input type="text" value={form.addressZip} onChange={(e) => setForm({ ...form, addressZip: e.target.value })} style={inputStyle} placeholder="ZIP" />
              </div>
            </div>
          </div>
        </div>

        {/* ─── Room Bundling ───────────────────────────────────────────── */}
        <div style={sectionStyle}>
          <h3 style={{ color: C.gold, fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem", fontFamily: "'Source Sans 3', sans-serif" }}>Room / Bundle Grouping</h3>
          <p style={{ color: C.textMuted, fontSize: "0.8rem", marginBottom: "1rem" }}>
            Optionally assign this asset to a parent asset tag (e.g., a "Room" asset) to group multiple items under one location tag.
          </p>
          <div>
            <label style={labelStyle}>Parent Asset Tag</label>
            <input type="text" value={form.parentAssetTag} onChange={(e) => setForm({ ...form, parentAssetTag: e.target.value })} style={inputStyle} placeholder="e.g., LAI-ROOM01 (leave blank if standalone)" />
          </div>
        </div>

        {/* ─── Financial & Quantity ────────────────────────────────────── */}
        <div style={sectionStyle}>
          <h3 style={{ color: C.gold, fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem", fontFamily: "'Source Sans 3', sans-serif" }}>Financial & Quantity</h3>
          <div style={gridStyle}>
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
              <select value={form.unitOfMeasure} onChange={(e) => setForm({ ...form, unitOfMeasure: e.target.value })} style={inputStyle}>
                {UNITS_OF_MEASURE.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              {form.unitOfMeasure === "Other" && (
                <input
                  type="text"
                  value={form.unitOfMeasureOther}
                  onChange={(e) => setForm({ ...form, unitOfMeasureOther: e.target.value })}
                  style={{ ...inputStyle, marginTop: "0.5rem" }}
                  placeholder="Specify unit of measure..."
                  autoFocus
                />
              )}
            </div>
          </div>
        </div>

        {/* ─── Notes ──────────────────────────────────────────────────── */}
        <div style={sectionStyle}>
          <h3 style={{ color: C.gold, fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem", fontFamily: "'Source Sans 3', sans-serif" }}>Notes</h3>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, minHeight: 100, resize: "vertical" }} placeholder="Additional notes..." />
        </div>

        {/* ─── Submit ─────────────────────────────────────────────────── */}
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
