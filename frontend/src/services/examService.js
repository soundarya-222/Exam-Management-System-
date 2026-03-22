const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

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

  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
};

export const fetchExams = (token) => apiFetch(`${API}/exams`, {}, token);
export const fetchExamById = (id, token) => apiFetch(`${API}/exams/${id}`, {}, token);
export const createExam = (payload, token) =>
  apiFetch(`${API}/exams`, { method: "POST", body: JSON.stringify(payload) }, token);
export const updateExam = (id, payload, token) =>
  apiFetch(`${API}/exams/${id}`, { method: "PUT", body: JSON.stringify(payload) }, token);
export const publishExam = (id, token) =>
  apiFetch(`${API}/exams/${id}/publish`, { method: "PUT" }, token);
export const deleteExam = (id, token) => apiFetch(`${API}/exams/${id}`, { method: "DELETE" }, token);

export const fetchSubmissions = (token) => apiFetch(`${API}/submissions`, {}, token);
export const fetchSubmissionById = (id, token) => apiFetch(`${API}/submissions/${id}`, {}, token);
export const submitExam = (payload, token) =>
  apiFetch(`${API}/submissions`, { method: "POST", body: JSON.stringify(payload) }, token);
export const gradeSubmission = (id, payload, token) =>
  apiFetch(`${API}/submissions/${id}/grade`, { method: "PUT", body: JSON.stringify(payload) }, token);

export const publishResult = (id, token) =>
  apiFetch(`${API}/results/publish/${id}`, { method: "PUT" }, token);

export const fetchExamResults = (examId, token) =>
  apiFetch(`${API}/results/exam/${examId}`, {}, token);
export const fetchStudentById = (id, token) => apiFetch(`${API}/users/students/${id}`, {}, token);
export const fetchStudents = (token) => apiFetch(`${API}/users/students`, {}, token);

export const updateProfile = (payload, token) =>
  apiFetch(`${API}/users/profile`, { method: "PUT", body: JSON.stringify(payload) }, token);