import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchExams, fetchSubmissions, fetchStudents } from "../../services/examService";
export default function TeacherHome({ onNavigate }) {
  const { token } = useAuth();

  const [data, setData] = useState({
    exams: [],
    submissions: [],
    students: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      console.error("Token missing");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const [e, s, st] = await Promise.all([
          fetchExams(token),
          fetchSubmissions(token),
          fetchStudents(token)
        ]);

        console.log("API DATA:", e, s, st); // DEBUG

        setData({
          exams: Array.isArray(e?.exams) ? e.exams : [],
          submissions: Array.isArray(s?.submissions) ? s.submissions : [],
          students: Array.isArray(st?.students) ? st.students : []
        });

      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner"></div>
        <span>Loading...</span>
      </div>
    );
  }

  const { exams, submissions, students } = data;

  const liveExams = exams.filter((e) => e?.status === "live").length;
  const pending = submissions.filter((s) => s?.status === "pending_review").length;

  return (
    <div className="fade-up">

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon">📝</div>
          <span className="stat-card__value">{exams.length}</span>
          <span className="stat-card__label">Total Exams</span>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon">🔴</div>
          <span className="stat-card__value">{liveExams}</span>
          <span className="stat-card__label">Live Now</span>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon">📋</div>
          <span className="stat-card__value">{submissions.length}</span>
          <span className="stat-card__label">Submissions</span>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon">⏳</div>
          <span className="stat-card__value">{pending}</span>
          <span className="stat-card__label">Pending Review</span>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon">🎓</div>
          <span className="stat-card__value">{students.length}</span>
          <span className="stat-card__label">Students</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <div className="section-title">⚡ Quick Actions</div>

        <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => onNavigate("create-exam")}>
            ✚ Create Exam
          </button>

          <button className="btn btn-ghost" onClick={() => onNavigate("submissions")}>
            📋 Review Submissions
          </button>

          <button className="btn btn-ghost" onClick={() => onNavigate("results")}>
            📊 View Results
          </button>

          <button className="btn btn-ghost" onClick={() => onNavigate("students")}>
            🎓 View Students
          </button>
        </div>
      </div>

      {/* Recent Exams */}
      <div className="section">
        <div className="section-title">📅 Recent Exams</div>

        {exams.length === 0 ? (
          <div className="card" style={{ padding: "2rem" }}>
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3>No exams yet</h3>
              <p>Create your first exam to get started.</p>
            </div>
          </div>
        ) : (
          <div className="card table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Questions</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>

              <tbody>
                {exams.slice(0, 5).map((exam) => (
                  <tr key={exam?._id || Math.random()}>
                    <td style={{ fontWeight: 600 }}>{exam?.title || "Untitled"}</td>
                    <td>{exam?.subject || "—"}</td>
                    <td>{exam?.questions?.length || 0}</td>

                    <td>
                      <span
                        className={`badge ${
                          exam?.status === "live"
                            ? "badge-success"
                            : exam?.status === "completed"
                            ? "badge-gray"
                            : "badge-info"
                        }`}
                      >
                        {exam?.status || "unknown"}
                      </span>
                    </td>

                    <td>
                      {exam?.createdAt
                        ? new Date(exam.createdAt).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

    </div>
  );
}