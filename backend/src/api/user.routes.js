import express from 'express';
import { protect, isAdmin } from '../middlewares/auth.middleware.js';
import { getAllUsers, createUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/profile', protect, (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

router.get('/', protect, isAdmin, getAllUsers);

router.post('/', protect, isAdmin, createUser);

export default router;