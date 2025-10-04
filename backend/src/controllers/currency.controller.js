import fetch from 'node-fetch'; // You may need to install this: npm install node-fetch

export const convertCurrency = async (req, res) => {
  try {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
      return res.status(400).json({ message: 'Missing required query parameters: from, to, amount' });
    }

    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();
    const rate = data.rates[to];

    if (!rate) {
      return res.status(404).json({ message: `Conversion rate for currency '${to}' not found.` });
    }

    const convertedAmount = (amount * rate).toFixed(2);

    res.status(200).json({
      from,
      to,
      originalAmount: amount,
      convertedAmount,
      rate,
    });

  } catch (error) {
    console.error(`Error in convertCurrency controller: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};