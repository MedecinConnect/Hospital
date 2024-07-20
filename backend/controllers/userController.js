import User from '../models/UserSchema.js';
import Booking from "../models/BookingSchema.js";
import Doctor from  "../models/DoctorSchema.js"
// Fonction pour mettre à jour un utilisateur
export const updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

// Fonction pour supprimer un utilisateur
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

// Fonction pour obtenir un utilisateur par son identifiant
export const getSingleUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).select("-password");

    res.status(200).json({
      success: true,
      message: "User found",
      data: user,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "No user found" });
  }
};

// Fonction pour obtenir tous les utilisateurs
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to retrieve users" });
  }
};
export const getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { password, ...rest } = user._doc;

    res.status(200).json({
      success: true,
      message: "Profile info is getting",
      data: { ...rest },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong, cannot get profile info" });
  }
};
export const getMyAppointments = async (req, res) => {
  try {
    // Step 1: Retrieve appointments from booking for specific user
    const bookings = await Booking.find({ user: req.userId });

    // Step 2: Extract doctor ids from appointment bookings
    const doctorIds = bookings.map(el => el.doctor.id);

    // Step 3: Retrieve doctors using doctor ids
    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select("-password");

    res.status(200).json({
      success: true,
      message: "Appointments are getting",
      data: doctors,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong, cannot get appointments" });
  }
};
