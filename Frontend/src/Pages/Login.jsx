import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? "login" : "register";
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const res = await axios.post(`http://localhost:5000/api/router/auth/${endpoint}`, payload);

      if (res.data.success) {
        if (isLogin) {
          localStorage.setItem("token", res.data.token);
          toast.success(`Welcome ${res.data.user.name}! Redirecting...`);
          localStorage.setItem("user", JSON.stringify(res.data.user))
          localStorage.setItem("token", res.data.token)
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1500);
        } else {
          toast.success("Registration successful! Please login.");
          setTimeout(() => setIsLogin(true), 1500);
        }
      } else {
        toast.error(res.data.message || "Authentication failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/10"
      >
        <div className="text-center mb-10">
          <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="inline-block">
            <h1 className="text-3xl flex items-center font-black tracking-tighter">
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
            Nav
          </span>
          <span className="text-gray-900 dark:text-white">
           Kalpana
         </span>
         </h1>
            <div className="h-1 w-12 bg-indigo-500 mx-auto mt-1 rounded-full" />
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                key="name"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your name"
                  onChange={handleChange}
                  className="w-full mt-1 p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full mt-1 p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider ml-1">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full mt-1 p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-indigo-600 cursor-pointer hover:bg-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg transition-all mt-4"
          >
            {isLogin ? "Log In" : "Sign In"}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-400 transition-colors"
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="text-indigo-400 cursor-pointer font-bold underline-offset-4 hover:underline">
              {isLogin ? "Sign" : "Login"}
            </span>
          </button>
        </div>
      </motion.div>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default Login;