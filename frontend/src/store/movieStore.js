import { create } from "zustand";
import api from "../utils/api";

const useMovieStore = create((set, get) => ({
  movies: [],
  hasMore: true,
  loading: false,
  error: null,
  page: 1,

  // Fetch movies (approved + user’s own pending)
  fetchMovies: async (reset = false) => {
    const { page, movies } = get();
    set({ loading: true, error: null });

    try {
      const res = await api.get(`/movies?page=${reset ? 1 : page}&limit=10`);
      set({
        movies: reset ? res.data.movies : [...movies, ...res.data.movies],
        hasMore: res.data.hasMore,
        page: reset ? 2 : page + 1,
        loading: false,
      });
    } catch (err) {
      set({ loading: false, error: "Failed to fetch movies" });
    }
  },

  // Add movie
  addMovie: async (formData) => {
    try {
      const res = await api.post("/movies/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        movies: [res.data.movie, ...state.movies],
      }));
      return res.data.movie;
    } catch (err) {
      set({ error: "Failed to add movie" });
      throw err;
    }
  },

  // Delete movie
  deleteMovie: async (id) => {
    try {
      await api.delete(`/movies/${id}`);
      set((state) => ({
        movies: state.movies.filter((m) => m.id !== id),
      }));
    } catch (err) {
      set({ error: "Delete failed" });
    }
  },
}));

export default useMovieStore;
