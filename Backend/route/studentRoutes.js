import express from 'express';
import { getStudentPerformanceMetrics } from '../controller/studentController.js';

const router = express.Router();

router.get('/student/:studentId/performance-metrics', getStudentPerformanceMetrics);

export default router;