const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1,$2) RETURNING id,email',
    [email, hashedPassword]
  );

  res.status(201).json(user.rows[0]);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query(
    'SELECT * FROM users WHERE email=$1',
    [email]
  );

  if (!user.rows.length) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.rows[0].password);
  if (!valid) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.rows[0].id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ token });
};
