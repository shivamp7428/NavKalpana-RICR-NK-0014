import Lesson from "../models/Lesson.js";
import Module from "../models/Module.js";
import Course from "../models/Course.js";

export const createLesson = async (req, res) => {
  try {
    const { title, difficulty, videoProvider, videoId, notes, moduleId } =
      req.body;

    if (!title || !videoId || !moduleId) {
      return res.status(400).json({
        success: false,
        message: "Title, Video ID and Module ID are required",
      });
    }

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const lesson = await Lesson.create({
      title,
      difficulty,
      videoProvider,
      videoId,
      notes,
      moduleId,
    });

    module.lessons.push(lesson._id);
    await module.save();

    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      data: lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating lesson",
      error: error.message,
    });
  }
};