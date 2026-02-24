import Module from "../models/Module.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";

export const createModule = async (req, res) => {
  try {
    const { title, courseId } = req.body;

    if (!title || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Title and Course ID are required",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const module = await Module.create({
      title,
      courseId,
    });

    course.modules.push(module._id);
    await course.save();

    res.status(201).json({
      success: true,
      message: "Module created successfully",
      data: module,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating module",
      error: error.message,
    });
  }
};

export const getModules = async (req, res) => {
  try {
    const modules = await Module.find()
      .populate({
        path: "notes",
        select: "title content",
        options: { sort: { createdAt: -1 } },
      })
      .populate("lessons") 
      .populate({
        path: "quizes",
        select: "title questions timeLimit passingScore",
        options: { sort: { createdAt: -1 } },
      })
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: modules,
    });
  } catch (error) {
    console.error("Module fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching modules with notes and quizzes",
    });
  }
};