const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const submissionController = require('../controllers/submissionController');

// student submits exam (preferred root path)
router.post(
    '/',
    authMiddleware.authUser,
    [
        body('examId').notEmpty().withMessage('examId is required'),
        body('answers').isArray({ min: 1 }).withMessage('answers must be a non-empty array'),
        body('answers.*.questionId').notEmpty().withMessage('each answer must have a questionId'),
        body('answers.*.answer').notEmpty().withMessage('each answer must have an answer value')
    ],
    submissionController.submitExam
);

// keep legacy alias for backwards compatibility
router.post(
    '/submit',
    authMiddleware.authUser,
    [
        body('examId').notEmpty().withMessage('examId is required'),
        body('answers').isArray({ min: 1 }).withMessage('answers must be a non-empty array'),
        body('answers.*.questionId').notEmpty().withMessage('each answer must have a questionId'),
        body('answers.*.answer').notEmpty().withMessage('each answer must have an answer value')
    ],
    submissionController.submitExam
);

// student views own submissions
router.get('/my', authMiddleware.authUser, submissionController.getMySubmissions);

// teacher views all submissions for an exam
router.get(
    '/exam/:examId',
    authMiddleware.authUser,
    [param('examId').notEmpty().withMessage('examId parameter is required')],
    submissionController.getSubmissionsByExam
);

// teacher evaluates a submission
router.put(
    '/evaluate/:submissionId',
    authMiddleware.authUser,
    [
        param('submissionId').notEmpty().withMessage('submissionId parameter is required'),
        body('marks').isArray({ min: 1 }).withMessage('marks must be a non-empty array'),
        body('marks.*.questionId').notEmpty().withMessage('each mark entry needs a questionId'),
        body('marks.*.marks').isNumeric().withMessage('each mark entry needs a numeric marks value')
    ],
    submissionController.evaluateSubmission
);

module.exports = router;
