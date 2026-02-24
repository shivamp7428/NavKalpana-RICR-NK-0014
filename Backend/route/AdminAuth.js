import express from "express";
import { adminLogin } from './../controller/AdminController.js';

const router = express.Router();

router.post("/login", adminLogin);

export default router;
