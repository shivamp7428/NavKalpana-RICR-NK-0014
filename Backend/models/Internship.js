import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  company: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  deadline: {
    type: Date,
    required: true
  }

}, { timestamps: true });

export default mongoose.model("Internship", internshipSchema);