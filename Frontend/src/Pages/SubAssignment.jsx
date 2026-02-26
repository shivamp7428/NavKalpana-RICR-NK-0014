import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FileUp, Link as LinkIcon, Type, Loader2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const SubmitAssignmentPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [submissionType, setSubmissionType] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/assignments/${assignmentId}`);
        setAssignment(res.data);
      } catch (err) {
        setError("Failed to load assignment details");
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) fetchAssignment();
  }, [assignmentId]);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!submissionType) {
      setError("Please choose a submission method (Text / File / Link)");
      return;
    }

    if (submissionType === "text" && !textAnswer.trim()) {
      setError("Please enter your answer");
      return;
    }

    if (submissionType === "file" && !file) {
      setError("Please select a file to upload");
      return;
    }

    if (submissionType === "link" && (!link.trim() || !link.startsWith("http"))) {
      setError("Please enter a valid link starting with http:// or https://");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("assignmentId", assignmentId);
      const user = JSON.parse(localStorage.getItem("user"));
      formData.append("studentId", user?._id);

      if (submissionType === "text") formData.append("textAnswer", textAnswer.trim());
      else if (submissionType === "file") formData.append("file", file);
      else if (submissionType === "link") formData.append("link", link.trim());

      const res = await axios.post(`${API_URL}/api/submissions/sub`, formData);

      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => navigate("/assignments"), 1800);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit assignment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Assignment not found
      </div>
    );
  }

  const deadlinePassed = new Date() > new Date(assignment.deadline);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
            <button
              onClick={() => navigate("/assignments")}
              className="absolute top-6 left-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Back to assignments"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>

            <div className="pl-16">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Submit Assignment</h1>
              <h2 className="text-lg opacity-90 line-clamp-2">{assignment.title}</h2>
              <p className="mt-3 text-sm opacity-80">
                Deadline: {new Date(assignment.deadline).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </p>
            </div>
          </div>

          {deadlinePassed ? (
            <div className="p-6 text-center">
              <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Deadline has passed</h3>
              <p className="text-gray-600 dark:text-gray-400">You can no longer submit this assignment.</p>
              <button
                onClick={() => navigate("/assignments")}
                className="mt-6 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
              >
                Back to Assignments
              </button>
            </div>
          ) : success ? (
            <div className="p-10 text-center">
              <CheckCircle className="h-20 w-20 mx-auto text-green-500 mb-6" />
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-3">Submission Successful!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Your work has been submitted successfully.</p>
              <div className="animate-pulse text-sm text-gray-500">Redirecting to assignments page...</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
              {error && (
                <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-5 py-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  How do you want to submit?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => { setSubmissionType("text"); setFile(null); setLink(""); }}
                    className={`p-5 rounded-xl border-2 transition-all text-center ${submissionType === "text" ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30" : "border-gray-300 dark:border-gray-600 hover:border-blue-400"}`}
                  >
                    <Type className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                    <div className="font-medium">Text Answer</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Write your response</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSubmissionType("file"); setTextAnswer(""); setLink(""); }}
                    className={`p-5 rounded-xl border-2 transition-all text-center ${submissionType === "file" ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30" : "border-gray-300 dark:border-gray-600 hover:border-blue-400"}`}
                  >
                    <FileUp className="h-8 w-8 mx-auto mb-3 text-indigo-600" />
                    <div className="font-medium">Upload File</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, DOC, ZIP, etc.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSubmissionType("link"); setTextAnswer(""); setFile(null); }}
                    className={`p-5 rounded-xl border-2 transition-all text-center ${submissionType === "link" ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30" : "border-gray-300 dark:border-gray-600 hover:border-blue-400"}`}
                  >
                    <LinkIcon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                    <div className="font-medium">External Link</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Google Drive, GitHub, etc.</p>
                  </button>
                </div>
              </div>

              {submissionType === "text" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Your Answer</label>
                  <textarea
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Write your complete answer here..."
                  />
                </div>
              )}

              {submissionType === "file" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Upload File</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.txt,.zip,.rar,.jpg,.png"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FileUp className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                      <div className="text-blue-600 font-medium">Click to browse or drag & drop</div>
                      <p className="text-sm text-gray-500 mt-1">
                        {file ? file.name : "Max 10MB • PDF, Word, Images, ZIP"}
                      </p>
                    </label>
                  </div>
                </div>
              )}

              {submissionType === "link" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Paste Link</label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter Your External Link"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Make sure the link is publicly accessible</p>
                </div>
              )}

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-4 px-6 rounded-xl text-white font-medium flex items-center justify-center gap-3 transition-all ${submitting ? "bg-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"}`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Assignment"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitAssignmentPage;