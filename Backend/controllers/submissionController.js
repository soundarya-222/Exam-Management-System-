const submissionService = require('../services/submissionServices');
const { validationResult } = require('express-validator');

module.exports.submitExam = async (req, res, next) => {
    // only students may submit
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Forbidden: students only' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { examId, answers } = req.body;
    try {
        const result = await submissionService.submitExam(req.user._id, examId, answers);
        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

module.exports.getMySubmissions = async (req, res, next) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Forbidden: students only' });
    }
    try {
        const submissions = await submissionService.getSubmissionsByStudent(req.user._id);
        res.json({ submissions });
    } catch (err) {
        next(err);
    }
};

module.exports.getSubmissionsByExam = async (req, res, next) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Forbidden: teachers only' });
    }

    const { examId } = req.params;
    try {
        const submissions = await submissionService.getSubmissionsByExam(examId);
        res.json({ submissions });
    } catch (err) {
        next(err);
    }
};

module.exports.evaluateSubmission = async (req, res, next) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Forbidden: teachers only' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { submissionId } = req.params;
    const { marks } = req.body;
    try {
        const updated = await submissionService.evaluateSubmission(submissionId, marks);
        res.json({ message: 'Submission evaluated', submission: updated });
    } catch (err) {
        next(err);
    }
};
