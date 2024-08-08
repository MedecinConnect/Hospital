import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Nurse from "../models/NurseSchema.js";

export const authenticate = async (req, res, next) => {
  const authToken = req.headers.authorization;
  console.log("authToken:", authToken); // Log added

  if (!authToken || !authToken.startsWith("Bearer ")) {
    console.log("No token or invalid token format");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const token = authToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("decoded token:", decoded); // Log added

    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch (err) {
    console.log("Error verifying token:", err); // Log added
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token has expired" });
    }

    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const restrict = roles => async (req, res, next) => {
  const userId = req.userId;
  console.log("User ID from token:", userId); // Log added

  let user = await User.findById(userId) || await Doctor.findById(userId) || await Nurse.findById(userId);
  console.log("User found:", user); // Log added

  if (!user || !roles.includes(user.role)) {
    return res.status(401).json({ success: false, message: "You're not authorized" });
  }

  next();
};

export const adminAuth = restrict(["admin"]);
export const doctorAuth = restrict(["doctor"]);
export const nurseAuth = restrict(["nurse"]);
export const patientAuth = restrict(["patient", "admin"]);
