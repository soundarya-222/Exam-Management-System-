import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../services/examService";
import "./TeacherProfile.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function TeacherProfile() {
  const { user, token } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    department: user?.department || "",
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setSaving(true);

    try {
      await updateProfile(form, token);
      setMsg("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fade-up">
      <div className="profile-hero">
        <div className="profile-avatar">{getInitials(user?.name)}</div>
        <div>
          <div className="profile-role">Teacher</div>
          <h2>{user?.name || "Teacher"}</h2>
          <p>{user?.email || "—"}</p>
        </div>
      </div>

      {msg && <div className="alert-success">✓ {msg}</div>}
      {error && <div className="alert-error">⚠ {error}</div>}

      <div className="section">
        <div className="section-title">Profile Details</div>
        <button className="btn btn-ghost" onClick={() => setEditing((v) => !v)}>
          {editing ? "Cancel" : "✏ Edit"}
        </button>

        {editing ? (
          <form onSubmit={handleSave} className="profile-form">
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Full Name"
            />
            <input
              className="form-input"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="Phone"
            />
            <input
              className="form-input"
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              placeholder="Department"
            />

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="detail-grid">
            {[
              ["Full Name", user?.name],
              ["Email", user?.email],
              ["Role", "Teacher"],
              ["Department", user?.department],
              ["Phone", user?.phone],
              [
                "Member Since",
                user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—",
              ],
            ].map(([label, val]) => (
              <div className="detail-item" key={label}>
                <div className="detail-label">{label}</div>
                <div className="detail-value">{val || "—"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}