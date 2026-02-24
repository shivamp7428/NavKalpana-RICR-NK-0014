// src/pages/AlumniPage.jsx
import React, { useState, useEffect } from "react";
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
  Linkedin,
  Search,
  Loader2,
} from "lucide-react";
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-hot-toast';

// 100 dummy alumni
const dummyAlumni = Array.from({ length: 100 }, (_, i) => {
  const batches = ["2015-2019", "2016-2020", "2017-2021", "2018-2022", "2019-2023", "2020-2024"];
  const companies = ["Google", "Microsoft", "Amazon", "Meta", "Adobe", "Atlassian", "Goldman Sachs", "JPMorgan", "Flipkart", "Uber", "Zomato", "Swiggy", "PhonePe", "Paytm", "Oracle", "Cisco", "Salesforce", "Deloitte", "ThoughtWorks"];
  const roles = ["SDE", "Senior SDE", "Frontend Dev", "Backend Dev", "Full Stack", "Data Scientist", "Product Manager", "UI/UX Designer", "DevOps", "Cloud Engineer", "Engineering Manager"];

  const firstNames = ["Rahul", "Priya", "Aman", "Sneha", "Vikram", "Ananya", "Karan", "Neha", "Arjun", "Shreya", "Rohan", "Ishita", "Devansh", "Tanya", "Yash", "Aarohi", "Aditya", "Meera", "Siddharth", "Riya"];
  const lastNames = ["Sharma", "Patel", "Verma", "Gupta", "Singh", "Roy", "Mehta", "Kapoor", "Reddy", "Jain", "Das", "Bose", "Malhotra", "Iyer", "Rao"];

  return {
    id: i + 1,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    batch: batches[i % batches.length],
    company: companies[i % companies.length],
    role: roles[i % roles.length],
    linkedin: "#",
    story: `Loves building scalable ${roles[i % roles.length].toLowerCase()} solutions – grew from campus to ${companies[i % companies.length]} level.`,
    thumbnail: null, // agar real thumbnail chahiye to URL daal sakte ho
  };
});

const AlumniPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logout Successfully");
    navigate("/", { replace: true });
  };

  // Fake loading simulation on search
  useEffect(() => {
    if (searchTerm.trim() !== '') {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 800); // 0.8 sec loader – real API mein remove kar dena
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm]);

  const filteredAlumni = dummyAlumni.filter(alumnus =>
    alumnus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumnus.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumnus.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumnus.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sirf 4 show karne ke liye jab search khali ho
  const displayAlumni = searchTerm.trim() === '' ? dummyAlumni.slice(0, 4) : filteredAlumni;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar – exact Assignments jaisa */}
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
            { name: "Jobs & Internships", icon: Briefcase, href: "/jobs" },
            { name: "Alumni Network", icon: Users, href: "/alumni", active: true },
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
          {/* Mobile Menu */}
          <div className="mb-6 flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Alumni Network
            </h1>
          </div>

          {/* Search Section */}
          <div className="mb-10">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Connect with our alumni for guidance, mentorship, referrals, and inspiration.
            </p>

            <div className="relative max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, company, batch, or role..."
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition"
              />
            </div>

            {/* Loader when searching */}
            {isSearching && (
              <div className="flex justify-center items-center mt-8">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">Searching alumni...</span>
              </div>
            )}
          </div>

          {/* Alumni Cards – Assignments jaisa style */}
          {!isSearching && (
            <>
              {displayAlumni.length === 0 ? (
                <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                  <Users className="h-20 w-20 mx-auto mb-6 opacity-40" />
                  <p className="text-2xl font-medium">No alumni found</p>
                  <p className="mt-3">Try different keywords</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayAlumni.map((alumnus) => {
                    const isFeatured = displayAlumni.indexOf(alumnus) < 4 && searchTerm === '';

                    let cardClass = "group rounded-2xl shadow border overflow-hidden transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:scale-[1.02] cursor-pointer";

                    return (
                      <div
                        key={alumnus.id}
                        className={cardClass}
                        onClick={() => window.open(alumnus.linkedin, '_blank')}
                      >
                        {/* Gradient Header – Assignments jaisa */}
                        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-7xl select-none overflow-hidden">
                          {alumnus.name?.trim()?.charAt(0)?.toUpperCase() || "?"}

                          {alumnus.thumbnail && (
                            <img
                              src={alumnus.thumbnail}
                              alt={alumnus.name}
                              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          )}

                          {/* Status-like badge */}
                          <span className="absolute top-3 right-3 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 shadow-sm">
                            <Briefcase size={14} />
                            {alumnus.role.split(" ")[0]}
                          </span>
                        </div>

                        <div className="p-5">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
                            {alumnus.name}
                          </h3>

                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-1">
                            {alumnus.company} • {alumnus.batch}
                          </p>

                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 italic">
                            "{alumnus.story}"
                          </p>

                          <a
                            href={alumnus.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                          >
                            <Linkedin size={18} />
                            LinkedIn Profile
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {searchTerm.trim() !== '' && (
                <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
                  Showing {filteredAlumni.length} matching alumni
                </p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AlumniPage;