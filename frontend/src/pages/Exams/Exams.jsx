import { useState, useEffect } from "react";
import { fetchExams } from "../../services/examService";
import { MOCK_EXAMS } from "../../services/mockData";
import "./Exams.css";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function CurrentExams({ exams, onAttemptExam }) {
  const publishedExams = exams.filter(exam => exam.status === "published");

  return (
    <div className="exams__list">
      {publishedExams.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No published exams</h3>
          <p>Check back later for new exams.</p>
        </div>
      ) : (
        publishedExams.map((exam, i) => (
          <div
            key={exam._id}
            className="exam-card exam-card--live"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className="exam-card__icon">📝</div>
            <div className="exam-card__body">
              <div className="exam-card__header">
                <span className="exam-card__title">{exam.title}</span>
                <span className="exam-card__badge badge--published">🟢 Published</span>
              </div>
              <div className="exam-card__meta">
                <span className="exam-card__meta-item">📚 {exam.subject}</span>
                <span className="exam-card__meta-item">⏱ {exam.duration} mins</span>
                <span className="exam-card__meta-item">🎯 {exam.totalMarks} marks</span>
                <span className="exam-card__meta-item">❓ {exam.questions?.length || 0} questions</span>
                <span className="exam-card__meta-item">👨‍🏫 {exam.teacher}</span>
              </div>
              {exam.description && (
                <div className="exam-card__instruction">
                  📌 {exam.description}
                </div>
              )}
              <div className="exam-card__actions">
                <button
                  className="btn btn-primary"
                  onClick={() => onAttemptExam(exam)}
                >
                  Start Exam
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function Notices() {
  return (
    <div className="notices__list">
      {MOCK_EXAMS.notices.map((notice, i) => (
        <div
          key={notice._id}
          className={`notice-card${notice.priority === "high" ? " notice-card--high" : ""}`}
          style={{ animationDelay: `${i * 0.07}s` }}
        >
          <div className="notice-card__icon">
            {notice.priority === "high" ? "🚨" : "📢"}
          </div>
          <div>
            <div className="notice-card__title">{notice.title}</div>
            <div className="notice-card__msg">{notice.message}</div>
            <div className="notice-card__date">{formatDate(notice.date)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SubmittedExams({ submittedExams }) {
  return (
    <div className="exams__list">
      {submittedExams.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No submitted exams</h3>
          <p>Your submitted exam history will appear here.</p>
        </div>
      ) : (
        submittedExams.map((sub, i) => (
          <div
            key={sub._id}
            className="exam-card"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className="exam-card__icon">✅</div>
            <div className="exam-card__body">
              <div className="exam-card__header">
                <span className="exam-card__title">{sub.examTitle}</span>
                <span className={`exam-card__badge badge--${sub.status}`}>
                  {sub.status === "graded" ? "✔ Graded" : "⏳ Pending"}
                </span>
              </div>
              <div className="exam-card__meta">
                <span className="exam-card__meta-item">📚 {sub.subject}</span>
                <span className="exam-card__meta-item">📅 Submitted: {formatDate(sub.submittedAt)}</span>
                <span className="exam-card__meta-item">🎯 Total: {sub.totalMarks} marks</span>
              </div>
              {sub.score !== null ? (
                <div className="exam-card__score">
                  <div className="exam-card__score-bar">
                    <div
                      className="exam-card__score-fill"
                      style={{ width: `${(sub.score / sub.totalMarks) * 100}%` }}
                    />
                  </div>
                  <span className="exam-card__score-text">
                    {sub.score}/{sub.totalMarks}
                  </span>
                </div>
              ) : (
                <div style={{ fontSize: "0.8rem", color: "var(--text-light)", marginTop: "0.4rem" }}>
                  ⏳ Result not yet published
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const TABS = [
  { id: "current",   label: "Current Exams" },
  { id: "submitted", label: "Submitted" },
];

export default function Exams({ onAttemptExam }) {
  const [activeTab, setActiveTab] = useState("current");
  const [exams, setExams] = useState([]);
  const [submittedExams, setSubmittedExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExams = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const examData = await fetchExams(token);
        setExams(Array.isArray(examData?.exams) ? examData.exams : []);

        // For submitted exams, we might need a separate API call
        // For now, we'll show a placeholder
        setSubmittedExams([]);
      } catch (error) {
        console.error("Error loading exams:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, []);

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner"></div>
        <span>Loading exams...</span>
      </div>
    );
  }

  return (
    <div className="exams">
      <div className="exams__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`exams__tab${activeTab === tab.id ? " active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "current"   && <CurrentExams exams={exams} onAttemptExam={onAttemptExam} />}
      {activeTab === "submitted" && <SubmittedExams submittedExams={submittedExams} />}
    </div>
  );
}
