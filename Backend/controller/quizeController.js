import mongoose from "mongoose";
import Quiz from "../models/Quizes.js";       
import Module from "../models/Module.js";
import QuizAttempt from "../models/QuizAttempt.js";


export const createQuiz = async (req, res) => {
  try {
    const { title, questions, timeLimit, passingScore } = req.body;

    if (!title?.trim() || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title and at least one question are required",
      });
    }
    for (const q of questions) {
      if (!q.question?.trim() || !Array.isArray(q.options) || q.options.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Each question must have text and at least 2 options",
        });
      }
      if (
        typeof q.correctOption !== "number" ||
        q.correctOption < 0 ||
        q.correctOption >= q.options.length
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid correctOption index in one or more questions",
        });
      }
    }

    const quiz = new Quiz({
      title: title.trim(),
      questions,
      timeLimit: Number(timeLimit) || 600,       
      passingScore: Number(passingScore) || 60,  
    });

    await quiz.save();

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (error) {
    console.error("Create quiz error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating quiz",
      error: error.message || "Unknown error",
    });
  }
};

export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true })
      .select("questions.correctOption -questions.explanation")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    console.error("Get quizzes error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching quizzes",
      error: error.message,
    });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid quiz ID" });
    }

    const quiz = await Quiz.findById(id).select("-questions.correctOption -questions.explanation");
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    if (!quiz.isActive) {
      return res.status(403).json({ success: false, message: "This quiz is not active" });
    }

    return res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error("Get quiz error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching quiz",
      error: error.message,
    });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid quiz ID" });
    }

    const allowedUpdates = ["title", "questions", "timeLimit", "passingScore", "isActive", "maxAttempts"];
    const filteredUpdates = Object.keys(updates).reduce((obj, key) => {
      if (allowedUpdates.includes(key)) obj[key] = updates[key];
      return obj;
    }, {});

    const quiz = await Quiz.findByIdAndUpdate(id, filteredUpdates, {
      new: true,
      runValidators: true,
    });

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      data: quiz,
    });
  } catch (error) {
    console.error("Update quiz error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating quiz",
      error: error.message,
    });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid quiz ID" });
    }

    const quiz = await Quiz.findByIdAndDelete(id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error("Delete quiz error:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting quiz",
      error: error.message,
    });
  }
};

export const submitQuizAttempt = async (req, res) => {
  try {
    const { id: quizId } = req.params;
    const { answers, timeTaken } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    if (!quiz.isActive) {
      return res.status(403).json({ success: false, message: "Quiz is not active" });
    }

    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({
        success: false,
        message: "Answers must be provided for all questions",
      });
    }

    let score = 0;
    const processedAnswers = [];

    quiz.questions.forEach((q, index) => {
      const userAnswer = answers.find((a) => a.questionIndex === index);
      if (!userAnswer) {
        throw new Error(`Answer missing for question ${index}`);
      }

      const isCorrect = userAnswer.selectedOption === q.correctOption;
      if (isCorrect) {
        score += q.marks || 1;
      }

      processedAnswers.push({
        questionIndex: index,
        selectedOption: userAnswer.selectedOption,
        isCorrect,
      });
    });

    const totalMarks = quiz.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
    const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
    const passed = percentage >= quiz.passingScore;

    const attempt = new QuizAttempt({
      student: req.user?._id , 
      quiz: quizId,
      score,
      totalMarks,
      percentage,
      passed,
      answers: processedAnswers,
      timeTaken: timeTaken || 0,
    });

    await attempt.save();

    return res.status(201).json({
      success: true,
      message: "Quiz attempt submitted successfully",
      data: {
        score,
        totalMarks,
        percentage,
        passed,
        attemptId: attempt._id,
      },
    });
  } catch (error) {
    console.error("Submit quiz attempt error:", error);
    return res.status(500).json({
      success: false,
      message: "Error submitting quiz attempt",
      error: error.message,
    });
  }
};