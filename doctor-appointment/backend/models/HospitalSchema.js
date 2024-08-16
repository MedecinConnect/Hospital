import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  departments: [{ type: String }],
  photo: { type: String },
  beds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bed" }],
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }], // New field to store assigned bookings
});

export default mongoose.model("Hospital", HospitalSchema);
