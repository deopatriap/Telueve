# 🧪 Testing Checklist - Event Campus Admin System

## Pre-Test Checklist

Before you start testing, make sure:

- [ ] PostgreSQL is installed and running
- [ ] Database `event_kampus` is created
- [ ] Tables `users` and `events` are created
- [ ] Backend dependencies installed (`npm install` in backend folder)
- [ ] Frontend dependencies installed (`npm install` in frontend folder)
- [ ] Backend running on port 5000 (`npm run dev`)
- [ ] Frontend running on port 3000 (`npm run dev`)
- [ ] Browser opened to `http://localhost:3000`

---

## 🔐 Test 1: Admin Login

### Steps
1. [ ] Open homepage (http://localhost:3000)
2. [ ] Click **Admin** button
3. [ ] AdminLoginModal should appear
4. [ ] Enter username: **admin**
5. [ ] Enter password: **admin123**
6. [ ] Click **Login** button

### Expected Results
- [ ] No error message
- [ ] Modal closes
- [ ] AdminDashboard component appears
- [ ] Page shows "📊 Admin Dashboard" title
- [ ] **Logout** button appears in top right
- [ ] **+ Tambah Event** button appears
- [ ] Events table visible (currently empty if first time)

### If Failed
- [ ] Check backend terminal for error logs
- [ ] Check browser console (F12) for errors
- [ ] Verify `.env` has `ADMIN_USERNAME=admin` & `ADMIN_PASSWORD=admin123`
- [ ] Try again after server restart

---

## ➕ Test 2: Create Event

### Setup
- [ ] Admin is logged in (completed Test 1)

### Steps
1. [ ] Click **+ Tambah Event** button
2. [ ] Event form should appear with empty fields
3. [ ] Form should have these fields:
   - [ ] Nama Event
   - [ ] Tanggal Event (date picker)
   - [ ] Jam Mulai (time picker)
   - [ ] Jam Selesai (time picker)
   - [ ] Tempat
   - [ ] Deskripsi (textarea)
4. [ ] Fill form with test data:
   - Nama Event: `Tech Talk 2024`
   - Tanggal Event: `2024-11-20`
   - Jam Mulai: `14:00`
   - Jam Selesai: `16:00`
   - Tempat: `Aula Utama Kampus`
   - Deskripsi: `Diskusi teknologi terkini bersama expert industri`
5. [ ] Click **Simpan Event** button
6. [ ] Wait for loading to complete

### Expected Results
- [ ] Success message appears: "✅ Event berhasil ditambahkan!"
- [ ] Form disappears/resets
- [ ] **+ Tambah Event** button reappears
- [ ] Events table now shows 1 event:
  - [ ] Nama: Tech Talk 2024
  - [ ] Tanggal: 20/11/2024 (or your local date format)
  - [ ] Waktu: 14:00 - 16:00
  - [ ] Tempat: Aula Utama Kampus
  - [ ] Edit button visible
  - [ ] Hapus button visible

### If Failed
- [ ] Check for validation error (red message at top)
- [ ] Verify all fields were filled
- [ ] Check backend logs for SQL errors
- [ ] Check browser DevTools Network tab for API response

---

## ➕ Test 3: Create Multiple Events

### Setup
- [ ] Completed Test 2 (have 1 event)

### Steps
1. [ ] Click **+ Tambah Event** again
2. [ ] Fill form with different data:
   - Nama Event: `Hackathon Spring 2024`
   - Tanggal Event: `2024-12-01`
   - Jam Mulai: `08:00`
   - Jam Selesai: `20:00`
   - Tempat: `Lab Komputer Blok A`
   - Deskripsi: `Kompetisi programming 24 jam`
3. [ ] Click **Simpan Event**
4. [ ] Repeat with 3rd event:
   - Nama Event: `Workshop Web Dev`
   - Tanggal Event: `2024-12-05`
   - Jam Mulai: `10:00`
   - Jam Selesai: `12:00`
   - Tempat: `Ruang C.201`
   - Deskripsi: `Belajar web development`

### Expected Results
- [ ] Events table shows 3 events
- [ ] All events visible with correct data
- [ ] Table scrolls if too wide (responsive)
- [ ] Each row has Edit & Hapus buttons

---

## ✏️ Test 4: Edit Event

### Setup
- [ ] Completed Test 3 (have 3 events)

### Steps
1. [ ] Find "Tech Talk 2024" in table
2. [ ] Click **Edit** button on that row
3. [ ] Form should appear with pre-filled data:
   - [ ] Nama: Tech Talk 2024
   - [ ] Tanggal: 2024-11-20
   - [ ] Jam Mulai: 14:00
   - [ ] Jam Selesai: 16:00
   - [ ] Tempat: Aula Utama Kampus
   - [ ] Deskripsi: Diskusi teknologi...
4. [ ] Modify some fields:
   - Change Jam Mulai to `13:00`
   - Change Jam Selesai to `17:00`
   - Add to Deskripsi: ` (Extended duration)`
5. [ ] Click **Simpan Event**

### Expected Results
- [ ] Success message: "✅ Event berhasil diperbarui!"
- [ ] Form disappears
- [ ] Table refreshes
- [ ] Tech Talk 2024 row now shows:
   - [ ] Waktu: 13:00 - 17:00 (changed)
   - [ ] Deskripsi updated (if visible in table detail)
- [ ] Can view updated data by clicking Edit again

---

## 🗑️ Test 5: Delete Event

### Setup
- [ ] Completed Test 4 (have 3 events)

### Steps
1. [ ] Find "Workshop Web Dev" in table
2. [ ] Click **Hapus** button on that row
3. [ ] Confirmation dialog should appear:
   - [ ] Message: "Apakah Anda yakin ingin menghapus event ini?"
   - [ ] OK button
   - [ ] Cancel button
4. [ ] Click **OK** to confirm deletion
5. [ ] Wait for API call to complete

### Expected Results
- [ ] Success message: "✅ Event berhasil dihapus!"
- [ ] Dialog closes
- [ ] Table refreshes
- [ ] "Workshop Web Dev" is NO LONGER in table
- [ ] Only 2 events remain (Tech Talk & Hackathon)

### Additional Test
1. [ ] Click **Hapus** on another event
2. [ ] Click **Cancel** in confirmation dialog
3. [ ] Event should NOT be deleted
4. [ ] Verify event still in table

---

## 🔓 Test 6: Admin Logout

### Setup
- [ ] Admin is still logged in

### Steps
1. [ ] Click **Logout** button (top right)

### Expected Results
- [ ] Admin session ends
- [ ] Token cleared from localStorage
- [ ] Redirect to homepage
- [ ] Homepage shows 3 buttons again:
  - [ ] Daftar Sekarang
  - [ ] Masuk
  - [ ] Admin

---

## 👤 Test 7: User Registration

### Setup
- [ ] On homepage after logging out admin

### Steps
1. [ ] Click **Daftar Sekarang**
2. [ ] Should redirect to `/register`
3. [ ] Fill form:
   - Nama Lengkap: `Budi Santoso`
   - Email: `budi@example.com`
   - Password: `password123`
   - Konfirmasi Password: `password123`
4. [ ] Accept terms & conditions (check checkbox)
5. [ ] Click **Daftar** button

### Expected Results
- [ ] Success message: "✅ Registrasi berhasil!"
- [ ] After 2 seconds, redirects to login page
- [ ] Can proceed with Test 8

### If Failed
- [ ] Check error message (might be validation error)
- [ ] Verify email isn't already registered
- [ ] Check password meets requirements

---

## 🔑 Test 8: User Login

### Setup
- [ ] Completed Test 7 (registered as budi@example.com)

### Steps
1. [ ] On login page
2. [ ] Enter email: `budi@example.com`
3. [ ] Enter password: `password123`
4. [ ] Click **Masuk**

### Expected Results
- [ ] No error
- [ ] Redirect to `/events` or events homepage
- [ ] Events list appears showing:
  - [ ] Tech Talk 2024
  - [ ] Hackathon Spring 2024
  - [ ] (Workshop deleted, shouldn't appear)
- [ ] Search functionality available (if implemented)
- [ ] Can view event details
- [ ] User token stored in localStorage

---

## 📋 Test 9: View Events as User

### Setup
- [ ] Logged in as user (completed Test 8)

### Steps
1. [ ] Should be on events page
2. [ ] Verify events table/list shows:
   - [ ] Tech Talk 2024 - 20/11/2024 - 13:00-17:00 - Aula Utama
   - [ ] Hackathon Spring 2024 - 01/12/2024 - 08:00-20:00 - Lab Komputer
3. [ ] All event details visible correctly

### Expected Results
- [ ] Both events from admin system visible
- [ ] Format is readable (dates, times)
- [ ] User cannot edit/delete (no admin controls)
- [ ] Can search events (if feature exists)

---

## 🔄 Test 10: Switch Between Admin & User

### Steps
1. [ ] User logged in as Budi
2. [ ] Open homepage (or click logo)
3. [ ] Click **Admin** button
4. [ ] Admin login modal appears
5. [ ] Login with admin credentials
6. [ ] Admin dashboard appears
7. [ ] Click **Logout**
8. [ ] Back to homepage
9. [ ] Click **Masuk**
10. [ ] Login as Budi again

### Expected Results
- [ ] Can switch roles seamlessly
- [ ] Admin sees management controls
- [ ] User sees read-only view
- [ ] No data lost or corrupted
- [ ] Correct token used for each role

---

## 🔍 Test 11: Error Handling

### Test Empty Fields
1. [ ] Admin logged in
2. [ ] Click "+ Tambah Event"
3. [ ] Leave all fields empty
4. [ ] Click "Simpan Event"
5. [ ] Should show error: "Semua field harus diisi"

### Test Duplicate Email (User)
1. [ ] Register with email: `test@example.com`
2. [ ] Try register again with same email
3. [ ] Should show error: "Email sudah terdaftar"

### Test Wrong Admin Password
1. [ ] Click Admin button
2. [ ] Enter: admin / wrongpassword
3. [ ] Click Login
4. [ ] Should show error: "Username atau password salah"

---

## 🎨 Test 12: UI/UX & Responsiveness

### Desktop (Full Size)
- [ ] All buttons visible
- [ ] Table properly formatted
- [ ] Form fields aligned
- [ ] No text overflow

### Tablet (768px width)
1. [ ] Open DevTools (F12)
2. [ ] Toggle device toolbar
3. [ ] Select iPad/Tablet
4. [ ] Verify:
   - [ ] Layout responsive
   - [ ] Buttons clickable
   - [ ] Table responsive (might scroll)
   - [ ] Form fields visible

### Mobile (375px width)
1. [ ] Set viewport to mobile
2. [ ] Verify:
   - [ ] Touch targets are large enough (>44px)
   - [ ] No horizontal scrolling (except table)
   - [ ] Text readable
   - [ ] Buttons easily tappable
   - [ ] Modal appears properly

---

## 🌙 Test 13: Dark Mode (Optional)

1. [ ] Check if dark mode available (toggle)
2. [ ] Switch to dark mode
3. [ ] Verify:
   - [ ] Text still readable
   - [ ] Colors have good contrast
   - [ ] Components visible
   - [ ] Switch back to light mode

---

## 💾 Test 14: Data Persistence

### Verify Data Saved to Database
1. [ ] Stop backend server (Ctrl+C)
2. [ ] Stop frontend server (Ctrl+C)
3. [ ] Restart both servers
4. [ ] Go to admin dashboard (login again)
5. [ ] All events should still be there:
   - [ ] Tech Talk 2024
   - [ ] Hackathon Spring 2024

### Verify in PostgreSQL
1. [ ] Open terminal
2. [ ] Connect to database:
   ```bash
   psql -U postgres -d event_kampus
   ```
3. [ ] Run query:
   ```sql
   SELECT * FROM events;
   ```
4. [ ] Should show all created events
5. [ ] Data types correct:
   - [ ] Dates are dates
   - [ ] Times are times
   - [ ] Text fields have correct values

---

## 📊 Final Test Summary

### If All Tests Pass ✅
Congratulations! Your admin system is working perfectly!

- [x] Test 1: Admin Login ✅
- [x] Test 2: Create Event ✅
- [x] Test 3: Create Multiple Events ✅
- [x] Test 4: Edit Event ✅
- [x] Test 5: Delete Event ✅
- [x] Test 6: Admin Logout ✅
- [x] Test 7: User Registration ✅
- [x] Test 8: User Login ✅
- [x] Test 9: View Events as User ✅
- [x] Test 10: Switch Roles ✅
- [x] Test 11: Error Handling ✅
- [x] Test 12: Responsiveness ✅
- [x] Test 13: Dark Mode (Optional) ✅
- [x] Test 14: Data Persistence ✅

### Ready for:
- [ ] Production deployment
- [ ] Demo to stakeholders
- [ ] More feature development

---

## 🐛 Debugging Tips

If a test fails:

1. **Check Browser Console** (F12)
   - Look for JavaScript errors
   - Check Network tab for API errors

2. **Check Backend Terminal**
   - Look for server errors
   - Check SQL query logs

3. **Verify Database**
   - Connect to PostgreSQL
   - Run: `SELECT * FROM events;`
   - Ensure data is there

4. **Check `.env` File**
   - Verify all credentials correct
   - Restart server after changing `.env`

5. **Clear Browser Cache**
   - Ctrl+Shift+Delete (Windows)
   - Cmd+Shift+Delete (Mac)
   - Hard refresh page

6. **Restart Everything**
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)
   - Restart both in order: backend first, then frontend

---

## 📞 Quick Reference

| Component | Location | URL |
|-----------|----------|-----|
| Frontend | http://localhost:3000 | Homepage / Admin / User pages |
| Backend API | http://localhost:5000 | API endpoints |
| Database | localhost:5432 | PostgreSQL |

| Default Credentials | Value |
|-------------------|-------|
| Admin Username | admin |
| Admin Password | admin123 |
| DB User | postgres |
| DB Password | 123123 |

---

## ✅ Testing Complete!

Once all tests pass, your system is ready for:
- Development of additional features
- Deployment to production
- User demonstrations
- Integration with other systems

**Happy testing!** 🎉
