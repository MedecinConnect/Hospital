import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import doctorRoute from "./routes/doctor.js";
import reviewRoute from "./routes/review.js";
import bookingRoute from "./routes/booking.js";
import nurseRoute from "./routes/nurse.js";
import bedRoute from "./routes/bed.js";
import hospitalRoute from "./routes/hospital.js";
import assignmentsRoute from "./routes/assignments.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000', // Specify the exact origin here
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
}));

// Test route
app.get("/", (req, res) => {
  res.send("hello server");
});

// Database connection
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB database connected");
  } catch (err) {
    console.error("MongoDB database connection failed:", err.message);
    process.exit(1); // Exit the process with failure
  }
};

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/doctors", doctorRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/bookings", bookingRoute);
app.use("/api/v1/nurses", nurseRoute);
app.use("/api/v1/beds", bedRoute);
app.use("/api/v1/appointments", bookingRoute); 
app.use("/api/v1/hospitals", hospitalRoute);
app.use("/api/v1/assignments", assignmentsRoute);

// Start server
app.listen(port, () => {
  connectDB().then(() => {
    console.log("Server listening on port " + port);
  });
});
