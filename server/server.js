import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db/connection.js";
import authRoutes from "./routes/authRoutes.js";
import studentsRoutes from "./routes/studentsRoutes.js";
import attendanceRoutes from "./routes/attendancesRoutes.js";
import classesRoutes from "./routes/classesRoutes.js";
import guruRoutes from "./routes/guruRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/attendances", attendanceRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/guru", guruRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
