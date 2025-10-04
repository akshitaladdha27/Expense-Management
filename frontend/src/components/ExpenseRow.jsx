import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const COMPANY_CURRENCY = 'USD';

const ExpenseRow = ({ expense, onReview }) => {
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    const getConvertedAmount = async () => {
      if (expense.currency !== COMPANY_CURRENCY) {
        try {
          const response = await api.get(
            `/currency/convert?from=${expense.currency}&to=${COMPANY_CURRENCY}&amount=${expense.amount}`
          );
          setConvertedAmount(response.data.convertedAmount);
        } catch (error) {
          console.error("Failed to convert currency", error);
        }
      }
    };
    getConvertedAmount();
  }, [expense]);

  return (
    <tr className="bg-white border-b hover:bg-gray-50">
      <td className="px-6 py-4">{expense.description}</td>
      <td className="px-6 py-4">{expense.employeeId.name}</td>
      <td className="px-6 py-4">{expense.category}</td>
      <td className="px-6 py-4">
        {expense.amount} {expense.currency}
        {convertedAmount && (
          <span className="text-xs text-gray-500 block">
            (approx. {convertedAmount} {COMPANY_CURRENCY})
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-orange-500 font-semibold">{expense.status}</td>
      <td className="px-6 py-4 flex items-center space-x-2">
        <button
          onClick={() => onReview(expense._id, 'Approved')}
          className="px-3 py-1 text-white font-semibold bg-green-500 rounded-md hover:bg-green-600"
        >
          Approve
        </button>
        <button
          onClick={() => onReview(expense._id, 'Rejected')}
          className="px-3 py-1 text-white font-semibold bg-red-500 rounded-md hover:bg-red-600"
        >
          Reject
        </button>
      </td>
    </tr>
  );
};

export default ExpenseRow;