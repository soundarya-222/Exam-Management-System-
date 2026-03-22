const questionRepo = require('../repositories/questionRepository');
const examRepo = require('../repositories/examRepositories');

async function createQuestion(examId, questionData) {
    if (!examId) {
        throw new Error('examId is required');
    }
    // attach examId to data
    questionData.examId = examId;

    const question = await questionRepo.create(questionData);
    // ensure the exam links to the question
    await examRepo.addQuestionToExam(examId, question._id);
    // recalculate total marks for exam
    await examRepo.recalculateTotal(examId);
    return question;
}

async function getQuestionsByExam(examId) {
    if (!examId) throw new Error('examId is required');
    return questionRepo.findByExam(examId);
}

async function updateQuestion(id, changes) {
    if (!id) throw new Error('question id is required');
    const updated = await questionRepo.update(id, changes);
    if (updated && updated.examId) {
        // recalc exam marks in case marks or type changed
        await examRepo.recalculateTotal(updated.examId);
    }
    return updated;
}

async function deleteQuestion(id) {
    if (!id) throw new Error('question id is required');
    // find question to know exam
    const q = await questionRepo.findById(id);
    if (!q) throw new Error('Question not found');
    const examId = q.examId;

    const deleted = await questionRepo.delete(id);
    if (examId) {
        await examRepo.removeQuestionFromExam(examId, id);
        await examRepo.recalculateTotal(examId);
    }
    return deleted;
}

module.exports = {
    createQuestion,
    getQuestionsByExam,
    updateQuestion,
    deleteQuestion
};
