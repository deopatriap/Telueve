# 🚀 Quick Start - Testing New Architecture

## Prerequisites
- PostgreSQL running
- Backend running on port 4000
- Frontend running on port 3000

---

## 🧪 Test User Flow

### Step 1: Visit Homepage
```
1. Open browser → http://localhost:3000
2. You should see:
   - Welcome message
   - "✍️ Daftar Sekarang" button
   - "🔓 Masuk" button
3. NO admin button on homepage
```

### Step 2: Register New User
```
1. Click "✍️ Daftar Sekarang"
2. Fill form:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
3. Click "Daftar"
4. Success → Redirect to /events
5. See events created by admin
```

### Step 3: User Login
```
1. Go to http://localhost:3000/login
2. Enter:
   - Email: john@example.com
   - Password: password123
3. Click "Masuk"
4. Success → Redirect to /events
```

### Step 4: Check Admin Login Button
```
1. On login page (/login)
2. Scroll down to bottom
3. See "🔐 Admin Login" button (purple)
4. This is the way for admin to access system
```

### Step 5: User Logout
```
1. On /events page
2. Click "Logout" button
3. Token cleared from localStorage
4. Redirect to homepage (/)
```

---

## 🔐 Test Admin Flow

### Step 1: Go to Admin Login
```
Method A - From user login page:
1. Go to http://localhost:3000/login
2. Scroll down → Click "🔐 Admin Login" (purple button)
3. Redirects to /admin/login

Method B - Direct URL:
1. Type: http://localhost:3000/admin/login
```

### Step 2: Admin Login
```
1. On /admin/login page
2. Enter:
   - Username: admin
   - Password: admin123
3. Click "Login"
4. Success → Redirect to /admin
```

### Step 3: Admin Dashboard
```
1. At http://localhost:3000/admin
2. You should see:
   - Event management form (Create/Edit/Delete)
   - Table of all events
   - Current admin token display (for debugging)
   - Logout button
```

### Step 4: Create Event (Admin)
```
1. On admin dashboard
2. Fill form:
   - Event Name: "Introduction to Web Development"
   - Date: 2024-02-15
   - Start Time: 09:00
   - End Time: 11:00
   - Location: "Room 101, Building A"
   - Description: "Learn basics of web development"
3. Click "Create Event"
4. Success → Event added to table below
```

### Step 5: View All Events
```
1. Scroll down on admin dashboard
2. See table of all events with columns:
   - Event Name
   - Date
   - Start Time
   - End Time
   - Location
   - Description
   - Actions (Edit/Delete buttons)
```

### Step 6: Edit Event (Admin)
```
1. On event table
2. Click "Edit" button on any event
3. Form fills with event data
4. Change some fields
5. Click "Update Event"
6. Success → Table updates
```

### Step 7: Delete Event (Admin)
```
1. On event table
2. Click "Delete" button
3. Confirmation dialog appears
4. Confirm delete
5. Success → Event removed from table
```

### Step 8: Admin Logout
```
1. On admin dashboard
2. Click "Logout" button
3. adminToken cleared from localStorage
4. Redirect to /admin/login
```

---

## 🔍 Debugging Tips

### Check Token in Browser
```javascript
// In browser console (F12 → Console tab)

// Check user token
console.log(localStorage.getItem("token"));

// Check admin token
console.log(localStorage.getItem("adminToken"));

// Clear all tokens (for testing)
localStorage.clear();
```

### Test User vs Admin
```
User Access:
- Can access: /, /register, /login, /events
- Cannot access: /admin, /admin/login (no admin token)

Admin Access:
- Can access: /admin/login, /admin
- Cannot access: /login (different flow)
- Cannot register like user

If admin tries to access /events:
- Page may load but API calls fail (wrong token type)
```

### Check API Calls
```
1. Open Developer Tools (F12)
2. Go to Network tab
3. Perform login/actions
4. See API requests:
   - POST /api/auth/login (user)
   - POST /api/admin/login (admin)
   - GET /api/admin/events (admin)
```

### Common Issues & Solutions

**Issue: "Cannot read property 'localStorage' of undefined"**
- Reason: Code running on server side
- Solution: Use "use client" directive in Next.js components ✅ (already done)

**Issue: Admin login doesn't redirect**
- Check: adminToken stored in localStorage?
- Check: API returns token?
- Check: Admin endpoint working in backend?

**Issue: User cannot see events**
- Check: User token present in localStorage?
- Check: User logged in successfully?
- Check: Backend returning events correctly?

**Issue: Admin cannot create events**
- Check: Admin logged in with valid token?
- Check: Admin token in Authorization header?
- Check: Backend middleware accepting admin token?

---

## 📊 Expected Test Results

### User Flow Success ✅
```
Homepage (no admin stuff) 
    ↓
Register/Login 
    ↓
Access /events 
    ↓
See all events 
    ↓
Logout 
    ↓
Back to homepage
```

### Admin Flow Success ✅
```
/admin/login 
    ↓
Admin login (admin/admin123) 
    ↓
/admin dashboard 
    ↓
Full event management (CRUD) 
    ↓
Logout 
    ↓
Back to /admin/login
```

---

## 📱 Feature Checklist

### User Features
- [x] Register new account
- [x] Login with email/password
- [x] Browse all events
- [x] Logout
- [x] See admin login button

### Admin Features
- [x] Login with admin/admin123
- [x] Create new event
- [x] View all events in table
- [x] Edit existing event
- [x] Delete event
- [x] Logout

### System Features
- [x] Separate URLs (/ vs /admin/login)
- [x] Different token keys (token vs adminToken)
- [x] Protected routes (check token before showing)
- [x] Clean separation (user doesn't see admin stuff)

---

## 🎯 Before Deployment

Make sure to test:
1. ✅ User registration works
2. ✅ User login works
3. ✅ Admin login works
4. ✅ Admin CRUD works
5. ✅ Tokens persist correctly
6. ✅ No admin stuff visible to users
7. ✅ Logout clears tokens
8. ✅ Protected routes redirect correctly

---

## 💾 Database Check

Run in terminal to verify database is set up:

```bash
# Connect to PostgreSQL
psql -U your_user -d event_campus

# Check tables
\dt

# Check events table
SELECT * FROM events;

# Check users table
SELECT * FROM users;
```

Expected output:
```
            List of relations
Schema |   Name   | Type  | Owner
--------+----------+-------+-------
public | events   | table | user
public | users    | table | user
```

---

## 🚀 Ready to Test?

The system is now ready! Start with:

1. **Open browser** → http://localhost:3000
2. **User flow** → Register/Login → Browse events
3. **Admin flow** → /admin/login → Manage events

Semuanya siap untuk testing! 🎉
