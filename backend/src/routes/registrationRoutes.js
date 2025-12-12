import express from 'express';
import {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  getRegistrationStatistics,
  checkMyRegistration
} from '../controllers/registrationController.js';

import { verifyToken, isAdmin, isOrganizer } from '../middleware/authMiddleware.js';

const router = express.Router();

/* ============================
   CRITICAL: Route Order Matters!
   
   Express matches routes in order from TOP to BOTTOM.
   More SPECIFIC routes MUST come BEFORE generic ones.
   
   ✅ Good: /my, /stats, /check/:id, then /:id
   ❌ Bad:  /:id first (will catch everything)
============================ */

/* ============================
   USER ROUTES - Static paths first
============================ */

// Get my registrations
router.get('/my', verifyToken, getMyRegistrations);

// Get registration statistics (organizer/admin only)
router.get('/stats', verifyToken, isOrganizer, getRegistrationStatistics);

/* ============================
   USER ROUTES - With prefixes
============================ */

// Check if already registered for specific event
router.get('/check/:eventId', verifyToken, checkMyRegistration);

/* ============================
   ORGANIZER ROUTES
============================ */

// Get all registrations for specific event (organizer/admin only)
router.get('/event/:eventId', verifyToken, isOrganizer, getEventRegistrations);

/* ============================
   ADMIN ROUTES
============================ */

// Delete any registration (admin only)
router.delete('/admin/:registrationId', verifyToken, isAdmin, deleteRegistration);

/* ============================
   GENERIC ROUTES - MUST BE LAST!
   
   These routes use dynamic params like /:eventId or /:registrationId
   They MUST be at the bottom to avoid catching other routes
============================ */

// Register for an event (POST /api/registrations/:eventId)
router.post('/:eventId', verifyToken, registerForEvent);

// Cancel my registration for an event (DELETE /api/registrations/:eventId)
router.delete('/:eventId', verifyToken, cancelRegistration);

// Update registration status (PUT /api/registrations/:registrationId)
// This is for organizers to accept/reject registrations
router.put('/:registrationId', verifyToken, isOrganizer, updateRegistrationStatus);

export default router;