# 🎓 Event Campus - Admin & User System

## Fitur Baru ✨

### System baru terdiri dari 2 role:

#### 👨‍🎓 **User (Mahasiswa)**
- ✅ Register dengan email & password
- ✅ Login ke akun
- ✅ Lihat daftar semua events
- ✅ Search & filter events
- ✅ Lihat detail event (nama, waktu, tempat, deskripsi)

#### 🔐 **Admin**
- ✅ Login tanpa perlu register (via modal popup)
- ✅ Dashboard untuk manage events
- ✅ **Create Event** - Tambah event baru dengan detail lengkap:
  - Nama Event
  - Tanggal Event
  - Jam Mulai & Jam Selesai
  - Tempat/Lokasi
  - Deskripsi
- ✅ **Edit Event** - Ubah detail event yang sudah ada
- ✅ **Delete Event** - Hapus event
- ✅ Logout

---

## 🚀 Setup & Menjalankan Project

### Prerequisites
- Node.js v16+ 
- PostgreSQL 12+
- npm atau yarn

### 1. Setup Database

#### Buka PostgreSQL CLI:
```bash
psql -U postgres
```

#### Jalankan commands berikut:
```sql
-- Create database
CREATE DATABASE event_kampus;

-- Connect ke database
\c event_kampus

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create events table dengan kolom baru untuk admin
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

-- Create indexes untuk performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_events_tanggal ON events(tanggal_event);
CREATE INDEX idx_events_nama ON events(nama_event);
```

#### Insert sample events (opsional):
```sql
INSERT INTO events (nama_event, tanggal_event, jam_mulai, jam_selesai, tempat, deskripsi) VALUES
(
  'Tech Talk 2024',
  '2024-11-20',
  '14:00',
  '16:00',
  'Aula Utama Kampus',
  'Diskusi teknologi terkini bersama expert industri. Topik: AI, Machine Learning, Cloud Computing.'
),
(
  'Hackathon Spring 2024',
  '2024-12-01',
  '08:00',
  '20:00',
  'Lab Komputer Blok A',
  'Kompetisi programming 24 jam dengan hadiah total 50 juta rupiah. Terbuka untuk semua mahasiswa.'
),
(
  'Workshop Web Development',
  '2024-12-05',
  '10:00',
  '12:00',
  'Ruang Kelas C.201',
  'Belajar web development dari basic sampai advanced. Stack: HTML, CSS, JavaScript, React, Node.js'
);
```

### 2. Setup Backend

```bash
# Navigate ke folder backend
cd backend

# Install dependencies
npm install

# Pastikan .env file sudah ada dengan konfigurasi:
# PORT=5000
# DB_USER=postgres
# DB_PASSWORD=123123
# DB_HOST=localhost
# DB_PORT=5432
# DB_DATABASE=event_kampus
# JWT_SECRET=supersecretkey
# ADMIN_USERNAME=admin
# ADMIN_PASSWORD=admin123

# Jalankan server (development mode dengan auto-reload)
npm run dev

# Atau untuk production:
npm start
```

Server akan berjalan di `http://localhost:5000`

### 3. Setup Frontend

```bash
# Navigate ke folder frontend
cd frontend

# Install dependencies
npm install

# Pastikan file `.env.local` atau env configuration sudah mengset:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Jalankan frontend (development mode)
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

---

## 📱 Cara Menggunakan

### 🏠 Homepage
1. Buka `http://localhost:3000`
2. Anda akan melihat 3 tombol:
   - **Daftar Sekarang** → Register akun baru (untuk mahasiswa)
   - **Masuk** → Login dengan akun yang sudah ada
   - **Admin** → Login sebagai admin

### 👥 User Flow (Mahasiswa)
1. Klik **Daftar Sekarang**
2. Isi form dengan nama, email, password
3. Klik **Daftar**
4. Redirect ke halaman login
5. Login dengan email & password
6. Masuk ke homepage & lihat daftar events
7. Bisa search & filter events

### 🔐 Admin Flow
1. Klik **Admin** di homepage
2. Modal login admin muncul
3. Input:
   - **Username:** `admin`
   - **Password:** `admin123`
4. Klik **Login**
5. Masuk ke **Admin Dashboard**

### 📊 Admin Dashboard - Features

#### 📝 Tambah Event
1. Klik tombol **+ Tambah Event**
2. Form akan muncul, isi semua field:
   - Nama Event
   - Tanggal Event (date picker)
   - Jam Mulai (time picker)
   - Jam Selesai (time picker)
   - Tempat/Lokasi
   - Deskripsi
3. Klik **Simpan Event**
4. Event akan langsung muncul di tabel

#### ✏️ Edit Event
1. Cari event di tabel
2. Klik tombol **Edit** di baris event
3. Form akan terisi dengan data lama
4. Ubah data yang diperlukan
5. Klik **Simpan Event**

#### 🗑️ Hapus Event
1. Cari event di tabel
2. Klik tombol **Hapus** di baris event
3. Confirm dialog akan muncul
4. Klik **OK** untuk confirm
5. Event akan dihapus dari database

#### 📋 Lihat Semua Events
- Tabel menampilkan semua events dengan kolom:
  - Nama Event
  - Tanggal (format Indonesia: DD/MM/YYYY)
  - Waktu (Jam Mulai - Jam Selesai)
  - Tempat
  - Aksi (Edit/Hapus)

#### 🔐 Logout
- Klik tombol **Logout** di kanan atas
- Session admin akan berakhir
- Redirect ke homepage

---

## 🔄 API Endpoints

### Auth (User)
```
POST /api/auth/register
  Body: { nama, email, password }
  Response: { message, token }

POST /api/auth/login
  Body: { email, password }
  Response: { message, token }
```

### Events (Public Read)
```
GET /api/events
  Response: [{ event_id, nama_event, tanggal_event, jam_mulai, jam_selesai, tempat, deskripsi, ... }]

GET /api/events/search?q=keyword
  Response: [{ ... }]

GET /api/events/paginated?page=1&limit=10
  Response: { rows, total }
```

### Admin Auth
```
POST /api/admin/login
  Body: { username, password }
  Response: { message, token, admin: { username, role } }
```

### Admin Events (Protected - Requires Token)
```
GET /api/admin/events
  Headers: Authorization: Bearer <token>
  Response: [{ ... }]

POST /api/admin/events
  Headers: Authorization: Bearer <token>
  Body: { nama_event, tanggal_event, jam_mulai, jam_selesai, tempat, deskripsi }
  Response: { message, event: { event_id, ... } }

PUT /api/admin/events/:event_id
  Headers: Authorization: Bearer <token>
  Body: { nama_event, tanggal_event, jam_mulai, jam_selesai, tempat, deskripsi }
  Response: { message, event: { ... } }

DELETE /api/admin/events/:event_id
  Headers: Authorization: Bearer <token>
  Response: { message }
```

---

## 🗂️ Project Structure

```
event_campus/
├── backend/
│   ├── src/
│   │   ├── server.js                    # Main server file
│   │   ├── config/
│   │   │   └── db.js                    # Database connection
│   │   ├── models/
│   │   │   ├── userModel.js             # User queries
│   │   │   ├── eventModel.js            # Event queries (+ CRUD)
│   │   │   └── adminModel.js            # Admin verification
│   │   ├── controllers/
│   │   │   ├── authController.js        # User auth
│   │   │   ├── eventController.js       # Event display
│   │   │   └── adminController.js       # Admin CRUD + token verify
│   │   └── routes/
│   │       ├── authRoutes.js            # User auth routes
│   │       ├── eventRoutes.js           # Event display routes
│   │       └── adminRoutes.js           # Admin routes (NEW)
│   ├── migrations/
│   │   └── 001_add_event_details.sql    # Database migration
│   ├── package.json
│   ├── .env                             # Environment variables
│   └── dockerfile
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx                     # Homepage (NEW - updated)
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   └── (app)/
│   │       └── events/
│   │           └── page.tsx
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── AdminLoginModal.tsx           # Admin login modal (NEW)
│   │   └── AdminDashboard.tsx            # Admin dashboard (NEW)
│   ├── lib/
│   │   └── api.ts                       # API helper (updated + adminAPI)
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.local
```

---

## 🔒 Authentication

### User Auth
- Password di-hash menggunakan **bcrypt** (salt rounds = 10)
- Token menggunakan **JWT** dengan expired 7 hari
- Token disimpan di `localStorage` sebagai `token`

### Admin Auth
- Credentials: hardcoded (untuk MVP) atau dari `.env`
  - Default: `admin` / `admin123`
- Token menggunakan **JWT** dengan expired 24 jam
- Token disimpan di `localStorage` sebagai `adminToken`
- Setiap request admin dilindungi dengan middleware `verifyAdminToken`

---

## 📦 Dependencies

### Backend
- **express** - Web framework
- **cors** - Cross-origin requests
- **pg** - PostgreSQL driver
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT token
- **dotenv** - Environment variables
- **nodemon** - Auto-reload (dev)

### Frontend
- **next** - React framework
- **typescript** - Type safety
- **axios** - HTTP client
- **tailwindcss** - Styling

---

## ⚠️ Important Notes

### Admin Credentials
Edit di file `.env`:
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

**⚠️ Untuk production**, ubah password ke yang lebih kuat!

### Database Connection
Pastikan PostgreSQL server running di `localhost:5432`
Jika berbeda, update `.env` di backend

### CORS Settings
Frontend & backend harus satu domain/port yang sama
Atau configure CORS di `backend/src/server.js`

### JWT Secret
Gunakan value yang strong untuk `JWT_SECRET` di `.env`

---

## 🐛 Troubleshooting

### Error: "Request failed with status code 404"
- Pastikan backend server running (`npm run dev`)
- Pastikan `.env` config benar (port, database name)
- Check CORS settings

### Error: "Database connection error"
- Pastikan PostgreSQL running
- Verify `.env` credentials
- Pastikan database `event_kampus` sudah dibuat

### Error: "Token expired"
- Login ulang
- Token user expired setelah 7 hari
- Token admin expired setelah 24 jam

### Admin login gagal
- Verify username & password
- Default: `admin` / `admin123`
- Check `.env` ADMIN_USERNAME & ADMIN_PASSWORD

---

## 📝 Next Steps / Future Features

Fitur yang bisa ditambahkan:
- [ ] Fitur registrasi mahasiswa untuk events
- [ ] Notification system
- [ ] Email confirmation
- [ ] Dashboard analytics
- [ ] Participant list per event
- [ ] Admin user management
- [ ] Role-based access control
- [ ] Event categories/tags
- [ ] Calendar view
- [ ] PDF export untuk event info

---

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

---

## 👨‍💻 Author Notes

Sistem ini didesain dengan MVP (Minimum Viable Product) approach. Fokus pada:
1. ✅ User registration & login
2. ✅ Admin event management
3. ✅ JWT authentication
4. ✅ Database schema

Untuk production, tambahkan:
- [ ] Input validation yang lebih strict
- [ ] Rate limiting
- [ ] Error logging
- [ ] Request tracing
- [ ] Unit & integration tests
- [ ] API documentation (Swagger/OpenAPI)

---

## ❓ Questions?

Untuk debug atau error, check:
1. Terminal backend untuk logs
2. Browser DevTools Console
3. Browser Network tab untuk API responses
4. Database langsung menggunakan pgAdmin atau CLI

Good luck! 🚀
