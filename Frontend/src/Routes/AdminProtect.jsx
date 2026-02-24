import { Navigate } from "react-router-dom";

const AdminProtected = ({ children }) => {
  const token = localStorage.getItem("adminId");

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default AdminProtected;
