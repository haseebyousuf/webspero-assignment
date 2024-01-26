import express from 'express';
import {
  getNearbyUsers,
  signin,
  signup,
  updateUser,
} from '../controllers/userControllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { upload } from '../../config/fileStorageConfig.js';

const router = express.Router();

router.post('/signup', upload.single('profile'), signup);

router.post('/signin', signin);

router.put('/update', upload.single('profile'), authMiddleware, updateUser);

router.get('/nearby-users', authMiddleware, getNearbyUsers);

export default router;
