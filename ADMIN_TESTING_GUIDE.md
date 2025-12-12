# 🧪 Admin Panel Testing Guide

## Quick Start

### 1. Frontend (sudah running)
```
Status: ✅ Running di http://localhost:3000
```

### 2. Backend (pastikan running)
```bash
cd backend
npm run dev
```
Backend harus running di `http://localhost:5000`

---

## 🧪 Test Scenario 1: Homepage - User Only View

**Step 1:** Buka `http://localhost:3000`

**Expected Result:**
```
Homepage terlihat dengan:
- 🎓 Event Campus (Title)
- ✍️ Daftar Sekarang (Blue button)
- 🔓 Masuk (Green button)
- ❌ TIDAK ada tombol "Admin Login"
```

---

## 🧪 Test Scenario 2: User Login Flow

**Step 1:** Klik tombol "🔓 Masuk"

**Step 2:** Masukkan credentials user (dari database):
```
Email: user@example.com
Password: password123
```

**Expected Result:**
```
✅ Login berhasil
✅ Redirect ke events dashboard
✅ Token disimpan di localStorage dengan key "token"
```

---

## 🧪 Test Scenario 3: Admin Login (Hidden Access)

### Method A: Direct URL

**Step 1:** Di browser address bar, ketik langsung:
```
http://localhost:3000/admin/login
```

**Step 2:** Masukkan admin credentials:
```
Username: admin
Password: admin123
```

**Step 3:** Klik "Login"

**Expected Result:**
```
✅ Admin login berhasil
✅ Redirect ke /admin dashboard
✅ Admin token disimpan di localStorage dengan key "adminToken"
✅ Dashboard menampilkan opsi manage events
```

### Method B: Via API (Using Postman/cURL)

**Request:**
```
POST http://localhost:5000/api/auth/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Expected Response (200 OK):**
```json
{
  "message": "Login admin berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🧪 Test Scenario 4: Admin Dashboard Access

**Step 1:** Setelah login admin, Anda harus berada di `/admin`

**Step 2:** Check localStorage:
```javascript
// Open browser console (F12)
localStorage.getItem("adminToken")
// Output: JWT token admin
```

**Expected Features:**
```
✅ View all events
✅ Create new event
✅ Update event
✅ Delete event
✅ Logout button
```

---

## 🧪 Test Scenario 5: Security - Admin URL Protection

**Step 1:** Clear localStorage
```javascript
localStorage.clear()
```

**Step 2:** Coba akses `/admin` tanpa login
```
http://localhost:3000/admin
```

**Expected Result:**
```
❌ Automatic redirect ke /admin/login
(Karena tidak ada adminToken di localStorage)
```

---

## 🧪 Test Scenario 6: Wrong Admin Credentials

**Step 1:** Akses `http://localhost:3000/admin/login`

**Step 2:** Masukkan credentials salah:
```
Username: admin
Password: wrong_password
```

**Step 3:** Klik Login

**Expected Result:**
```
❌ Error message: "Username atau password admin salah"
❌ Tetap di halaman login
❌ Tidak ada redirect
```

---

## 🔍 Verification Checklist

### Homepage
- [ ] Hanya 2 button terlihat (Daftar, Masuk)
- [ ] Tidak ada tombol "Admin Login"
- [ ] Design clean dan user-friendly

### Admin Login
- [ ] URL `/admin/login` accessible
- [ ] Form menampilkan Username & Password fields
- [ ] Error message muncul untuk credentials salah
- [ ] Success login mengarahkan ke `/admin`

### Admin Dashboard
- [ ] Hanya terlihat jika login berhasil
- [ ] Menampilkan admin features
- [ ] Token tersimpan di localStorage (key: `adminToken`)
- [ ] Logout button berfungsi

### Security
- [ ] Admin URL tidak terlihat di UI
- [ ] Protected route (redirect jika tidak login)
- [ ] Credentials terpisah dari user database
- [ ] Token expiry berlaku

---

## 🐛 Troubleshooting

### Admin login page blank/error
- ✅ Cek frontend dev server running (`http://localhost:3000`)
- ✅ Cek browser console untuk error messages
- ✅ Clear cache: `Ctrl+Shift+Delete`

### Login gagal 401
- ✅ Cek backend running (`http://localhost:5000`)
- ✅ Verify credentials: `admin` / `admin123`
- ✅ Check network tab di browser developer tools

### Cannot redirect to admin dashboard
- ✅ Check localStorage has `adminToken`
- ✅ Check token tidak expired
- ✅ Clear localStorage dan login ulang

### API endpoint not found
- ✅ Verify backend route exists: `POST /api/auth/admin/login`
- ✅ Check `backend/src/routes/authRoutes.js`
- ✅ Restart backend server

---

## 📊 Test Results Template

```
Date: [DD/MM/YYYY]
Tester: [Your Name]
Environment: 
  - Frontend: http://localhost:3000 ✅/❌
  - Backend: http://localhost:5000 ✅/❌

Test Results:
  [ ] Scenario 1: Homepage - User Only View
  [ ] Scenario 2: User Login Flow
  [ ] Scenario 3: Admin Login (Direct URL)
  [ ] Scenario 4: Admin Dashboard Access
  [ ] Scenario 5: Admin URL Protection
  [ ] Scenario 6: Wrong Admin Credentials

Issues Found:
- [List any issues]

Overall Status: ✅ PASS / ❌ FAIL
```

---

## 🎯 Success Criteria

✅ Homepage menampilkan HANYA user options  
✅ Admin login accessible via direct URL saja  
✅ Admin credentials tidak terlihat di UI  
✅ Protected routes berfungsi dengan benar  
✅ Error handling proper dan user-friendly  

---

**Ready to test? Start dengan Step 1! 🚀**

