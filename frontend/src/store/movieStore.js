// src/store/movieStore.js
import { create } from "zustand";
import toast from "react-hot-toast";
import api from "../utils/api"; // your axios/fetch wrapper


const useMovieStore = create((set, get) => ({
  movies: [],
  usermovies:[],
  loading: false,
  error: null,

  // --- Core state management ---
  setMovies: (movies) => set({ movies }),
  addMovie: (movie) =>
    set((state) => ({ movies: [...state.movies, movie] })),
  updateMovie: (updatedMovie) =>
    set((state) => ({
      movies: state.movies.map((m) =>
        m.id === updatedMovie.id ? updatedMovie : m
      ),
    })),
  deleteMovie: (id) =>
    set((state) => ({
      movies: state.movies.filter((m) => m.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // --- API actions with error handling + toast ---
  fetchApprovedMovies: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/movies",{ withCredentials: true });
      
      set({ movies: res.data.movies ||[], loading: false, error: null });
      
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error("Failed to load approved movies");
    }
  },

  fetchUserMovies: async (userId) => {
    set({ loading: true });
    try {
      const res = await api.get(`/movies/user`,{ withCredentials: true });
      set({ usermovies: res.data.movies || [], loading: false, error: null });
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error("Failed to load user movies");
    }
  },

  createMovie: async (movieData) => {
    try {
      const res = await api.post("/movies", movieData,{ withCredentials: true });
      get().addMovie(res.data);
      toast.success("Movie added successfully");
    } catch (err) {
      toast.error("Failed to add movie");
    }
  },

 
  removeMovie: async (id) => {
    try {
      await api.delete(`/movies/${id}`,{ withCredentials: true });
      get().deleteMovie(id);
      toast.success("Movie deleted");
    } catch (err) {
      toast.error("Failed to delete movie");
    }
  },
}));

export default useMovieStore;
