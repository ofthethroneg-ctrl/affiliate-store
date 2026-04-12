# 🛍️ ShopElite — Affiliate E-commerce Platform

A full-stack affiliate product listing platform with a professional Admin Dashboard.
Users browse curated products and are redirected to Amazon, Flipkart, or Meesho via affiliate links.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB |
| Image Storage | Cloudinary |
| Auth | JWT (JSON Web Tokens) |

---

## 📁 Project Structure

```
affiliate-store/
├── backend/
│   ├── controllers/        # Route handlers
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   └── analytics.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── Product.js
│   │   └── Admin.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   └── analytics.routes.js
│   ├── services/
│   │   └── cloudinary.service.js
│   ├── .env.example
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── ProductCard.js
│   │   │   ├── ProductFormModal.js
│   │   │   ├── ProtectedRoute.js
│   │   │   └── Skeleton.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   └── admin/
│   │   │       ├── AdminLogin.js
│   │   │       ├── AdminLayout.js
│   │   │       ├── AdminDashboard.js
│   │   │       └── AdminProducts.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json
└── README.md
```

---

## ⚙️ Prerequisites

Before running the project, make sure you have:

- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (local or Atlas) → https://www.mongodb.com
- **Cloudinary account** (free) → https://cloudinary.com
- **VS Code** → https://code.visualstudio.com

---

## 🛠️ Step-by-Step Setup in VS Code

### Step 1: Open in VS Code

```bash
# Open the project folder in VS Code
code affiliate-store
```

### Step 2: Configure Backend Environment

```bash
# Navigate to backend folder
cd backend

# Copy env example
cp .env.example .env
```

Now open `backend/.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/affiliate-store
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# Get from https://cloudinary.com → Dashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# First admin account (used when seeding)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

NODE_ENV=development
```

### Step 3: Install All Dependencies

Open VS Code integrated terminal (`Ctrl + \`` or `View → Terminal`):

```bash
# From the root affiliate-store/ folder:

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 4: Seed the Database

```bash
# From backend/ folder:
cd backend
npm run seed
```

This creates:
- ✅ Admin account (email/password from .env)
- ✅ 6 sample products with real images

### Step 5: Run the Application

**You need TWO terminal windows in VS Code:**

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
```
Browser opens automatically at `http://localhost:3000`

---

## 🌐 URLs

| URL | Description |
|-----|-------------|
| http://localhost:3000 | User storefront |
| http://localhost:3000/admin/login | Admin login |
| http://localhost:3000/admin/dashboard | Admin dashboard |
| http://localhost:3000/admin/products | Product management |
| http://localhost:5000/api/health | API health check |

---

## 🔑 Default Admin Credentials

```
Email:    admin@example.com
Password: admin123
```

> ⚠️ Change these in your `.env` file before going to production!

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | ❌ | Admin login |
| GET | /api/auth/me | ✅ | Get admin profile |
| PUT | /api/auth/change-password | ✅ | Change password |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/products | ❌ | List products (with filters) |
| GET | /api/products/:id | ❌ | Get single product |
| GET | /api/products/:id/click | ❌ | Track click + get affiliate link |
| POST | /api/products | ✅ | Create product |
| POST | /api/products/bulk | ✅ | Bulk create products |
| PUT | /api/products/:id | ✅ | Update product |
| DELETE | /api/products/:id | ✅ | Delete product |
| DELETE | /api/products/bulk | ✅ | Bulk delete products |

### Analytics
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/analytics/dashboard-stats | ✅ | Dashboard overview |
| GET | /api/analytics/top-products | ✅ | Top clicked products |

### Query Parameters for GET /api/products
```
?page=1          - Page number
?limit=12        - Items per page
?category=Electronics  - Filter by category
?q=sony          - Search term
?sort=-clicks    - Sort field (-createdAt, -clicks, price)
?active=true     - Filter active only (false = show all)
```

---

## 🎛️ Admin Dashboard Features

### Dashboard Overview
- Total products count
- Total affiliate clicks
- Category distribution bar chart
- Platform breakdown
- Recent products table
- Top performing products

### Product Management
- ✅ Add product with image upload (Cloudinary)
- ✅ Edit product
- ✅ Delete product
- ✅ Bulk delete with checkbox selection
- ✅ Search products in real-time
- ✅ Filter by category
- ✅ Pagination
- ✅ Click count tracking per product
- ✅ Image preview before upload
- ✅ Form validation
- ✅ Success/error notifications

---

## 🛒 User Store Features

- Modern dark e-commerce UI
- Product grid with 5 columns (responsive)
- Real-time search
- Category filtering
- Trending products section (top clicked)
- Lazy loading images
- Load more pagination
- Platform badges (Amazon/Flipkart/Meesho)
- Discount badges
- Mobile deep-link support (opens native apps)
- Click tracking before redirect

---

## 📱 Mobile Deep Links

When a user taps "Buy Now" on mobile:
1. API call increments click count
2. Tries to open native app (amazon://, flipkart://, meesho://)
3. Falls back to browser after 1.5 seconds if app not installed

---

## ☁️ Getting Cloudinary Credentials

1. Go to https://cloudinary.com → Sign Up (free)
2. Dashboard → Copy:
   - Cloud Name
   - API Key
   - API Secret
3. Paste into `backend/.env`

---

## 🌍 MongoDB Options

### Option A: Local MongoDB
```bash
# Install MongoDB locally: https://www.mongodb.com/try/download/community
# Then use:
MONGODB_URI=mongodb://localhost:27017/affiliate-store
```

### Option B: MongoDB Atlas (Cloud, Free Tier)
1. Go to https://cloud.mongodb.com → Sign Up
2. Create a free cluster
3. Database Access → Create user
4. Network Access → Allow IP (0.0.0.0/0 for dev)
5. Connect → Copy connection string
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/affiliate-store
```

---

## 🚀 Production Deployment

### Backend (Railway / Render / Heroku)
```bash
# Set environment variables in your platform's dashboard
# Start command: node server.js
```

### Frontend (Vercel / Netlify)
```bash
npm run build
# Upload build/ folder or connect GitHub repo

# Set environment variable:
REACT_APP_API_URL=https://your-backend-url.com/api
```

---

## 📈 Scaling Ideas

1. **Redis caching** — Cache popular product lists (TTL: 5 min)
2. **CDN** — Serve images via Cloudinary CDN (already built-in)
3. **Analytics DB** — Store click events in separate collection with timestamps for time-series analysis
4. **Search** — Integrate Algolia or Elasticsearch for full-text search at scale
5. **Rate limiting** — Per-IP click throttling to prevent fake click inflation
6. **A/B testing** — Track CTR per product placement position
7. **Webhooks** — Auto-update product prices via Amazon PA API
8. **Sitemap** — Auto-generate XML sitemap for SEO

---

## 🎯 Analytics Improvements

1. **Click heatmaps** — Track which page position converts best
2. **Session tracking** — Bounce rate, session duration
3. **Revenue estimation** — If you know commission %, estimate earnings
4. **Geo analytics** — Track clicks by region
5. **Device breakdown** — Mobile vs desktop CTR comparison
6. **Time-series charts** — Clicks per day/week/month
7. **Funnel analysis** — Search → View → Click conversion

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| MongoDB connection error | Check MONGODB_URI in .env, ensure MongoDB is running |
| Cloudinary upload fails | Verify CLOUDINARY_* credentials in .env |
| 401 on admin routes | Token expired — re-login |
| Frontend can't reach backend | Ensure backend is on port 5000, frontend proxy is set |
| npm install fails | Try `npm install --legacy-peer-deps` |

---

## 📝 VS Code Recommended Extensions

- **ES7+ React snippets** — dsznajder.es7-react-js-snippets
- **Tailwind CSS IntelliSense** — bradlc.vscode-tailwindcss
- **Thunder Client** — rangav.vscode-thunder-client (API testing)
- **MongoDB for VS Code** — mongodb.mongodb-vscode
- **Prettier** — esbenp.prettier-vscode

---

Built with ❤️ — ShopElite Affiliate Platform
