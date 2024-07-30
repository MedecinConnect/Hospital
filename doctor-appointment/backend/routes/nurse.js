import express from "express";
import {
  registerNurse,
  loginNurse,
  updateNurse,
  deleteNurse,
  getSingleNurse,
  getAllNurse,
} from "../controllers/nurseController.js";
import { authenticate, nurseAuth, adminAuth } from "../auth/verifyToken.js";
import Nurse from "../models/NurseSchema.js"; // Importez le modèle Nurse ici

const router = express.Router();

router.post("/register", registerNurse);
router.post("/login", loginNurse);
router.get("/", authenticate, adminAuth, getAllNurse);

router.get("/profile/me", authenticate, nurseAuth, async (req, res) => {
  try {
    console.log("Fetching nurse profile for userId:", req.userId); // Ajoutez un log
    const nurse = await Nurse.findById(req.userId).select("-password");
    if (!nurse) {
      console.log("Nurse not found"); // Ajoutez un log
      return res.status(404).json({ message: "Nurse not found" });
    }
    res.status(200).json({ success: true, data: nurse });
  } catch (error) {
    console.error("Error fetching nurse profile:", error); // Ajoutez un log
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", authenticate, nurseAuth, getSingleNurse);
router.put("/:id", authenticate, nurseAuth, updateNurse);
router.delete("/:id", authenticate, adminAuth, deleteNurse);

export default router;
