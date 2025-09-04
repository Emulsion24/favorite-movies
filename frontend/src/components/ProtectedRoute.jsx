import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user, loading } = useAuthStore();

  // ✅ Wait while checkAuth is running
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Checking authentication...</div>;
  }

  // ✅ Not logged in → go home
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ✅ Logged in but wrong role
  if (role && user?.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
