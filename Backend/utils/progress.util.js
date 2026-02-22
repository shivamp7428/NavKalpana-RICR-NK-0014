import Course from "../models/Course.js";

export const calculateStats = async (courseId, progressDoc) => {
  const course = await Course.findById(courseId).populate({
    path: "modules",
    populate: { path: "lessons" },
  });

  let totalLessons = 0;

  course.modules.forEach(module => {
    totalLessons += module.lessons.length;
  });

  if (totalLessons === 0) {
    return {
      totalLessons: 0,
      progressPercentage: 0,
      attendancePercentage: 0
    };
  }

  return {
    totalLessons,
    progressPercentage: Math.round(
      (progressDoc.completedLessons.length / totalLessons) * 100
    ),
    attendancePercentage: Math.round(
      (progressDoc.attendedLessons.length / totalLessons) * 100
    )
  };
};