import express from "express";
import { getGuru } from "../controllers/guruController.js";

const router = express.Router();

router.get("/", getGuru);

export default router;
