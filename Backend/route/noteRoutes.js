import express from "express";
import {createNote, getNotesByModule, getNoteById, updateNote, deleteNote } from "../controller/noteController.js";

const router = express.Router();

// CRUD routes
router.post("/notes", createNote);
router.get("/notes/module/:moduleId", getNotesByModule);
router.get("/notes/:id", getNoteById);
router.put("/notes/:id", updateNote);
router.delete("/notes/:id", deleteNote);

export default router;