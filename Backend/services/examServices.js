// service layer for exams; controllers should call these rather than touching the repository directly
// this module no longer spins up its own express server or connects to the database

const examRepo = require('../repositories/examRepositories');
const questionService = require('./questionService');

async function createExam(examData) {
  if (!examData || typeof examData !== 'object') {
    throw new Error('Valid exam data is required');
  }

  const { questions = [], ...baseExam } = examData;

  // Explicit ensure exam type exists and matches schema
  const hasMCQ = questions.some((q) => (q.type || '').toString().toLowerCase() === 'mcq');
  baseExam.type = baseExam.type || (hasMCQ ? 'MCQ' : 'LONG');

  // create exam first without question refs (questionService will add refs and recalc total)
  const exam = await examRepo.createExam({ ...baseExam, questions: [] });

  // add question docs and attach to exam
  for (const q of questions) {
    const questionData = {
      questionText: q.text || q.questionText || '',
      type: (q.type || '').toString().toUpperCase() === 'MCQ' ? 'MCQ' : 'THEORY',
      marks: Number(q.marks || 1),
      options: q.options && q.options.length ? q.options : undefined,
      correctAnswer: q.correctAnswer || undefined
    };

    await questionService.createQuestion(exam._id, questionData);
  }

  // return the refreshed exam with recalculated totals and question references
  return examRepo.getExamById(exam._id);
}

async function getExams() {
  return examRepo.getAllExams();
}

async function getExamById(id) {
  if (!id) throw new Error('Exam id is required');
  return examRepo.getExamById(id);
}

async function updateExam(id, data) {
  if (!id) throw new Error('Exam id is required');
  return examRepo.updateExam(id, data);
}

async function deleteExam(id) {
  if (!id) throw new Error('Exam id is required');
  return examRepo.deleteExam(id);
}

async function publishExam(id) {
  if (!id) throw new Error('Exam id is required');
  return examRepo.publishExam(id);
}

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  publishExam,
};