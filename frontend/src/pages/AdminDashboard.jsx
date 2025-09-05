// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/api";
import useAuthStore from "../store/authStore";
import EditEntryModal from "../components/EditEntryModal";

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    title: searchParams.get("title") || "",
    director: searchParams.get("director") || "",
    type: searchParams.get("type") || "",
    yearFrom: searchParams.get("yearFrom") || "",
    yearTo: searchParams.get("yearTo") || "",
    status: searchParams.get("status") || "",
    sort: searchParams.get("sort") || "newest",
  });

  useEffect(() => {
    if (!user) navigate("/");
    else loadMovies();
  }, [user]);

  useEffect(() => {
    const params = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params[key] = filters[key];
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  useEffect(() => {
    loadMovies();
  }, [filters]);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const res = await api.get("/movies/all");
      let filtered = res.data.movies;

      if (filters.title)
        filtered = filtered.filter((m) =>
          m.title.toLowerCase().includes(filters.title.toLowerCase())
        );
      if (filters.director)
        filtered = filtered.filter((m) =>
          m.director.toLowerCase().includes(filters.director.toLowerCase())
        );
      if (filters.type)
        filtered = filtered.filter(
          (m) => m.type.toLowerCase() === filters.type.toLowerCase()
        );
      if (filters.status)
        filtered = filtered.filter(
          (m) => m.status.toLowerCase() === filters.status.toLowerCase()
        );
      if (filters.yearFrom)
        filtered = filtered.filter((m) => m.year >= Number(filters.yearFrom));
      if (filters.yearTo)
        filtered = filtered.filter((m) => m.year <= Number(filters.yearTo));

      if (filters.sort === "az") filtered.sort((a, b) => a.title.localeCompare(b.title));
      else if (filters.sort === "za") filtered.sort((a, b) => b.title.localeCompare(a.title));
      else if (filters.sort === "newest") filtered.sort((a, b) => b.year - a.year);
      else if (filters.sort === "oldest") filtered.sort((a, b) => a.year - b.year);

      setMovies(filtered);
    } catch (err) {
      console.error("Failed to load movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateMovieStatus = async (id, status) => {
    try {
      await api.patch(`/movies/${id}/status`, { status });
      setMovies((prev) =>
        prev.map((movie) => (movie.id === id ? { ...movie, status } : movie))
      );
    } catch (err) {
      console.error(`${status} failed:`, err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await api.delete(`/movies/${id}`);
      setMovies((prev) => prev.filter((movie) => movie.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Title"
          value={filters.title}
          onChange={(e) => setFilters({ ...filters, title: e.target.value })}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Search Director"
          value={filters.director}
          onChange={(e) => setFilters({ ...filters, director: e.target.value })}
          className="p-2 border border-gray-300 rounded"
        />
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Types</option>
          <option value="Movie">Movies</option>
          <option value="Tv Show">TV Shows</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
        <input
          type="number"
          placeholder="Year From"
          value={filters.yearFrom}
          onChange={(e) => setFilters({ ...filters, yearFrom: e.target.value })}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          placeholder="Year To"
          value={filters.yearTo}
          onChange={(e) => setFilters({ ...filters, yearTo: e.target.value })}
          className="p-2 border border-gray-300 rounded"
        />
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A–Z</option>
          <option value="za">Z–A</option>
        </select>
      </div>

      {/* Movies Table */}
      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border border-gray-300">Poster</th>
                <th className="p-2 border border-gray-300">Title</th>
                <th className="p-2 border border-gray-300">Type</th>
                <th className="p-2 border border-gray-300">Director</th>
                <th className="p-2 border border-gray-300">Year</th>
                <th className="p-2 border border-gray-300">Budget</th>
                <th className="p-2 border border-gray-300">Status</th>
                <th className="p-2 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id} className="hover:bg-gray-100">
                  <td className="p-2 border border-gray-300">
                    {movie.image && (
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="p-2 border border-gray-300">{movie.title}</td>
                  <td className="p-2 border border-gray-300">{movie.type}</td>
                  <td className="p-2 border border-gray-300">{movie.director}</td>
                  <td className="p-2 border border-gray-300">{movie.year}</td>
                  <td className="p-2 border border-gray-300">{movie.budget || "-"}</td>
                  <td className="p-2 border border-gray-300 capitalize">{movie.status}</td>
                  <td className="p-2 border border-gray-300 flex gap-2 flex-wrap">
                    <button
                      onClick={() => updateMovieStatus(movie.id, "approved")}
                      disabled={movie.status === "approved"}
                      className={`px-2 py-1 text-white rounded ${
                        movie.status === "approved"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateMovieStatus(movie.id, "rejected")}
                      disabled={movie.status === "rejected"}
                      className={`px-2 py-1 text-white rounded ${
                        movie.status === "rejected"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => setEditingMovie(movie)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="px-2 py-1 bg-red-700 text-white rounded hover:bg-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingMovie && (
        <EditEntryModal
          entry={editingMovie}
          onClose={() => setEditingMovie(null)}
          refreshEntries={loadMovies}
        />
      )}
    </div>
  );
}
