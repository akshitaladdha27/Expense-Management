import express from 'express';
import { protect, isEmployee } from '../middlewares/auth.middleware.js';
import { submitExpense, getMyExpenses } from '../controllers/expense.controller.js';


const router = express.Router();

router.post('/', protect, isEmployee, submitExpense);

router.get('/my-expenses', protect, isEmployee, getMyExpenses);

export default router;