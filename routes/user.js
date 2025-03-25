const { register, verifyEmail, login, resendVerificationEmail, logout, forgotPassword, resetPassword } = require('../controllers/user');

const router = require('express').Router();

router.post('/register',register);
router.get('/verify-email/:token',verifyEmail);
router.get('/resend-verification-email',resendVerificationEmail);
router.post('/login',login);
router.post('/forgot-password',forgotPassword);
router.get('/reset-password/:token',resetPassword);
router.get('/logout',logout);


module.exports = router;