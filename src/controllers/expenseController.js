const pool = require('../config/db');

// Add new transaction
const addTransaction = async (req, res) => {
  const { type, category, amount, note } = req.body;
  const userId = req.userId;

  if (!['income', 'expense', 'investment', 'spending', 'shopping'].includes(type)) {
    return res.status(400).json({ message: 'Invalid transaction type' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO transactions (user_id, type, category, amount, note)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, type, category, amount, note]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all transactions
const getTransactions = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await pool.query(
      `SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a transaction
const updateTransaction = async (req, res) => {
  const transactionId = req.params.id;
  const { type, category, amount, note } = req.body;

  try {
    const result = await pool.query(
      `UPDATE transactions
       SET type = $1, category = $2, amount = $3, note = $4
       WHERE id = $5 
       RETURNING *`,
      [type, category, amount, note, transactionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  const userId = req.userId;
  const transactionId = req.params.id;

  try {
    const result = await pool.query(
      `DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *`,
      [ transactionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
};
