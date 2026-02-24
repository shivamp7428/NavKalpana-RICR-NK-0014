import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Award,
  Clock,
  MessageCircleQuestion,
  Briefcase,
  Users,
  LogOut,
  Menu,
  X,
  CheckCircle,
  AlertCircle,
  BarChart2,
  PlayCircle,
} from "lucide-react";
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-hot-toast';

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [overallPercentage, setOverallPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const studentId = user?._id;

  useEffect(() => {
    if (!studentId) {
      navigate("/", { replace: true });
      return;
    }

    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const coursesRes = await axios.get("http://localhost:5000/api/courses");
        const courses = coursesRes.data.data || coursesRes.data || [];

        let totalAllLessons = 0;
        let totalAllCompleted = 0;

        const attendancePromises = courses.map(async (course) => {
          try {
            let totalLessons = 0;
            if (course.modules && Array.isArray(course.modules)) {
              course.modules.forEach((mod) => {
                if (mod.lessons && Array.isArray(mod.lessons)) {
                  totalLessons += mod.lessons.length;
                }
              });
            }

            totalAllLessons += totalLessons;

            const progressRes = await axios.post("http://localhost:5000/api/progress/", {
              userId: studentId,
              courseId: course._id,
            });

            const completedLessons = progressRes.data.data?.completedLessons || [];
            const completedCount = completedLessons.length;

            totalAllCompleted += completedCount;

            const percentage = totalLessons > 0 ? ((completedCount / totalLessons) * 100).toFixed(1) : 0;

            const allLessons = [];
            course.modules?.forEach((mod) => {
              mod.lessons?.forEach((lesson) => {
                allLessons.push({
                  lessonId: lesson._id,
                  title: lesson.title,
                  completed: completedLessons.includes(lesson._id) || completedLessons.includes(String(lesson._id)),
                });
              });
            });

            return {
              courseId: course._id,
              courseName: course.title || "Unnamed Course",
              totalLessons,
              watchedLectures: completedCount,
              percentage: parseFloat(percentage),
              history: allLessons,
              monthly: [],
            };
          } catch (err) {
            console.error(`Error for course ${course._id}:`, err);
            return {
              courseId: course._id,
              courseName: course.title || "Error Course",
              totalLessons: 0,
              watchedLectures: 0,
              percentage: 0,
              history: [],
              monthly: [],
            };
          }
        });

        const data = await Promise.all(attendancePromises);
        const filteredData = data.filter(Boolean);
        setAttendanceData(filteredData);

        // Overall percentage calculation
        const overall = totalAllLessons > 0 
          ? ((totalAllCompleted / totalAllLessons) * 100).toFixed(1) 
          : 0;
        setOverallPercentage(parseFloat(overall));

      } catch (err) {
        console.error("Failed to load attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [studentId, navigate]);

  const handleLogout = () => {
    logout();
    toast.success("Logout Successfully");
    navigate("/", { replace: true });
  };

  const toggleExpand = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 
          border-r border-gray-200 dark:border-gray-800 
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
        `}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h1 className="text-3xl flex items-center font-black tracking-tighter">
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">Nav</span>
            <span className="text-gray-900 dark:text-white">Kalpana</span>
          </h1>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto">
          {[
            { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
            { name: "My Courses", icon: BookOpen, href: "/courses" },
            { name: "Assignments", icon: CalendarDays, href: "/assignments" },
            { name: "Attendance", icon: Clock, href: "/attendance", active: true },
            { name: "Quizzes", icon: Award, href: "/quizzes" },
            { name: "Doubts & Support", icon: MessageCircleQuestion, href: "/support" },
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
            className="flex cursor-pointer w-full items-center px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors group"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm transition-colors"
            >
              <Menu size={24} />
            </button>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                My Attendance
              </h1>
              <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Progress based on completed lessons
              </p>
            </div>
          </div>

          {/* Overall Attendance Card */}
          {!loading && attendanceData.length > 0 && (
            <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-xl font-semibold opacity-90">Overall Attendance</h2>
                  <p className="text-sm opacity-80 mt-1">Across all enrolled courses</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black">
                    {overallPercentage}%
                  </div>
                  <div className={`text-lg font-medium mt-2 ${
                    overallPercentage >= 75 ? "text-green-200" :
                    overallPercentage >= 50 ? "text-yellow-200" :
                    "text-red-200"
                  }`}>
                    {overallPercentage >= 75 ? "Excellent" : overallPercentage >= 50 ? "Good" : "Needs Improvement"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl shadow border h-64 animate-pulse" />
              ))}
            </div>
          ) : attendanceData.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              <p className="text-xl">No courses or progress data available.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {attendanceData.map((course) => (
                <div
                  key={course.courseId}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow border overflow-hidden"
                >
                  <div
                    className="p-6 cursor-pointer flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                    onClick={() => toggleExpand(course.courseId)}
                  >
                    <div>
                      <h2 className="text-xl font-semibold">{course.courseName}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {course.watchedLectures} / {course.totalLessons} lessons completed
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{course.percentage}%</div>
                      <div
                        className={`text-sm font-medium ${
                          course.percentage >= 75 ? "text-green-600 dark:text-green-400" :
                          course.percentage >= 50 ? "text-yellow-600 dark:text-yellow-400" :
                          "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {course.percentage >= 75 ? "Strong" : course.percentage >= 50 ? "Average" : "Needs Work"}
                      </div>
                    </div>
                  </div>

                  {expandedCourse === course.courseId && (
                    <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="mt-6">
                        <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                          <PlayCircle size={20} /> Lesson Status
                        </h3>
                        <div className="max-h-96 overflow-y-auto border rounded-lg">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
                              <tr>
                                <th className="p-3 text-left">Lesson</th>
                                <th className="p-3 text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {course.history.map((item, idx) => (
                                <tr key={idx} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                  <td className="p-3">{item.title}</td>
                                  <td className="p-3 text-center">
                                    {item.completed ? (
                                      <CheckCircle className="inline text-green-500" size={20} />
                                    ) : (
                                      <AlertCircle className="inline text-gray-400" size={20} />
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {course.monthly.length > 0 && (
                        <div className="mt-8">
                          <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                            <BarChart2 size={20} /> Monthly Progress
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {course.monthly.map((m, i) => (
                              <div key={i} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                                <p className="text-sm text-gray-500">{m.month}</p>
                                <p className="text-xl font-bold">{m.percentage}%</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AttendancePage;