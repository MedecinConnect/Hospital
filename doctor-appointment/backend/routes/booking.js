import express from 'express';
import { authenticate, restrict } from '../auth/verifyToken.js';
import {
  getCheckoutSession,
  getAppointments,
  addFeedback,
  getFeedback,
  getAvailableTimeSlots,
  getDoctorAppointments,
  getAllAppointments,
  paymentSuccess // Importation de la fonction
} from '../controllers/bookingController.js';

const router = express.Router();

router.post(
  '/checkout-session/:doctorId',
  authenticate,
  restrict(['patient']),
  getCheckoutSession
);

router.get('/appointments', authenticate, restrict(["patient", "admin", "doctor"]), getAppointments);

router.get(
  '/doctors/:doctorId/available-slots', 
  authenticate, 
  restrict(["patient", "admin"]), 
  getAvailableTimeSlots
);

// Route to add feedback
router.post("/:bookingId/feedback", authenticate, restrict(["doctor"]), addFeedback);
router.get("/:bookingId/feedback", authenticate, restrict(["doctor", "patient"]), getFeedback);

// Route to get all appointments
router.get('/appointments/all', authenticate, restrict(["admin"]), getAllAppointments);

// Route to get appointments specifically for a doctor
router.get(
  '/doctors/:doctorId/appointments', 
  authenticate, 
  restrict(["doctor"]), 
  getDoctorAppointments // Use the function to fetch doctor's appointments
);

router.get('/payment-success', paymentSuccess);

export default router;
