import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import ExpenseRow from './ExpenseRow'; 
import TeamExpensesList from './TeamExpensesList';

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

  if (loading) return <p className="text-center mt-4">Loading pending expenses...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h3 className="text-2xl font-bold mb-4">Approvals to review</h3>
      {actionMessage && <p className="text-blue-500 mb-4">{actionMessage}</p>}
      {pendingExpenses.length === 0 ? (
        <p className="text-gray-500">There are no pending expenses for your team.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Approval Subject</th>
                <th scope="col" className="px-6 py-3">Request Owner</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Amount</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingExpenses.map((expense) => (
                <ExpenseRow
                  key={expense._id}
                  expense={expense}
                  onReview={handleReview}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <hr className="my-8" />
      <TeamExpensesList />
    </div>
  );
};

export default ManagerDashboard;