# RateHub — Discover. Rate. Improve.

> A full-stack, production-ready store ratings and reviews platform built with React 18, Node.js, Express, Prisma, and PostgreSQL.

![RateHub Banner](https://via.placeholder.com/1200x400/2563EB/FFFFFF?text=RateHub+%E2%80%94+Discover.+Rate.+Improve.)

---

## ✨ Features

### 🔐 Authentication & Roles
- JWT-based authentication with refresh token flow
- Three roles: **Admin**, **Store Owner**, **User**
- Protected routes with role-based access control
- Password strength indicator & validation (8–16 chars, uppercase, lowercase, number, special)
- Remember me, show/hide password toggle

### 🛒 Store Discovery (Users)
- Browse all stores with rich cards
- Real-time search by name / address
- Sort: A–Z, Z–A, Highest Rated, Lowest Rated, Newest
- Filter by minimum star rating
- Paginated results
- Detailed store page with rating breakdown

### ⭐ Rating System
- One rating per user per store
- Animated star selection with golden glow effect
- Confetti animation on first submission
- Update and delete own ratings
- Rating distribution chart on store detail

### 👤 User Dashboard
- Stats: stores rated, average rating given, stores discovered
- Recent ratings timeline
- Quick-access links to discover / manage ratings

### 🏪 Store Owner Dashboard
- Average rating, total reviews, monthly reviews
- Monthly review volume area chart
- Average rating trend line chart
- Rating distribution bar chart
- Latest reviews list

### 🛡️ Admin Panel
- Full CRUD for **Users**, **Stores**, **Ratings**
- Platform overview: total users, stores, ratings, average rating
- Analytics charts: ratings distribution, users by role, store growth
- Recent activity feed
- CSV export for all tables
- Search, sort, paginate all tables
- Confirmation modals for destructive actions

### 🎨 UI/UX
- Dark / Light mode with smooth 300ms transition
- System theme auto-detection + localStorage persistence
- Premium glassmorphism cards on auth pages
- Store-themed animated background icons (🛒🏪⭐🛍️📦)
- Custom animated cursor with hover enlargement
- Framer Motion page transitions, stagger animations
- Animated statistics counters
- Animated rating stars with sparkle effect
- Skeleton loaders for all loading states
- Beautiful empty states with illustrations
- Confetti on first rating submission
- Fully responsive (mobile-first)
- Custom scrollbars
- Toast notifications

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router DOM v6 |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React, React Icons |
| Toasts | React Hot Toast |
| HTTP | Axios |
| Backend | Node.js, Express.js |
| ORM | Prisma |
| Database | PostgreSQL (Neon) |
| Auth | JWT + Bcrypt |
| Validation | Zod |
| Security | Helmet, CORS, Rate Limiting |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or [Neon](https://neon.tech))
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ratehub.git
cd ratehub
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
# Fill in your DATABASE_URL and JWT_SECRET in .env
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend `.env`
```env
DATABASE_URL="postgresql://user:password@host:5432/ratehub"
JWT_SECRET="your-very-secure-secret-min-32-characters"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:5173"
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 👤 Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@ratehub.com | Admin@123 |
| Store Owner | rahul@techmart.com | Owner@123 |
| User | user@ratehub.com | User@123 |

---

## 📁 Folder Structure

```
ratehub/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Navbar, Sidebar, DashboardLayout, ProtectedRoute
│   │   │   └── ui/            # Logo, RatingStars, Modal, Table, StatCard, etc.
│   │   ├── pages/
│   │   │   ├── admin/         # AdminDashboard, AdminUsers, AdminStores, AdminRatings
│   │   │   ├── auth/          # LoginPage, RegisterPage
│   │   │   ├── owner/         # OwnerDashboard, OwnerStore, OwnerReviews, OwnerAnalytics
│   │   │   └── user/          # UserDashboard, StoresPage, StoreDetail, MyRatings
│   │   ├── context/           # AuthContext, ThemeContext
│   │   ├── services/          # api.js (Axios instance + all endpoints)
│   │   ├── utils/             # helpers.js
│   │   └── styles/            # index.css (Tailwind + custom CSS)
│   └── public/
│       └── favicon.svg
│
└── backend/
    ├── controllers/           # auth, user, store, rating, dashboard
    ├── routes/                # auth, user, store, rating, dashboard
    ├── middleware/            # auth.middleware.js, validate.middleware.js
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.js
    └── server.js
```

---

## 🌐 API Documentation

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/password | Update password |

### Users (Admin only)
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/users | List all users (search, sort, paginate) |
| POST | /api/users | Create user |
| GET | /api/users/:id | Get user by ID |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |

### Stores
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/stores | List stores (search, sort, filter) |
| GET | /api/stores/my | Get owner's store |
| GET | /api/stores/:id | Get store with ratings |
| POST | /api/stores | Create store (Admin) |
| PUT | /api/stores/:id | Update store (Admin/Owner) |
| DELETE | /api/stores/:id | Delete store (Admin) |

### Ratings
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/ratings | All ratings (Admin) |
| GET | /api/ratings/user | Current user's ratings |
| GET | /api/ratings/store/:id | Ratings for a store |
| POST | /api/ratings | Submit rating |
| PUT | /api/ratings/:id | Update rating |
| DELETE | /api/ratings/:id | Delete rating |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/dashboard/admin | Admin stats & analytics |
| GET | /api/dashboard/owner | Store owner stats |
| GET | /api/dashboard/user | User stats |

---

## 🗄️ Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  name      String                          # 20–60 chars
  email     String   @unique
  password  String
  address   String                          # max 400 chars
  role      Role     @default(USER)         # ADMIN | STORE_OWNER | USER
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ratings   Rating[]
  store     Store?   @relation("StoreOwner")
}

model Store {
  id        String   @id @default(cuid())
  name      String                          # 20–60 chars
  email     String   @unique
  address   String
  ownerId   String?  @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  owner     User?
  ratings   Rating[]
}

model Rating {
  id        String   @id @default(cuid())
  rating    Int                             # 1–5
  userId    String
  storeId   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@unique([userId, storeId])              # One rating per user per store
}
```

---

## 🚢 Deployment

### Frontend → Vercel
1. Push `frontend/` to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Set `VITE_API_URL` environment variable
4. Deploy

### Backend → Render
1. Push `backend/` to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Build command: `npm install && npx prisma generate && npx prisma db push`
4. Start command: `node server.js`
5. Set all environment variables
6. Deploy

### Database → Neon PostgreSQL
1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy connection string to `DATABASE_URL`

---

## 🔮 Future Enhancements

- [ ] Email verification on register
- [ ] OAuth (Google, GitHub)
- [ ] Image upload for store logos
- [ ] Review text comments alongside star ratings
- [ ] Notification system (email + in-app)
- [ ] Infinite scroll for stores
- [ ] Store categories and tags
- [ ] Map integration for store locations
- [ ] Bulk CSV import for stores
- [ ] Admin audit log
- [ ] Multi-language support (i18n)
- [ ] PWA support with offline mode

---

## 📸 Screenshots

> Add screenshots of your running application here.

| Landing Page | Admin Dashboard | Store Detail |
|---|---|---|
| ![Landing](placeholder) | ![Admin](placeholder) | ![Store](placeholder) |

---

## 📝 License

MIT © 2025 RateHub

---

<div align="center">
  <strong>RateHub — Discover. Rate. Improve.</strong><br/>
  Built with ❤️ for the modern web
</div>
