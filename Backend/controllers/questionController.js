const questionService = require('../services/questionService');
const { validationResult } = require('express-validator');

exports.addQuestion = async (req, res, next) => {
    // teacher only
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Forbidden: teachers only' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { examId } = req.params;
    try {
        const question = await questionService.createQuestion(examId, req.body);
        return res.status(201).json({ question });
    } catch (err) {
        next(err);
    }
};

exports.getQuestions = async (req, res, next) => {
    const { examId } = req.params;
    try {
        let questions = await questionService.getQuestionsByExam(examId);
        // convert to plain objects to modify
        questions = questions.map(q => q.toObject ? q.toObject() : q);
        if (req.user.role !== 'Teacher') {
            // student: strip correctAnswer
            questions = questions.map(({ correctAnswer, ...rest }) => rest);
        }
        res.json({ questions });
    } catch (err) {
        next(err);
    }
};

exports.updateQuestion = async (req, res, next) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Forbidden: teachers only' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updated = await questionService.updateQuestion(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json({ question: updated });
    } catch (err) {
        next(err);
    }
};

exports.deleteQuestion = async (req, res, next) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Forbidden: teachers only' });
    }

    try {
        await questionService.deleteQuestion(req.params.id);
        res.json({ message: 'Question deleted' });
    } catch (err) {
        next(err);
    }
};
