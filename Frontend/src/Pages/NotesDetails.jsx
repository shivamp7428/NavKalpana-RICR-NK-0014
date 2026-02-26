import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookText, GraduationCap, Search, ArrowLeft, Menu, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const Notes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseId = searchParams.get("courseId");
  const [allNotes, setAllNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState(""); 

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);

      try {
        let url = `${API_URL}/api/notes`;

        if (courseId) {
         url = `${API_URL}/api/notes/course/${courseId}`;
          try {
            const courseRes = await axios.get(`${API_URL}/api/courses/${courseId}`);
            setCourseTitle(courseRes.data.data?.title || "Course Notes");
          } catch (err) {
            console.warn("Could not fetch course title", err);
            setCourseTitle("Course Notes");
          }
        } else {
          url = `${API_URL}/api/modules/modules`;
        }

        const res = courseId
          ? await axios.get(url)
          : await axios.get(url); 

        let notesData = [];

        if (courseId) {
          notesData = res.data.data || [];
        } else {
          const modulesData = res.data.data || [];
          modulesData.forEach((mod) => {
            if (mod.notes && mod.notes.length > 0) {
              notesData = notesData.concat(mod.notes);
            }
          });
        }

        setAllNotes(notesData);

        if (notesData.length > 0) {
          setSelectedNote(notesData[0]);
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
        setAllNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [courseId]);

  const filteredNotes = allNotes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectNoteMobile = (note) => {
    setSelectedNote(note);
    setIsSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950 overflow-hidden relative">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 
          flex flex-col transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors text-sm font-semibold group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back
            </button>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <h1 className="text-3xl flex items-center font-black tracking-tighter mb-6">
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">Notes</span>
            <span className="text-gray-900 dark:text-white">Hub</span>
          </h1>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search topics..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-1">
          <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            {courseId ? (courseTitle || "Course") : "All"} Lecture Notes
          </p>

          {filteredNotes.length === 0 ? (
            <p className="px-4 py-3 text-gray-500 text-sm">No notes found</p>
          ) : (
            filteredNotes.map((note) => (
              <button
                key={note._id}
                onClick={() => selectNoteMobile(note)}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  selectedNote?._id === note._id
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                <span className="text-sm font-bold truncate tracking-tight">{note.title}</span>
              </button>
            ))
          )}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-gray-950">
        <header className="h-16 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 lg:px-10 justify-between bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Menu size={24} />
            </button>

            <BookText className="hidden sm:block text-indigo-500" size={20} />
            <h2 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter truncate max-w-[200px] sm:max-w-none">
              {selectedNote?.title || (courseId ? courseTitle || "Course Notes" : "Reading Mode")}
            </h2>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 py-10 lg:py-16">
            {selectedNote ? (
              <article className="prose prose-sm sm:prose-lg prose-indigo dark:prose-invert max-w-none">
                <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter leading-none">
                  {selectedNote.title}
                </h1>
                <div className="h-1.5 w-20 sm:w-24 bg-indigo-500 mb-8 sm:mb-12 rounded-full"></div>

                <div className="text-gray-800 dark:text-gray-100 font-medium leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedNote.content || ""}
                  </ReactMarkdown>
                </div>
              </article>
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <GraduationCap size={64} className="text-gray-200 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Ready to study?</h2>
                <p className="text-gray-500 mt-2">
                  {courseId
                    ? "This course has no notes yet or select one from the list."
                    : "Pick a topic from the sidebar to get started."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notes;