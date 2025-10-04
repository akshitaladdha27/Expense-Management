import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const ManagerDashboard = () => {
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchPendingExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/expenses/pending');
      setPendingExpenses(response.data);
    } catch (err) { 
      setError('Failed to fetch pending expenses.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingExpenses();
  }, [fetchPendingExpenses]);

  const handleReview = async (expenseId, newStatus) => {
    setActionMessage('Processing...');
    try {
      await api.put(`/expenses/${expenseId}/review`, { status: newStatus });
      setActionMessage(`Expense successfully ${newStatus.toLowerCase()}!`);
      fetchPendingExpenses();
    } catch (err) {
      setActionMessage('An error occurred. Please try again.');
      console.error(err);
    }
  };

  if (loading) return <p>Loading pending expenses...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h3>Pending Expense Approvals</h3>
      {actionMessage && <p>{actionMessage}</p>}
      {pendingExpenses.length === 0 ? (
        <p>There are no pending expenses for your team.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Employee</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Category</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Amount</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingExpenses.map((expense) => (
              <tr key={expense._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px' }}>{expense.employeeId.name}</td>
                <td style={{ padding: '8px' }}>
                  {new Date(expense.expenseDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '8px' }}>{expense.category}</td>
                <td style={{ padding: '8px' }}>
                  {expense.amount} {expense.currency}
                </td>
                <td style={{ padding: '8px' }}>
                  <button
                    onClick={() => handleReview(expense._id, 'Approved')}
                    style={{ marginRight: '5px', backgroundColor: 'green', color: 'white' }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReview(expense._id, 'Rejected')}
                    style={{ backgroundColor: 'red', color: 'white' }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManagerDashboard;