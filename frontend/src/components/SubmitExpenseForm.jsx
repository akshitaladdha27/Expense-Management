import React, { useState } from 'react';
import api from '../api/axios';
import { createWorker } from 'tesseract.js';

const SubmitExpenseForm = ({ onExpenseSubmitted }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [ocrImage, setOcrImage] = useState(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrText, setOcrText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);


  const handleOcr = async () => {
    if (!ocrImage) {
      setError('Please select an image file first.');
      return;
    }
    setIsProcessing(true);
    setOcrText('');
    setOcrProgress(0);

    const worker = await createWorker('eng', 1, {
      logger: m => {
        if (m.status === 'recognizing text') {
          setOcrProgress(parseInt(m.progress * 100));
        }
      },
    });

    const { data: { text } } = await worker.recognize(ocrImage);
    setOcrText(text);

    const totalMatch = text.match(/Total\s*[:\s]\s*(\d+\.\d{2})/i);
    if (totalMatch && totalMatch[1]) {
      setAmount(totalMatch[1]);
    }

    const dateMatch = text.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    if (dateMatch && dateMatch[1]) {
        const [month, day, year] = dateMatch[1].split('/');
        setExpenseDate(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    }

    await worker.terminate();
    setIsProcessing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const newExpense = { amount, currency, category, description, expenseDate };
      await api.post('/expenses', newExpense);
      setSuccess('Expense submitted successfully!');
      setAmount('');
      setCategory('');
      setDescription('');
      setExpenseDate('');
      if (onExpenseSubmitted) {
        onExpenseSubmitted();
      }
    } catch (err) {
      setError('Failed to submit expense. Please check the details.');
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
        <h3>Scan Receipt</h3>
        <input type="file" onChange={(e) => setOcrImage(e.target.files[0])} accept="image/*" />
        <button onClick={handleOcr} disabled={isProcessing} style={{ marginTop: '10px' }}>
          {isProcessing ? `Processing... ${ocrProgress}%` : 'Scan and Fill Form'}
        </button>
        {ocrText && (
          <div style={{ marginTop: '10px', backgroundColor: '#f0f0f0', padding: '8px', maxHeight: '150px', overflowY: 'auto' }}>
            <strong>Extracted Text:</strong>
            <pre>{ocrText}</pre>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ flex: 1, border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
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
    </div>
  );
};

export default SubmitExpenseForm;