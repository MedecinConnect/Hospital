import Booking from "../models/BookingSchema.js";
import Hospital from "../models/HospitalSchema.js";

export const assignPatientToHospital = async (req, res) => {
  const { bookingId, hospitalId } = req.body;

  try {
    // Find the booking and ensure the doctor making the request is the one assigned to the booking
    const booking = await Booking.findById(bookingId).populate('doctor');

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.doctor._id.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "You're not authorized to assign this patient" });
    }

    // Find the hospital
    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }

    // Assign the hospital to the booking
    booking.hospital = hospitalId;
    await booking.save();

    // Optionally push the booking into the hospital's bookings array
    hospital.bookings.push(bookingId);
    await hospital.save();

    res.status(200).json({ success: true, message: "Patient successfully assigned to the hospital", data: booking });
  } catch (error) {
    console.error("Error assigning patient to hospital:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
