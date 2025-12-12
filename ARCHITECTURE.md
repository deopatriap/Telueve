# 📊 System Architecture Diagram

## Overall System Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Event Campus System                              │
└─────────────────────────────────────────────────────────────────────────┘

                           FRONTEND (Next.js + React)
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  Homepage              User Pages                Admin Pages             │
│  ┌─────────────┐      ┌──────────────┐      ┌────────────────┐         │
│  │ 3 Buttons:  │      │ /register    │      │ Admin Modal    │         │
│  │ - Daftar    │──┬──→│ - Form       │      │ - Login form   │         │
│  │ - Masuk     │  │   │ - Validation │      │ - Username/pwd │         │
│  │ - Admin     │  │   │ - API call   │      │ - JWT token    │         │
│  └─────────────┘  │   └──────────────┘      └────────────────┘         │
│       ↑           │                                  ↓                   │
│       │           │   ┌──────────────┐      ┌────────────────┐         │
│       │           └──→│ /login       │      │ AdminDashboard │         │
│       │               │ - Form       │      │ - Events Table │         │
│       │               │ - Validation │      │ - Add/Edit/Del │         │
│       │               │ - API call   │      │ - Form         │         │
│       │               │ - localStorage│      │ - Logout btn   │         │
│       │               └──────────────┘      └────────────────┘         │
│       │                    ↓                         ↑                   │
│       │               ┌──────────────┐              │                   │
│       │               │ /events      │              │                   │
│       └───────────────│ - Events list│←─────────────┘                   │
│                       │ - Search     │                                   │
│                       │ - View detail│                                   │
│                       └──────────────┘                                   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
         │                                          │
         │ HTTP Requests (Axios)                   │ HTTP Requests (Axios)
         │ - JSON payload                          │ - JSON + JWT Token
         │ - localStorage tokens                   │ - Admin auth
         ↓                                          ↓

                    API Server (Express.js)
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  Auth Routes                Event Routes          Admin Routes           │
│  ┌────────────────┐       ┌────────────────┐   ┌──────────────────┐    │
│  │ POST /register │       │ GET /          │   │ POST /login      │    │
│  │ POST /login    │       │ GET /search    │   │ GET /events      │    │
│  └────────────────┘       │ GET /paginated │   │ POST /events     │    │
│        ↓                  └────────────────┘   │ PUT /events/:id  │    │
│  authController.js             ↓              │ DELETE /:id      │    │
│  - registerUser()         eventController.js  └──────────────────┘    │
│  - loginUser()            - getEvents()              ↓                 │
│  - bcrypt hash/compare    - searchEvents()     adminController.js      │
│  - JWT generation         - getPaginated()     - loginAdmin()          │
│                                                - addEvent()            │
│                                                - editEvent()           │
│                                                - removeEvent()         │
│                                                - verifyAdminToken()    │
│                                                                        │
└──────────────────────────────────────────────────────────────────────────┘
         │                                          │
         │ SQL Queries (pg client)                 │ SQL Queries (pg client)
         │ - Users table operations                │ - Events table operations
         │ - Password verification                 │ - CRUD operations
         ↓                                          ↓

                    Database (PostgreSQL)
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  users table              events table           indexes                │
│  ┌──────────────┐        ┌─────────────────┐   ┌──────────────────┐    │
│  │ id (PK)      │        │ event_id (PK)   │   │ idx_users_email  │    │
│  │ nama         │        │ nama_event      │   │ idx_events_tanggal
│  │ email (UQ)   │        │ tanggal_event   │   │ idx_events_nama  │    │
│  │ password     │        │ jam_mulai       │   │ idx_events_tempat│    │
│  │ created_at   │        │ jam_selesai     │   └──────────────────┘    │
│  └──────────────┘        │ tempat          │                           │
│                          │ deskripsi       │                           │
│                          │ created_at      │                           │
│                          │ updated_at      │                           │
│                          └─────────────────┘                           │
│                                                                        │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

### User Registration & Login
```
User → Frontend (Register Page)
        ↓
Form Input (nama, email, password)
        ↓
Validation (client-side)
        ↓
POST /api/auth/register
{
  nama: "Budi Santoso",
  email: "budi@example.com",
  password: "password123"
}
        ↓
Backend authController
├─ Check if email exists (DB query)
├─ Hash password with bcrypt
├─ Insert user to database
├─ Generate JWT token (7 days)
└─ Return { message, user, token }
        ↓
Frontend stores token in localStorage
        ↓
Redirect to login page
        ↓
User enters email & password
        ↓
POST /api/auth/login
{
  email: "budi@example.com",
  password: "password123"
}
        ↓
Backend authController
├─ Find user by email (DB query)
├─ Compare password with bcrypt
├─ Generate JWT token (7 days)
└─ Return { message, user, token }
        ↓
Frontend stores token in localStorage
        ↓
Redirect to events page
        ↓
User logged in ✓
```

### Admin Authentication & Authorization
```
Admin → Homepage
        ↓
Click "Admin" button
        ↓
AdminLoginModal appears
        ↓
Input username & password (admin / admin123)
        ↓
POST /api/admin/login
{
  username: "admin",
  password: "admin123"
}
        ↓
Backend adminController.loginAdmin()
├─ Verify credentials with adminModel.verifyAdmin()
├─ Generate JWT token (24 hours)
└─ Return { message, token, admin }
        ↓
Frontend stores token in localStorage as "adminToken"
        ↓
Show AdminDashboard component
        ↓
Admin can now:
├─ GET /api/admin/events (with JWT token)
├─ POST /api/admin/events (with JWT token)
├─ PUT /api/admin/events/:id (with JWT token)
└─ DELETE /api/admin/events/:id (with JWT token)
        ↓
All requests include: Authorization: Bearer <jwt_token>
        ↓
Backend verifyAdminToken() middleware checks:
├─ Token exists in header
├─ Token signature valid
└─ Token role = 'admin'
        ↓
If valid → proceed to handler
If invalid → return 401/403 error
```

---

## Admin CRUD Event Flow

### Create Event
```
Admin clicks "+ Tambah Event"
        ↓
Form appears with empty fields
        ↓
Admin fills form:
├─ Nama Event: "Tech Talk 2024"
├─ Tanggal Event: 2024-11-20
├─ Jam Mulai: 14:00
├─ Jam Selesai: 16:00
├─ Tempat: "Aula Utama"
└─ Deskripsi: "Diskusi teknologi..."
        ↓
Admin clicks "Simpan Event"
        ↓
Frontend validation
├─ All fields filled? ✓
├─ Time valid? ✓
└─ No special characters? ✓
        ↓
POST /api/admin/events
{
  nama_event: "Tech Talk 2024",
  tanggal_event: "2024-11-20",
  jam_mulai: "14:00",
  jam_selesai: "16:00",
  tempat: "Aula Utama",
  deskripsi: "Diskusi teknologi..."
}
+ Header: Authorization: Bearer <token>
        ↓
Backend adminController.addEvent()
├─ Validate all fields
├─ Call eventModel.createEvent()
├─ Insert to DB with created_at
└─ Return { message, event }
        ↓
Frontend shows success message
        ↓
Form resets
        ↓
Events list refreshes (GET /api/admin/events)
        ↓
New event appears in table ✓
```

### Edit Event
```
Admin sees event in table
        ↓
Clicks "Edit" button on event row
        ↓
Form appears pre-filled with current data
        ↓
Admin modifies fields (e.g., jam_mulai)
        ↓
Clicks "Simpan Event"
        ↓
Frontend validation
        ↓
PUT /api/admin/events/123
{
  nama_event: "Tech Talk 2024",
  tanggal_event: "2024-11-20",
  jam_mulai: "15:00",  ← CHANGED
  jam_selesai: "17:00",  ← CHANGED
  tempat: "Aula Utama",
  deskripsi: "..."
}
+ Header: Authorization: Bearer <token>
        ↓
Backend adminController.editEvent()
├─ Find event by ID (DB query)
├─ Validate event exists (404 if not)
├─ Call eventModel.updateEvent()
├─ Update DB with new data + updated_at
└─ Return { message, event }
        ↓
Frontend shows success message
        ↓
Events list refreshes
        ↓
Table shows updated data ✓
```

### Delete Event
```
Admin clicks "Hapus" button on event row
        ↓
Confirmation dialog: "Apakah Anda yakin?"
        ↓
Admin clicks "OK"
        ↓
DELETE /api/admin/events/123
(No body, only Authorization header)
        ↓
Backend adminController.removeEvent()
├─ Find event by ID (DB query)
├─ Validate event exists (404 if not)
├─ Call eventModel.deleteEvent()
├─ Delete from DB
└─ Return { message }
        ↓
Frontend shows success message
        ↓
Events list refreshes (GET /api/admin/events)
        ↓
Event removed from table ✓
```

---

## Data Flow Diagram (Event Creation Example)

```
┌────────────────────────────────────┐
│   AdminDashboard Component         │
│ • useState(events = [])            │
│ • useState(formData = {...})       │
│ • useState(loading = false)        │
└────────────────────────────────────┘
           │
           │ User input + form submit
           ↓
┌────────────────────────────────────┐
│  handleSubmit() function           │
│ • Validate form fields             │
│ • Call adminAPI.createEvent()      │
└────────────────────────────────────┘
           │
           │ API call
           ↓
┌────────────────────────────────────┐
│  frontend/lib/api.ts               │
│  adminAPI.createEvent()            │
│ • axios.post("/admin/events", {...})
│ • Include Authorization header     │
└────────────────────────────────────┘
           │
           │ HTTP POST (JSON)
           ↓
┌────────────────────────────────────┐
│  Backend Express Route             │
│  POST /api/admin/events            │
│ • CORS headers processed           │
│ • JSON body parsed                 │
│ • Route matches adminRoutes        │
└────────────────────────────────────┘
           │
           │ Route dispatch
           ↓
┌────────────────────────────────────┐
│  Backend Middleware                │
│ • verifyAdminToken()               │
│ • Extract & validate JWT           │
│ • Check role = 'admin'             │
└────────────────────────────────────┘
           │
           │ Token valid
           ↓
┌────────────────────────────────────┐
│  adminController.addEvent()        │
│ • Validate request body            │
│ • Check all fields present         │
│ • Call eventModel.createEvent()    │
└────────────────────────────────────┘
           │
           │ Model function
           ↓
┌────────────────────────────────────┐
│  eventModel.createEvent()          │
│ • Build INSERT SQL query           │
│ • Execute with pg client           │
│ • Set created_at = NOW()           │
│ • RETURNING * (get inserted row)   │
└────────────────────────────────────┘
           │
           │ SQL query
           ↓
┌────────────────────────────────────┐
│  PostgreSQL Database               │
│  events table                      │
│                                    │
│  INSERT INTO events (...)          │
│  VALUES (...)                      │
│  RETURNING *;                      │
│                                    │
│  → Returns new row with event_id   │
└────────────────────────────────────┘
           │
           │ Result back
           ↓
┌────────────────────────────────────┐
│  adminController.addEvent()        │
│ • Format response                  │
│ • Return 201 status               │
│ • JSON: { message, event }         │
└────────────────────────────────────┘
           │
           │ HTTP 201 (JSON)
           ↓
┌────────────────────────────────────┐
│  frontend/lib/api.ts               │
│  adminAPI.createEvent() response   │
│ • return response.data             │
└────────────────────────────────────┘
           │
           │ Response object
           ↓
┌────────────────────────────────────┐
│  AdminDashboard - handleSubmit()   │
│  catch block (success)             │
│ • setSuccess("Event dibuat!")      │
│ • Reset form                       │
│ • Fetch events again               │
│ • setFormData({...})               │
│ • setShowForm(false)               │
└────────────────────────────────────┘
           │
           │ Component rerender
           ↓
┌────────────────────────────────────┐
│  AdminDashboard Component          │
│ • Success message shown            │
│ • Form hidden                      │
│ • Events table refreshed           │
│ • New event appears in list ✓      │
└────────────────────────────────────┘
```

---

## State Management (Frontend)

### AdminDashboard State
```
const [events, setEvents]                    // Array of events from server
const [loading, setLoading]                  // Loading state for API calls
const [error, setError]                      // Error message from server/client
const [success, setSuccess]                  // Success message after action
const [showForm, setShowForm]                // Toggle form visibility
const [editingId, setEditingId]              // Which event being edited (or null)

const [formData, setFormData] = {            // Form input state
  nama_event: "",
  tanggal_event: "",
  jam_mulai: "",
  jam_selesai: "",
  tempat: "",
  deskripsi: ""
}
```

### State Transitions
```
INITIAL STATE
├─ events: []
├─ loading: false
├─ error: ""
├─ success: ""
├─ showForm: false
├─ editingId: null
└─ formData: {...empty}

USER CLICKS "+ Tambah Event"
└─ showForm: true
   ├─ Form visible
   └─ editingId: null (new event, not editing)

USER FILLS FORM & CLICKS "SIMPAN EVENT"
├─ loading: true (API in progress)
├─ Call adminAPI.createEvent()
└─ Wait for response...

API RETURNS SUCCESS (201)
├─ success: "Event berhasil ditambahkan!"
├─ loading: false
├─ showForm: false (hide form)
├─ formData: {...reset}
├─ Call fetchEvents() → GET /api/admin/events
└─ events: [...updated list with new event]

API RETURNS ERROR
├─ error: "Terjadi kesalahan..."
└─ loading: false
   (User can retry)
```

---

## Component Hierarchy

```
App (Next.js page.tsx)
│
├─ [IF adminToken] → AdminDashboard
│  │
│  ├─ Header (title + logout button)
│  ├─ Alerts (error/success messages)
│  ├─ [IF showForm] → EventForm
│  │  ├─ Input: nama_event
│  │  ├─ Input: tanggal_event
│  │  ├─ Input: jam_mulai
│  │  ├─ Input: jam_selesai
│  │  ├─ Input: tempat
│  │  ├─ Textarea: deskripsi
│  │  ├─ Button: Simpan
│  │  └─ Button: Batal
│  │
│  └─ EventsTable
│     ├─ Column: nama_event
│     ├─ Column: tanggal
│     ├─ Column: waktu
│     ├─ Column: tempat
│     └─ Column: aksi
│        ├─ Button: Edit
│        └─ Button: Hapus
│
├─ [IF !adminToken && !userToken] → HomePage
│  ├─ Title & Description
│  ├─ Buttons Container
│  │  ├─ Button: Daftar
│  │  ├─ Button: Masuk
│  │  └─ Button: Admin
│  │
│  ├─ AdminLoginModal
│  │  ├─ Input: username
│  │  ├─ Input: password
│  │  ├─ Button: Login
│  │  └─ Button: Cancel
│  │
│  └─ Info Section (user vs admin)
│
└─ [IF userToken] → Redirect to /events
```

---

## Database Relationships

```
┌─────────────────────────────┐
│        users                │
├─────────────────────────────┤
│ id (PK) serial              │ ← Primary key (auto-increment)
│ nama varchar(255)           │ ← Full name
│ email varchar(255) UNIQUE   │ ← Email (unique, for login)
│ password varchar(255)       │ ← Hashed password (bcrypt)
│ created_at timestamp        │ ← Account creation time
└─────────────────────────────┘
         │
         │ (Future: one user can register for many events)
         │
         ├─ Possible relationship via event_registrations table
         │
         └─→ events table (currently read-only for users)


┌──────────────────────────────────────┐
│          events                      │
├──────────────────────────────────────┤
│ event_id (PK) serial                 │ ← Primary key
│ nama_event varchar(255)              │ ← Event name
│ tanggal_event date                   │ ← Event date (YYYY-MM-DD)
│ jam_mulai time                       │ ← Start time (HH:MM)
│ jam_selesai time                     │ ← End time (HH:MM)
│ tempat varchar(255)                  │ ← Location
│ deskripsi text                       │ ← Description
│ waktu_event timestamp (legacy)       │ ← Full timestamp (backward compat)
│ created_at timestamp                 │ ← Creation time
│ updated_at timestamp                 │ ← Last update time
└──────────────────────────────────────┘
```

---

**Architecture Version:** 1.0
**Last Updated:** November 2024
**Status:** Complete & Ready for Testing
