// ✅ 1. LOAD ENV FIRST
require('dotenv').config();

const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Product = require('./models/Product');

// ✅ 2. SAMPLE PRODUCTS
const sampleProducts = [
  {
    productName: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    affiliateLink: 'https://www.amazon.in/dp/B09XS7JWHH',
    category: 'Electronics',
    price: 24990,
    originalPrice: 34990,
    discount: 29,
    clicks: 145,
    platform: 'amazon',
    tags: ['headphones', 'sony', 'wireless', 'noise cancelling']
  },
  {
    productName: "Levi's 511 Slim Fit Jeans",
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    affiliateLink: 'https://www.flipkart.com/levis-jeans',
    category: 'Fashion',
    price: 1999,
    originalPrice: 3999,
    discount: 50,
    clicks: 89,
    platform: 'flipkart',
    tags: ['jeans', 'levis', 'fashion', 'men']
  },
  {
    productName: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400',
    affiliateLink: 'https://www.amazon.in/dp/instant-pot',
    category: 'Home & Kitchen',
    price: 6999,
    originalPrice: 9999,
    discount: 30,
    clicks: 67,
    platform: 'amazon',
    tags: ['cooker', 'kitchen', 'instant pot']
  },
  {
    productName: 'Boat Airdopes 141 Bluetooth Earbuds',
    imageUrl: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400',
    affiliateLink: 'https://www.flipkart.com/boat-airdopes',
    category: 'Electronics',
    price: 999,
    originalPrice: 2990,
    discount: 67,
    clicks: 234,
    platform: 'flipkart',
    tags: ['earbuds', 'boat', 'wireless', 'bluetooth']
  },
  {
    productName: 'Mamaearth Vitamin C Face Serum',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
    affiliateLink: 'https://www.meesho.com/mamaearth-serum',
    category: 'Beauty & Personal Care',
    price: 399,
    originalPrice: 599,
    discount: 33,
    clicks: 178,
    platform: 'meesho',
    tags: ['serum', 'vitamin c', 'skincare', 'mamaearth']
  },
  {
    productName: 'Adidas Ultraboost Running Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    affiliateLink: 'https://www.amazon.in/adidas-ultraboost',
    category: 'Sports & Fitness',
    price: 8999,
    originalPrice: 14999,
    discount: 40,
    clicks: 112,
    platform: 'amazon',
    tags: ['shoes', 'adidas', 'running', 'sports']
  }
];

// ✅ 3. SEED FUNCTION
async function seed() {
  try {
    // 🔥 IMPORTANT FIX HERE
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not found in .env file');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // ✅ Create Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await Admin.create({
        email: adminEmail,
        password: adminPassword,
        name: 'Admin'
      });
      console.log('✅ Admin created:', adminEmail);
    } else {
      console.log('ℹ️ Admin already exists');
    }

    // ✅ Seed Products
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log(`✅ ${sampleProducts.length} products inserted`);

    console.log('\n🎉 SEED SUCCESS');
    console.log('👉 Login Email:', adminEmail);
    console.log('👉 Password:', adminPassword);

    process.exit(0);

  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

// ✅ 4. RUN
seed();