import { useState } from "react";

interface VideoModalProps {
  phaseNumber: number;
  phaseName: string;
  description: string;
  videoUrl?: string;
  isYouTube?: boolean;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function VideoModal({ phaseNumber, phaseName, description, videoUrl, isYouTube }: VideoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const C = {
    slate: "#1E3A5F",
    teal: "#0D9488",
    amber: "#F59E0B",
    bg: "#F8FAFC",
    border: "#E2E8F0",
  };

  return (
    <>
      {/* Watch Video Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          background: C.teal,
          color: "white",
          padding: "0.75rem 1.5rem",
          borderRadius: 6,
          border: "none",
          fontFamily: "'Source Sans 3', sans-serif",
          fontWeight: 600,
          fontSize: "0.9rem",
          cursor: "pointer",
          transition: "all 0.2s",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.background = "#0B7A7B";
          (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.background = C.teal;
          (e.target as HTMLButtonElement).style.transform = "translateY(0)";
        }}
      >
        ▶ Watch Video
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          {/* Modal Content */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: 12,
              padding: "2rem",
              maxWidth: 800,
              width: "100%",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              position: "relative",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: C.slate,
              }}
            >
              ✕
            </button>

            {/* Modal Header */}
            <div style={{ marginBottom: "1.5rem" }}>
              <p
                style={{
                  color: C.teal,
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                Phase {phaseNumber}
              </p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: C.slate,
                  marginBottom: "0.5rem",
                }}
              >
                {phaseName}
              </h2>
              <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
                {description}
              </p>
            </div>

            {/* Video or Placeholder */}
            {videoUrl ? (
              isYouTube ? (
                <div
                  style={{
                    background: "#000",
                    borderRadius: 8,
                    overflow: "hidden",
                    marginBottom: "1.5rem",
                    aspectRatio: "16 / 9",
                  }}
                >
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${extractYouTubeId(videoUrl)}`}
                    title={phaseName}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    background: "#000",
                    borderRadius: 8,
                    overflow: "hidden",
                    marginBottom: "1.5rem",
                    aspectRatio: "16 / 9",
                  }}
                >
                  <video
                    width="100%"
                    height="100%"
                    controls
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )
            ) : (
              <>
                <div
                  style={{
                    background: C.bg,
                    border: `2px dashed ${C.border}`,
                    borderRadius: 8,
                    padding: "3rem",
                    textAlign: "center",
                    marginBottom: "1.5rem",
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎥</div>
                  <p
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontWeight: 600,
                      color: C.slate,
                      marginBottom: "0.5rem",
                    }}
                  >
                    Video Coming Soon
                  </p>
                  <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
                    This video will explain the Phase {phaseNumber} methodology and deliverables in detail.
                  </p>
                </div>

                {/* Placeholder Info */}
                <div
                  style={{
                    background: "rgba(13, 148, 136, 0.08)",
                    border: `1px solid rgba(13, 148, 136, 0.3)`,
                    borderRadius: 6,
                    padding: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <p style={{ color: C.slate, fontWeight: 600, marginBottom: "0.5rem" }}>
                    📝 Placeholder Information
                  </p>
                  <p style={{ color: "#64748B", fontSize: "0.9rem", margin: 0 }}>
                    This is a placeholder for the Phase {phaseNumber} video. The video URL can be added later to replace this placeholder.
                  </p>
                </div>
              </>
            )}

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: C.slate,
                color: "white",
                border: "none",
                borderRadius: 6,
                fontFamily: "'Source Sans 3', sans-serif",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
