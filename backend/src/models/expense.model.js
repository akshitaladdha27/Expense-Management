import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    uppercase: true,
  },
  category: {
    type: String,
    required: true,
  }, 
  description: {
    type: String,
  },
  expenseDate: {
    type: Date,
    required: true,
  }, 
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending',
  },
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;