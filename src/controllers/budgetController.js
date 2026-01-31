const pool = require('../config/db');

// Add new budget
const addBudget = async (req, res) => {
  const { category, amount } = req.body;
  const userId = req.userId;

  try {
    const result = await pool.query(
      `INSERT INTO budgets (user_id, category, amount)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, category, amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all budgets
const getBudgets = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await pool.query(
      `SELECT * FROM budgets WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a budget
const updateBudget = async (req, res) => {
  const { category, amount } = req.body;
  const userId = req.userId;
  const budgetId = req.params.id;

  try {
    const result = await pool.query(
      `UPDATE budgets
       SET category = $1, amount = $2
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [category, amount, budgetId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Budget not found or unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a budget
const deleteBudget = async (req, res) => {
  const userId = req.userId;
  const budgetId = req.params.id;

  try {
    const result = await pool.query(
      `DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING *`,
      [budgetId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Budget not found or unauthorized' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
};
