import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LayoutDashboard, BookOpen, CalendarDays, Award, Clock,
  MessageCircleQuestion, Briefcase, Users, LogOut, Menu, X,
  Trophy, TrendingUp, AlertCircle, CheckCircle2, Zap,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-hot-toast";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const GrowthPulse = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const studentId = user?._id;

  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [ogiData, setOgiData] = useState({
    ogi: 0,
    growthClassification: "Loading...",
  });

  const [weeklyTrendData, setWeeklyTrendData] = useState([]);
  const [moduleCompletionData, setModuleCompletionData] = useState([]);

  useEffect(() => {
    if (!studentId) return;
    const fetchGrowthPulse = async () => {
      try {
       const res = await axios.get(
         `${API_URL}/api/student/${studentId}/performance-metrics`
        );
        setOgiData({
          ogi: res.data.ogi,
          growthClassification: res.data.growthClassification,
        });
        setWeeklyTrendData(res.data.weeklyTrend || []);
        setModuleCompletionData(res.data.moduleCompletion || []);
      } catch (err) {
        toast.error("Growth Pulse load nahi ho paya");
      } finally {
        setLoading(false);
      }
    };
    fetchGrowthPulse();
  }, [studentId]);

  const handleLogout = () => {
    logout();
    toast.success("Logout Successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-xl animate-pulse font-medium tracking-widest">
          LOADING GROWTH PULSE...
        </div>
      </div>
    );
  }

  const { ogi, growthClassification } = ogiData;

  const statusConfig = {
    Excellent: { color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", icon: CheckCircle2 },
    Improving: { color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: TrendingUp },
    Stable: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: TrendingUp },
    "Needs Attention": { color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: AlertCircle },
  };

  const config = statusConfig[growthClassification] || statusConfig["Needs Attention"];

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h1 className="text-3xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">Nav</span>Kalpana
          </h1>
          <X className="lg:hidden cursor-pointer" onClick={() => setIsSidebarOpen(false)} />
        </div>
        <nav className="mt-4 px-3 space-y-1">
          {[
            { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
            { name: "Growth Pulse", icon: TrendingUp, href: "/growth-pulse",active:true},
            { name: "My Courses", icon: BookOpen, href: "/courses" },
            { name: "Assignments", icon: CalendarDays, href: "/assignments" },
            { name: "Quizzes", icon: Award, href: "/quizzes" },
            { name: "Attendance", icon: Clock, href: "/attendance" },
            { name: "Doubts & Support", icon: MessageCircleQuestion, href: "/studentChat" },
            { name: "Jobs & Internships", icon: Briefcase, href: "/jobs" },
            { name: "Alumni Network", icon: Users, href: "/alumni" },
          ].map((item) => (
            <a key={item.name} href={item.href || "#"} className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm" 
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"}`}>
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 absolute bottom-0 w-full">
          <button onClick={handleLogout} className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 p-4 md:p-8">
        <button className="lg:hidden mb-6 p-2 rounded-lg bg-gray-900 border border-gray-800" onClick={() => setIsSidebarOpen(true)}>
          <Menu className="text-white" />
        </button>

        <header className="mb-10">
          <h1 className="text-4xl font-bold flex items-center text-white gap-4">
            <Trophy className="text-yellow-500 animate-pulse" size={40} />
            Growth Pulse
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Your synchronized academic growth — updated in real-time.
          </p>
        </header>

        <div className={`rounded-[2.5rem] border ${config.bg} p-10 text-center mb-10 backdrop-blur-md shadow-2xl relative overflow-hidden group`}>
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50" />
          <div className={`text-9xl font-black transition-transform duration-500 group-hover:scale-110 ${config.color}`}>
            {ogi}
          </div>
          <div className="text-2xl mt-2 text-gray-400 font-medium">/ 100</div>
          <div className={`mt-8 inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold border-2 ${config.bg} ${config.color} shadow-lg`}>
            <config.icon size={28} />
            {growthClassification}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-3xl shadow-xl p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <TrendingUp className="text-indigo-400" /> Weekly Performance Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="week" stroke="#94a3b8" />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fff' }} />
                  <Line type="monotone" dataKey="ogi" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-3xl shadow-xl p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <BookOpen className="text-emerald-400" /> Module Completion Overview
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moduleCompletionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" />
                  <YAxis dataKey="module" type="category" stroke="#94a3b8" width={80} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                  <Legend />
                  <Bar dataKey="completion" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-3xl shadow-xl p-8 backdrop-blur-sm mb-10">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
            <Zap className="text-yellow-400" /> Weekly Performance History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 text-gray-400 font-semibold px-4">Week</th>
                  <th className="py-4 text-gray-400 font-semibold px-4">OGI Score</th>
                  <th className="py-4 text-gray-400 font-semibold px-4">Velocity</th>
                  <th className="py-4 text-gray-400 font-semibold px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {weeklyTrendData.map((row, i) => {
                  const prev = weeklyTrendData[i - 1]?.ogi || row.ogi;
                  const diff = +(row.ogi - prev).toFixed(1);

                  return (
                    <tr key={i} className="text-center hover:bg-white/5 transition-colors">
                      <td className="text-left py-5 px-4 font-medium text-white">{row.week}</td>
                      <td className="py-5 px-4 text-white font-bold">{row.ogi}</td>
                      <td className="py-5 px-4 font-bold">
                        <div className={`flex items-center justify-center gap-1 ${diff > 0 ? "text-green-400" : diff < 0 ? "text-red-400" : "text-gray-500"}`}>
                          {diff > 0 && <ArrowUpRight size={18} />}
                          {diff < 0 && <ArrowDownRight size={18} />}
                          {diff === 0 ? "0.0" : diff}%
                        </div>
                      </td>
                      <td className="py-5 px-4">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${row.ogi >= 85 ? "border-green-500/50 text-green-400 bg-green-500/10" : row.ogi >= 70 ? "border-blue-500/50 text-blue-400 bg-blue-500/10" : "border-gray-700 text-gray-400"}`}>
                          {row.ogi >= 85 ? "EXCELLENT" : row.ogi >= 70 ? "IMPROVING" : row.ogi >= 50 ? "STABLE" : "ATTENTION"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GrowthPulse;