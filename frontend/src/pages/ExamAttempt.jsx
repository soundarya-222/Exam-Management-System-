import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { submitExam } from "../services/examService";

export default function ExamAttempt({ exam, onComplete }) {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentQuestion = exam.questions[currentQuestionIndex];

  const handleSubmit = useCallback(
    async (isAutoSubmit = false) => {
      if (submitted) return;

      if (!isAutoSubmit) {
        const confirmSubmit = window.confirm(
          "Are you sure you want to submit the exam?"
        );
        if (!confirmSubmit) return;
      }

      setLoading(true);
      try {
        const submissionData = {
          examId: exam._id,
          studentId: user?._id,
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer,
          })),
        };

        await submitExam(submissionData, localStorage.getItem("token"));
        setSubmitted(true);
        if (!isAutoSubmit) alert("Exam submitted successfully!");
        onComplete();
      } catch (error) {
        console.error(error);
        alert("Submission failed");
      } finally {
        setLoading(false);
      }
    },
    [exam._id, answers, submitted, onComplete, user]
  );

  useEffect(() => {
    if (timeLeft <= 0 && !submitted) {
      handleSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted, handleSubmit]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [currentQuestion._id]: value,
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Exam Attempt</h2>

      <p><strong>User:</strong> {user?.fullname ? `${user.fullname.firstname} ${user.fullname.lastname || ''}`.trim() : "Guest"}</p>
      <p><strong>Time Left:</strong> {formatTime(timeLeft)}</p>

      <hr />

      <h3>
        Question {currentQuestionIndex + 1} of {exam.questions.length}
      </h3>
      <p>{currentQuestion?.questionText}</p>

      {/* MCQ */}
      {currentQuestion?.type === "MCQ" &&
        currentQuestion.options.map((opt, idx) => (
          <div key={idx}>
            <label>
              <input
                type="radio"
                name="answer"
                value={opt}
                checked={answers[currentQuestion._id] === opt}
                onChange={() => handleAnswerChange(opt)}
              />
              {opt}
            </label>
          </div>
        ))}

      {/* Text / Coding */}
      {(currentQuestion?.type === "THEORY" ||
        currentQuestion?.type === "CODING") && (
        <textarea
          rows="5"
          cols="50"
          placeholder="Write your answer..."
          value={answers[currentQuestion._id] || ""}
          onChange={(e) => handleAnswerChange(e.target.value)}
        />
      )}

      <br /><br />

      <button
        onClick={() =>
          setCurrentQuestionIndex((prev) => prev - 1)
        }
        disabled={currentQuestionIndex === 0}
      >
        Previous
      </button>

      <button
        onClick={() =>
          setCurrentQuestionIndex((prev) => prev + 1)
        }
        disabled={currentQuestionIndex === exam.questions.length - 1}
      >
        Next
      </button>

      <br /><br />

      <button onClick={() => handleSubmit(false)} disabled={loading}>
        {loading ? "Submitting..." : "Submit Exam"}
      </button>
    </div>
  );
}