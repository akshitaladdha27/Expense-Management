import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/api/auth.routes.js';
import userRoutes from './src/api/user.routes.js';
import expenseRoutes from './src/api/expense.routes.js';
import currencyRoutes from './src/api/currency.routes.js'; // <-- ADD THIS LINE

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/currency', currencyRoutes); 

app.get('/', (req, res) => {
  res.send('Expense Management API is running!');
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});