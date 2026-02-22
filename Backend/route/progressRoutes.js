import express from "express";
import { getUserCourseProgress, markLessonComplete } from "../controller/progressController.js";

const router = express.Router();

router.post("/", getUserCourseProgress);
router.post("/complete", markLessonComplete);

export default router;