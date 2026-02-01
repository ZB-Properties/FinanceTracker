const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');


const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://finance-tracker-wheat-zeta.vercel.app'
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));


app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);


app.get('/', (req, res) => {
  res.send('Finance Tracker API is running!');
});


module.exports = app;
