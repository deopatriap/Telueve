# API Documentation - Event Campus

## Base URL

```
http://localhost:5000/api
```

## Authentication

Gunakan JWT token yang diterima dari endpoint `/auth/login`:

```
Authorization: Bearer {token}
```

Token di-store di browser localStorage dan otomatis di-send di setiap request melalui axios interceptor.

---

## Endpoints

### 1. Authentication Endpoints

#### 1.1 Register User
**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "nama": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Registrasi berhasil",
  "user": {
    "id": 1,
    "nama": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-11-20T10:30:45.123Z"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Email sudah terdaftar"
}
```

**Validasi:**
- Email harus unique
- Password minimal 6 karakter
- Semua field harus diisi

**Password Hashing:** Menggunakan bcrypt dengan salt rounds = 10

---

#### 1.2 Login User
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400):**
```json
{
  "message": "Password salah"
}
```

**Error Response (404):**
```json
{
  "message": "User tidak ditemukan"
}
```

**Token Details:**
- Algorithm: HS256
- Expires in: 1 hour
- Payload: `{ id, email }`

---

### 2. Event Endpoints

#### 2.1 Get All Events
**Endpoint:** `GET /events`

**Authentication:** Required (Bearer token)

**Query Parameters:** None

**Success Response (200):**
```json
[
  {
    "id": 1,
    "nama_event": "Tech Talk 2024",
    "waktu_event": "2024-11-20T14:00:00.000Z",
    "deskripsi": "Diskusi teknologi terkini dengan para expert",
    "created_at": "2024-11-01T10:00:00.000Z"
  },
  {
    "id": 2,
    "nama_event": "Hackathon Spring 2024",
    "waktu_event": "2024-12-01T08:00:00.000Z",
    "deskripsi": "Kompetisi programming 24 jam",
    "created_at": "2024-11-01T10:00:00.000Z"
  }
]
```

**Note:**
- Data di-order by `waktu_event` ASC (ascending)
- Jika tidak ada event, return empty array `[]`

---

#### 2.2 Search Events
**Endpoint:** `GET /events/search`

**Authentication:** Required (Bearer token)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search keyword (minimal 1 karakter) |

**Example Request:**
```
GET /events/search?q=tech
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "nama_event": "Tech Talk 2024",
    "waktu_event": "2024-11-20T14:00:00.000Z",
    "deskripsi": "Diskusi teknologi terkini dengan para expert",
    "created_at": "2024-11-01T10:00:00.000Z"
  }
]
```

**Search Behavior:**
- Case-insensitive (ILIKE di PostgreSQL)
- Search di field: `nama_event` dan `deskripsi`
- Jika tidak ada match, return empty array

---

#### 2.3 Get Events with Pagination
**Endpoint:** `GET /events/paginated`

**Authentication:** Required (Bearer token)

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number (1-indexed) |
| limit | number | No | 10 | Items per page |

**Example Request:**
```
GET /events/paginated?page=1&limit=10
```

**Success Response (200):**
```json
{
  "rows": [
    {
      "id": 1,
      "nama_event": "Tech Talk 2024",
      "waktu_event": "2024-11-20T14:00:00.000Z",
      "deskripsi": "Diskusi teknologi terkini",
      "created_at": "2024-11-01T10:00:00.000Z"
    },
    ...
  ],
  "total": 45
}
```

**Pagination Calculation:**
```
OFFSET = (page - 1) * limit
```

---

### 3. Error Handling

Semua error response mengikuti format:

```json
{
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200 OK` - Request berhasil
- `400 Bad Request` - Validation error atau request invalid
- `404 Not Found` - Resource tidak ditemukan
- `401 Unauthorized` - Token invalid atau expired
- `500 Internal Server Error` - Server error

---

## Data Types

### User Object
```json
{
  "id": "number",
  "nama": "string",
  "email": "string (email format)",
  "password": "string (bcrypt hashed)",
  "created_at": "ISO 8601 timestamp"
}
```

### Event Object
```json
{
  "id": "number",
  "nama_event": "string",
  "waktu_event": "ISO 8601 timestamp",
  "deskripsi": "string (optional)",
  "created_at": "ISO 8601 timestamp"
}
```

### JWT Token Payload
```json
{
  "id": "number",
  "email": "string",
  "iat": "number (issued at)",
  "exp": "number (expiration)"
}
```

---

## Rate Limiting

Saat ini belum ada rate limiting yang diterapkan. Untuk production, pertimbangkan:
- Express rate limit middleware
- Max 100 requests per 15 minutes per IP

---

## CORS Policy

Backend sudah mengaktifkan CORS untuk frontend:

```javascript
app.use(cors());
```

Untuk production, restrict ke specific origin:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## Testing dengan cURL/Postman

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Events (with token)
```bash
curl -X GET http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Search Events
```bash
curl -X GET "http://localhost:5000/api/events/search?q=tech" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Events Paginated
```bash
curl -X GET "http://localhost:5000/api/events/paginated?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## gRPC Service (Coming Soon)

Implementasi gRPC service untuk:
- User authentication
- Event retrieval
- Real-time event updates

Definisi service tersedia di: `backend/src/grpc/proto/event.proto`

---

## Changelog

### v1.0.0 (Current)
- ✅ User registration dengan email validation
- ✅ User login dengan JWT authentication
- ✅ Get all events dengan sorting
- ✅ Search events dengan keyword
- ✅ Paginated event retrieval
- ✅ CORS enabled untuk frontend

### v1.1.0 (Planned)
- [ ] gRPC service implementation
- [ ] Event detail endpoint
- [ ] User registration untuk events
- [ ] Admin endpoints untuk CRUD events
- [ ] Rate limiting
- [ ] Email verification

---

## Support

Untuk pertanyaan atau issue terkait API, silakan hubungi tim development.
