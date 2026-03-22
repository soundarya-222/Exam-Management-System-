import "./Profile.css";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { fetchProfile } from "../../services/authService";
import { getToken } from "../../utils/auth";

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = getToken();
        if (token) {
          const data = await fetchProfile(token);
          setProfile(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const displayUser = profile || user;

  if (loading) {
    return <div className="profile">Loading...</div>;
  }

  const roleBadge = displayUser?.role === 'teacher' ? '👨‍🏫 Teacher' : '🎓 Student';

  return (
    <div className="profile">
      {/* Hero Banner */}
      <div className="profile__hero">
        <div className="profile__avatar">{getInitials(displayUser?.name)}</div>
        <div className="profile__hero-info">
          <div className="profile__role-badge">{roleBadge}</div>
          <h2 className="profile__name">{displayUser?.name}</h2>
          <p className="profile__email">{displayUser?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="profile__card" style={{ marginBottom: "1.2rem" }}>
        <div className="profile__stats">
          <div className="profile__stat">
            <span className="profile__stat-value">—</span>
            <span className="profile__stat-label">Exams Done</span>
          </div>
          <div className="profile__stat">
            <span className="profile__stat-value">—</span>
            <span className="profile__stat-label">Avg Score</span>
          </div>
          <div className="profile__stat">
            <span className="profile__stat-value">—</span>
            <span className="profile__stat-label">Upcoming</span>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="profile__grid">
        {/* Academic Info */}
        <div className="profile__card">
          <div className="profile__card-title">🏫 Academic Details</div>
          <div className="profile__fields">
            <div className="profile__field">
              <span className="profile__field-label">Enrollment No.</span>
              <span className="profile__field-value">{displayUser?.enrollmentNo || "—"}</span>
            </div>
            <div className="profile__field">
              <span className="profile__field-label">Department</span>
              <span className="profile__field-value">{displayUser?.department || "—"}</span>
            </div>
            <div className="profile__field">
              <span className="profile__field-label">Semester</span>
              <span className="profile__field-value">{displayUser?.semester || "—"}</span>
            </div>
            <div className="profile__field">
              <span className="profile__field-label">Joined On</span>
              <span className="profile__field-value">{formatDate(displayUser?.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="profile__card">
          <div className="profile__card-title">📋 Personal Details</div>
          <div className="profile__fields">
            <div className="profile__field">
              <span className="profile__field-label">Full Name</span>
              <span className="profile__field-value">{displayUser?.name}</span>
            </div>
            <div className="profile__field">
              <span className="profile__field-label">Email Address</span>
              <span className="profile__field-value">{displayUser?.email}</span>
            </div>
            <div className="profile__field">
              <span className="profile__field-label">Phone</span>
              <span className="profile__field-value">{displayUser?.phone || "—"}</span>
            </div>
            <div className="profile__field">
              <span className="profile__field-label">Role</span>
              <span className="profile__field-value" style={{ textTransform: "capitalize" }}>
                {displayUser?.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
