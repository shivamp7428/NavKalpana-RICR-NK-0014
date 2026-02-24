import express from "express";
import { applyInternship, getApplicationsByStudent, getMyApplications } from "../controller/ApplicationController.js";
import upload from '../middleware/multerCloudinary.js';


const router = express.Router();

router.post("/apply",upload.single("resume"),applyInternship);
router.get("/my", getMyApplications);
router.get("/student/:studentId", getApplicationsByStudent);

export default router;