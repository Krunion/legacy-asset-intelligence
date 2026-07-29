import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { COLORS } from "@shared/colors";

const C = COLORS;

interface Props {
  onAssetFound: (id: number) => void;
}

export default function AssetScanner({ onAssetFound }: Props) {
  const [scanMode, setScanMode] = useState<"camera" | "manual">("manual");
  const [manualInput, setManualInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { data: foundAsset, refetch, isLoading } = trpc.assets.getByTag.useQuery(
    { tag: manualInput },
    { enabled: false }
  );

  // Camera scanning using ZXing
  useEffect(() => {
    if (scanMode !== "camera") {
      // Stop camera when switching away
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      return;
    }

    let cancelled = false;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setScanning(true);
        scanLoop();
      } catch (err: any) {
        setCameraError("Camera access denied. Use manual input or check permissions.");
      }
    };

    const scanLoop = async () => {
      // Dynamically import ZXing for camera scanning
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();

      try {
        await reader.decodeFromVideoDevice(undefined, videoRef.current!, (result, _err, controls) => {
          if (cancelled) { controls.stop(); return; }
          if (result) {
            controls.stop();
            setManualInput(result.getText());
            setScanMode("manual");
          }
        });
      } catch {
        // Camera scanning not available
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [scanMode]);

  const handleSearch = async () => {
    if (!manualInput.trim()) return;
    setError("");
    const result = await refetch();
    if (result.data) {
      onAssetFound(result.data.id);
    } else {
      setError(`No asset found with tag/serial: "${manualInput}"`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.text, marginBottom: "0.5rem" }}>
        Scan / Lookup Asset
      </h2>
      <p style={{ color: C.textMuted, fontSize: "0.9rem", marginBottom: "1.5rem" }}>
        Scan a barcode/QR code with your camera, use a USB/Bluetooth scanner, or type the asset tag manually.
      </p>

      {/* Mode Toggle */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button
          onClick={() => setScanMode("manual")}
          style={{ padding: "0.6rem 1.25rem", background: scanMode === "manual" ? `${C.gold}20` : C.slate, border: `1px solid ${scanMode === "manual" ? C.gold : C.border}`, borderRadius: 6, color: scanMode === "manual" ? C.gold : C.textMuted, cursor: "pointer", fontSize: "0.9rem" }}
        >
          ⌨ Manual / Scanner Input
        </button>
        <button
          onClick={() => setScanMode("camera")}
          style={{ padding: "0.6rem 1.25rem", background: scanMode === "camera" ? `${C.gold}20` : C.slate, border: `1px solid ${scanMode === "camera" ? C.gold : C.border}`, borderRadius: 6, color: scanMode === "camera" ? C.gold : C.textMuted, cursor: "pointer", fontSize: "0.9rem" }}
        >
          📷 Camera Scan
        </button>
      </div>

      {scanMode === "camera" ? (
        <div style={{ background: C.slate, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1.25rem", textAlign: "center" }}>
          {cameraError ? (
            <p style={{ color: "#EF4444", fontSize: "0.9rem" }}>{cameraError}</p>
          ) : (
            <>
              <video
                ref={videoRef}
                style={{ width: "100%", maxWidth: 500, borderRadius: 8, background: "#000" }}
                playsInline
                muted
              />
              <p style={{ color: C.textMuted, fontSize: "0.85rem", marginTop: "0.75rem" }}>
                {scanning ? "Point camera at barcode or QR code..." : "Starting camera..."}
              </p>
            </>
          )}
        </div>
      ) : (
        <div style={{ background: C.slate, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1.5rem" }}>
          <p style={{ color: C.textMuted, fontSize: "0.85rem", marginBottom: "1rem" }}>
            Type or scan an asset tag, serial number, or barcode value. USB/Bluetooth scanners work automatically — just scan and it types into the field below.
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <input
              type="text"
              value={manualInput}
              onChange={(e) => { setManualInput(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="Enter asset tag, serial number, or barcode..."
              autoFocus
              style={{ flex: 1, padding: "0.75rem 1rem", background: C.navy, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "1rem", outline: "none" }}
            />
            <button
              onClick={handleSearch}
              disabled={isLoading || !manualInput.trim()}
              style={{ padding: "0.75rem 1.5rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, cursor: "pointer", fontWeight: 600, fontSize: "0.9rem", whiteSpace: "nowrap" }}
            >
              {isLoading ? "Searching..." : "Look Up"}
            </button>
          </div>
          {error && <p style={{ color: "#EF4444", fontSize: "0.85rem", marginTop: "0.75rem" }}>{error}</p>}
        </div>
      )}

      {/* Tips */}
      <div style={{ marginTop: "1.5rem", background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1.25rem" }}>
        <h3 style={{ color: C.silver, fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.75rem" }}>Scanner Tips</h3>
        <ul style={{ color: C.textMuted, fontSize: "0.85rem", lineHeight: 1.8, paddingLeft: "1.25rem", margin: 0 }}>
          <li><strong style={{ color: C.text }}>USB/Bluetooth Scanners:</strong> Click the input field, then scan. The scanner types the value automatically and you can press Enter to search.</li>
          <li><strong style={{ color: C.text }}>Phone Camera:</strong> Switch to Camera Scan mode. Point at any Code 128, Code 39, or QR code.</li>
          <li><strong style={{ color: C.text }}>Manual:</strong> Type any asset tag (LAI-XXXXXX), serial number, or barcode value.</li>
        </ul>
      </div>
    </div>
  );
}
