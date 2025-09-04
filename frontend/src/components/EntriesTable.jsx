// src/components/EntriesTable.jsx
import { useState, useEffect } from "react";
import api from "../utils/api";
import EntryRow from "./EntryRow";

export default function EntriesTable({ userId }) {
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadEntries();
    // eslint-disable-next-line
  }, [page]);

  const loadEntries = async () => {
    try {
      const res = await api.get(`/movies?page=${page}&limit=10`);
      setEntries((prev) => [...prev, ...res.data.movies]);
      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error("Failed to fetch entries:", err);
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
            <EntryRow key={entry.id} entry={entry} canEdit={entry.user_id === userId} />
          ))}
        </tbody>
      </table>

      {hasMore && (
        <div className="text-center mt-4">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
