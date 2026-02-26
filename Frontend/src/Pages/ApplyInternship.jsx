import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FileUp,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const ApplyInternship = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/internships/${id}`);
        setInternship(res.data);
      } catch (err) {
        setError("Failed to load internship details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchInternship();
  }, [id]);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!resume) {
      setError("Please upload your resume");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      setError("Please login first");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("internshipId", id);
      formData.append("studentId", user._id);
      formData.append("resume", resume);
      if (coverLetter.trim()) {
        formData.append("coverLetter", coverLetter.trim());
      }

      const res = await axios.post(
        `${API_URL}/api/applications/apply`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => navigate("/jobs"), 1800);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
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

  if (!internship) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Internship not found
      </div>
    );
  }

  const deadlinePassed = new Date() > new Date(internship.deadline);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
            <button
              onClick={() => navigate("/jobs")}
              className="absolute top-6 left-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Back to internships"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>

            <div className="pl-16">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Apply for Internship</h1>
              <h2 className="text-lg opacity-90 line-clamp-2">{internship.title}</h2>
              <p className="mt-3 text-sm opacity-80">
                Company: {internship.company} • Deadline:{" "}
                {new Date(internship.deadline).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>

          {deadlinePassed ? (
            <div className="p-6 text-center">
              <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                Application Closed
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                The deadline for this internship has passed.
              </p>
              <button
                onClick={() => navigate("/jobs")}
                className="mt-6 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
              >
                Back to Internships
              </button>
            </div>
          ) : success ? (
            <div className="p-10 text-center">
              <CheckCircle className="h-20 w-20 mx-auto text-green-500 mb-6" />
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-3">
                Application Submitted!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Your application has been successfully submitted.
              </p>
              <div className="animate-pulse text-sm text-gray-500">
                Redirecting to internships page...
              </div>
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
                  Upload Your Resume <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <FileUp className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                    <div className="text-blue-600 font-medium">
                      Click to browse or drag & drop
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {resume ? resume.name : "PDF or Word • Max 5MB recommended"}
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Cover Letter 
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Tell us why you're a great fit for this internship... (optional)"
                />
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-4 px-6 rounded-xl text-white font-medium flex items-center justify-center gap-3 transition-all ${
                    submitting
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    "Submit Application"
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

export default ApplyInternship;