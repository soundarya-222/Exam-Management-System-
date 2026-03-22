const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const resultController = require('../controllers/resultController');

// student sees own results
router.get(
    '/my',
    authMiddleware.authUser,
    roleMiddleware.requireRole(['student']),
    resultController.getMyResults
);

// teacher grades a submission (theory answers)
router.post(
    '/grade',
    authMiddleware.authUser,
    roleMiddleware.requireRole(['Teacher']),
    [
        body('submissionId').notEmpty().withMessage('submissionId is required'),
        body('marks').isArray({ min: 1 }).withMessage('marks must be a non-empty array'),
        body('marks.*.questionId').notEmpty().withMessage('each mark entry needs a questionId'),
        body('marks.*.marks').isNumeric().withMessage('each mark entry needs a numeric marks value')
    ],
    resultController.grade
);

// teacher views exam results
router.get(
    '/exam/:examId',
    authMiddleware.authUser,
    roleMiddleware.requireRole(['Teacher']),
    [param('examId').notEmpty().withMessage('examId parameter is required')],
    resultController.getExamResults
);

// teacher publishes a result
router.put(
    '/publish/:submissionId',
    authMiddleware.authUser,
    roleMiddleware.requireRole(['Teacher']),
    [param('submissionId').notEmpty().withMessage('submissionId parameter is required')],
    resultController.publishResult
);

module.exports = router;