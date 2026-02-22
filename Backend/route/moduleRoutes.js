import express from "express";
import { createModule } from "../controller/moduleController.js";

const router = express.Router();

router.post("/create", createModule);

export default router;