# 🏗️ Admin Panel Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser / Client                        │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
        ┌───────────▼────────┐  ┌──────▼───────────┐
        │   PUBLIC PAGES     │  │   ADMIN PAGES    │
        │   (Visible in UI)  │  │  (Hidden/Direct) │
        └────────────────────┘  └──────────────────┘
                    │                   │
        ┌───────────▼────────┐  ┌──────▼───────────┐
        │                    │  │                  │
        │  /  (Homepage)     │  │ /admin/login     │
        │  /login            │  │ /admin           │
        │  /register         │  │                  │
        │  /events           │  │ (PROTECTED)      │
        │                    │  │ Requires JWT     │
        └────────┬───────────┘  └────────┬─────────┘
                 │                       │
                 │ API Calls             │ API Calls
                 │                       │
        ┌────────▼──────────────────────▼────────┐
        │                                        │
        │    BACKEND API (Express.js)            │
        │    Port: 5000                          │
        │                                        │
        │  ┌──────────────────────────────────┐  │
        │  │ User Routes:                     │  │
        │  │ POST /api/auth/login             │  │
        │  │ POST /api/auth/register          │  │
        │  │ GET  /api/events                 │  │
        │  └──────────────────────────────────┘  │
        │                                        │
        │  ┌──────────────────────────────────┐  │
        │  │ Admin Routes (HIDDEN):           │  │
        │  │ POST /api/auth/admin/login  ◄───┼─ (Not in UI)
        │  │ GET  /api/admin/events          │  │
        │  │ POST /api/admin/events          │  │
        │  │ PUT  /api/admin/events/:id      │  │
        │  │ DEL  /api/admin/events/:id      │  │
        │  └──────────────────────────────────┘  │
        │                                        │
        └─────────────────┬──────────────────────┘
                          │
                 ┌────────▼────────┐
                 │                 │
                 │   DATABASE      │
                 │  (PostgreSQL)   │
                 │                 │
                 │ Tables:         │
                 │ - users         │
                 │ - events        │
                 │                 │
                 └─────────────────┘
```

---

## 🔐 Authentication Flow

### User Flow
```
1. User visits http://localhost:3000
                   ↓
2. Sees homepage with [Daftar] [Masuk]
                   ↓
3. Clicks [Masuk] → /login
                   ↓
4. Enters: email + password
                   ↓
5. POST /api/auth/login
                   ↓
6. Backend verifies credentials
                   ↓
7. Returns JWT token
                   ↓
8. Frontend stores token in localStorage
                   ↓
9. Redirects to /events (dashboard)
                   ↓
10. Token sent in Authorization header for API calls
```

### Admin Flow (HIDDEN)
```
1. User knows secret URL: http://localhost:3000/admin/login
                   ↓
2. Types URL directly (no link in UI)
                   ↓
3. Sees admin login form
                   ↓
4. Enters: username + password
                   ↓
5. POST /api/auth/admin/login
                   ↓
6. Backend verifies admin credentials
                   ↓
7. Returns JWT token (admin token)
                   ↓
8. Frontend stores token in localStorage (key: adminToken)
                   ↓
9. Redirects to /admin (dashboard)
                   ↓
10. Admin token sent in Authorization header
                   ↓
11. Backend validates token is admin token
                   ↓
12. Admin can manage all events
```

---

## 📊 Directory Structure

```
event_campus/
├── frontend/                          # React + Next.js App
│   ├── app/
│   │   ├── page.tsx                   # Homepage (public)
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx         # User login
│   │   │   └── register/page.tsx      # User register
│   │   ├── admin/
│   │   │   ├── login/page.tsx         # Admin login (HIDDEN)
│   │   │   ├── page.tsx               # Admin dashboard (PROTECTED)
│   │   │   └── components/
│   │   │       └── AdminDashboard     # Admin UI
│   │   └── layout.tsx
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── AdminDashboard.tsx
│   ├── lib/
│   │   └── api.ts                     # API client (authAPI, adminAPI)
│   └── package.json
│
├── backend/                            # Express + PostgreSQL
│   ├── src/
│   │   ├── controllers/
│   │   │   └── authController.js      # loginUser, adminLogin
│   │   ├── routes/
│   │   │   ├── authRoutes.js          # /auth/login, /auth/admin/login
│   │   │   └── eventRoutes.js         # /events, /admin/events
│   │   ├── models/
│   │   │   ├── userModel.js
│   │   │   └── eventModel.js
│   │   ├── config/
│   │   │   └── db.js
│   │   └── server.js
│   └── package.json
│
└── docker-compose.yml                 # Docker setup
```

---

## 🔑 Key Endpoints

### Public Endpoints (User)
```
POST   /api/auth/login              Login with email & password
POST   /api/auth/register           Register new user
GET    /api/events                  Get all events
GET    /api/events/search?q=...     Search events
```

### Admin Endpoints (HIDDEN)
```
POST   /api/auth/admin/login        Admin login (username & password)
GET    /api/admin/events            Get all events (admin view)
POST   /api/admin/events            Create event
PUT    /api/admin/events/:id        Update event
DELETE /api/admin/events/:id        Delete event
```

---

## 🛡️ Security Layers

### Layer 1: URL Hiding
- ❌ No link to `/admin/login` in UI
- ✅ Must know URL to access

### Layer 2: Separate Credentials
- ❌ Admin doesn't use user database
- ✅ Admin has separate username/password

### Layer 3: JWT Tokens
- Token stored in `localStorage`
- Token includes role (user vs admin)
- Token expires after 7 days

### Layer 4: Protected Routes
- Frontend checks if `adminToken` exists
- If missing, redirect to `/admin/login`
- Backend validates token before processing admin requests

### Layer 5: Credentials Storage
- 🔐 Use environment variables for production:
  ```env
  ADMIN_USERNAME=your_admin_username
  ADMIN_PASSWORD=your_strong_password
  JWT_SECRET=your_secret_key
  ```

---

## 🔄 Component Interactions

### Frontend Components

```
App Layout (Root)
    │
    ├── / (Homepage)
    │   ├── [Daftar] → /register
    │   └── [Masuk] → /login
    │
    ├── /login (UserLogin)
    │   └── Auth API → JWT Token
    │
    ├── /register (UserRegister)
    │   └── Auth API → User Created
    │
    ├── /events (UserDashboard)
    │   └── Event API → Display Events
    │
    ├── /admin/login (AdminLogin) ← HIDDEN URL
    │   └── Admin API → JWT Token
    │
    └── /admin (AdminDashboard) ← PROTECTED
        ├── Check adminToken
        ├── Redirect if missing
        └── Admin API → Manage Events
```

### Backend Components

```
Express Server (Port 5000)
    │
    ├── Middleware
    │   ├── CORS handling
    │   ├── JSON parser
    │   └── JWT verification
    │
    ├── Routes
    │   ├── /auth
    │   │   ├── POST /login (user)
    │   │   ├── POST /register (user)
    │   │   └── POST /admin/login (admin) ← Hidden
    │   │
    │   └── /events
    │       ├── GET / (public)
    │       └── POST, PUT, DELETE (admin protected)
    │
    ├── Controllers
    │   ├── authController.js
    │   │   ├── loginUser()
    │   │   ├── registerUser()
    │   │   └── adminLogin()
    │   │
    │   └── eventController.js
    │       ├── getAllEvents()
    │       ├── createEvent()
    │       └── updateEvent()
    │
    └── Database
        ├── PostgreSQL
        ├── users table
        └── events table
```

---

## 🚀 Deployment Notes

### Environment Variables (Backend)
```env
# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Security
JWT_SECRET=your_random_secret_key_here

# Database
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=event_campus

# Server
PORT=5000
```

### Environment Variables (Frontend)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📈 Scalability Considerations

### Future Enhancements
- [ ] Move admin credentials to database with bcrypt hashing
- [ ] Implement role-based access control (RBAC)
- [ ] Add admin audit logs
- [ ] Multi-admin support with permissions
- [ ] Token refresh mechanism
- [ ] Rate limiting on admin endpoints
- [ ] Two-factor authentication (2FA)

---

## ✅ Final Checklist

- [x] Admin pages created (/admin/login, /admin)
- [x] Admin authentication endpoint created
- [x] Admin credentials configured
- [x] JWT tokens implemented
- [x] Protected routes implemented
- [x] Admin URL hidden from UI
- [x] Homepage shows only user options
- [x] localStorage keys used (token, adminToken)
- [x] Error handling implemented
- [x] Testing documentation created

**Status: COMPLETE & READY FOR TESTING** ✨

