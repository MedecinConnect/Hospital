import express from 'express';
import { authenticate, restrict } from '../auth/verifyToken.js';
import { getCheckoutSession,getAppointments  } from '../controllers/bookingController.js';
import Booking from '../models/BookingSchema.js';

const router = express.Router();

router.post(
  '/checkout-session/:doctorId',
  authenticate,
  restrict(['patient']),
  getCheckoutSession
);

router.get('/appointments', authenticate, restrict(["patient", "admin"]), getAppointments);
export default router;
