import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchSubmissions, gradeSubmission } from "../../services/examService";

function ScoreBar({ pct }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div style={{ flex: 1, height: 6, background: "var(--bg)", borderRadius: 99, overflow: "hidden", minWidth: 80 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, var(--primary-light), var(--success))", borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary)", minWidth: 36 }}>{pct}%</span>
    </div>
  );
}

function LongAnswerGrader({ submission, onGraded }) {
  const { token } = useAuth();
  const [grades, setGrades] = useState({});
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving]     = useState(false);
  const [error,  setError]      = useState("");

  const longAnswers = submission.answers?.filter((a) => a.type === "long") || [];

  const handleGrade = async () => {
    setSaving(true); setError("");
    try {
      const answerGrades = Object.entries(grades).map(([questionId, marksAwarded]) => ({
        questionId, marksAwarded: Number(marksAwarded),
      }));
      await gradeSubmission(submission._id, { answerGrades, teacherFeedback: feedback }, token);
      onGraded();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="lag-panel fade-up">
      <div className="lag-header">
        <h3>📝 Long Answer Evaluation</h3>
        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
          Student: <strong>{submission.student?.name}</strong> — {submission.exam?.title}
        </p>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: "1rem" }}>⚠ {error}</div>}

      {longAnswers.map((ans, i) => {
        const q = submission.exam?.questions?.find((q) => q._id === ans.questionId?.toString());
        return (
          <div key={i} className="lag-answer">
            <div className="lag-q-text">
              Q: {q?.questionText || ans.questionText || "Question"}
              <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "var(--accent)", fontWeight: 700 }}>({q?.marks || 0} marks)</span>
            </div>
            <div className="lag-student-ans">{ans.longAnswer || <em style={{ color: "var(--text-light)" }}>No answer provided</em>}</div>
            <div className="form-group lag-marks">
              <label className="form-label">Marks Awarded (max {q?.marks || 0})</label>
              <input
                type="number" min="0" max={q?.marks || 0}
                value={grades[ans.questionId?.toString()] ?? ""}
                onChange={(e) => setGrades((g) => ({ ...g, [ans.questionId?.toString()]: e.target.value }))}
                className="form-input" style={{ width: 100 }}
                placeholder="0"
              />
            </div>
          </div>
        );
      })}

      <div className="form-group">
        <label className="form-label">Teacher Feedback (optional)</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="form-textarea" rows={3}
          placeholder="Write feedback for the student..."
        />
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
        <button className="btn btn-primary" onClick={handleGrade} disabled={saving}>
          {saving ? "Saving..." : "Submit Grades ✓"}
        </button>
      </div>
    </div>
  );
}

export default function Submissions() {
  const { token } = useAuth();
  const [subs,    setSubs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [grading, setGrading] = useState(null); // submission being graded

  const load = () => {
    setLoading(true);
    fetchSubmissions(token)
      .then((d) => setSubs(d.submissions))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  if (loading) return <div className="loading-center"><div className="spinner"/><span>Loading submissions...</span></div>;
  if (error)   return <div className="alert alert-error">⚠ {error}</div>;

  if (grading) {
    return (
      <div className="fade-up">
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: "1rem" }} onClick={() => setGrading(null)}>
          ← Back to Submissions
        </button>
        <LongAnswerGrader
          submission={grading}
          onGraded={() => { setGrading(null); load(); }}
        />
      </div>
    );
  }

  if (!subs.length) return (
    <div className="empty-state card" style={{ padding: "3rem" }}>
      <div className="empty-state-icon">📭</div>
      <h3>No submissions yet</h3>
      <p>Students haven't submitted any exams yet.</p>
    </div>
  );

  return (
    <div className="fade-up">
      <div className="card table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Exam</th>
              <th>Type</th>
              <th>Score</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((sub) => {
              const hasLong = sub.answers?.some((a) => a.type === "long");
              return (
                <tr key={sub._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{sub.student?.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{sub.student?.enrollmentNo}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{sub.exam?.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{sub.exam?.subject}</div>
                  </td>
                  <td>
                    <span className={`badge ${hasLong ? "badge-primary" : "badge-info"}`}>
                      {hasLong ? "Long / MCQ" : "MCQ"}
                    </span>
                  </td>
                  <td>
                    <div style={{ minWidth: 120 }}>
                      <ScoreBar pct={sub.percentage} />
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                        {sub.totalScore}/{sub.maxScore}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.95rem",
                      color: sub.grade?.startsWith("A") ? "var(--success)" : sub.grade === "F" ? "var(--danger)" : "var(--primary)",
                    }}>{sub.grade || "—"}</span>
                  </td>
                  <td>
                    <span className={`badge ${sub.status === "graded" ? "badge-success" : sub.status === "pending_review" ? "badge-warning" : "badge-gray"}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                    {new Date(sub.submittedAt).toLocaleDateString("en-IN")}
                  </td>
                  <td>
                    {sub.status === "pending_review" ? (
                      <button className="btn btn-primary btn-sm" onClick={() => setGrading(sub)}>
                        Grade
                      </button>
                    ) : (
                      <button className="btn btn-ghost btn-sm" onClick={() => setGrading(sub)}>
                        View
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
