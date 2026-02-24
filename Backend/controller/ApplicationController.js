import Application from "../models/Application.js";
import Internship from "../models/Internship.js";

export const applyInternship = async (req, res) => {
  try {
    const { internshipId, studentId, coverLetter } = req.body;

    if (!studentId || !internshipId) {
      return res.status(400).json({
        success: false,
        message: "studentId and internshipId are required"
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume is required" });
    }

    const application = await Application.create({
      studentId,          
      internshipId,       
      resume: req.file.path,
      coverLetter,
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

export const getMyApplications = async (req, res) => {
  try {

    const studentId = req.user.id;

    const applications = await Application.find({ studentId })
      .populate("internshipId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getApplicationsByStudent = async (req, res) => {
  try {

    const { studentId } = req.params;

    const applications = await Application.find({ studentId })
      .populate("internshipId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};