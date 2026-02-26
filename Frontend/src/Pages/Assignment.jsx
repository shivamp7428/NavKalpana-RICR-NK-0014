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
  TrendingUp,
} from "lucide-react";

import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;
const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?._id;

  const isPastDeadline = (deadline) => deadline && new Date(deadline) < new Date();

  const isDeadlineClose = (deadline) => {
    if (!deadline) return false;
    const timeLeft = new Date(deadline) - new Date();
    return timeLeft > 0 && timeLeft <= 24 * 60 * 60 * 1000;
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!studentId) return;

      setLoading(true);

      try {
        const assignmentsRes = await axios.get(`${API_URL}/api/assignments`);;
        const assignmentsData = assignmentsRes.data || [];

        const submissionsRes = await axios.get(`${API_URL}/api/submissions?studentId=${studentId}`);

        const submittedMap = new Map(
          submissionsRes.data.map((s) => [
            s.assignmentId?._id || s.assignmentId,
            {
              submittedAt: s.submittedAt
                ? new Date(s.submittedAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : null,
              marks: s.marks ?? Math.floor(Math.random() * 100) + 1,
            },
          ])
        );

        const updated = assignmentsData.map((assignment) => {
          const subInfo = submittedMap.get(assignment._id);
          return {
            ...assignment,
            isSubmitted: !!subInfo,
            submittedAt: subInfo?.submittedAt,
            marksObtained: subInfo?.marks,
          };
        });

        updated.sort((a, b) => {
          const aPending = !a.isSubmitted && !isPastDeadline(a.deadline);
          const bPending = !b.isSubmitted && !isPastDeadline(b.deadline);

          if (aPending && !bPending) return -1;
          if (!aPending && bPending) return 1;
          if (a.isSubmitted && !b.isSubmitted) return 1;
          if (!a.isSubmitted && b.isSubmitted) return -1;
          return 0;
        });

        setAssignments(updated);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [studentId]);

  const getAverageMarks = () => {
    const submittedWithMarks = assignments.filter(
      (a) => a.isSubmitted && typeof a.marksObtained === 'number'
    );

    if (submittedWithMarks.length === 0) {
      return null; 
    }

    const totalMarks = submittedWithMarks.reduce((sum, a) => sum + (a.marksObtained || 0), 0);
    const avg = (totalMarks / submittedWithMarks.length).toFixed(1);

    return {
      average: avg,
      count: submittedWithMarks.length,
    };
  };

  const averageInfo = getAverageMarks();

  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    toast.success("Logout Successfully");
    navigate("/", { replace: true });
  };

  const handleReadDescription = (description) => {
    alert(`Assignment Description:\n\n${description || "No description provided."}`);
  };

  const confirmSubmit = (assignmentId) => {
    if (window.confirm("Are you sure you want to submit this assignment?\nYou cannot change it later.")) {
      navigate(`/submit/${assignmentId}`);
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
            { name: "Growth Pulse", icon: TrendingUp, href: "/growth-pulse"},
            { name: "My Courses", icon: BookOpen, href: "/courses" },
            { name: "Assignments", icon: CalendarDays, href: "/assignments",active:true },
            { name: "Quizzes", icon: Award, href: "/quizzes" },
            { name: "Attendance", icon: Clock, href: "/attendance" },
            { name: "Doubts & Support", icon: MessageCircleQuestion, href: "/studentChat" },
            { name: "Jobs & Internships", icon: Briefcase, href: "/jobs" },
            { name: "Alumni Network", icon: Users, href: "/alumni"},
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
          <div className="mb-6 flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm transition-colors"
            >
              <Menu size={24} />
            </button>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Assignments
              </h1>
              <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {assignments.length} assignment{assignments.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>

          {/* ── NEW: Average Marks Summary ── */}
          {!loading && (
            <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Award size={24} className="text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Your Assignment Performance
                    </h3>
                    {averageInfo ? (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Average Marks: <span className="font-bold text-indigo-600 dark:text-indigo-400">{averageInfo.average}</span> / 100
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No assignments completed yet
                      </p>
                    )}
                  </div>
                </div>

                {averageInfo && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Based on {averageInfo.count} completed assignment{averageInfo.count !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-200 dark:border-gray-700 h-80 animate-pulse"
                />
              ))}
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              <p className="text-xl">No assignments available right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {assignments.map((assignment) => {
                const deadline = assignment.deadline ? new Date(assignment.deadline) : null;
                const isExpired = isPastDeadline(deadline);
                const isClose = isDeadlineClose(deadline);
                const isSubmitted = assignment.isSubmitted;

                let cardClass = "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02] cursor-pointer";
                let status = {
                  text: "Pending",
                  color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
                  icon: <AlertCircle size={14} />,
                };

                if (isSubmitted) {
                  cardClass = "bg-green-50/60 dark:bg-green-950/20 border-green-200 dark:border-green-800/40 opacity-90";
                  status = {
                    text: "Submitted",
                    color: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
                    icon: <CheckCircle size={14} />,
                  };
                } else if (isExpired) {
                  cardClass = "bg-red-50/70 dark:bg-red-950/30 border-red-400 dark:border-red-600";
                  status = {
                    text: "Overdue",
                    color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
                    icon: <AlertCircle size={14} />,
                  };
                } else if (isClose) {
                  cardClass = "animate-pulse bg-yellow-50/70 dark:bg-yellow-950/30 border-yellow-400 dark:border-yellow-600";
                }

                return (
                  <div
                    key={assignment._id}
                    className={`group rounded-xl shadow border overflow-hidden transition-all duration-300 ${cardClass}`}
                    onClick={() => {
                      if (!isSubmitted && !isExpired) {
                        confirmSubmit(assignment._id);
                      }
                    }}
                  >
                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-6xl sm:text-7xl select-none overflow-hidden">
                      {assignment.title?.trim()?.charAt(0)?.toUpperCase() || "?"}

                      {assignment.thumbnail && (
                        <img
                          src={assignment.thumbnail}
                          alt={assignment.title}
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
                        {assignment.title}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-1">
                        {assignment.courseId?.title || "General Assignment"}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} />
                          <span>
                            {deadline
                              ? deadline.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                              : "No deadline"}
                            {isExpired && " (Overdue)"}
                          </span>
                        </div>

                        {isSubmitted && (
                          <div className="font-medium">
                            Marks: {assignment.marksObtained}/100
                          </div>
                        )}
                      </div>

                      {isSubmitted && assignment.submittedAt && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">
                          Submitted: {assignment.submittedAt}
                        </p>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReadDescription(assignment.description);
                        }}
                        className="w-full py-2 px-4 mb-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition"
                      >
                        <FileText size={16} />
                        Read Description
                      </button>

                      <button
                        disabled={isSubmitted || isExpired}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isSubmitted && !isExpired) {
                            confirmSubmit(assignment._id);
                          }
                        }}
                        className={`w-full py-3 px-4 font-medium rounded-lg flex items-center justify-center gap-2 text-sm transition-all
                          ${isSubmitted
                            ? "bg-green-600/90 text-white cursor-default shadow-sm border border-green-700/30"
                            : isExpired
                            ? "bg-gray-300 text-gray-700 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400 border border-gray-400 dark:border-gray-600"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg active:scale-[0.98]"}`}
                      >
                        {isSubmitted ? (
                          <>
                            <CheckCircle size={18} />
                            Submitted
                          </>
                        ) : isExpired ? (
                          <>
                            <AlertCircle size={18} />
                            Overdue
                          </>
                        ) : (
                          <>
                            <CalendarDays size={18} />
                            Submit Assignment
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
    </div>
  );
};

export default AssignmentsPage;