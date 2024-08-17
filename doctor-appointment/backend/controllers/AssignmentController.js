import Booking from "../models/BookingSchema.js";
import Hospital from "../models/HospitalSchema.js";
import Bed from "../models/BedSchema.js";
import mongoose from 'mongoose';

export const assignPatientToHospital = async (req, res) => {
  const { bookingId, hospitalId, bedId } = req.body;

  // Validate ObjectIDs
  if (!mongoose.Types.ObjectId.isValid(bookingId) || !mongoose.Types.ObjectId.isValid(hospitalId) || !mongoose.Types.ObjectId.isValid(bedId)) {
    return res.status(400).json({ success: false, message: "Invalid booking, hospital, or bed ID" });
  }

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

    // Find the bed and ensure it's available
    const bed = await Bed.findById(bedId);

    if (!bed) {
      return res.status(404).json({ success: false, message: "Bed not found" });
    }

    if (bed.status === "occupied") {
      return res.status(400).json({ success: false, message: "Bed is already occupied" });
    }

    // Assign the hospital and bed to the booking
    booking.hospital = hospitalId;
    booking.bed = bedId;
    await booking.save();

    // Update the bed status to "occupied" and assign the patient to the bed
    bed.status = "occupied";
    bed.patient = booking.patient; // Assuming the booking contains a reference to the patient
    await bed.save();

    // Optionally, add the booking to the hospital's bookings array
    hospital.bookings.push(bookingId);
    await hospital.save();

    res.status(200).json({ success: true, message: "Patient successfully assigned to the hospital and bed", data: booking });
  } catch (error) {
    console.error("Error assigning patient to hospital and bed:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
