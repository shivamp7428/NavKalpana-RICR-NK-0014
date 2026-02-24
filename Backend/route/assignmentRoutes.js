import express from 'express';
import { createAssignment, getAssignmentById, getAssignments } from '../controller/assignmentController.js';

const router = express.Router();

router.get('/', getAssignments);
router.get('/:id', getAssignmentById);
router.post('/',  createAssignment); 
export default router;