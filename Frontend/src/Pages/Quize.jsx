import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  HelpCircle,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Menu,
  X,
  Clock,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const Quiz = () => {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const [attemptedQuizIds, setAttemptedQuizIds] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const quizzesRes = await axios.get(`${API_URL}/api/quiz/quizzes`);
        if (quizzesRes.data.success) {
          const formatted = quizzesRes.data.data.map((quiz) => ({
            id: quiz._id,
            title: quiz.title,
            questionsCount: quiz.questions.length,
            timeLimit: quiz.timeLimit || 600,
            passingScore: quiz.passingScore,
          }));
          setQuizzes(formatted);

          if (formatted.length > 0 && !selectedQuiz) {
            loadFullQuiz(formatted[0].id);
          }
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user?._id) {
          const attemptsRes = await axios.post(`${API_URL}/api/quiz/user-attempts`, {
            studentId: user._id,
          });

          if (attemptsRes.data.success) {
            const ids = new Set(attemptsRes.data.data.attemptedQuizIds || []);
            setAttemptedQuizIds(ids);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadFullQuiz = async (quizId) => {
    try {
      const res = await axios.get(`${API_URL}/api/quiz/quizzes/${quizId}`);
      if (res.data.success) {
        const quizData = res.data.data;
        quizData.questions = quizData.questions.map(q => ({
          ...q,
          correctOption: parseInt(q.correctOption, 10)
        }));
        setSelectedQuiz(quizData);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setShowResult(false);
        setQuizResult(null);
        setIsTimeUp(false);
        setTimeLeft(quizData.timeLimit || 600);
      }
    } catch (err) {
      console.error("Load quiz error:", err);
    }
  };

  const handleAnswerClick = (selectedOptionIndex) => {
    if (userAnswers.some((a) => a.questionIndex === currentQuestionIndex)) return;

    setUserAnswers((prev) => [
      ...prev,
      { questionIndex: currentQuestionIndex, selectedOption: selectedOptionIndex },
    ]);
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < selectedQuiz.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?._id) {
        alert("Please login first");
        return;
      }

      const payload = {
        answers: userAnswers,
        timeTaken: (selectedQuiz.timeLimit || 600) - timeLeft,
        studentId: user._id,
      };

      const res = await axios.post(
        `${API_URL}/api/quiz/quizzes/${selectedQuiz._id}/submit`,
        payload
      );

      if (res.data.success) {
        setQuizResult(res.data.data);
        setShowResult(true);
        setIsTimeUp(false);
        setAttemptedQuizIds((prev) => new Set([...prev, selectedQuiz._id]));
      } else {
        alert(res.data.message || "Submission failed");
      }
    } catch (err) {
      console.error("Submit error:", err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Network or server error");
      }
    }
  };

  const handleTimeUpRetry = () => {
    setIsTimeUp(false);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResult(false);
    setQuizResult(null);
    setTimeLeft(selectedQuiz.timeLimit || 600);
  };

  useEffect(() => {
    if (!selectedQuiz || showResult || isTimeUp) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedQuiz, showResult, isTimeUp]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden relative">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 
          flex flex-col transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            Quiz <span className="text-indigo-600">Hub</span>
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 px-2">
            Available Quizzes
          </p>

          {quizzes.map((quiz) => {
            const isAttempted = attemptedQuizIds.has(quiz.id);

            return (
              <button
                key={quiz.id}
                onClick={() => {
                  loadFullQuiz(quiz.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left p-4 rounded-lg mb-2 transition-all ${
                  selectedQuiz?._id === quiz.id
                    ? "bg-indigo-600 text-white"
                    : "text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <div className="font-medium">{quiz.title}</div>
                <div className="text-xs opacity-80">
                  {quiz.questionsCount} questions • {Math.floor(quiz.timeLimit / 60)} min
                </div>

                {isAttempted && (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium mt-1">
                    <CheckCircle2 size={14} />
                    Attempted
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 lg:px-8 justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} className="text-gray-700 dark:text-gray-300" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[220px] sm:max-w-none">
              {selectedQuiz?.title || "Select a Quiz"}
            </h2>
          </div>

          {selectedQuiz && !showResult && !isTimeUp && (
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                timeLeft <= 30
                  ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <Clock size={16} />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
          <div className="max-w-4xl w-full">
            {isTimeUp ? (
              <div className="text-center py-12 px-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
                <div className="w-24 h-24 mx-auto rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center mb-6">
                  <Clock className="text-red-600 dark:text-red-400" size={48} />
                </div>

                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  Time's Up!
                </h2>

                <p className="text-xl text-gray-900 dark:text-gray-200 mb-8">
                  Your time for this quiz has expired.
                </p>

                <button
                  onClick={handleTimeUpRetry}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center gap-2 mx-auto"
                >
                  <RotateCcw size={18} />
                  Try Again (Full Time)
                </button>
              </div>
            ) : showResult && quizResult ? (
              <div className="py-8 px-4 sm:px-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 max-h-[85vh] overflow-y-auto">
                <div className="text-center mb-12 pt-4">
                  <div
                    className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      quizResult.passed ? "bg-green-100 dark:bg-green-900/50" : "bg-red-100 dark:bg-red-900/50"
                    }`}
                  >
                    {quizResult.passed ? (
                      <Trophy className="text-green-600 dark:text-green-400" size={48} />
                    ) : (
                      <XCircle className="text-red-600 dark:text-red-400" size={48} />
                    )}
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    {quizResult.passed ? "Great! You Passed" : "No Problem, Try Again"}
                  </h2>

                  <div className="text-6xl font-black text-indigo-600 mb-3">
                    {quizResult.percentage}%
                  </div>

                  <p className="text-xl text-gray-900 dark:text-gray-200">
                    {quizResult.score} / {quizResult.totalMarks} marks
                  </p>

                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                    {quizResult.passed
                      ? `You cleared it! (Passing: ${selectedQuiz.passingScore}%)`
                      : `Required ${selectedQuiz.passingScore}% to pass`}
                  </p>
                </div>

                <div className="space-y-10">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-6">
                    Your Performance Breakdown
                  </h3>

                  {selectedQuiz.questions.map((q, index) => {
                    const userAns = userAnswers.find((a) => a.questionIndex === index);
                    const userSelected = userAns ? parseInt(userAns.selectedOption, 10) : -1;
                    const correct = parseInt(q.correctOption, 10);
                    const isCorrect = userSelected === correct;
                    const attempted = userSelected !== -1;

                    return (
                      <div
                        key={index}
                        className={`p-6 rounded-2xl border-2 shadow-md transition-all ${
                          isCorrect && attempted
                            ? "border-green-600"
                            : attempted && !isCorrect
                            ? "border-red-600"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        <div className="flex items-start gap-4 mb-6 pt-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-lg">
                            {index + 1}
                          </div>
                          <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-200 leading-relaxed">
                            {q.question}
                          </p>
                        </div>

                        <div className="grid gap-3">
                          {q.options.map((opt, optIdx) => {
                            const isThisCorrect = optIdx === correct;
                            const isThisWrong = optIdx === userSelected && !isCorrect;

                            return (
                              <div
                                key={optIdx}
                                className={`p-4 rounded-xl border-2 text-sm sm:text-base font-medium flex items-center justify-between text-gray-900 dark:text-gray-200 ${
                                  isThisCorrect
                                    ? "border-green-600"
                                    : isThisWrong
                                    ? "border-red-600"
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                              >
                                <span className={isThisWrong ? "line-through" : ""}>{opt}</span>

                                <div className="flex items-center gap-2">
                                  {isThisCorrect && (
                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold">
                                      <CheckCircle2 size={18} /> Correct
                                    </span>
                                  )}
                                  {isThisWrong && (
                                    <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold">
                                      <XCircle size={18} /> Wrong
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {q.explanation && (
                          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 border-l-4 border-indigo-500 dark:border-indigo-400">
                            <strong className="block mb-2 text-indigo-600 dark:text-indigo-400">
                              Explanation:
                            </strong>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-12 text-center">
                  <button
                    onClick={() => {
                      setShowResult(false);
                      setQuizResult(null);
                      resetQuiz();
                    }}
                    className="px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl transition shadow-md"
                  >
                    <RotateCcw size={20} className="inline mr-2" />
                    Try Again
                  </button>
                </div>
              </div>
            ) : selectedQuiz ? (
              <div className="space-y-8 max-w-3xl mx-auto">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {selectedQuiz.questions[currentQuestionIndex].question}
                </h3>

                <div className="grid gap-4">
                  {selectedQuiz.questions[currentQuestionIndex].options.map((option, idx) => {
                    const isSelected = userAnswers.some(
                      (a) => a.questionIndex === currentQuestionIndex && a.selectedOption === idx
                    );

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerClick(idx)}
                        disabled={isSelected}
                        className={`w-full p-5 text-left rounded-xl border-2 transition-all text-base sm:text-lg font-medium text-gray-900 dark:text-gray-200 ${
                          isSelected
                            ? "border-indigo-700 bg-indigo-50 dark:bg-indigo-950/50 shadow-lg"
                            : "border-gray-300 dark:border-gray-700 hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30"
                        }`}
                      >
                        {option}
                        {isSelected && (
                          <CheckCircle2
                            size={20}
                            className="inline ml-3 text-indigo-700 dark:text-indigo-300"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleNext}
                  disabled={!userAnswers.some((a) => a.questionIndex === currentQuestionIndex)}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {currentQuestionIndex + 1 === selectedQuiz.questions.length
                    ? "Submit Quiz"
                    : "Next Question"}
                </button>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-600 dark:text-gray-400 text-lg">
                Select a quiz from the sidebar to begin
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Quiz;