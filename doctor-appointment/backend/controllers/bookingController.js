import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Stripe from "stripe";
import User from "../models/UserSchema.js";

export const getCheckoutSession = async (req, res) => {
  try {
    console.log("Starting checkout session creation...");

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key not defined");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // get the currently booked doctor
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      throw new Error(`Doctor not found with id: ${req.params.doctorId}`);
    }

    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error(`User not found with id: ${req.userId}`);
    }

    console.log("Doctor and user found:", doctor, user);

    // Ajustez le prix du ticket pour être sûr qu'il est suffisamment élevé
    const ticketPrice = doctor.ticketPrice; // Assurez-vous que le prix est suffisamment élevé

    // create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
      cancel_url: `${req.protocol}://${req.get("host")}/doctor/${doctor.id}`,
      customer_email: user.email,
      client_reference_id: req.params.doctorId,
      line_items: [
        {
          price_data: {
            currency: "cad",
            unit_amount: ticketPrice * 100,
            product_data: {
              name: doctor.name,
              description: doctor.bio,
              images: [doctor.photo],
            },
          },
          quantity: 1,
        },
      ],
    });

    console.log("Stripe session created:", session.id);

    // Create a booking object with the necessary details
    const booking = new Booking({
      doctor: doctor._id,
      user: user._id,
      ticketPrice: ticketPrice,
      session: session.id,
    });

    // Save the booking object to the database
    await booking.save();
    console.log("Booking saved:", booking.id);

    // send the created session as a response
    res.status(200).json({ success: true, message: "Success", session });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res
      .status(500)
      .json({ success: false, message: "Error creating checkout session", error: error.message });
  }
};