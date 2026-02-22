import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col bg-black min-h-screen items-center justify-center  px-4">
      <img
        src="https://img.freepik.com/free-vector/hand-drawn-no-data-illustration_23-2150570252.jpg?semt=ais_hybrid&w=740&q=80"
        alt="404 Not Found"
        className="max-w-md w-full mb-6"
      />

      <h1 className="text-3xl font-bold text-gray-300 mb-2">
        Oops! Page Not Found
      </h1>

      <p className="text-gray-500 text-center max-w-md">
        The page you are looking for doesn’t exist or has been moved.
      </p>
      <button className="bg-indigo-500 text-white p-3 rounded-2xl mt-5 hover:bg-indigo-400">
        <a href="/">Go Back</a>
      </button>
    </div>
  );
};

export default NotFound;
