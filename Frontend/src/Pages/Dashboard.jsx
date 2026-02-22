import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend,} from 'chart.js';
import {BookOpen, Award, CalendarDays, Clock, Flame, Trophy, LogOut,LayoutDashboard, MessageCircleQuestion, Briefcase, Users} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentDashboard = () => {
  const [greeting, setGreeting] = useState('');
  const user = JSON.parse(localStorage.getItem("user"));
 const studentName = user?.name || "Student";

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const {logout } = useAuth();
  const handleLogout = () => {
    logout();
    toast.success("Logout Successfully")
    navigate("/", { replace: true });
    
  };

  //Dummy data
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
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform md:translate-x-0 flex flex-col">
  <div className="p-6 border-b border-gray-200 dark:border-gray-800">
    <h1 className="text-3xl flex items-center font-black tracking-tighter">
      <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
        Nav
      </span>
      <span className="text-gray-900 dark:text-white">
        Kalpana
      </span>
    </h1>
  </div>

  <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto">
    {[
      { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', active: true },
      { name: 'My Courses', icon: BookOpen, href: '/courses' },
      { name: 'Assignments', icon: CalendarDays, href: '/assignments' },
      { name: 'Quizzes', icon: Award, href: '/quizzes' },
      { name: 'Attendance', icon: Clock, href: '/attendance' },
      { name: 'Doubts & Support', icon: MessageCircleQuestion, href: '/support' },
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

      {/* Main Content */}
      <main className="md:ml-64 p-3 min-h-screen">
        {/* Header / Greeting */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            {greeting}, {studentName}! 
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Your learning journey at a glance
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Progress Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Overall Progress</h3>
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-500">
              {stats.overallProgress}%
            </div>
            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${stats.overallProgress}%` }}
              />
            </div>
          </div>

          {/* Assignments */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">Assignments</h3>
            <div className="text-4xl font-bold">
              {stats.assignments.completed}<span className="text-2xl text-gray-500"> / {stats.assignments.total}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Completed</p>
          </div>

          {/* Streak */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">Learning Streak</h3>
            <div className="flex items-center text-4xl font-bold text-orange-500">
              {stats.streak} <Flame className="w-8 h-8 ml-2" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">days in a row</p>
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">Skills Acquired</h3>
            <div className="text-4xl font-bold">
              {stats.skills.acquired}<span className="text-2xl text-gray-500"> / {stats.skills.total}</span>
            </div>
          </div>
        </div>

        {/* Chart + Extra Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold mb-4">This Week's Activity</h3>
            <div className="h-64">
              <Bar data={weeklyChartData} options={chartOptions} />
            </div>
          </div>

          {/* Upcoming Events + Leaderboard */}
          <div className="space-y-6">
            {/* Events */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CalendarDays className="w-5 h-5 mr-2 text-purple-500" />
                Upcoming Deadlines
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Python Assignment 3</span>
                  <span className="text-red-500 font-medium">Tomorrow, 11:59 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Structures Quiz</span>
                  <span className="text-orange-500 font-medium">In 3 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Web Dev Project Submission</span>
                  <span className="text-yellow-600 dark:text-yellow-400 font-medium">Next Week</span>
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Class Leaderboard
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between font-medium">
                  <span>1. Aarav Sharma</span><span>94%</span>
                </div>
                <div className="flex justify-between">
                  <span>2. Priya Patel</span><span>91%</span>
                </div>
                <div className="flex justify-between bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 rounded -mx-3">
                  <span>3. You (Shivam)</span><span className="text-blue-600 dark:text-blue-400">74%</span>
                </div>
                <div className="flex justify-between">
                  <span>4. Rohan Verma</span><span>72%</span>
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