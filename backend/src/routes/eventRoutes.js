import express from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  searchEvents
} from '../controllers/eventController.js';
import { verifyToken, isAdmin, isOrganizer } from '../middleware/authMiddleware.js';
import { validate, createEventSchema, updateEventSchema } from '../middleware/validation.js';

const router = express.Router();

// ========================================
// PUBLIC ROUTES (No authentication needed)
// ========================================

// Get all events
router.get('/', getAllEvents);

// Get upcoming events
router.get('/upcoming', getUpcomingEvents);

// Search events
router.get('/search', searchEvents);

// Get single event detail (public, anyone can view)
router.get('/:id', getEventById);

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