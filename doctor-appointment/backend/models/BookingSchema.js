import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Doctor',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  hospital: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hospital',
  },
  bed: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bed',
  },
  nurse: {
    type: mongoose.Schema.ObjectId,
    ref: 'Nurse', // Reference to the Nurse model
  },
  ticketPrice: {
    type: Number,
    required: true
  },
  selectedSlot: {
    type: String,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  feedback: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Booking', BookingSchema);
