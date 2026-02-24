import express from "express";
import { createInternship, deleteInternship, getAllInternships, getInternshipById, updateInternship } from "../controller/InternshipController.js";


const router = express.Router();

router.post("/create", createInternship);
router.get("/", getAllInternships);
router.get("/:id", getInternshipById);
router.put("/:id", updateInternship);
router.delete("/:id", deleteInternship);

export default router;