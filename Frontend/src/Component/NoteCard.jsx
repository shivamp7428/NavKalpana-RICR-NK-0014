import { useNavigate } from "react-router-dom";
import { FileText, Download, Eye, Layers } from "lucide-react";

const NoteCard = ({ note }) => {
  const navigate = useNavigate();

  const firstLetter = note.title?.trim()?.charAt(0)?.toUpperCase() || "N";
  
  const thumbnailUrl = note.thumbnail || note.image || null;
  const hasImage = !!thumbnailUrl;

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 
                 overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer"
      onClick={() => navigate(`/notes/${note._id}`)}
    >
      <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-6xl sm:text-7xl select-none overflow-hidden">
        {firstLetter}
        {hasImage && (
          <img
            src={thumbnailUrl}
            alt={note.title}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
      </div>

      {note.subject && (
        <span className="absolute top-3 right-3 z-10 bg-gray-900/80 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
          {note.subject}
        </span>
      )}

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
          {note.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-1">
          {note.description || "Detailed study material and notes"}
        </p>

        <div className="flex items-center gap-5 text-sm text-gray-500 dark:text-gray-400 mb-5">
          <div className="flex items-center gap-1.5">
            <Layers size={16} className="text-purple-500" />
            <span>{note.topicsCount || "12"} Topics</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText size={16} className="text-blue-500" />
            <span>{note.fileType || "PDF"}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            className="flex-1 py-2.5 px-4 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 
                       text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Eye size={16} />
            View
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 
                       dark:hover:bg-blue-900/50 rounded-lg transition-colors duration-200"
            title="Download PDF"
          >
            <Download size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;