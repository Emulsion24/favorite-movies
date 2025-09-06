// src/pages/UserDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import useMovieStore from "../store/movieStore";
import EditEntryModal from "../components/EditEntryModal";
import EntryFormModal from "../components/EntryFormModal";

export default function UserDashboard() {
  const { user, logout } = useAuthStore();
  const {
    movies,
    usermovies,
    loading,
    fetchApprovedMovies,
    fetchUserMovies,
    removeMovie,
  } = useMovieStore();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [editingMovie, setEditingMovie] = useState(null);
  const [adding, setAdding] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("approved");

  const [filters, setFilters] = useState({
    title: searchParams.get("title") || "",
    director: searchParams.get("director") || "",
    type: searchParams.get("type") || "",
    yearFrom: searchParams.get("yearFrom") || "",
    yearTo: searchParams.get("yearTo") || "",
    sort: searchParams.get("sort") || "newest",
  });

  // ✅ Fetch data
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      
      fetchApprovedMovies();
      fetchUserMovies(user.id);
    }
  }, [user, fetchApprovedMovies, fetchUserMovies, navigate]);

  // ✅ Sync filters with URL
  useEffect(() => {
    const params = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params[key] = filters[key];
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // ✅ Filtering logic (safe with optional chaining)
  const filterMovies = (list = []) =>
    list
      .filter((m) =>
        filters.title
          ? (m.title || "").toLowerCase().includes(filters.title.toLowerCase())
          : true
      )
      .filter((m) =>
        filters.director
          ? (m.director || "")
              .toLowerCase()
              .includes(filters.director.toLowerCase())
          : true
      )
      .filter((m) =>
        filters.type
          ? (m.type || "").toLowerCase() === filters.type.toLowerCase()
          : true
      )
      .filter((m) =>
        filters.yearFrom
          ? parseInt(m.year || 0) >= parseInt(filters.yearFrom)
          : true
      )
      .filter((m) =>
        filters.yearTo
          ? parseInt(m.year || 0) <= parseInt(filters.yearTo)
          : true
      )
      .sort((a, b) => {
        switch (filters.sort) {
          case "oldest":
            return (a.year || 0) - (b.year || 0);
          case "az":
            return (a.title || "").localeCompare(b.title || "");
          case "za":
            return (b.title || "").localeCompare(a.title || "");
          default:
            return (b.year || 0) - (a.year || 0); // newest
        }
      });

  // ✅ Movie lists
  const approvedMovies = filterMovies(movies);
  const userMovies = usermovies || [];
  const moviesByStatus = (status) =>
   
      userMovies.filter(
        (m) => (m.status || "").toLowerCase() === status.toLowerCase()
      );
 

  // ✅ Delete movie
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await removeMovie(id);
      toast.success("Movie deleted successfully!");
      await fetchUserMovies();
    } catch (err) {
      toast.error("Failed to delete movie");
      console.error(err);
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          {viewProfile ? "Profile" : "Dashboard"}
        </h1>
        <div className="flex flex-wrap gap-3">
          {viewProfile && (
            <button
              onClick={() => setAdding(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              ➕ Add Movie/TV Show
            </button>
          )}
          {viewProfile && (
            <button
              onClick={() => setViewProfile(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              ⬅ Dashboard
            </button>
          )}
          {!viewProfile && (
            <button
              onClick={() => setViewProfile(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Profile
            </button>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard (Approved Movies) */}
      {!viewProfile ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <input
              type="text"
              placeholder="Title"
              value={filters.title}
              onChange={(e) => setFilters({ ...filters, title: e.target.value })}
              className="p-2 border border-gray-300 rounded-lg w-full md:w-1/5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Director"
              value={filters.director}
              onChange={(e) =>
                setFilters({ ...filters, director: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-lg w-full md:w-1/5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="p-2 border border-gray-300 rounded-lg w-full md:w-1/5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Type</option>
              <option value="Movie">Movie</option>
              <option value="TV Show">TV Show</option>
            </select>
            <input
              type="number"
              placeholder="Year From"
              value={filters.yearFrom}
              onChange={(e) =>
                setFilters({ ...filters, yearFrom: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-lg w-full md:w-1/5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Year To"
              value={filters.yearTo}
              onChange={(e) =>
                setFilters({ ...filters, yearTo: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-lg w-full md:w-1/5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="p-2 border border-gray-300 rounded-lg w-full md:w-1/5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="az">A–Z</option>
              <option value="za">Z–A</option>
            </select>
          </div>

          {/* Movies Table */}
          {loading ? (
            <p className="text-center text-gray-500">Loading movies...</p>
          ) : approvedMovies.length === 0 ? (
            <p className="text-center text-gray-500">No approved movies found.</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    {[
                      "Poster",
                      "Title",
                      "Type",
                      "Duration",
                      "Director",
                      "Year",
                      "Location",
                      "Budget",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2 border border-gray-300 text-left text-gray-600 uppercase text-xs tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {approvedMovies.map((movie) => (
                    <tr
                      key={movie.id}
                      className="hover:bg-gray-50 transition border border-gray-300"
                    >
                      <td className="px-4 py-2 border border-gray-300">
                        {movie.image && (
                          <img
                            src={movie.image}
                            alt={movie.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {movie.title}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {movie.type}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {movie.duration}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {movie.director}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {movie.year}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {movie.location || "-"}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {movie.budget || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Profile Section */}
          <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
            {/* Profile Info */}
            <table className="min-w-full border border-gray-300 text-sm mb-4">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  {["Field", "Details"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 border border-gray-300 text-left text-gray-600 uppercase text-xs tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Name", user.name],
                  ["Email", user.email]
                ].map(([field, value]) => (
                  <tr
                    key={field}
                    className="hover:bg-gray-50 transition border border-gray-300"
                  >
                    <td className="px-4 py-2 border border-gray-300 font-semibold">
                      {field}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Profile Tabs */}
            <div className="flex gap-2 mb-2">
              {["approved", "pending", "rejected"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded font-semibold transition ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Movies Table */}
            {loading ? (
              <p className="text-center text-gray-500">Loading movies...</p>
            ) : moviesByStatus(activeTab).length === 0 ? (
              <p className="text-center text-gray-500">
                No {activeTab} movies.
              </p>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                      {[
                        "Poster",
                        "Title",
                        "Type",
                        "Duration",
                        "Director",
                        "Year",
                        "Budget",
                        "Location",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-2 border border-gray-300 text-left text-gray-600 uppercase text-xs tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {moviesByStatus(activeTab).map((movie) => (
                      <tr
                        key={movie.id}
                        className="hover:bg-gray-50 transition border border-gray-300"
                      >
                        <td className="px-4 py-2 border border-gray-300">
                          {movie.image && (
                            <img
                              src={movie.image}
                              alt={movie.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          {movie.title}
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          {movie.type}
                        </td>
                          <td className="px-4 py-2 border border-gray-300">
                          {movie.duration}
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          {movie.director}
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          {movie.year}
                        </td>
                         <td className="px-4 py-2 border border-gray-300">
                          {movie.budget || "-"}
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          {movie.location || "-"}
                        </td>
                        <td className="px-4 py-2 border border-gray-300 flex gap-2 justify-center">
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
          </div>
        </>
      )}

      {/* Modals */}
      {editingMovie && (
        <EditEntryModal
          entry={editingMovie}
          onClose={() => setEditingMovie(null)}
          refreshEntries={() => fetchUserMovies(user.id)}
        />
      )}
      {adding && (
        <EntryFormModal
          onClose={() => setAdding(false)}
          refreshEntries={() => fetchUserMovies(user.id)}
        />
      )}
    </div>
  );
}
