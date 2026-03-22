import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchStudents } from "../../services/examService";

function StudentDetail({ student, onBack }) {
  return (
    <div className="section">
      <button className="btn btn-ghost" onClick={onBack}>
        ← Back to Students
      </button>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h2>{student?.name || "Student"}</h2>
        <p>{student?.email || "—"}</p>
        <p>
          {student?.enrollmentNo || "—"} {student?.department ? `• ${student.department}` : ""}{" "}
          {student?.semester ? `• Semester ${student.semester}` : ""}
        </p>
        <p>Avg Score: {student?.avgScore !== null && student?.avgScore !== undefined ? `${student.avgScore}%` : "—"}</p>
      </div>

      <div className="section-title" style={{ marginTop: "1rem" }}>
        Exam History ({student?.submissions?.length || 0})
      </div>

      {!student?.submissions?.length ? (
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3>No submissions</h3>
          <p>This student has not submitted any exams yet.</p>
        </div>
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Exam</th>
                <th>Subject</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {student.submissions.map((sub, i) => (
                <tr key={sub?._id || i}>
                  <td>{sub?.examTitle || "—"}</td>
                  <td>{sub?.subject || "—"}</td>
                  <td>
                    {sub?.score ?? 0}/{sub?.maxScore ?? 0} ({sub?.percentage ?? 0}%)
                  </td>
                  <td>{sub?.grade || "—"}</td>
                  <td>{sub?.status || "—"}</td>
                  <td>
                    {sub?.submittedAt ? new Date(sub.submittedAt).toLocaleDateString("en-IN") : "—"}
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

export default function Students() {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetchStudents(token)
      .then((d) => setStudents(Array.isArray(d?.students) ? d.students : []))
      .catch((e) => setError(e.message || "Failed to load students"))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      const name = s?.name || "";
      const email = s?.email || "";
      const enrollment = s?.enrollmentNo || "";
      return (
        name.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q) ||
        enrollment.toLowerCase().includes(q)
      );
    });
  }, [students, search]);

  if (loading) return <div className="loading-center">Loading students...</div>;
  if (error) return <div className="alert-error">⚠ {error}</div>;
  if (selected) return <StudentDetail student={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="fade-up">
      <div className="section">
        <div className="section-title">Students</div>
        <input
          className="form-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or enrollment number"
          style={{ maxWidth: 400 }}
        />
      </div>

      {!filtered.length ? (
        <div className="card" style={{ padding: "1.5rem" }}>
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
                <tr key={student?._id || i}>
                  <td>{student?.name || "—"}</td>
                  <td>{student?.email || "—"}</td>
                  <td>{student?.enrollmentNo || "—"}</td>
                  <td>{student?.department || "—"}</td>
                  <td>{student?.semester || "—"}</td>
                  <td>{student?.totalExams ?? 0}</td>
                  <td>{student?.avgScore !== null && student?.avgScore !== undefined ? `${student.avgScore}%` : "—"}</td>
                  <td>
                    <button className="btn btn-ghost" onClick={() => setSelected(student)}>
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