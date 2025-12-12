# Use Cases & User Flows - Event Campus

## 🎯 Use Case Diagram

```
                         ┌──────────────┐
                         │   System     │
                         │ Event Campus │
                         └──────────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
            ┌───────▼───┐ ┌────▼─────┐ ┌─▼──────────┐
            │   Login   │ │ Register │ │  Browsing  │
            └─────┬─────┘ └────┬─────┘ │   Events   │
                  │            │       └─┬──────────┘
                  │            │         │
            ┌─────▼────────────▼──────────▼──────┐
            │         User / Mahasiswa            │
            └─────────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
            ┌───────▼─────┐   ┌──▼────────┐
            │   Search    │   │ Register  │
            │   Events    │   │   Event   │
            └─────────────┘   └───────────┘
```

---

## 📋 Use Case Descriptions

### UC-001: Register (Pendaftaran Akun Baru)

**Actor**: User/Mahasiswa

**Goal**: Membuat akun baru untuk akses aplikasi

**Preconditions**:
- User belum memiliki akun
- User memiliki email yang valid

**Flow**:

1. User membuka halaman Register
2. User memasukkan:
   - Nama lengkap
   - Email
   - Password (min. 6 karakter)
   - Konfirmasi password
3. User mencentang Terms & Conditions
4. User klik tombol "Daftar"
5. System validasi data:
   - Email tidak sudah terdaftar
   - Password cocok
   - Semua field terisi
6. System hash password dengan bcrypt
7. System simpan data user ke database
8. System tampilkan pesan sukses
9. System redirect ke login page (2 detik)

**Postconditions**:
- User account terbuat
- User dapat login dengan email & password

**Alternative Flows**:
- A1: Email sudah terdaftar
  - System tampilkan error: "Email sudah terdaftar"
  - User dapat input email lain
- A2: Password tidak cocok
  - System tampilkan error: "Password tidak cocok"
  - User input ulang password
- A3: Field tidak lengkap
  - System tampilkan field yang wajib diisi

---

### UC-002: Login (Masuk ke Akun)

**Actor**: User/Mahasiswa

**Goal**: Masuk ke akun untuk akses fitur aplikasi

**Preconditions**:
- User sudah register
- User tahu email & password

**Flow**:

1. User membuka halaman Login
2. User masukkan email & password
3. User klik tombol "Masuk"
4. System validasi:
   - Email ada di database
   - Password sesuai (bcrypt verify)
5. System generate JWT token
6. System simpan token di localStorage browser
7. System tampilkan pesan sukses
8. System redirect ke homepage events (1 detik)

**Postconditions**:
- User ter-autentikasi
- User dapat akses fitur-fitur aplikasi
- JWT token tersimpan di localStorage

**Alternative Flows**:
- A1: Email tidak terdaftar
  - System tampilkan error: "User tidak ditemukan"
- A2: Password salah
  - System tampilkan error: "Password salah"
- A3: Email/Password kosong
  - System tampilkan error: "Email & password harus diisi"

---

### UC-003: View All Events (Lihat Semua Event)

**Actor**: User/Mahasiswa (Authenticated)

**Goal**: Melihat daftar seluruh event kampus

**Preconditions**:
- User sudah login
- User memiliki valid JWT token

**Flow**:

1. User membuka halaman Events/Homepage
2. System fetch data events dari backend API
3. System tampilkan events dalam bentuk card grid
4. Untuk setiap event ditampilkan:
   - Nama event
   - Tanggal & waktu
   - Deskripsi (preview 3 baris)
   - Tombol "Lihat Detail" & "Daftar"
5. System pagination dengan 6 event per halaman
6. User dapat navigasi ke halaman lain dengan tombol Previous/Next

**Postconditions**:
- User melihat daftar events
- User dapat interaksi dengan setiap event

---

### UC-004: Search Events (Cari Event)

**Actor**: User/Mahasiswa (Authenticated)

**Goal**: Mencari event berdasarkan keyword

**Preconditions**:
- User sudah login
- User berada di halaman Events

**Flow**:

1. User ketik keyword di search bar (contoh: "tech")
2. System mengirim query ke backend API: `/events/search?q=tech`
3. Backend query database dengan ILIKE (case-insensitive):
   - Cari di field `nama_event`
   - Cari di field `deskripsi`
4. System tampilkan hasil search dalam grid
5. Pagination di-reset ke halaman 1
6. User dapat:
   - Clear search (klik X) → tampilkan semua events
   - Click pagination → navigate hasil search

**Postconditions**:
- User mendapat hasil pencarian yang relevan
- Halaman pagination di-reset

**Alternative Flows**:
- A1: Search keyword tidak cocok
  - System tampilkan pesan: "Tidak ada event yang sesuai"
- A2: Search field kosong
  - System tampilkan semua events

---

### UC-005: Pagination (Navigasi Halaman)

**Actor**: User/Mahasiswa

**Goal**: Navigasi data events dengan pagination

**Preconditions**:
- User berada di halaman Events
- Total events > 6

**Flow**:

1. User melihat pagination controls:
   - Tombol "← Sebelumnya"
   - Page numbers (1, 2, 3, ...)
   - Tombol "Selanjutnya →"
2. User klik page number atau tombol navigation
3. System calculate OFFSET: `(page - 1) * 6`
4. System fetch data dari database dengan LIMIT & OFFSET
5. System update tampilan dengan events halaman baru
6. User melihat informasi: "Menampilkan 1-6 dari 45 event"

**Postconditions**:
- User navigasi ke halaman yang dipilih
- Events yang ditampilkan sesuai halaman

---

### UC-006: Logout (Keluar Akun)

**Actor**: User/Mahasiswa

**Goal**: Keluar dari akun aplikasi

**Preconditions**:
- User sudah login

**Flow**:

1. User klik tombol "Logout" di navbar
2. System hapus JWT token dari localStorage
3. System redirect ke halaman login

**Postconditions**:
- User ter-logout
- Token dihapus
- User kembali di login page

---

## 🔄 User Flow Diagram

### Flow 1: New User Journey

```
Start
  │
  ├─→ Halaman Utama
  │     ├─→ Belum login?
  │     │   └─→ Redirect ke /login
  │     │
  │     └─→ Sudah login?
  │         └─→ Proceed ke /events
  │
  ├─→ Register Page
  │     ├─→ Input nama, email, password
  │     ├─→ Validasi form
  │     ├─→ Hash password (bcrypt)
  │     ├─→ Simpan ke database
  │     ├─→ Tampilkan sukses
  │     └─→ Redirect ke Login (2 detik)
  │
  ├─→ Login Page
  │     ├─→ Input email & password
  │     ├─→ Verify password
  │     ├─→ Generate JWT token
  │     ├─→ Simpan token ke localStorage
  │     ├─→ Tampilkan sukses
  │     └─→ Redirect ke /events (1 detik)
  │
  └─→ Events Homepage
        ├─→ Fetch events dari API
        ├─→ Tampilkan events (paginated)
        ├─→ User bisa search, navigate, logout
        └─→ End
```

### Flow 2: Existing User Journey

```
Start
  │
  ├─→ Halaman Utama
  │     └─→ Sudah login (token di localStorage)
  │         └─→ Redirect ke /events
  │
  ├─→ Events Homepage
  │     ├─→ Fetch events
  │     ├─→ Display dengan pagination
  │     ├─→ User input search keyword
  │     │   ├─→ API call: /events/search?q={keyword}
  │     │   └─→ Display search results (paginated)
  │     │
  │     └─→ User klik logout
  │         ├─→ Hapus token dari localStorage
  │         └─→ Redirect ke /login
  │
  └─→ End
```

### Flow 3: Search & Pagination Flow

```
Events Page
  │
  ├─→ Tampilkan events (halaman 1)
  │
  ├─→ User search: "tech"
  │     ├─→ API: GET /api/events/search?q=tech
  │     ├─→ Backend query database
  │     ├─→ Return matching events
  │     ├─→ Display results (reset ke halaman 1)
  │     └─→ Tampilkan "Menampilkan 1-6 dari X event"
  │
  ├─→ User klik page 2
  │     ├─→ API: GET /api/events/search?q=tech&page=2
  │     └─→ Display events halaman 2
  │
  ├─→ User clear search (X button)
  │     ├─→ Tampilkan semua events
  │     └─→ Reset ke halaman 1
  │
  └─→ Continue navigating...
```

---

## 📊 State Diagram

```
                    ┌─────────────┐
                    │ Not Logged  │
                    │     In      │
                    └──────┬──────┘
                           │
                   ┌───────┼───────┐
                   │               │
            Register         Login
                   │               │
            Validation       Validation
                   │               │
                Success       Success
                   │               │
                   └───────┬───────┘
                           │
                    ┌──────▼──────┐
                    │   Logged    │
                    │     In      │
                    └──────┬──────┘
                           │
                ┌──────────┼──────────┐
                │          │          │
            Browse     Search   Pagination
            Events     Events   Navigation
                │          │          │
                └──────────┼──────────┘
                           │
                    ┌──────▼──────┐
                    │   Logout    │
                    │  (Clear     │
                    │   Token)    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Not Logged  │
                    │     In      │
                    └─────────────┘
```

---

## 🔐 Authentication State Machine

```
States:
├── UNAUTHENTICATED
├── AUTHENTICATING
├── AUTHENTICATED
└── SESSION_EXPIRED

Transitions:
├── UNAUTHENTICATED
│   └──Login Request──→ AUTHENTICATING
│                         ├──Success──→ AUTHENTICATED (token stored)
│                         └──Failure──→ UNAUTHENTICATED (error shown)
│
├── AUTHENTICATED
│   ├──Logout Request──→ UNAUTHENTICATED (token removed)
│   └──Token Expired──→ SESSION_EXPIRED (re-login required)
│
└── SESSION_EXPIRED
    └──Login Request──→ AUTHENTICATING
```

---

## 📈 Data Flow Diagram (Level 1)

```
┌─────────────────┐
│   Browser       │
│  (Frontend)     │
└────────┬────────┘
         │ HTTP/REST
         │ Axios
         │
┌────────▼────────────────────┐
│   Express Server            │
│ (Backend API)               │
├─────────────────────────────┤
│ • Routes                    │
│ • Controllers               │
│ • Middleware (Auth, CORS)   │
└────────┬────────────────────┘
         │ SQL Queries
         │ Node.js PG Driver
         │
┌────────▼────────────────────┐
│   PostgreSQL Database       │
│ • users table               │
│ • events table              │
└─────────────────────────────┘

Token Flow:
1. Login → Generate JWT Token
2. Store token in localStorage
3. Send token in Authorization header
4. Backend verify token
5. Return protected resources
```

---

## 🎯 Success Criteria

### Untuk Login/Register
- ✅ User dapat register dengan email baru
- ✅ User tidak dapat register dengan email duplikat
- ✅ Password di-hash dengan bcrypt
- ✅ User dapat login dengan email & password correct
- ✅ JWT token generated dan stored
- ✅ User redirect ke events setelah login

### Untuk Events Homepage
- ✅ Events di-display dalam card grid
- ✅ Pagination bekerja dengan baik
- ✅ Search real-time
- ✅ Responsive di semua ukuran screen
- ✅ Dark mode support
- ✅ Logout berfungsi

### Untuk Performance
- ✅ Page load < 2 detik
- ✅ Search response < 500ms
- ✅ Pagination smooth tanpa flicker
- ✅ No console errors

---

## 🧪 Testing Scenarios

### Scenario 1: New User Onboarding
1. Open app → Redirect to login
2. Click "Daftar sekarang" → Go to register
3. Fill form: nama, email, password
4. Click "Daftar" → Success, redirect to login
5. Fill login form → Click "Masuk" → Go to events
6. See events list with pagination ✅

### Scenario 2: Search & Navigate
1. Open events page
2. Type "workshop" in search → See matching events
3. Clear search → See all events
4. Click page 2 → Navigate to next page
5. Click specific page number → Jump to page
6. Click "Sebelumnya" → Go to previous page ✅

### Scenario 3: Session Management
1. Login → Token stored
2. Refresh page → Still logged in (token restored)
3. Click logout → Token cleared, redirect to login
4. Go to /events → Redirect to login (no token) ✅

### Scenario 4: Error Handling
1. Register dengan email duplikat → Error shown
2. Login dengan password salah → Error shown
3. Login dengan email tidak ada → Error shown
4. Network error → Graceful error handling
5. API down → User-friendly message ✅

---

## 📱 Responsive Design Breakpoints

```
Mobile (< 640px):
├── Single column layout
├── Full width cards
├── Stack pagination vertically
└── Touch-friendly buttons

Tablet (640px - 1024px):
├── 2 column grid
├── Medium cards
└── Horizontal pagination

Desktop (> 1024px):
├── 3 column grid
├── Full card details
└── Horizontal pagination with all page numbers
```

---

Dokumentasi Use Cases ini membantu untuk presentasi dan memastikan semua requirement sudah tercakup dalam implementasi.
