import mongoose from "mongoose";

const BedSchema = new mongoose.Schema({
  bedNumber: { type: Number, required: true, unique: true },
  status: { type: String, enum: ["occupied", "available"], default: "available" },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  department: { type: String, required: true },
});

export default mongoose.model("Bed", BedSchema);
