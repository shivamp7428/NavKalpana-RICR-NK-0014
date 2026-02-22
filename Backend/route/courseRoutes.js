import express from "express";
import { createCourse, deleteCourse, getAllCourses, getSingleCourse, updateCourse } from './../controller/courseController.js';

const router = express.Router();

router.post("/create", createCourse);
router.get("/", getAllCourses);
router.get("/:id", getSingleCourse);
router.put("/course/:id", updateCourse);
router.delete("/course/:id", deleteCourse);


export default router;