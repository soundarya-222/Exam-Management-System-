import { useState } from "react";
import "./Exams.css";
import { MOCK_EXAMS } from "../../services/mockData";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });
}

function CurrentExams() {
  return (
    <div className="exams__list">
      {MOCK_EXAMS.current.map((exam, i) => (
        <div
          key={exam._id}
          className={`exam-card${exam.status === "live" ? " exam-card--live" : ""}`}
          style={{ animationDelay: `${i * 0.07}s` }}
        >
          <div className="exam-card__icon">
            {exam.status === "live" ? "🟢" : "📝"}
          </div>
          <div className="exam-card__body">
            <div className="exam-card__header">
              <span className="exam-card__title">{exam.title}</span>
              <span className={`exam-card__badge badge--${exam.status}`}>
                {exam.status === "live" ? "🔴 Live" : "🔵 Upcoming"}
              </span>
            </div>
            <div className="exam-card__meta">
              <span className="exam-card__meta-item">📚 {exam.subject}</span>
              <span className="exam-card__meta-item">📅 {formatDate(exam.date)} at {formatTime(exam.date)}</span>
              <span className="exam-card__meta-item">⏱ {exam.duration} mins</span>
              <span className="exam-card__meta-item">🎯 {exam.totalMarks} marks</span>
              <span className="exam-card__meta-item">❓ {exam.questionsCount} questions</span>
              <span className="exam-card__meta-item">👨‍🏫 {exam.teacher}</span>
            </div>
            <div className="exam-card__instruction">
              📌 {exam.instructions}
            </div>
          </div>
        </div>
      ))}
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

function SubmittedExams() {
  return (
    <div className="exams__list">
      {MOCK_EXAMS.submitted.map((sub, i) => (
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
      ))}
    </div>
  );
}

const TABS = [
  { id: "current",   label: "Current Exams" },
  { id: "notices",   label: "Notices" },
  { id: "submitted", label: "Submitted" },
];

export default function Exams() {
  const [activeTab, setActiveTab] = useState("current");

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

      {activeTab === "current"   && <CurrentExams />}
      {activeTab === "notices"   && <Notices />}
      {activeTab === "submitted" && <SubmittedExams />}
    </div>
  );
}
