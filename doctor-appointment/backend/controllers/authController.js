import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
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

export const registerUser = async (req, res) => {
  const { name, email, password, role, photo, gender, department, shift, specialization } = req.body;

  try {
    // Check if user already exists
    let user = null;

    if (role === "patient") {
      user = await User.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    } else if (role === "nurse") {
      user = await Nurse.findOne({ email });
    } else if (role === "admin") {
      user = await User.findOne({ email, role: "admin" });
    } else {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create and save user based on the role
    if (role === "patient") {
      user = new User({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    } else if (role === "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashPassword,
        photo,
        specialization,
        role,
      });
    } else if (role === "nurse") {
      user = new Nurse({
        name,
        email,
        password: hashPassword,
        photo,
        department,
        shift,
        role,
      });
    } else if (role === "admin") {
      user = new User({
        name,
        email,
        password: hashPassword,
        role,
      });
    }

    await user.save();
    res.status(200).json({ success: true, message: "User successfully created" });
  } catch (err) {
    console.error("Error during user registration:", err); // Log the exact error
    res.status(500).json({ success: false, message: "Internal server error! Try again" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email }) || await Doctor.findOne({ email }) || await Nurse.findOne({ email });

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
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to login" });
  }
};