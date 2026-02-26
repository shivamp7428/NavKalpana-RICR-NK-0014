import mongoose from "mongoose";
import Note from "../models/Notes.js";
import Module from "../models/Module.js";

// Create 
export const createNote = async (req, res) => {
  try {
    const { title, content, moduleId } = req.body;
    if (!title || !content || !moduleId)
      return res.status(400).json({ success: false, message: "Title, content and moduleId are required" });

    if (!mongoose.Types.ObjectId.isValid(moduleId))
      return res.status(400).json({ success: false, message: "Invalid moduleId" });

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ success: false, message: "Module not found" });

    const note = await Note.create({ title, content, moduleId });

    module.notes.push(note._id);
    await module.save();

    res.status(201).json({ success: true, message: "Note created", data: note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating note", error: err.message });
  }
};

// Get all notes for a specific module
export const getNotesByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(moduleId))
      return res.status(400).json({ success: false, message: "Invalid moduleId" });

    const notes = await Note.find({ moduleId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching notes", error: err.message });
  }
};

// Get single note by ID
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid note ID" });

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    res.status(200).json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching note", error: err.message });
  }
};

// Update note
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid note ID" });

    const note = await Note.findByIdAndUpdate(id, { title, content }, { new: true, runValidators: true });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    res.status(200).json({ success: true, message: "Note updated", data: note });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating note", error: err.message });
  }
};

// Delete note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid note ID" });

    const note = await Note.findByIdAndDelete(id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    await Module.updateOne({ notes: id }, { $pull: { notes: id } });

    res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting note", error: err.message });
  }
};

export const getNotesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid course ID" });
    }

    let modules = await Module.find({ course: courseId }).select("_id title").lean();

    if (modules.length === 0) {
      modules = await Module.find({ courseId: courseId }).select("_id title").lean();
    }

    if (modules.length === 0) {
      modules = await Module.find({ course_id: courseId }).select("_id title").lean();
    }

    console.log(`Found ${modules.length} modules for course ${courseId}`);

    if (modules.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No modules found for this course",
        count: 0,
        data: []
      });
    }

    const moduleIds = modules.map(m => m._id);

    const notes = await Note.find({ moduleId: { $in: moduleIds } })
      .sort({ title: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
      modulesCount: modules.length
    });

  } catch (err) {
    console.error("getNotesByCourse error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};