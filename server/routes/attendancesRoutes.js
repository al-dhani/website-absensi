import express from "express";
import { getAttendances, addAttendance, updateAttendance } from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/", getAttendances);
router.post("/", addAttendance);
router.patch("/update", updateAttendance);

export default router;
