import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const TeamExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeamExpenses = async () => {
      try {
        const response = await api.get('/expenses/team');
        setExpenses(response.data);
      } catch (err) {
        setError('Failed to fetch team expenses.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamExpenses();
  }, []);

  if (loading) return <p>Loading team expenses...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-8">
      <h4 className="text-xl font-bold mb-4">Complete Team Expense History</h4>
      {expenses.length === 0 ? (
        <p>No expenses have been submitted by your team yet.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Employee</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3">Amount</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{expense.employeeId.name}</td>
                  <td className="px-6 py-4">{new Date(expense.expenseDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{expense.description}</td>
                  <td className="px-6 py-4">{expense.amount} {expense.currency}</td>
                  <td className={`px-6 py-4 font-semibold ${
                    expense.status === 'Approved' ? 'text-green-500' :
                    expense.status === 'Rejected' ? 'text-red-500' : 'text-orange-500'
                  }`}>
                    {expense.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeamExpensesList;