import express from 'express';
import { protect, isEmployee, isManager } from '../middlewares/auth.middleware.js';
import { submitExpense, getMyExpenses, getPendingExpenses, reviewExpense } from '../controllers/expense.controller.js';


const router = express.Router();

router.post('/', protect, isEmployee, submitExpense);

router.get('/my-expenses', protect, isEmployee, getMyExpenses);

router.get('/pending', protect, isManager, getPendingExpenses);

router.put('/:id/review', protect, isManager, reviewExpense);

export default router;