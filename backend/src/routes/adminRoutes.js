import express from 'express';
import { 
  loginAdmin, 
  verifyAdminToken, 
  getEventsAdmin, 
  addEvent, 
  editEvent, 
  removeEvent 
} from '../controllers/adminController.js';

const router = express.Router();

// Public endpoint
router.post('/login', loginAdmin);

// Protected endpoints (require admin token)
router.get('/events', verifyAdminToken, getEventsAdmin);
router.post('/events', verifyAdminToken, addEvent);
router.put('/events/:event_id', verifyAdminToken, editEvent);
router.delete('/events/:event_id', verifyAdminToken, removeEvent);

export default router;
