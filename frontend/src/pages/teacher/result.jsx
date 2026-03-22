import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchExams, fetchExamResults } from "../../services/examService";

function ScoreBar({ pct }) {
  return (
    <div className="score-bar">
      <div className="score-bar__fill" style={{ width: `${Math.max(0, Math.min(100, pct || 0))}%` }} />
      <span>{pct || 0}%</span>
    </div>
  );
}

function ExamResults({ exam, onBack }) {
  const { token } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await fetchExamResults(exam._id, token);
        setResults(Array.isArray(data?.results) ? data.results : []);
      } catch (e) {
        setError(e.message || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [exam._id, token]);

  if (loading) return <div className="loading-center">Loading results...</div>;
  if (error) return <div className="alert-error">⚠ {error}</div>;

  return (
    <div className="fade-up">
      <button className="btn btn-ghost" onClick={onBack}>
        ← Back to Exams
      </button>

      <div style={{ marginTop: "1rem" }}>
        <div className="section-title">Results for: {exam.title}</div>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
          {exam.subject} • {exam.questions?.length || 0} questions • {results.length} submissions
        </p>

        {!results.length ? (
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3>No results yet</h3>
            <p>Results will appear here once students submit exams and they are evaluated.</p>
          </div>
        ) : (
          <div className="card table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Published</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, i) => (
                  <tr key={result?._id || i}>
                    <td>{result?.student?.name || "—"}</td>
                    <td>
                      {result?.totalMarks || 0} / {exam?.totalMarks || 0}
                    </td>
                    <td>
                      <ScoreBar pct={result?.percentage || 0} />
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          result?.status === "checked"
                            ? "badge-success"
                            : result?.status === "pending_review"
                            ? "badge-warning"
                            : "badge-info"
                        }`}
                      >
                        {result?.status || "unknown"}
                      </span>
                    </td>
                    <td>
                      {result?.submittedAt
                        ? new Date(result.submittedAt).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                    <td>
                      {result?.published ? (
                        <span style={{ color: "var(--success)", fontWeight: "600" }}>✓ Published</span>
                      ) : (
                        <span style={{ color: "var(--text-secondary)" }}>Not published</span>
                      )}
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

export default function Results() {
  const { token } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    const loadExams = async () => {
      try {
        const data = await fetchExams(token);
        // Only show exams that have been completed or have submissions
        const completedExams = (Array.isArray(data?.exams) ? data.exams : [])
          .filter(exam => exam.status === "completed" || exam.status === "live");
        setExams(completedExams);
      } catch (e) {
        setError(e.message || "Failed to load exams");
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, [token]);

  if (loading) return <div className="loading-center">Loading exams...</div>;
  if (error) return <div className="alert-error">⚠ {error}</div>;

  if (selectedExam) {
    return <ExamResults exam={selectedExam} onBack={() => setSelectedExam(null)} />;
  }

  return (
    <div className="fade-up">
      <div className="section-title">Exam Results</div>

      {!exams.length ? (
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3>No completed exams</h3>
          <p>Results will be available once exams are completed and evaluated.</p>
        </div>
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Exam Title</th>
                <th>Subject</th>
                <th>Questions</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam, i) => (
                <tr key={exam?._id || i}>
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
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setSelectedExam(exam)}
                    >
                      View Results
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
