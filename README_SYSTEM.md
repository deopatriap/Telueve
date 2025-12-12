# 🎓 Event Campus - Complete Admin System

A full-stack event management system with **dual authentication** for users (mahasiswa) and admins.

## 🎯 Features

### 👨‍🎓 User Features
- ✅ Register with email & password
- ✅ Login to account
- ✅ View all campus events
- ✅ Search events
- ✅ View event details

### 🔐 Admin Features (NEW!)
- ✅ Login without registration (popup modal)
- ✅ View all events in dashboard
- ✅ Create new events with full details
- ✅ Edit existing events
- ✅ Delete events
- ✅ Responsive admin interface

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- PostgreSQL 12+
- npm or yarn

### 1. Database Setup

```bash
psql -U postgres
```

Then run the SQL from `QUICKSTART.md` section "Database Setup"

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### 4. Open Browser

Go to **http://localhost:3000** and start testing!

---

## 📚 Documentation

Read these in order:

1. **`START_HERE.md`** ⭐ - Overview & quick reference
2. **`QUICKSTART.md`** - 5-minute setup guide
3. **`ADMIN_SETUP.md`** - Complete documentation
4. **`TESTING_CHECKLIST.md`** - Test procedures
5. **`ARCHITECTURE.md`** - System diagrams
6. **`IMPLEMENTATION_SUMMARY.md`** - Technical details
7. **`IMPLEMENTATION_CHECKLIST.md`** - What was built

---

## 🔐 Default Credentials

### Admin
- Username: `admin`
- Password: `admin123`

(Change in `backend/.env` for your deployment)

### Database
- User: `postgres`
- Password: `123123`

---

## 📊 API Endpoints

### Public (User)
```
POST   /api/auth/register      Register user
POST   /api/auth/login         User login
GET    /api/events             Get all events
GET    /api/events/search      Search events
GET    /api/events/paginated   Paginated events
```

### Admin (Protected)
```
POST   /api/admin/login        Admin login
GET    /api/admin/events       Get events (admin view)
POST   /api/admin/events       Create event
PUT    /api/admin/events/:id   Update event
DELETE /api/admin/events/:id   Delete event
```

---

## 🗂️ Project Structure

```
event_campus/
├── backend/                    Node.js Express API
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── config/
│   │   └── server.js
│   ├── migrations/             Database migrations
│   ├── package.json
│   └── .env
│
├── frontend/                   Next.js React app
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── tsconfig.json
│
├── Documentation files
├── QUICKSTART.md               📖 START HERE!
├── ADMIN_SETUP.md
├── TESTING_CHECKLIST.md
├── ARCHITECTURE.md
└── Implementation guides
```

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT + bcrypt
- **Runtime:** Node.js

### Frontend
- **Framework:** Next.js 13+
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios

---

## 📝 Key Features

### Admin Dashboard
- Beautiful responsive design (Tailwind CSS)
- Events management table
- Create/Edit/Delete operations
- Form validation
- Success/error messages
- Loading states
- Dark mode support
- Logout functionality

### Authentication
- User registration with bcrypt password hashing
- User login with JWT (7 days expiry)
- Admin login with JWT (24 hours expiry)
- Token-based API protection
- Role-based access control

### Database
- PostgreSQL with optimized indexes
- Parameterized queries (SQL injection prevention)
- Proper schema with relationships
- Migration support

---

## 🧪 Testing

Quick test checklist:

1. **Admin Login** → Username: admin, Password: admin123
2. **Create Event** → Fill form, click Save
3. **Edit Event** → Click Edit, modify, Save
4. **Delete Event** → Click Hapus, Confirm
5. **User Registration** → Fill form, Register
6. **User Login** → Use registered account
7. **View Events** → See events from admin

Full testing guide in `TESTING_CHECKLIST.md`

---

## 🔒 Security

✅ Password hashing (bcrypt)
✅ JWT authentication
✅ CORS configuration
✅ SQL injection prevention
✅ Role-based access control
✅ Token verification middleware

---

## 📈 Future Enhancements

- [ ] Event registration (users register for events)
- [ ] Participant list per event
- [ ] Event categories/tags
- [ ] Event images/thumbnails
- [ ] Email notifications
- [ ] Admin user management
- [ ] Analytics dashboard
- [ ] Calendar view

---

## ❓ Troubleshooting

**"Database connection error"**
→ Ensure PostgreSQL is running and database is created

**"Request failed with status code 404"**
→ Make sure backend is running on port 5000

**"Admin login failed"**
→ Check `.env` credentials (default: admin / admin123)

More help in `ADMIN_SETUP.md` Troubleshooting section

---

## 📞 Support

For issues or questions:
1. Check relevant documentation file
2. Review browser console (F12)
3. Check backend terminal logs
4. Query database directly via psql

---

## 📊 Files Summary

**Total Files Created:** 9
**Total Files Updated:** 8
**Total Documentation:** 7 guides
**Total Lines Added:** ~1500+

---

## ✅ Status

- [x] Implementation complete
- [x] Testing procedures documented
- [x] Full documentation written
- [x] Ready for deployment (MVP level)

---

## 📅 Version

**Version:** 1.0.0 (MVP)
**Last Updated:** November 2024
**Status:** Production-ready (MVP)

---

## 🎉 Get Started!

1. **Read:** `START_HERE.md`
2. **Setup:** `QUICKSTART.md`
3. **Test:** `TESTING_CHECKLIST.md`
4. **Deploy:** `ADMIN_SETUP.md`

**Happy coding!** 🚀

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Next.js Documentation](https://nextjs.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Best Practices](https://jwt.io/)
- [REST API Design](https://restfulapi.net/)

---

**Built with ❤️ for Event Campus**
