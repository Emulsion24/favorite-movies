import { useState } from "react";
import api from "../utils/api";
import EditEntryModal from "./EditEntryModal"; // Create this component

export default function EntryRow({ entry, canEdit, refreshEntries }) {
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await api.delete(`/movies/${entry.id}`);
      refreshEntries(); // Call parent to refresh table
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEdit = () => {
    setShowEdit(true);
  };

  return (
    <>
      <tr className="border-b">
        <td className="p-2">
          {entry.image && (
            <img
              src={entry.image}
              alt={entry.title}
              className="h-12 w-12 object-cover rounded"
            />
          )}
        </td>
        <td className="p-2">{entry.title}</td>
        <td className="p-2">{entry.type}</td>
        <td className="p-2">{entry.director}</td>
        <td className="p-2">{entry.year}</td>
        <td className="p-2">
          {entry.status === "approved" ? (
            <span className="text-green-600">Approved</span>
          ) : entry.status === "rejected" ? (
            <span className="text-red-600">Rejected</span>
          ) : (
            <span className="text-yellow-600">Pending</span>
          )}
        </td>
        <td className="p-2">
          {canEdit && (
            <>
              <button onClick={handleEdit} className="text-blue-600 mr-2 cursor-pointer">
                Edit
              </button>
              <button onClick={handleDelete} className="text-red-600  cursor-pointer">
                Delete
              </button>
            </>
          )}
        </td>
      </tr>

      {/* Edit Modal */}
      {showEdit && (
        <EditEntryModal
          entry={entry}
          onClose={() => setShowEdit(false)}
          refreshEntries={refreshEntries}
        />
      )}
    </>
  );
}
