import Expense from '../models/expense.model.js';
import User from '../models/user.model.js';



export const submitExpense = async (req, res) => {
  try {
    const { amount, currency, category, description, expenseDate } = req.body;

    const newExpense = new Expense({
      employeeId: req.user._id, // Get employee ID from the logged-in user
      amount,
      currency,
      category,
      description,
      expenseDate,
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);

  } catch (error) {
    console.error(`Error in submitExpense controller: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getMyExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ employeeId: req.user._id }).sort({ createdAt: -1 });
    
    res.status(200).json(expenses);
  } catch (error) {
    console.error(`Error in getMyExpenses controller: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getPendingExpenses = async (req, res) => {
  try {
    const pendingExpenses = await Expense.find({
      status: 'Pending'
    })
    .populate('employeeId', 'name email') 
    .sort({ createdAt: -1 });

    res.status(200).json(pendingExpenses);
  } catch (error) {
    console.error(`Error in getPendingExpenses controller: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const reviewExpense = async (req, res) => {
  try {
    const { status } = req.body; 
    const expenseId = req.params.id;

    if (status !== 'Approved' && status !== 'Rejected') {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    const employee = await User.findById(expense.employeeId);
    if (employee.managerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to review this expense' });
    }
    
    expense.status = status;
    const updatedExpense = await expense.save();

    res.status(200).json(updatedExpense);

  } catch (error) {
    console.error(`Error in reviewExpense controller: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getTeamExpenses = async (req, res) => {
  try {
    const employees = await User.find({ managerId: req.user._id });
    const employeeIds = employees.map(employee => employee._id);

    const teamExpenses = await Expense.find({
      employeeId: { $in: employeeIds }
    })
    .populate('employeeId', 'name email')
    .sort({ createdAt: -1 });

    res.status(200).json(teamExpenses);
  } catch (error) {
    console.error(`Error in getTeamExpenses controller: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};