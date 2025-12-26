import express from 'express';
import {
  loginAdmin,
  verifyAdminToken,
  getEventsAdmin,
  addEvent,
  editEvent,
  removeEvent,
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllAnnouncements,
  createAnnouncement,
  toggleAnnouncement,
  deleteAnnouncement,
  getSettings,
  updateSettings
} from '../controllers/adminController.js';

import {
  getAllRegistrations,
  bulkUpdateRegistrationStatus
} from '../controllers/registrationController.js';

const router = express.Router();

// Public endpoint
router.post('/login', loginAdmin);

// Protected endpoints (require admin token)
router.get('/events', verifyAdminToken, getEventsAdmin);
router.post('/events', verifyAdminToken, addEvent);
router.put('/events/:event_id', verifyAdminToken, editEvent);
router.delete('/events/:event_id', verifyAdminToken, removeEvent);

// Analytics
router.get('/stats', verifyAdminToken, getDashboardStats);

// User Management
router.get('/users', verifyAdminToken, getAllUsers);
router.put('/users/:userId', verifyAdminToken, updateUserRole); // Using generic update name/email for now as role is ambiguous
router.delete('/users/:userId', verifyAdminToken, deleteUser);

// Registration Management
router.get('/registrations', verifyAdminToken, getAllRegistrations);
router.put('/registrations/bulk', verifyAdminToken, bulkUpdateRegistrationStatus);

// Announcements
router.get('/announcements', verifyAdminToken, getAllAnnouncements);
router.post('/announcements', verifyAdminToken, createAnnouncement);
router.put('/announcements/:id/toggle', verifyAdminToken, toggleAnnouncement);
router.delete('/announcements/:id', verifyAdminToken, deleteAnnouncement);

// Settings
router.get('/settings', verifyAdminToken, getSettings);
router.put('/settings', verifyAdminToken, updateSettings);

export default router;
