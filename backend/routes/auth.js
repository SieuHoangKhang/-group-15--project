const express = require('express');
const router = express.Router();
const { signup, login, logout, me } = require('../controllers/authController');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.get('/auth/me', auth, me);
// also expose /auth/profile and /profile via auth routes for convenience
router.get('/auth/profile', auth, userController.getProfile);
router.put('/auth/profile', auth, userController.updateProfile);

module.exports = router;
