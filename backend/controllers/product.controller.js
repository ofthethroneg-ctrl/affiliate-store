const Product = require('../models/Product');
const { deleteImage } = require('../services/cloudinary.service');

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      q,
      sort = '-createdAt',
      active = 'true'
    } = req.query;

    const query = {};
    if (active === 'true') query.isActive = true;
    if (category && category !== 'all') query.category = category;

    if (q) {
      query.$or = [
        { productName: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ];
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/products/:id
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    if (req.file) {
      productData.imageUrl = req.file.path;
      productData.imagePublicId = req.file.filename;
    }

    const product = await Product.create(productData);
    res.status(201).json({ success: true, data: product, message: 'Product created successfully' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/products/bulk
exports.createBulkProducts = async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, error: 'Products array is required' });
    }
    const created = await Product.insertMany(products, { ordered: false });
    res.status(201).json({ success: true, data: created, message: `${created.length} products created` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    const updateData = { ...req.body };

    if (req.file) {
      // Delete old image from Cloudinary
      if (product.imagePublicId) await deleteImage(product.imagePublicId);
      updateData.imageUrl = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: updated, message: 'Product updated successfully' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    if (product.imagePublicId) await deleteImage(product.imagePublicId);
    await product.deleteOne();

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/products/bulk
exports.deleteBulkProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Product IDs array is required' });
    }

    const products = await Product.find({ _id: { $in: ids } });
    for (const product of products) {
      if (product.imagePublicId) await deleteImage(product.imagePublicId);
    }

    await Product.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: `${ids.length} products deleted successfully` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/products/:id/click - Track affiliate click
exports.trackClick = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } },
      { new: true }
    );
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    res.json({ success: true, affiliateLink: product.affiliateLink, platform: product.platform });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
