// service layer for exams; controllers should call these rather than touching the repository directly
// this module no longer spins up its own express server or connects to the database

const examRepo = require('../repositories/examRepositories');

async function createExam(examData) {
  if (!examData || typeof examData !== 'object') {
    throw new Error('Valid exam data is required');
  }
  return examRepo.createExam(examData);
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

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
};