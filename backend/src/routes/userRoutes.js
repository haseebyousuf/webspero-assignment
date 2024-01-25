import express from 'express';
import { signin, signup } from '../controllers/userControllers.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/signin', signin);

// router.put('/update', authMiddleware, updateUser);

export default router;
