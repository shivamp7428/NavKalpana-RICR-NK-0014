import express from "express";
import { createLesson } from "../controller/lessonController.js";

const router = express.Router();

router.post("/create", createLesson);

export default router;