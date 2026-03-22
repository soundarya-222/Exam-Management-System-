const submissionRepo = require('../repositories/submissionRepository');
const examModel = require('../models/examModel');
const questionModel = require('../models/questionModel');

/**
 * Process an exam submission by a student. The behavior differs based on the
 * type of exam (MCQ vs LONG).
 *
 * @param {ObjectId} studentId
 * @param {ObjectId} examId
 * @param {Array} answers - [{ questionId, answer }]
 */
async function submitExam(studentId, examId, answers = []) {
    if (!examId || !studentId) {
        throw new Error('Exam ID and student ID are required');
    }

    // ensure the exam exists and load questions
    const exam = await examModel.findById(examId).populate('questions');
    if (!exam) {
        throw new Error('Exam not found');
    }

    // prevent duplicate submissions for the same exam by the same student
    const existing = await submissionRepo.findOneByStudentAndExam(studentId, examId);
    if (existing) {
        throw new Error('You have already submitted this exam');
    }

    let totalMarks = 0;
    let status = 'pending';
    const processedAnswers = answers.map(a => ({
        questionId: a.questionId,
        answer: a.answer,
        marks: 0
    }));

    // auto-grade MCQ questions regardless of exam.type
    const questionMap = new Map(exam.questions.map(q => [q._id.toString(), q]));
    for (const ans of processedAnswers) {
        const q = questionMap.get(ans.questionId.toString());
        if (q && q.type === 'MCQ') {
            if (ans.answer === q.correctAnswer) {
                ans.marks = q.marks || 0;
                totalMarks += ans.marks;
            }
        }
    }
    // if there are any non-MCQ questions, teacher still needs to grade them
    const hasTheory = exam.questions.some(q => q.type !== 'MCQ');
    status = hasTheory ? 'pending' : 'checked';

    const submission = await submissionRepo.create({
        examId,
        studentId,
        answers: processedAnswers,
        totalMarks,
        status,
        submittedAt: new Date()
    });

    return {
        message: 'Exam submitted successfully',
        totalMarks: submission.totalMarks,
        status: submission.status,
        submission
    };
}

async function evaluateSubmission(submissionId, marksArray = []) {
    if (!submissionId) {
        throw new Error('Submission ID is required');
    }

    const submission = await submissionRepo.findById(submissionId);
    if (!submission) {
        throw new Error('Submission not found');
    }

    if (submission.status === 'checked') {
        throw new Error('Submission has already been evaluated');
    }

    // map marks by question for quick lookup
    const marksMap = new Map(marksArray.map(m => [m.questionId.toString(), m.marks]));
    let total = 0;

    submission.answers = submission.answers.map(ans => {
        const qmarks = marksMap.get(ans.questionId.toString()) || 0;
        ans.marks = qmarks;
        total += qmarks;
        return ans;
    });

    submission.totalMarks = total;
    submission.status = 'checked';

    const updated = await submissionRepo.update(submissionId, {
        answers: submission.answers,
        totalMarks: submission.totalMarks,
        status: submission.status
    });

    return updated;
}

async function getSubmissionsByStudent(studentId) {
    if (!studentId) {
        throw new Error('Student ID is required');
    }
    return submissionRepo.findByStudent(studentId);
}

async function getSubmissionsByExam(examId) {
    if (!examId) {
        throw new Error('Exam ID is required');
    }
    return submissionRepo.findByExam(examId);
}

module.exports = {
    submitExam,
    evaluateSubmission,
    getSubmissionsByStudent,
    getSubmissionsByExam
};
