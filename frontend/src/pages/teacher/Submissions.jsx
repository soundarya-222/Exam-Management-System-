import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchSubmissions, gradeSubmission, publishResult } from "../../services/examService";

function ScoreBar({ pct }) {
  return (
    <div className="score-bar">
      <div className="score-bar__fill" style={{ width: `${Math.max(0, Math.min(100, pct || 0))}%` }} />
      <span>{pct || 0}%</span>
    </div>
  );
}

function LongAnswerGrader({ submission, onGraded }) {
  const { token } = useAuth();
  const [grades, setGrades] = useState({});
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const longAnswers = submission?.answers?.filter((a) => {
    const question = submission?.exam?.questions?.find(q => q._id === a.questionId);
    return question?.type === 'THEORY' || question?.type === 'CODING';
  }) || [];

  const handleGrade = async () => {
    setSaving(true);
    setError("");

    try {
      const answerGrades = Object.entries(grades).map(([questionId, marksAwarded]) => ({
        questionId,
        marksAwarded: Number(marksAwarded),
      }));

      await gradeSubmission(submission._id, { answerGrades, teacherFeedback: feedback }, token);
      onGraded();
    } catch (e) {
      setError(e.message || "Failed to submit grades");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: "1rem" }}>
      <h3>Long Answer Evaluation</h3>
      <p>
        Student: {submission?.student?.name || "—"} — {submission?.exam?.title || "—"}
      </p>

      {error && <div className="alert-error">⚠ {error}</div>}

      {longAnswers.map((ans, i) => {
        const q = submission?.exam?.questions?.find((question) => question._id === ans.questionId?.toString());

        return (
          <div className="card" key={ans?.questionId || i} style={{ marginTop: "1rem" }}>
            <p>
              <strong>Q:</strong> {q?.questionText || ans?.questionText || "Question"} ({q?.marks || 0} marks)
            </p>
            <p>{ans?.longAnswer || "No answer provided"}</p>

            <input
              className="form-input"
              type="number"
              min="0"
              max={q?.marks || 0}
              placeholder="0"
              value={grades[ans.questionId?.toString()] || ""}
              onChange={(e) =>
                setGrades((g) => ({
                  ...g,
                  [ans.questionId?.toString()]: e.target.value,
                }))
              }
              style={{ width: 120 }}
            />
          </div>
        );
      })}

      <textarea
        className="form-input"
        rows={4}
        placeholder="Teacher feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        style={{ marginTop: "1rem" }}
      />

      <button className="btn btn-primary" onClick={handleGrade} disabled={saving} style={{ marginTop: "1rem" }}>
        {saving ? "Saving..." : "Submit Grades"}
      </button>
    </div>
  );
}

export default function Submissions() {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [publishing, setPublishing] = useState(null);

  const load = useCallback(async () => {
    try {
      const d = await fetchSubmissions(token);
      setSubmissions(Array.isArray(d?.submissions) ? d.submissions : []);
    } catch (e) {
      setError(e.message || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handlePublish = async (submissionId) => {
    setPublishing(submissionId);
    try {
      await publishResult(submissionId, token);
      await load(); // Reload to update the published status
    } catch (error) {
      alert("Failed to publish result: " + error.message);
    } finally {
      setPublishing(null);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    load();
  }, [token, load]);

  if (loading) return <div className="loading-center">Loading submissions...</div>;
  if (error) return <div className="alert-error">⚠ {error}</div>;

  if (selected) {
    return (
      <div className="fade-up">
        <button className="btn btn-ghost" onClick={() => setSelected(null)}>
          ← Back
        </button>
        <div style={{ marginTop: "1rem" }}>
          <LongAnswerGrader submission={selected} onGraded={load} />
        </div>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <div className="section-title">Submissions</div>

      {!submissions.length ? (
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3>No submissions yet</h3>
          <p>Student attempts will appear here.</p>
        </div>
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Exam</th>
                <th>Score</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, i) => (
                <tr key={sub?._id || i}>
                  <td>{sub?.student?.name || "—"}</td>
                  <td>{sub?.exam?.title || "—"}</td>
                  <td>
                    <ScoreBar pct={sub?.percentage || 0} />
                  </td>
                  <td>{sub?.status || "—"}</td>
                  <td>{sub?.submittedAt ? new Date(sub.submittedAt).toLocaleDateString("en-IN") : "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelected(sub)}>
                        Review
                      </button>
                      {sub?.status === "checked" && !sub?.published && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handlePublish(sub._id)}
                          disabled={publishing === sub._id}
                        >
                          {publishing === sub._id ? "Publishing..." : "Publish"}
                        </button>
                      )}
                      {sub?.published && (
                        <span style={{ color: "var(--success)", fontWeight: "600" }}>Published</span>
                      )}
                    </div>
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