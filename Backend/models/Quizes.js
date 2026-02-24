import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correctOption: { type: Number, required: true }, 
  explanation: { type: String },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    questions: [questionSchema],
    timeLimit: { type: Number, default: 600 }, 
    passingScore: { type: Number, default: 60 }, 
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);