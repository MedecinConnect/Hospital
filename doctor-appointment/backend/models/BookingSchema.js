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
      type: String, // Champ pour stocker le feedback du docteur
      default: "",
    },
    selectedSlot: {
      type: String, // Ajouter ce champ pour stocker le créneau horaire sélectionné
      required: true,
    },
  },
  { timestamps: true }
);

bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "doctor",
    select: "name",
  });

  next();
});

export default mongoose.model("Booking", bookingSchema);
