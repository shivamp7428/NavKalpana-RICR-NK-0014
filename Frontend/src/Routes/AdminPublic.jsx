import { Navigate } from "react-router-dom";

const AdminPublicRoute = ({ children }) => {
  const token = localStorage.getItem("adminId");

  if (token) {
    return <Navigate to="/admin/chat" replace />;
  }

  return children;
};

export default AdminPublicRoute;
