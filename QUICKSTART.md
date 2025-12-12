# 🚀 Quick Start Guide - Event Campus Admin System

## Ringkasan Fitur Baru

Kami telah menambahkan sistem **Admin Dashboard** lengkap untuk manage events. Sistem sekarang punya 2 role:

| Role | Akses | Login Method |
|------|-------|------------|
| 👨‍🎓 **User (Mahasiswa)** | Lihat events | Email + Password (register dulu) |
| 🔐 **Admin** | Manage events | Username + Password (modal popup) |

---

## ⚡ Setup Cepat (5 Menit)

### 1️⃣ Database Setup

Buka terminal dan jalankan PostgreSQL:

```bash
psql -U postgres
```

Copy-paste SQL di bawah ini:

```sql
-- Create database
CREATE DATABASE event_kampus;

-- Connect
\c event_kampus

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table (dengan field admin baru)
CREATE TABLE events (
  event_id SERIAL PRIMARY KEY,
  nama_event VARCHAR(255) NOT NULL,
  tanggal_event DATE NOT NULL,
  jam_mulai TIME NOT NULL,
  jam_selesai TIME NOT NULL,
  tempat VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  waktu_event TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_events_tanggal ON events(tanggal_event);
CREATE INDEX idx_events_nama ON events(nama_event);

-- Sample data (opsional)
INSERT INTO events (nama_event, tanggal_event, jam_mulai, jam_selesai, tempat, deskripsi) VALUES
('Tech Talk 2024', '2024-11-20', '14:00', '16:00', 'Aula Utama', 'Diskusi teknologi terkini'),
('Hackathon', '2024-12-01', '08:00', '20:00', 'Lab Komputer', 'Kompetisi programming 24 jam'),
('Workshop Web Dev', '2024-12-05', '10:00', '12:00', 'Ruang C.201', 'Belajar web development');
```

Tekan `\q` untuk exit PostgreSQL.

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Tunggu sampai terlihat: **✅ Server running on port 5000**

### 3️⃣ Frontend Setup (Terminal Baru)

```bash
cd frontend
npm install
npm run dev
```

Tunggu sampai terlihat: **ready - started server on http://localhost:3000**

---

## 🎯 Testing

### Buka browser di `http://localhost:3000`

Anda akan lihat homepage dengan 3 tombol. Coba masing-masing:

### Test 1: User Register & Login

```
1. Klik "Daftar Sekarang"
2. Isi form:
   - Nama: Budi Santoso
   - Email: budi@example.com
   - Password: password123
   - Konfirmasi: password123
3. Klik "Daftar"
4. Redirect ke login page
5. Isi: budi@example.com / password123
6. Klik "Masuk"
7. Lihat homepage dengan daftar events!
```

### Test 2: Admin Login & Manage Events

```
1. Klik tombol "Admin" di homepage
2. Modal login admin muncul
3. Isi:
   - Username: admin
   - Password: admin123
4. Klik "Login"
5. Masuk ke Admin Dashboard!

Sekarang coba:
- Klik "+ Tambah Event" → Isi form & simpan
- Lihat event di tabel
- Klik "Edit" → Ubah data → Simpan
- Klik "Hapus" → Confirm → Event terhapus
- Klik "Logout" → Kembali ke homepage
```

---

## 📁 File-File Yang Ditambahkan/Diubah

### Backend
```
✅ backend/src/models/adminModel.js              (NEW)
✅ backend/src/controllers/adminController.js    (NEW)
✅ backend/src/routes/adminRoutes.js             (NEW)
✅ backend/src/models/eventModel.js              (UPDATED - add CRUD)
✅ backend/src/controllers/authController.js     (UPDATED - use DB)
✅ backend/src/controllers/eventController.js    (UPDATED)
✅ backend/src/routes/eventRoutes.js             (UPDATED)
✅ backend/src/server.js                         (UPDATED - register admin routes)
✅ backend/migrations/001_add_event_details.sql  (NEW)
```

### Frontend
```
✅ frontend/components/AdminLoginModal.tsx       (NEW)
✅ frontend/components/AdminDashboard.tsx        (NEW)
✅ frontend/lib/api.ts                           (UPDATED - add adminAPI)
✅ frontend/app/page.tsx                         (UPDATED - homepage)
```

### Documentation
```
✅ ADMIN_SETUP.md                                (Comprehensive guide)
✅ QUICKSTART.md                                 (This file)
```

---

## 🔑 Default Credentials

### Admin Login
```
Username: admin
Password: admin123
```

Jika ingin ubah, edit file `backend/.env`:
```
ADMIN_USERNAME=newadmin
ADMIN_PASSWORD=newpassword
```

---

## 📊 API Endpoints

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/api/auth/register` | ❌ | User register |
| POST | `/api/auth/login` | ❌ | User login |
| GET | `/api/events` | ❌ | Get all events |
| GET | `/api/events/search?q=keyword` | ❌ | Search events |
| GET | `/api/events/paginated` | ❌ | Paginated events |
| POST | `/api/admin/login` | ❌ | Admin login |
| GET | `/api/admin/events` | ✅ | Get events (admin) |
| POST | `/api/admin/events` | ✅ | Create event |
| PUT | `/api/admin/events/:id` | ✅ | Update event |
| DELETE | `/api/admin/events/:id` | ✅ | Delete event |

**✅ = Memerlukan JWT token di header `Authorization: Bearer <token>`**

---

## 🐛 Common Issues & Solutions

### ❌ Error: "Request failed with status code 404"
**Solusi:**
- Pastikan backend running (`npm run dev` di folder backend)
- Check port 5000 tidak di-use aplikasi lain
- Restart backend

### ❌ Error: "Database connection error"
**Solusi:**
- Pastikan PostgreSQL running
- Verify `.env` credentials (user, password, host, port)
- Pastikan database `event_kampus` sudah dibuat

### ❌ "Admin login gagal"
**Solusi:**
- Default: `admin` / `admin123`
- Case-sensitive!
- Check `.env` ADMIN_USERNAME & ADMIN_PASSWORD

### ❌ "Network Error" di frontend
**Solusi:**
- Frontend & backend harus running di-device yang sama
- Atau update `NEXT_PUBLIC_API_URL` di frontend `.env`

---

## 🎨 Features Checklist

### User Features
- [x] Register dengan email & password
- [x] Login dengan email & password
- [x] Lihat daftar events
- [x] Search events
- [x] Lihat detail event

### Admin Features
- [x] Login tanpa register (modal)
- [x] Dashboard untuk manage events
- [x] **Create Event** dengan:
  - [x] Nama event
  - [x] Tanggal event
  - [x] Jam mulai & jam selesai
  - [x] Tempat/lokasi
  - [x] Deskripsi
- [x] **Edit Event** - ubah data yang ada
- [x] **Delete Event** - hapus event
- [x] View semua events di tabel
- [x] Logout

---

## 📝 Next Steps

Setelah berhasil test admin:

1. **Customize credentials:**
   - Edit `backend/.env` untuk admin username/password
   - Ganti yang lebih aman untuk production

2. **Tambah fitur user participation:**
   - Mahasiswa bisa daftar untuk events
   - Admin lihat siapa aja yang daftar

3. **Tambah kategori/tags:**
   - Event dengan kategori (Workshop, Seminar, dll)
   - Filter by kategori

4. **Improve UI:**
   - Tambah event image/thumbnail
   - Calendar view
   - Event ratings

5. **Deployment:**
   - Deploy backend ke cloud (Railway, Heroku, AWS, dll)
   - Deploy frontend ke Vercel atau Netlify
   - Setup production database

---

## ❓ Need Help?

Check files untuk reference:

1. **Backend API Logic:**
   - `backend/src/controllers/adminController.js` - Admin handler
   - `backend/src/models/eventModel.js` - Database queries

2. **Frontend Components:**
   - `frontend/components/AdminDashboard.tsx` - Admin panel UI
   - `frontend/components/AdminLoginModal.tsx` - Login modal
   - `frontend/lib/api.ts` - API calls

3. **Database:**
   - `ADMIN_SETUP.md` - Full documentation
   - `backend/migrations/001_add_event_details.sql` - Schema

---

## ✅ Anda Siap!

Sistem sudah lengkap dan siap digunakan! 

**Enjoy managing your events! 🎉**

```
╔════════════════════════════════════════╗
║  Event Campus - Admin System Ready! 🚀 ║
║                                        ║
║  👨‍🎓 User: http://localhost:3000        ║
║  🔐 Admin: Login via homepage modal     ║
║  ⚙️  Backend: http://localhost:5000     ║
╚════════════════════════════════════════╝
```
