const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getSummaryAnalytics,
  getMonthlyAnalytics
} = require('../controllers/analyticsController');



router.get('/summary', authMiddleware, getSummaryAnalytics);
router.get('/monthly', authMiddleware, getMonthlyAnalytics);

module.exports = router;
