const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userControllers');
const authControllers = require('../controllers/authControllers');

// user routes
router.get('/profile', authMiddleware.authUser, userController.getUserProfile);
router.get('/logout', authMiddleware.authUser, authControllers.logoutUser);

module.exports = router;
