import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { COLORS } from "@shared/colors";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";

const C = COLORS;

interface Props {
  assetId: number;
  onBack: () => void;
  onEdit: () => void;
}

export default function AssetDetail({ assetId, onBack, onEdit }: Props) {
  const { data: asset, isLoading } = trpc.assets.getById.useQuery({ id: assetId });
  const utils = trpc.useUtils();
  const barcodeRef = useRef<SVGSVGElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const deleteMutation = trpc.assets.delete.useMutation({
    onSuccess: () => { utils.assets.list.invalidate(); utils.assets.stats.invalidate(); onBack(); },
  });

  const uploadPhotoMutation = trpc.assets.uploadPhoto.useMutation({
    onSuccess: () => { utils.assets.getById.invalidate({ id: assetId }); setPhotoUploading(false); },
  });

  // Generate barcode
  useEffect(() => {
    if (asset && barcodeRef.current && asset.barcodeType !== "qr") {
      try {
        JsBarcode(barcodeRef.current, asset.barcodeValue || asset.assetTag, {
          format: asset.barcodeType === "code39" ? "CODE39" : "CODE128",
          width: 2,
          height: 60,
          displayValue: true,
          fontSize: 14,
          background: "transparent",
          lineColor: "#FFFFFF",
        });
      } catch (e) {
        console.error("Barcode generation failed:", e);
      }
    }
  }, [asset]);

  // Generate QR code
  useEffect(() => {
    if (asset && qrCanvasRef.current && asset.barcodeType === "qr") {
      QRCode.toCanvas(qrCanvasRef.current, asset.barcodeValue || asset.assetTag, {
        width: 150,
        margin: 1,
        color: { dark: "#FFFFFF", light: "#00000000" },
      });
    }
  }, [asset]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadPhotoMutation.mutate({
        assetId,
        fileName: file.name,
        mimeType: file.type,
        base64Data: base64,
        isPrimary: !asset?.photos?.length,
      });
    };
    reader.readAsDataURL(file);
  };

  const handlePrintLabel = () => {
    const printWindow = window.open("", "_blank", "width=400,height=300");
    if (!printWindow) return;

    const barcodeHtml = asset?.barcodeType === "qr"
      ? `<canvas id="qr"></canvas><script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.4/build/qrcode.min.js"><\/script><script>QRCode.toCanvas(document.getElementById('qr'),'${asset.barcodeValue || asset.assetTag}',{width:120});<\/script>`
      : `<svg id="barcode"></svg><script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.12.3/dist/JsBarcode.all.min.js"><\/script><script>JsBarcode('#barcode','${asset?.barcodeValue || asset?.assetTag}',{format:'CODE128',width:2,height:50,displayValue:true,fontSize:12});<\/script>`;

    printWindow.document.write(`<!DOCTYPE html><html><head><title>Label - ${asset?.assetTag}</title><style>body{font-family:Arial,sans-serif;padding:10px;text-align:center}h3{margin:4px 0;font-size:14px}p{margin:2px 0;font-size:11px}@media print{body{padding:0}}</style></head><body><h3>${asset?.name}</h3><p>${asset?.assetTag}</p>${barcodeHtml}<p style="margin-top:8px;font-size:10px">${asset?.location || ""} ${asset?.department || ""}</p><script>setTimeout(()=>{window.print();window.close()},500)<\/script></body></html>`);
    printWindow.document.close();
  };

  if (isLoading) {
    return <div style={{ padding: "2rem", textAlign: "center", color: C.textMuted }}>Loading asset details...</div>;
  }

  if (!asset) {
    return <div style={{ padding: "2rem", textAlign: "center", color: C.textMuted }}>Asset not found.</div>;
  }

  const infoRow = (label: string, value: string | number | null | undefined) => (
    value ? (
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: `1px solid ${C.border}` }}>
        <span style={{ color: C.textMuted, fontSize: "0.85rem" }}>{label}</span>
        <span style={{ color: C.text, fontSize: "0.85rem", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{value}</span>
      </div>
    ) : null
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <button onClick={onBack} style={{ padding: "0.4rem 0.8rem", background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
            ← Back to Assets
          </button>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.text, margin: 0 }}>
            {asset.name}
          </h2>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.gold, fontSize: "0.9rem" }}>{asset.assetTag}</span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={handlePrintLabel} style={{ padding: "0.5rem 1rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.silver, cursor: "pointer", fontSize: "0.85rem" }}>
            🖨 Print Label
          </button>
          <button onClick={onEdit} style={{ padding: "0.5rem 1rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>
            Edit
          </button>
          <button
            onClick={() => { if (confirm("Delete this asset permanently?")) deleteMutation.mutate({ id: assetId }); }}
            style={{ padding: "0.5rem 1rem", background: "#DC262620", border: `1px solid #DC262640`, borderRadius: 6, color: "#EF4444", cursor: "pointer", fontSize: "0.85rem" }}
          >
            Delete
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem", alignItems: "start" }} className="asset-detail-grid">
        {/* Left: Info */}
        <div>
          {/* Core Info */}
          <div style={{ background: C.slate, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1.25rem", marginBottom: "1.25rem" }}>
            <h3 style={{ color: C.gold, fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.75rem" }}>Core Information</h3>
            {infoRow("Status", asset.status.replace("_", " ").toUpperCase())}
            {infoRow("Condition", asset.condition)}
            {infoRow("Manufacturer", asset.manufacturer)}
            {infoRow("Model", asset.model)}
            {infoRow("Serial Number", asset.serialNumber)}
            {infoRow("Quantity", `${asset.quantity} ${asset.unitOfMeasure || "each"}`)}
            {infoRow("Description", asset.description)}
          </div>

          {/* Location */}
          <div style={{ background: C.slate, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1.25rem", marginBottom: "1.25rem" }}>
            <h3 style={{ color: C.gold, fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.75rem" }}>Location & Assignment</h3>
            {infoRow("Location", asset.location)}
            {infoRow("Building", asset.building)}
            {infoRow("Floor", asset.floor)}
            {infoRow("Room", asset.room)}
            {infoRow("Department", asset.department)}
            {infoRow("Assigned To", asset.assignedTo)}
            {infoRow("Custodian", asset.custodian)}
          </div>

          {/* Financial */}
          <div style={{ background: C.slate, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1.25rem", marginBottom: "1.25rem" }}>
            <h3 style={{ color: C.gold, fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.75rem" }}>Financial</h3>
            {infoRow("Acquisition Date", asset.acquisitionDate ? new Date(asset.acquisitionDate).toLocaleDateString() : null)}
            {infoRow("Acquisition Cost", asset.acquisitionCost ? `$${parseFloat(asset.acquisitionCost).toLocaleString()}` : null)}
            {infoRow("Current Value", asset.currentValue ? `$${parseFloat(asset.currentValue).toLocaleString()}` : null)}
            {infoRow("Salvage Value", asset.salvageValue ? `$${parseFloat(asset.salvageValue).toLocaleString()}` : null)}
            {infoRow("Useful Life", asset.usefulLifeYears ? `${asset.usefulLifeYears} years` : null)}
            {infoRow("Warranty Expires", asset.warrantyExpiration ? new Date(asset.warrantyExpiration).toLocaleDateString() : null)}
          </div>

          {/* Photos */}
          <div style={{ background: C.slate, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <h3 style={{ color: C.gold, fontSize: "0.85rem", fontWeight: 600, margin: 0 }}>Photos</h3>
              <label style={{ padding: "0.4rem 0.8rem", background: C.navy, border: `1px solid ${C.border}`, borderRadius: 6, color: C.silver, cursor: "pointer", fontSize: "0.8rem" }}>
                {photoUploading ? "Uploading..." : "+ Add Photo"}
                <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} style={{ display: "none" }} />
              </label>
            </div>
            {asset.photos?.length ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "0.75rem" }}>
                {asset.photos.map((photo) => (
                  <div key={photo.id} style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}`, aspectRatio: "1", position: "relative" }}>
                    <img
                      src={photo.storageUrl}
                      alt={photo.caption || "Asset photo"}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        // If proxy fails, try to load via signed URL
                        const img = e.currentTarget;
                        if (!img.dataset.retried) {
                          img.dataset.retried = "1";
                          // Fetch signed URL from server
                          fetch(`/api/trpc/assets.getPhotoSignedUrl?batch=1&input=${encodeURIComponent(JSON.stringify({"0":{"photoId":photo.id}}))}`)
                            .then(r => r.json())
                            .then(data => {
                              if (data?.[0]?.result?.data?.url) {
                                img.src = data[0].result.data.url;
                              }
                            })
                            .catch(() => {});
                        }
                      }}
                    />
                    {photo.isPrimary === 1 && (
                      <span style={{ position: "absolute", top: 4, left: 4, background: C.gold, color: C.navy, fontSize: "0.6rem", fontWeight: 700, padding: "2px 5px", borderRadius: 3 }}>PRIMARY</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: C.textMuted, fontSize: "0.85rem", textAlign: "center", padding: "1rem 0" }}>No photos yet. Use the button above or your phone camera to add one.</p>
            )}
          </div>
        </div>

        {/* Right: Barcode/QR */}
        <div ref={printRef}>
          <div style={{ background: C.slate, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1.25rem", textAlign: "center" }}>
            <h3 style={{ color: C.gold, fontSize: "0.85rem", fontWeight: 600, marginBottom: "1rem" }}>
              {asset.barcodeType === "qr" ? "QR Code" : "Barcode"}
            </h3>
            {asset.barcodeType === "qr" ? (
              <canvas ref={qrCanvasRef} style={{ maxWidth: "100%" }} />
            ) : (
              <svg ref={barcodeRef} style={{ maxWidth: "100%" }} />
            )}
            <p style={{ color: C.textMuted, fontSize: "0.75rem", marginTop: "0.75rem" }}>
              Scan this code to look up this asset
            </p>
            <button onClick={handlePrintLabel} style={{ marginTop: "0.75rem", padding: "0.5rem 1.25rem", background: C.navy, border: `1px solid ${C.border}`, borderRadius: 6, color: C.silver, cursor: "pointer", fontSize: "0.85rem", width: "100%" }}>
              🖨 Print Label
            </button>
          </div>

          {/* Notes */}
          {asset.notes && (
            <div style={{ background: C.slate, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1.25rem", marginTop: "1.25rem" }}>
              <h3 style={{ color: C.gold, fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>Notes</h3>
              <p style={{ color: C.textMuted, fontSize: "0.85rem", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{asset.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Responsive grid override */}
      <style>{`
        @media (max-width: 768px) {
          .asset-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
