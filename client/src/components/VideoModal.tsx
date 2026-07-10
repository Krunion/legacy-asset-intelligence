interface VideoModalProps {
  phaseNumber: number;
  phaseName: string;
  description: string;
  videoUrl?: string;
  isYouTube?: boolean;
}

export default function VideoModal({ phaseNumber, phaseName, description, videoUrl, isYouTube }: VideoModalProps) {
  const C = {
    teal: "#0D9488",
  };

  const handleClick = () => {
    if (videoUrl) {
      window.open(videoUrl, "_blank");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!videoUrl}
      style={{
        background: videoUrl ? C.teal : "#64748B",
        color: "white",
        padding: "0.75rem 1.5rem",
        borderRadius: 6,
        border: "none",
        fontFamily: "'Source Sans 3', sans-serif",
        fontWeight: 600,
        fontSize: "0.9rem",
        cursor: videoUrl ? "pointer" : "not-allowed",
        transition: "all 0.16s cubic-bezier(0.23,1,0.32,1)",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        opacity: videoUrl ? 1 : 0.6,
      }}
      onMouseEnter={(e) => {
        if (videoUrl) {
          e.currentTarget.style.background = "#0B7A7B";
          e.currentTarget.style.transform = "scale(0.97)";
        }
      }}
      onMouseLeave={(e) => {
        if (videoUrl) {
          e.currentTarget.style.background = C.teal;
          e.currentTarget.style.transform = "scale(1)";
        }
      }}
    >
      ▶ {videoUrl ? "Watch Video" : "Coming Soon"}
    </button>
  );
}
