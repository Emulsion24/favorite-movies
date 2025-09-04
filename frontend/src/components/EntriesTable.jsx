// src/components/EntriesTable.jsx
import { useState, useEffect } from "react";
import api from "../utils/api";
import EntryRow from "./EntryRow";
import useAuthStore from "../store/authStore";
export default function EntriesTable({ userId }) {
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    loadEntries(page);
    // eslint-disable-next-line
  }, [page]);

  const loadEntries = async (currentPage) => {
    if (loading) return; // prevent duplicate requests
    setLoading(true);

    try {
      const res = await api.get(`/movies?page=${currentPage}&limit=10`);
      console.log(res.error)
      const newEntries = res.data.movies;

      // Deduplicate by id
      setEntries((prev) => {
        const combined = [...prev, ...newEntries];
        const unique = Array.from(new Map(combined.map((e) => [e.id, e])).values());
        return unique;
      });

      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error("Failed to fetch entries:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded p-4">
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
              key={entry.id} // unique key by id
              entry={entry}
              canEdit={entry.userId === user.id}
            />
          ))}
        </tbody>
      </table>

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
