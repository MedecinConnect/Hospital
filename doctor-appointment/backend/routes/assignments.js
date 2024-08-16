import express from "express";
import { assignPatientToHospital } from "../controllers/AssignmentController.js"; // Ensure you use the correct path
import { authenticate, doctorAuth } from "../auth/verifyToken.js";

const router = express.Router();

// New route for assigning a patient to a hospital
router.post("/assign-patient", authenticate, doctorAuth, assignPatientToHospital);

export default router;
