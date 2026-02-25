import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, Users, CheckCircle2 } from "lucide-react";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const firstLetter = course.title?.trim()?.charAt(0)?.toUpperCase() || "?";
  const thumbnailUrl = course.thumbnail || course.image || null;
  const hasImage = !!thumbnailUrl;

  const progress = course.progress ?? 0;
  const completedCount = course.completedCount ?? 0;
  const totalLessons = course.totalLessons ?? 0;
  const showProgress = totalLessons > 0;

  const isCompleted = showProgress && progress === 100;

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 
                 overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer"
      onClick={() => navigate(`/course/${course._id}`)}
    >
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-6xl sm:text-7xl select-none overflow-hidden">
        {firstLetter}
        {hasImage && (
          <img
            src={thumbnailUrl}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            onError={(e) => (e.target.style.display = "none")}
          />
        )}

        {/* Completed badge - appears in top-right corner */}
        {isCompleted && (
          <div className="absolute top-3 right-3 z-20 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
            <CheckCircle2 size={14} />
            COMPLETED
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
          {course.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-1">
          {course.instructorName || "Unknown Instructor"}
        </p>

        <div className="flex items-center gap-5 text-sm text-gray-500 dark:text-gray-400 mb-5">
          {course.duration && (
            <div className="flex items-center gap-1.5">
              <Clock size={16} />
              <span>{course.duration}</span>
            </div>
          )}
          {course.students && (
            <div className="flex items-center gap-1.5">
              <Users size={16} />
              <span>{course.students} students</span>
            </div>
          )}
        </div>

        {showProgress && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                {isCompleted ? "Status" : "Progress"}
              </span>
              <span
                className={`font-bold ${
                  isCompleted
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              >
                {isCompleted ? "Completed" : `${progress}%`}
              </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isCompleted
                    ? "bg-emerald-500"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 text-center">
              {isCompleted
                ? "Course fully completed"
                : `${completedCount} of ${totalLessons} lessons completed`}
            </div>
          </div>
        )}

        <button
          className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 
                     text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
        >
          <BookOpen size={18} />
          View Course
        </button>
      </div>
    </div>
  );
};

export default CourseCard;