const Exam = require("../models/examModel");

exports.createExam = async (examData) => {
  const exam = new Exam(examData);
  return await exam.save();
};

exports.getAllExams = async () => {
  // lean() returns plain JS objects which are faster to create and consume
  return await Exam.find().lean();
};

exports.getExamById = async (id) => {
  return await Exam.findById(id).lean();
};

// add a question reference to an exam and return updated exam
exports.addQuestionToExam = async (examId, questionId) => {
  return await Exam.findByIdAndUpdate(
    examId,
    { $addToSet: { questions: questionId } },
    { new: true }
  ).lean();
};

// remove a question reference from an exam
exports.removeQuestionFromExam = async (examId, questionId) => {
  return await Exam.findByIdAndUpdate(
    examId,
    { $pull: { questions: questionId } },
    { new: true }
  ).lean();
};

// recalculate totalMarks by loading questions and summing
exports.recalculateTotal = async (examId) => {
  const exam = await Exam.findById(examId).populate('questions');
  if (!exam) return null;
  exam.totalMarks = exam.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
  await exam.save();
  return exam.toObject();
};

exports.updateExam = async (id, data) => {
  return await Exam.findByIdAndUpdate(id, data, { new: true }).lean();
};

exports.deleteExam = async (id) => {
  return await Exam.findByIdAndDelete(id).lean();
};

exports.publishExam = async (id) => {
  return await Exam.findByIdAndUpdate(
    id,
    { status: 'published' },
    { new: true }
  ).lean();
};

