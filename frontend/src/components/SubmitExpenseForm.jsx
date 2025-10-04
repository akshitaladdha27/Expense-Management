import React, { useState } from 'react';
import api from '../api/axios';

const SubmitExpenseForm = ({ onExpenseSubmitted }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const newExpense = { amount, currency, category, description, expenseDate };
      await api.post('/expenses', newExpense);

      setSuccess('Expense submitted successfully!');
      // Clear the form
      setAmount('');
      setCategory('');
      setDescription('');
      setExpenseDate('');

      // Notify the parent component to refresh the expense list
      if (onExpenseSubmitted) {
        onExpenseSubmitted();
      }

    } catch (err) {
      setError('Failed to submit expense. Please check the details.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px', border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
      <h3>Submit New Expense</h3>
      <div>
        <label>Amount:</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>
      <div>
        <label>Currency:</label>
        <input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} required />
      </div>
      <div>
        <label>Category:</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
      </div>
      <div>
        <label>Description:</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label>Expense Date:</label>
        <input type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} required />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <button type="submit">Submit Expense</button>
    </form>
  );
};

export default SubmitExpenseForm;