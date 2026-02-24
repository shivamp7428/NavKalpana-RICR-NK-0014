import mongoose from "mongoose";
import Quiz from "../models/Quizes.js";
import Module from "../models/Module.js";

// Create a new Quiz
export const createQuiz = async (req, res) => {
  try {
    const { title, questions, timeLimit, passingScore, moduleId } = req.body;

    if (!title || !questions || !Array.isArray(questions) || !moduleId) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return res.status(400).json({ success: false, message: "Invalid moduleId" });
    }

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }

    const quiz = new Quiz({
      title,
      questions,
      timeLimit: timeLimit || 600,
      passingScore: passingScore || 60,
      moduleId,
    });

    await quiz.save();

    module.quizzes.push(quiz._id);
    await module.save();

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (error) {
    console.error("Create quiz error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating quiz",
      error: error.message,
    });
  }
};

// Get quizzes by module
export const getQuizzesByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return res.status(400).json({ success: false, message: "Invalid moduleId" });
    }

    const quizzes = await Quiz.find({ moduleId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching quizzes",
      error: error.message,
    });
  }
};

// Get single quiz
export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid quiz ID" });
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    return res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching quiz",
      error: error.message,
    });
  }
};

// Update quiz 
export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid quiz ID" });
    }

    const quiz = await Quiz.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      data: quiz,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating quiz",
      error: error.message,
    });
  }
};

// Delete quiz
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

    await Module.updateOne(
      { quizzes: id },
      { $pull: { quizzes: id } }
    );

    return res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting quiz",
      error: error.message,
    });
  }
};