import express from 'express';
import { checkAuth, getUsers, login, logout, signup, verifyEmail, getUser, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/check-auth', verifyToken, checkAuth);
router.post('/signup', signup);
router.post('/login', login);

router.post('/verify-email', verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post('/logout', logout);


router.get('/', getUsers);
router.get('/users/', getUsers);
router.get('/profile/:user_id', getUser);

export default router; 

// CRUD