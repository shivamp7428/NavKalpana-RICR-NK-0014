import { useParams, useNavigate } from "react-router-dom"; 
import axios from "axios";
import { useEffect, useState } from "react";
import VideoPlayer from "../Component/VideoPlayer";
import { Menu, X, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";  

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate(); 

  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lessonDurations, setLessonDurations] = useState({});
  
  // State to track which modules are expanded
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
      const courseData = res.data.data;
      setCourse(courseData);

      if (courseData?.modules?.length > 0) {
        const firstModule = courseData.modules[0];
        if (firstModule?.lessons?.length > 0) {
          const firstLesson = firstModule.lessons[0];
          setSelectedLesson(firstLesson);
        }
      }
    } catch (error) {
      console.error("Course fetch error:", error);
    }
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleBack = () => {
    navigate(-1);       
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 md:w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 
          transform transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col overflow-hidden`}
      >
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center">
              <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                Nav
              </span>
              <span className="text-gray-900 dark:text-white">Kalpana</span>
            </h1>

            <button
              onClick={handleBack}
              className="group cursor-pointer px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Go back"
            >
              <div className="flex items-center gap-1.5">
                <ArrowLeft size={18} className="transition-transform duration-200 group-hover:-translate-x-1" />
                <span className="hidden sm:inline transition-opacity duration-200 group-hover:opacity-100 opacity-90">Back</span>
              </div>
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
                  {isExpanded ? (
                    <ChevronUp size={18} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-500" />
                  )}
                </button>

                {isExpanded && (
                  <div className="bg-white dark:bg-gray-900 px-2 py-2 space-y-1 transition-all duration-300">
                    {module.lessons?.map((lesson) => (
                      <button
                        key={lesson._id}
                        onClick={() => handleLessonClick(lesson)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          selectedLesson?._id === lesson._id
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                        }`}
                      >
                        <span className="truncate flex-1">{lesson.title}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-3 whitespace-nowrap">
                          {lessonDurations[lesson._id] || "..."}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className={`md:ml-72 lg:ml-80 flex flex-col min-h-screen transition-all duration-300`}>
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm p-4 flex items-center gap-4">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
          )}

          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
            {selectedLesson?.title || "Select a lesson"}
          </h1>
        </div>

        <div className="flex-1 bg-black relative">
          {selectedLesson ? (
            <div className="absolute inset-0">
              <VideoPlayer
                topic={selectedLesson.title}
                lessonId={selectedLesson._id}
                onDurationFetched={(duration) => {
                  setLessonDurations((prev) => ({
                    ...prev,
                    [selectedLesson._id]: formatDuration(duration),
                  }));
                }}
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