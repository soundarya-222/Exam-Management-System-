import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../services/examService";

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function TeacherProfile() {
  const { user, token } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", department: user?.department || "" });
  const [msg,   setMsg]   = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg(""); setError(""); setSaving(true);
    try {
      await updateProfile(form, token);
      setMsg("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fade-up">
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-light) 100%)",
        borderRadius: "var(--radius-lg)", padding: "2rem",
        display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--accent), #f97316)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, color: "white",
          border: "3px solid rgba(255,255,255,0.25)", flexShrink: 0, position: "relative", zIndex: 1,
        }}>{getInitials(user?.name)}</div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <span style={{ background: "rgba(245,158,11,0.25)", color: "#fde68a", border: "1px solid rgba(245,158,11,0.4)", padding: "0.2rem 0.7rem", borderRadius: 99, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "inline-block", marginBottom: "0.4rem" }}>Teacher</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "white", marginBottom: "0.2rem" }}>{user?.name}</h2>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>{user?.email}</p>
        </div>
      </div>

      {msg   && <div className="alert alert-success" style={{ marginBottom: "1rem" }}>✓ {msg}</div>}
      {error && <div className="alert alert-error"   style={{ marginBottom: "1rem" }}>⚠ {error}</div>}

      <div className="card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div className="section-title" style={{ margin: 0 }}>📋 Profile Details</div>
          <button className="btn btn-ghost btn-sm" onClick={() => setEditing((e) => !e)}>
            {editing ? "Cancel" : "✏ Edit"}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSave} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input className="form-input" value={form.department} onChange={(e) => setForm(f => ({ ...f, department: e.target.value }))} />
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: "0.75rem" }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
              <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            {[
              ["Full Name",    user?.name],
              ["Email",        user?.email],
              ["Role",         "Teacher"],
              ["Department",   user?.department],
              ["Phone",        user?.phone],
              ["Member Since", user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "—"],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.2rem" }}>{label}</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 500 }}>{val || "—"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
