import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";
import EntryRow from "./EntryRow";
import useAuthStore from "../store/authStore";

export default function EntriesTable() {
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  // 🔹 Persist filters/sort in URL
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "createdAt:desc";

  useEffect(() => {
    setEntries([]);
    setPage(1);
    setHasMore(true);
  }, [search, sort]);

  useEffect(() => {
    loadEntries(page);
    // eslint-disable-next-line
  }, [page, search, sort]);

  const loadEntries = async (currentPage) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await api.get(
        `/movies?page=${currentPage}&limit=10&search=${search}&sort=${sort}`
      );
      const newEntries = res.data.movies;

      setEntries((prev) =>
        currentPage === 1
          ? newEntries
          : [...prev, ...newEntries].filter(
              (v, i, a) => a.findIndex((t) => t.id === v.id) === i
            )
      );

      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error("Failed to fetch entries:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-white shadow rounded p-4">
      {/* 🔹 Search + Sort Controls */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title or director..."
          value={search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="border p-2 rounded w-64"
        />

        <select
          value={sort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="border p-2 rounded"
        >
          <option value="createdAt:desc">Newest</option>
          <option value="createdAt:asc">Oldest</option>
          <option value="title:asc">Title A-Z</option>
          <option value="title:desc">Title Z-A</option>
          <option value="director:asc">Director A-Z</option>
          <option value="director:desc">Director Z-A</option>
          <option value="year:asc">Year ↑</option>
          <option value="year:desc">Year ↓</option>
        </select>
      </div>

      {/* 🔹 Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Poster</th>
            <th className="p-2">Title</th>
            <th className="p-2">Type</th>
            <th className="p-2">Director</th>
            <th className="p-2">Year</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              canEdit={entry.userId === user.id}
              refreshEntries={() => loadEntries(1)}
            />
          ))}
        </tbody>
      </table>

      {/* 🔹 Pagination */}
      {hasMore && (
        <div className="text-center mt-4">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
