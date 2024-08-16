import express from "express";
import {
  addHospital,
  getAllHospitals,
  updateHospital,
  deleteHospital
} from "../controllers/hospitalController.js";
import {
    adminAuth,
    authenticate,
    doctorAuth,
    restrict,
  } from "../auth/verifyToken.js";

const router = express.Router();

router.post("/", authenticate, adminAuth, addHospital);
router.get("/", authenticate, getAllHospitals);
router.put("/:id", authenticate, adminAuth, updateHospital);
router.delete("/:id", authenticate, adminAuth, deleteHospital);


export default router;
