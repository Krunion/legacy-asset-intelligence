import { useState, useEffect, useRef } from "react";
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
    onSuccess: (data) => {
      // After creating the asset, upload any pending photos
      if (pendingPhotos.length > 0 && data.id) {
        uploadPendingPhotos(data.id);
      } else {
        utils.assets.list.invalidate();
        utils.assets.stats.invalidate();
        onSuccess();
      }
    },
  });

  const updateMutation = trpc.assets.update.useMutation({
    onSuccess: () => { utils.assets.list.invalidate(); utils.assets.getById.invalidate(); onSuccess(); },
  });

  const uploadPhotoMutation = trpc.assets.uploadPhoto.useMutation({
    onSuccess: () => {
      setPhotosUploaded((prev) => prev + 1);
    },
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
    isReusableClientTag: false,
    clientBarcodeValue: "",
  });

  // ─── Photo State ────────────────────────────────────────────────────────────
  const [pendingPhotos, setPendingPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [photosUploaded, setPhotosUploaded] = useState(0);
  const [photoUploading, setPhotoUploading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // ─── Barcode Scanner State ──────────────────────────────────────────────────
  const [showScanner, setShowScanner] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [scanError, setScanError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Upload pending photos after asset creation
  const uploadPendingPhotos = async (assetId: number) => {
    setPhotoUploading(true);
    for (let i = 0; i < pendingPhotos.length; i++) {
      const photo = pendingPhotos[i];
      const base64 = await fileToBase64(photo.file);
      uploadPhotoMutation.mutate({
        assetId,
        fileName: photo.file.name,
        mimeType: photo.file.type,
        base64Data: base64,
        isPrimary: i === 0,
      });
    }
  };

  // Track when all photos are uploaded
  useEffect(() => {
    if (photoUploading && photosUploaded >= pendingPhotos.length && pendingPhotos.length > 0) {
      setPhotoUploading(false);
      utils.assets.list.invalidate();
      utils.assets.stats.invalidate();
      onSuccess();
    }
  }, [photosUploaded, pendingPhotos.length, photoUploading]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // ─── Camera Scanner Logic ──────────────────────────────────────────────────
  useEffect(() => {
    if (!showScanner) {
      stopCamera();
      return;
    }

    let cancelled = false;

    const startCamera = async () => {
      try {
        setScanError("");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setScannerActive(true);
        startDecoding();
      } catch (err: any) {
        setScanError("Camera access denied. Check permissions or use manual input.");
      }
    };

    const startDecoding = async () => {
      try {
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        const reader = new BrowserMultiFormatReader();
        await reader.decodeFromVideoDevice(undefined, videoRef.current!, (result, _err, controls) => {
          if (cancelled) { controls.stop(); return; }
          if (result) {
            controls.stop();
            const scannedValue = result.getText();
            setScanResult(scannedValue);
            handleScanResult(scannedValue);
            setShowScanner(false);
          }
        });
      } catch {
        setScanError("Barcode scanning not available on this device.");
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [showScanner]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setScannerActive(false);
  };

  // Handle scanned barcode result — auto-populate fields
  const handleScanResult = (value: string) => {
    // Set the client barcode value
    setForm((prev) => ({
      ...prev,
      clientBarcodeValue: value,
      serialNumber: prev.serialNumber || value, // Auto-fill serial if empty
    }));
  };

  // ─── Photo Capture ─────────────────────────────────────────────────────────
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: { file: File; preview: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newPhotos.push({ file, preview: URL.createObjectURL(file) });
    }
    setPendingPhotos((prev) => [...prev, ...newPhotos]);
    // Reset input so same file can be selected again
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    setPendingPhotos((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

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
        isReusableClientTag: (existingAsset as any).isReusableClientTag === 1,
        clientBarcodeValue: (existingAsset as any).clientBarcodeValue || "",
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
      isReusableClientTag: form.isReusableClientTag,
      clientBarcodeValue: form.clientBarcodeValue || undefined,
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

  const isSubmitting = createMutation.isPending || updateMutation.isPending || photoUploading;

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
        {/* ─── Reusable Client Tag Checkbox ─────────────────────────────── */}
        <div style={{ ...sectionStyle, background: form.isReusableClientTag ? `${C.gold}10` : C.slate, borderColor: form.isReusableClientTag ? C.gold : C.border }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <input
              type="checkbox"
              id="reusableClientTag"
              checked={form.isReusableClientTag}
              onChange={(e) => setForm({ ...form, isReusableClientTag: e.target.checked })}
              style={{ width: 20, height: 20, accentColor: C.gold, cursor: "pointer" }}
            />
            <label htmlFor="reusableClientTag" style={{ color: C.text, fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif" }}>
              Reusable Client Tag
            </label>
          </div>
          <p style={{ color: C.textMuted, fontSize: "0.8rem", marginTop: "0.5rem", marginLeft: "2.75rem" }}>
            Check this if you are keeping and reusing the client's existing asset tag/barcode. The scanned barcode value will be preserved as the asset's barcode.
          </p>

          {form.isReusableClientTag && (
            <div style={{ marginTop: "1rem", marginLeft: "2.75rem", padding: "1rem", background: C.navy, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Client Barcode Value</label>
                  <input
                    type="text"
                    value={form.clientBarcodeValue}
                    onChange={(e) => setForm({ ...form, clientBarcodeValue: e.target.value })}
                    style={inputStyle}
                    placeholder="Scan or type the client's existing barcode value..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  style={{
                    marginTop: "1.2rem",
                    padding: "0.6rem 1rem",
                    background: C.gold,
                    border: "none",
                    borderRadius: 6,
                    color: C.charcoal,
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  Scan Barcode
                </button>
              </div>
              {scanResult && (
                <p style={{ color: "#10B981", fontSize: "0.8rem", margin: 0 }}>
                  ✓ Scanned: {scanResult}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ─── Barcode Scanner Modal ──────────────────────────────────────── */}
        {showScanner && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.9)", zIndex: 9999,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "1rem",
          }}>
            <div style={{ maxWidth: 600, width: "100%", textAlign: "center" }}>
              <h3 style={{ color: C.text, fontSize: "1.2rem", marginBottom: "1rem", fontFamily: "'Playfair Display', serif" }}>
                Scan Client Barcode
              </h3>
              <p style={{ color: C.textMuted, fontSize: "0.85rem", marginBottom: "1rem" }}>
                Point your camera at the client's existing barcode or QR code
              </p>

              {scanError ? (
                <div style={{ padding: "1.5rem", background: C.slate, borderRadius: 10, border: `1px solid ${C.border}` }}>
                  <p style={{ color: "#EF4444", fontSize: "0.9rem" }}>{scanError}</p>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  style={{ width: "100%", maxWidth: 500, borderRadius: 10, background: "#000", border: `2px solid ${C.gold}` }}
                  playsInline
                  muted
                />
              )}

              <p style={{ color: C.textMuted, fontSize: "0.8rem", marginTop: "0.75rem" }}>
                {scannerActive ? "Scanning... hold steady" : "Starting camera..."}
              </p>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowScanner(false)}
                  style={{ padding: "0.75rem 1.5rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 8, color: C.silver, cursor: "pointer", fontSize: "0.9rem" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

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

          {/* Inline Barcode Scanner Button */}
          {!form.isReusableClientTag && (
            <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: C.navy, borderRadius: 8, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: C.text, fontSize: "0.85rem", fontWeight: 600, margin: 0 }}>Scan Existing Barcode</p>
                <p style={{ color: C.textMuted, fontSize: "0.75rem", margin: "0.2rem 0 0 0" }}>Use camera to scan and auto-fill serial number from barcode</p>
              </div>
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                style={{
                  padding: "0.5rem 1rem",
                  background: `${C.gold}20`,
                  border: `1px solid ${C.gold}`,
                  borderRadius: 6,
                  color: C.gold,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                Scan
              </button>
            </div>
          )}
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

        {/* ─── Photo Capture ──────────────────────────────────────────── */}
        <div style={sectionStyle}>
          <h3 style={{ color: C.gold, fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem", fontFamily: "'Source Sans 3', sans-serif" }}>Asset Photos</h3>
          <p style={{ color: C.textMuted, fontSize: "0.8rem", marginBottom: "1rem" }}>
            Take photos of the asset with your mobile device camera or upload from your gallery. Photos are stored securely and linked to this asset record.
          </p>

          {/* Photo Capture Button */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            <button
              type="button"
              onClick={() => {
                if (photoInputRef.current) {
                  photoInputRef.current.setAttribute("capture", "environment");
                  photoInputRef.current.click();
                }
              }}
              style={{
                padding: "0.75rem 1.25rem",
                background: C.gold,
                border: "none",
                borderRadius: 8,
                color: C.charcoal,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Take Photo
            </button>
            <button
              type="button"
              onClick={() => {
                if (photoInputRef.current) {
                  photoInputRef.current.removeAttribute("capture");
                  photoInputRef.current.click();
                }
              }}
              style={{
                padding: "0.75rem 1.25rem",
                background: `${C.gold}20`,
                border: `1px solid ${C.gold}`,
                borderRadius: 8,
                color: C.gold,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Upload from Gallery
            </button>
          </div>

          {/* Hidden file input */}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoCapture}
            style={{ display: "none" }}
          />

          {/* Photo Previews */}
          {pendingPhotos.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "0.75rem" }}>
              {pendingPhotos.map((photo, idx) => (
                <div key={idx} style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}`, aspectRatio: "1" }}>
                  <img
                    src={photo.preview}
                    alt={`Photo ${idx + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    style={{
                      position: "absolute", top: 4, right: 4,
                      width: 24, height: 24,
                      background: "rgba(239,68,68,0.9)",
                      border: "none", borderRadius: "50%",
                      color: "white", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.75rem", fontWeight: 700,
                    }}
                  >
                    ✕
                  </button>
                  {idx === 0 && (
                    <span style={{
                      position: "absolute", bottom: 4, left: 4,
                      background: C.gold, color: C.charcoal,
                      padding: "0.15rem 0.4rem", borderRadius: 4,
                      fontSize: "0.65rem", fontWeight: 700,
                    }}>
                      PRIMARY
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Existing photos (edit mode) */}
          {isEdit && existingAsset?.photos && existingAsset.photos.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <p style={{ color: C.textMuted, fontSize: "0.8rem", marginBottom: "0.5rem" }}>Existing Photos:</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.5rem" }}>
                {existingAsset.photos.map((photo: any) => (
                  <div key={photo.id} style={{ borderRadius: 6, overflow: "hidden", border: `1px solid ${C.border}`, aspectRatio: "1" }}>
                    <img src={photo.storageUrl} alt={photo.fileName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            </div>
          )}
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
            {isSubmitting ? (photoUploading ? "Uploading Photos..." : "Saving...") : isEdit ? "Update Asset" : "Create Asset"}
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
