import express from 'express';
import Stripe from 'stripe';
import Booking from '../models/BookingSchema.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['stripe-signature'];
  
    let event;
    try {
      // Stripe demande l'accès au corps brut de la requête ici
      event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }
  
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
  
      try {
        const booking = await Booking.findOne({ session: session.id });
        if (booking) {
          booking.isPaid = true;
          await booking.save();
          console.log(`Booking ${booking._id} marked as paid.`);
        }
      } catch (error) {
        console.error('Error updating booking status:', error);
      }
    }
  
    res.status(200).end();
});

export default router;
