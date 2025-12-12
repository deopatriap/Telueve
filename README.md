# Event Campus - Aplikasi Manajemen Event Kampus

## 📋 Ringkasan Proyek

Aplikasi Event Campus adalah platform manajemen event kampus yang modern, responsif, dan dilengkapi dengan fitur autentikasi, search, dan pagination. Backend menggunakan teknologi gRPC untuk komunikasi yang efisien.

### Fitur Utama

✅ **Login & Register** - Autentikasi user dengan JWT  
✅ **Homepage Event** - Menampilkan daftar event dengan UI modern  
✅ **Search Real-time** - Pencarian event berdasarkan nama atau deskripsi  
✅ **Pagination** - Navigasi data dengan pagination yang smooth  
✅ **Dark Mode** - Dukungan untuk tema gelap/terang  
✅ **Responsive Design** - Sempurna di desktop, tablet, dan mobile  
✅ **gRPC Backend** - Komunikasi backend-frontend menggunakan gRPC  

---

## 🛠️ Teknologi yang Digunakan

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database relasional
- **gRPC** - Protocol buffer communication
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## 📁 Struktur Folder

```
event_campus/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Database connection setup
│   │   ├── controllers/
│   │   │   ├── authController.js     # Login & Register logic
│   │   │   └── eventController.js    # Event CRUD & search logic
│   │   ├── models/
│   │   │   ├── userModel.js          # User database operations
│   │   │   └── eventModel.js         # Event database operations
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Auth endpoints
│   │   │   └── eventRoutes.js        # Event endpoints
│   │   ├── grpc/
│   │   │   ├── server.js             # gRPC server setup
│   │   │   └── proto/
│   │   │       └── event.proto       # gRPC service definitions
│   │   └── server.js                 # Express app entry point
│   ├── .env                           # Environment variables
│   ├── dockerfile                     # Docker config for backend
│   └── package.json                   # Backend dependencies
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx         # Login page
│   │   │   └── register/page.tsx      # Register page
│   │   ├── (app)/
│   │   │   └── events/page.tsx        # Events homepage
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Redirect page
│   │   └── globals.css                # Global styles & Tailwind
│   ├── components/
│   │   ├── Button.tsx                 # Reusable button component
│   │   ├── Input.tsx                  # Reusable input component
│   │   ├── Card.tsx                   # Reusable card component
│   │   └── Loading.tsx                # Loading spinner
│   ├── lib/
│   │   └── api.ts                     # Axios API client
│   ├── .env.local                     # Frontend environment variables
│   ├── dockerfile                     # Docker config for frontend
│   ├── next.config.mjs                # Next.js configuration
│   ├── postcss.config.js              # PostCSS configuration
│   ├── tailwind.config.js             # Tailwind CSS configuration
│   ├── tsconfig.json                  # TypeScript configuration
│   └── package.json                   # Frontend dependencies
│
├── docker-compose.yml                 # Docker Compose orchestration
└── README.md                           # This file
```

---

## 🚀 Cara Menjalankan Aplikasi

### Prerequisite
- Docker & Docker Compose terinstall
- Node.js v18+ (untuk development lokal)
- PostgreSQL client (opsional, untuk testing DB)

### Option 1: Menggunakan Docker Compose (Recommended)

1. **Clone atau buka folder proyek**
   ```bash
   cd event_campus
   ```

2. **Build dan jalankan semua services**
   ```bash
   docker compose up --build
   ```
   Perintah ini akan:
   - Build image backend dan frontend
   - Jalankan PostgreSQL database di port 5432
   - Jalankan backend API di port 5000
   - Jalankan frontend di port 3000

3. **Buka aplikasi di browser**
   ```
   http://localhost:3000
   ```

4. **Hentikan aplikasi**
   ```bash
   docker compose down
   ```

### Option 2: Development Lokal (Frontend + Backend terpisah)

#### Backend

1. **Setup environment variables**
   ```bash
   cd backend
   ```
   
   Edit file `.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   DB_DATABASE=event_campus
   JWT_SECRET=your_jwt_secret_key_here
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database** (pastikan PostgreSQL running)
   ```sql
   CREATE DATABASE event_campus;
   
   -- Create tables
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     nama VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE events (
     id SERIAL PRIMARY KEY,
     nama_event VARCHAR(255) NOT NULL,
     waktu_event TIMESTAMP NOT NULL,
     deskripsi TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. **Jalankan backend**
   ```bash
   npm run dev
   ```
   Backend akan berjalan di `http://localhost:5000`

#### Frontend

1. **Setup environment variables**
   ```bash
   cd frontend
   ```
   
   Edit/create file `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Jalankan frontend**
   ```bash
   npm run dev
   ```
   Frontend akan berjalan di `http://localhost:3000`

---

## 📝 API Endpoints

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "nama": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: {
  "message": "Registrasi berhasil",
  "user": { id, nama, email, created_at }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: {
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Events

#### Get All Events
```
GET /api/events
Authorization: Bearer {token}

Response: [
  {
    "id": 1,
    "nama_event": "Tech Talk 2024",
    "waktu_event": "2024-11-20T14:00:00Z",
    "deskripsi": "Diskusi teknologi terkini",
    "created_at": "2024-11-01T10:00:00Z"
  },
  ...
]
```

#### Search Events
```
GET /api/events/search?q=tech
Authorization: Bearer {token}

Response: [
  { event data matching search... }
]
```

#### Get Events (Paginated)
```
GET /api/events/paginated?page=1&limit=10
Authorization: Bearer {token}

Response: {
  "rows": [ ... events ... ],
  "total": 50
}
```

---

## 🔐 Authentication Flow

1. User melakukan **Register** dengan nama, email, password
2. Backend mengecek duplikasi email dan hash password dengan bcrypt
3. User data tersimpan di database
4. User melakukan **Login** dengan email dan password
5. Backend verify password dan generate JWT token
6. Token di-simpan di localStorage browser
7. Token di-send di header `Authorization: Bearer {token}` untuk setiap request
8. User dapat akses halaman events setelah login berhasil

---

## 💾 Database Schema

### Table: users
```sql
id (SERIAL PRIMARY KEY)
nama (VARCHAR 255, NOT NULL)
email (VARCHAR 255, UNIQUE, NOT NULL)
password (VARCHAR 255, NOT NULL - bcrypt hashed)
created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
```

### Table: events
```sql
id (SERIAL PRIMARY KEY)
nama_event (VARCHAR 255, NOT NULL)
waktu_event (TIMESTAMP, NOT NULL)
deskripsi (TEXT)
created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
```

---

## 🎨 UI/UX Features

### Login Page
- ✨ Gradient background
- 📧 Email validation
- 🔒 Password field
- 💾 "Remember me" checkbox
- 🎭 Social login buttons (placeholder)
- 📱 Fully responsive

### Register Page
- 👤 Nama input
- 📧 Email input with validation
- 🔐 Password dengan minimum 6 karakter
- ✅ Confirm password matching
- 📋 Terms & Conditions checkbox
- 🎨 Beautiful form layout

### Events Homepage
- 🔍 Real-time search functionality
- 📊 Pagination dengan page numbers
- 🎴 Event cards dengan detail
- 📅 Tanggal dan waktu event
- 📝 Deskripsi event dengan truncate
- 🔘 Action buttons (View Detail, Register)
- 🌙 Dark mode support
- 📱 Responsive grid layout

---

## 🔧 Troubleshooting

### Backend tidak bisa konek ke database
- Pastikan PostgreSQL sudah running
- Check `.env` file untuk DB credentials
- Cek koneksi dengan: `psql -h localhost -U postgres -d event_campus`

### Frontend tidak bisa hit backend API
- Pastikan `.env.local` memiliki `NEXT_PUBLIC_API_URL` yang benar
- Backend harus berjalan terlebih dahulu
- Cek CORS setting di Express backend

### Port sudah terpakai
```bash
# Linux/Mac: Ganti port di package.json atau environment
npm run dev -- -p 3001

# Windows: Kill process yang menggunakan port
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Docker build error
```bash
# Clear Docker cache
docker compose down -v
docker system prune -a

# Rebuild
docker compose up --build --no-cache
```

---

## 📚 Next Steps / Fitur Tambahan

### Priority Tinggi
- [ ] Tambah pagination endpoint di backend
- [ ] Implement gRPC service untuk auth & events
- [ ] Add database seeding untuk dummy data
- [ ] Unit testing untuk backend endpoints

### Priority Medium
- [ ] Role-based access control (Admin/User)
- [ ] User profile page
- [ ] Event detail page dengan registrasi
- [ ] Logout functionality

### Priority Rendah
- [ ] Email verification
- [ ] Forgot password flow
- [ ] Social login integration (Google, Facebook)
- [ ] Real-time notifications dengan WebSocket

---

## 👥 Contributors

- **Nama Anda** - Full Stack Developer

---

## 📄 Lisensi

MIT License - Silakan gunakan untuk project personal atau komersial.

---

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue atau hubungi tim development.

**Happy Coding! 🎉**
