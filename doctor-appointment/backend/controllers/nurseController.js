import Nurse from "../models/NurseSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate token
const generateToken = user => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "15d" }
  );
};

export const registerNurse = async (req, res) => {
  const { name, email, password, photo, department, shift } = req.body;

  try {
    let user = await Nurse.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Nurse already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    user = new Nurse({
      name,
      email,
      password: hashPassword,
      photo,
      department,
      shift,
      role: "nurse",
    });

    await user.save();
    res.status(200).json({ success: true, message: "Nurse successfully created" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error! Try again" });
  }
};

export const loginNurse = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Nurse.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    const { password: pwd, ...rest } = user._doc;
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Successfully login",
      token,
      data: { ...rest },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to login" });
  }
};

export const updateNurse = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedNurse = await Nurse.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedNurse,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "failed to update",
    });
  }
};

export const deleteNurse = async (req, res) => {
  const id = req.params.id;

  try {
    await Nurse.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete",
    });
  }
};

export const getSingleNurse = async (req, res) => {
  const id = req.params.id;

  try {
    const nurse = await Nurse.findById(id).select("-password");

    res.status(200).json({
      success: true,
      message: "Successful",
      data: nurse,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Not found",
    });
  }
};

export const getAllNurse = async (req, res) => {
  try {
    const nurses = await Nurse.find({}).select("-password");

    res.status(200).json({
      success: true,
      message: "Successful",
      data: nurses,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Not found",
    });
  }
};
