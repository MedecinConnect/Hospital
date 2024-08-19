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
  userName: {
    type: String,
    required: true  // Assuming you want to store it directly, but normally this is redundant
  },
  userPhoto: {
    type: String,
    required: true  // Same as above
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
    ref: 'Nurse',
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
  feedbackImage: {
    type: String, // New field for storing image URL
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Booking', BookingSchema);
