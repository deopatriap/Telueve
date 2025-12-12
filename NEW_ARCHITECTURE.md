# 🎯 New Architecture - User & Admin Separation

## Konsep Baru

Website sekarang terpisah menjadi **2 halaman utama**:

```
┌─────────────────────────────────────────────────┐
│  NORMAL WEBSITE (User/Mahasiswa)               │
├─────────────────────────────────────────────────┤
│  /               (Homepage)                     │
│  /register       (Register user)                │
│  /login          (User login)                   │
│  /events         (Browse events - after login)  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  ADMIN PANEL (Terpisah)                        │
├─────────────────────────────────────────────────┤
│  /admin/login    (Admin login only)             │
│  /admin          (Admin dashboard - after login)│
└─────────────────────────────────────────────────┘
```

---

## 📁 URL Structure

### User Flow (Normal Website)
```
/                    ← Homepage (Daftar/Masuk buttons)
  ├─ /register       ← Register page
  ├─ /login          ← User login (with Admin Login button)
  └─ /events         ← Events list (after user login)
```

### Admin Flow (Separate)
```
/admin/login         ← Admin login page
/admin               ← Admin dashboard (after admin login)
```

---

## 🔐 Authentication

### User Login
```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
→ Returns: { token, user }
→ Stores: localStorage.setItem("token", token)
→ Redirects: /events
```

### Admin Login
```
POST /api/admin/login
{
  "username": "admin",
  "password": "admin123"
}
→ Returns: { token, admin }
→ Stores: localStorage.setItem("adminToken", token)
→ Redirects: /admin
```

---

## 📱 User Pages

### 1. Homepage (/)
- Simple landing page
- **Buttons:**
  - "✍️ Daftar Sekarang" → /register
  - "🔓 Masuk" → /login
- Clean, welcoming design
- NO admin button

### 2. Register (/register)
- Email, name, password form
- Create new user account

### 3. Login (/login)
- Email + password login
- **Important:** Button "🔐 Admin Login" di bawah
  - Leads to: /admin/login
- After successful login → redirect to /events

### 4. Events (/events)
- Show all events created by admin
- Search, filter, pagination
- User-friendly view
- Logout button

---

## 🔐 Admin Pages

### 1. Admin Login (/admin/login)
- Simple page with username + password
- **Important:** Form fields:
  - Username: admin
  - Password: admin123
- After successful login → redirect to /admin
- "← Kembali ke Homepage" link (back to /)

### 2. Admin Dashboard (/admin)
- Full event management interface
- Create/Edit/Delete events
- Events table
- Logout button

---

## 🔄 User vs Admin Flow

### User Journey
```
Visit website → http://localhost:3000
           ↓
Homepage (/)
           ↓
Click "Masuk" → /login
           ↓
Enter email & password
           ↓
Click "Masuk"
           ↓
POST /api/auth/login
           ↓
Success → Token saved → Redirect to /events
           ↓
Browse all events
           ↓
Click "Logout" → Clear token → Back to /
```

### Admin Journey
```
1. Open user login: http://localhost:3000/login
2. Click "🔐 Admin Login" button at bottom
3. Redirects to: /admin/login
           ↓
Enter username: admin
Enter password: admin123
           ↓
Click "Login"
           ↓
POST /api/admin/login
           ↓
Success → Token saved → Redirect to /admin
           ↓
Manage events (Create/Edit/Delete)
           ↓
Click "Logout" → Clear token → Back to /admin/login
```

---

## 🗂️ File Structure

```
frontend/
├── app/
│   ├── page.tsx                      (Homepage - NO admin stuff)
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx              (User login + Admin link)
│   │   └── register/
│   │       └── page.tsx              (User register)
│   ├── (app)/
│   │   └── events/
│   │       └── page.tsx              (Events page for users)
│   └── admin/                        (ADMIN SECTION - NEW!)
│       ├── login/
│       │   └── page.tsx              (Admin login - NEW!)
│       └── page.tsx                  (Admin dashboard - NEW!)
└── components/
    ├── AdminDashboard.tsx            (Used by /admin)
    ├── AdminLoginModal.tsx           (NOT USED anymore)
    └── ...
```

---

## 🔑 Key Differences

| Aspect | User | Admin |
|--------|------|-------|
| **Homepage** | / | /admin/login |
| **Login** | Email + Password | Username + Password |
| **Endpoint** | POST /api/auth/login | POST /api/admin/login |
| **Token Key** | "token" | "adminToken" |
| **Can Create Events** | ❌ No | ✅ Yes |
| **Can Edit Events** | ❌ No | ✅ Yes |
| **Can Delete Events** | ❌ No | ✅ Yes |
| **Can View Events** | ✅ Yes | ✅ Yes |

---

## 🚀 How to Use

### For Normal Users
1. Open http://localhost:3000
2. Click "Masuk" → /login
3. Enter email & password
4. Get redirected to /events
5. Browse events

### For Admin
1. Open http://localhost:3000/login
2. Scroll down → Click "🔐 Admin Login"
3. Go to /admin/login
4. Enter username: `admin`
5. Enter password: `admin123`
6. Get redirected to /admin
7. Manage events

---

## 📝 Backend API (No Changes)

Backend API endpoints remain the same:

```
# User Auth
POST   /api/auth/register
POST   /api/auth/login

# Events (Public Read)
GET    /api/events
GET    /api/events/search
GET    /api/events/paginated

# Admin (Protected)
POST   /api/admin/login
GET    /api/admin/events
POST   /api/admin/events
PUT    /api/admin/events/:id
DELETE /api/admin/events/:id
```

---

## ✅ Benefits of New Structure

✅ **Clear Separation** - Users don't see admin stuff
✅ **Professional** - Like real websites (e.g., Oura Store)
✅ **Simple** - Admin login just like any other website
✅ **Clean URLs** - /admin/login for admin, /login for users
✅ **Better UX** - Users see only what they need
✅ **Scalable** - Easy to add more admin features later

---

## 🧪 Testing Checklist

### User Flow
- [ ] Homepage loads without admin stuff
- [ ] Register page works
- [ ] Login page shows "Admin Login" button
- [ ] Can login with email/password
- [ ] Redirects to /events after login
- [ ] Can browse events
- [ ] Can logout

### Admin Flow
- [ ] Go to /admin/login page
- [ ] Admin login form appears
- [ ] Enter admin / admin123
- [ ] Can login successfully
- [ ] Redirects to /admin dashboard
- [ ] Can create events
- [ ] Can edit events
- [ ] Can delete events
- [ ] Can logout

---

## 🔗 Quick Links

| Page | URL | Purpose |
|------|-----|---------|
| Homepage | / | Welcome page (users only) |
| Register | /register | User registration |
| User Login | /login | User login (with admin link) |
| Events | /events | User browse events |
| Admin Login | /admin/login | Admin login |
| Admin Panel | /admin | Admin dashboard |

---

## 💡 Example: Real Websites

This pattern is used by many websites:

- **Oura Store** - User page vs Admin login
- **Shopify** - /login vs /admin/login
- **WordPress** - / (blog) vs /wp-admin (admin)
- **GitHub** - Normal pages vs Settings/Admin

Now Event Campus follows the same professional pattern! 🎉
