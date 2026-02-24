import express from "express";
import { createModule, getModules } from "../controller/moduleController.js";

const router = express.Router();

router.post("/create", createModule);
router.get("/modules", getModules);

export default router;