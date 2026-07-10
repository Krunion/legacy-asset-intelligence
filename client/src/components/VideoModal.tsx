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
    /youtube\.com\/shorts\/([^&\n?#]+)/,
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

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
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
          (e.currentTarget as HTMLButtonElement).style.background = "#0B7A7B";
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = C.teal;
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
        }}
      >
        ▶ Watch Video
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          onClick={handleClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "2rem",
          }}
        >
          {/* Modal Content */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: 12,
              padding: "1.5rem",
              maxWidth: 900,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              position: "relative",
            }}
          >
            {/* Close Button - X in top right */}
            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                top: "0.75rem",
                right: "0.75rem",
                background: "#EF4444",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
                color: "white",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10001,
                lineHeight: 1,
                fontWeight: 700,
              }}
              aria-label="Close video modal"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div style={{ marginBottom: "1rem", paddingRight: "2.5rem" }}>
              <p
                style={{
                  color: C.teal,
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "0.4rem",
                }}
              >
                Phase {phaseNumber}
              </p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: C.slate,
                  marginBottom: "0.4rem",
                }}
              >
                {phaseName}
              </h2>
              <p style={{ color: "#64748B", fontSize: "0.9rem", margin: 0 }}>
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
                    marginBottom: "1rem",
                    width: "100%",
                    position: "relative",
                    paddingBottom: "56.25%", /* 16:9 aspect ratio */
                    height: 0,
                  }}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(videoUrl)}?autoplay=1&rel=0`}
                    title={phaseName}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    background: "#000",
                    borderRadius: 8,
                    overflow: "hidden",
                    marginBottom: "1rem",
                    width: "100%",
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                  }}
                >
                  <video
                    controls
                    autoPlay
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )
            ) : (
              <div
                style={{
                  background: C.bg,
                  border: `2px dashed ${C.border}`,
                  borderRadius: 8,
                  padding: "3rem",
                  textAlign: "center",
                  marginBottom: "1rem",
                  minHeight: 250,
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
            )}

            {/* Bottom Close Button */}
            <button
              onClick={handleClose}
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
