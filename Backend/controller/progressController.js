import mongoose from "mongoose";
import UserCourseProgress from "../models/UserCourseProgress.js";
import Course from "../models/Course.js";
import Module from '../models/Module.js'
import Lesson from '../models/Lesson.js'

export const getUserCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    let progress = await UserCourseProgress.findOne({
      userId,
      courseId,
    });

    if (!progress) {
      progress = await UserCourseProgress.create({
        userId,
        courseId,
        completedLessons: [],
      });
    }

    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching progress",
      error: error.message,
    });
  }
};


export const markLessonComplete = async (req, res) => {
  try {
    const { userId, courseId, lessonId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(courseId) ||
        !mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });

    const module = await Module.findById(lesson.moduleId);
    if (!module || module.courseId.toString() !== courseId) {
      return res.status(400).json({ success: false, message: "Lesson does not belong to this course" });
    }

    let progress = await UserCourseProgress.findOne({ userId, courseId });

    if (!progress) {
      progress = new UserCourseProgress({
        userId,
        courseId,
        completedLessons: [],          
        // attendedLessons: [],         // agar use kar rahe ho to rakh
        lastAccessedLesson: null,
      });
    }

    if (!progress.completedLessons.some(id => id.toString() === lessonId)) {
      progress.completedLessons.push(lessonId); 
    }

    progress.lastAccessedLesson = lessonId;

    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Lesson marked as completed",
      data: {
        ...progress.toObject(),
        completedLessons: progress.completedLessons.map(id => id.toString()), 
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error marking lesson complete",
      error: error.message,
    });
  }
};