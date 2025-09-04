// src/components/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import useAuthStore from "../store/authStore";
import EditEntryModal from "../components/EditEntryModal";

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null); // holds movie being edited

  useEffect(() => {
    if (!user) {
      navigate("/"); // redirect if not logged in
    } else {
      loadMovies();
    }
    // eslint-disable-next-line
  }, [user]);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const res = await api.get("/movies/all");
      setMovies(res.data.movies);
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
        prev.map((movie) =>
          movie.id === id ? { ...movie, status } : movie
        )
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

  const handleEdit = (movie) => {
    setSelectedMovie(movie); // set the movie to edit
    setShowEdit(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <table className="w-full border-collapse shadow rounded overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Poster</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Director</th>
              <th className="p-2 border">Year</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id} className="hover:bg-gray-100">
                <td className="p-2 border">
                  <img src={movie.image} alt={movie.title} className="w-16" />
                </td>
                <td className="p-2 border">{movie.title}</td>
                <td className="p-2 border">{movie.type}</td>
                <td className="p-2 border">{movie.director}</td>
                <td className="p-2 border">{movie.year}</td>
                <td className="p-2 border">{movie.status}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => updateMovieStatus(movie.id, "approved")}
                    disabled={movie.status === "approved"}
                    className={`px-2 py-1 text-white rounded ${
                      movie.status === "approved"
                        ? "bg-gray-400"
                        : "bg-green-500 cursor-pointer"
                    }`}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateMovieStatus(movie.id, "rejected")}
                    disabled={movie.status === "rejected"}
                    className={`px-2 py-1 text-white rounded ${
                      movie.status === "rejected"
                        ? "bg-gray-400"
                        : "bg-red-500 cursor-pointer"
                    }`}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDelete(movie.id)}
                    className="px-2 py-1 bg-red-700 text-white rounded cursor-pointer"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEdit(movie)}
                    className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showEdit && selectedMovie && (
        <EditEntryModal
          entry={selectedMovie}
          onClose={() => setShowEdit(false)}
          refreshEntries={loadMovies} // reload updated movie list
        />
      )}
    </div>
  );
}
