import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { COLORS } from "@shared/colors";

const C = COLORS;

const NOTE_TYPES = [
  { value: "note", label: "Note", color: "#60A5FA" },
  { value: "addendum", label: "Addendum", color: "#F59E0B" },
  { value: "update", label: "Update", color: "#10B981" },
  { value: "issue", label: "Issue", color: "#EF4444" },
  { value: "resolution", label: "Resolution", color: "#8B5CF6" },
];

export default function ProjectNotes({ projectId }: { projectId: number }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    noteType: "note" as string,
    isInternal: false,
  });

  const utils = trpc.useUtils();
  const { data: notes, isLoading } = trpc.assets.listProjectNotes.useQuery({ projectId });

  const createMutation = trpc.assets.createProjectNote.useMutation({
    onSuccess: () => {
      utils.assets.listProjectNotes.invalidate({ projectId });
      setShowAdd(false);
      resetForm();
    },
  });

  const updateMutation = trpc.assets.updateProjectNote.useMutation({
    onSuccess: () => {
      utils.assets.listProjectNotes.invalidate({ projectId });
      setEditingId(null);
      resetForm();
    },
  });

  const deleteMutation = trpc.assets.deleteProjectNote.useMutation({
    onSuccess: () => {
      utils.assets.listProjectNotes.invalidate({ projectId });
    },
  });

  function resetForm() {
    setForm({ title: "", content: "", noteType: "note", isInternal: false });
  }

  function handleCreate() {
    if (!form.title.trim() || !form.content.trim()) return;
    createMutation.mutate({ projectId, title: form.title, content: form.content, noteType: form.noteType as any, isInternal: form.isInternal });
  }

  function handleUpdate() {
    if (!editingId || !form.title.trim() || !form.content.trim()) return;
    updateMutation.mutate({ id: editingId, title: form.title, content: form.content, noteType: form.noteType as any, isInternal: form.isInternal });
  }

  function startEdit(note: any) {
    setEditingId(note.id);
    setForm({
      title: note.title,
      content: note.content,
      noteType: note.noteType,
      isInternal: !!note.isInternal,
    });
    setShowAdd(false);
  }

  function handleDelete(id: number) {
    if (confirm("Delete this note permanently?")) {
      deleteMutation.mutate({ id });
    }
  }

  const getNoteTypeInfo = (type: string) => NOTE_TYPES.find((t) => t.value === type) || NOTE_TYPES[0];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.text, margin: "0 0 0.25rem" }}>
            Project Notes & Addendums
          </h2>
          <p style={{ color: C.textMuted, fontSize: "0.85rem", margin: 0 }}>
            Track project updates, addendums, issues, and resolutions
          </p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setEditingId(null); resetForm(); }}
          style={{ padding: "0.6rem 1.25rem", background: C.gold, border: "none", borderRadius: 8, color: C.charcoal, fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}
        >
          + Add Note
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAdd || editingId) && (
        <div style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ color: C.text, fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>
            {editingId ? "Edit Note" : "New Note"}
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", color: C.silver, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Note title..."
                style={{ width: "100%", padding: "0.6rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", color: C.silver, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Type</label>
              <select
                value={form.noteType}
                onChange={(e) => setForm({ ...form, noteType: e.target.value })}
                style={{ width: "100%", padding: "0.6rem 0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.9rem", outline: "none" }}
              >
                {NOTE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", color: C.silver, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write your note content here..."
              rows={6}
              style={{ width: "100%", padding: "0.75rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: "0.9rem", outline: "none", resize: "vertical", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.isInternal}
                onChange={(e) => setForm({ ...form, isInternal: e.target.checked })}
                style={{ width: 16, height: 16, accentColor: C.gold }}
              />
              <span style={{ color: C.textMuted, fontSize: "0.85rem" }}>Internal only (not visible to client)</span>
            </label>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => { setShowAdd(false); setEditingId(null); resetForm(); }}
                style={{ padding: "0.5rem 1rem", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={editingId ? handleUpdate : handleCreate}
                disabled={!form.title.trim() || !form.content.trim() || createMutation.isPending || updateMutation.isPending}
                style={{ padding: "0.5rem 1.25rem", background: C.gold, border: "none", borderRadius: 6, color: C.charcoal, fontWeight: 600, cursor: "pointer", opacity: (!form.title.trim() || !form.content.trim()) ? 0.5 : 1 }}
              >
                {editingId ? "Update" : "Save Note"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: C.textMuted }}>Loading notes...</div>
      ) : !notes || notes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: C.navy, borderRadius: 12, border: `1px solid ${C.border}` }}>
          <p style={{ color: C.textMuted, fontSize: "1rem", marginBottom: "0.5rem" }}>No notes yet</p>
          <p style={{ color: C.textMuted, fontSize: "0.85rem" }}>Add your first note to track project progress and addendums.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {notes.map((note) => {
            const typeInfo = getNoteTypeInfo(note.noteType);
            return (
              <div key={note.id} style={{ background: C.navy, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.25rem", borderLeft: `4px solid ${typeInfo.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                      <h4 style={{ color: C.text, fontSize: "1rem", fontWeight: 600, margin: 0 }}>{note.title}</h4>
                      <span style={{ padding: "0.15rem 0.5rem", background: `${typeInfo.color}20`, color: typeInfo.color, borderRadius: 4, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase" }}>
                        {typeInfo.label}
                      </span>
                      {note.isInternal ? (
                        <span style={{ padding: "0.15rem 0.5rem", background: "rgba(239,68,68,0.15)", color: "#EF4444", borderRadius: 4, fontSize: "0.7rem", fontWeight: 600 }}>
                          INTERNAL
                        </span>
                      ) : null}
                    </div>
                    <p style={{ color: C.textMuted, fontSize: "0.75rem", margin: 0 }}>
                      By {note.createdByName} — {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => startEdit(note)} style={{ padding: "0.3rem 0.6rem", background: C.slate, border: `1px solid ${C.border}`, borderRadius: 4, color: C.silver, cursor: "pointer", fontSize: "0.75rem" }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(note.id)} style={{ padding: "0.3rem 0.6rem", background: "transparent", border: `1px solid rgba(239,68,68,0.3)`, borderRadius: 4, color: "#EF4444", cursor: "pointer", fontSize: "0.75rem" }}>
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{ color: C.silver, fontSize: "0.9rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {note.content}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
