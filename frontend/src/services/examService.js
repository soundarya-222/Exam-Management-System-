const API = "/api";

/* Shared fetch helper — throws on non-ok */
const apiFetch = async (url, options = {}, token = "") => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "API error");
  return data;
};

/* ── Exam APIs ─────────────────────────────────────────────── */

export const fetchExams = (token) =>
  apiFetch(`${API}/exams`, {}, token);

export const fetchExamById = (id, token) =>
  apiFetch(`${API}/exams/${id}`, {}, token);

export const createExam = (payload, token) =>
  apiFetch(`${API}/exams`, { method: "POST", body: JSON.stringify(payload) }, token);

export const updateExam = (id, payload, token) =>
  apiFetch(`${API}/exams/${id}`, { method: "PUT", body: JSON.stringify(payload) }, token);

export const deleteExam = (id, token) =>
  apiFetch(`${API}/exams/${id}`, { method: "DELETE" }, token);

/* ── Submission APIs ───────────────────────────────────────── */

export const fetchSubmissions = (token) =>
  apiFetch(`${API}/submissions`, {}, token);

export const fetchSubmissionById = (id, token) =>
  apiFetch(`${API}/submissions/${id}`, {}, token);

export const submitExam = (payload, token) =>
  apiFetch(`${API}/submissions`, { method: "POST", body: JSON.stringify(payload) }, token);

export const gradeSubmission = (id, payload, token) =>
  apiFetch(`${API}/submissions/${id}/grade`, { method: "PUT", body: JSON.stringify(payload) }, token);

/* ── Student APIs ──────────────────────────────────────────── */

export const fetchStudents = (token) =>
  apiFetch(`${API}/users/students`, {}, token);

export const fetchStudentById = (id, token) =>
  apiFetch(`${API}/users/students/${id}`, {}, token);

/* ── Profile API ───────────────────────────────────────────── */

export const updateProfile = (payload, token) =>
  apiFetch(`${API}/users/profile`, { method: "PUT", body: JSON.stringify(payload) }, token);
