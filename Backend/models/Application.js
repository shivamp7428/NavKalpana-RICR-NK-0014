import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({

  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Internship",
    required: true
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  resume: {
    type: String,
    required: true
  },

  coverLetter: {
    type: String,
    trim: true
  },

  status: {
    type: String,
    enum: ["Applied", "Shortlisted", "Rejected"],
    default: "Applied"
  }

}, { timestamps: true });

applicationSchema.index(
  { internshipId: 1, studentId: 1 },
  { unique: true }
);

export default mongoose.model("Application", applicationSchema);