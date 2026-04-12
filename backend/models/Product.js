const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Product image is required']
  },
  imagePublicId: {
    type: String, // For Cloudinary deletion
    default: null
  },
  affiliateLink: {
    type: String,
    required: [true, 'Affiliate link is required'],
    trim: true
  },
  platform: {
    type: String,
    enum: ['amazon', 'flipkart', 'meesho', 'other'],
    default: 'other'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Electronics',
      'Fashion',
      'Home & Kitchen',
      'Beauty & Personal Care',
      'Sports & Fitness',
      'Books',
      'Toys & Games',
      'Automotive',
      'Health',
      'Grocery',
      'Jewellery',
      'Other'
    ]
  },
  price: {
    type: Number,
    default: null
  },
  originalPrice: {
    type: Number,
    default: null
  },
  discount: {
    type: Number,
    default: null // percentage
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  clicks: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String]
}, {
  timestamps: true
});

// Auto-detect platform from affiliate link
productSchema.pre('save', function(next) {
  const link = this.affiliateLink.toLowerCase();
  if (link.includes('amazon')) this.platform = 'amazon';
  else if (link.includes('flipkart')) this.platform = 'flipkart';
  else if (link.includes('meesho')) this.platform = 'meesho';
  else this.platform = 'other';
  next();
});

// Index for search
productSchema.index({ productName: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ clicks: -1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
