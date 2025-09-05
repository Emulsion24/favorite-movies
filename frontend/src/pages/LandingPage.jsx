import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import useAuthStore from "../store/authStore";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuthStore();

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
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden flex flex-col">
      {/* Hero Banner */}
      <div className="relative flex-grow bg-gradient-to-b from-black/80 via-black/60 to-black flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to MovieHub</h1>
        <p className="text-lg md:text-xl mb-8 max-w-xl">
          Track your favorite movies and TV shows, manage your watchlist, and stay updated with the latest releases.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleLoginClick}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 font-semibold rounded-lg transition"
          >
            Login
          </button>
          <button
            onClick={handleSignupClick}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg transition"
          >
            Signup
          </button>
        </div>
      </div>

      {/* Optional Footer */}
      <footer className="bg-gray-800 py-6 text-center text-gray-400 text-sm">
        © 2025 MovieHub. All Rights Reserved.
      </footer>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          defaultMode={isSignup ? "signup" : "login"}
        />
      )}
    </div>
  );
}
