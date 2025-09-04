import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import useAuthStore from "../store/authStore";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // track login vs signup
  const navigate = useNavigate();

  const { isAuthenticated, user, loading } = useAuthStore();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [loading, isAuthenticated, user, navigate]);

  const handleLoginClick = () => {
    setIsSignup(false);
    setShowLogin(true);
  };

  const handleSignupClick = () => {
    setIsSignup(true);
    setShowLogin(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Task Manager</h1>

      <div className="space-x-4">
        <button
          onClick={handleLoginClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Login
        </button>
        <button
          onClick={handleSignupClick}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Signup
        </button>
      </div>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          defaultMode={isSignup ? "signup" : "login"} // pass correct mode
        />
      )}
    </div>
  );
}
