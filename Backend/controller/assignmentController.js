import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/assignSub.js';
import CourseModel from '../models/Course.js'
import upload from '../middleware/multerCloudinary.js';

export const getAssignments = async (req, res) => {
  try {
    const { courseId } = req.query;
    let query = {};

    if (courseId) query.courseId = courseId;

    const assignments = await Assignment.find(query)
      .populate("courseId", "title") 
      .sort({ deadline: 1 })
      .lean();

    res.status(200).json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching assignments",
    });
  }
};

export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).lean();

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const { title, description, deadline, courseId, totalMarks } = req.body;

    if (!title || !description || !deadline) {
      return res.status(400).json({ message: 'Title, description and deadline required'  });
    }

    const course = await CourseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({  message: "Course ID does not exist" });
    }

    const assignment = await Assignment.create({
      title,description,deadline,courseId,totalMarks: totalMarks || 100,
    });

    course.assignments.push(assignment._id);
    await course.save();

   return res.status(201).json(assignment);

  } catch (error) {
    return res.status(500).json({ message: 'Error creating assignment',error: error.message});
  }
};

//Submission

export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, textAnswer, link, studentId } = req.body;
    const file = req.file;

    if (!assignmentId || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'assignmentId and studentId are required',
      });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    if (new Date() > new Date(assignment.deadline)) {
      return res.status(400).json({
        success: false,
        message: 'Deadline has passed. Submission not allowed.',
      });
    }

    const existingSubmission = await AssignmentSubmission.findOne({
      assignmentId,
      studentId,
    });
    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'Assignment already submitted',
      });
    }

    let fileUrl = null;
    if (file && file.secure_url) {
      fileUrl = file.secure_url;
    }

    const submission = await AssignmentSubmission.create({
      assignmentId,
      studentId,
      textAnswer: textAnswer?.trim() || undefined,
      link: link?.trim() || undefined,
      fileUrl,
      status: 'Submitted',
      isLate: false,
      submittedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully',
      submission,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to submit assignment',
      error: error.message,
    });
  }
};

export const getSubmissions = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.query;

    let query = {};

    if (assignmentId) {
      query.assignmentId = assignmentId;
    }

    if (studentId) {
      query.studentId = studentId;
    }

    const submissions = await AssignmentSubmission.find(query)
      .populate("assignmentId", "title deadline")
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(submissions);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching submissions" });
  }
};