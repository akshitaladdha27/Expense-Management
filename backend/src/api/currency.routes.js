import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { convertCurrency } from '../controllers/currency.controller.js';

const router = express.Router();
router.get('/convert', protect, convertCurrency);

export default router;