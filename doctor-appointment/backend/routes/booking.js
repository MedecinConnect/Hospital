import express from 'express';
import { authenticate, restrict } from '../auth/verifyToken.js';
import {
  getCheckoutSession,
  getAppointments,
  addFeedback,
  getFeedback,
  getAvailableTimeSlots, // Importation de la fonction
} from '../controllers/bookingController.js';

const router = express.Router();

router.post(
  '/checkout-session/:doctorId',
  authenticate,
  restrict(['patient']),
  getCheckoutSession
);

router.get('/appointments', authenticate, restrict(["patient", "admin"]), getAppointments);

router.get(
  '/doctors/:doctorId/available-slots', 
  authenticate, 
  restrict(["patient", "admin"]), 
  getAvailableTimeSlots
);


// Route pour ajouter un feedback
router.post("/:bookingId/feedback", authenticate, restrict(["doctor"]), addFeedback);
router.get("/:bookingId/feedback", authenticate, restrict(["doctor", "patient"]), getFeedback);

export default router;
