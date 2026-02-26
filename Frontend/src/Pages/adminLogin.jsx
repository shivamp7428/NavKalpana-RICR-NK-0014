import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;
const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.warning("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/api/admin/login`,
        { email, password }
      );

      const adminId = res.data.adminId; 

      localStorage.setItem("adminId", adminId);

      toast.success("Welcome Admin");
      navigate("/admin/chat");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 to-cyan-600">
      <div className="bg-white p-8 rounded-xl shadow-lg w-80">
        
        <h2 className="text-2xl font-bold text-center mb-1 text-teal-600">
          Admin Panel
        </h2>
        <p className="text-sm text-center text-gray-500 mb-5">
          Secure login required
        </p>

        <input
          className="w-full border rounded p-2 mb-3 focus:outline-none "
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border rounded p-2 mb-4 focus:outline-none "
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full cursor-pointer flex items-center justify-center gap-2 py-2 rounded text-white transition
            ${loading ? "bg-teal-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"}
          `}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Logging in...</span>
            </>
          ) : (
            "Login"
          )}
        </button>

      </div>
    </div>
  );
};

export default AdminLogin;