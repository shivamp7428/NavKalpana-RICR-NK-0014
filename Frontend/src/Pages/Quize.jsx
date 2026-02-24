import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HelpCircle, ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw, Menu, X } from "lucide-react";

const Quiz = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile toggle state
  
  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/modules/modules");
        const modulesData = res.data.data || [];
        
        let allQuizzes = modulesData
          .filter(mod => mod.quizzes && mod.quizzes.length > 0)
          .map(mod => ({
            id: mod._id,
            moduleTitle: mod.title,
            questions: [
              {
                question: `Test your knowledge on ${mod.title}`,
                options: ["Option A", "Option B", "Option C", "Option D"],
                correctAnswer: 0
              }
            ]
          }));
          
        setQuizzes(allQuizzes);
        if (allQuizzes.length > 0) setSelectedQuiz(allQuizzes[0]);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleAnswerClick = (index) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    if (index === selectedQuiz.questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < selectedQuiz.questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const handleQuizSelection = (quiz) => {
    setSelectedQuiz(quiz);
    resetQuiz();
    setIsSidebarOpen(false); // Mobile par quiz select hote hi sidebar close
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-950">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950 overflow-hidden relative">
      
      {/* --- Sidebar Overlay (Mobile Only) --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- Sidebar --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors text-sm font-semibold group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back
            </button>

            {/* Close Button (Mobile Only) */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <h1 className="text-3xl font-black tracking-tighter mb-6">
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">Quiz</span>
            <span className="text-gray-900 dark:text-white">Hub</span>
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-1">
          <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Available Quizzes</p>
          {quizzes.map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => handleQuizSelection(quiz)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                selectedQuiz?.id === quiz.id
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              <span className="text-sm font-bold block truncate">{quiz.moduleTitle}</span>
              <span className={`text-[10px] uppercase ${selectedQuiz?.id === quiz.id ? "text-indigo-200" : "text-gray-400"}`}>
                {quiz.questions.length} Questions
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* --- Quiz Area --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-gray-950">
        <header className="h-16 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 lg:px-10 justify-between bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Menu Toggle (Mobile Only) */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Menu size={24} />
            </button>

            <HelpCircle className="hidden sm:block text-indigo-500" size={20} />
            <h2 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter truncate max-w-[150px] sm:max-w-none">
              {selectedQuiz?.moduleTitle}
            </h2>
          </div>
          {selectedQuiz && !showResult && (
            <div className="text-[10px] sm:text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full whitespace-nowrap">
              {currentQuestionIndex + 1} / {selectedQuiz.questions.length}
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 sm:p-8">
          <div className="max-w-2xl w-full">
            {showResult ? (
              <div className="text-center p-6 sm:p-10 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="text-indigo-600" size={32} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">Quiz Completed!</h2>
                <p className="text-gray-500 mb-6">You scored {score} out of {selectedQuiz.questions.length}</p>
                <button 
                  onClick={resetQuiz}
                  className="flex items-center gap-2 mx-auto px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                >
                  <RotateCcw size={18} /> Try Again
                </button>
              </div>
            ) : selectedQuiz ? (
              <div className="space-y-6 sm:space-y-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {selectedQuiz.questions[currentQuestionIndex].question}
                </h3>

                <div className="grid gap-3 sm:gap-4">
                  {selectedQuiz.questions[currentQuestionIndex].options.map((option, idx) => {
                    const isCorrect = idx === selectedQuiz.questions[currentQuestionIndex].correctAnswer;
                    const isWrong = selectedAnswer === idx && !isCorrect;
                    
                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleAnswerClick(idx)}
                        className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between text-sm sm:text-base ${
                          isAnswered && isCorrect 
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" 
                            : isAnswered && isWrong
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                            : selectedAnswer === idx
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                            : "border-gray-100 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span className="font-semibold">{option}</span>
                        {isAnswered && isCorrect && <CheckCircle2 size={20} className="shrink-0 ml-2" />}
                        {isAnswered && isWrong && <XCircle size={20} className="shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <button 
                    onClick={handleNext}
                    className="w-full py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all text-sm sm:text-base"
                  >
                    {currentQuestionIndex + 1 === selectedQuiz.questions.length ? "See Results" : "Next Question"}
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Quiz;