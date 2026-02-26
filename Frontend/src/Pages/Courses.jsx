import { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "../Component/CourseCard";
import {
  LayoutDashboard, BookOpen, CalendarDays, Award, Clock,
  MessageCircleQuestion, Briefcase, Users, LogOut, Menu, X,
  CheckCircle2,
  TrendingUp
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses");
        const coursesData = res.data.data || [];

        const updatedCourses = await Promise.all(
          coursesData.map(async (course) => {
            try {
              const progressRes = await axios.post(
                "http://localhost:5000/api/progress/",
                {
                  userId: user._id,
                  courseId: course._id,
                }
              );

              const completedList = progressRes.data.data?.completedLessons || [];
              const completed = completedList.length;

              let total = 0;
              if (course.modules && Array.isArray(course.modules)) {
                for (const module of course.modules) {
                  if (module.lessons && Array.isArray(module.lessons)) {
                    total += module.lessons.length;
                  }
                }
              }

              const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

              return {
                ...course,
                progress: percentage,
                completedCount: completed,
                totalLessons: total,
                isCompleted: percentage === 100,
              };
            } catch (err) {
              console.error("Progress fetch error for course", course._id, err);
              return {
                ...course,
                progress: 0,
                completedCount: 0,
                totalLessons: 0,
                isCompleted: false,
              };
            }
          })
        );

        setCourses(updatedCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchCourses();
    } else {
      setLoading(false);
    }
  }, [user?._id]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
        `}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h1 className="text-3xl flex items-center font-black tracking-tighter">
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">Nav</span>
            <span className="text-gray-900 dark:text-white">Kalpana</span>
          </h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto">
          {[
            { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
            { name: "Growth Pulse", icon: TrendingUp, href: "/growth-pulse"},
            { name: "My Courses", icon: BookOpen, href: "/courses" , active:true },
            { name: "Assignments", icon: CalendarDays, href: "/assignments" },
            { name: "Quizzes", icon: Award, href: "/quizzes" },
            { name: "Attendance", icon: Clock, href: "/attendance" },
            { name: "Doubts & Support", icon: MessageCircleQuestion, href: "/studentChat" },
            { name: "Jobs & Internships", icon: Briefcase, href: "/jobs" },
            { name: "Alumni Network", icon: Users, href: "/alumni" },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                item.active
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${item.active ? "text-blue-600 dark:text-blue-400" : ""}`} />
              {item.name}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors group"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-fit p-2 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800"
            >
              <Menu size={24} />
            </button>

            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Explore Our Courses
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {courses.length > 0
                  ? `You have access to ${courses.length} course${courses.length > 1 ? 's' : ''}`
                  : "Loading your courses..."}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 h-80 animate-pulse"
                />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              <p className="text-xl">No courses available right now.</p>
              <p className="mt-2">Check back later or contact support.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  progress={course.progress}
                  isCompleted={course.isCompleted}
                  totalLessons={course.totalLessons}
                  completedCount={course.completedCount}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Courses;