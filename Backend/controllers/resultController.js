const resultService = require('../services/resultService');
const { validationResult } = require('express-validator');

exports.getMyResults = async (req, res, next) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Forbidden: students only' });
    }
    try {
        const results = await resultService.getMyResults(req.user._id);
        res.json({ results });
    } catch (err) {
        next(err);
    }
};

exports.getExamResults = async (req, res, next) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Forbidden: teachers only' });
    }
    const { examId } = req.params;
    try {
        const results = await resultService.getExamResults(examId);
        res.json({ results });
    } catch (err) {
        next(err);
    }
};

exports.grade = async (req, res, next) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Forbidden: teachers only' });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { submissionId, marks } = req.body;
    try {
        const updated = await resultService.gradeSubmission(submissionId, marks);
        res.json({ message: 'Submission graded', submission: updated });
    } catch (err) {
        next(err);
    }
};
