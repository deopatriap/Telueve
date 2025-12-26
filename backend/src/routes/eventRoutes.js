import express from 'express';
import {
  getAllEvents,
  getEventById,
  getEventDetail,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  searchEvents,
  getEventsPaginated,
  getPublicAnnouncements
} from '../controllers/eventController.js';
import { verifyToken, isAdmin, isOrganizer } from '../middleware/authMiddleware.js';
import { validate, createEventSchema, updateEventSchema } from '../middleware/validation.js';

const router = express.Router();

// ========================================
// PUBLIC ROUTES (No authentication needed)
// ========================================

// Get all events
router.get('/', getAllEvents);

// Get public announcements
router.get('/announcements', getPublicAnnouncements);

// Search events
router.get('/search', searchEvents);

// Get events paginated
router.get('/paginated', getEventsPaginated);

// Get single event detail (public, anyone can view)
router.get('/:id', getEventDetail); // Handler changed to getEventDetail

// ========================================
// ORGANIZER/ADMIN ROUTES (Event Management)
// ========================================

// Create new event (organizer/admin only)
router.post('/', verifyToken, isOrganizer, validate(createEventSchema), createEvent);

// Update event (organizer/admin only)
router.put('/:id', verifyToken, isOrganizer, validate(updateEventSchema), updateEvent);

// Delete event (organizer/admin only)
router.delete('/:id', verifyToken, isOrganizer, deleteEvent);

export default router;