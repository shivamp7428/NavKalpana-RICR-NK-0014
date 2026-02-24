import Internship from "../models/Internship.js";

export const createInternship = async (req, res) => {
  try {
    const { title, company, description, deadline } = req.body;

    if (!title || !company || !description || !deadline) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const internship = await Internship.create({
      title,
      company,
      description,
      deadline
    });

    res.status(201).json({
      success: true,
      message: "Internship created successfully",
      internship
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getAllInternships = async (req, res) => {
  try {

    const internships = await Internship.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: internships.length,
      internships
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getInternshipById = async (req, res) => {
  try {

    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found"
      });
    }

    res.status(200).json({
      success: true,
      internship
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateInternship = async (req, res) => {
  try {

    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Internship updated successfully",
      internship
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const deleteInternship = async (req, res) => {
  try {

    const internship = await Internship.findByIdAndDelete(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Internship deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};