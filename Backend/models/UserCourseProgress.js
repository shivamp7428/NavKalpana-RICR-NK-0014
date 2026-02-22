import mongoose from "mongoose";

const userCourseProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },

 completedLessons: [{
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Lesson'
  }], 

  attendedLessons:[
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
  }
 ],
  lastAccessedLesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
  }
}, { timestamps: true });

userCourseProgressSchema.index(
  { userId: 1, courseId: 1 },
  { unique: true }
);

export default mongoose.model("UserCourseProgress" , userCourseProgressSchema)