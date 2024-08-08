import mongoose from "mongoose";

const NurseSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: Number },
  photo: { type: String },
  role: {
    type: String,
    default: "nurse",
  },
  department: { type: String },
  shift: { type: String },
  qualifications: {
    type: Array,
  },
  experiences: {
    type: Array,
  },
  isApproved: {
    type: String,
    enum: ["pending", "approved", "cancelled"],
    default: "pending",
  },
});

export default mongoose.model("Nurse", NurseSchema);
