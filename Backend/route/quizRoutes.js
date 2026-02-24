import express from 'express'
import { createQuiz, deleteQuiz, getQuizById, getQuizzesByModule, updateQuiz } from '../controller/quizeController.js';

const router = express.Router();

router.post('/quizzes', createQuiz);
router.get('/quizzes/module/:moduleId', getQuizzesByModule);
router.get('/quizzes/:id', getQuizById);
router.put('/quizzes/:id', updateQuiz);
router.delete('/quizzes/:id', deleteQuiz);

export default router;