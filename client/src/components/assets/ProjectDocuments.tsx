import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { COLORS } from "@shared/colors";

const C = COLORS;

const DOC_TYPES = [
  { value: "contract", label: "Contract" },
  { value: "proposal", label: "Proposal" },
  { value: "report", label: "Report" },
  { value: "invoice", label: "Invoice" },
  { value: "correspondence", label: "Correspondence" },
  { value: "legal", label: "Legal" },
  { value: "insurance", label: "Insurance" },
  { value: "other", label: "Other" },
];

const ADMIN_EMAILS = [
  "kevin.runion@legacyassetintelligence.com",
  "chris.haynes@legacyassetintelligence.com",
];

// Component that fetches a direct signed URL for document download
function DocumentActionButtons({ docId }: { docId: number }) {
  const [loading, setLoading] = useState(false);
  const utils = trpc.useUtils();

  const handleDownload = useCallback(async () => {
    setLoading(true);
    try {
      const result = await utils.assets.getDocumentDownloadUrl.fetch({ documentId: docId });
      if (result?.url) {
        // Open the signed CloudFront URL directly in a new tab
        window.open(result.url, "_blank", "noopener,noreferrer");
      } else {
        alert("Could not get download URL. Please try again.");
      }
    } catch (err: any) {
      console.error("Download error:", err);
      alert("Download failed: " + (err?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [docId, utils]);

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      style={{
        padding: "0.4rem 0.75rem",
        background: COLORS.teal,
        border: "none",
        borderRadius: 6,
        color: "#fff",
        fontSize: "0.8rem",
        cursor: loading ? "wait" : "pointer",
        opacity: loading ? 0.7 : 1,
        fontWeight: 600,
      }}
    >
      {loading ? "Loading..." : "Download"}
    </button>
  );
}

export default function ProjectDocuments({ projectId }: { projectId: number }) {
  const { user } = useAuth();
  const isAdmin = ADMIN_EMAILS.includes(user?.email?.toLowerCase() || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState("other");
  const [description, setDescription] = useState("");
  const [isAdminOnly, setIsAdminOnly] = useState(true);

  const utils = trpc.useUtils();
  const { data: documents, isLoading } = trpc.assets.listProjectDocuments.useQuery({ projectId });

  const uploadMutation = trpc.assets.uploadProjectDocument.useMutation({
    onSuccess: () => {
      utils.assets.listProjectDocuments.invalidate({ projectId });
      setUploading(false);
      setDescription("");
      setDocType("other");
    },
    onError: (err) => {
      alert("Upload failed: " + err.message);
      setUploading(false);
    },
  });

  const deleteMutation = trpc.assets.deleteProjectDocument.useMutation({
    onSuccess: () => {
      utils.assets.listProjectDocuments.invalidate({ projectId });
    },
  });

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert("File size must be under 25MB.");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadMutation.mutate({
        projectId,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        fileSize: file.size,
        fileData: base64,
        documentType: docType as any,
        description: description.trim() || undefined,
        isAdminOnly,
      });
    };
    reader.readAsDataURL(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDelete(id: number) {
    if (confirm("Delete this document permanently?")) {
      deleteMutation.mutate({ id });
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  const getDocIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("image")) return "🖼";
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel") || mimeType.includes("csv")) return "📊";
    if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
    if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "📽";
    return "📎";
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.text, margin: "0 0 0.25rem" }}>
            Project Documents
          </h2>
          <p style={{ color: C.textMuted, fontSize: "0.85rem", margin: 0 }}>
            {isAdmin ? "Admin-only secure document storage for this project" : "Shared project documents"}
          </p>
        </div>
      </div>

      {/* Upload Section (Admin Only) */}
      {isAdmin && (
        <div style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ color: C.text, fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Upload Document</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", color: C.silver, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                style={{ width: "100%", padding: "0.6rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.9rem", outline: "none" }}
              >
                {DOC_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", color: C.silver, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Description (optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
                style={{ width: "100%", padding: "0.6rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={isAdminOnly}
                onChange={(e) => setIsAdminOnly(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: C.gold }}
              />
              <span style={{ color: C.textMuted, fontSize: "0.85rem" }}>Admin-only (hidden from team members)</span>
            </label>

            <label style={{ padding: "0.6rem 1.25rem", background: uploading ? C.textMuted : C.gold, border: "none", borderRadius: 8, color: C.charcoal, fontWeight: 600, cursor: uploading ? "not-allowed" : "pointer", fontSize: "0.9rem" }}>
              {uploading ? "Uploading..." : "Choose File & Upload"}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                disabled={uploading}
                style={{ display: "none" }}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt,.zip,.rar"
              />
            </label>
          </div>
        </div>
      )}

      {/* Documents List */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: C.textMuted }}>Loading documents...</div>
      ) : !documents || documents.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: C.navy, borderRadius: 12, border: `1px solid ${C.border}` }}>
          <p style={{ color: C.textMuted, fontSize: "1rem", marginBottom: "0.5rem" }}>No documents uploaded</p>
          <p style={{ color: C.textMuted, fontSize: "0.85rem" }}>
            {isAdmin ? "Upload important project documents that should be kept separate from team access." : "No shared documents available for this project."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {documents.map((doc) => (
            <div key={doc.id} style={{ background: C.navy, borderRadius: 10, border: `1px solid ${C.border}`, padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: "1.5rem" }}>{getDocIcon(doc.mimeType || "")}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                    <p style={{ color: C.text, fontSize: "0.9rem", fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {doc.fileName}
                    </p>
                    {doc.isAdminOnly ? (
                      <span style={{ padding: "0.1rem 0.4rem", background: "rgba(239,68,68,0.15)", color: "#EF4444", borderRadius: 4, fontSize: "0.65rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                        ADMIN ONLY
                      </span>
                    ) : null}
                  </div>
                  <div style={{ display: "flex", gap: "1rem", color: C.textMuted, fontSize: "0.75rem" }}>
                    <span>{(doc.documentType || "other").toUpperCase()}</span>
                    <span>{formatFileSize(doc.fileSize || 0)}</span>
                    <span>By {doc.uploadedByName}</span>
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                  {doc.description && (
                    <p style={{ color: C.textMuted, fontSize: "0.8rem", margin: "0.25rem 0 0" }}>{doc.description}</p>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
                <DocumentActionButtons docId={doc.id} />
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(doc.id)}
                    style={{ padding: "0.4rem 0.75rem", background: "transparent", border: `1px solid rgba(239,68,68,0.3)`, borderRadius: 6, color: "#EF4444", cursor: "pointer", fontSize: "0.8rem" }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
