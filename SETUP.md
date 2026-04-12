# ⚡ ShopElite — Quick Setup Cheat Sheet

## Prerequisites
- Node.js v18+ (https://nodejs.org)
- MongoDB running locally OR a MongoDB Atlas URI
- Cloudinary account (free at https://cloudinary.com)

---

## 1. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/affiliate-store
JWT_SECRET=pick_any_long_random_string
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

---

## 2. Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

---

## 3. Seed Database

```bash
cd backend
npm run seed
```

---

## 4. Run (two terminals)

**Terminal A — Backend:**
```bash
cd backend
npm run dev
# → http://localhost:5000
```

**Terminal B — Frontend:**
```bash
cd frontend
npm start
# → http://localhost:3000
```

---

## 5. Open in Browser

| Page | URL |
|------|-----|
| Store | http://localhost:3000 |
| Admin Login | http://localhost:3000/admin/login |
| Dashboard | http://localhost:3000/admin/dashboard |
| Products | http://localhost:3000/admin/products |

**Default admin:** `admin@example.com` / `admin123`

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Port 5000 in use | `kill $(lsof -ti:5000)` or change PORT in .env |
| MongoDB refused | Start MongoDB: `brew services start mongodb-community` (Mac) or `net start MongoDB` (Windows) |
| Cloudinary error | Double-check CLOUDINARY_* values in .env |
| CORS error | Make sure frontend proxy in package.json points to `http://localhost:5000` |
| `npm install` fails | Run with `--legacy-peer-deps` flag |
