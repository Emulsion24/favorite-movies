// src/store/authStore.js
import { create } from "zustand";
import axios from "axios";
const API_URL="http://localhost:5000/api/v1/auth"
// Axios default setup
axios.defaults.withCredentials = true;


const useAuthStore = create((set) => ({
  user: null,
  loading: true,         // ✅ start true until checkAuth runs
  error: null,
  isAuthenticated: false,

  // ✅ Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const user = res.data.user;

      set({ user, isAuthenticated: true, loading: false });
      return user; // return so LoginModal can redirect
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: err.response?.data?.error || "Login failed",
      });
      throw err;
    }
  },

  // ✅ Signup
  signup: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
      });

      const user = res.data.user || null;
      set({ user, isAuthenticated: !!user, loading: false });
      return user;
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: err.response?.data?.error || "Signup failed",
      });
      throw err;
    }
  },

  // ✅ Auto login from cookie
  checkAuth: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/me`, { withCredentials: true });
      const user = res.data.user;

      set({ user, isAuthenticated: true, loading: false });
      console.log("checkAuth success:", user);
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: "Not authenticated",
      });
      console.log("checkAuth failed");
    }
  },

  // ✅ Logout
  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
    set({ user: null, isAuthenticated: false, loading: false });
  },

  // ✅ Check if logged in (sync helper)
  isLoggedIn: () => !!useAuthStore.getState().user,
}));

export default useAuthStore;
