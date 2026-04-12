const express = require('express');
const router = express.Router();
const { getDashboardStats, getTopProducts } = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/dashboard-stats', protect, getDashboardStats);
router.get('/top-products', protect, getTopProducts);

module.exports = router;
