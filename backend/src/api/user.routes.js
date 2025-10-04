import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/profile', protect, (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

export default router;