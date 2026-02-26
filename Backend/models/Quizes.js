import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question text is required"],
    trim: true,
  },
  options: {
    type: [String],
    required: [true, "At least 2 options are required"],
    validate: {
      validator: function (val) {
        return val.length >= 2 && val.length <= 6;
      },
      message: "Options must be between 2 and 6",
    },
  },
  correctOption: {
    type: Number,
    required: [true, "Correct option index is required"],
    min: 0,
  },
  explanation: {
    type: String,
    trim: true,
    default: "",
  },
  marks: {
    type: Number,
    default: 1,
    min: 0,
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
      maxlength: [150, "Title cannot be more than 150 characters"],
    },
    questions: {
      type: [questionSchema],
      required: [true, "At least one question is required"],
      validate: {
        validator: function (val) {
          return val.length >= 1;
        },
        message: "Quiz must have at least 1 question",
      },
    },
    timeLimit: {
      type: Number,
      default: 600,
      min: 60,
    },
    passingScore: {
      type: Number,
      default: 60,
      min: 0,
      max: 100,
    },
    maxAttempts: {
      type: Number,
      default: 3,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalMarks: {
      type: Number,
      default: function () {
        return this.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for active quizzes
quizSchema.index({ isActive: 1 });

// Pre-save hook for correctOption validation
quizSchema.pre("save", async function () {
  for (const q of this.questions) {
    if (q.correctOption >= q.options.length) {
      throw new Error(
        `Correct option index ${q.correctOption} is invalid for question: "${q.question}"`
      );
    }
  }
});

export default mongoose.model("Quiz", quizSchema);