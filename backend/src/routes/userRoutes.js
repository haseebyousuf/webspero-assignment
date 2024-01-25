import express from 'express';
import {
  getNearbyUsers,
  signin,
  signup,
  updateUser,
} from '../controllers/userControllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/signin', signin);

router.put('/update', authMiddleware, updateUser);

router.get('/nearby-users', authMiddleware, getNearbyUsers);

export default router;
