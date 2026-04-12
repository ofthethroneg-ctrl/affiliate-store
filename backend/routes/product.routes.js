const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  createBulkProducts,
  updateProduct,
  deleteProduct,
  deleteBulkProducts,
  trackClick
} = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../services/cloudinary.service');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/:id/click', trackClick);

// Protected admin routes
router.post('/', protect, upload.single('image'), createProduct);
router.post('/bulk', protect, createBulkProducts);
router.put('/:id', protect, upload.single('image'), updateProduct);
router.delete('/bulk', protect, deleteBulkProducts);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
