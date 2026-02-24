import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    notes: [
       {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Note"
     }
   ],
    quizes: [
       {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Quiz"
     }
   ]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Module", moduleSchema);