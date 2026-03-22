const submissionService = require('./submissionServices');

async function getMyResults(studentId) {
    if (!studentId) {
        throw new Error('Student ID is required');
    }
    return submissionService.getSubmissionsByStudent(studentId);
}

async function getExamResults(examId) {
    if (!examId) {
        throw new Error('Exam ID is required');
    }
    return submissionService.getSubmissionsByExam(examId);
}

async function gradeSubmission(submissionId, marksArray) {
    return submissionService.evaluateSubmission(submissionId, marksArray);
}

module.exports = {
    getMyResults,
    getExamResults,
    gradeSubmission
};
