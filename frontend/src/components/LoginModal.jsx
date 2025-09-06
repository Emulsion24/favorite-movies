import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";

export default function LoginModal({ onClose, defaultMode = "login" }) {
  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);

  const [isLogin, setIsLogin] = useState(defaultMode === "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(defaultMode === "login");
  }, [defaultMode]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const user = await login(email, password);

      if (!user) {
        throw new Error("Login failed, no user returned");
      }

      if (user.role === "admin") navigate("/admin");
      else navigate("/dashboard");

      toast.success("Login successful");
      onClose();
    } catch (err) {
      console.error("Login error:", err);
      const message = err.response?.data?.error || err.message || "Invalid credentials";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      if (!name || !email || !password) {
        throw new Error("All fields are required");
      }

      await signup(name, email, password);
      
      toast.success("Signup successful");
      navigate("/");
      onClose();
    } catch (err) {
      console.error("Signup error:", err);
      const message = err.response?.data?.error || err.message || "Signup failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-8 rounded-3xl w-96 shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {/* Error */}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            isLogin ? handleLogin() : handleSignup();
          }}
          className="space-y-4"
        >
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-gray-700 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-gray-700 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-gray-700 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="current-password"
          />

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-semibold transition ${
              isLogin
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={loading}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Switch Mode */}
        <p className="mt-4 text-center text-gray-300 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setName("");
              setEmail("");
              setPassword("");
            }}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
