import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { COLORS } from "@shared/colors";

const C = COLORS;

interface ProjectSelectorProps {
  selectedProjectId: number | null;
  onSelect: (projectId: number, projectName: string, clientName: string) => void;
  label?: string;
  showProjectId?: boolean;
}

/**
 * Reusable project dropdown that syncs with Asset Management projects.
 * Shows: Client Name — Project Name (ID: xxx)
 * Loads from the same assetProjects table used by Asset Management.
 */
export default function ProjectSelector({
  selectedProjectId,
  onSelect,
  label = "Select Project",
  showProjectId = true,
}: ProjectSelectorProps) {
  const { data: projects, isLoading } = trpc.assets.listProjects.useQuery();
  const [isOpen, setIsOpen] = useState(false);

  const selectedProject = projects?.find((p: any) => p.id === selectedProjectId);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-project-selector]")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <div data-project-selector style={{ position: "relative", marginBottom: "1rem" }}>
      <label style={{ display: "block", color: C.silver, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "0.65rem 1rem",
          background: C.slate,
          border: `1px solid ${selectedProjectId ? C.gold : C.border}`,
          borderRadius: 8,
          color: selectedProject ? C.text : C.textMuted,
          cursor: "pointer",
          fontSize: "0.9rem",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "border-color 0.15s ease",
        }}
      >
        <span>
          {isLoading ? "Loading projects..." : selectedProject ? (
            <>
              <span style={{ color: C.gold, fontWeight: 600 }}>{selectedProject.clientName}</span>
              <span style={{ color: C.textMuted }}> — </span>
              <span style={{ color: C.text }}>{selectedProject.name}</span>
              {showProjectId && (
                <span style={{ color: C.textMuted, fontSize: "0.75rem", marginLeft: "0.5rem" }}>
                  (ID: {selectedProject.id})
                </span>
              )}
            </>
          ) : "Choose a project..."}
        </span>
        <span style={{ color: C.textMuted, fontSize: "0.8rem" }}>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          marginTop: 4,
          background: C.navy,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          zIndex: 100,
          maxHeight: 280,
          overflowY: "auto",
        }}>
          {!projects?.length ? (
            <div style={{ padding: "1.5rem", textAlign: "center", color: C.textMuted, fontSize: "0.85rem" }}>
              No projects found. Create a project in Asset Management first.
            </div>
          ) : (
            projects.map((project: any) => (
              <button
                key={project.id}
                onClick={() => {
                  onSelect(project.id, project.name, project.clientName);
                  setIsOpen(false);
                }}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: project.id === selectedProjectId ? `${C.gold}15` : "transparent",
                  border: "none",
                  borderBottom: `1px solid ${C.border}`,
                  color: C.text,
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "0.85rem",
                  transition: "background 0.1s ease",
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.background = `${C.gold}10`; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.background = project.id === selectedProjectId ? `${C.gold}15` : "transparent"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ color: C.gold, fontWeight: 600 }}>{project.clientName}</span>
                    <span style={{ color: C.textMuted }}> — </span>
                    <span style={{ color: C.text }}>{project.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{
                      padding: "0.15rem 0.5rem",
                      background: project.status === "active" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                      color: project.status === "active" ? "#10B981" : "#F59E0B",
                      borderRadius: 4,
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}>
                      {project.status}
                    </span>
                    {showProjectId && (
                      <span style={{ color: C.textMuted, fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace" }}>
                        #{project.id}
                      </span>
                    )}
                  </div>
                </div>
                {project.clientContact && (
                  <div style={{ color: C.textMuted, fontSize: "0.75rem", marginTop: "0.2rem" }}>
                    Contact: {project.clientContact}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
