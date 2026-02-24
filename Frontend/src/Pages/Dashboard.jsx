import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { 
  BookOpen, Award, CalendarDays, Clock, Flame, Trophy, LogOut, 
  LayoutDashboard, MessageCircleQuestion, Briefcase, Users, Menu, X 
} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentDashboard = () => {
  const [greeting, setGreeting] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const studentName = user?.name || "Student";

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    toast.success("Logout Successfully");
    navigate("/", { replace: true });
  };

  const stats = {
    overallProgress: 74,
    assignments: { completed: 14, total: 22 },
    streak: 9,
    skills: { acquired: 18, total: 30 },
  };

  const weeklyChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Study Hours',
        data: [4.5, 3.2, 6.1, 2.8, 5.4, 7.0, 4.2],
        backgroundColor: 'rgba(59, 130, 246, 0.65)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, max: 10, grid: { color: 'rgba(0,0,0,0.06)' } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
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
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto">
          {[
            { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', active: true },
            { name: 'My Courses', icon: BookOpen, href: '/courses' },
            { name: 'Assignments', icon: CalendarDays, href: '/assignments' },
            { name: 'Quizzes', icon: Award, href: '/quizzes' },
            { name: 'Attendance', icon: Clock, href: '/attendance' },
            { name: 'Doubts & Support', icon: MessageCircleQuestion, href: '/studentChat' },
            { name: 'Jobs & Internships', icon: Briefcase, href: '/jobs' },
            { name: 'Alumni Network', icon: Users, href: '/alumni' },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                item.active
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${item.active ? 'text-blue-600' : ''}`} />
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
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">
                {greeting}, {studentName}! 
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Your learning journey at a glance
              </p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-900 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800">
             <Clock size={16} className="text-blue-500" />
             {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Overall Progress</h3>
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-500">
              {stats.overallProgress}%
            </div>
            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${stats.overallProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300 text-sm">Assignments</h3>
            <div className="text-3xl font-bold">
              {stats.assignments.completed}<span className="text-xl text-gray-500"> / {stats.assignments.total}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Modules Completed</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300 text-sm">Learning Streak</h3>
            <div className="flex items-center text-3xl font-bold text-orange-500">
              {stats.streak} <Flame className="w-7 h-7 ml-2" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">days in a row</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300 text-sm">Skills Acquired</h3>
            <div className="text-3xl font-bold">
              {stats.skills.acquired}<span className="text-xl text-gray-500"> / {stats.skills.total}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Verified Skills</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold mb-4">This Week's Activity</h3>
            <div className="h-64">
              <Bar data={weeklyChartData} options={chartOptions} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-base font-semibold mb-4 flex items-center">
                <CalendarDays className="w-5 h-5 mr-2 text-purple-500" />
                Upcoming Deadlines
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Python Assignment 3</span>
                  <span className="text-red-500 font-medium">Tomorrow</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Data Structures Quiz</span>
                  <span className="text-orange-500 font-medium">In 3 days</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-base font-semibold mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Class Leaderboard
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
                  <span className="font-medium text-blue-700 dark:text-blue-400">3. You ({studentName})</span>
                  <span className="font-bold text-blue-700 dark:text-blue-400">74%</span>
                </div>
                <div className="flex justify-between px-3">
                  <span className="text-gray-600 dark:text-gray-400">4. Rohan Verma</span>
                  <span className="text-gray-600 dark:text-gray-400">72%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;