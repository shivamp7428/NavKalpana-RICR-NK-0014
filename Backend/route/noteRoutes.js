import express from "express";
import { createNote, deleteNote, getNoteById, getNotesByCourse, getNotesByModule, updateNote } from './../controller/noteController.js';
const router = express.Router();


router.post("/", createNote);
router.get("/module/:moduleId", getNotesByModule);
router.route("/:id").get(getNoteById).put(updateNote).delete(deleteNote);
router.get("/course/:courseId", getNotesByCourse);

export default router;