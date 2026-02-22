import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, Users } from "lucide-react";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const firstLetter = course.title?.trim()?.charAt(0)?.toUpperCase() || "?";

  const thumbnailUrl = course.thumbnail || course.image || null;
  const hasImage = !!thumbnailUrl;

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 
                 overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-gray-300 dark:hover:border-gray-600"
    >
      <div className="relative h-48 bg-gray-100 bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-gray-400 dark:text-gray-500 font-semibold text-6xl sm:text-7xl select-none">
        {firstLetter}
      </div>

      {hasImage && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <img
            src={thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-opacity duration-500" />
        </div>
      )}

      {course.level && (
        <span className="absolute top-3 right-3 z-10 bg-gray-800/80 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
          {course.level}
        </span>
      )}

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
          {course.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-1">
          {course.instructorName || "Unknown Instructor"}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-5">
          {course.duration && (
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-gray-500" />
              <span>{course.duration}</span>
            </div>
          )}
          {course.students && (
            <div className="flex items-center gap-1.5">
              <Users size={16} className="text-gray-500" />
              <span>{course.students} students</span>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate(`/course/${course._id}`)}
          className="w-full py-3 cursor-pointer px-4 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 
                     text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <BookOpen size={18} />
          View Course
        </button>
      </div>
    </div>
  );
};

export default CourseCard;