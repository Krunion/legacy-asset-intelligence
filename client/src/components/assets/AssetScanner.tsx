import { useState, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { COLORS } from "@shared/colors";

const C = COLORS;

interface Props {
  projectId: number;
  onAssetFound: (id: number) => void;
  onAssetCreated?: (id: number) => void;
}

export default function AssetScanner({ projectId, onAssetFound, onAssetCreated }: Props) {
  const [scanMode, setScanMode] = useState<"camera" | "manual">("manual");
  const [manualInput, setManualInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [scanSuccess, setScanSuccess] = useState("");
  const [autoCreating, setAutoCreating] = useState(false);
  const [lastScannedValue, setLastScannedValue] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);
  const controlsRef = useRef<any>(null);

  const utils = trpc.useUtils();

  // Duplicate check query
  const { refetch: checkDuplicate } = trpc.assets.getByTag.useQuery(
    { tag: manualInput, projectId },
    { enabled: false }
  );

  // Auto-create mutation
  const createMutation = trpc.assets.create.useMutation({
    onSuccess: (data) => {
      setAutoCreating(false);
      setScanSuccess(`Asset created with tag: ${data.assetTag} (barcode: ${lastScannedValue})`);
      utils.assets.list.invalidate();
      utils.assets.stats.invalidate();
      if (onAssetCreated) {
        onAssetCreated(data.id);
      } else {
        onAssetFound(data.id);
      }
    },
    onError: (err) => {
      setAutoCreating(false);
      setError(`Failed to create asset: ${err.message}`);
    },
  });

  // ─── Camera Scanner using ZXing with proper configuration ──────────────────
  useEffect(() => {
    if (scanMode !== "camera") {
      stopScanning();
      return;
    }

    let cancelled = false;

    const startScanning = async () => {
      try {
        setCameraError("");
        setScanSuccess("");
        setError("");

        // Import ZXing modules
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        const { DecodeHintType, BarcodeFormat } = await import("@zxing/library");

        // Configure hints for better detection
        const hints = new Map();
        hints.set(DecodeHintType.TRY_HARDER, true);
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          BarcodeFormat.QR_CODE,
          BarcodeFormat.CODE_128,
          BarcodeFormat.CODE_39,
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E,
          BarcodeFormat.DATA_MATRIX,
          BarcodeFormat.PDF_417,
          BarcodeFormat.ITF,
          BarcodeFormat.CODABAR,
          BarcodeFormat.AZTEC,
        ]);

        // Create reader with hints and faster scan interval
        const reader = new BrowserMultiFormatReader(hints, {
          delayBetweenScanAttempts: 100, // Scan every 100ms for responsiveness
          delayBetweenScanSuccess: 500,
        });

        if (cancelled) return;

        // Use decodeFromConstraints which properly manages the video stream
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: "environment",
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
          },
          audio: false,
        };

        setScanning(true);

        const controls = await reader.decodeFromConstraints(
          constraints,
          videoRef.current!,
          (result, err) => {
            if (cancelled) return;
            if (result) {
              const scannedValue = result.getText();
              if (scannedValue && scannedValue.trim().length > 0) {
                // Success! Stop scanning and process result
                controls.stop();
                controlsRef.current = null;
                setScanning(false);
                handleScanResult(scannedValue.trim());
              }
            }
            // Don't log errors — ZXing fires NotFoundException on every frame without a barcode
          }
        );

        controlsRef.current = controls;

      } catch (err: any) {
        if (!cancelled) {
          console.error("Scanner error:", err);
          if (err.name === "NotAllowedError" || err.message?.includes("denied")) {
            setCameraError("Camera access denied. Please allow camera permissions in your browser settings, then try again.");
          } else if (err.name === "NotFoundError") {
            setCameraError("No camera found on this device. Use manual input instead.");
          } else if (err.name === "NotReadableError") {
            setCameraError("Camera is in use by another application. Close other apps using the camera and try again.");
          } else {
            setCameraError(`Camera error: ${err.message || "Unknown error"}. Try manual input.`);
          }
        }
      }
    };

    startScanning();

    return () => {
      cancelled = true;
      stopScanning();
    };
  }, [scanMode]);

  const stopScanning = () => {
    if (controlsRef.current) {
      try { controlsRef.current.stop(); } catch {}
      controlsRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setScanning(false);
  };

  // ─── Handle scan result: check duplicate, then auto-create ─────────────────
  const handleScanResult = useCallback(async (scannedValue: string) => {
    setManualInput(scannedValue);
    setLastScannedValue(scannedValue);
    setError("");
    setScanSuccess("");

    // Check if this barcode already exists
    const result = await checkDuplicate();

    if (result.data) {
      // Duplicate found — show the existing asset
      setScanSuccess(`Found existing asset: ${result.data.assetTag}`);
      onAssetFound(result.data.id);
    } else {
      // No duplicate — auto-create a new asset with this barcode value
      setAutoCreating(true);
      createMutation.mutate({
        projectId,
        name: `Scanned Asset — ${scannedValue}`,
        isReusableClientTag: true,
        clientBarcodeValue: scannedValue,
        barcodeType: detectBarcodeType(scannedValue),
        status: "active",
        condition: "good",
        notes: `Auto-created from barcode scan. Original barcode value: ${scannedValue}`,
      });
    }
  }, [projectId, checkDuplicate, createMutation, onAssetFound]);

  // Detect barcode type from scanned value
  const detectBarcodeType = (value: string): string => {
    // QR codes are typically longer and may contain URLs or structured data
    if (value.startsWith("http") || value.length > 50) return "qr";
    // UPC-A is exactly 12 digits
    if (/^\d{12}$/.test(value)) return "upca";
    // EAN-13 is exactly 13 digits
    if (/^\d{13}$/.test(value)) return "ean13";
    // EAN-8 is exactly 8 digits
    if (/^\d{8}$/.test(value)) return "ean13";
    // Code 39 uses uppercase letters, digits, and some special chars
    if (/^[A-Z0-9\-. $/+%*]+$/.test(value) && value.length <= 43) return "code39";
    // Default to Code 128 (most versatile)
    return "code128";
  };

  // ─── Manual search ─────────────────────────────────────────────────────────
  const handleSearch = async () => {
    if (!manualInput.trim()) return;
    setError("");
    setScanSuccess("");
    handleScanResult(manualInput.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleRescan = () => {
    setError("");
    setScanSuccess("");
    setManualInput("");
    setLastScannedValue("");
    setScanMode("camera");
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.text, marginBottom: "0.5rem" }}>
        Scan / Lookup Asset
      </h2>
      <p style={{ color: C.textMuted, fontSize: "0.9rem", marginBottom: "1.5rem" }}>
        Scan a barcode/QR code with your camera, use a USB/Bluetooth scanner, or type the asset tag manually.
        <br />
        <span style={{ color: C.gold, fontSize: "0.85rem" }}>
          If the scanned barcode is new, a new asset will be automatically created with that tag number.
        </span>
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

      {/* Success Message */}
      {scanSuccess && (
        <div style={{ marginBottom: "1rem", padding: "0.75rem 1rem", background: "#10B98120", border: "1px solid #10B981", borderRadius: 8 }}>
          <p style={{ color: "#10B981", fontSize: "0.9rem", margin: 0, fontWeight: 600 }}>✓ {scanSuccess}</p>
        </div>
      )}

      {/* Auto-creating indicator */}
      {autoCreating && (
        <div style={{ marginBottom: "1rem", padding: "0.75rem 1rem", background: `${C.gold}15`, border: `1px solid ${C.gold}`, borderRadius: 8 }}>
          <p style={{ color: C.gold, fontSize: "0.9rem", margin: 0, fontWeight: 600 }}>
            Creating new asset from scanned barcode: {lastScannedValue}...
          </p>
        </div>
      )}

      {scanMode === "camera" ? (
        <div style={{ background: C.slate, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1.25rem", textAlign: "center" }}>
          {cameraError ? (
            <div>
              <p style={{ color: "#EF4444", fontSize: "0.9rem", marginBottom: "1rem" }}>{cameraError}</p>
              <button
                onClick={() => { setCameraError(""); setScanMode("camera"); }}
                style={{ padding: "0.5rem 1rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}
              >
                Retry Camera
              </button>
            </div>
          ) : (
            <>
              <div style={{ position: "relative", display: "inline-block" }}>
                <video
                  ref={videoRef}
                  style={{ width: "100%", maxWidth: 500, borderRadius: 8, background: "#000", minHeight: 300 }}
                  playsInline
                  muted
                  autoPlay
                />
                {/* Scan guide overlay */}
                {scanning && (
                  <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "70%", height: "40%",
                    border: `2px solid ${C.gold}`,
                    borderRadius: 8,
                    pointerEvents: "none",
                    boxShadow: `0 0 0 9999px rgba(0,0,0,0.3)`,
                  }}>
                    {/* Corner markers */}
                    <div style={{ position: "absolute", top: -2, left: -2, width: 20, height: 20, borderTop: `3px solid ${C.gold}`, borderLeft: `3px solid ${C.gold}` }} />
                    <div style={{ position: "absolute", top: -2, right: -2, width: 20, height: 20, borderTop: `3px solid ${C.gold}`, borderRight: `3px solid ${C.gold}` }} />
                    <div style={{ position: "absolute", bottom: -2, left: -2, width: 20, height: 20, borderBottom: `3px solid ${C.gold}`, borderLeft: `3px solid ${C.gold}` }} />
                    <div style={{ position: "absolute", bottom: -2, right: -2, width: 20, height: 20, borderBottom: `3px solid ${C.gold}`, borderRight: `3px solid ${C.gold}` }} />
                    {/* Scanning line animation */}
                    <div style={{
                      position: "absolute", left: "5%", right: "5%",
                      height: 2, background: C.gold,
                      animation: "scanLine 2s ease-in-out infinite",
                    }} />
                  </div>
                )}
              </div>
              <p style={{ color: C.textMuted, fontSize: "0.85rem", marginTop: "0.75rem" }}>
                {scanning ? (
                  <span>
                    <span style={{ color: C.gold }}>●</span> Scanning... Position barcode within the frame
                  </span>
                ) : "Starting camera..."}
              </p>
              <p style={{ color: C.textMuted, fontSize: "0.75rem", marginTop: "0.25rem" }}>
                Hold steady • Ensure good lighting • Keep barcode flat and in focus
              </p>
              {scanning && (
                <button
                  onClick={() => setScanMode("manual")}
                  style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: C.navy, border: `1px solid ${C.border}`, borderRadius: 6, color: C.silver, cursor: "pointer", fontSize: "0.85rem" }}
                >
                  Switch to Manual Input
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <div style={{ background: C.slate, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1.5rem" }}>
          <p style={{ color: C.textMuted, fontSize: "0.85rem", marginBottom: "1rem" }}>
            Type or scan an asset tag, serial number, or barcode value. USB/Bluetooth scanners work automatically — just scan and it types into the field below.
            <br />
            <strong style={{ color: C.gold }}>If no matching asset is found, a new one will be created automatically.</strong>
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
              disabled={autoCreating || !manualInput.trim()}
              style={{ padding: "0.75rem 1.5rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, cursor: "pointer", fontWeight: 600, fontSize: "0.9rem", whiteSpace: "nowrap" }}
            >
              {autoCreating ? "Creating..." : "Look Up / Create"}
            </button>
          </div>
          {error && <p style={{ color: "#EF4444", fontSize: "0.85rem", marginTop: "0.75rem" }}>{error}</p>}
        </div>
      )}

      {/* Rescan button after result */}
      {(scanSuccess || error) && (
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <button
            onClick={handleRescan}
            style={{ padding: "0.6rem 1.5rem", background: `${C.gold}20`, border: `1px solid ${C.gold}`, borderRadius: 6, color: C.gold, cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}
          >
            📷 Scan Another
          </button>
        </div>
      )}

      {/* Tips */}
      <div style={{ marginTop: "1.5rem", background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1.25rem" }}>
        <h3 style={{ color: C.silver, fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.75rem" }}>Scanner Tips</h3>
        <ul style={{ color: C.textMuted, fontSize: "0.85rem", lineHeight: 1.8, paddingLeft: "1.25rem", margin: 0 }}>
          <li><strong style={{ color: C.text }}>USB/Bluetooth Scanners:</strong> Click the input field, then scan. The scanner types the value automatically and you can press Enter to search.</li>
          <li><strong style={{ color: C.text }}>Phone Camera:</strong> Switch to Camera Scan mode. Hold the barcode steady within the gold frame. Works with Code 128, Code 39, QR, EAN, UPC, Data Matrix, and more.</li>
          <li><strong style={{ color: C.text }}>Manual:</strong> Type any asset tag (LAI-XXXXXX), serial number, or barcode value.</li>
          <li><strong style={{ color: C.gold }}>Auto-Create:</strong> If the scanned barcode doesn't match an existing asset, a new asset is automatically created with that barcode as its identifier.</li>
        </ul>
      </div>

      {/* Hidden canvas for frame processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* CSS animation for scan line */}
      <style>{`
        @keyframes scanLine {
          0%, 100% { top: 10%; }
          50% { top: 85%; }
        }
      `}</style>
    </div>
  );
}
