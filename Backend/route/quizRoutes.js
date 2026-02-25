import express from "express";
import { createQuiz, deleteQuiz, getAllQuizzes, getQuizById, submitQuizAttempt, updateQuiz } from '../controller/quizeController.js';


const router = express.Router();

router.post("/quizzes", createQuiz);
router.get("/quizzes", getAllQuizzes); 
router.get("/quizzes/:id", getQuizById);
router.put("/quizzes/:id", updateQuiz);
router.delete("/quizzes/:id", deleteQuiz);
router.post("/quizzes/:id/submit", submitQuizAttempt);

export default router;