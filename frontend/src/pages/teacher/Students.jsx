import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchStudents } from "../../services/examService";

function StudentDetail({ student, onBack }) {
  return (
    <div className="fade-up">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: "1rem" }} onClick={onBack}>
        ← Back to Students
      </button>

      {/* Profile card */}
      <div className="card" style={{ padding: "1.5rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.25rem" }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 800, color: "white", flexShrink: 0,
          }}>
            {student.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 700 }}>{student.name}</div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{student.email}</div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.35rem", flexWrap: "wrap" }}>
              {student.enrollmentNo && <span className="badge badge-gray">{student.enrollmentNo}</span>}
              {student.department   && <span className="badge badge-info">{student.department}</span>}
              {student.semester     && <span className="badge badge-primary">{student.semester}</span>}
            </div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800, color: "var(--primary)" }}>
              {student.avgScore !== null ? `${student.avgScore}%` : "—"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Avg Score</div>
          </div>
        </div>
      </div>

      {/* Submission history */}
      <div className="section-title">📋 Exam History ({student.submissions?.length || 0})</div>
      {!student.submissions?.length ? (
        <div className="empty-state card" style={{ padding: "2rem" }}>
          <div className="empty-state-icon">📭</div>
          <h3>No submissions</h3>
          <p>This student hasn't submitted any exams yet.</p>
        </div>
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr><th>Exam</th><th>Subject</th><th>Score</th><th>Grade</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {student.submissions.map((sub, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{sub.examTitle || "—"}</td>
                  <td>{sub.subject || "—"}</td>
                  <td>{sub.score}/{sub.maxScore} <span style={{ color: "var(--text-secondary)", fontSize: "0.78rem" }}>({sub.percentage}%)</span></td>
                  <td>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: sub.grade?.startsWith("A") ? "var(--success)" : sub.grade === "F" ? "var(--danger)" : "var(--primary)" }}>
                      {sub.grade || "—"}
                    </span>
                  </td>
                  <td><span className={`badge ${sub.status === "graded" ? "badge-success" : "badge-warning"}`}>{sub.status}</span></td>
                  <td style={{ fontSize: "0.8rem" }}>{new Date(sub.submittedAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Students() {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [selected, setSelected] = useState(null);
  const [search,   setSearch]   = useState("");

  useEffect(() => {
    fetchStudents(token)
      .then((d) => setStudents(d.students))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="loading-center"><div className="spinner"/><span>Loading students...</span></div>;
  if (error)   return <div className="alert alert-error">⚠ {error}</div>;

  if (selected) return <StudentDetail student={selected} onBack={() => setSelected(null)} />;

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.enrollmentNo || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-up">
      {/* Search */}
      <div style={{ marginBottom: "1.25rem" }}>
        <input
          className="form-input"
          placeholder="🔍 Search by name, email or enrollment no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      {!filtered.length ? (
        <div className="empty-state card" style={{ padding: "3rem" }}>
          <div className="empty-state-icon">🎓</div>
          <h3>No students found</h3>
          <p>{search ? "Try a different search." : "No students registered yet."}</p>
        </div>
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Enrollment No.</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Exams</th>
                <th>Avg Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, i) => (
                <tr key={student._id} style={{ animationDelay: `${i * 0.04}s` }}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                        background: "var(--primary)", color: "white",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-display)", fontSize: "0.7rem", fontWeight: 800,
                      }}>
                        {student.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <span style={{ fontWeight: 600 }}>{student.name}</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{student.email}</td>
                  <td>{student.enrollmentNo || "—"}</td>
                  <td>{student.department || "—"}</td>
                  <td>{student.semester || "—"}</td>
                  <td style={{ fontWeight: 600 }}>{student.totalExams}</td>
                  <td>
                    {student.avgScore !== null ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: 60, height: 5, background: "var(--bg)", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${student.avgScore}%`, background: student.avgScore >= 70 ? "var(--success)" : student.avgScore >= 50 ? "var(--warning)" : "var(--danger)", borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>{student.avgScore}%</span>
                      </div>
                    ) : "—"}
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelected(student)}>
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
