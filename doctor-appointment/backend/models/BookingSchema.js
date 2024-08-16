import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketPrice: { type: String, required: true },
    isPaid: {
      type: Boolean,
      default: true,
    },
    feedback: {
      type: String, // Field for storing doctor's feedback
      default: "",
    },
    selectedSlot: {
      type: String, // To store the selected time slot
      required: true,
    },
    hospital: {
      type: mongoose.Types.ObjectId,
      ref: "Hospital", // Reference to the hospital to which the patient is assigned
    },
  },
  { timestamps: true }
);

bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "doctor",
    select: "name",
  }).populate("hospital"); // Populate the hospital field when querying bookings

  next();
});

export default mongoose.model("Booking", bookingSchema);
