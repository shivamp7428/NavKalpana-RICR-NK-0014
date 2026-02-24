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
  FileText,
} from "lucide-react";
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-hot-toast';

const Internship = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState(null);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?._id;

  const isExpired = (deadline) => deadline && new Date(deadline) < new Date();

  const isDeadlineClose = (deadline) => {
    if (!deadline) return false;
    const timeLeft = new Date(deadline) - new Date();
    return timeLeft > 0 && timeLeft <= 24 * 60 * 60 * 1000;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!studentId) {
        toast.error("Please login first");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // 1. Get all internships
        const internRes = await axios.get("http://localhost:5000/api/internships");
        const internshipsData = internRes.data.internships || [];

        // 2. Get student's applications
        const appRes = await axios.get(
          `http://localhost:5000/api/applications/student/${studentId}`
        );
        const applications = appRes.data.applications || [];

        // Map: internshipId → application info
        const appliedMap = new Map(
          applications.map((app) => [
            app.internshipId?._id || app.internshipId,
            {
              appliedAt: app.createdAt
                ? new Date(app.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : null,
              status: app.status || "Applied",
            },
          ])
        );

        // Enrich internships
        const updated = internshipsData.map((intern) => {
          const appInfo = appliedMap.get(intern._id);
          return {
            ...intern,
            isApplied: !!appInfo,
            appliedAt: appInfo?.appliedAt,
            applicationStatus: appInfo?.status,
          };
        });

        // Sort: Non-applied first (newest → oldest), then Applied (newest → oldest)
        updated.sort((a, b) => {
          // Non-applied should come before applied
          if (!a.isApplied && b.isApplied) return -1;
          if (a.isApplied && !b.isApplied) return 1;

          // Within the same group → newest first
          const dateA = new Date(a.createdAt || a._id?.toString().substring(0, 8) || 0);
          const dateB = new Date(b.createdAt || b._id?.toString().substring(0, 8) || 0);
          return dateB - dateA;
        });

        setInternships(updated);
      } catch (err) {
        console.error("Fetch error:", err);
        if (err.response) {
          console.log("Status:", err.response.status, "Data:", err.response.data);
        }
        toast.error("Failed to load internships");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  const handleLogout = () => {
    logout();
    toast.success("Logout Successfully");
    navigate("/", { replace: true });
  };

  const handleReadDescription = (desc) => {
    setSelectedDescription(desc || "No description provided.");
  };

  const confirmApply = (internshipId) => {
    if (window.confirm("Are you sure you want to apply for this internship?")) {
      navigate(`/apply/${internshipId}`);
    }
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
            { name: "My Courses", icon: BookOpen, href: "/courses" },
            { name: "Assignments", icon: CalendarDays, href: "/assignments" },
            { name: "Quizzes", icon: Award, href: "/quizzes" },
            { name: "Attendance", icon: Clock, href: "/attendance" },
            { name: "Doubts & Support", icon: MessageCircleQuestion, href: "/studentChat" },
            { name: "Jobs & Internships", icon: Briefcase, href: "/jobs", active: true },
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
                Internship Opportunities
              </h1>
              <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {internships.length} internship{internships.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-200 dark:border-gray-700 h-80 animate-pulse"
                />
              ))}
            </div>
          ) : internships.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              <p className="text-xl">No internships available right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {internships.map((intern) => {
                const deadline = intern.deadline ? new Date(intern.deadline) : null;
                const expired = isExpired(deadline);
                const close = isDeadlineClose(deadline);
                const applied = intern.isApplied;

                let cardClass = "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02] cursor-pointer";
                let status = {
                  text: "Open",
                  color: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
                  icon: <CheckCircle size={14} />,
                };

                if (applied) {
                  cardClass = "bg-green-50/60 dark:bg-green-950/20 border-green-200 dark:border-green-800/40 opacity-90";
                  status = {
                    text: "Applied",
                    color: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
                    icon: <CheckCircle size={14} />,
                  };
                } else if (expired) {
                  cardClass = "bg-red-50/70 dark:bg-red-950/30 border-red-400 dark:border-red-600";
                  status = {
                    text: "Closed",
                    color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
                    icon: <AlertCircle size={14} />,
                  };
                } else if (close) {
                  cardClass = "animate-pulse bg-yellow-50/70 dark:bg-yellow-950/30 border-yellow-400 dark:border-yellow-600";
                  status = {
                    text: "Closing Soon",
                    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
                    icon: <AlertCircle size={14} />,
                  };
                }

                return (
                  <div
                    key={intern._id}
                    className={`group rounded-xl shadow border overflow-hidden transition-all duration-300 ${cardClass}`}
                    onClick={() => {
                      if (!applied && !expired) confirmApply(intern._id);
                    }}
                  >
                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-6xl sm:text-7xl select-none overflow-hidden">
                      {intern.title?.trim()?.charAt(0)?.toUpperCase() || "?"}

                      {intern.companyLogo && (
                        <img
                          src={intern.companyLogo}
                          alt={intern.company}
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      )}

                      <span
                        className={`absolute top-3 right-3 z-10 ${status.color} text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 shadow-sm`}
                      >
                        {status.icon}
                        {status.text}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
                        {intern.title}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-1">
                        {intern.company || "Company Name"}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} />
                          <span>
                            {deadline
                              ? deadline.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                              : "No deadline"}
                            {expired && " (Closed)"}
                          </span>
                        </div>
                      </div>

                      {/* Applied date - similar to Submitted date in Assignments */}
                      {applied && intern.appliedAt && (
                        <p className="text-xs text-green-600 dark:text-green-400 mb-3 italic">
                          Applied on: {intern.appliedAt}
                        </p>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReadDescription(intern.description);
                        }}
                        className="w-full py-2 px-4 mb-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition"
                      >
                        <FileText size={16} />
                        Read Description
                      </button>

                      <button
                        disabled={applied || expired}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!applied && !expired) confirmApply(intern._id);
                        }}
                        className={`w-full py-3 px-4 font-medium rounded-lg flex items-center justify-center gap-2 text-sm transition-all
                          ${applied
                            ? "bg-green-600/90 text-white cursor-default shadow-sm border border-green-700/30"
                            : expired
                            ? "bg-gray-300 text-gray-700 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400 border border-gray-400 dark:border-gray-600"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg active:scale-[0.98]"}`}
                      >
                        {applied ? (
                          <>
                            <CheckCircle size={18} />
                            Applied
                          </>
                        ) : expired ? (
                          <>
                            <AlertCircle size={18} />
                            Closed
                          </>
                        ) : (
                          <>
                            <Briefcase size={18} />
                            Apply Now
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Description Modal */}
      {selectedDescription && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedDescription(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Internship Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-6 leading-relaxed">
              {selectedDescription}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedDescription(null)}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Internship;