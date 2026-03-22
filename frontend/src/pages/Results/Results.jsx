import "./Results.css";
import { MOCK_RESULTS } from "../../services/mockData";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function pct(scored, total) {
  return Math.round((scored / total) * 100);
}



export default function Results() {
  const totalExams = MOCK_RESULTS.length;
  const avgScore = Math.round(
    MOCK_RESULTS.reduce((a, r) => a + pct(r.scored, r.totalMarks), 0) / totalExams
  );
  const bestRank = Math.min(...MOCK_RESULTS.map((r) => r.rank));
  const passed = MOCK_RESULTS.filter((r) => r.passed).length;

  return (
    <div className="results">
      {/* Summary Strip */}
      <div className="results__summary">
        <div className="results__summary-card">
          <div className="results__summary-icon">📋</div>
          <span className="results__summary-value">{totalExams}</span>
          <span className="results__summary-label">Total Exams</span>
        </div>
        <div className="results__summary-card">
          <div className="results__summary-icon">📈</div>
          <span className="results__summary-value">{avgScore}%</span>
          <span className="results__summary-label">Average Score</span>
        </div>
        <div className="results__summary-card">
          <div className="results__summary-icon">🏆</div>
          <span className="results__summary-value">#{bestRank}</span>
          <span className="results__summary-label">Best Rank</span>
        </div>
        <div className="results__summary-card">
          <div className="results__summary-icon">✅</div>
          <span className="results__summary-value">{passed}/{totalExams}</span>
          <span className="results__summary-label">Passed</span>
        </div>
      </div>

      {/* Result Cards */}
      <div className="results__list">
        {MOCK_RESULTS.map((result, i) => (
          <div
            key={result._id}
            className="result-card"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="result-card__top">
              <div className={`result-card__grade-circle grade--${result.grade}`}>
                {result.grade}
              </div>

              <div className="result-card__info">
                <div className="result-card__title">{result.examTitle}</div>
                <div className="result-card__meta">
                  <span className="result-card__meta-item">📚 {result.subject}</span>
                  <span className="result-card__meta-item">📅 {formatDate(result.date)}</span>
                  <span className="result-card__meta-item">🏅 Rank #{result.rank}</span>
                  <span className="result-card__meta-item">
                    {result.passed ? "✅ Passed" : "❌ Failed"}
                  </span>
                </div>
              </div>

              <div className="result-card__score-block">
                <span className="result-card__score-val">{result.scored}</span>
                <span className="result-card__score-total">/ {result.totalMarks}</span>
              </div>
            </div>

            <div className="result-card__bar-row">
              <div className="result-card__bar-wrap">
                <span className="result-card__bar-label">Your Score</span>
                <div className="result-card__bar">
                  <div
                    className="result-card__bar-fill fill--student"
                    style={{ width: `${pct(result.scored, result.totalMarks)}%` }}
                  />
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700 }}>
                  {pct(result.scored, result.totalMarks)}%
                </span>
              </div>
              <div className="result-card__bar-wrap">
                <span className="result-card__bar-label">Class Avg</span>
                <div className="result-card__bar">
                  <div
                    className="result-card__bar-fill fill--class"
                    style={{ width: `${pct(result.classAverage, result.totalMarks)}%` }}
                  />
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                  {pct(result.classAverage, result.totalMarks)}%
                </span>
              </div>
            </div>

            {result.feedback && (
              <div className="result-card__feedback">
                💬 <em>{result.feedback}</em>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
