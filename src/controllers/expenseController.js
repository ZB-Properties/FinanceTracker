const pool = require('../config/db');

exports.addExpense = async (req, res) => {
  const { title, amount } = req.body;

  const expense = await pool.query(
    'INSERT INTO expenses (title, amount, user_id) VALUES ($1,$2,$3) RETURNING *',
    [title, amount, req.user.id]
  );

  res.status(201).json(expense.rows[0]);
};

exports.getExpenses = async (req, res) => {
  const expenses = await pool.query(
    'SELECT * FROM expenses WHERE user_id=$1',
    [req.user.id]
  );

  res.json(expenses.rows);
};
