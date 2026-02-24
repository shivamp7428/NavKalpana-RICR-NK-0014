import Course from "../models/Course.js";
import Module from "../models/Module.js";
import Lesson from "../models/Lesson.js";
import Assignment from "../models/Assignment.js";

export const createCourse = async (req, res) => {
  try {
    const { title, instructorName, thumbnail } = req.body;

    if (!title || !instructorName) {
      return res.status(400).json({
        success: false,
        message: "Title and Instructor Name are required",
      });
    }

    const course = await Course.create({
      title,
      instructorName,
      thumbnail,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating course",
      error: error.message,
    });
  }
};


export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
    .populate('assignments')  
    .populate({
    path: "modules",
    populate: {
     path: "lessons",
   },
  });

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
};


export const getSingleCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate('assignments')                    
      .populate({
        path: 'modules',
        populate: {
          path: 'lessons'                        
        }
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching course",
      error: error.message,
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "No data provided",
      });
    }

    const course = await Course.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating course",
      error: error.message,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id).populate("modules");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    for (let module of course.modules) {
      await Lesson.deleteMany({ _id: { $in: module.lessons } });
      await Module.findByIdAndDelete(module._id);
    }

    await Course.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Course and related data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error.message,
    });
  }
};