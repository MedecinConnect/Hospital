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

const router = express.Router();

router.post("/register", registerNurse);
router.post("/login", loginNurse);
router.get("/", authenticate, adminAuth, getAllNurse);
router.get("/:id", authenticate, nurseAuth, getSingleNurse);
router.put("/:id", authenticate, nurseAuth, updateNurse);
router.delete("/:id", authenticate, adminAuth, deleteNurse);

export default router;
