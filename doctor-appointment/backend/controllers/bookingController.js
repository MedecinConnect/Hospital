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

    // Get the currently booked doctor
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      throw new Error(`Doctor not found with id: ${req.params.doctorId}`);
    }

    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error(`User not found with id: ${req.userId}`);
    }

    console.log("Doctor and user found:", doctor, user);

    const ticketPrice = doctor.ticketPrice;

    // Get the selected slot from the request body
    const { selectedSlot } = req.body;
    if (!selectedSlot) {
      throw new Error("No time slot selected for booking.");
    }

    // Check if the selected slot is already booked
    const existingBooking = await Booking.findOne({ doctor: doctor._id, selectedSlot });
    if (existingBooking) {
      return res.status(400).json({ success: false, message: "This time slot is already booked." });
    }

    // Create checkout session
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
      selectedSlot, // Save the selected time slot
    });

    // Save the booking object to the database
    await booking.save();
    console.log("Booking saved:", booking.id);

    // Send the created session as a response
    res.status(200).json({ success: true, message: "Success", session });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res
      .status(500)
      .json({ success: false, message: "Error creating checkout session", error: error.message });
  }
};
export const getAppointments = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate('doctor')
      .populate('hospital')
      .populate('bed'); // Ensure bed is populated

    res.status(200).json({ appointments: bookings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};



export const addFeedback = async (req, res) => {
  const { bookingId } = req.params;
  const { feedback } = req.body;

  try {
    // Trouver le rendez-vous par son ID
    const booking = await Booking.findById(bookingId).populate('doctor'); // Assurez-vous de récupérer l'objet complet du docteur
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Debugging logs
    console.log("Booking Doctor ID: ", booking.doctor._id.toString());
    console.log("User ID: ", req.userId);

    // Vérifier que l'utilisateur actuel est bien le docteur assigné à ce rendez-vous
    if (booking.doctor._id.toString() !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Ajouter le feedback
    booking.feedback = feedback;
    await booking.save();

    res.status(200).json({ message: "Feedback added successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFeedback = async (req, res) => {
  const { bookingId } = req.params;

  try {
    // Find the booking by ID and populate the doctor and user fields
    const booking = await Booking.findById(bookingId).populate('doctor').populate('user');
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // If no feedback exists, return a 404 with a message
    if (!booking.feedback) {
      return res.status(404).json({ message: "No feedback found for this booking" });
    }

    // Return the feedback
    res.status(200).json({ feedback: booking.feedback });
  } catch (error) {
    console.error("Error retrieving feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get available time slots for a doctor
export const getAvailableTimeSlots = async (req, res) => {
  try {
    console.log("Fetching available time slots for doctor:", req.params.doctorId); // Ajout de cette ligne pour vérifier si la route est atteinte

    const { doctorId } = req.params;

    // Find the doctor by ID
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Find all bookings for this doctor
    const bookings = await Booking.find({ doctor: doctorId });

    // Get all time slots of the doctor
    const timeSlots = doctor.timeSlots;

    // Filter out the time slots that are already booked
    const availableTimeSlots = timeSlots.filter(slot => {
      const isBooked = bookings.some(booking => booking.selectedSlot === slot);
      return !isBooked;
    });

    res.status(200).json({ availableTimeSlots });
  } catch (error) {
    res.status(500).json({ message: "Failed to get available time slots" });
  }
};
export const getDoctorAppointments = async (req, res) => {
  console.log('getDoctorAppointments route hit');
  try {
    const doctorId = req.params.doctorId;
    console.log(`Doctor ID: ${doctorId}`);  // Debugging to ensure the ID is correct
    
    const bookings = await Booking.find({ doctor: doctorId }).populate('user');
    
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ success: false, message: 'No appointments found for this doctor.' });
    }

    res.status(200).json({ success: true, appointments: bookings });
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};



// Route pour obtenir tous les rendez-vous
export const getAllAppointments = async (req, res) => {
  try {
    // Récupérer tous les rendez-vous
    const bookings = await Booking.find().populate('doctor').populate('user');
    
    // Répondre avec les rendez-vous
    res.status(200).json({ success: true, appointments: bookings });
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    res.status(500).json({ success: false, message: "Error fetching all appointments", error: error.message });
  }
};
