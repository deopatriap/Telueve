# 🔐 Admin Access Guide

## Overview
Admin panel adalah **tersembunyi dari UI public**. Hanya user yang tahu URL admin login dapat mengaksesnya. Ini adalah cara yang aman untuk menjaga admin panel dari akses publik.

---

## 📍 Cara Akses Admin Panel

### **Option 1: Akses URL Langsung di Browser**
1. Buka browser
2. Ketik URL: `http://localhost:3000/admin/login`
3. Masukkan credentials:
   - **Username:** `admin`
   - **Password:** `admin123`
4. Klik **Login**

### **Option 2: Test via cURL (Command Line)**

#### Windows CMD:
```cmd
curl -X POST http://localhost:5000/api/auth/admin/login ^
  -H "Content-Type: application/json" ^
  -d {"username":"admin","password":"admin123"}
```

#### Windows PowerShell:
```powershell
$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/admin/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

#### Linux/Mac (Bash):
```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 📋 Admin Credentials

| Field | Value |
|-------|-------|
| **Username** | `admin` |
| **Password** | `admin123` |

⚠️ **Penting:** Untuk production, ubah credentials di file `.env` backend:

```env
ADMIN_USERNAME=admin_anda
ADMIN_PASSWORD=password_yang_kuat
```

---

## 🔄 Admin Login Flow

```
Direct URL: http://localhost:3000/admin/login
         ↓
   Admin Login Form
         ↓
POST /api/auth/admin/login
         ↓
Backend verify (username & password)
         ↓
Generate JWT Token
         ↓
Save token ke localStorage (adminToken)
         ↓
Redirect ke /admin (Dashboard)
```

---

## 📱 UI Admin Login

Admin login page memiliki UI terpisah dari user login dengan:
- 🔐 Icon khusus admin
- Purple gradient background
- Form untuk username & password (bukan email)
- Tombol "Kembali ke Homepage"

---

## 🛡️ Security Notes

1. **Admin URL tersembunyi** - Tidak ada link di homepage
2. **Admin credentials terpisah** - Tidak menggunakan user database
3. **JWT Token** - Admin token disimpan di `localStorage` dengan key `adminToken`
4. **Token expiry** - Token admin berlaku 7 hari
5. **Admin-only routes** - Route `/admin` hanya bisa diakses jika ada valid admin token

---

## 🚀 Testing Admin Dashboard

Setelah login berhasil, Anda akan masuk ke `/admin` dashboard dengan kemampuan:
- ✅ View semua events
- ✅ Create event baru
- ✅ Update event
- ✅ Delete event
- ✅ Logout

---

## 🔧 Backend Endpoints

### Admin Login Endpoint
```
POST /api/auth/admin/login
Content-Type: application/json

Body:
{
  "username": "admin",
  "password": "admin123"
}

Response (Success 200):
{
  "message": "Login admin berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (Error 401):
{
  "message": "Username atau password admin salah"
}
```

---

## ❓ Troubleshooting

### Admin login gagal (401 Unauthorized)
- ✅ Pastikan backend server berjalan di `http://localhost:5000`
- ✅ Cek credentials (username=`admin`, password=`admin123`)
- ✅ Pastikan tidak ada typo

### Tidak bisa redirect ke /admin setelah login
- ✅ Pastikan frontend dev server berjalan (`npm run dev`)
- ✅ Clear browser cache/cookies
- ✅ Check browser console untuk error

### Cannot connect to backend
- ✅ Pastikan backend server sudah running: `npm run dev` dari folder `backend`
- ✅ Cek port 5000 tidak terpakai
- ✅ Cek CORS configuration di backend

---

## 📝 File yang Berkaitan

- **Frontend Login:** `frontend/app/admin/login/page.tsx`
- **Frontend Dashboard:** `frontend/app/admin/page.tsx`
- **Backend Controller:** `backend/src/controllers/authController.js` (fungsi `adminLogin`)
- **Backend Routes:** `backend/src/routes/authRoutes.js`
- **API Client:** `frontend/lib/api.ts` (fungsi `adminAPI.login`)

---

## 🎯 Summary

**Admin panel adalah hidden dari public UI** - user biasa hanya melihat:
- ✍️ Daftar Sekarang
- 🔓 Masuk

Untuk akses admin:
1. Ketik langsung di browser: `http://localhost:3000/admin/login`
2. Atau akses via API: `POST http://localhost:5000/api/auth/admin/login`
3. Gunakan credentials: `admin` / `admin123`

