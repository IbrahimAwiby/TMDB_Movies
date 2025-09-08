// src/components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((s) => s.auth.user);
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

export default ProtectedRoute;
