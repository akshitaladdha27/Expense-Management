import React, { useState, useEffect, useCallback } from 'react'; 
import api from '../api/axios';
import SubmitExpenseForm from './SubmitExpenseForm';

const EmployeeDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/expenses/my-expenses');
      setExpenses(response.data);
    } catch (err) {
      setError('Failed to fetch expenses.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]); 

  return (
    <div>
      <SubmitExpenseForm onExpenseSubmitted={fetchExpenses} />
      <hr style={{ margin: '20px 0' }} />
      <h3>My Expense History</h3>
      {loading ? (
        <p>Loading expenses...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : expenses.length === 0 ? (
        <p>You have not submitted any expenses yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Category</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Amount</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px' }}>
                  {new Date(expense.expenseDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '8px' }}>{expense.category}</td>
                <td style={{ padding: '8px' }}>
                  {expense.amount} {expense.currency}
                </td>
                <td style={{ padding: '8px', color: expense.status === 'Approved' ? 'green' : expense.status === 'Rejected' ? 'red' : 'orange' }}>
                  {expense.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeDashboard;