const Product = require('../models/Product');

// GET /api/analytics/dashboard-stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const totalClicks = await Product.aggregate([
      { $group: { _id: null, total: { $sum: '$clicks' } } }
    ]);

    const categoryCounts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, clicks: { $sum: '$clicks' } } },
      { $sort: { count: -1 } }
    ]);

    const platformCounts = await Product.aggregate([
      { $group: { _id: '$platform', count: { $sum: 1 } } }
    ]);

    // Recent products
    const recentProducts = await Product.find()
      .sort('-createdAt')
      .limit(5)
      .select('productName imageUrl category clicks createdAt');

    res.json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        totalClicks: totalClicks[0]?.total || 0,
        categoryCounts,
        platformCounts,
        recentProducts
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/analytics/top-products
exports.getTopProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const products = await Product.find({ isActive: true })
      .sort('-clicks')
      .limit(parseInt(limit))
      .select('productName imageUrl category clicks affiliateLink platform price');

    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
