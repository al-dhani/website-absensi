import express from "express";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getClasses
} from "../controllers/studentsController.js";

const router = express.Router();

router.get("/", getStudents);
router.get("/classes", getClasses); // route untuk get classes

router.post("/", addStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
