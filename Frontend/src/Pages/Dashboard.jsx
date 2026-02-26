import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { 
  LayoutDashboard, BookOpen, CalendarDays, Award, Clock, 
  MessageCircleQuestion, Briefcase, Users, LogOut, Menu, X, 
  Trophy, Flame, AlertCircle, 
  TrendingUp
} from "lucide-react";
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentDashboard = () => {
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    overallProgress: 0,
    assignments: { completed: 0, total: 0 },
    streak: 9,
    skills: { acquired: 18, total: 30 },
    attendance: { percentage: 0, presentLessons: 0, totalLessons: 0 },
  });
  const [deadlines, setDeadlines] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardSearch, setLeaderboardSearch] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?._id;
  const studentName = user?.name || "Student";

  const isPastDeadline = (deadline) => deadline && new Date(deadline) < new Date();
  const isDeadlineClose = (deadline) => {
    if (!deadline) return false;
    const timeLeft = new Date(deadline) - new Date();
    return timeLeft > 0 && timeLeft <= 24 * 60 * 60 * 1000;
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString("en-IN", { 
        timeZone: "Asia/Kolkata", 
        dateStyle: "full", 
        timeStyle: "medium" 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!studentId) return;

      try {
        const assRes = await axios.get("http://localhost:5000/api/assignments");
        const assData = assRes.data || [];

        const subRes = await axios.get(`http://localhost:5000/api/submissions?studentId=${studentId}`);
        const submittedMap = new Map(
          subRes.data.map(s => [s.assignmentId?._id || s.assignmentId, { submittedAt: s.submittedAt, marks: s.marks ?? 0 }])
        );

        const updatedAss = assData.map(a => {
          const sub = submittedMap.get(a._id);
          return {
            ...a,
            isSubmitted: !!sub,
            submittedAt: sub?.submittedAt ? new Date(sub.submittedAt).toLocaleString("en-IN", {day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}) : null,
            marksObtained: sub?.marks,
          };
        });

        updatedAss.sort((a, b) => {
          const aPending = !a.isSubmitted && !isPastDeadline(a.deadline);
          const bPending = !b.isSubmitted && !isPastDeadline(b.deadline);
          if (aPending && !bPending) return -1;
          if (!aPending && bPending) return 1;
          return 0;
        });

        const completed = updatedAss.filter(a => a.isSubmitted).length;
        setStats(prev => ({
          ...prev,
          assignments: { completed, total: updatedAss.length },
        }));

        let attendance = { percentage: 0, presentLessons: 0, totalLessons: 0 };
        try {
          const coursesRes = await axios.get("http://localhost:5000/api/courses");
          const courses = coursesRes.data.data || coursesRes.data || [];

          let totalLessons = 0;
          let completedLessons = 0;

          for (const c of courses) {
            let t = 0;
            c.modules?.forEach(m => t += m.lessons?.length || 0);
            totalLessons += t;

            const pRes = await axios.post("http://localhost:5000/api/progress", { userId: studentId, courseId: c._id });
            completedLessons += pRes.data.data?.completedLessons?.length || 0;
          }

          const perc = totalLessons > 0 ? ((completedLessons / totalLessons) * 100).toFixed(1) : 0;
          attendance = { percentage: parseFloat(perc), presentLessons: completedLessons, totalLessons };
        } catch (e) {
          console.warn("Attendance failed:", e);
        }

        setStats(prev => ({
          ...prev,
          overallProgress: parseFloat(attendance.percentage) || 0,
          attendance,
        }));

        const upcoming = [];
        updatedAss.filter(a => !a.isSubmitted).forEach(a => {
          if (new Date(a.deadline) > new Date()) upcoming.push({title: a.title, deadline: a.deadline, type: "Assignment"});
        });

        const intRes = await axios.get("http://localhost:5000/api/internships");
        const internships = intRes.data.internships || [];
        const appRes = await axios.get(`http://localhost:5000/api/applications/student/${studentId}`);
        const appliedMap = new Map(
          appRes.data.applications?.map(app => [app.internshipId?._id || app.internshipId, true]) || []
        );

        internships.filter(i => !appliedMap.has(i._id)).forEach(i => {
          if (new Date(i.deadline) > new Date()) upcoming.push({title: i.title, deadline: i.deadline, type: "Internship"});
        });

        upcoming.sort((a,b) => new Date(a.deadline) - new Date(b.deadline));
        setDeadlines(upcoming.slice(0,5));

        const usersRes = await axios.get("http://localhost:5000/api/router/auth/get");
        const users = Array.isArray(usersRes.data?.data) ? usersRes.data.data : [];
        const lb = users.map(u => ({
          name: u.name || "Student",
          progress: u.progress || Math.floor(Math.random()*100)
        })).sort((a,b) => b.progress - a.progress);
        setLeaderboard(lb);

      } catch (err) {
        console.error("Dashboard error:", err);
        toast.error("Dashboard load nahi ho paya");
      }
    };

    fetchData();

    const eventSource = new EventSource(`http://localhost:5000/api/student/${studentId}/progress-stream`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStats(prev => ({ ...prev, overallProgress: data.progress }));
      toast.success("Progress updated!");
    };

    return () => eventSource.close();
  }, [studentId]);

  const handleLogout = () => {
    logout();
    toast.success("Logout Successfully");
    navigate("/", { replace: true });
  };

  const filteredLeaderboard = leaderboard.filter(s =>
    s.name.toLowerCase().includes(leaderboardSearch.toLowerCase()) ||
    s.progress.toString().includes(leaderboardSearch)
  );

  const weeklyChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Study Hours',
      data: [4.5, 3.2, 6.1, 2.8, 5.4, 7.0, 4.2],
      backgroundColor: 'rgba(59, 130, 246, 0.65)',
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, max: 10 }, x: { grid: { display: false } } },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col
      `}>
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
            { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" ,active:true},
            { name: "Growth Pulse", icon: TrendingUp, href: "/growth-pulse"},
            { name: "My Courses", icon: BookOpen, href: "/courses" },
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
            className="flex cursor-pointer w-full items-center px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors group"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 p-4 md:p-8 min-h-screen">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm transition-colors"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                {greeting}, {studentName}!
              </h1>
              <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Your learning journey at a glance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm font-medium bg-white dark:bg-gray-900 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm">
            <Clock size={18} className="text-blue-500 animate-pulse" />
            <span>{currentTime}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-sm mb-4">Overall Progress</h3>
            <div className="text-3xl font-bold text-blue-600">{stats.overallProgress}%</div>
            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-800 rounded-full">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${stats.overallProgress}%` }} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-sm mb-4">Assignments</h3>
            <div className="text-3xl font-bold">
              {stats.assignments.completed} / {stats.assignments.total}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-sm mb-4">Learning Streak</h3>
            <div className="flex items-center text-3xl font-bold text-orange-500">
              {stats.streak} <Flame size={28} className="inline ml-2" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-sm mb-4">Skills Acquired</h3>
            <div className="text-3xl font-bold">
              {stats.skills.acquired} / {stats.skills.total}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-sm mb-4">Attendance</h3>
            <div className="text-3xl font-bold text-green-600">
              {stats.attendance.percentage}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Lessons: {stats.attendance.presentLessons} / {stats.attendance.totalLessons}
            </p>
            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-800 rounded-full">
              <div className="h-full bg-green-600 rounded-full" style={{ width: `${stats.attendance.percentage}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">This Week's Activity</h3>
            <div className="h-64">
              <Bar data={weeklyChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3 text-sm">
              {deadlines.length > 0 ? deadlines.map((d, i) => (
                <div key={i} className="flex justify-between">
                  <span>{d.title} ({d.type})</span>
                  <span className={new Date(d.deadline) < new Date(Date.now() + 2*86400000) ? "text-red-500" : "text-orange-500"}>
                    {new Date(d.deadline).toLocaleDateString('en-IN')}
                  </span>
                </div>
              )) : <p className="text-gray-500">No upcoming deadlines</p>}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Class Leaderboard
            </h3>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={leaderboardSearch}
                onChange={e => setLeaderboardSearch(e.target.value)}
                placeholder="Search name..."
                className="w-full pl-4 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>

          {filteredLeaderboard.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-10 w-10 mx-auto mb-4 opacity-50" />
              <p>No students found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLeaderboard.slice(0, 3).map((s, idx) => (
                <div key={idx} className="p-4 rounded-xl flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                      {s.name[0]}
                    </div>
                    <div>
                      <p className="font-medium">{idx+1}. {s.name}</p>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-blue-600">{s.progress}%</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;