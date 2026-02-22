import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import VideoPlayer from "../Component/VideoPlayer";
import { Menu, X, ArrowLeft, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useAuth } from "../Context/AuthContext";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lessonDurations, setLessonDurations] = useState({});
  const [completedLessons, setCompletedLessons] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});

  const [totalLessons, setTotalLessons] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    fetchCourseAndProgress();
  }, []);

  const fetchCourseAndProgress = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
      const courseData = res.data.data;
      setCourse(courseData);

      let total = 0;
      courseData?.modules?.forEach((module) => {
        if (module.lessons) total += module.lessons.length;
      });
      setTotalLessons(total);

      if (courseData?.modules?.length > 0) {
        const firstModule = courseData.modules[0];
        if (firstModule?.lessons?.length > 0) {
          setSelectedLesson(firstModule.lessons[0]);
        }
      }

      const progressRes = await axios.post("http://localhost:5000/api/progress/", {
        userId: user._id,
        courseId,
      });

      const completedList = progressRes.data.data.completedLessons || [];
      setCompletedLessons(completedList);
      setCompletedCount(completedList.length);

      if (total > 0) {
        const percent = Math.round((completedList.length / total) * 100);
        setProgressPercent(percent);
      }
    } catch (error) {
      console.error("Error fetching course or progress:", error);
    }
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const handleBack = () => navigate(-1);

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const formatDuration = (isoDuration) => {
    if (!isoDuration) return "??:??";
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return "??:??";
    const h = match[1] ? parseInt(match[1], 10) : 0;
    const m = match[2] ? parseInt(match[2], 10) : 0;
    const s = match[3] ? parseInt(match[3], 10) : 0;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleLessonComplete = async (lessonId) => {
    try {
      const res = await axios.post("http://localhost:5000/api/progress/complete", {
        userId: user._id,
        courseId,
        lessonId,
      });

      const updatedCompleted = res.data.data.completedLessons || [];
      setCompletedLessons(updatedCompleted);
      setCompletedCount(updatedCompleted.length);

      if (totalLessons > 0) {
        const percent = Math.round((updatedCompleted.length / totalLessons) * 100);
        setProgressPercent(percent);
      }
    } catch (err) {
      console.error("Error marking lesson complete:", err);
    }
  };

  const isLessonCompleted = (lessonId) => {
    return completedLessons.includes(String(lessonId));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 md:w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 
        transform transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col overflow-hidden`}
      >
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center">
              <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">Nav</span>
              <span className="text-gray-900 dark:text-white">Kalpana</span>
            </h1>

            <button
              onClick={handleBack}
              className="group flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Go back"
            >
              <ArrowLeft size={18} className="transition-transform duration-200 group-hover:-translate-x-1" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 truncate">
            {course?.title || "Course Content"}
          </h2>

          {totalLessons > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Course Progress</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 text-center">
                {completedCount} of {totalLessons} lessons completed
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {course?.modules?.map((module) => {
            const isExpanded = expandedModules[module._id] || false;
            return (
              <div key={module._id} className="rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleModule(module._id)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    {module.title}
                  </h3>
                  {isExpanded ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
                </button>

                {isExpanded && (
                  <div className="bg-white dark:bg-gray-900 px-2 py-2 space-y-1 transition-all duration-300">
                    {module.lessons?.map((lesson) => {
                      const isCompleted = isLessonCompleted(lesson._id);
                      return (
                        <div
                          key={lesson._id}
                          className={`flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${
                            isCompleted ? "bg-green-50/40 dark:bg-green-950/30" : ""
                          }`}
                          onClick={() => {
                            if (!isCompleted) {
                              handleLessonComplete(lesson._id);
                            }
                            handleLessonClick(lesson);
                          }}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                                isCompleted
                                  ? "bg-green-600 text-white border-green-600"
                                  : "border-2 border-gray-400 dark:border-gray-500 hover:border-gray-600 dark:hover:border-gray-400"
                              }`}
                            >
                              {isCompleted && <Check size={14} strokeWidth={3} />}
                            </div>

                            <span
                              className={`text-sm font-medium truncate ${
                                selectedLesson?._id === lesson._id
                                  ? "text-blue-700 dark:text-blue-400 font-semibold"
                                  : isCompleted
                                  ? "text-gray-900 dark:text-gray-100"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {lesson.title}
                            </span>
                          </div>

                          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-3">
                            {lessonDurations[lesson._id] || "..."}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={`md:ml-72 lg:ml-80 flex flex-col min-h-screen transition-all duration-300`}>
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm p-4 flex items-center gap-4">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <Menu size={24} />
            </button>
          )}
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
            {selectedLesson?.title || "Select a lesson to start"}
          </h1>
        </div>

        <div className="flex-1 bg-black relative">
          {selectedLesson ? (
            <div className="absolute inset-0">
              <VideoPlayer
                topic={selectedLesson.title}
                lessonId={selectedLesson._id}
                onDurationFetched={(duration) =>
                  setLessonDurations((prev) => ({
                    ...prev,
                    [selectedLesson._id]: formatDuration(duration),
                  }))
                }
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-lg px-6 text-center">
              Select any lesson from the left sidebar to start watching
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;