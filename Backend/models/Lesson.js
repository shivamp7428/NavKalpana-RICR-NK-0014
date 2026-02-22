import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    videoProvider: {
      type: String,
      default: "dailymotion",
    },

    videoId: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },

    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Lesson", lessonSchema);