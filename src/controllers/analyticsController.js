const pool = require('../config/db');


const getSummaryAnalytics = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await pool.query(
      `SELECT
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
       FROM transactions
       WHERE user_id = $1`,
      [userId]
    );

    const { total_income, total_expense } = result.rows[0];
    const net_savings = (total_income || 0) - (total_expense || 0);

    res.json({ total_income, total_expense, net_savings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getMonthlyAnalytics = async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query(
      `SELECT
         TO_CHAR(created_at, 'YYYY-MM') AS month,
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
       FROM transactions
       WHERE user_id = $1
       GROUP BY month
       ORDER BY month DESC`,
      [userId]
    );

    const formatted = result.rows.map(row => ({
      month: row.month,
      income: parseFloat(row.income),
      expense: parseFloat(row.expense),
      net: parseFloat(row.income) - parseFloat(row.expense)
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getSummaryAnalytics,
  getMonthlyAnalytics
};
