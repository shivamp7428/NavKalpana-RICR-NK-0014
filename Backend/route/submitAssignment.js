import express from 'express'
import { getSubmissions, submitAssignment } from '../controller/assignmentController.js';
import upload from '../middleware/multerCloudinary.js';

const router = express.Router();

router.get('/',getSubmissions);
router.post("/sub", upload.single('file'), submitAssignment);

export default router;
