import express from "express";
import {
  addBed,
  updateBed,
  deleteBed,
  getSingleBed,
  getAllBed,
} from "../controllers/bedController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

router.post("/", authenticate, restrict(["nurse", "admin"]), addBed);
//router.get("/", authenticate, restrict(["nurse", "admin","patient"]), getAllBed);
router.get("/:id", authenticate, restrict(["nurse", "admin"]), getSingleBed);
router.put("/:id", authenticate, restrict(["nurse", "admin"]), updateBed);
router.delete("/:id", authenticate, restrict(["nurse", "admin"]), deleteBed);
router.get("/", getAllBed);
export default router;
